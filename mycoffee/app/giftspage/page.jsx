'use client';
import { useState } from 'react';
import './gifts.css';

const CARD_DESIGNS = [
  { id: 'card1', img: '/images/card1.png', label: 'Design 1' },
  { id: 'card2', img: '/images/card2.png', label: 'Design 2' },
  { id: 'card3', img: '/images/card3.png', label: 'Design 3' },
  { id: 'card4', img: '/images/card4.png', label: 'Design 4' },
  { id: 'card5', img: '/images/card5.png', label: 'Design 5' },
  { id: 'card6', img: '/images/card6.png', label: 'Design 6' },
];

const AMOUNTS = ['$10', '$25', '$50', '$100'];

const GiftCardArt = ({ design, size = 'sm' }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={design.img}
    alt={design.label}
    className={`gf-card-art gf-card-art--${size}`}
  />
);

export default function GiftsPage() {
  const [activeTab, setActiveTab] = useState('egift');
  const [selectedDesign, setSelectedDesign] = useState(CARD_DESIGNS[0]);
  const [selectedAmount, setSelectedAmount] = useState('$25');
  const [customAmount, setCustomAmount] = useState('');

  return (
    <div className="gf-page">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="gf-hero">
        <div className="gf-hero-text">
          <p className="gf-hero-eyebrow">Starbucks® Gift Cards</p>
          <h1 className="gf-hero-title">Give the gift of Starbucks</h1>
          <p className="gf-hero-sub">
            Send an eGift Card instantly by email or text message. The perfect gift for any occasion.
          </p>
          <button className="gf-hero-btn" onClick={() => setActiveTab('egift')}>
            Send an eGift Card
          </button>
        </div>
        <div className="gf-hero-cards">
          {CARD_DESIGNS.slice(0, 3).map((d, i) => (
            <div key={d.id} className="gf-hero-card-wrap" style={{ '--i': i }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt={d.label} className="gf-card-art gf-card-art--lg" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Tabs + Panels ────────────────────────────────── */}
      <section className="gf-main">
        <div className="gf-container">
          <div className="gf-tabs" role="tablist">
            {[
              { id: 'egift',    label: 'Send an eGift Card' },
              { id: 'check',    label: 'Check your balance' },
              { id: 'business', label: 'Business gifting' },
            ].map(t => (
              <button
                key={t.id}
                role="tab"
                aria-selected={activeTab === t.id}
                className={`gf-tab ${activeTab === t.id ? 'gf-tab--active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* eGift Card panel */}
          {activeTab === 'egift' && (
            <div className="gf-panel gf-panel--egift">
              <div className="gf-panel-left">
                {/* Card preview */}
                <div className="gf-preview-wrap">
                  <GiftCardArt design={selectedDesign} size="lg" />
                  <p className="gf-preview-label">Preview</p>
                </div>

                {/* Design picker */}
                <div className="gf-field-group">
                  <p className="gf-field-label">Choose a design</p>
                  <div className="gf-design-grid">
                    {CARD_DESIGNS.map(d => (
                      <button
                        key={d.id}
                        className={`gf-design-thumb ${selectedDesign.id === d.id ? 'gf-design-thumb--active' : ''}`}
                        onClick={() => setSelectedDesign(d)}
                        title={d.label}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={d.img} alt={d.label} className="gf-design-thumb-img" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="gf-panel-right">
                <h2 className="gf-panel-title">Send an eGift Card</h2>
                <p className="gf-panel-sub">Delivered instantly to any email address or phone number.</p>

                {/* Amount */}
                <div className="gf-field-group">
                  <p className="gf-field-label">Choose an amount</p>
                  <div className="gf-amounts-row">
                    {AMOUNTS.map(a => (
                      <button
                        key={a}
                        className={`gf-amount-btn ${selectedAmount === a ? 'gf-amount-btn--active' : ''}`}
                        onClick={() => setSelectedAmount(a)}
                      >
                        {a}
                      </button>
                    ))}
                    <button
                      className={`gf-amount-btn gf-amount-btn--custom ${selectedAmount === 'custom' ? 'gf-amount-btn--active' : ''}`}
                      onClick={() => setSelectedAmount('custom')}
                    >
                      Custom
                    </button>
                  </div>
                  {selectedAmount === 'custom' && (
                    <div className="gf-custom-amount">
                      <span className="gf-custom-prefix">$</span>
                      <input
                        type="number"
                        className="gf-custom-input"
                        placeholder="Enter amount ($5–$500)"
                        min="5"
                        max="500"
                        value={customAmount}
                        onChange={e => setCustomAmount(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Recipient */}
                <div className="gf-field-group">
                  <p className="gf-field-label">Recipient details</p>
                  <div className="gf-form-fields">
                    <input className="gf-input" type="text" placeholder="Recipient's name" />
                    <input className="gf-input" type="email" placeholder="Recipient's email" />
                    <textarea className="gf-input gf-textarea" placeholder="Personal message (optional)" rows="3" />
                  </div>
                </div>

                <button className="gf-cta-btn">Continue</button>
                <p className="gf-panel-fine">
                  Starbucks eGift Cards are delivered by email. View{' '}
                  <a href="/termsofuse">Terms of Use</a>.
                </p>
              </div>
            </div>
          )}

          {/* Check balance panel */}
          {activeTab === 'check' && (
            <div className="gf-panel">
              <div className="gf-panel-narrow">
                <h2 className="gf-panel-title">Check your card balance</h2>
                <p className="gf-panel-sub">Enter your card number and security code to see your balance.</p>
                <div className="gf-form-fields">
                  <input className="gf-input" type="text" placeholder="Card number (16 digits)" />
                  <input className="gf-input" type="text" placeholder="Security code (8 digits)" />
                  <button className="gf-cta-btn">Check Balance</button>
                </div>
                <p className="gf-balance-hint">
                  Find your card number on the back of your Starbucks card.
                </p>
              </div>
            </div>
          )}

          {/* Business gifting panel */}
          {activeTab === 'business' && (
            <div className="gf-panel">
              <div className="gf-panel-narrow">
                <h2 className="gf-panel-title">Business gifting</h2>
                <p className="gf-panel-sub">
                  Reward employees, thank clients, or celebrate milestones with Starbucks gift cards.
                  Minimum order of 15 cards. Bulk orders available for all organization sizes.
                </p>
                <div className="gf-biz-grid">
                  {[
                    { title: 'Bulk orders',       body: 'Order 15 or more cards at once at competitive rates.',     svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
                    { title: 'Custom designs',    body: 'Add your branding or a personalized message to each card.', svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125A1.64 1.64 0 0114.42 17.42h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="7" r="1" fill="currentColor"/><circle cx="17" cy="12" r="1" fill="currentColor"/></svg> },
                    { title: 'Fast delivery',     body: 'Digital delivery for large orders processed the same day.',  svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
                    { title: 'Dedicated support', body: 'A Starbucks business specialist assists your order from start to finish.', svg: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
                  ].map(f => (
                    <div key={f.title} className="gf-biz-card">
                      <div className="gf-biz-icon">{f.svg}</div>
                      <h3 className="gf-biz-title">{f.title}</h3>
                      <p className="gf-biz-body">{f.body}</p>
                    </div>
                  ))}
                </div>
                <button className="gf-cta-btn">Contact Business Team</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Why section ────────────────────────────────── */}
      <section className="gf-why">
        <div className="gf-container">
          <h2 className="gf-why-title">Why Starbucks gift cards?</h2>
          <div className="gf-why-grid">
            {[
              {
                title: 'Send instantly',
                body: 'Delivered by email the moment you complete your order — no shipping needed.',
                svg: <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#1e3932" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
              },
              {
                title: 'Never expires',
                body: 'Starbucks gift card balances never expire and no fees are ever charged.',
                svg: <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#1e3932" strokeWidth="1.6" strokeLinecap="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 000 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 000-8c-2 0-4 1.5-6 4z"/></svg>,
              },
              {
                title: 'Works everywhere',
                body: 'Accepted at all participating Starbucks locations in the US and Canada.',
                svg: <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#1e3932" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
              },
              {
                title: 'Reload anytime',
                body: 'Add funds in the app, online, or at any Starbucks store at any time.',
                svg: <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#1e3932" strokeWidth="1.6" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
              },
            ].map(w => (
              <div key={w.title} className="gf-why-card">
                <div className="gf-why-icon">{w.svg}</div>
                <h3 className="gf-why-card-title">{w.title}</h3>
                <p className="gf-why-card-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fine print ────────────────────────────────── */}
      <div className="gf-fine">
        <div className="gf-container">
          <p>
            Starbucks® Gift Cards and eGifts are redeemable at participating US stores. No expiration date. No fees. Subject to{' '}
            <a href="/termsofuse">Terms of Use</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
