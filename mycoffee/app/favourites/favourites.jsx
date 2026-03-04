'use client';

import { useState, useEffect, useRef } from 'react';
import WhiteNav from '../whitenav';
import MenuTabs from '../menupage/menutabs';
import PagesListMenu from '../menupage/pageslistmenu';
import ItemAvailability from '../menupage/itemavailability';
import TopLoadingBar from '../previous/toploadingbar'; 
import CoffeeLoading from '../components/coffeeloading';
import CoffeeCupOnly from '../menupage/coffeecuponly';
import { usePathname } from 'next/navigation';
import './favourites.css';
import '../menupage/menu.css';

export default function FavouritesPage() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(() => {
  if (typeof window === 'undefined') return true;
  const hasLoaded = sessionStorage.getItem('favouritesPageLoaded');
  return !hasLoaded;
});
  const [revealProgress, setRevealProgress] = useState(0);
  const [navTranslate, setNavTranslate] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const [whiteNavHeight, setWhiteNavHeight] = useState(0);
  const pagesListRef = useRef(null);
  const navRef = useRef(null);
  const whiteNavRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const BAR_DURATION = 1800;

useEffect(() => {
  setMounted(true);

  const hasLoaded = sessionStorage.getItem('favouritesPageLoaded');

  // 🚫 Skip CoffeeLoading on tab switch
  if (hasLoaded) {
    setLoading(false);

    // Still run bar + coffee cup animation
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / BAR_DURATION) * 100, 100);
      setRevealProgress(pct);
      if (pct >= 100) clearInterval(progressIntervalRef.current);
    }, 16);

    return () => clearInterval(progressIntervalRef.current);
  }

  // First hard refresh — show CoffeeLoading
  const timer = setTimeout(() => {
    setLoading(false);
    sessionStorage.setItem('favouritesPageLoaded', 'true');

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
    if (pathname.startsWith('/favourites')) return 'menu';
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
        <TopLoadingBar />

      {/* Coffee cup shown until content starts revealing */}
      {revealProgress < 60 && <CoffeeCupOnly />}

      {/* ── Navbar ── */}
      <div
        ref={navRef}
        className="fav-navbar-wrapper"
        style={{
          transform: `translateY(-${navTranslate}px)`,
          transition: navTranslate === 0 ? 'transform 0.15s ease' : 'none',
        }}
      >
        <div
          ref={whiteNavRef}
          className="fav-whitenav-collapse"
          style={{
            maxHeight: scrolled ? '0px' : `${whiteNavHeight || 200}px`,
          }}
        >
          <WhiteNav activePage={getActivePage()} />
        </div>

        <div className="navbar-divider" />
        <MenuTabs activeTab="favourites" tabs={tabs} />
      </div>

      {/* ── Spacer ── */}
      <div
        className="fav-spacer"
        style={{ height: scrolled ? 48 : (navHeight || 100) }}
      />

      {/* ── Favourites Page Content — reveals after coffee cup ── */}
      <div style={{
        opacity: revealProgress >= 60 ? 1 : 0,
        transform: revealProgress >= 60 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}>
        <div className="fav-container">
          <h1 className="fav-title">Favourites</h1>

          {/* Empty state */}
          <div className="fav-empty-state">
            {/* Image illustration */}
            <div className="fav-img-wrapper favourites-gif-delayed">
              <img
                src="/images/fav-tapes.png"
                alt="No favourites yet"
                className="fav-img"
                draggable={false}
              />
            </div>

            {/* Heading */}
            <h2 className="fav-empty-heading">Save your favorite mixes</h2>

            {/* Subtext */}
            <p className="fav-empty-subtext">
              Use the heart to save customizations. Your <br/>favorites will appear here to order again.
            </p>

            {/* Buttons */}
            <div className="fav-btn-row">
              <button className="fav-btn fav-btn-signin">Sign in</button>
              <button className="fav-btn fav-btn-join">Join now</button>
            </div>
          </div>
        </div>

        {/* Wrap PagesListMenu so we can measure exactly when its top hits the nav */}
        <div ref={pagesListRef}>
          <PagesListMenu extraHeight={140} />
        </div>
      </div>

      <ItemAvailability />
    </>
  );
}