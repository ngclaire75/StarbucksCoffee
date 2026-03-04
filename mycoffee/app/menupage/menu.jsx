'use client';

import { useState, useEffect, useRef } from 'react';
import WhiteNav from '../whitenav';
import MenuTabs from './menutabs';
import PagesListMenu from './pageslistmenu';
import ItemAvailability from './itemavailability';
import TopLoadingBar from '../previous/toploadingbar'; 
import CoffeeLoading from '../components/coffeeloading';
import CoffeeCupOnly from './coffeecuponly';
import { usePathname } from 'next/navigation';

// Module-level variable — persists across tab switches in the same JS session,
// resets to false on true first load (fresh page / hard refresh).
let hasVisitedMenuPage = false;

export default function MenuPage() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // On returning visits skip the loading screen entirely
  const [loading, setLoading] = useState(!hasVisitedMenuPage);
  const [isReturning] = useState(hasVisitedMenuPage);

  const [showWhiteNav, setShowWhiteNav] = useState(false);
  const [startBar, setStartBar] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [revealProgress, setRevealProgress] = useState(isReturning ? 100 : 0);
  const [navTranslate, setNavTranslate] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const [whiteNavHeight, setWhiteNavHeight] = useState(0);
  const footerRef = useRef(null);
  const navRef = useRef(null);
  const whiteNavRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const [showTabs, setShowTabs] = useState(isReturning);
  // Add this after your other useRef declarations
