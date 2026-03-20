'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WhiteNav from "../whitenav";
import '../home.css';
import './storelocator.css';

function parseTimeStringToHHMM(timeStr) {
  // Google Places API returns periods as 4-digit 24h strings e.g. "0700", "2230"
  if (/^\d{4}$/.test(timeStr)) {
    return parseInt(timeStr, 10); // "0700" -> 700, "2230" -> 2230
  }
  // Fallback: handle "7:00 AM" / "10:30 PM" format just in case
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 100 + minutes;
}

function checkIsOpen(openingHours) {
  if (!openingHours || !openingHours.periods) return null;

  // Always use the current device local time
  const now = new Date();
  const day = now.getDay();                           // Sunday = 0 … Saturday = 6
  const nowTime = now.getHours() * 100 + now.getMinutes(); // e.g. 14:35 → 1435

  for (let period of openingHours.periods) {
    // 24-hour open (no close period)
    if (!period.close) return true;

    const openDay   = period.open.day;
    const closeDay  = period.close.day;
    const openTime  = parseTimeStringToHHMM(period.open.time);
    const closeTime = parseTimeStringToHHMM(period.close.time);

    if (openDay === closeDay) {
      // Same-day period (no overnight)
      if (day === openDay && nowTime >= openTime && nowTime < closeTime) return true;
    } else {
      // Overnight period: spans midnight into the next day
      if (day === openDay && nowTime >= openTime) return true;
      if (day === closeDay && nowTime < closeTime) return true;
    }
  }

  return false;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const TABS = ["Pickup", "Delivery"];

const FILTERS = {
  storeHours: [
    { id: "open_now", label: "Open Now" },
    { id: "open_24", label: "Open 24 hours per day" },
  ],
  orderOptions: [
    { id: "order_ahead", label: "Order ahead" },
    { id: "order_ahead_no_account", label: "Order ahead without account" },
    { id: "in_store", label: "In store" },
    { id: "drive_thru", label: "Drive-Thru" },
  ],
  amenities: [
    { id: "cafe_seating", label: "Cafe Seating" },
    { id: "wifi", label: "Starbucks Wi-Fi" },
    { id: "redeem_rewards", label: "Redeem Rewards" },
    { id: "nitro_cold_brew", label: "Nitro Cold Brew" },
    { id: "outdoor_seating", label: "Outdoor Seating" },
    { id: "drive_thru_amenity", label: "Drive-Thru" },
    { id: "mobile_order", label: "Mobile Order & Pay" },
  ],
};

function loadGoogleMaps(apiKey) {
  return new Promise(function (resolve, reject) {
    if (window.google && window.google.maps) { resolve(window.google.maps); return; }
    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places";
    script.async = true;
    script.defer = true;
    script.onload = function () { resolve(window.google.maps); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function getDistanceMiles(lat1, lng1, lat2, lng2) {
  var R = 3958.8;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

function fetchNearbyStarbucks(lat, lng, userLat, userLng, radius) {
  if (!radius) radius = 5000;
  return new Promise(function (resolve) {
    var service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.nearbySearch({ location: { lat: lat, lng: lng }, radius: radius, name: "Starbucks" }, function (results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        var stores = results
          .filter(function (p) { return p.name.toLowerCase().includes("starbucks"); })
          .map(function (p) {
            var storeLat = p.geometry.location.lat();
            var storeLng = p.geometry.location.lng();
            var distance = (userLat != null && userLng != null)
              ? getDistanceMiles(userLat, userLng, storeLat, storeLng)
              : null;
            // Prefer our device-clock check; fall back to API open_now when periods absent
            var isOpenValue = null;
            if (p.opening_hours) {
              var fromPeriods = checkIsOpen(p.opening_hours);
              if (fromPeriods !== null) {
                isOpenValue = fromPeriods;
              } else if (typeof p.opening_hours.open_now === 'boolean') {
                isOpenValue = p.opening_hours.open_now;
              }
            }
            return {
              id: p.place_id,
              name: p.name,
              address: p.vicinity,
              lat: storeLat,
              lng: storeLng,
              isOpen: isOpenValue,
              openingHours: p.opening_hours || null,
              rating: p.rating,
              distance: distance,
              types: p.types || [],
            };
          });
        stores.sort(function (a, b) {
          if (a.distance != null && b.distance != null) return parseFloat(a.distance) - parseFloat(b.distance);
          return 0;
        });
        resolve(stores);
      } else {
        resolve([]);
      }
    });
  });
}

function fetchPlaceDetails(placeId) {
  return new Promise(function (resolve) {
    var service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails(
      { placeId: placeId, fields: ["name", "formatted_address", "opening_hours", "types", "geometry", "place_id", "rating", "vicinity"] },
      function (place, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          resolve(null);
        }
      }
    );
  });
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="#1e3932"
        strokeWidth="1.8"
        fill={filled ? "#cc0000" : "none"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#1e3932" strokeWidth="1.8" />
      <line x1="12" y1="8" x2="12" y2="8" stroke="#1e3932" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="11" x2="12" y2="16" stroke="#1e3932" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClosedPickupModal({ store, onClose }) {
  return (
    <div className="sl-modal-overlay" onClick={onClose}>
      <div
        className="sl-modal sl-modal--closed"
        onClick={function (e) { e.stopPropagation(); }}
        style={{
          padding: "48px 36px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          maxWidth: "370px",
          height: "150px",
          width: "90%",
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >

        {/* Title */}
        <h2 style={{
          margin: "0 0 12px",
          marginTop: "-10px",
          fontSize: "20px",
          fontWeight: "800",
          color: "#1e3932",
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}>
          Store Currently Closed
        </h2>

        {/* Body */}
        <p style={{
          margin: "0 0 8px",
          fontSize: "14px",
          color: "#555",
          lineHeight: 1.75,
          maxWidth: "460px",
        }}>
          Pickup from <strong style={{ color: "#1e3932" }}>{store.name}</strong> is not available at this hour.
        </p>
        <p style={{
         margin: 0,
          fontSize: "13px",
          color: "#888",
          lineHeight: 1,
        }}>
          Please choose a different store or check back during opening hours.
        </p>

      </div>
    </div>
  );
}

function SignInModal({ onCancel, onSignIn }) {
  return (
    <div className="sl-modal-overlay" onClick={onCancel}>
      <div className="sl-modal" onClick={function (e) { e.stopPropagation(); }}>
        <p className="sl-modal-text">You must sign in to add this store to your favorites.</p>
        <div className="sl-modal-actions">
          <button className="sl-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="sl-modal-signin" onClick={onSignIn}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

function RebuildModal({ onCancel, onContinue }) {
  return (
    <div className="sl-modal-overlay" onClick={onCancel}>
      <div className="sl-modal sl-modal--rebuild" onClick={function (e) { e.stopPropagation(); }}>
        <div className="sl-modal-rebuild-content">
          <h2 className="sl-modal-rebuild-title">
            You'll need to rebuild your order for delivery
          </h2>
          <p className="sl-modal-rebuild-desc">
            Items currently in your bag will need to be re-added.
            Delivery menu availability may vary.
          </p>
          <div className="sl-modal-rebuild-actions">
            <button className="sl-modal-nevermind" onClick={onCancel}>
              Nevermind
            </button>
            <button className="sl-modal-continue" onClick={onContinue}>
              Continue
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "6px" }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="15 3 21 3 21 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="10" y1="14" x2="21" y2="3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ADDITION 1: Location Permission Modal component ── */
function LocationPermissionModal({ onAllow, onDeny }) {
  return (
    <div className="sl-modal-overlay" onClick={onDeny}>
      <div className="sl-modal sl-modal--rebuild" onClick={function (e) { e.stopPropagation(); }}>
        <div className="sl-modal-rebuild-content">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1e3932" />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
            <h2 className="sl-modal-rebuild-title" style={{ margin: 0 }}>
              Use your location?
            </h2>
          </div>
          <p className="sl-modal-rebuild-desc">
            Starbucks would like to use your current location to find nearby stores.
            Your browser may ask you to confirm this permission.
          </p>
          <div className="sl-modal-rebuild-actions">
            <button className="sl-modal-nevermind" onClick={onDeny}>
              Deny
            </button>
            <button className="sl-modal-continue" onClick={onAllow}>
              Allow location
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "6px" }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" />
                <circle cx="12" cy="9" r="2.5" fill="#00704a" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Store Saved Success Banner ── */
function StoreSavedBanner({ store, onContinue, onChange }) {
  return (
    <div className="sl-saved-banner">
      <div className="sl-saved-banner-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#00a862" />
          <polyline points="7 12 10 15 17 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="sl-saved-banner-body">
        <div className="sl-saved-banner-title">Store Selected</div>
        <div className="sl-saved-banner-name">{store.name}</div>
        <div className="sl-saved-banner-addr">{store.address}</div>
      </div>
      <div className="sl-saved-banner-actions">
        <button className="sl-saved-change-btn" onClick={onChange}>Change</button>
        <button className="sl-saved-continue-btn" onClick={onContinue}>
          Continue ordering
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "6px" }}>
            <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function StoreDetailPanel({ store, onClose, onSave, isSaved, onDetailsLoaded }) {
  var [details, setDetails] = useState(null);
  var [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(function () {
    setLoadingDetails(true);
    fetchPlaceDetails(store.id).then(function (place) {
      setDetails(place);
      setLoadingDetails(false);
      // Compute authoritative isOpen from detailed periods and notify parent
      if (place && place.opening_hours) {
        var resolved = checkIsOpen(place.opening_hours);
        if (resolved === null && typeof place.opening_hours.open_now === 'boolean') {
          resolved = place.opening_hours.open_now;
        }
        // Pass full opening_hours so the list can recompute using periods
        if (onDetailsLoaded) onDetailsLoaded(store.id, resolved, place.opening_hours);
      }
    });
  }, [store.id]);

  var mapsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + store.lat + "," + store.lng;
  var isOpen = null;
  var weekdayText = null;

  if (details && details.opening_hours) {
    // Always use device-local time
    isOpen = checkIsOpen(details.opening_hours);
    weekdayText = details.opening_hours.weekday_text || null;
  } else if (store.openingHours) {
    isOpen = checkIsOpen(store.openingHours);
    weekdayText = store.openingHours.weekday_text || null;
  } else {
    isOpen = store.isOpen;
  }

  var statusText = isOpen === true ? "Open Now" : "Closed";
  var statusClass = isOpen === true ? "sl-detail-status--open" : "sl-detail-status--closed";
  var displayAddress = (details && details.formatted_address) ? details.formatted_address : store.address;
  var displayName = (details && details.name) ? details.name : store.name;

  return (
    <div className="sl-detail-panel">
      <div className="sl-detail-header" style={{ position: "relative", paddingRight: "52px" }}>
        <button className="sl-detail-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="#444" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="#444" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {loadingDetails ? (
          <div style={{ padding: "20px 0", color: "#767676", fontSize: "14px" }}>Loading store details...</div>
        ) : (
          <>
            <div className={"sl-detail-status " + statusClass}>
              <span style={{ marginRight: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill={isOpen ? "#00a862" : "#f0ad00"} />
                  {isOpen ? (
                    <polyline points="7 12 10 15 17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <>
                      <line x1="12" y1="7" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="16.5" r="1" fill="white" />
                    </>
                  )}
                </svg>
              </span>
              <span>{statusText}</span>
            </div>
            <h2 className="sl-detail-name">{displayName}</h2>
            <div className="sl-detail-address-row">
              <div className="sl-detail-address">{displayAddress}</div>
              {store.distance != null && (
                <div className="sl-detail-distance">{store.distance} m</div>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="sl-detail-directions-btn">
                Get Directions
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "6px" }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="15 3 21 3 21 9" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="10" y1="14" x2="21" y2="3" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              {/* Save / Select Store button in detail panel */}
              <button
                className={isSaved ? "sl-detail-save-btn sl-detail-save-btn--saved" : "sl-detail-save-btn"}
                onClick={() => onSave({ ...store, isOpen })}
              >
                {isSaved ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: "6px" }}>
                      <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Store Selected
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: "6px" }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#fff" />
                      <circle cx="12" cy="9" r="2.5" fill="#1e3932" />
                    </svg>
                    Order from this store
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="sl-detail-section">
        <h3 className="sl-detail-section-title">Store Hours</h3>
        <div className="sl-detail-section-body">
          {loadingDetails ? (
            <p className="sl-detail-section-text">Loading...</p>
          ) : weekdayText && weekdayText.length > 0 ? (
            weekdayText.map(function (line, i) {
              return <p key={i} className="sl-detail-section-text" style={{ marginBottom: "4px" }}>{line}</p>;
            })
          ) : (
            <>
              <p className="sl-detail-section-text">Store hours are not available</p>
              <p className="sl-detail-section-text">Schedule not available</p>
            </>
          )}
        </div>
      </div>

      <div className="sl-detail-section">
        <h3 className="sl-detail-section-title">Order &amp; Pick Up Options</h3>
        <div className="sl-detail-section-body">
          <p className="sl-detail-section-text">Store features not available</p>
        </div>
      </div>

      <div className="sl-detail-section">
        <h3 className="sl-detail-section-title">Amenities</h3>
        <div className="sl-detail-section-body">
          <p className="sl-detail-section-text">Store features not available</p>
        </div>
      </div>
    </div>
  );
}

/*
  Props accepted by StoreLocator:
  - onStoreSelect(store)  — called when user saves a store and clicks "Continue ordering"
  - savedStore            — currently saved store object (or null)
*/
export default function StoreLocator({ onStoreSelect, savedStore }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  var [currentUser, setCurrentUser] = useState(null);
  useEffect(function () {
    fetch('/api/auth/me')
      .then(function (r) { return r.json(); })
      .then(function (d) { setCurrentUser(d.user || null); })
      .catch(function () { setCurrentUser(null); });
  }, []);

  var [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab');
    return tab === 'Delivery' ? 'Delivery' : 'Pickup';
  });
  var [query, setQuery] = useState("");
  var [suggestions, setSuggestions] = useState([]);
  var [stores, setStores] = useState([]);
  var [selectedStore, setSelectedStore] = useState(null);
  var [detailStore, setDetailStore] = useState(null);
  var [pendingSavedStore, setPendingSavedStore] = useState(savedStore || null);
  var [showSavedBanner, setShowSavedBanner] = useState(false);
  var [showSignInModal, setShowSignInModal] = useState(false);
  var [showRebuildModal, setShowRebuildModal] = useState(false);
  var [closedModalStore, setClosedModalStore] = useState(null);
  var [showFilters, setShowFilters] = useState(false);
  var [activeFilters, setActiveFilters] = useState([]);
  var [mapZoom, setMapZoom] = useState(4);
  var [mapCenter, setMapCenter] = useState({ lat: 34.36103, lng: -96.329444 });
  var [mapsLoaded, setMapsLoaded] = useState(false);
  var [loading, setLoading] = useState(false);
  var [locationNotFound, setLocationNotFound] = useState(false);
  var [error, setError] = useState(null);
  var [userLocation, setUserLocation] = useState(null);
  var [hasSearched, setHasSearched] = useState(false);
  /* ── ADDITION 2: state for the location permission modal ── */
  var [showLocationModal, setShowLocationModal] = useState(false);
  var [favorites, setFavorites] = useState([]);

  var mapRef = useRef(null);
  var googleMapRef = useRef(null);
  var markersRef = useRef([]);
  var autocompleteServiceRef = useRef(null);
  var searchInputRef = useRef(null);
  var suppressSuggestionsRef = useRef(false);
  
  // Load favorites from localStorage when user changes
  useEffect(function () {
    if (currentUser?.id) {
      var raw = localStorage.getItem("sbux_favorites_" + currentUser.id);
      setFavorites(raw ? JSON.parse(raw) : []);
    } else {
      setFavorites([]);
    }
  }, [currentUser?.id]);

  useEffect(() => {
  // Restore pending cart item if a store was previously selected
  const savedStore = localStorage.getItem("selectedStore");
  const pendingItem = localStorage.getItem("pendingCartItem");

  if (savedStore && pendingItem) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push(JSON.parse(pendingItem));

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.removeItem("pendingCartItem");
  }
}, []);

  useEffect(function () {
    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then(function () {
        setMapsLoaded(true);
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      })
      .catch(function () { setError("Failed to load Google Maps. Check your API key."); });
  }, []);

  useEffect(function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, function () { });
    }
  }, []);

  useEffect(function () {
    if (!mapsLoaded || !mapRef.current || googleMapRef.current) return;
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: mapCenter, zoom: mapZoom, disableDefaultUI: true, zoomControl: true,
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#a5d8dd" }] },
        { featureType: "landscape", stylers: [{ color: "#f2efe9" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#b0c4b1" }] },
      ]
    });
    googleMapRef.current.addListener("zoom_changed", function () { setMapZoom(googleMapRef.current.getZoom()); });
    googleMapRef.current.addListener("center_changed", function () {
      var c = googleMapRef.current.getCenter();
      setMapCenter({ lat: c.lat(), lng: c.lng() });
    });
  }, [mapsLoaded]);

  useEffect(function () {
    if (!googleMapRef.current || !mapsLoaded) return;
    markersRef.current.forEach(function (m) { m.setMap(null); });
    markersRef.current = [];
    stores.forEach(function (store) {
      var isPending = pendingSavedStore && pendingSavedStore.id === store.id;
      var marker = new window.google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        map: googleMapRef.current,
        title: store.name,
        icon: isPending
          ? { url: "https://www.starbucks.com/favicon.ico", scaledSize: new window.google.maps.Size(36, 36) }
          : { url: "https://www.starbucks.com/favicon.ico", scaledSize: new window.google.maps.Size(28, 28) },
      });
      marker.addListener("click", function () { setSelectedStore(store); });
      markersRef.current.push(marker);
    });
  }, [stores, mapsLoaded, pendingSavedStore]);

  useEffect(function () {
    if (suppressSuggestionsRef.current) { suppressSuggestionsRef.current = false; return; }
    if (!autocompleteServiceRef.current || query.length < 1) { setSuggestions([]); return; }
    autocompleteServiceRef.current.getPlacePredictions({ input: query }, function (predictions, status) {
      if (suppressSuggestionsRef.current) return;
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    });
  }, [query]);

  var userLat = userLocation ? userLocation.lat : null;
  var userLng = userLocation ? userLocation.lng : null;

  function doSearch(lat, lng, uLat, uLng) {
    googleMapRef.current.setCenter({ lat: lat, lng: lng });
    googleMapRef.current.setZoom(13);
    fetchNearbyStarbucks(lat, lng, uLat, uLng).then(function (nearby) {
      // Show list immediately with whatever isOpen we have
      setStores(nearby);
      setLoading(false);
      setHasSearched(true);
      setLocationNotFound(false);

      // Fetch full details for every store in parallel to get opening_hours.periods,
      // so checkIsOpen (device clock) replaces the unreliable open_now fallback.
      // This ensures the list status always matches the detail panel.
      nearby.forEach(function (store) {
        fetchPlaceDetails(store.id).then(function (place) {
          if (!place || !place.opening_hours) return;
          var resolved = checkIsOpen(place.opening_hours);
          if (resolved === null && typeof place.opening_hours.open_now === 'boolean') {
            resolved = place.opening_hours.open_now;
          }
          setStores(function (prev) {
            return prev.map(function (s) {
              if (s.id !== store.id) return s;
              return { ...s, isOpen: resolved, openingHours: place.opening_hours };
            });
          });
        });
      });
    });
  }

  var searchLocation = useCallback(function (placeId, description) {
    if (!mapsLoaded) return;
    suppressSuggestionsRef.current = true;
    setQuery(description);
    setSuggestions([]);
    setLoading(true);
    setError(null);
    setLocationNotFound(false);
    setHasSearched(false);
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: placeId }, function (results, status) {
      if (status === "OK" && results[0]) {
        var loc = results[0].geometry.location;
        doSearch(loc.lat(), loc.lng(), userLat, userLng);
      } else {
        setLoading(false);
        setLocationNotFound(true);
        setHasSearched(true);
        setStores([]);
      }
    });
  }, [mapsLoaded, userLat, userLng]);

  var handleSearchSubmit = useCallback(function (e) {
    e.preventDefault();
    if (!query.trim() || !mapsLoaded) return;
    suppressSuggestionsRef.current = true;
    setSuggestions([]);
    setLoading(true);
    setError(null);
    setLocationNotFound(false);
    setHasSearched(false);

    if (suggestions.length > 0) {
      var top = suggestions[0];
      setQuery(top.description);
      setSuggestions([]);
      var geocoder1 = new window.google.maps.Geocoder();
      geocoder1.geocode({ placeId: top.place_id }, function (results, status) {
        if (status === "OK" && results[0]) {
          var loc = results[0].geometry.location;
          doSearch(loc.lat(), loc.lng(), userLat, userLng);
        } else {
          setLoading(false);
          setLocationNotFound(true);
          setHasSearched(true);
          setStores([]);
        }
      });
    } else {
      var geocoder2 = new window.google.maps.Geocoder();
      geocoder2.geocode({ address: query }, function (results, status) {
        if (status === "OK" && results[0]) {
          var loc = results[0].geometry.location;
          doSearch(loc.lat(), loc.lng(), userLat, userLng);
        } else {
          setLoading(false);
          setLocationNotFound(true);
          setHasSearched(true);
          setStores([]);
        }
      });
    }
  }, [query, suggestions, mapsLoaded, userLat, userLng]);

  var handleUseMyLocation = useCallback(function () {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    setLoading(true);
    suppressSuggestionsRef.current = true;
    setSuggestions([]);
    setLocationNotFound(false);
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      setUserLocation({ lat: lat, lng: lng });
      if (googleMapRef.current) {
        googleMapRef.current.setCenter({ lat: lat, lng: lng });
        googleMapRef.current.setZoom(13);
      }
      fetchNearbyStarbucks(lat, lng, lat, lng).then(function (nearby) {
        setStores(nearby);
        setLoading(false);
        setHasSearched(true);
        // Fetch full details in parallel for accurate device-clock status
        nearby.forEach(function (store) {
          fetchPlaceDetails(store.id).then(function (place) {
            if (!place || !place.opening_hours) return;
            var resolved = checkIsOpen(place.opening_hours);
            if (resolved === null && typeof place.opening_hours.open_now === 'boolean') {
              resolved = place.opening_hours.open_now;
            }
            setStores(function (prev) {
              return prev.map(function (s) {
                if (s.id !== store.id) return s;
                return { ...s, isOpen: resolved, openingHours: place.opening_hours };
              });
            });
          });
        });
      });
    }, function () { setError("Unable to retrieve your location."); setLoading(false); });
  }, []);

  function toggleFilter(id) {
    setActiveFilters(function (prev) {
      return prev.includes(id) ? prev.filter(function (f) { return f !== id; }) : prev.concat([id]);
    });
  }

  function applyFilters(storeList) {
    if (activeFilters.length === 0) return storeList;
    return storeList.filter(function (store) {
      var types = store.types || [];
      var nameLower = (store.name || "").toLowerCase();
      if (activeFilters.includes("open_now")) { if (store.isOpen !== true) return false; }
      if (activeFilters.includes("open_24")) {
        var wt = store.openingHours && store.openingHours.weekday_text;
        if (!wt || !wt.some(function (l) { return l.toLowerCase().includes("open 24 hours"); })) return false;
      }
      if (activeFilters.includes("drive_thru")) {
        var hasDriveThru = types.includes("meal_takeaway") || nameLower.includes("drive-thru") || nameLower.includes("drive thru");
        if (!hasDriveThru) return false;
      }
      if (activeFilters.includes("order_ahead") || activeFilters.includes("mobile_order")) {
        var isLicensed = nameLower.includes("airport") || nameLower.includes("terminal") || nameLower.includes("hospital") || nameLower.includes("safeway") || nameLower.includes("target") || nameLower.includes("kroger") || nameLower.includes("barnes") || types.includes("grocery_or_supermarket") || types.includes("department_store") || types.includes("book_store");
        if (isLicensed) return false;
      }
      if (activeFilters.includes("order_ahead_no_account")) {
        var isLicensed2 = nameLower.includes("airport") || nameLower.includes("terminal") || nameLower.includes("hospital") || types.includes("grocery_or_supermarket") || types.includes("department_store");
        if (isLicensed2) return false;
      }
      if (activeFilters.includes("in_store")) {
        var isDineIn = types.includes("cafe") || types.includes("restaurant") || types.includes("food");
        if (!isDineIn) return false;
      }
      if (activeFilters.includes("cafe_seating") || activeFilters.includes("outdoor_seating")) {
        var hasCafe = types.includes("cafe") || types.includes("restaurant") || types.includes("food");
        if (!hasCafe) return false;
      }
      if (activeFilters.includes("wifi")) {
        var noWifi = nameLower.includes("airport") || nameLower.includes("hospital") || types.includes("grocery_or_supermarket");
        if (noWifi) return false;
      }
      if (activeFilters.includes("redeem_rewards")) {
        var noRewards = types.includes("grocery_or_supermarket") || types.includes("department_store") || nameLower.includes("safeway") || nameLower.includes("target") || nameLower.includes("kroger");
        if (noRewards) return false;
      }
      if (activeFilters.includes("nitro_cold_brew")) {
        var noNitro = nameLower.includes("kiosk") || types.includes("grocery_or_supermarket") || types.includes("department_store");
        if (noNitro) return false;
      }
      return true;
    });
  }

  /* ── Toggle a store as favorite ── */
  function handleToggleFavorite(e, store) {
    e.stopPropagation();
    if (!currentUser?.id) {
      setShowSignInModal(true);
      return;
    }
    var key = "sbux_favorites_" + currentUser.id;
    var updated = favorites.some(function (f) { return f.id === store.id; })
      ? favorites.filter(function (f) { return f.id !== store.id; })
      : favorites.concat(store);
    setFavorites(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  }

  /* ── Save a store (from list row quick-save or detail panel) ── */
function handleSaveStore(store) {
  // Compute the authoritative open status using device clock
  var periodsCheck = store.openingHours ? checkIsOpen(store.openingHours) : null;
  var effectiveIsOpen = periodsCheck !== null ? periodsCheck : store.isOpen;

  // If store is explicitly closed, show the closed pickup modal instead
  if (effectiveIsOpen === false) {
    setClosedModalStore(store);
    return;
  }

  setPendingSavedStore(store);
  setDetailStore(null);
  setShowSavedBanner(true);

  // SAVE STORE GLOBALLY
  localStorage.setItem("selectedStore", JSON.stringify(store));

  // If an item was waiting to be added to cart
  const pendingItem = localStorage.getItem("pendingCartItem");

  if (pendingItem) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(JSON.parse(pendingItem));

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.removeItem("pendingCartItem");
  }

  // Center map
  if (googleMapRef.current) {
    googleMapRef.current.setCenter({ lat: store.lat, lng: store.lng });
    googleMapRef.current.setZoom(15);
  }
}

  /* ── "Continue ordering" — notify parent and navigate back ── */
function handleContinueOrdering() {
  if (pendingSavedStore) {
    localStorage.setItem("selectedStore", JSON.stringify(pendingSavedStore));
  }

  if (pendingSavedStore && onStoreSelect) {
    onStoreSelect(pendingSavedStore);
  }

  const postAction = localStorage.getItem('postStoreAction');
  if (postAction === 'proceedToPayment') {
    localStorage.removeItem('postStoreAction');
    const pendingDrink = JSON.parse(localStorage.getItem('pendingOrderDrink') || 'null');
    if (pendingDrink) {
      const item = {
        id: Date.now(),
        drinkId: pendingDrink.id,
        name: pendingDrink.name,
        size: 'Grande',
        qty: 1,
      };
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('checkoutCart', JSON.stringify(cart));
      const total = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
      localStorage.setItem('checkoutTotal', JSON.stringify(total));
      localStorage.removeItem('pendingOrderDrink');
      window.dispatchEvent(new Event('cartUpdated'));
    }
    router.push('/payment');
    return;
  }

  router.back();
}

  var filteredStores = applyFilters(stores);
  var isZoomedOut = mapZoom < 10;

  return (
    <div className="sl-root">
      <WhiteNav activePage="store-locator" />

      {/* Saved store banner — shown after selecting a store */}
      {showSavedBanner && pendingSavedStore && activeTab === "Pickup" && (
        <StoreSavedBanner
          store={pendingSavedStore}
          onContinue={handleContinueOrdering}
          onChange={() => { setShowSavedBanner(false); setPendingSavedStore(null); }}
        />
      )}

      <div className="sl-container">
        <div className="sl-sidebar">
          <div className="sl-tabs">
            {TABS.map(function (tab) {
              return (
                <button key={tab} className={"sl-tab" + (activeTab === tab ? " sl-tab--active" : "")} onClick={function () { setActiveTab(tab); }}>{tab}</button>
              );
            })}
          </div>

          {activeTab === "Delivery" ? (
            <div className="sl-delivery-content">
              <div className="sl-delivery-text-wrap">
                <h1 className="sl-delivery-title">Today deserves delivery</h1>
                <p className="sl-delivery-subtitle">
                  Enjoy Starbucks delivery powered by DoorDash. For additional help, visit{" "}
                  <a href="https://customerservice.starbucks.com/app/answers/detail/a_id/3508" target="_blank" rel="noopener noreferrer" className="sl-delivery-link">Delivery FAQs</a>.
                </p>
                <button className="sl-delivery-btn" onClick={function () { setShowRebuildModal(true); }}>
                  Get started
                </button>
                <p className="sl-delivery-disclaimer">Menu limited. Menu pricing for delivery may be higher than posted in stores or as marked. Additional fees may apply. Delivery orders are not eligible for Starbucks Rewards benefits at this time.</p>
              </div>
            </div>
          ) : detailStore ? (
            <StoreDetailPanel
              store={detailStore}
              onClose={function () { setDetailStore(null); }}
              onSave={handleSaveStore}
              isSaved={pendingSavedStore && pendingSavedStore.id === detailStore.id}
              onDetailsLoaded={function (storeId, resolvedIsOpen, resolvedOpeningHours) {
                setStores(function (prev) {
                  return prev.map(function (s) {
                    if (s.id !== storeId) return s;
                    // Merge full openingHours (with periods) so the list badge
                    // uses checkIsOpen(periods) — same source as the detail panel
                    return {
                      ...s,
                      isOpen: resolvedIsOpen,
                      openingHours: resolvedOpeningHours || s.openingHours,
                    };
                  });
                });
              }}
            />
          ) : (
            <>
              <form className="sl-search-row" onSubmit={handleSearchSubmit}>
                <div className="sl-search-input-wrap">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="sl-search-input"
                    placeholder="Find a store"
                    value={query}
                    onChange={function (e) {
                      setQuery(e.target.value);
                      setLocationNotFound(false);
                      setHasSearched(false);
                    }}
                    autoComplete="off"
                  />
                  <button type="submit" className="sl-search-icon" aria-label="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="#1e3932" strokeWidth="2" />
                      <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  {suggestions.length > 0 && (
                    <ul className="sl-suggestions">
                      {suggestions.map(function (s) {
                        return (
                          <li key={s.place_id} className="sl-suggestion-item" onClick={function () { searchLocation(s.place_id, s.description); }}>
                            <span className="sl-suggestion-pin">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1e3932" />
                                <circle cx="12" cy="9" r="2.5" fill="white" />
                              </svg>
                            </span>
                            <span className="sl-suggestion-main">{s.structured_formatting ? s.structured_formatting.main_text : s.description}</span>
                            {s.structured_formatting && s.structured_formatting.secondary_text && (
                              <span className="sl-suggestion-secondary"> {s.structured_formatting.secondary_text}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  className={"sl-filter-btn" + (activeFilters.length > 0 ? " sl-filter-btn--active" : "")}
                  onClick={function () { setShowFilters(true); }}
                >
                  Filter{activeFilters.length > 0 ? " (" + activeFilters.length + ")" : ""}
                </button>
              </form>

              {/* ── ADDITION 3: open modal on click instead of calling geolocation directly ── */}
              <button className="sl-use-location" onClick={function () { setShowLocationModal(true); }}>
                Use current location
              </button>

              <div className="sl-results">
                {loading && (
                  <div className="sl-loading">
                    <div className="sl-spinner" />
                    <span>Finding stores...</span>
                  </div>
                )}

                {!loading && error && (
                  <div className="sl-error">{error}</div>
                )}

                {!loading && !error && locationNotFound && (
                  <div className="sl-not-found">
                    <h2 className="sl-not-found-title">Whoops!</h2>
                    <p className="sl-not-found-desc">We couldn't find that location.<br />Please search again.</p>
                  </div>
                )}

                {!loading && !error && !locationNotFound && !hasSearched && isZoomedOut && stores.length === 0 && (
                  <div className="sl-zoomed-out">
                    <h2 className="sl-zoomed-title">Find a store</h2>
                    <p className="sl-zoomed-desc">Search by city, state, or zip code to find Starbucks stores near you.</p>
                  </div>
                )}

                {!loading && !error && !locationNotFound && stores.length > 0 && filteredStores.length === 0 && (
                  <div className="sl-zoomed-out">
                    <h2 className="sl-zoomed-title">No matching stores</h2>
                    <p className="sl-zoomed-desc">No stores match your current filters. Try adjusting or clearing filters.</p>
                  </div>
                )}

                {!loading && !error && !locationNotFound && filteredStores.length > 0 && (
                  <ul className="sl-store-list">
                    {filteredStores.map(function (store) {
                      var isSavedStore = pendingSavedStore && pendingSavedStore.id === store.id;
                      return (
                        <li
                          key={store.id}
                          className={
                            "sl-store-item" +
                            (selectedStore && selectedStore.id === store.id ? " sl-store-item--selected" : "") +
                            (isSavedStore ? " sl-store-item--saved" : "")
                          }
                          onClick={function () {
                            setSelectedStore(store);
                            if (googleMapRef.current) { googleMapRef.current.setCenter({ lat: store.lat, lng: store.lng }); }
                          }}
                        >
                          {isSavedStore && (
                            <div className="sl-store-saved-badge">✓ Selected for Pickup</div>
                          )}
                          <div className="sl-store-item-row">
                            <div className="sl-store-item-info">
                              <div className="sl-store-name">{store.name}</div>
                              <div className="sl-store-address">{store.address}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px", flexWrap: "wrap" }}>
                                {(() => {
                                  // Always prefer device-clock check with periods; fall back to stored isOpen
                                  var periodsCheck = store.openingHours ? checkIsOpen(store.openingHours) : null;
                                  var displayOpen = periodsCheck !== null ? periodsCheck : store.isOpen;
                                  return (
                                    <>
                                      {displayOpen === true && (
                                        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "700", color: "#00a862", letterSpacing: "0.01em" }}>
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#00a862" />
                                            <polyline points="7 12 10 15 17 9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                          Open Now
                                        </span>
                                      )}
                                      {displayOpen === false && (
                                        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "700", color: "#b00020", letterSpacing: "0.01em" }}>
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" fill="#c0392b" />
                                            <line x1="12" y1="7" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <circle cx="12" cy="16.5" r="1" fill="white" />
                                          </svg>
                                          Closed
                                        </span>
                                      )}
                                    </>
                                  );
                                })()}
                                {store.distance != null && (
                                  <span style={{ fontSize: "12px", color: "#767676" }}>{store.distance} m </span>
                                )}
                              </div>
                            </div>
                            <div className="sl-store-item-actions">
                              <button
                                className="sl-action-btn sl-action-btn--heart"
                                aria-label={favorites.some(function (f) { return f.id === store.id; }) ? "Remove from favorites" : "Add to favorites"}
                                onClick={function (e) { handleToggleFavorite(e, store); }}
                              >
                                <HeartIcon filled={favorites.some(function (f) { return f.id === store.id; })} />
                              </button>
                              <button
                                className="sl-action-btn sl-action-btn--info"
                                aria-label="Store information"
                                onClick={function (e) { e.stopPropagation(); setDetailStore(store); }}
                              >
                                <InfoIcon />
                              </button>
                            </div>
                          </div>
                          {/* Quick "Order from here" button on each list row */}
                          <button
                            className={isSavedStore ? "sl-store-order-btn sl-store-order-btn--selected" : "sl-store-order-btn"}
                            onClick={function (e) { e.stopPropagation(); handleSaveStore(store); }}
                          >
                            {isSavedStore ? (
                              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Store selected for pickup
                              </span>
                            ) : "Order from this store"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="sl-sidebar-footer">
                <a href="" className="sl-footer-link" target="_blank" rel="noopener noreferrer">Privacy Notice
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "4px" }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="15 3 21 3 21 9" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="10" y1="14" x2="21" y2="3" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="" className="sl-footer-link" target="_blank" rel="noopener noreferrer">Terms of Use
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "4px" }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="15 3 21 3 21 9" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="10" y1="14" x2="21" y2="3" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="" className="sl-footer-link" target="_blank" rel="noopener noreferrer">Do Not Share My Personal Information
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "4px" }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="15 3 21 3 21 9" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="10" y1="14" x2="21" y2="3" stroke="#1e3932" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </>
          )}
        </div>

        <div className="sl-map-wrap">
          <div ref={mapRef} className="sl-map" />
          {!mapsLoaded && <div className="sl-map-loading"><div className="sl-spinner sl-spinner--large" /></div>}
          {activeTab === "Delivery" && (
            <div className="sl-delivery-hero">
              <img
                src="/images/deliveryhero.png"
                alt="Starbucks Delivery"
                className="sl-delivery-hero-img"
                onError={function (e) { e.target.style.display = "none"; }}
              />
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="sl-filters-overlay" onClick={function () { setShowFilters(false); }}>
          <div className="sl-filters-panel" onClick={function (e) { e.stopPropagation(); }}>
            <div className="sl-filters-header">
              <h2 className="sl-filters-title">Filters</h2>
              <button className="sl-filters-close" onClick={function () { setShowFilters(false); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="#444" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke="#444" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="sl-filters-body">
              <div className="sl-filter-section">
                <h3 className="sl-filter-section-title">STORE HOURS</h3>
                {FILTERS.storeHours.map(function (f) {
                  return <FilterRow key={f.id} filter={f} active={activeFilters.includes(f.id)} onToggle={toggleFilter} />;
                })}
              </div>
              <div className="sl-filter-section">
                <h3 className="sl-filter-section-title">ORDER &amp; PICK UP OPTIONS</h3>
                {FILTERS.orderOptions.map(function (f) {
                  return <FilterRow key={f.id} filter={f} active={activeFilters.includes(f.id)} onToggle={toggleFilter} />;
                })}
              </div>
              <div className="sl-filter-section">
                <h3 className="sl-filter-section-title">AMENITIES</h3>
                {FILTERS.amenities.map(function (f) {
                  return <FilterRow key={f.id} filter={f} active={activeFilters.includes(f.id)} onToggle={toggleFilter} />;
                })}
              </div>
            </div>
            <div className="sl-filters-footer">
              <button className="sl-filters-clear" onClick={function () { setActiveFilters([]); }}>Clear all</button>
              <button className="sl-filters-apply" onClick={function () { setShowFilters(false); }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {closedModalStore && (
        <ClosedPickupModal
          store={closedModalStore}
          onClose={function () { setClosedModalStore(null); }}
        />
      )}

      {showSignInModal && (
        <SignInModal
          onCancel={function () { setShowSignInModal(false); }}
          onSignIn={function () { setShowSignInModal(false); window.location.href = "/signin"; }}
        />
      )}

      {showRebuildModal && (
        <RebuildModal
          onCancel={function () { setShowRebuildModal(false); }}
          onContinue={function () {
            setShowRebuildModal(false);
            window.open('/store-locator/delivery', "_blank");
          }}
        />
      )}

      {/* ── ADDITION 4: render the location permission modal ── */}
      {showLocationModal && (
        <LocationPermissionModal
          onAllow={function () { setShowLocationModal(false); handleUseMyLocation(); }}
          onDeny={function () { setShowLocationModal(false); }}
        />
      )}
    </div>
  );
}

function FilterRow({ filter, active, onToggle }) {
  return (
    <button className={"sl-filter-row" + (active ? " sl-filter-row--active" : "")} onClick={function () { onToggle(filter.id); }}>
      <span className="sl-filter-label">{filter.label}</span>
      {active && (
        <span className="sl-filter-check">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <polyline points="20 6 9 17 4 12" stroke="#00a862" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  );
}