'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './legal-page.css';

export default function LegalPage({ title, body }) {
  const router  = useRouter();
  const rootRef = useRef(null);
  const imgRef  = useRef(null);

  /* ── Lerp-based smooth 3-D tilt ──────────────────────────────────────── */
  useEffect(() => {
    const el  = rootRef.current;
    const img = imgRef.current;
    if (!el || !img) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId;

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.055);
      currentY = lerp(currentY, targetY, 0.055);
      img.style.transform =
        `scale(1.16) rotateY(${currentX * 13}deg) rotateX(${currentY * -10}deg)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="lp-root">

      {/* ── 3-D tilting background ───────────────────────────────────── */}
      <div className="lp-perspective">
        <img
          ref={imgRef}
          src="/images/mountain.png"
          alt=""
          className="lp-bg-img"
          draggable={false}
        />
      </div>

      {/* ── Soft edge vignette only (no dark overlay) ───────────────── */}
      <div className="lp-vignette" />

      {/* ── Lens flares ──────────────────────────────────────────────── */}
      <div className="lp-flare lp-flare-1" />
      <div className="lp-flare lp-flare-2" />
      <div className="lp-flare lp-flare-3" />
      <div className="lp-flare lp-flare-4" />

      {/* ── Fuji light-leak strip ────────────────────────────────────── */}
      <div className="lp-leak" />

      {/* ── Horizontal frosted band behind card ─────────────────────── */}
      <div className="lp-band" />

      {/* ── Film grain ───────────────────────────────────────────────── */}
      <div className="lp-grain" />

      {/* ── Floating orbs ────────────────────────────────────────────── */}
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />
      <div className="lp-orb lp-orb-3" />

      {/* ── Glass card ───────────────────────────────────────────────── */}
      <div className="lp-card">
        {/* card inner shine sweep */}
        <div className="lp-card-shine" />

        <p className="lp-eyebrow">Starbucks</p>
        <h1 className="lp-title">{title}</h1>
        <div className="lp-divider" />
        <p className="lp-body">
          {body || 'This page will be available for viewing in the future.'}
        </p>
        <button className="lp-back" onClick={() => router.back()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Go back
        </button>
      </div>

    </div>
  );
}
