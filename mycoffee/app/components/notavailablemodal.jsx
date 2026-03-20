'use client';

import { useEffect } from 'react';
import './notavailablemodal.css';

export default function NotAvailableModal({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-accent" />

        <div className="modal-body">
          <svg className="modal-star" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          <span className="modal-eyebrow">Coming Soon</span>
          <h2 className="modal-heading">We're working on it</h2>
          <p className="modal-subtext">This content isn't available yet. Check back soon for more from Starbucks.</p>
          <button className="modal-close-btn" onClick={onClose}>Got it</button>
        </div>

        <div className="modal-progress-bar" />
      </div>
    </div>
  );
}
