// app/api/stores/nearby/route.js
// GET /api/stores/nearby?lat=37.77&lng=-122.41

import { NextResponse } from 'next/server';

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapPlace(place, lat, lng) {
  const storeLat = place.geometry?.location?.lat ?? lat;
  const storeLng = place.geometry?.location?.lng ?? lng;
  const distKm   = haversineKm(lat, lng, storeLat, storeLng);
  return {
    id:          place.place_id,
    name:        place.name,
    rating:      place.rating             ?? null,
    reviewCount: place.user_ratings_total ?? 0,
    address:     place.formatted_address  ?? place.vicinity ?? '',
    isOpen:      place.opening_hours?.open_now ?? null,
    lat:         storeLat,
    lng:         storeLng,
    distKm:      Math.round(distKm * 10) / 10,
    distMi:      Math.round(distKm * 0.621371 * 10) / 10,
    photoRef:    place.photos?.[0]?.photo_reference ?? null,
  };
}

async function getCountryCode(lat, lng, key) {
  try {
    const url =
      `https://maps.googleapis.com/maps/api/geocode/json` +
      `?latlng=${lat},${lng}&result_type=country&key=${key}`;
    const data = await fetch(url, { cache: 'no-store' }).then(r => r.json());
    return data.results?.[0]?.address_components?.[0]?.short_name?.toLowerCase() ?? null;
  } catch { return null; }
}

// ── Strategy A: Nearby Search with rankby=distance (no radius cap, sorted by proximity)
async function nearbySearch(lat, lng, key) {
  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&rankby=distance` +
    `&keyword=starbucks` +
    `&key=${key}`;
  try {
    const data = await fetch(url, { cache: 'no-store' }).then(r => r.json());
    console.log('[nearby] nearbySearch status:', data.status, '| count:', data.results?.length ?? 0, '| error:', data.error_message ?? 'none');
    if (data.status === 'OK') return data.results;
    return null; // fall back for ZERO_RESULTS, REQUEST_DENIED, INVALID_REQUEST, etc.
  } catch (err) {
    console.error('[nearby] nearbySearch exception:', err?.message);
    return null;
  }
}

// ── Strategy B: Text Search — country-wide with region bias
async function textSearch(lat, lng, countryCode, key) {
  const region = countryCode ? `&region=${countryCode}` : '';
  const url =
    `https://maps.googleapis.com/maps/api/place/textsearch/json` +
    `?query=Starbucks+coffee` +
    `&location=${lat},${lng}` +
    region +
    `&key=${key}`;
  try {
    const data = await fetch(url, { cache: 'no-store' }).then(r => r.json());
    console.log('[nearby] textSearch status:', data.status, '| count:', data.results?.length ?? 0, '| error:', data.error_message ?? 'none');
    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') return data.results ?? [];
    return null;
  } catch (err) {
    console.error('[nearby] textSearch exception:', err?.message);
    return null;
  }
}

// ── Strategy C: Text Search with 50 km radius bias (broader fallback)
async function textSearchRadius(lat, lng, key) {
  const url =
    `https://maps.googleapis.com/maps/api/place/textsearch/json` +
    `?query=Starbucks` +
    `&location=${lat},${lng}` +
    `&radius=50000` +
    `&key=${key}`;
  try {
    const data = await fetch(url, { cache: 'no-store' }).then(r => r.json());
    console.log('[nearby] textSearchRadius status:', data.status, '| count:', data.results?.length ?? 0);
    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') return data.results ?? [];
    return null;
  } catch (err) {
    console.error('[nearby] textSearchRadius exception:', err?.message);
    return null;
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lng = parseFloat(searchParams.get('lng'));

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat and lng required.', stores: [] }, { status: 400 });
  }

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    console.warn('[nearby] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set.');
    return NextResponse.json({ stores: [], error: 'API key not configured.' });
  }

  try {
    const countryCode = await getCountryCode(lat, lng, key);
    console.log('[nearby] country:', countryCode, '| lat:', lat, '| lng:', lng);

    // Strategy A: Nearby Search (rankby=distance)
    let rawPlaces = await nearbySearch(lat, lng, key);

    // Strategy B: Text Search with country region bias
    if (!rawPlaces) {
      console.log('[nearby] falling back to textSearch');
      rawPlaces = await textSearch(lat, lng, countryCode, key);
    }

    // Strategy C: Text Search with radius
    if (!rawPlaces) {
      console.log('[nearby] falling back to textSearchRadius');
      rawPlaces = await textSearchRadius(lat, lng, key);
    }

    if (!rawPlaces) {
      console.warn('[nearby] all 3 strategies failed — check API key restrictions (HTTP referrer restriction blocks server-side calls)');
      return NextResponse.json({ stores: [], error: 'Could not reach Google Places API.' });
    }

    const stores = rawPlaces
      .filter(p => p.geometry?.location)
      .map(p => mapPlace(p, lat, lng))
      .sort((a, b) => a.distKm - b.distKm);

    console.log('[nearby] returning', stores.length, 'stores');
    return NextResponse.json({ stores });
  } catch (err) {
    console.error('[nearby] unhandled error:', err);
    return NextResponse.json({ stores: [], error: 'Failed to fetch stores.' }, { status: 500 });
  }
}
