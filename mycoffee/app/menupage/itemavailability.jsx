'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import './itemavailability.css';

// ── Cart context ──────────────────────────────────────────────────────────────
let _cartCount = 0;
const _listeners = new Set();

export function addToCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  _cartCount = cart.reduce((n, i) => n + (i.qty || 1), 0);
  _listeners.forEach(fn => fn(_cartCount));
}

export function useCartCount() {
  const [count, setCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce((n, i) => n + (i.qty || 1), 0);
  });

  useEffect(() => {
    // Subscribe to module-level listener (same-page updates)
    const listener = (val) => setCount(val);
    _listeners.add(listener);

    // Also listen to cartUpdated event fired by any page/component
    const onCartUpdated = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce((n, i) => n + (i.qty || 1), 0);
      _cartCount = total;
      setCount(total);
    };
    window.addEventListener("cartUpdated", onCartUpdated);

    return () => {
      _listeners.delete(listener);
      window.removeEventListener("cartUpdated", onCartUpdated);
    };
  }, []);

  return count;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ItemAvailability({ storeSelected, setStoreSelected, onBagClick }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [closing, setClosing] = useState(false);
  const [barVisible, setBarVisible] = useState(true);

  const cartCount = useCartCount();

  const handleBagClick = () => {
    if (!storeSelected) {
      setBarVisible(false);
      setShowPopup(true);
    } else if (onBagClick) {
      onBagClick();
    }
  };

  const handleSelectStore = () => {
    closePopup();
    setStoreSelected(true);
    router.push('/store-locator');
  };

  const closePopup = () => {
    setClosing(true);
    setBarVisible(true);
    setTimeout(() => {
      setShowPopup(false);
      setClosing(false);
    }, 250);
  };

  const handleCancel = () => closePopup();

  const handleSelectorClick = () => {
    router.push('/store-locator');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closePopup();
  };

  return (
    <>
      {showPopup && (
        <div className={`store-popup-overlay${closing ? ' closing' : ''}`} onClick={handleOverlayClick}>
          <div className="store-popup-modal">
            <p className="store-popup-message">Please select a store before continuing to the cart.</p>
            <div className="store-popup-actions">
              <button className="store-popup-cancel" onClick={handleCancel}>Cancel</button>
              <button className="store-popup-select" onClick={handleSelectStore}>Select Store</button>
            </div>
          </div>
        </div>
      )}

      <div className={`item-availability-bar${barVisible ? ' bar-visible' : ' bar-hidden'}`}>
        <div className="item-availability-spacer" />

        <div
          className="item-availability-selector"
          onClick={handleSelectorClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectorClick()}
          style={{ cursor: 'pointer' }}
        >
          <span className="item-availability-label">For item availability</span>
          <div className="item-availability-store-row">
            <span className="item-availability-store-text">
              {storeSelected ? 'Change store' : 'Choose a store'}
            </span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`item-availability-chevron ${open ? 'open' : ''}`}>
              <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="item-availability-underline" />
        </div>

        <div className="item-availability-spacer" />

        <div className="item-availability-bag" onClick={handleBagClick}>
          <div className="item-availability-bag-wrap">
            <img src="https://www.starbucks.com/app-assets/d21adfaa60a934de88eb.svg" alt="Bag" width="26" height="28" />
            {cartCount > 0 && <span className="item-availability-badge">{cartCount}</span>}
          </div>
        </div>
      </div>
    </>
  );
}