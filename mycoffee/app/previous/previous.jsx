'use client';

import { useState, useEffect, useRef } from 'react';
import WhiteNav from '../whitenav';
import MenuTabs from '../menupage/menutabs';
import PagesListMenu from '../menupage/pageslistmenu';
import ItemAvailability from '../menupage/itemavailability';
import TopLoadingBar from './toploadingbar'; 
import CoffeeLoading from '../components/coffeeloading';
import CoffeeCupOnly from '../menupage/coffeecuponly';
import { usePathname, useRouter } from 'next/navigation';
import './previous.css';
import '../menupage/menu.css';

// Module-level variable — persists across tab switches in the same JS session,
// resets to false on true first load (fresh page / hard refresh).
let hasVisitedPreviousPage = false;

export default function PreviousPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [signedInMsg, setSignedInMsg] = useState('');

  const [loading, setLoading] = useState(!hasVisitedPreviousPage);
  const [isReturning] = useState(hasVisitedPreviousPage);

  const [revealProgress, setRevealProgress] = useState(isReturning ? 100 : 0);
  const [navTranslate, setNavTranslate] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const [whiteNavHeight, setWhiteNavHeight] = useState(0);
  const pagesListRef = useRef(null);
  const navRef = useRef(null);
  const whiteNavRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const BAR_DURATION = 1800;

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setUser(d.user || null))
      .catch(() => setUser(null));
  }, []);

  const handleSignIn = () => {
    if (user) {
      setSignedInMsg('You are already signed in.');
      setTimeout(() => setSignedInMsg(''), 3000);
    } else {
      router.push('/signin');
    }
  };

  const handleJoinNow = () => {
    if (user) {
      setSignedInMsg('You are already signed in.');
      setTimeout(() => setSignedInMsg(''), 3000);
    } else {
      router.push('/joinnow');
    }
  };

  useEffect(() => {
    setMounted(true);

    // Returning visit — skip every animation and delay
    if (isReturning) {
      setLoading(false);
      setRevealProgress(100);
      return;
    }

    // First-time load — mark as visited then run staggered reveal
    hasVisitedPreviousPage = true;

    const timer = setTimeout(() => {
      setLoading(false);

      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min((elapsed / BAR_DURATION) * 100, 100);
        setRevealProgress(pct);
        if (pct >= 100) clearInterval(progressIntervalRef.current);
      }, 16);

    }, 1200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Measure heights after mount
  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    if (whiteNavRef.current) setWhiteNavHeight(whiteNavRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      if (!pagesListRef.current || !navRef.current) return;
      const navH = navRef.current.offsetHeight;
      const pagesListTop = pagesListRef.current.getBoundingClientRect().top;
      const overlap = navH - pagesListTop;

      if (overlap > 0) {
        setNavTranslate(Math.min(overlap, navH));
      } else {
        setNavTranslate(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getActivePage = () => {
    if (pathname.startsWith('/previous')) return 'menu';
    if (pathname.startsWith('/menupage')) return 'menu';
    if (pathname.startsWith('/rewards')) return 'rewards';
    if (pathname.startsWith('/gifts')) return 'gifts';
    return '';
  };

  const tabs = [
    { id: 'menu', label: 'Menu', href: '/menupage' },
    { id: 'featured', label: 'Featured', href: '/featured' },
    { id: 'previous', label: 'Previous', href: '/previous' },
    { id: 'favourites', label: 'Favourites', href: '/favourites' },
  ];

  if (!mounted || loading) return <CoffeeLoading />;

  return (
    <>
      {!isReturning && <TopLoadingBar />}

      {/* Coffee cup shown until content starts revealing — skip on returning visits */}
      {!isReturning && revealProgress < 60 && <CoffeeCupOnly />}

      <div
        ref={navRef}
        className="previous-navbar-wrapper"
        style={{
          transform: `translateY(-${navTranslate}px)`,
          transition: navTranslate === 0 ? 'transform 0.15s ease' : 'none',
        }}
      >
        <div
          ref={whiteNavRef}
          className="previous-whitenav-collapse"
          style={{
            maxHeight: scrolled ? '0px' : `${whiteNavHeight || 200}px`,
          }}
        >
          <WhiteNav activePage={getActivePage()} />
        </div>

        <div className="navbar-divider" />
        <MenuTabs activeTab="previous" tabs={tabs} />
      </div>

      <div
        className="previous-spacer"
        style={{ height: scrolled ? 48 : (navHeight || 100) }}
      />

      {/* Content — instant on returning visits, animated on first load */}
      <div style={isReturning ? {} : {
        opacity: revealProgress >= 60 ? 1 : 0,
        transform: revealProgress >= 60 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}>
        <div className="previous-container">
          <h1 className="previous-title">Previous</h1>

          <div className="previous-empty-state">
            <div className="previous-gif-wrapper previous-gif-delayed">
              <img
                src="/images/previous.gif"
                alt="No previous orders"
                className="previous-gif"
                draggable={false}
              />
            </div>

            <h2 className="previous-empty-heading">When history repeats itself</h2>

            <p className="previous-empty-subtext">
              Previous orders will appear here to quickly order again.
            </p>

            <div className="previous-btn-row">
              <button className="previous-btn previous-btn-signin" onClick={handleSignIn}>Sign in</button>
              <button className="previous-btn previous-btn-join" onClick={handleJoinNow}>Join now</button>
            </div>
            {signedInMsg && <p className="previous-already-signed-in">{signedInMsg}</p>}
          </div>
        </div>

        <div ref={pagesListRef}>
          <PagesListMenu extraHeight={140} />
        </div>
      </div>

      <ItemAvailability />
    </>
  );
}