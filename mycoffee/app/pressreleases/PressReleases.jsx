'use client';

import { useState, useEffect, useCallback } from 'react';
import './releases.css';
import HeaderFooter from '../components/headerfooter';
import PagesList from '../pageslist';
import { useRouter } from 'next/navigation';

const YEARS = ['All', '2026', '2025'];
const CATS  = ['All', 'Financial', 'Sustainability', 'Product', 'Partnership', 'Community', 'Technology'];

const RELEASES = [
  { date: 'Mar 19, 2026', year: '2026', cat: 'Financial',      title: 'Starbucks Reports Q1 FY2026 Fiscal Quarter Results' },
  { date: 'Feb 28, 2026', year: '2026', cat: 'Partnership',    title: 'Starbucks and Nestlé Expand Global Coffee Alliance to 12 New Markets' },
  { date: 'Feb 14, 2026', year: '2026', cat: 'Sustainability', title: 'Starbucks Announces 50% Carbon Reduction Three Years Ahead of Schedule' },
  { date: 'Jan 22, 2026', year: '2026', cat: 'Product',        title: 'Starbucks Introduces New Spring 2026 Beverage Menu Across North America' },
  { date: 'Jan 8, 2026',  year: '2026', cat: 'Community',      title: 'The Starbucks Foundation Awards $5M in Community Resilience Grants' },
  { date: 'Dec 12, 2025', year: '2025', cat: 'Technology',     title: 'Starbucks Launches AI-Powered Personalization Engine in Mobile App' },
  { date: 'Nov 5, 2025',  year: '2025', cat: 'Sustainability', title: 'Starbucks Opens Its 1,000th LEED-Certified Store Globally' },
  { date: 'Oct 30, 2025', year: '2025', cat: 'Financial',      title: 'Starbucks Reports Q4 FY2025 Results and Issues FY2026 Guidance' },
  { date: 'Sep 18, 2025', year: '2025', cat: 'Partnership',    title: 'Starbucks Partners with Oatly for Expanded Plant-Based Milk Program' },
  { date: 'Aug 3, 2025',  year: '2025', cat: 'Product',        title: 'Starbucks Debuts Oleato Olive Oil Beverage Line Across North America' },
];

const CAT_COLORS = {
  Financial:     { bg: 'rgba(21,101,192,0.08)',  text: '#1565C0' },
  Partnership:   { bg: 'rgba(106,27,154,0.08)',  text: '#6A1B9A' },
  Sustainability:{ bg: 'rgba(0,112,74,0.08)',    text: '#00704A' },
  Product:       { bg: 'rgba(230,81,0,0.08)',    text: '#E65100' },
  Community:     { bg: 'rgba(0,105,92,0.08)',    text: '#00695C' },
  Technology:    { bg: 'rgba(55,71,79,0.08)',    text: '#37474F' },
};

