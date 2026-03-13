'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import WhiteNav from '../whitenav';
import MenuTabs from './menutabs';
import PagesListMenu from './pageslistmenu';
import ItemAvailability, { addToCart } from './itemavailability';
import TopLoadingBar from '../previous/toploadingbar';
import CoffeeLoading from '../components/coffeeloading';
import CoffeeCupOnly from './coffeecuponly';
import TrendingGrid from './trendinggrid';
import { usePathname, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import '../menupage/menu.css';

let hasVisitedMenuPage = false;

/* ─── Customisation option sets ─────────────────────────────────────── */
const SIZES        = ['Short', 'Tall', 'Grande', 'Venti', 'Trenta'];
const TEMPS        = ['Hot', 'Iced', 'Blended'];
const SUGAR_LEVELS = ['No Sugar', 'Less Sugar', 'Regular', 'Extra Sugar'];
const ICE_LEVELS   = ['No Ice', 'Light Ice', 'Default Ice', 'Extra Ice'];
const SHOT_MIN     = 0;
const SHOT_MAX     = 5;

/* ─── Build summary chips from a cart item ───────────────────────────── */
function getChips(item) {
  const chips = [];
  if (item.size)  chips.push({ label: item.size,  type: 'base' });
  if (item.temp)  chips.push({ label: item.temp,  type: 'base' });
  const sugar = item.sugarLevel || item.sugar;
  const ice   = item.iceLevel   || item.ice;
  if (sugar && sugar !== 'Regular')
    chips.push({ label: sugar, type: 'mod' });
  if (ice && ice !== 'Regular ice' && ice !== 'Default Ice')
    chips.push({ label: ice, type: 'mod' });
  if (item.shots != null && item.shots !== 1)
    chips.push({ label: `${item.shots} shot${item.shots !== 1 ? 's' : ''}`, type: 'mod' });
  return chips;
}

function addToCartItem(item) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const newItem = { ...item, id: uuidv4() };
  cart.push(newItem);
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

/* ─── Pill button ────────────────────────────────────────────────────── */
function Pill({ label, selected, onClick }) {
  return (
    <button
      className={`edit-pill${selected ? ' selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

/* ─── Inline edit panel ──────────────────────────────────────────────── */
function EditPanel({ item, onSave, onCancel }) {
  const [size, setSize] = useState(item.size || 'Grande');
  const [temp, setTemp] = useState(item.temp || 'Iced');
  // Support both field names: CustomizePage uses 'sugar'/'ice', EditPanel saves use 'sugarLevel'/'iceLevel'
  const [sugarLevel, setSugarLevel] = useState(item.sugarLevel || item.sugar || 'Regular');
  const [iceLevel, setIceLevel] = useState(item.iceLevel || item.ice || 'Default Ice');
  const [shots, setShots] = useState(item.shots ?? 1);

  const isIced = temp === 'Iced';

  useEffect(() => {
    setSugarLevel(item.sugarLevel || item.sugar || 'Regular');
    setIceLevel(item.iceLevel || item.ice || 'Default Ice');
  }, [item]);

  return (
    <div className="edit-panel">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>
        <div className="edit-section" style={{ gridColumn: '1 / -1' }}>
          <span className="edit-label">Cup Size</span>
          <div className="edit-pills">
            {SIZES.map(s => <Pill key={s} label={s} selected={size === s} onClick={() => setSize(s)} />)}
          </div>
        </div>
        <div className="edit-section" style={{ gridColumn: '1 / -1' }}>
          <span className="edit-label">Temperature</span>
          <div className="edit-pills">
            {TEMPS.map(t => <Pill key={t} label={t} selected={temp === t} onClick={() => setTemp(t)} />)}
          </div>
        </div>
      </div>
      <div className="edit-divider" />
      {isIced && (
        <div className="edit-section">
          <span className="edit-label">Ice Level</span>
          <div className="edit-pills">
            {ICE_LEVELS.map(l => <Pill key={l} label={l} selected={iceLevel === l} onClick={() => setIceLevel(l)} />)}
          </div>
        </div>
      )}
      <div className="edit-section">
        <span className="edit-label">Sugar Level</span>
        <div className="edit-pills">
          {SUGAR_LEVELS.map(l => <Pill key={l} label={l} selected={sugarLevel === l} onClick={() => setSugarLevel(l)} />)}
        </div>
      </div>
      <div className="edit-section">
        <span className="edit-label">Espresso Shots</span>
        <div className="edit-shot-row">
          <button className="edit-shot-btn" type="button" onClick={() => setShots(s => Math.max(SHOT_MIN, s - 1))}>−</button>
          <span className="edit-shot-val">{shots}</span>
          <button className="edit-shot-btn" type="button" onClick={() => setShots(s => Math.min(SHOT_MAX, s + 1))}>+</button>
        </div>
      </div>
      <div className="edit-actions">
        <button className="edit-cancel-btn" type="button" onClick={onCancel}>Cancel</button>
        <button
          className="edit-save-btn"
          type="button"
          onClick={() => onSave({
            ...item,
            size, temp,
            sugarLevel, sugar: sugarLevel,
            iceLevel: isIced ? iceLevel : undefined,
            ice: isIced ? iceLevel : undefined,
            shots,
          })}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

/* ─── Main MenuPage ──────────────────────────────────────────────────── */
export default function MenuPage() {
  const pathname = usePathname();
  const router   = useRouter();

  const [mounted,        setMounted]        = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [loading,        setLoading]        = useState(!hasVisitedMenuPage);
  const [isReturning]                       = useState(hasVisitedMenuPage);
  const [showWhiteNav,   setShowWhiteNav]   = useState(false);
  const [startBar,       setStartBar]       = useState(false);
  const [showFooter,     setShowFooter]     = useState(false);
  const [revealProgress, setRevealProgress] = useState(isReturning ? 100 : 0);
  const [navTranslate,   setNavTranslate]   = useState(0);
  const [navHeight,      setNavHeight]      = useState(0);
  const [whiteNavHeight, setWhiteNavHeight] = useState(0);
  const [showTabs,       setShowTabs]       = useState(isReturning);
  const [showTrending,   setShowTrending]   = useState(false);

  const footerRef           = useRef(null);
  const navRef              = useRef(null);
  const whiteNavRef         = useRef(null);
  const progressIntervalRef = useRef(null);
  const idleTimerRef        = useRef(null);
  const IDLE_TIMEOUT        = 2 * 60 * 1000;
  const BAR_DURATION        = 1800;

  /* ── Cart state ── */
  const [cartOpen,    setCartOpen]    = useState(false);
  const [cartClosing, setCartClosing] = useState(false);
  const [cartItems,   setCartItems]   = useState([]);
  const [editingIdx,  setEditingIdx]  = useState(null);

  // Derive cart count directly from cartItems so it always stays in sync
  const cartCount = cartItems.reduce((n, i) => n + (i.qty || 1), 0);

  const subtotal   = cartItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const tax        = subtotal * 0.0875;
  const totalPrice = subtotal + tax;

  const [storeSelected, setStoreSelected] = useState(false);

  /* ── Menu unavailable overlay ── */
  const [menuUnavail,        setMenuUnavail]        = useState(false);
  const [menuUnavailClosing, setMenuUnavailClosing] = useState(false);
  const [menuUnavailLabel,   setMenuUnavailLabel]   = useState('');

  const openMenuUnavail = useCallback((label) => {
    setMenuUnavailLabel(label);
    setMenuUnavail(true);
    setMenuUnavailClosing(false);
  }, []);

  const closeMenuUnavail = useCallback(() => {
    setMenuUnavailClosing(true);
    setTimeout(() => { setMenuUnavail(false); setMenuUnavailClosing(false); }, 220);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('menuScrollY');
    if (saved && isReturning) {
      window.scrollTo(0, parseInt(saved));
    }
    const saveScroll = () => sessionStorage.setItem('menuScrollY', window.scrollY);
    window.addEventListener('scroll', saveScroll, { passive: true });
    return () => window.removeEventListener('scroll', saveScroll);
  }, []);

  /* ── Close cart ── */
  const closeCart = useCallback(() => {
    setCartClosing(true);
    setEditingIdx(null);
    setTimeout(() => { setCartOpen(false); setCartClosing(false); }, 220);
  }, []);

  /* ── Qty ── */
  const updateQty = useCallback((idx, delta) => {
    setCartItems(prev => {
      const next = prev
        .map((item, i) => {
          if (i !== idx) return item;
          const q = (item.qty || 1) + delta;
          return q <= 0 ? null : { ...item, qty: q };
        })
        .filter(Boolean);
      localStorage.setItem('cart', JSON.stringify(next));
      window.dispatchEvent(new Event('cartUpdated'));
      addToCart();
      return next;
    });
  }, []);

  /* ── Remove ── */
  const removeItem = useCallback((idx) => {
    setEditingIdx(null);
    setCartItems(prev => {
      const next = prev.filter((_, i) => i !== idx);
      localStorage.setItem('cart', JSON.stringify(next));
      window.dispatchEvent(new Event('cartUpdated'));
      addToCart();
      return next;
    });
  }, []);

  const saveEdit = useCallback((idx, updated) => {
    setCartItems(prev => {
      const next = prev.map((item, i) => (i === idx ? updated : item));
      localStorage.setItem('cart', JSON.stringify(next));
      window.dispatchEvent(new Event('cartUpdated'));
      addToCart();
      return next;
    });
    setEditingIdx(null);
  }, []);

  /* ── Trending ── */
  const handleEnterTrending = useCallback(() => {
    localStorage.setItem('menuLastPage', 'trending');
    setShowTrending(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleExitTrending = useCallback(() => {
    localStorage.setItem('menuLastPage', 'menu');
    setShowTrending(false);
  }, []);

  /* ── Effects ── */
  useEffect(() => { setStoreSelected(!!localStorage.getItem('selectedStore')); }, []);

  useEffect(() => {
    setShowTrending(localStorage.getItem('menuLastPage') === 'trending');

    if (isReturning) {
      setMounted(true);
      setLoading(false); setShowWhiteNav(true); setShowTabs(true);
      setShowFooter(true); setRevealProgress(100);
      return;
    }
    hasVisitedMenuPage = true;

    const timer = setTimeout(() => {
      setLoading(false);
      setMounted(true);
      setShowWhiteNav(true);

      setTimeout(() => {
        setStartBar(true);
        setShowFooter(true);
        setShowTabs(false);
      }, 1600);

      setTimeout(() => {
        const t0 = Date.now();
        progressIntervalRef.current = setInterval(() => {
          const pct = Math.min(((Date.now() - t0) / BAR_DURATION) * 100, 100);
          setRevealProgress(pct);
          if (pct >= 100) clearInterval(progressIntervalRef.current);
        }, 16);
      }, 2600);
    }, 1200);

    return () => { clearTimeout(timer); clearInterval(progressIntervalRef.current); };
  }, []);

  useEffect(() => {
    if (navRef.current)      setNavHeight(navRef.current.offsetHeight);
    if (whiteNavRef.current) setWhiteNavHeight(whiteNavRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      if (!footerRef.current || !navRef.current) return;
      const overlap = navRef.current.offsetHeight - footerRef.current.getBoundingClientRect().top;
      setNavTranslate(overlap > 0 ? Math.min(overlap, navRef.current.offsetHeight) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const reset = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        localStorage.removeItem('menuLastPage');
        window.location.reload();
      }, IDLE_TIMEOUT);
    };
    const evts = ['mousemove','mousedown','keydown','touchstart','scroll','click'];
    evts.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { clearTimeout(idleTimerRef.current); evts.forEach(e => window.removeEventListener(e, reset)); };
  }, []);

  // ── Load cart + listen for real-time updates from ANY page ──
  useEffect(() => {
    const loadCart = () => {
      setCartItems(JSON.parse(localStorage.getItem('cart') || '[]'));
    };
    loadCart();
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart);
    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  const getActivePage = () => {
    if (pathname.startsWith('/menupage')) return 'menu';
    if (pathname.startsWith('/rewards'))  return 'rewards';
    if (pathname.startsWith('/gifts'))    return 'gifts';
    return '';
  };

  const tabs = [
    { id: 'menu',       label: 'Menu' },
    { id: 'featured',   label: 'Featured',   href: '/featured' },
    { id: 'previous',   label: 'Previous',   href: '/previous' },
    { id: 'favourites', label: 'Favourites', href: '/favourites' },
  ];

  const preventDrag = e => e.preventDefault();

  const sectionStyle = threshold => {
    if (isReturning) return {};
    return {
      opacity:    revealProgress >= threshold ? 1 : 0,
      transform:  revealProgress >= threshold ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
    };
  };

  function handleCheckout() {
    if (!cartItems.length) { alert('Your cart is empty'); return; }
    localStorage.setItem('checkoutCart',  JSON.stringify(cartItems));
    localStorage.setItem('checkoutTotal', JSON.stringify(totalPrice));
    closeCart();
    setTimeout(() => router.push('/payment'), 220);
  }

  if (!mounted || loading) return <CoffeeLoading />;

  return (
    <>
      {startBar && <TopLoadingBar />}
      {!isReturning && revealProgress > 60 && revealProgress < 100 && <CoffeeCupOnly />}

      <div
        ref={navRef}
        className="menu-navbar-wrapper"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, width: '100%',
          transform: `translateY(-${navTranslate}px)`,
          transition: navTranslate === 0 ? 'transform 0.2s ease' : 'none',
        }}
      >
        {showWhiteNav && (
          <div ref={whiteNavRef} style={{
            maxHeight: scrolled ? '0px' : `${whiteNavHeight || 200}px`,
            overflow: 'hidden', transition: 'max-height 0.3s ease',
          }}>
            <WhiteNav activePage={getActivePage()} />
          </div>
        )}
        <div className="navbar-divider" />
        {(isReturning || revealProgress >= 10) && (
          <div style={{
            animation: isReturning || showTabs ? 'none' : 'slideDown 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both',
          }}>
            <MenuTabs activeTab="menu" tabs={tabs} />
          </div>
        )}
        <style>{`@keyframes slideDown{from{transform:translateY(-12px)}to{transform:translateY(0)}}`}</style>
      </div>

      <div style={{ height: scrolled ? 48 : navHeight || 100, transition: 'height 0.3s ease' }} />

      <div className="menu-container" onDragStart={preventDrag}>

        <div className="menu-sidebar" style={isReturning ? {} : {
          opacity:    revealProgress >= 95 ? 1 : 0,
          transform:  revealProgress >= 10 ? 'translateY(0)' : 'translateY(10px)',
          visibility: revealProgress >= 10 ? 'visible' : 'hidden',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          <h4>Fan Favorites</h4>
          <p className="sidebar-item" onClick={handleEnterTrending} style={{
            cursor: 'pointer',
            color: showTrending ? '#006241' : undefined,
            fontWeight: showTrending ? 700 : undefined,
            borderLeft: showTrending ? '3px solid #006241' : '3px solid transparent',
            paddingLeft: showTrending ? 8 : undefined,
            transition: 'all 0.2s ease',
          }}>Trending</p>

          <h4>Drinks</h4>
          {[
            'Protein Beverages','Hot Coffee','Cold Coffee','Matcha',
            'Hot Tea','Cold Tea','Refreshers',
            <span key="f">Frappuccino® Blended<br/>Beverage</span>,
            <span key="h">Hot Chocolate, Lemonade<br/>& More</span>,
            'Bottled Beverages',
          ].map((label, i) => (
            <p key={i} className="sidebar-item" onClick={handleExitTrending} style={{ cursor: 'pointer' }}>{label}</p>
          ))}

          <h4>Food</h4>
          {['Breakfast','Bakery','Treats','Lunch','Lite Bites'].map(label => (
            <p key={label} className="sidebar-item" onClick={handleExitTrending} style={{ cursor: 'pointer' }}>{label}</p>
          ))}

          <h4>At Home Coffee</h4>
          {['Whole Bean','Starbucks VIA® Instant','Shopping Bag'].map(label => (
            <p key={label} className="sidebar-item" onClick={handleExitTrending} style={{ cursor: 'pointer' }}>{label}</p>
          ))}
        </div>

        <div className="menu-content">
          {showTrending && (isReturning || revealProgress >= 100) && (
            <div style={{ animation: 'menuFadeIn 0.3s ease' }}>
              {/* Pass cartCount + setBagCount so TrendingGrid/CustomizePage bag icon stays in sync */}
              <TrendingGrid
                onBack={handleExitTrending}
                showFooter={false}
                bagCount={cartCount}
                setBagCount={(updater) => {
                  // setBagCount is called by TrendingGrid internally;
                  // cartItems is the source of truth so we just re-read from localStorage
                  setCartItems(JSON.parse(localStorage.getItem('cart') || '[]'));
                }}
                storeSelected={storeSelected}
              />
            </div>
          )}

          {!showTrending && (
            <>
              <div style={sectionStyle(95)}><h1 className="menu-title">Menu</h1></div>

              <div style={sectionStyle(95)}>
                <h2 className="section-title">Fan Favorites</h2>
                <div className="section-divider" />
                <div className="trending-item" onClick={handleEnterTrending} style={{ cursor: 'pointer' }}>
                  <div className="trending-image-wrapper">
                    <img src="/images/iced-double-berry-matcha.png" alt="Trending" className="trending-image" draggable={false} onDragStart={preventDrag} />
                  </div>
                  <span className="trending-label">Trending</span>
                </div>
              </div>

              <div style={sectionStyle(95)}>
                <h2 className="section-title drinks-heading">Drinks</h2>
                <div className="section-divider" />
                <div className="drinks-grid">
                  {[
                    { src: '/images/protein.png',          label: 'Protein Beverages' },
                    { src: '/images/hotcoffee.png',        label: 'Hot Coffee' },
                    { src: '/images/cold-coffee.png',      label: 'Cold Coffee' },
                    { src: '/images/matcha.png',           label: 'Matcha' },
                    { src: '/images/hot_tea.png',          label: 'Hot Tea' },
                    { src: '/images/cold-tea.png',         label: 'Cold Tea' },
                    { src: '/images/refreshers.png',       label: 'Refreshers' },
                    { src: '/images/frappucino.png',       label: 'Frappuccino® Blended Beverage' },
                    { src: '/images/hotchoco.png',         label: 'Hot Chocolate, Lemonade & More' },
                    { src: '/images/bottledbeverages.png', label: 'Bottled Beverages' },
                  ].map(({ src, label }) => (
                    <div className="trending-item" key={label} style={{ cursor: 'pointer' }} onClick={() => openMenuUnavail(label)}>
                      <div className="trending-image-wrapper">
                        <img src={src} alt={label} className="trending-image" draggable={false} onDragStart={preventDrag} />
                      </div>
                      <span className="trending-label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={sectionStyle(95)}>
                <h2 className="section-title food-heading">Food</h2>
                <div className="section-divider" />
                <div className="food-grid">
                  {[
                    { src: '/images/breakfast.png', label: 'Breakfast' },
                    { src: '/images/bakery.png',    label: 'Bakery' },
                    { src: '/images/treats.png',    label: 'Treats' },
                    { src: '/images/lunch.png',     label: 'Lunch' },
                    { src: '/images/litebites.png', label: 'Lite Bites' },
                  ].map(({ src, label }) => (
                    <div className="trending-item" key={label} style={{ cursor: 'pointer' }} onClick={() => openMenuUnavail(label)}>
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
                <div className="section-divider" />
                <div className="athome-grid">
                  {[
                    { src: '/images/wholebean.png',   label: 'Whole Bean' },
                    { src: '/images/via-instant.png', label: 'Starbucks VIA® Instant' },
                    { src: '/images/shoppingbag.png', label: 'Shopping Bag' },
                  ].map(({ src, label }) => (
                    <div className="trending-item" key={label} style={{ cursor: 'pointer' }} onClick={() => openMenuUnavail(label)}>
                      <div className="trending-image-wrapper athome-image-wrapper">
                        <img src={src} alt={label} className="trending-image athome-image" draggable={false} onDragStart={preventDrag} />
                      </div>
                      <span className="trending-label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══ CART MODAL ══ */}
      {cartOpen && (
        <div
          className={`cart-overlay${cartClosing ? ' closing' : ''}`}
          onClick={closeCart}
        >
          <div
            className={`cart-modal${cartClosing ? ' closing' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="cart-header">
              <div className="cart-header-left">
                <h2>Your Order</h2>
                {cartCount > 0 && (
                  <span className="cart-pill-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="cart-header-right">
                {subtotal > 0 && (
                  <span className="cart-header-total">${subtotal.toFixed(2)}</span>
                )}
                <button className="cart-close-btn" onClick={closeCart} aria-label="Close">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1 1l11 11M12 1L1 12" stroke="#c0b0a0" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="cart-body">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <h3>Your bag is empty</h3>
                  <p>Add something delicious<br/>to get started</p>
                </div>
              ) : (
                cartItems.map((item, i) => {
                  const chips     = getChips(item);
                  const isEditing = editingIdx === i;

                  return (
                    <div
                      className="cart-item"
                      key={i}
                      style={{ animationDelay: `${i * 42}ms` }}
                    >
                      <div className="cart-item-num">{i + 1}</div>
                      <div className="cart-item-inner">
                        <div className="cart-item-top">
                          <p className="cart-item-name">{item.name}</p>
                        </div>
                        {chips.length > 0 && (
                          <div className="cart-chips">
                            {chips.map((c, ci) => (
                              <span key={ci} className={`cart-chip ${c.type}`}>{c.label}</span>
                            ))}
                          </div>
                        )}
                        {isEditing && (
                          <EditPanel
                            item={item}
                            onSave={updated => saveEdit(i, updated)}
                            onCancel={() => setEditingIdx(null)}
                          />
                        )}
                        {!isEditing && (
                          <div className="cart-item-controls">
                            <div className="cart-stepper">
                              <button className="cart-stepper-btn" onClick={() => updateQty(i, -1)}>−</button>
                              <span className="cart-stepper-qty">{item.qty || 1}</span>
                              <button className="cart-stepper-btn" onClick={() => updateQty(i, 1)}>+</button>
                            </div>
                            <div className="cart-item-btns">
                              <button className="cart-text-btn edit-btn"   onClick={() => setEditingIdx(i)}>Edit</button>
                              <button className="cart-text-btn remove-btn" onClick={() => removeItem(i)}>Remove</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-footer-inner">
                  <button className="cart-checkout-btn" onClick={handleCheckout}>
                    Proceed to Payment
                    <span className="cart-checkout-arrow">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div ref={footerRef} style={{ height: 0 }} />

      {showTrending ? (
        <PagesListMenu extraHeight={140} />
      ) : (
        <div style={sectionStyle(95)}>
          <PagesListMenu extraHeight={140} />
        </div>
      )}

      {(isReturning || revealProgress >= 10) && (
        <ItemAvailability
          storeSelected={storeSelected}
          setStoreSelected={setStoreSelected}
          onBagClick={() => {
            setCartItems(JSON.parse(localStorage.getItem('cart') || '[]'));
            setCartOpen(true);
          }}
        />
      )}

      {/* ══ MENU UNAVAILABLE OVERLAY ══ */}
      {menuUnavail && (
        <div
          className={`menu-unavail-overlay${menuUnavailClosing ? ' closing' : ''}`}
          onClick={closeMenuUnavail}
        >
          <div className="menu-unavail-card" onClick={e => e.stopPropagation()}>
            <img src="/images/Starbucks-Logo.png" alt="Starbucks" className="menu-unavail-icon" />
            <span className="menu-unavail-label">Coming Soon</span>
            <h2 className="menu-unavail-title">{menuUnavailLabel}</h2>
            <p className="menu-unavail-text">
              This section of the menu is currently not available.<br />
              Check back soon — good things take time.
            </p>
            <div className="menu-unavail-dots">
              <span /><span /><span />
            </div>
            <button className="menu-unavail-close" onClick={closeMenuUnavail}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Go back
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}