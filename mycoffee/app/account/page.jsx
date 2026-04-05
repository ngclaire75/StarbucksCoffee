'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WhiteNav from '../whitenav';
import '../home.css';
import './account.css';

const BRANDS = ['Visa', 'Mastercard', 'Amex', 'Discover', 'Other'];

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [email, setEmail]         = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Saved stores
  const [savedStores, setSavedStores] = useState([]);

  // Payment cards
  const [cards, setCards] = useState([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardBrand, setCardBrand]       = useState('Visa');
  const [cardLast4, setCardLast4]       = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear]   = useState('');
  const [cardName, setCardName]         = useState('');
  const [cardMsg, setCardMsg]           = useState('');
  const [cardSaving, setCardSaving]     = useState(false);

  // Active section
  const [section, setSection] = useState('profile');

  useEffect(function () {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user) { router.push('/signin'); return; }
        setUser(d.user);
        setFirstName(d.user.firstName || '');
        setLastName(d.user.lastName || '');
        setPhone(d.user.phone || '');
        setEmail(d.user.email || '');
        setLoading(false);
      })
      .catch(function () { router.push('/signin'); });
  }, []);

  useEffect(function () {
    fetch('/api/user/saved-stores')
      .then(r => r.json())
      .then(d => setSavedStores(d.stores || []));
  }, []);

  useEffect(function () {
    fetch('/api/user/payment-cards')
      .then(r => r.json())
      .then(d => setCards(d.cards || []));
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg(data.error || 'Failed to save');
      } else {
        setUser(data.user);
        setProfileMsg('Profile updated successfully!');
      }
    } catch {
      setProfileMsg('Something went wrong');
    }
    setProfileSaving(false);
  }

  async function handleRemoveStore(placeId) {
    await fetch('/api/user/saved-stores', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId }),
    });
    setSavedStores(prev => prev.filter(s => s.placeId !== placeId));
  }

  async function handleAddCard(e) {
    e.preventDefault();
    if (cardLast4.length !== 4 || !/^\d{4}$/.test(cardLast4)) {
      setCardMsg('Enter the last 4 digits of your card');
      return;
    }
    setCardSaving(true);
    setCardMsg('');
    try {
      const res = await fetch('/api/user/payment-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: cardBrand,
          last4: cardLast4,
          expMonth: Number(cardExpMonth),
          expYear: Number(cardExpYear),
          nameOnCard: cardName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCardMsg(data.error || 'Failed to save card');
      } else {
        setCards(prev => [...prev, data.card]);
        setShowCardForm(false);
        setCardLast4(''); setCardExpMonth(''); setCardExpYear(''); setCardName('');
      }
    } catch {
      setCardMsg('Something went wrong');
    }
    setCardSaving(false);
  }

  async function handleRemoveCard(cardId) {
    await fetch('/api/user/payment-cards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId }),
    });
    setCards(prev => prev.filter(c => c.id !== cardId));
  }

  if (loading) {
    return (
      <>
        <WhiteNav />
        <div className="acct-loading">Loading your account…</div>
      </>
    );
  }

  return (
    <>
      <WhiteNav activePage="account" />
      <div className="acct-page">
        <aside className="acct-sidebar">
          <div className="acct-avatar">
            {(user?.firstName?.[0] || user?.name?.[0] || '?').toUpperCase()}
          </div>
          <p className="acct-username">{user?.name || user?.email}</p>
          <nav className="acct-nav">
            <button
              className={`acct-nav-item ${section === 'profile' ? 'acct-nav-item--active' : ''}`}
              onClick={() => setSection('profile')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </button>
            <button
              className={`acct-nav-item ${section === 'stores' ? 'acct-nav-item--active' : ''}`}
              onClick={() => setSection('stores')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Saved Stores
            </button>
            <button
              className={`acct-nav-item ${section === 'cards' ? 'acct-nav-item--active' : ''}`}
              onClick={() => setSection('cards')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Payment Cards
            </button>
          </nav>
        </aside>

        <main className="acct-main">
          {/* ── Profile ── */}
          {section === 'profile' && (
            <section className="acct-section">
              <h2 className="acct-section-title">My Profile</h2>
              <form className="acct-form" onSubmit={handleSaveProfile}>
                <div className="acct-row">
                  <div className="acct-field">
                    <label className="acct-label">First name</label>
                    <input
                      className="acct-input"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="acct-field">
                    <label className="acct-label">Last name</label>
                    <input
                      className="acct-input"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="acct-field">
                  <label className="acct-label">Email address</label>
                  <input
                    className="acct-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="acct-field">
                  <label className="acct-label">Phone number</label>
                  <input
                    className="acct-input"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {profileMsg && (
                  <p className={`acct-msg ${profileMsg.includes('success') ? 'acct-msg--ok' : 'acct-msg--err'}`}>
                    {profileMsg}
                  </p>
                )}
                <button className="acct-btn-primary" type="submit" disabled={profileSaving}>
                  {profileSaving ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </section>
          )}

          {/* ── Saved Stores ── */}
          {section === 'stores' && (
            <section className="acct-section">
              <h2 className="acct-section-title">Saved Stores</h2>
              {savedStores.length === 0 ? (
                <div className="acct-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <p>No saved stores yet.</p>
                  <button className="acct-btn-outline" onClick={() => router.push('/store-locator')}>
                    Find a store
                  </button>
                </div>
              ) : (
                <ul className="acct-store-list">
                  {savedStores.map(function (s) {
                    return (
                      <li key={s.id} className="acct-store-item">
                        <div className="acct-store-info">
                          <p className="acct-store-name">{s.name}</p>
                          <p className="acct-store-addr">{s.address}</p>
                        </div>
                        <button
                          className="acct-icon-btn"
                          aria-label="Remove store"
                          onClick={() => handleRemoveStore(s.placeId)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {/* ── Payment Cards ── */}
          {section === 'cards' && (
            <section className="acct-section">
              <h2 className="acct-section-title">Payment Cards</h2>
              {cards.length === 0 && !showCardForm && (
                <div className="acct-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <p>No payment cards saved.</p>
                </div>
              )}
              {cards.length > 0 && (
                <ul className="acct-card-list">
                  {cards.map(function (c) {
                    return (
                      <li key={c.id} className="acct-card-item">
                        <div className="acct-card-chip">
                          <span className="acct-card-brand">{c.brand}</span>
                          <span className="acct-card-num">•••• {c.last4}</span>
                          <span className="acct-card-exp">Exp {String(c.expMonth).padStart(2,'0')}/{c.expYear}</span>
                        </div>
                        <p className="acct-card-holder">{c.nameOnCard}</p>
                        <button
                          className="acct-icon-btn"
                          aria-label="Remove card"
                          onClick={() => handleRemoveCard(c.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {!showCardForm && (
                <button className="acct-btn-primary" style={{ marginTop: '16px' }} onClick={() => { setShowCardForm(true); setCardMsg(''); }}>
                  + Add a card
                </button>
              )}
              {showCardForm && (
                <form className="acct-form acct-card-form" onSubmit={handleAddCard}>
                  <h3 className="acct-form-title">Add payment card</h3>
                  <div className="acct-field">
                    <label className="acct-label">Card network</label>
                    <select className="acct-input" value={cardBrand} onChange={e => setCardBrand(e.target.value)}>
                      {BRANDS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="acct-row">
                    <div className="acct-field">
                      <label className="acct-label">Last 4 digits</label>
                      <input
                        className="acct-input"
                        maxLength={4}
                        value={cardLast4}
                        onChange={e => setCardLast4(e.target.value.replace(/\D/g, ''))}
                        placeholder="1234"
                        required
                      />
                    </div>
                    <div className="acct-field">
                      <label className="acct-label">Exp month</label>
                      <input
                        className="acct-input"
                        type="number"
                        min="1" max="12"
                        value={cardExpMonth}
                        onChange={e => setCardExpMonth(e.target.value)}
                        placeholder="MM"
                        required
                      />
                    </div>
                    <div className="acct-field">
                      <label className="acct-label">Exp year</label>
                      <input
                        className="acct-input"
                        type="number"
                        min="2024" max="2040"
                        value={cardExpYear}
                        onChange={e => setCardExpYear(e.target.value)}
                        placeholder="YYYY"
                        required
                      />
                    </div>
                  </div>
                  <div className="acct-field">
                    <label className="acct-label">Name on card</label>
                    <input
                      className="acct-input"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  {cardMsg && <p className="acct-msg acct-msg--err">{cardMsg}</p>}
                  <div className="acct-row acct-row--btns">
                    <button type="button" className="acct-btn-outline" onClick={() => setShowCardForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="acct-btn-primary" disabled={cardSaving}>
                      {cardSaving ? 'Saving…' : 'Save card'}
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
}
