"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import "./coming-soon.css";

const StarIcon = () => (
  <polygon
    points="40,25 43.53,35.15 54.27,35.37 45.71,41.85 48.82,52.14 40,46 31.18,52.14 34.29,41.85 25.73,35.37 36.47,35.15"
    fill="white"
  />
);

const HeartIcon = () => (
  <path
    d="M40,55 C40,55 25,46 25,35 C25,29 29,25 34.5,25 C37.6,25 40,28 40,30.5 C40,28 42.4,25 45.5,25 C51,25 55,29 55,35 C55,46 40,55 40,55Z"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinejoin="round"
  />
);

const ICONS = { star: StarIcon, heart: HeartIcon };

const MESSAGE = "This page will be available for viewing in the future.";

export default function ComingSoon({ title, icon }) {
  const [typed, setTyped]       = useState("");
  const [cursorOn, setCursorOn] = useState(true);
  const [phase, setPhase]       = useState("idle"); // idle | typing | done
  const router = useRouter();

  // Delay start by 600ms then type
  useEffect(() => {
    const t = setTimeout(() => setPhase("typing"), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typed.length >= MESSAGE.length) { setPhase("done"); return; }
    const t = setTimeout(() => setTyped(MESSAGE.slice(0, typed.length + 1)), 42);
    return () => clearTimeout(t);
  }, [phase, typed]);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursorOn(c => !c), 500);
    return () => clearInterval(t);
  }, []);

  // Pre-generate particle config once
  const particles = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      size:     Math.random() * 5 + 2,
      left:     Math.random() * 100,
      delay:    Math.random() * 12,
      duration: Math.random() * 12 + 10,
      opacity:  Math.random() * 0.25 + 0.08,
    })), []);

  return (
    <div className="cs-root">
      {/* Floating particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="cs-particle"
          style={{
            width:             p.size,
            height:            p.size,
            left:              `${p.left}%`,
            opacity:           p.opacity,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Radial glow */}
      <div className="cs-glow" />

      <div className="cs-content">
        {/* Logo circle */}
        <div className="cs-logo-ring">
          <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
            <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.5"/>
            <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.5"
              strokeDasharray="240" strokeDashoffset="0"
              style={{ animation: "cs-dash 2s ease forwards" }}/>
            {(() => {
              if (typeof icon === 'string') {
                const Preset = ICONS[icon];
                if (Preset) return <Preset />;
                return <text x="40" y="50" textAnchor="middle" fontSize="30" fill="white">{icon}</text>;
              }
              return icon;
            })()}
          </svg>
        </div>

        {/* Title */}
        <h1 className="cs-title">{title}</h1>
        <p className="cs-eyebrow">Starbucks</p>

        {/* Typing box */}
        <div className="cs-card">
          <p className="cs-typed">
            {typed}
            <span className="cs-cursor" style={{ opacity: phase === "done" ? 0 : cursorOn ? 1 : 0 }}>
              |
            </span>
          </p>
        </div>

        {/* Back button */}
        <button className="cs-back" onClick={() => router.back()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Go back
        </button>
      </div>
    </div>
  );
}
