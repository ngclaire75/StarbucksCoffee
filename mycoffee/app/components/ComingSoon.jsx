'use client';
import { useRouter } from 'next/navigation';
import './coming-soon.css';

export default function ComingSoon({ title, icon }) {
  const router = useRouter();

  return (
    <div className="cs-root">
      <div className="cs-content">
        <div className="cs-star-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>

        <p className="cs-eyebrow">Coming Soon</p>
        <h1 className="cs-title">We&apos;re working on it</h1>
        <p className="cs-subtitle">
          This content isn&apos;t available yet. Check back soon for more from Starbucks.
        </p>

        <button className="cs-btn" onClick={() => router.back()}>Got it</button>
      </div>
    </div>
  );
}
