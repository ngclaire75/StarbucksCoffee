'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './paymentpage.css';

/* ─── Helpers ────────────────────────────────────────────────────────── */
function getPickupEstimate() { return Math.floor(Math.random() * 16) + 10; }

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const d = value.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
}

function detectCardBrand(number) {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n))                             return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n))                         return 'amex';
  if (/^6011|^65|^64[4-9]/.test(n))            return 'discover';
  return null;
}

function CardBrandIcon({ brand }) {
  if (!brand) return null;
  const colors  = { visa: '#1a1f71', mastercard: '#eb001b', amex: '#007bc1', discover: '#ff6600' };
  const labels  = { visa: 'VISA', mastercard: '●●', amex: 'AMEX', discover: 'DISC' };
  return <span className="pp-card-brand" style={{ color: colors[brand] }}>{labels[brand]}</span>;
}

/* ─── Order Success Modal ────────────────────────────────────────────── */
function OrderSuccessModal({ store, estimateMins, total, cartItems, onDone }) {
  const [countdown, setCountdown] = useState(estimateMins * 60);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => { if (c <= 0) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div className="pp-success-overlay">
      <div className="pp-success-modal">
        <div className="pp-success-check">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="22" fill="#00a862" />
            <polyline points="10 22 18 30 34 14" stroke="#fff" strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round" className="pp-check-path" />
          </svg>
        </div>
        <div className="pp-success-badge">Order Confirmed</div>
        <h2 className="pp-success-title">Your order is on its way!</h2>
        <p className="pp-success-subtitle">Your items are being prepared for pickup at:</p>

        <div className="pp-success-store">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#00a862" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
          <div>
            <div className="pp-success-store-name">{store?.name ?? 'Your Starbucks'}</div>
            <div className="pp-success-store-addr">{store?.address ?? ''}</div>
          </div>
        </div>

        <div className="pp-success-timer-wrap">
          <div className="pp-success-timer-label">Estimated ready in</div>
          {countdown > 0 ? (
            <div className="pp-success-timer">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
          ) : (
            <div className="pp-success-ready-pulse">Ready for pickup! 🎉</div>
          )}
          <div className="pp-success-timer-sub">~{estimateMins} minutes</div>
        </div>

        <div className="pp-success-items">
          {(cartItems ?? []).map((item, i) => (
            <div key={i} className="pp-success-item">
              <span className="pp-success-item-name">{item.qty} × {item.size} {item.name}</span>
            </div>
          ))}
        </div>

        <button className="pp-success-done-btn" onClick={onDone}>Back to Menu</button>
      </div>
    </div>
  );
}

