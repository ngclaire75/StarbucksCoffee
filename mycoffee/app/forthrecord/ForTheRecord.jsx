'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import './record.css';
import HeaderFooter from '../components/headerfooter';
import PagesList from '../pageslist';
import { useRouter } from 'next/navigation';

const RECORDS = [
  {
    claim: 'Misinformation', claimColor: '#E53935',
    heading: 'On our commitment to partners',
    response: 'Starbucks is proud to offer industry-leading benefits to all eligible partners, including full healthcare coverage, stock options through Bean Stock, and full tuition assistance through the College Achievement Plan. Our average U.S. partner wage is now above $17/hour. We remain committed to being an employer of choice.',
  },
  {
    claim: 'Report Correction', claimColor: '#F59E0B',
    heading: 'On our environmental progress',
    response: 'Contrary to recent reports, Starbucks has reduced its carbon footprint by over 30% since 2015. Our reusable cup program has prevented millions of disposable cups from landfills annually. We remain on track for our 2030 resource-positive goals, having already met several interim milestones ahead of schedule.',
  },
  {
    claim: 'Clarification', claimColor: '#3B82F6',
    heading: 'On our sourcing practices',
    response: "Over 99% of our coffee is ethically sourced under C.A.F.E. Practices — one of the world's largest ethical sourcing verification programs. We partner directly with farmers in 30+ countries, operate six Farmer Support Centers globally, and provide agronomic assistance to thousands of farming families each year.",
  },
  {
    claim: 'Statement', claimColor: '#22C55E',
    heading: 'On labor relations',
    response: 'Starbucks respects the rights of all partners and is committed to constructive, good-faith dialogue. We have made significant investments in wages, scheduling transparency, and mental health benefits. Our Employee Assistance Program provides free counseling and support to all partners and their families.',
  },
  {
    claim: 'Clarification', claimColor: '#3B82F6',
    heading: 'On our pricing decisions',
    response: 'Beverage pricing reflects our ethically sourced ingredients, the craft and expertise of our partners, and our significant investments in wages and benefits. We offer a wide range of price points and continue to expand our Starbucks Rewards program to deliver more value to our most loyal customers.',
  },
];

const STATS = [
  { value: 99, suffix: '%+', label: 'Ethically sourced coffee' },
  { value: 400, suffix: 'K+', label: 'Partners worldwide' },
  { value: 30, suffix: '%', label: 'Carbon footprint reduced' },
];

