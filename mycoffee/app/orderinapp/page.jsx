'use client';
import Image from 'next/image';
import './orderinapp.css';

/* Real QR code pointing to the Starbucks app download page */
const QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=1e3932&bgcolor=ffffff&qzone=1&data=https%3A%2F%2Fwww.starbucks.com%2Frewards%2Fmobile-apps%2F';

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.75-2.75-10.84 9.82zm-1.1-20.4A2 2 0 0 0 2 4.5v15c0 .46.12.87.34 1.22l.08.1 8.4-8.4v-.2L2.08 3.36zm17.6 8.57-3.04-1.76-3.06 3.06 3.06 3.06 3.06-1.77a2 2 0 0 0 0-2.6zm-14.9-8.47 10.8 9.83 2.75-2.75L3.48 2.68a1.17 1.17 0 0 0-.7-.22z" />
  </svg>
);

const PhoneIllustration = ({ dark }) => (
  <div className={`oia-phone-wrap ${dark ? 'oia-phone-wrap--dark' : ''}`}>
    <div className={`oia-phone-frame ${dark ? 'oia-phone-frame--dark' : ''}`}>
      <div className="oia-phone-notch" />
      <div className="oia-phone-screen">
        {/* Status bar */}
        <div className="oia-screen-bar" style={{ background: dark ? 'rgba(255,255,255,.08)' : 'rgba(30,57,50,.06)' }}>
          <div style={{ height: 8, width: '60%', background: dark ? 'rgba(255,255,255,.2)' : 'rgba(30,57,50,.15)', borderRadius: 4 }} />
          <div style={{ height: 8, width: '25%', background: dark ? 'rgba(255,255,255,.12)' : 'rgba(30,57,50,.1)', borderRadius: 4 }} />
        </div>
        {/* Logo */}
        <div className="oia-screen-logo">
          <svg viewBox="0 0 44 44" width="32" height="32">
            <circle cx="22" cy="22" r="22" fill={dark ? 'rgba(255,255,255,.15)' : '#1e3932'} />
            <text x="22" y="29" textAnchor="middle" fill="white" fontSize="17" fontWeight="900" fontFamily="sans-serif">S</text>
          </svg>
        </div>
        {/* Items */}
        <div className="oia-screen-items">
          <div className="oia-screen-item" style={{ background: dark ? 'rgba(255,255,255,.08)' : 'rgba(30,57,50,.06)' }}>
            <div style={{ height: 7, width: '80%', background: dark ? 'rgba(255,255,255,.2)' : 'rgba(30,57,50,.18)', borderRadius: 3 }} />
            <div style={{ height: 7, width: '50%', background: dark ? 'rgba(255,255,255,.1)' : 'rgba(30,57,50,.1)', borderRadius: 3, marginTop: 5 }} />
          </div>
          <div className="oia-screen-item" style={{ background: dark ? 'rgba(200,169,88,.2)' : 'rgba(30,57,50,.08)' }}>
            <div style={{ height: 7, width: '65%', background: dark ? 'rgba(200,169,88,.5)' : 'rgba(30,57,50,.16)', borderRadius: 3 }} />
          </div>
        </div>
        {/* CTA */}
        <div className="oia-screen-cta" style={{ background: dark ? '#cba258' : '#1e3932' }}>
          <span style={{ color: dark ? '#1e3932' : '#fff', fontSize: 10, fontWeight: 700 }}>Order Now</span>
        </div>
      </div>
    </div>
  </div>
);

export default function OrderInAppPage() {
  return (
    <div className="oia-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="oia-hero">
        <div className="oia-hero-inner">
          <h1 className="oia-hero-title">Great days start with the Starbucks<sup style={{fontSize:'0.5em',verticalAlign:'super'}}>®</sup> app</h1>
          <p className="oia-hero-sub">
            Order ahead, explore the menu and find Starbucks cafés near you in the app.
            Joining Starbucks® Rewards is always free to sign up.
          </p>
          <div className="oia-qr-block">
            {/* Real QR code via api.qrserver.com */}
            <div className="oia-qr-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QR_URL}
                alt="Scan to download the Starbucks app"
                width={140}
                height={140}
                className="oia-qr-img"
              />
            </div>
            <p className="oia-qr-label">
              Scan with your phone camera to download the app
            </p>
          </div>
        </div>
      </section>

      {/* ── Two-column download ───────────────────────────────── */}
      <section className="oia-download">
        {/* iPhone */}
        <div className="oia-col oia-col--light">
          <PhoneIllustration dark={false} />
          <div className="oia-col-content">
            <h2 className="oia-col-title">Starbucks® app for iPhone®</h2>
            <a
              href="https://apps.apple.com/us/app/starbucks/id331177714"
              target="_blank"
              rel="noopener noreferrer"
              className="oia-store-btn"
            >
              <AppleIcon />
              Download on the App Store
            </a>
          </div>
        </div>

        {/* Android */}
        <div className="oia-col oia-col--dark">
          <PhoneIllustration dark={true} />
          <div className="oia-col-content">
            <h2 className="oia-col-title oia-col-title--light">Starbucks® app for Android™</h2>
            <a
              href="https://play.google.com/store/apps/details?id=com.starbucks.mobilecard"
              target="_blank"
              rel="noopener noreferrer"
              className="oia-store-btn oia-store-btn--light"
            >
              Download on Google Play
            </a>
          </div>
        </div>
      </section>

      {/* ── Fine print ────────────────────────────────────────── */}
      <p className="oia-fine">Restrictions apply. At participating stores.</p>
    </div>
  );
}