/* ─── Payment Page ───────────────────────────────────────────────────── */
export default function PaymentPage() {
  const router = useRouter();

  /* Read cart + total from localStorage (set by menu.jsx on checkout) */
  const [cartItems,    setCartItems]    = useState([]);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [store,        setStore]        = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [pickupCountdown, setPickupCountdown] = useState(null);
const [orderReady, setOrderReady] = useState(false);

  useEffect(() => {
    try {
      const cart  = JSON.parse(localStorage.getItem('checkoutCart')  || '[]');
      const total = JSON.parse(localStorage.getItem('checkoutTotal') || '0');
      const savedStore = JSON.parse(localStorage.getItem('selectedStore') || 'null');
      setCartItems(cart);
      setDisplayTotal(typeof total === 'number' ? total : 0);
      setStore(savedStore);
    } catch (_) {}
  }, []);

  /* Form state */
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [cardNumber,  setCardNumber]  = useState('');
  const [expiry,      setExpiry]      = useState('');
  const [cvv,         setCvv]         = useState('');
  const [nameOnCard,  setNameOnCard]  = useState('');
  const [billingZip,  setBillingZip]  = useState('');
  const [saveCard,    setSaveCard]    = useState(false);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [estimateMins, setEstimateMins] = useState(15);

  const detectedBrand = detectCardBrand(cardNumber);
const cardBrand = selectedBrand || detectedBrand;

  function validate() {
    const errs = {};
    if (!firstName.trim())                     errs.firstName  = 'First name is required';
    if (!lastName.trim())                      errs.lastName   = 'Last name is required';
    if (!email.trim() || !email.includes('@')) errs.email      = 'Valid email is required';
    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 13 || rawCard.length > 16) errs.cardNumber = 'Enter a valid card number';
    if (!expiry || expiry.length < 5)          errs.expiry     = 'Enter a valid expiry (MM/YY)';
    if (!cvv || cvv.length < 3)                errs.cvv        = 'Enter a valid CVV';
    if (!nameOnCard.trim())                    errs.nameOnCard = 'Name on card is required';
    if (!billingZip || billingZip.length < 5)  errs.billingZip = 'Enter a valid ZIP code';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      document.querySelector('.pp-field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEstimateMins(getPickupEstimate());
      setSuccess(true);
    }, 1800);
  }

  function handleDone() {
    /* Clear checkout state */
    localStorage.removeItem('checkoutCart');
    localStorage.removeItem('checkoutTotal');
    localStorage.removeItem('cart');
    router.push('/menupage');
  }

  if (success) {
    return (
      <OrderSuccessModal
        store={store}
        estimateMins={estimateMins}
        total={displayTotal}
        cartItems={cartItems}
        onDone={handleDone}
      />
    );
  }

  return (
    <div className="pp-root">
      {/* Header */}
      <div className="pp-header">
        <button className="pp-back-btn" onClick={() => router.back()} aria-label="Back">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div className="pp-header-title">
          Grab Your Starbucks® Drink Now!
        </div>
        <div className="pp-header-secure">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#00a862" />
            <polyline points="9 12 11 14 15 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          SSL Secured
        </div>
      </div>

      <div className="pp-body">

        {/* LEFT: form */}
        <form className="pp-form" onSubmit={handleSubmit} noValidate>

          {/* Contact */}
          <div className="pp-section">
            <h2 className="pp-section-title">Contact Information</h2>
            <div className="pp-field-row pp-field-row--2">
              <div className="pp-field">
                <label className="pp-label">First Name</label>
                <input className={`pp-input${errors.firstName ? ' pp-input--error' : ''}`}
                  type="text" placeholder="Jane" value={firstName}
                  onChange={e => setFirstName(e.target.value)} autoComplete="given-name" />
                {errors.firstName && <span className="pp-field-error">{errors.firstName}</span>}
              </div>
              <div className="pp-field">
                <label className="pp-label">Last Name</label>
                <input className={`pp-input${errors.lastName ? ' pp-input--error' : ''}`}
                  type="text" placeholder="Doe" value={lastName}
                  onChange={e => setLastName(e.target.value)} autoComplete="family-name" />
                {errors.lastName && <span className="pp-field-error">{errors.lastName}</span>}
              </div>
            </div>
            <div className="pp-field">
              <label className="pp-label">Email Address</label>
              <input className={`pp-input${errors.email ? ' pp-input--error' : ''}`}
                type="email" placeholder="jane@example.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="email" />
              {errors.email && <span className="pp-field-error">{errors.email}</span>}
            </div>
          </div>

          {/* Payment */}
          <div className="pp-section">
            <h2 className="pp-section-title">Payment Details</h2>

       <div className="pp-accepted-cards">
  {['visa','mastercard','amex','discover'].map(brand => (
    <button
      type="button"
      key={brand}
      onClick={() => setSelectedBrand(brand)}
      className={`pp-card-logo pp-card-logo--${brand}${cardBrand === brand ? ' pp-card-logo--active' : ''}`}
    >
      {brand === 'visa' && <span>VISA</span>}
      {brand === 'mastercard' && <span>MC</span>}
      {brand === 'amex' && <span>AMEX</span>}
      {brand === 'discover' && <span>DISC</span>}
    </button>
  ))}
</div>

            <div className="pp-field">
              <label className="pp-label">Card Number</label>
              <div className="pp-input-wrap">
                <input className={`pp-input pp-input--card${errors.cardNumber ? ' pp-input--error' : ''}`}
                  type="text" placeholder="1234 5678 9012 3456" value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19} autoComplete="cc-number" inputMode="numeric" />
                {cardBrand && <CardBrandIcon brand={cardBrand} />}
                <svg className="pp-card-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="4" width="22" height="16" rx="3" stroke="#aaa" strokeWidth="1.5" />
                  <line x1="1" y1="10" x2="23" y2="10" stroke="#aaa" strokeWidth="1.5" />
                </svg>
              </div>
              {errors.cardNumber && <span className="pp-field-error">{errors.cardNumber}</span>}
            </div>

            <div className="pp-field-row pp-field-row--2">
              <div className="pp-field">
                <label className="pp-label">Expiry Date</label>
                <input className={`pp-input${errors.expiry ? ' pp-input--error' : ''}`}
                  type="text" placeholder="MM/YY" value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5} autoComplete="cc-exp" inputMode="numeric" />
                {errors.expiry && <span className="pp-field-error">{errors.expiry}</span>}
              </div>
              <div className="pp-field">
                <label className="pp-label">CVV</label>
                <div className="pp-input-wrap">
                  <input className={`pp-input${errors.cvv ? ' pp-input--error' : ''}`}
                    type="password" placeholder="•••" value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4} autoComplete="cc-csc" inputMode="numeric" />
                  <svg className="pp-card-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#aaa" strokeWidth="1.5" />
                  </svg>
                </div>
                {errors.cvv && <span className="pp-field-error">{errors.cvv}</span>}
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">Name on Card</label>
              <input className={`pp-input${errors.nameOnCard ? ' pp-input--error' : ''}`}
                type="text" placeholder="Jane Doe" value={nameOnCard}
                onChange={e => setNameOnCard(e.target.value)} autoComplete="cc-name" />
              {errors.nameOnCard && <span className="pp-field-error">{errors.nameOnCard}</span>}
            </div>

            <div className="pp-field">
              <label className="pp-label">Billing ZIP Code</label>
              <input className={`pp-input${errors.billingZip ? ' pp-input--error' : ''}`}
                type="text" placeholder="12345" value={billingZip}
                onChange={e => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                maxLength={5} inputMode="numeric" autoComplete="postal-code" />
              {errors.billingZip && <span className="pp-field-error">{errors.billingZip}</span>}
            </div>

            <label className="pp-checkbox-row">
              <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} />
              <span className="pp-checkbox-label">Save card for future orders</span>
            </label>
          </div>

          {/* Pickup reminder */}
          {store && (
            <div className="pp-pickup-reminder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#00a862" />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
              <div>
                <div className="pp-pickup-label">Pickup from</div>
                <div className="pp-pickup-store">{store.name}</div>
                <div className="pp-pickup-addr">{store.address}</div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button className="pp-pay-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="pp-pay-loading">
                <span className="pp-pay-spinner" />
                Processing payment…
              </span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(255,255,255,0.25)" />
                  <polyline points="9 12 11 14 15 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Confirm Payment
              </>
            )}
          </button>

          <p className="pp-legal">
            By placing your order you agree to our{' '}
            <a href="#" className="pp-legal-link">Terms of Use</a> and{' '}
            <a href="#" className="pp-legal-link">Privacy Policy</a>.
            Your payment is processed securely.
          </p>
        </form>

        {/* RIGHT: order summary */}
        <div className="pp-order-summary">
          <h2 className="pp-summary-title">Order Summary</h2>

          {store && (
            <div className="pp-summary-store">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#00a862" />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
              <div>
                <div className="pp-summary-store-label">Pickup from</div>
                <div className="pp-summary-store-name">{store.name}</div>
              </div>
            </div>
          )}

          <div className="pp-summary-items">
            {cartItems.map((item, i) => (
              <div key={i} className="pp-summary-item">
                <div className="pp-summary-item-info">
                  <div className="pp-summary-item-name">{item.name}</div>
                  <div className="pp-summary-item-meta">
                    {[item.size, item.temp, item.sugarLevel !== 'Regular' && item.sugarLevel]
                      .filter(Boolean).join(' · ')}
                  </div>
                  <div className="pp-summary-item-qty">Qty: {item.qty}</div>
                </div>
                <div className="pp-summary-item-price">
                  {(item.price || 0) > 0 && ((item.price || 0) * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {displayTotal > 0 && (
  <div className="pp-summary-totals">
    <div className="pp-summary-row">
      <span>Subtotal</span>
      <span>{(displayTotal / 1.0875).toFixed(2)}</span>
    </div>
    <div className="pp-summary-row">
      <span>Estimated tax (8.75%)</span>
      <span>{(displayTotal - displayTotal / 1.0875).toFixed(2)}</span>
    </div>
    <div className="pp-summary-row pp-summary-row--total">
      <span>Total</span>
      <span>{displayTotal.toFixed(2)}</span>
    </div>
  </div>
)}

          <div className="pp-trust-badges">
            <div className="pp-trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#00a862" />
                <polyline points="9 12 11 14 15 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Secure payment
            </div>
            <div className="pp-trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#00a862" strokeWidth="1.8" />
                <polyline points="9 12 11 14 15 10" stroke="#00a862" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Order guaranteed
            </div>
            <div className="pp-trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#00a862" />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
              Pickup ready in 15 mins
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}