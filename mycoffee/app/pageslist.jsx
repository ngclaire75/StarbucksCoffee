'use client';

import { useRouter } from 'next/navigation';

export default function PagesList({ extraHeight = 0 }) {
  const router = useRouter();

  return (
    <>
      <section className="home-footer-links">
        <div className="home-footer-column">
          <h3>About Us</h3>
          <ul>
            <li><a href="/ourcompanypage">Our Company</a></li>
            <li><a href="/ourcoffeepage">Our Coffee</a></li>
            <li style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => router.push('/aboutstarbuckspage')}>
              About Starbucks
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </li>
            <li style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => router.push('/customerservice')}>
              Customer Service
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </li>
            <li style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => router.push('/contactus')}>
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </li>
          </ul>
        </div>
        <div className="home-footer-column">
          <h3>Order and Pick Up</h3>
          <ul>
            <li style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => router.push('/orderinapp')}>
              Order on the App
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </li>
            <li><a href="/menupage">Order on the Web</a></li>
            <li style={{ cursor: 'pointer' }} onClick={() => router.push('/store-locator?tab=Delivery')}>Delivery</li>
            <li style={{ cursor: 'pointer' }} onClick={() => router.push('/store-locator?tab=Pickup')}>Order and Pick Up Options</li>
          </ul>
        </div>
      </section>

      <footer className="bottom-footer" style={extraHeight ? { paddingBottom: `${extraHeight}px` } : {}}>
        <div className="home-social-icons">
          {[
            { src: '/images/spotify.png',   label: 'Spotify',   cls: 'spotify',   href: 'https://open.spotify.com/user/starbucks' },
            { src: '/images/facebook.png',  label: 'Facebook',  cls: 'facebook',  href: 'https://www.facebook.com/Starbucks' },
            { src: '/images/pinterest.png', label: 'Pinterest', cls: 'pinterest', href: 'https://www.pinterest.com/starbucks' },
            { src: '/images/instagram.png', label: 'Instagram', cls: 'instagram', href: 'https://www.instagram.com/starbucks' },
            { src: '/images/youtube.png',   label: 'YouTube',   cls: 'youtube',   href: 'https://www.youtube.com/starbucks' },
            { src: '/images/twitter.png',   label: 'Twitter',   cls: 'twitter',   href: 'https://twitter.com/Starbucks' },
          ].map(({ src, label, cls, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`home-social-icon ${cls}`} aria-label={label}>
              <img src={src} alt={label} />
            </a>
          ))}
        </div>
        <div className="footer-legal-links">
          <a href="/privacynotice">Privacy Notice</a>
          <a href="/consumerhealthprivacy">Consumer Health Privacy Notice</a>
          <a href="/termsofuse">Terms of Use</a>
          <a href="/donotsell">Do Not Sell or Share My Personal Information</a>
          <a href="/casupplychain">CA Supply Chain Act</a>
          <a href="/accessibility">Accessibility</a>
          <a href="/cookiepreferences">Cookie Preferences</a>
        </div>
        <p className="home-copyright">© 2026 Claire&apos;s Starbucks Coffee Website.</p>
      </footer>
    </>
  );
}
