'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import WhiteNav from '../whitenav';
import '../home.css';
import './account.css';

const BRANDS = ['Visa', 'Mastercard', 'Amex', 'Discover', 'Other'];

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

function emptyCardForm() {
  return { brand: 'Visa', cardNumber: '', expMonth: '', expYear: '', nameOnCard: '', securityCode: '' };
}

function resizeImage(src, size = 200) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = src;
  });
}

export default function AccountPage() {
  const router = useRouter();

  // Keep loading separate from data — sidebar always renders immediately
  const [user, setUser]           = useState(null);
  const [dataReady, setDataReady] = useState(false);

  // Avatar
  const [userImage, setUserImage]           = useState(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showWebcam, setShowWebcam]         = useState(false);
  const [webcamReady, setWebcamReady]       = useState(false);
  const [avatarSaving, setAvatarSaving]     = useState(false);
  const [avatarMsg, setAvatarMsg]           = useState('');
  const fileInputRef = useRef(null);
  const videoRef     = useRef(null);
  const streamRef    = useRef(null);

  // Profile
  const [firstName, setFirstName]         = useState('');
  const [lastName, setLastName]           = useState('');
  const [phone, setPhone]                 = useState('');
  const [email, setEmail]                 = useState('');
  const [profileMsg, setProfileMsg]       = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Saved stores
  const [savedStores, setSavedStores] = useState([]);

  // Payment cards
  const [cards, setCards]                   = useState([]);
  const [showCardForm, setShowCardForm]     = useState(false);
  const [editingCardId, setEditingCardId]   = useState(null);
  const [cardForm, setCardForm]             = useState(emptyCardForm());
  const [cardMsg, setCardMsg]               = useState('');
  const [cardSaving, setCardSaving]         = useState(false);

  const [section, setSection] = useState('profile');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user) { router.push('/signin'); return; }
        setUser(d.user);
        setFirstName(d.user.firstName || '');
        setLastName(d.user.lastName || '');
        setPhone(d.user.phone || '');
        setEmail(d.user.email || '');
        setUserImage(d.user.image || null);
        setDataReady(true);
      })
      .catch(() => router.push('/signin'));
  }, []);

  useEffect(() => {
    fetch('/api/user/saved-stores').then(r => r.json()).then(d => setSavedStores(d.stores || []));
  }, []);

  useEffect(() => {
    fetch('/api/user/payment-cards').then(r => r.json()).then(d => setCards(d.cards || []));
  }, []);

  // ── Avatar ──────────────────────────────────────────────────────────────
  async function saveAvatarImage(base64) {
    setAvatarSaving(true); setAvatarMsg('');
    try {
      const res = await fetch('/api/user/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (!res.ok) setAvatarMsg(data.error || 'Failed to save photo');
      else setUserImage(data.image);
    } catch { setAvatarMsg('Something went wrong'); }
    setAvatarSaving(false);
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => { await saveAvatarImage(await resizeImage(ev.target.result)); };
    reader.readAsDataURL(file);
    setShowAvatarMenu(false);
    e.target.value = '';
  }

  async function startWebcam() {
    setShowAvatarMenu(false); setWebcamReady(false); setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setWebcamReady(true);
      }
    } catch {
      setAvatarMsg('Could not access webcam. Please allow camera permission.');
      setShowWebcam(false);
    }
  }

  function stopWebcam() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowWebcam(false); setWebcamReady(false);
  }

  async function capturePhoto() {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 200;
    const ctx = canvas.getContext('2d');
    const v = videoRef.current;
    const side = Math.min(v.videoWidth, v.videoHeight);
    ctx.drawImage(v, (v.videoWidth - side) / 2, (v.videoHeight - side) / 2, side, side, 0, 0, 200, 200);
    stopWebcam();
    await saveAvatarImage(canvas.toDataURL('image/jpeg', 0.82));
  }

  async function handleDeleteAvatar() {
    setShowAvatarMenu(false);
    setUserImage(null);
    await saveAvatarImage(null);
  }

  // ── Profile ──────────────────────────────────────────────────────────────
  async function handleSaveProfile(e) {
    e.preventDefault(); setProfileSaving(true); setProfileMsg('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone, email }),
      });
      const data = await res.json();
      if (!res.ok) setProfileMsg(data.error || 'Failed to save');
      else { setUser(data.user); setProfileMsg('Profile updated successfully!'); }
    } catch { setProfileMsg('Something went wrong'); }
    setProfileSaving(false);
  }

  // ── Saved stores ──────────────────────────────────────────────────────────
  async function handleRemoveStore(placeId) {
    await fetch('/api/user/saved-stores', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ placeId }) });
    setSavedStores(prev => prev.filter(s => s.placeId !== placeId));
  }

  // ── Payment cards ─────────────────────────────────────────────────────────
  function openAddCard() { setEditingCardId(null); setCardForm(emptyCardForm()); setCardMsg(''); setShowCardForm(true); }
  function openEditCard(card) {
    setEditingCardId(card.id);
    setCardForm({ brand: card.brand, cardNumber: '•••• •••• •••• ' + card.last4, expMonth: String(card.expMonth), expYear: String(card.expYear), nameOnCard: card.nameOnCard, securityCode: card.securityCode || '' });
    setCardMsg(''); setShowCardForm(true);
  }
  function closeCardForm() { setShowCardForm(false); setEditingCardId(null); setCardForm(emptyCardForm()); setCardMsg(''); }
  function setField(key, val) { setCardForm(prev => ({ ...prev, [key]: val })); }

  async function handleSubmitCard(e) {
    e.preventDefault();
    const { brand, cardNumber, expMonth, expYear, nameOnCard, securityCode } = cardForm;
    const digits = cardNumber.replace(/[\s•]/g, '');
    const isEditing = !!editingCardId;
    if (!isEditing || digits.length === 16) {
      if (!/^\d{16}$/.test(digits)) { setCardMsg('Card number must be exactly 16 digits'); return; }
    }
    if (securityCode && (securityCode.length !== 8 || !/^\d{8}$/.test(securityCode))) {
      setCardMsg('Security code must be exactly 8 digits'); return;
    }
    setCardSaving(true); setCardMsg('');
    try {
      const payload = { brand, expMonth: Number(expMonth), expYear: Number(expYear), nameOnCard, securityCode };
      if (isEditing) { payload.cardId = editingCardId; if (/^\d{16}$/.test(digits)) payload.cardNumber = digits; }
      else payload.cardNumber = digits;
      const res = await fetch('/api/user/payment-cards', { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) setCardMsg(data.error || 'Failed to save card');
      else {
        if (isEditing) setCards(prev => prev.map(c => c.id === editingCardId ? data.card : c));
        else setCards(prev => [...prev, data.card]);
        closeCardForm();
      }
    } catch { setCardMsg('Something went wrong'); }
    setCardSaving(false);
  }

  async function handleRemoveCard(cardId) {
    await fetch('/api/user/payment-cards', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cardId }) });
    setCards(prev => prev.filter(c => c.id !== cardId));
  }

  // Derive display values (safe before data arrives)
  const initials  = (user?.firstName?.[0] || user?.name?.[0] || '').toUpperCase();
  const username  = user?.name || user?.email || '';

  return (
    <>
      <WhiteNav activePage="account" />

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

      {/* Webcam modal */}
      {showWebcam && (
        <div className="acct-modal-overlay" onClick={stopWebcam}>
          <div className="acct-webcam-modal" onClick={e => e.stopPropagation()}>
            <h3 className="acct-webcam-title">Take a photo</h3>
            <div className="acct-webcam-frame">
              <video ref={videoRef} autoPlay playsInline muted className="acct-webcam-video" />
            </div>
            <div className="acct-webcam-actions">
              <button className="acct-btn-outline" onClick={stopWebcam}>Cancel</button>
              <button className="acct-btn-primary" onClick={capturePhoto} disabled={!webcamReady}>
                {webcamReady ? 'Capture' : 'Loading camera…'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Always render the same outer layout — prevents CSS flash */}
      <div className="acct-page">

        {/* ── Sidebar — always rendered ── */}
        <aside className="acct-sidebar">
          <div className="acct-avatar-section">
            <div
              className="acct-avatar-wrap"
              onClick={() => { if (dataReady) { setShowAvatarMenu(v => !v); setAvatarMsg(''); } }}
              title={dataReady ? 'Change profile photo' : ''}
              style={{ cursor: dataReady ? 'pointer' : 'default' }}
            >
              {userImage
                ? <img src={userImage} alt="Profile" className="acct-avatar-img" />
                : <div className="acct-avatar">{initials || <span style={{ opacity: 0.3 }}>?</span>}</div>
              }
              {dataReady && (
                <div className="acct-avatar-overlay">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              )}
            </div>

            {showAvatarMenu && dataReady && (
              <div className="acct-avatar-menu">
                <button className="acct-avatar-menu-item" onClick={() => { fileInputRef.current?.click(); setShowAvatarMenu(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload from files
                </button>
                <button className="acct-avatar-menu-item" onClick={startWebcam}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  Take a photo
                </button>
                {userImage && (
                  <button className="acct-avatar-menu-item acct-avatar-menu-item--danger" onClick={handleDeleteAvatar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {avatarSaving && <p className="acct-avatar-status">Saving…</p>}
            {avatarMsg   && <p className="acct-avatar-status acct-avatar-status--err">{avatarMsg}</p>}

            {/* Username skeleton while loading */}
            {dataReady
              ? <p className="acct-username">{username}</p>
              : <div className="acct-skel acct-skel--name" />
            }
          </div>

          <nav className="acct-nav">
            <button className={`acct-nav-item ${section === 'profile' ? 'acct-nav-item--active' : ''}`} onClick={() => setSection('profile')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </button>
            <button className={`acct-nav-item ${section === 'stores' ? 'acct-nav-item--active' : ''}`} onClick={() => setSection('stores')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Saved Stores
            </button>
            <button className={`acct-nav-item ${section === 'cards' ? 'acct-nav-item--active' : ''}`} onClick={() => setSection('cards')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Payment Cards
            </button>
          </nav>
        </aside>

        {/* ── Main ── */}
        <main className="acct-main">

          {/* Skeleton while data loads */}
          {!dataReady && (
            <section className="acct-section">
              <div className="acct-skel acct-skel--title" />
              <div className="acct-skel-form">
                <div className="acct-skel acct-skel--field" />
                <div className="acct-skel acct-skel--field" />
                <div className="acct-skel acct-skel--field" />
                <div className="acct-skel acct-skel--btn" />
              </div>
            </section>
          )}

          {dataReady && (
            <>
              {/* Profile */}
              {section === 'profile' && (
                <section className="acct-section">
                  <h2 className="acct-section-title">My Profile</h2>
                  <form className="acct-form" onSubmit={handleSaveProfile}>
                    <div className="acct-row">
                      <div className="acct-field">
                        <label className="acct-label">First name</label>
                        <input className="acct-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                      </div>
                      <div className="acct-field">
                        <label className="acct-label">Last name</label>
                        <input className="acct-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                      </div>
                    </div>
                    <div className="acct-field">
                      <label className="acct-label">Email address</label>
                      <input className="acct-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                    </div>
                    <div className="acct-field">
                      <label className="acct-label">Phone number</label>
                      <input className="acct-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                    </div>
                    {profileMsg && <p className={`acct-msg ${profileMsg.includes('success') ? 'acct-msg--ok' : 'acct-msg--err'}`}>{profileMsg}</p>}
                    <button className="acct-btn-primary" type="submit" disabled={profileSaving}>
                      {profileSaving ? 'Saving…' : 'Save changes'}
                    </button>
                  </form>
                </section>
              )}

              {/* Saved Stores */}
              {section === 'stores' && (
                <section className="acct-section">
                  <h2 className="acct-section-title">Saved Stores</h2>
                  {savedStores.length === 0 ? (
                    <div className="acct-empty">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <p>No saved stores yet.</p>
                      <button className="acct-btn-outline" onClick={() => router.push('/store-locator')}>Find a store</button>
                    </div>
                  ) : (
                    <ul className="acct-store-list">
                      {savedStores.map(s => (
                        <li key={s.id} className="acct-store-item">
                          <div className="acct-store-info">
                            <p className="acct-store-name">{s.name}</p>
                            <p className="acct-store-addr">{s.address}</p>
                          </div>
                          <button className="acct-icon-btn" aria-label="Remove store" onClick={() => handleRemoveStore(s.placeId)}><TrashIcon /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {/* Payment Cards */}
              {section === 'cards' && (
                <section className="acct-section">
                  <h2 className="acct-section-title">Payment Cards</h2>
                  {cards.length === 0 && !showCardForm && (
                    <div className="acct-empty">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      <p>No payment cards saved.</p>
                    </div>
                  )}
                  {cards.length > 0 && (
                    <ul className="acct-card-list">
                      {cards.map(c => (
                        <li key={c.id} className="acct-card-item">
                          <div className="acct-card-chip">
                            <span className="acct-card-brand">{c.brand}</span>
                            <span className="acct-card-num">•••• •••• •••• {c.last4}</span>
                            <span className="acct-card-exp">Exp {String(c.expMonth).padStart(2,'0')}/{c.expYear}</span>
                          </div>
                          <p className="acct-card-holder">{c.nameOnCard}</p>
                          <div className="acct-card-actions">
                            <button className="acct-icon-btn" aria-label="Edit card" onClick={() => openEditCard(c)}><PencilIcon /></button>
                            <button className="acct-icon-btn" aria-label="Remove card" onClick={() => handleRemoveCard(c.id)}><TrashIcon /></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!showCardForm && (
                    <button className="acct-btn-primary" style={{ marginTop: '16px' }} onClick={openAddCard}>+ Add a card</button>
                  )}
                  {showCardForm && (
                    <form className="acct-form acct-card-form" onSubmit={handleSubmitCard}>
                      <h3 className="acct-form-title">{editingCardId ? 'Edit payment card' : 'Add payment card'}</h3>
                      <div className="acct-field">
                        <label className="acct-label">Card network</label>
                        <select className="acct-input" value={cardForm.brand} onChange={e => setField('brand', e.target.value)}>
                          {BRANDS.map(b => <option key={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="acct-field">
                        <label className="acct-label">Card number (16 digits)</label>
                        <input className="acct-input" maxLength={16} value={cardForm.cardNumber}
                          onFocus={e => { if (e.target.value.includes('•')) setField('cardNumber', ''); }}
                          onChange={e => setField('cardNumber', e.target.value.replace(/\D/g, ''))}
                          placeholder="1234567890123456" required={!editingCardId} />
                      </div>
                      <div className="acct-row">
                        <div className="acct-field">
                          <label className="acct-label">Exp month</label>
                          <input className="acct-input" type="number" min="1" max="12" value={cardForm.expMonth} onChange={e => setField('expMonth', e.target.value)} placeholder="MM" required />
                        </div>
                        <div className="acct-field">
                          <label className="acct-label">Exp year</label>
                          <input className="acct-input" type="number" min="2024" max="2040" value={cardForm.expYear} onChange={e => setField('expYear', e.target.value)} placeholder="YYYY" required />
                        </div>
                      </div>
                      <div className="acct-field">
                        <label className="acct-label">Name on card</label>
                        <input className="acct-input" value={cardForm.nameOnCard} onChange={e => setField('nameOnCard', e.target.value)} placeholder="Full name" required />
                      </div>
                      <div className="acct-field">
                        <label className="acct-label">Security code (8 digits)</label>
                        <input className="acct-input" maxLength={8} value={cardForm.securityCode} onChange={e => setField('securityCode', e.target.value.replace(/\D/g, ''))} placeholder="12345678" />
                      </div>
                      {cardMsg && <p className="acct-msg acct-msg--err">{cardMsg}</p>}
                      <div className="acct-row acct-row--btns">
                        <button type="button" className="acct-btn-outline" onClick={closeCardForm}>Cancel</button>
                        <button type="submit" className="acct-btn-primary" disabled={cardSaving}>
                          {cardSaving ? 'Saving…' : editingCardId ? 'Save changes' : 'Save card'}
                        </button>
                      </div>
                    </form>
                  )}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