const idleTimerRef = useRef(null);
const IDLE_TIMEOUT = 2 * 60 * 1000; // 5 minutes — adjust as needed

  const BAR_DURATION = 1800;

  useEffect(() => {
    setMounted(true);

    // Returning visit — skip every animation and delay
    if (isReturning) {
      setLoading(false);
      setShowWhiteNav(true);
      setShowTabs(true);
      setShowFooter(true);
      setRevealProgress(100);
      return;
    }

    // First-time load — mark as visited then run staggered reveal
    hasVisitedMenuPage = true;

    const timer = setTimeout(() => {
      setLoading(false);
      setShowWhiteNav(true);

      setTimeout(() => {
        setStartBar(true);
        setShowFooter(true);
        setShowTabs(false);
      }, 1600);

      setTimeout(() => {
        const startTime = Date.now();
        progressIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const pct = Math.min((elapsed / BAR_DURATION) * 100, 100);
          setRevealProgress(pct);
          if (pct >= 100) clearInterval(progressIntervalRef.current);
        }, 16);
      }, 2600);

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

      if (!footerRef.current || !navRef.current) return;
      const navH = navRef.current.offsetHeight;
      const footerTop = footerRef.current.getBoundingClientRect().top;
      const overlap = navH - footerTop;

      if (overlap > 0) {
        setNavTranslate(Math.min(overlap, navH));
      } else {
        setNavTranslate(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
// Add this useEffect after your other useEffects
useEffect(() => {
  const resetTimer = () => {
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      window.location.reload();
    }, IDLE_TIMEOUT);
  };

  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
  events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
  
  resetTimer(); // Start the timer on mount

  return () => {
    clearTimeout(idleTimerRef.current);
    events.forEach(e => window.removeEventListener(e, resetTimer));
  };
}, []);

  const getActivePage = () => {
    if (pathname.startsWith('/menupage')) return 'menu';
    if (pathname.startsWith('/rewards')) return 'rewards';
    if (pathname.startsWith('/gifts')) return 'gifts';
    return '';
  };

  const tabs = [
    { id: 'menu', label: 'Menu' },
    { id: 'featured', label: 'Featured', href: '/featured' },
    { id: 'previous', label: 'Previous', href: '/previous' },
    { id: 'favourites', label: 'Favourites', href: '/favourites' },
  ];

  const preventDrag = (e) => e.preventDefault();

  // Returning visits: no styles at all — content is instantly fully visible
  const sectionStyle = (threshold) => {
    if (isReturning) return {};

    const base = 100;
    const adjusted = base + ((100 - base) * threshold / 100);
    return {
      opacity: revealProgress >= adjusted ? 1 : 0,
      transform: revealProgress >= adjusted ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
    };
  };

  if (!mounted || loading) return <CoffeeLoading />;

  return (
    <>
      {startBar && <TopLoadingBar />}
      {!isReturning && revealProgress > 60 && revealProgress < 100 && <CoffeeCupOnly />}

      <div
        ref={navRef}
        className="menu-navbar-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transform: `translateY(-${navTranslate}px)`,
          transition: navTranslate === 0 ? 'transform 0.2s ease' : 'none',
        }}
      >
        {showWhiteNav && (
          <div
            ref={whiteNavRef}
            style={{
              maxHeight: scrolled ? '0px' : `${whiteNavHeight || 200}px`,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}
          >
            <WhiteNav activePage={getActivePage()} />
          </div>
        )}

        <div className="navbar-divider"></div>

        {(isReturning || revealProgress >= 60) && (
          <div style={{
            transform: 'translateY(0)',
            animation: (isReturning || showTabs) ? 'none' : 'slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
          }}>
            <MenuTabs activeTab="menu" tabs={tabs} />
          </div>
        )}

        <style>{`
          @keyframes slideDown {
            from { transform: translateY(-12px); }
            to   { transform: translateY(0); }
          }
          @keyframes dash {
            from { stroke-dashoffset: 25; }
            to   { stroke-dashoffset: -25; }
          }
        `}</style>
      </div>

      <div
        style={{
          height: scrolled ? 48 : (navHeight || 100),
          transition: 'height 0.3s ease',
        }}
      />

      <div className="menu-container" onDragStart={preventDrag}>

        <div className="menu-sidebar" style={sectionStyle(10)}>
          <h4>Fan Favorites</h4>
          <p className="sidebar-item">Trending</p>

          <h4>Drinks</h4>
          <p className="sidebar-item">Protein Beverages</p>
          <p className="sidebar-item">Hot Coffee</p>
          <p className="sidebar-item">Cold Coffee</p>
          <p className="sidebar-item">Matcha</p>
          <p className="sidebar-item">Hot Tea</p>
          <p className="sidebar-item">Cold Tea</p>
          <p className="sidebar-item">Refreshers</p>
          <p className="sidebar-item">Frappuccino® Blended <br /> Beverage</p>
          <p className="sidebar-item">Hot Chocolate, Lemonade <br /> & More</p>
          <p className="sidebar-item">Bottled Beverages</p>

          <h4>Food</h4>
          <p className="sidebar-item">Breakfast</p>
          <p className="sidebar-item">Bakery</p>
          <p className="sidebar-item">Treats</p>
          <p className="sidebar-item">Lunch</p>
          <p className="sidebar-item">Lite Bites</p>

          <h4>At Home Coffee</h4>
          <p className="sidebar-item">Whole Bean</p>
          <p className="sidebar-item">Starbucks VIA® Instant</p>
          <p className="sidebar-item">Shopping Bag</p>
        </div>

        <div className="menu-content">
          <div style={sectionStyle(10)}>
            <h1 className="menu-title">Menu</h1>
          </div>

          <div style={sectionStyle(20)}>
            <h2 className="section-title">Fan Favorites</h2>
            <div className="section-divider"></div>
            <div className="trending-item">
              <div className="trending-image-wrapper">
                <img
                  src="/images/iced-double-berry-matcha.png"
                  alt="Trending Drink"
                  className="trending-image"
                  draggable={false}
                  onDragStart={preventDrag}
                />
              </div>
              <span className="trending-label">Trending</span>
            </div>
          </div>

          <div style={sectionStyle(40)}>
            <h2 className="section-title drinks-heading">Drinks</h2>
            <div className="section-divider"></div>
            <div className="drinks-grid">
              {[
                { src: '/images/protein.png', label: 'Protein Beverages' },
                { src: '/images/hotcoffee.png', label: 'Hot Coffee' },
                { src: '/images/cold-coffee.png', label: 'Cold Coffee' },
                { src: '/images/matcha.png', label: 'Matcha' },
                { src: '/images/hot_tea.png', label: 'Hot Tea' },
                { src: '/images/cold-tea.png', label: 'Cold Tea' },
                { src: '/images/refreshers.png', label: 'Refreshers' },
                { src: '/images/frappucino.png', label: 'Frappuccino® Blended Beverage' },
                { src: '/images/hotchoco.png', label: 'Hot Chocolate, Lemonade & More' },
                { src: '/images/bottledbeverages.png', label: 'Bottled Beverages' },
              ].map(({ src, label }) => (
                <div className="trending-item" key={label}>
                  <div className="trending-image-wrapper">
                    <img src={src} alt={label} className="trending-image" draggable={false} onDragStart={preventDrag} />
                  </div>
                  <span className="trending-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={sectionStyle(65)}>
            <h2 className="section-title food-heading">Food</h2>
            <div className="section-divider"></div>
            <div className="food-grid">
              {[
                { src: '/images/breakfast.png', label: 'Breakfast' },
                { src: '/images/bakery.png', label: 'Bakery' },
                { src: '/images/treats.png', label: 'Treats' },
                { src: '/images/lunch.png', label: 'Lunch' },
                { src: '/images/litebites.png', label: 'Lite Bites' },
              ].map(({ src, label }) => (
                <div className="trending-item" key={label}>
                  <div className="trending-image-wrapper">
                    <img src={src} alt={label} className="trending-image" draggable={false} onDragStart={preventDrag} />
                  </div>
                  <span className="trending-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={sectionStyle(85)}>
            <h2 className="section-title athome-heading">At Home Coffee</h2>
            <div className="section-divider"></div>
            <div className="athome-grid">
              {[
                { src: '/images/wholebean.png', label: 'Whole Bean' },
                { src: '/images/via-instant.png', label: 'Starbucks VIA® Instant' },
                { src: '/images/shoppingbag.png', label: 'Shopping Bag' },
              ].map(({ src, label }) => (
                <div className="trending-item" key={label}>
                  <div className="trending-image-wrapper athome-image-wrapper">
                    <img src={src} alt={label} className="trending-image athome-image" draggable={false} onDragStart={preventDrag} />
                  </div>
                  <span className="trending-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={footerRef} style={{ height: 0 }} />

      <div style={sectionStyle(95)}>
        <PagesListMenu extraHeight={140} />
      </div>

      {(isReturning || revealProgress >= 60) && <ItemAvailability />}
    </>
  );
}