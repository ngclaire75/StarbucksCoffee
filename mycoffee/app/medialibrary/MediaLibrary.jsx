'use client';

import { useState, useEffect, useCallback } from 'react';
import './media.css';
import HeaderFooter from '../components/headerfooter';
import PagesList from '../pageslist';

const ASSETS = [
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop', label: 'Leadership Portraits' },
  { src: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80&auto=format&fit=crop', label: 'Storefront Exteriors' },
  { src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80&auto=format&fit=crop', label: 'Craft & Espresso' },
];

const RECENT_ALL = [
  { src: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80&auto=format&fit=crop',  label: 'Spring Matcha Latte' },
  { src: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80&auto=format&fit=crop', label: 'Coconut Cold Brew' },
  { src: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80&auto=format&fit=crop', label: 'Ube Coconut Macchiato' },
  { src: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80&auto=format&fit=crop', label: 'Lite Bites Collection' },
  { src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&auto=format&fit=crop', label: 'Caramel Macchiato' },
  { src: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&q=80&auto=format&fit=crop', label: 'Latte Art Series' },
  { src: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80&auto=format&fit=crop', label: 'Classic Drip Coffee' },
  { src: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80&auto=format&fit=crop', label: 'Reserve Bar Experience' },
  { src: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80&auto=format&fit=crop', label: 'Holiday Cup Collection' },
  { src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80&auto=format&fit=crop', label: 'Refreshers Line' },
  { src: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80&auto=format&fit=crop', label: 'Frappuccino Collection' },
  { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80&auto=format&fit=crop', label: 'Coffeehouse Atmosphere' },
];

const KITS = [
  { date: 'Mar 2026', tag: 'Brand Assets',   title: 'Starbucks Logo & Brand Guidelines 2026',    size: '14.2 MB' },
  { date: 'Feb 2026', tag: 'Product Photos', title: 'Spring 2026 Beverage Photography Pack',     size: '82 MB'  },
  { date: 'Jan 2026', tag: 'Store Images',   title: 'Global Coffeehouse Interiors Collection',   size: '56 MB'  },
  { date: 'Dec 2025', tag: 'Campaign',       title: 'Every Table Has a Story — Full Media Kit',  size: '104 MB' },
  { date: 'Nov 2025', tag: 'Executive',      title: 'Leadership & Board Photography 2025',        size: '38 MB'  },
];

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="np-toast">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.np-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('np-reveal--visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function MediaLibrary() {
  const [query, setQuery]           = useState('');
  const [toast, setToast]           = useState(null);
  const [logoLabel, setLogoLabel]   = useState('Download');
  const [showAllRecent, setShowAll] = useState(false);
  useScrollReveal();

  const displayRecent = showAllRecent ? RECENT_ALL : RECENT_ALL.slice(0, 4);

  const triggerToast = useCallback(msg => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
  }, []);

  const downloadLogo = () => {
    setLogoLabel('Downloaded!');
    triggerToast('Starbucks Logo downloaded');
    setTimeout(() => setLogoLabel('Download'), 2500);
  };

  const downloadAsset = label => triggerToast(`"${label}" added to download queue`);
  const downloadKit   = title => triggerToast(`"${title.slice(0, 32)}…" downloading`);

  const filteredKits = KITS.filter(k =>
    !query || k.title.toLowerCase().includes(query.toLowerCase()) || k.tag.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) triggerToast(`Showing results for "${query}"`);
  };

  return (
    <HeaderFooter hideIcons>
      {toast && <Toast key={toast + Date.now()} message={toast} onDone={() => setToast(null)} />}

      {/* ── Hero ── */}
      <section className="ml-hero">
        <p className="ml-hero-eyebrow">Press Center</p>
        <h1 className="ml-hero-title">Media <span>Library</span></h1>
        <form className="ml-search-wrap" onSubmit={handleSearch}>
          <span className="ml-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="ml-search-input"
            placeholder="Search press kits, photos, logos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="ml-search-btn">Search</button>
        </form>
      </section>

      <div className="ml-body">

        {/* ── Logo download row ── */}
        <div className="ml-logo-row">
          <div className="ml-logo-inner">
            <div className="ml-logo-thumb">
              <img src="/images/Starbucks-Logo.png" alt="Starbucks Logo" />
            </div>
            <div className="ml-logo-info">
              <div className="ml-logo-title">Starbucks Logo</div>
              <div className="ml-logo-sub">SVG, PNG — All variants included · 14.2 MB</div>
            </div>
            <button className="ml-download-btn" onClick={downloadLogo}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {logoLabel}
            </button>
          </div>
        </div>

        {/* ── Media assets ── */}
        <section className="ml-section np-reveal">
          <div className="ml-section-head">
            <h2 className="ml-section-title">Starbucks Media Assets</h2>
          </div>
          <div className="ml-assets-grid">
            {ASSETS.map(a => (
              <div key={a.label} className="ml-asset-item">
                <img src={a.src} alt={a.label} />
                <div className="ml-asset-overlay">
                  <span className="ml-asset-label">{a.label}</span>
                  <button className="ml-asset-dl" onClick={() => downloadAsset(a.label)}>
                    Download Hi-Res
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="ml-divider" />

        {/* ── Recently added ── */}
        <section className="ml-section np-reveal">
          <div className="ml-section-head">
            <h2 className="ml-section-title">
              Recently Added
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginLeft: 10 }}>
                {showAllRecent ? RECENT_ALL.length : 4} of {RECENT_ALL.length}
              </span>
            </h2>
            <button
              className="ml-view-all"
              onClick={() => setShowAll(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {showAllRecent ? 'Show Less' : 'View All'}
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)', transform: showAllRecent ? 'rotate(90deg)' : 'none' }}
              >
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
          <div
            className="ml-recent-grid"
            style={{
              gridTemplateColumns: showAllRecent ? 'repeat(6, 1fr)' : 'repeat(4, 1fr)',
              transition: 'grid-template-columns 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {displayRecent.map((r, i) => (
              <div
                key={r.label}
                className="ml-recent-item"
                title={r.label}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <img src={r.src} alt={r.label} />
              </div>
            ))}
          </div>
          {showAllRecent && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                onClick={() => setShowAll(false)}
                style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.5)', borderRadius: 9999,
                  padding: '10px 28px', fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(203,162,88,0.4)'; e.currentTarget.style.color = '#CBA258'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                Show Less ↑
              </button>
            </div>
          )}
        </section>

        <hr className="ml-divider" />

        {/* ── Press kits ── */}
        <section className="ml-section np-reveal">
          <div className="ml-section-head">
            <h2 className="ml-section-title">
              Press Kits
              {query && (
                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#767676', marginLeft: 10 }}>
                  — {filteredKits.length} result{filteredKits.length !== 1 ? 's' : ''} for "{query}"
                </span>
              )}
            </h2>
          </div>
          <ul className="ml-kit-list">
            {filteredKits.length ? filteredKits.map(k => (
              <li key={k.title} className="ml-kit-item" onClick={() => downloadKit(k.title)}>
                <span className="ml-kit-date">{k.date}</span>
                <span className="ml-kit-tag">{k.tag}</span>
                <span className="ml-kit-title">{k.title}</span>
                <span className="ml-kit-size">{k.size}</span>
                <svg className="ml-kit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </li>
            )) : (
              <li style={{ padding: '32px 0', textAlign: 'center', color: '#999', fontSize: '0.95rem', listStyle: 'none' }}>
                No press kits match "{query}". Try a different keyword.
              </li>
            )}
          </ul>
        </section>

        {/* ── CTA ── */}
        <div className="np-cta-strip">
          <div>
            <h3>Need Custom Assets?</h3>
            <p>Our communications team handles specific requests, interviews, and custom asset packages.</p>
          </div>
          <a href="/contactus" className="np-cta-btn">
            Contact Media Team
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

      </div>

      <PagesList />
    </HeaderFooter>
  );
}
