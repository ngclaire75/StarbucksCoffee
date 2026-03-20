'use client';

import React, { useState, useEffect } from 'react';
import '../ourcoffeepage/ourcoffee.css';
import { useLanguage } from '../contexts/LanguageContext';

const ExternalIcon = () => (
  <span className="external-icon">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  </span>
);

const Footer = () => {
  const { t, lang, setLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [sessionEmail, setSessionEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-fill from signed-in session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.email) {
          setEmail(d.user.email);
          setSessionEmail(d.user.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!email) {
      setMessage('Please enter a valid email address.');
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setIsError(true);
      } else {
        setMessage('Thank you for subscribing! A confirmation has been sent to your email.');
        setIsError(false);
        if (!sessionEmail) setEmail('');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer-section">

      {/* Top Dark Green Section */}
      <div className="footer-top">
        <div className="footer-logo-text">
          THE STARBUCKS<br />
          COFFEE COMPANY
        </div>
        <a href="/ourvalues" className="footer-values-link">
          <span className="arrow-circle">→</span>
          <span className="footer-link-text">{t('footer.values')}</span>
        </a>
      </div>

      {/* Bottom White Section */}
      <div className="footer-wrapper">
        <div className="footer-bottom">

          {/* Footer Main Content */}
          <div className="footer-main">

            {/* Left Column - Stay In Touch */}
            <div className="footer-column footer-stay-in-touch">
              <h3>{t('footer.stay')}</h3>
              <p>{t('footer.subscribe')}</p>

              <form id="footerForm" className="footer-form" onSubmit={handleSubmit}>
                <label htmlFor="footer-email">{t('footer.email')}</label>
                <input
                  type="email"
                  id="footer-email"
                  name="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => { if (!sessionEmail) setEmail(e.target.value); }}
                  readOnly={!!sessionEmail}
                  style={sessionEmail ? { background: '#f5f5f5', cursor: 'default', color: '#444' } : {}}
                />
                <button type="submit" className="footer-signup-btn" disabled={loading}>
                  {loading ? (
                    <span className="loading-dots">
                      <span /><span /><span />
                    </span>
                  ) : t('footer.signup')}
                </button>
              </form>

              {message && (
                <div
                  id="message"
                  style={{
                    marginTop: '10px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: isError ? '#c0392b' : '#00754a',
                    fontWeight: '600',
                  }}
                >
                  {message}
                </div>
              )}

              <div className="footer-social-icons">
                <a href="https://www.instagram.com/starbucks" target="_blank" rel="noopener noreferrer" className="social-icon"><img src="/images/social-media.png" alt="Instagram" /></a>
                <a href="https://www.threads.net/@starbucks" target="_blank" rel="noopener noreferrer" className="social-icon"><img src="/images/threads.png" alt="Threads" /></a>
                <a href="https://www.tiktok.com/@starbucks" target="_blank" rel="noopener noreferrer" className="social-icon"><img src="/images/tik-tok.png" alt="TikTok" /></a>
                <a href="https://www.youtube.com/starbucks" target="_blank" rel="noopener noreferrer" className="social-icon"><img src="/images/youtube-symbol.png" alt="YouTube" /></a>
              </div>
            </div>

            {/* Right Column - Press Center */}
            <div className="footer-column footer-press-center">
              <h3>{t('footer.press')}</h3>
              <p>{t('footer.pressDesc')}</p>

              <ul className="footer-links">
                <li><a href="/pressreleases">{t('footer.pressReleases')}</a></li>
                <li><a href="/companynews">{t('footer.companyNews')}</a></li>
                <li><a href="/forthrecord">{t('footer.forRecord')}</a></li>
                <li><a href="/leadership">{t('footer.leadership')}</a></li>
              </ul>
            </div>

          </div>{/* end footer-main */}

          {/* Divider */}
          <div className="footer-divider">
            <hr />
            <img src="/images/Starbucks-Logo.png" alt="Starbucks Logo" className="footer-divider-logo" />
            <hr />
          </div>

          {/* Bottom Links */}
          <div className="footer-bottom-links">
            <a href="https://www.starbucks.com" target="_blank" rel="noopener noreferrer">Starbucks.com <ExternalIcon /></a>
            <a href="/careers">{t('footer.careers')}</a>
            <a href="/reserve">{t('footer.reserve')}</a>
            <a href="/athome">{t('footer.athome')}</a>
          </div>

          {/* Footer Regions */}
          <div className="footer-regions">
            <div className="region-group">
              <h4>Canada</h4>
              <button className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`} onClick={() => setLang('en')}>English <ExternalIcon /></button>
              <button className={`lang-btn${lang === 'fr' ? ' lang-btn-active' : ''}`} onClick={() => setLang('fr')}>Français <ExternalIcon /></button>
            </div>
            <div className="region-group">
              <h4>USA</h4>
              <button className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`} onClick={() => setLang('en')}>English <ExternalIcon /></button>
            </div>
            <div className="region-group">
              <h4>EMEA</h4>
              <button className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`} onClick={() => setLang('en')}>English <ExternalIcon /></button>
            </div>
            <div className="region-group">
              <h4>Latin America</h4>
              <button className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`} onClick={() => setLang('en')}>English <ExternalIcon /></button>
              <button className={`lang-btn${lang === 'es' ? ' lang-btn-active' : ''}`} onClick={() => setLang('es')}>Español <ExternalIcon /></button>
              <button className={`lang-btn${lang === 'pt' ? ' lang-btn-active' : ''}`} onClick={() => setLang('pt')}>Português <ExternalIcon /></button>
            </div>
            <div className="region-group">
              <h4>Asia</h4>
              <button className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`} onClick={() => setLang('en')}>English <ExternalIcon /></button>
            </div>
            <div className="region-group">
              <h4>Japan</h4>
              <button className={`lang-btn lang-btn-ja${lang === 'ja' ? ' lang-btn-active' : ''}`} onClick={() => setLang('ja')}>日本語 <ExternalIcon /></button>
            </div>
          </div>
          <hr className="footer-regions-line" />

          {/* Footer Legal */}
          <div className="footer-legal">
            <a href="https://www.starbucks.com" target="_blank" rel="noopener noreferrer">Starbucks.com <ExternalIcon /></a>
            <a href="/accessibility">{t('footer.accessibility')}</a>
            <a href="/privacynotice">{t('footer.privacy')}</a>
            <a href="/donotsell">{t('footer.donotsell')}</a>
            <a href="/cookiepreferences">{t('footer.cookies')}</a>
            <span className="copyright">{t('footer.copyright')}</span>
          </div>

        </div>{/* end footer-bottom */}
      </div>{/* end footer-wrapper */}

    </footer>
  );
};

export default Footer;
