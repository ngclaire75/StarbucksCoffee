'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './cookie-prefs.css';

const OPTIONS = [
  {
    id: 'necessary',
    title: 'Strictly Necessary and Functional Cookies',
    desc: 'These cookies and tracking technologies are necessary for our site to function and display content, like maps, fonts, or video. They usually enable functions in response to actions made by you, and may be used to enable enhanced functionality like remembering your preferences or log-in.',
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    desc: 'These cookies and tracking technologies allow us to analyze and measure site usage, testing and performance.',
  },
  {
    id: 'advertising',
    title: 'Advertising Cookies',
    desc: 'These cookies and tracking technologies may be set by us or our advertising partners to show you ads that may be of interest to you.',
  },
];

export default function CookiePreferences() {
  const router = useRouter();
  const [selected, setSelected] = useState('necessary');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => router.back(), 1800);
  };

  return (
    <div className="cp-root">
      <div className="cp-card">

        {/* Header */}
        <div className="cp-header">
          <h1 className="cp-title">Choose your cookie settings</h1>
          <button className="cp-close" onClick={() => router.back()} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="cp-options">
          {OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className={`cp-option${selected === opt.id ? ' selected' : ''}`}
              onClick={() => setSelected(opt.id)}
            >
              <div className="cp-radio">
                <div className="cp-radio-dot" />
              </div>
              <div className="cp-option-body">
                <p className="cp-option-title">{opt.title}</p>
                <p className="cp-option-desc">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="cp-footer">
          <a href="/privacynotice" className="cp-privacy-link">Privacy Notice</a>
          <button className="cp-save-btn" onClick={handleSave}>Save Settings</button>
        </div>

        {saved && (
          <div className="cp-toast">
            Your cookie preferences have been saved.
          </div>
        )}

      </div>
    </div>
  );
}
