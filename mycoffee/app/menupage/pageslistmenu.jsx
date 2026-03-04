'use client';

import './pageslistmenu.css';

export default function PagesListMenu({ extraHeight = 0 }) {
  return (
    <>
      <section className="menu-footer-links">
        <div className="menu-footer-column">
          <h3>About Us</h3>
          <ul>
            <li><a href="/ourcompanypage">Our Company</a></li>
            <li><a href="/ourcoffeepage">Our Coffee</a></li>
            <li>About Starbucks</li>
            <li>Customer Service</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="menu-footer-column">
          <h3>Order and Pick Up</h3>
          <ul>
            <li>Order on the App</li>
            <li>Order on the Web</li>
            <li>Delivery</li>
            <li>Order and Pick Up Options</li>
          </ul>
        </div>
      </section>

      <footer className="menu-bottom-footer" style={extraHeight ? { paddingBottom: `${extraHeight}px` } : {}}>
        <div className="menu-social-icons">
          {[
            { src: '/images/spotify.png', label: 'Spotify', cls: 'spotify' },
            { src: '/images/facebook.png', label: 'Facebook', cls: 'facebook' },
            { src: '/images/pinterest.png', label: 'Pinterest', cls: 'pinterest' },
            { src: '/images/instagram.png', label: 'Instagram', cls: 'instagram' },
            { src: '/images/youtube.png', label: 'YouTube', cls: 'youtube' },
            { src: '/images/twitter.png', label: 'Twitter', cls: 'twitter' },
          ].map(({ src, label, cls }) => (
            <a key={label} href="#" className={`menu-social-icon ${cls}`} aria-label={label}>
              <img src={src} alt={label} />
            </a>
          ))}
        </div>
        <div className="menu-footer-legal-links">
          <a href="#">Privacy Notice</a>
          <a href="#">Consumer Health Privacy Notice</a>
          <a href="#">Terms of Use</a>
          <a href="#">Do Not Sell or Share My Personal Information</a>
          <a href="#">CA Supply Chain Act</a>
          <a href="#">Accessibility</a>
          <a href="#">Cookie Preferences</a>
        </div>
        <p className="menu-copyright">© 2026 Claire&apos;s Starbucks Coffee Website.</p>
      </footer>
    </>
  );
}