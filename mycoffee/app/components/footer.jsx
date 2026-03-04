import React, { useState } from 'react';
import '../ourcoffeepage/ourcoffee.css';

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
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setMessage('Thank you for subscribing!');
      setEmail('');
    } else {
      setMessage('Please enter a valid email address.');
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
        <a href="#" className="footer-values-link">
          <span className="arrow-circle">→</span>
          <span className="footer-link-text">Our Values &amp; Commitment</span>
        </a>
      </div>

      {/* Bottom White Section */}
      <div className="footer-wrapper">
        <div className="footer-bottom">

          {/* Footer Main Content */}
          <div className="footer-main">

            {/* Left Column - Stay In Touch */}
            <div className="footer-column footer-stay-in-touch">
              <h3>Stay In Touch</h3>
              <p>Subscribe to all the latest Starbucks stories and news delivered right to your inbox.</p>

              <form id="footerForm" className="footer-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="footer-signup-btn">Sign Up</button>
              </form>

              <div id="message">{message}</div>

              <div className="footer-social-icons">
                <a href="#" className="social-icon"><img src="/images/social-media.png" alt="Instagram" /></a>
                <a href="#" className="social-icon"><img src="/images/threads.png" alt="Spotify" /></a>
                <a href="#" className="social-icon"><img src="/images/tik-tok.png" alt="TikTok" /></a>
                <a href="#" className="social-icon"><img src="/images/youtube-symbol.png" alt="YouTube" /></a>
              </div>
            </div>

            {/* Right Column - Press Center */}
            <div className="footer-column footer-press-center">
              <h3>Press Center</h3>
              <p>All the latest company news and leadership perspectives.</p>

              <ul className="footer-links">
                <li><a href="#">Press Releases</a></li>
                <li><a href="#">Company News</a></li>
                <li><a href="#">Starbucks For The Record</a></li>
                <li>
                  <a href="#">Leadership <ExternalIcon /></a>
                </li>
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
            <a href="#">Starbucks.com <ExternalIcon /></a>
            <a href="#">Career Center <ExternalIcon /></a>
            <a href="#">Reserve <ExternalIcon /></a>
            <a href="#">At Home <ExternalIcon /></a>
          </div>

          {/* Footer Regions */}
          <div className="footer-regions">
            <div className="region-group">
              <h4>Canada</h4>
              <a href="#">English <ExternalIcon /></a>
              <a href="#">Français <ExternalIcon /></a>
            </div>
            <div className="region-group">
              <h4>USA</h4>
              <a href="#">English</a>
            </div>
            <div className="region-group">
              <h4>EMEA</h4>
              <a href="#">English <ExternalIcon /></a>
            </div>
            <div className="region-group">
              <h4>Latin America</h4>
              <a href="#">English <ExternalIcon /></a>
              <a href="#">Español <ExternalIcon /></a>
              <a href="#">Português <ExternalIcon /></a>
            </div>
            <div className="region-group">
              <h4>Asia</h4>
              <a href="#">English <ExternalIcon /></a>
            </div>
            <div className="region-group">
              <h4>Japan</h4>
              <a href="#">日本語 <ExternalIcon /></a>
            </div>
          </div>
          <hr className="footer-regions-line" />

          {/* Footer Legal */}
          <div className="footer-legal">
            <a href="#">Starbucks.com <ExternalIcon /></a>
            <a href="#">Accessibility <ExternalIcon /></a>
            <a href="#">Privacy Notice <ExternalIcon /></a>
            <a href="#">Do Not Share My Personal Information <ExternalIcon /></a>
            <a href="#">Cookie Preferences</a>
            <span className="copyright">© Claire's Starbucks Coffee Website.</span>
          </div>

        </div>{/* end footer-bottom */}
      </div>{/* end footer-wrapper */}

    </footer>
  );
};

export default Footer;