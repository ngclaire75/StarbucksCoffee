'use client';

import { useState } from 'react';
import './itemavailability.css';

export default function ItemAvailability() {
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [closing, setClosing] = useState(false);
  const [barVisible, setBarVisible] = useState(true);
  const [storeSelected, setStoreSelected] = useState(false);

  const handleBagClick = () => {
    if (!storeSelected) {
      setBarVisible(false);
      setShowPopup(true);
    }
  };

const closePopup = () => {
  setClosing(true);
  setBarVisible(true); // show bar immediately as popup starts closing
  setTimeout(() => {
    setShowPopup(false);
    setClosing(false);
  }, 250);
};

  const handleCancel = () => closePopup();

  const handleSelectStore = () => {
    closePopup();
    // setStoreSelected(true); // uncomment once store is actually selected
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  return (
    <>
      {/* Popup Modal */}
      {showPopup && (
        <div
          className={`store-popup-overlay${closing ? ' closing' : ''}`}
          onClick={handleOverlayClick}
        >
          <div className="store-popup-modal">
            <p className="store-popup-message">
              Please select a store before continuing to the cart.
            </p>
            <div className="store-popup-actions">
              <button className="store-popup-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="store-popup-select" onClick={handleSelectStore}>
                Select Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Availability Bar — always mounted, fades in/out */}
      <div className={`item-availability-bar${barVisible ? ' bar-visible' : ' bar-hidden'}`}>

        {/* Left spacer */}
        <div className="item-availability-spacer" />

        {/* Center: store selector */}
        <div className="item-availability-selector" onClick={() => setOpen(!open)}>
          <span className="item-availability-label">For item availability</span>

          <div className="item-availability-store-row">
            <span className="item-availability-store-text">Choose a store</span>
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`item-availability-chevron ${open ? 'open' : ''}`}
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="item-availability-underline" />
        </div>

        {/* Right spacer */}
        <div className="item-availability-spacer" />

        {/* Bag icon — far right */}
        <div className="item-availability-bag" onClick={handleBagClick}>
          <img
            src="https://www.starbucks.com/app-assets/d21adfaa60a934de88eb.svg"
            alt="Bag"
            width="26"
            height="28"
          />
        </div>

      </div>
    </>
  );
}