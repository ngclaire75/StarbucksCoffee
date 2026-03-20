'use client';

import { useRouter } from 'next/navigation';
import './legal-page.css';

export default function LegalPage({ title, body }) {
  const router = useRouter();

  return (
    <div className="lp-root">
      <div className="lp-card">
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
