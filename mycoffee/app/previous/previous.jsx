'use client';

import { useState, useEffect, useRef } from 'react';
import WhiteNav from '../whitenav';
import MenuTabs from '../menupage/menutabs';
import PagesListMenu from '../menupage/pageslistmenu';
import ItemAvailability from '../menupage/itemavailability';
import TopLoadingBar from './toploadingbar'; 
import CoffeeLoading from '../components/coffeeloading';
import CoffeeCupOnly from '../menupage/coffeecuponly';
import { usePathname } from 'next/navigation';
import './previous.css';
import '../menupage/menu.css';

export default function PreviousPage() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(() => {
  if (typeof window === 'undefined') return true;
  const hasLoaded = sessionStorage.getItem('previousPageLoaded');
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

  const hasLoaded = sessionStorage.getItem('previousPageLoaded');

  // 🚫 Skip CoffeeLoading on tab switch
  if (hasLoaded) {
    setLoading(false);

    // Still run reveal animation + coffee cup
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
    sessionStorage.setItem('previousPageLoaded', 'true');

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

      // Push nav up only when the top of PagesListMenu reaches the bottom of the nav
      if (!pagesListRef.current || !navRef.current) return;
      const navH = navRef.current.offsetHeight;
      const pagesListTop = pagesListRef.current.getBoundingClientRect().top;

      // overlap is positive only when PagesListMenu top has crossed above the nav's bottom edge
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
        {/* ── Top Loading Bar ── */}
      <TopLoadingBar />

      {/* Coffee cup shown until content starts revealing */}
      {revealProgress < 60 && <CoffeeCupOnly />}
      
      {/* ── Navbar ── */}
      <div
        ref={navRef}
        className="previous-navbar-wrapper"
        style={{
          transform: `translateY(-${navTranslate}px)`,
          transition: navTranslate === 0 ? 'transform 0.15s ease' : 'none',
        }}
      >
        {/* WhiteNav smoothly collapses on scroll */}
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

      {/* ── Spacer ── */}
      <div
        className="previous-spacer"
        style={{ height: scrolled ? 48 : (navHeight || 100) }}
      />

      {/* ── Previous Page Content — reveals after coffee cup ── */}
      <div style={{
        opacity: revealProgress >= 60 ? 1 : 0,
        transform: revealProgress >= 60 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}>
        <div className="previous-container">
          <h1 className="previous-title">Previous</h1>

          {/* Empty state */}
          <div className="previous-empty-state">
            {/* GIF illustration */}
            <div className="previous-gif-wrapper previous-gif-delayed">
              <img
                src="/images/previous.gif"
                alt="No previous orders"
                className="previous-gif"
                draggable={false}
              />
            </div>

            {/* Heading */}
            <h2 className="previous-empty-heading">When history repeats itself</h2>

            {/* Subtext */}
            <p className="previous-empty-subtext">
              Previous orders will appear here to quickly order again.
            </p>

            {/* Buttons */}
            <div className="previous-btn-row">
              <button className="previous-btn previous-btn-signin">Sign in</button>
              <button className="previous-btn previous-btn-join">Join now</button>
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