const REPORTS = [
  { img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80&auto=format&fit=crop', tag: 'Annual Report', title: '2025 Global Environmental & Social Impact Report',  excerpt: 'Our comprehensive look at progress toward becoming resource positive by 2030.' },
  { img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80&auto=format&fit=crop',    tag: 'Foundation',    title: 'Starbucks Foundation 2025 Impact Report',           excerpt: 'How our grants and programs are creating opportunity around the world.' },
  { img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop', tag: 'Sourcing',      title: 'Coffee Sourcing & C.A.F.E. Practices Report 2025', excerpt: 'Transparency across our global supply chain and farmer support programs.' },
];

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="pr-toast">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {message}
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('pr-reveal--visible'); io.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.pr-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function PressReleases() {
  const [activeYear, setActiveYear] = useState('All');
  const [activeCat,  setActiveCat]  = useState('All');
  const [fadingY,    setFadingY]    = useState(false);
  const [fadingC,    setFadingC]    = useState(false);
  const [toast,      setToast]      = useState(null);
  const router = useRouter();
  useScrollReveal();

  const triggerToast = useCallback(msg => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
  }, []);

  const switchYear = useCallback(y => {
    if (y === activeYear) return;
    setFadingY(true);
    setTimeout(() => { setActiveYear(y); setFadingY(false); }, 220);
  }, [activeYear]);

  const switchCat = useCallback(c => {
    if (c === activeCat) return;
    setFadingC(true);
    setTimeout(() => { setActiveCat(c); setFadingC(false); }, 220);
  }, [activeCat]);

  const filtered = RELEASES.filter(r =>
    (activeYear === 'All' || r.year === activeYear) &&
    (activeCat  === 'All' || r.cat  === activeCat)
  );

  const downloadReport = title => triggerToast(`Downloading "${title.slice(0, 30)}…"`);

  return (
    <HeaderFooter hideIcons>
      {toast && <Toast key={toast + Date.now()} message={toast} onDone={() => setToast(null)} />}
      <div className="pr-root">

        {/* ── Broadsheet header ── */}
        <div className="pr-broadsheet">
          <div className="pr-broadsheet-rule" />
          <div className="pr-broadsheet-top">
            <span className="pr-broadsheet-label">Starbucks News · Press Wire</span>
            <span className="pr-broadsheet-issue">Vol. 2 · 2026</span>
          </div>
          <div className="pr-broadsheet-body">
            <div>
              <h1 className="pr-broadsheet-title">Press Releases</h1>
              <p className="pr-broadsheet-sub">
                Official announcements, financial results, and corporate news from Starbucks Corporation.
              </p>
            </div>
            <div>
              <div className="pr-latest-card" onClick={() => router.push('/medialibrary')}>
                <div className="pr-latest-label">Latest Release · {RELEASES[0].date}</div>
                <div className="pr-latest-title">{RELEASES[0].title}</div>
                <button className="pr-latest-btn">View Release</button>
              </div>
            </div>
          </div>
          <div className="pr-watermark" aria-hidden>P</div>
        </div>

        <div className="pr-content">

          {/* ── Section head + filters ── */}
          <div className="pr-section-head">
            <h2 className="pr-section-title">
              All Releases
              <span className="pr-count">({filtered.length})</span>
            </h2>
            <a
              href="/medialibrary"
              className="pr-media-link"
              onClick={e => { e.preventDefault(); router.push('/medialibrary'); }}
            >
              Media Library
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          <div className="pr-filters">
            <div className="pr-tab-row">
              {YEARS.map(y => (
                <button key={y} className={`pr-tab${activeYear === y ? ' pr-tab--active' : ''}`} onClick={() => switchYear(y)}>{y}</button>
              ))}
            </div>
            <div className="pr-tab-row">
              {CATS.map(c => (
                <button
                  key={c}
                  className={`pr-tab${activeCat === c ? ' pr-tab--active' : ''}`}
                  onClick={() => switchCat(c)}
                  style={activeCat === c ? {} : CAT_COLORS[c] ? { color: CAT_COLORS[c].text, borderColor: CAT_COLORS[c].text + '55' } : {}}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ── Release list ── */}
          <ul className={`pr-list${fadingY || fadingC ? ' pr-list--fading' : ''}`}>
            {filtered.length ? filtered.map((r, i) => (
              <li
                key={r.title}
                className="pr-item"
                style={{ transitionDelay: `${i * 0.03}s` }}
                onClick={() => router.push('/medialibrary')}
              >
                <span className="pr-item-date">{r.date}</span>
                <div className="pr-item-body">
                  <span
                    className="pr-item-cat"
                    style={{ color: CAT_COLORS[r.cat]?.text || '#00704A', background: CAT_COLORS[r.cat]?.bg || 'rgba(0,112,74,0.08)' }}
                  >
                    {r.cat}
                  </span>
                  <div className="pr-item-title">{r.title}</div>
                </div>
                <svg className="pr-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </li>
            )) : (
              <li className="pr-no-results">No releases match the selected filters.</li>
            )}
          </ul>

          {/* ── Featured reports ── */}
          <div className="pr-section-head pr-reveal" style={{ marginTop: 72 }}>
            <h2 className="pr-section-title">Featured Reports</h2>
          </div>

          <div className="pr-reports-grid pr-reveal">
            {REPORTS.map((r, i) => (
              <div key={r.title} className="pr-report-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="pr-report-img-wrap">
                  <img src={r.img} alt={r.tag} className="pr-report-img" />
                </div>
                <div className="pr-report-body">
                  <div className="pr-report-tag">{r.tag}</div>
                  <h3 className="pr-report-title">{r.title}</h3>
                  <p className="pr-report-excerpt">{r.excerpt}</p>
                  <button className="pr-report-dl" onClick={() => downloadReport(r.title)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── CTA ── */}
        <div className="pr-cta">
          <div>
            <h3>Media Inquiries</h3>
            <p>For press contact, interview requests, and urgent media matters — we're here.</p>
          </div>
          <a href="/contactus" className="pr-cta-link">
            Contact Press Team
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
