'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function WhiteNav({ activePage }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 93, right: 24 });
  const btnRef = useRef(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
  }, []);

  function toggleMenu() {
    if (!menuOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen((v) => !v);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <header className="navbar">
        <div
          className="logo"
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/images/starbucks_logo.png" alt="Starbucks Logo" />
        </div>

        <ul className="nav-links">
          <li
            className={activePage === 'menu' ? 'active' : ''}
            onClick={() => router.push('/menupage')}
          >
            MENU
          </li>

          <li
            className={activePage === 'rewards' ? 'active' : ''}
            onClick={() => router.push('/rewardspage')}
          >
            REWARDS
          </li>

          <li
            className={activePage === 'gifts' ? 'active' : ''}
            onClick={() => router.push('/giftspage')}
          >
            GIFT CARDS
          </li>
        </ul>

        <div className="nav-right">
          <div
            className={`find-store ${activePage === 'store-locator' ? 'active' : ''}`}
            onClick={() => router.push('/store-locator')}
          >
            <img src="/images/location.png" alt="Location Icon" />
            <span>Find a store</span>
          </div>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                ref={btnRef}
                className="btn-outline"
                onClick={toggleMenu}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{user.name?.split(' ')[0] || 'Account'}</span>
                <svg width="10" height="10" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: 'fixed',
                    top: dropdownPos.top,
                    right: dropdownPos.right,
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    minWidth: '160px',
                    maxWidth: '220px',
                    zIndex: 9999,
                  }}
                >
                  <div
                    style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      fontWeight: '600',
                      color: '#1e3932',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-outline" onClick={() => router.push('/signin')}>
                Sign in
              </button>
              <button className="btn-black" onClick={() => router.push('/joinnow')}>
                Join now
              </button>
            </>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-item" onClick={() => { router.push('/menupage'); setMobileOpen(false); }}>MENU</div>
          <div className="mobile-menu-item" onClick={() => { router.push('/rewardspage'); setMobileOpen(false); }}>REWARDS</div>
          <div className="mobile-menu-item" onClick={() => { router.push('/giftspage'); setMobileOpen(false); }}>GIFT CARDS</div>
          <div className="mobile-menu-item" onClick={() => { router.push('/store-locator'); setMobileOpen(false); }}>FIND A STORE</div>

          <div className="mobile-menu-divider" />

          <div className="mobile-menu-btns">
            {user ? (
              <>
                <div style={{ fontSize: '13px', color: '#555', marginBottom: '6px' }}>{user.email}</div>
                <button
                  className="btn-outline"
                  onClick={handleLogout}
                  style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button className="btn-outline" style={{ width: '100%', padding: '10px', fontSize: '13px' }} onClick={() => { router.push('/signin'); setMobileOpen(false); }}>
                  Sign in
                </button>
                <button className="btn-black" style={{ width: '100%', padding: '10px', fontSize: '13px' }} onClick={() => { router.push('/joinnow'); setMobileOpen(false); }}>
                  Join now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
