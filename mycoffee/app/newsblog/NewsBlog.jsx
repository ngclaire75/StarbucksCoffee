'use client';

import { useState, useEffect, useCallback } from 'react';
import './blog.css';
import HeaderFooter from '../components/headerfooter';
import PagesList from '../pageslist';
import { useRouter } from 'next/navigation';

const CATS = ['All', 'Community', 'Education', 'Coffee', 'Sustainability', 'People', 'Impact'];

const ARTICLES = [
  { img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80&auto=format&fit=crop', tag: 'Community',     date: 'Mar 14, 2026', read: '4 min',  title: 'How Starbucks partners are strengthening neighborhoods one cup at a time',     excerpt: 'From urban cafés to rural communities, our partners bring warmth and connection everywhere.',    wide: true },
  { img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&auto=format&fit=crop', tag: 'Education',     date: 'Mar 8, 2026',  read: '5 min',  title: 'Starbucks College Achievement Plan reaches milestone: 10,000 graduates',       excerpt: 'The Plan continues to transform lives, opening doors that were once out of reach.' },
  { img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80&auto=format&fit=crop', tag: 'Coffee',        date: 'Feb 22, 2026', read: '6 min',  title: "From seed to cup: inside Starbucks' commitment to ethical sourcing",            excerpt: "C.A.F.E. Practices ensure every bean meets our standards for quality and farmer welfare." },
  { img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80&auto=format&fit=crop', tag: 'Sustainability', date: 'Feb 10, 2026', read: '4 min',  title: "Planet-positive packaging: Starbucks' road to 2030 sustainability goals",      excerpt: 'Reusable cups and green energy investments are putting us on track for a resource-positive future.' },
  { img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop', tag: 'People',        date: 'Jan 30, 2026', read: '3 min',  title: "Inclusion in action: Starbucks' belonging programs in 2026",                  excerpt: 'Every partner deserves to feel valued, seen, and heard — and we are making it happen.' },
  { img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80&auto=format&fit=crop',    tag: 'Impact',        date: 'Jan 15, 2026', read: '5 min',  title: 'The Starbucks Foundation awards $5M in community resilience grants',           excerpt: 'Empowering nonprofits and grassroots organizations to build stronger communities.' },
  { img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop', tag: 'Coffee',        date: 'Dec 20, 2025', read: '7 min',  title: 'Climate-resilient coffee: how Starbucks is future-proofing its supply chain', excerpt: 'Working with farmers in 30+ countries to develop drought-resistant varietals.',              wide: true },
  { img: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80&auto=format&fit=crop', tag: 'People',        date: 'Dec 5, 2025',  read: '4 min',  title: "Partner stories: a barista's journey from part-time to store manager",       excerpt: "Meet Priya — whose story is one of thousands made possible by Starbucks opportunities." },
];

function useScrollReveal(selector = '.nb-reveal') {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('nb-reveal--visible'); io.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(selector).forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
}

export default function NewsBlog() {
  const [active, setActive] = useState('All');
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(ARTICLES);
  const router = useRouter();
  useScrollReveal();

  const switchTab = useCallback(cat => {
    if (cat === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(cat);
      setVisible(cat === 'All' ? ARTICLES : ARTICLES.filter(a => a.tag === cat));
      setFading(false);
    }, 220);
  }, [active]);

  const goStories = () => router.push('/storiessubpage');

  return (
    <HeaderFooter hideIcons>
      <div className="nb-root">

        {/* ── Masthead ── */}
        <div className="nb-masthead">
          <div className="nb-masthead-top">
            <span className="nb-masthead-eyebrow">Starbucks News</span>
            <span className="nb-masthead-date">March 2026 · Issue 14</span>
            <span className="nb-masthead-count">{ARTICLES.length} Articles</span>
          </div>
          <h1 className="nb-masthead-title">News <span>Blog</span></h1>
          <p className="nb-masthead-sub">
            Stories, updates, and perspectives from the people behind the green apron — and from around the world.
          </p>
          <div className="nb-masthead-bg-letter" aria-hidden>N</div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="nb-tabs-strip">
          {CATS.map(c => (
            <button
              key={c}
              className={`nb-tab${active === c ? ' nb-tab--active' : ''}`}
              onClick={() => switchTab(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="nb-content">

          {/* ── Featured ── */}
          <div className="nb-section-head nb-reveal" style={{ marginBottom: 20 }}>
            <h2 className="nb-section-title">Featured Story</h2>
          </div>

          <div className="nb-featured nb-reveal">
            <div className="nb-featured-img-wrap">
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop" alt="Featured" className="nb-featured-img" />
              <div className="nb-featured-img-overlay" />
            </div>
            <div className="nb-featured-body">
              <div className="nb-featured-tag">Featured Story</div>
              <h2 className="nb-featured-title">
                Keeping your cup full: How Starbucks is working to save the future of coffee
              </h2>
              <p className="nb-featured-excerpt">
                Climate change threatens coffee-growing regions worldwide. Starbucks is partnering with farmers,
                scientists, and communities to protect the crop — and the culture — we all love.
              </p>
              <button className="nb-featured-btn" onClick={goStories}>
                Read Full Story
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Bento grid ── */}
          <div className="nb-section-head nb-reveal" style={{ marginTop: 48 }}>
            <h2 className="nb-section-title">
              Latest Articles
              <span>({visible.length})</span>
            </h2>
            <button className="nb-see-all" onClick={goStories}>
              All Stories
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>

          {visible.length === 0 ? (
            <div className="nb-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 16, opacity: 0.4 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No articles in this category yet.</p>
            </div>
          ) : (
            <div className={`nb-bento${fading ? ' nb-bento--fading' : ''}`}>
              {visible.map((a, i) => (
                <div
                  key={a.title}
                  className={`nb-card${a.wide ? ' nb-card--wide' : ''}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={goStories}
                >
                  <img src={a.img} alt={a.title} className="nb-card-img" />
                  <div className="nb-card-overlay">
                    <div className="nb-card-tag">{a.tag}</div>
                    <h3 className="nb-card-title">{a.title}</h3>
                    <div className="nb-card-meta">
                      <span className="nb-card-date">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {a.date}
                      </span>
                      <span className="nb-card-read">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {a.read} read
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Newsletter strip ── */}
          <div className="nb-newsletter nb-reveal" style={{ marginTop: 48 }}>
            <div>
              <div className="nb-newsletter-label">Stay Informed</div>
              <h3>Get stories in your inbox</h3>
              <p>Weekly highlights from the Starbucks newsroom, delivered every Thursday.</p>
            </div>
            <button className="nb-newsletter-btn" onClick={goStories}>Subscribe</button>
          </div>

        </div>

        {/* ── CTA ── */}
        <div className="nb-cta">
          <div>
            <h3>More Starbucks Stories</h3>
            <p>Explore the full collection of stories, features, and interviews.</p>
          </div>
          <a href="/storiessubpage" className="nb-cta-link">
            Visit Stories Hub
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
