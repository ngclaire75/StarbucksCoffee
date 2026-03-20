'use client';

import { useEffect, useRef } from 'react';
import HeaderFooter from './headerfooter';
import './topicpage.css';

/* ── COUNT-UP ANIMATION ─────────────────────────────────── */
function parseStatValue(str) {
  if (!str) return { prefix: '', target: 0, suffix: '' };
  const prefix = str.startsWith('$') ? '$' : '';
  const rest = str.replace(/^\$/, '');
  const numMatch = rest.match(/^([\d,]+)/);
  if (!numMatch) return { prefix, target: 0, suffix: rest };
  const target = parseInt(numMatch[1].replace(/,/g, ''), 10);
  const suffix = rest.slice(numMatch[1].length);
  return { prefix, target, suffix };
}

function CountUp({ value, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { prefix, target, suffix } = parseStatValue(value);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1600;
        const startTime = performance.now();
        const tick = (now) => {
          const p = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const current = Math.round(eased * target);
          el.textContent = prefix + (target >= 1000 ? current.toLocaleString() : current) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} className={className}>{value}</span>;
}

/* ── TOPIC META ─────────────────────────────────────────── */
const TOPIC_META = {
  'Drinks & Food':               { stat1: '30,000+', label1: 'Menu items globally',    stat2: '1B+',    label2: 'Cups served yearly',      quote: 'Every sip tells a story of craft, care, and creativity.' },
  'Coffee':                      { stat1: '50+',     label1: 'Years of roasting',       stat2: '400+',   label2: 'Coffee farms partnered',  quote: 'From seed to cup, quality is never an accident.' },
  'Coffeehouse Experience':      { stat1: '35,000+', label1: 'Stores worldwide',        stat2: '100M+',  label2: 'Customers weekly',        quote: 'The third place — where community comes to life.' },
  'Cups & Merch':                { stat1: '100+',    label1: 'New designs yearly',      stat2: '4M+',    label2: 'Tumblers sold annually',  quote: 'Carry the craft. Make every moment yours.' },
  'Annual Impact Report (ESG)':  { stat1: '2030',    label1: 'Net-zero target year',    stat2: '99%',    label2: 'Ethically sourced coffee', quote: 'Accountability is how we turn values into action.' },
  'Belonging at Starbucks':      { stat1: '40%',     label1: 'BIPOC U.S. workforce',    stat2: '50%+',   label2: 'Women in leadership',     quote: 'Everyone deserves a place where they truly belong.' },
  'Communities':                 { stat1: '$100M+',  label1: 'Community investment',    stat2: '8,000+', label2: 'Local grants awarded',    quote: 'Strong communities are the heart of everything we do.' },
  'Farmers':                     { stat1: '30',      label1: 'Countries sourced from',  stat2: '400K+',  label2: 'Farmers supported',       quote: 'When farmers thrive, every cup is better for it.' },
  'Partners (Employees)':        { stat1: '400K+',   label1: 'Partners worldwide',      stat2: '100%',   label2: 'Healthcare eligible',     quote: 'Our partners are the soul of the Starbucks experience.' },
  'The Starbucks Foundation':    { stat1: '$30M+',   label1: 'Grants distributed',      stat2: '7M+',    label2: 'Lives impacted',          quote: 'Opportunity should never be limited by circumstance.' },
  'Sustainability':              { stat1: '50%',     label1: 'Carbon reduction goal',   stat2: '2030',   label2: 'Resource-positive target', quote: 'The planet is our partner. We protect what we love.' },
};

/* ── COMPONENT ──────────────────────────────────────────── */
export default function TopicPage({ title, subtitle, description, image }) {
  const meta = TOPIC_META[title] || {};
  const heroRef = useRef(null);

  useEffect(() => {
    // Hero entrance
    const el = heroRef.current;
    if (el) {
      requestAnimationFrame(() => el.classList.add('tp-hero--visible'));
    }

    // Scroll-reveal for body paragraphs + quote
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('tp-visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.tp-reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <HeaderFooter hideIcons>

      {/* ── HERO ── */}
      <div className="tp-hero" ref={heroRef} style={{ backgroundImage: `url(${image})` }}>
        <div className="tp-hero-overlay" />
        <div className="tp-hero-inner">
          <span className="tp-hero-eyebrow">
            <span className="tp-eyebrow-line" />
            {subtitle || 'Starbucks Stories'}
          </span>
          <h1 className="tp-hero-title">{title}</h1>
          <p className="tp-hero-desc">{description[0]}</p>
        </div>
        <div className="tp-hero-scroll">
          <span>Scroll</span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M6 0v16M1 11l5 5 5-5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      {meta.stat1 && (
        <div className="tp-stats">
          <div className="tp-stat">
            <CountUp value={meta.stat1} className="tp-stat-num" />
            <span className="tp-stat-label">{meta.label1}</span>
          </div>
          <div className="tp-stat-divider" />
          <div className="tp-stat">
            <CountUp value={meta.stat2} className="tp-stat-num" />
            <span className="tp-stat-label">{meta.label2}</span>
          </div>
        </div>
      )}

      {/* ── TWO-COLUMN BODY ── */}
      <section className="tp-body">
        <div className="tp-left">
          <div className="tp-left-sticky">
            <div className="tp-left-accent" />
            <h2 className="tp-left-title">{title}</h2>
            {subtitle && <p className="tp-left-sub">{subtitle}</p>}
          </div>
        </div>
        <div className="tp-right">
          {description.map((para, i) => (
            <p
              key={i}
              className="tp-para tp-reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      {meta.quote && (
        <div className="tp-quote-section tp-reveal">
          <div className="tp-quote-inner">
            {/* Decorative large background quote mark */}
            <svg className="tp-quote-bg-mark" viewBox="0 0 120 90" aria-hidden="true">
              <path d="M0 90V50C0 18 18 4 54 0l7 11C37 15 29 27 29 41h25v49H0zm66 0V50C66 18 84 4 120 0l7 11C103 15 95 27 95 41h25v49H66z" fill="currentColor"/>
            </svg>
            <blockquote className="tp-quote-text">{meta.quote}</blockquote>
            <div className="tp-quote-rule" />
          </div>
        </div>
      )}

      {/* ── IMAGE FEATURE STRIP ── */}
      <div className="tp-strip" style={{ backgroundImage: `url(${image})` }}>
        <div className="tp-strip-overlay" />
        <div className="tp-strip-content">
          <p className="tp-strip-eyebrow">Starbucks &amp; You</p>
          <h3 className="tp-strip-heading">Part of something bigger.</h3>
          <p className="tp-strip-sub">Starbucks connects people, communities, and possibilities — one cup at a time.</p>
          <a href="/ourcoffeepage" className="tp-strip-btn">
            Explore More Stories
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>

    </HeaderFooter>
  );
}