const STATEMENTS = [
  { img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&auto=format&fit=crop', tag: 'Partners',    title: 'Our commitment to every partner who wears the green apron',           excerpt: 'A direct message from our CEO on wages, scheduling, benefits, and the partner experience.' },
  { img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80&auto=format&fit=crop', tag: 'Environment', title: "The real story on Starbucks' environmental footprint and 2030 goals", excerpt: 'Facts, data, and our transparent roadmap for becoming a resource-positive company.' },
  { img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80&auto=format&fit=crop',    tag: 'Community',   title: 'Starbucks gives back: $100M+ in community investment since 2021',     excerpt: "The Starbucks Foundation's grant programs and how we measure our community impact." },
];

/* Animated counter */
function Counter({ value, suffix, label }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return;
      ran.current = true;
      const dur = 1600;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(ease * value));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="ftr-stat">
      <div className="ftr-stat-num">{display}{suffix}</div>
      <div className="ftr-stat-label">{label}</div>
    </div>
  );
}

/* Accordion item */
function AccordionItem({ record, index, expanded, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);
  const open = expanded === index;

  useEffect(() => {
    if (!bodyRef.current) return;
    setHeight(open ? bodyRef.current.scrollHeight : 0);
  }, [open]);

  return (
    <div className={`ftr-item${open ? ' ftr-item--open' : ''} ftr-item--visible`} style={{ transitionDelay: `${index * 0.06}s` }}>
      <button className="ftr-item-btn" onClick={() => onToggle(open ? null : index)} aria-expanded={open}>
        <div className="ftr-item-num">0{index + 1}</div>
        <div className="ftr-item-left">
          <div className="ftr-item-claim" style={{ color: record.claimColor }}>{record.claim}</div>
          <div className="ftr-item-heading">{record.heading}</div>
        </div>
        <svg
          className="ftr-chevron"
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="ftr-item-body-wrap" style={{ maxHeight: height }}>
        <div className="ftr-item-body" ref={bodyRef}>
          {record.response}
        </div>
      </div>
    </div>
  );
}

export default function ForTheRecord() {
  const [expanded, setExpanded] = useState(null);
  const router = useRouter();
  const handleToggle = useCallback(i => setExpanded(i), []);

  return (
    <HeaderFooter hideIcons>
      <div className="ftr-root">

        {/* Gold top rule */}
        <div className="ftr-rule" />

        {/* ── Hero ── */}
        <div className="ftr-hero">
          <div className="ftr-hero-inner">
            <span className="ftr-eyebrow">Starbucks News</span>
            <h1 className="ftr-hero-title">Starbucks for the Record</h1>
            <p className="ftr-hero-desc">
              Accurate information, official statements, and direct responses to misinformation about Starbucks.
            </p>
          </div>
          <div className="ftr-hero-deco" aria-hidden>
            <span className="ftr-hero-deco-mark">#</span>
            <span className="ftr-hero-deco-tag">For the Record</span>
          </div>
        </div>

        {/* ── Animated stats bar ── */}
        <div className="ftr-stats">
          <div className="ftr-stats-inner">
            {STATS.map(s => (
              <Counter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>

        {/* ── Accordion ── */}
        <div className="ftr-section">
          <div className="ftr-section-head">
            <div className="ftr-section-title">Setting the Record Straight</div>
            <div className="ftr-section-hint">Click any item to read our full response</div>
          </div>
          <div className="ftr-divider" />
          <div className="ftr-accordion">
            {RECORDS.map((r, i) => (
              <AccordionItem
                key={r.heading}
                record={r}
                index={i}
                expanded={expanded}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        {/* ── Submit correction ── */}
        <div className="ftr-correction">
          <div>
            <div className="ftr-correction-eyebrow">Spotted Something?</div>
            <h3>Submit a correction request</h3>
            <p>If you've seen inaccurate reporting about Starbucks, our communications team wants to know.</p>
          </div>
          <a href="/contactus" className="ftr-correction-btn">Contact Us →</a>
        </div>

        {/* ── Recent statements ── */}
        <div className="ftr-statements">
          <div className="ftr-stmt-head">
            <h2 className="ftr-stmt-title">Recent Statements</h2>
            <button className="ftr-stmt-more" onClick={() => router.push('/storiessubpage')}>
              More Stories
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
          <div className="ftr-stmt-grid">
            {STATEMENTS.map((s, i) => (
              <div
                key={s.title}
                className="ftr-stmt-card ftr-stmt-card--visible"
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={() => router.push('/storiessubpage')}
              >
                <div className="ftr-stmt-img-wrap">
                  <img src={s.img} alt={s.tag} className="ftr-stmt-img" />
                </div>
                <div className="ftr-stmt-body">
                  <div className="ftr-stmt-tag">{s.tag}</div>
                  <div className="ftr-stmt-name">{s.title}</div>
                  <p className="ftr-stmt-excerpt">{s.excerpt}</p>
                  <button className="ftr-stmt-link" onClick={e => { e.stopPropagation(); router.push('/storiessubpage'); }}>
                    Read Statement →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="ftr-cta">
          <div>
            <h3>Have a Question?</h3>
            <p>Our communications team handles media inquiries, correction requests, and factual queries.</p>
          </div>
          <a href="/contactus" className="ftr-cta-link">
            Reach Our Team
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
