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

export default function MenuPage() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(() => {
  if (typeof window === 'undefined') return true;

  const hasLoaded = sessionStorage.getItem('menuPageLoaded');
  return !hasLoaded; // show loading ONLY if never loaded in this session
});
  const [showWhiteNav, setShowWhiteNav] = useState(false);
  const [startBar, setStartBar] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [navTranslate, setNavTranslate] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const [whiteNavHeight, setWhiteNavHeight] = useState(0);
  const footerRef = useRef(null);
  const navRef = useRef(null);
  const whiteNavRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const [showTabs, setShowTabs] = useState(false);

  const BAR_DURATION = 1800;

useEffect(() => {
  setMounted(true);

  const hasLoaded = sessionStorage.getItem('menuPageLoaded');

  // Already loaded (tab switch)
  if (hasLoaded) {
    setLoading(false);
    setShowWhiteNav(true);
    setShowTabs(true); // show MenuTabs immediately

    // Start loading bar + footer + partial reveal
    setTimeout(() => {
      setStartBar(true);
      setShowFooter(true);
      setRevealProgress(50);
    }, 200);

    setTimeout(() => {
      const OFFSET = BAR_DURATION * 0.5;
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime + OFFSET;
        const pct = Math.min((elapsed / BAR_DURATION) * 100, 100);
        setRevealProgress(pct);
        if (pct >= 100) clearInterval(progressIntervalRef.current);
      }, 16);
    }, 600);

    return;
  }

  // First-time load — staggered reveal
  const timer = setTimeout(() => {
    setLoading(false);
    sessionStorage.setItem('menuPageLoaded', 'true');

    setShowWhiteNav(true);

    setTimeout(() => {
      setStartBar(true);
      setShowFooter(true);
      setShowTabs(false); // animate MenuTabs on first load
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

  // Measure heights after mount
  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    if (whiteNavRef.current) setWhiteNavHeight(whiteNavRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Footer push logic — only push nav when footer top reaches the nav's bottom edge
      if (!footerRef.current || !navRef.current) return;
      const navH = navRef.current.offsetHeight;
      const footerTop = footerRef.current.getBoundingClientRect().top;

      // overlap is positive only when footer top has crossed above the nav's bottom edge
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

  const sectionStyle = (threshold) => {
    const base = 100; // content only starts appearing after coffee cup is gone
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
     {/* Coffee cup shown after MenuTabs appear, before content reveals */}
     {revealProgress > 70 && revealProgress < 100 && <CoffeeCupOnly />}
          
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
        {/* WhiteNav appears immediately after CoffeeLoading */}
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
        {/* MenuTabs slides down after bar starts */}
{/* MenuTabs — instant on tab switch, animated on first load */}
{(revealProgress >= 60) && (
  <div style={{
    transform: 'translateY(0)',
    animation: showTabs ? 'none' : 'slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
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

      {/* Spacer — smoothly shrinks as WhiteNav collapses */}
      <div
        style={{
          height: scrolled ? 48 : (navHeight || 100),
          transition: 'height 0.3s ease',
        }}
      />

      {/* Menu Page Content */}
      <div className="menu-container" onDragStart={preventDrag}>

        {/* LEFT SIDEBAR */}
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

        {/* RIGHT CONTENT */}
        <div className="menu-content">
          <div style={sectionStyle(10)}>
            <h1 className="menu-title">Menu</h1>
          </div>

          {/* FAN FAVORITES */}
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

          {/* DRINKS SECTION */}
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

          {/* FOOD SECTION */}
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

          {/* AT HOME COFFEE SECTION */}
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

      {/* Sentinel — placed just before PagesList so nav pushes as soon as footer top is reached */}
      <div ref={footerRef} style={{ height: 0 }} />

      <div style={sectionStyle(95)}>
        <PagesListMenu extraHeight={140} />
      </div>

      {/* Item Availability Footer — appears with MenuTabs */}
      {/* Item Availability Footer — appears when loading bar is almost done */}
{revealProgress >= 60 && <ItemAvailability />}
    </>
  );
}