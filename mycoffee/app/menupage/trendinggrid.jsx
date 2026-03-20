'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from "next/navigation";
import CustomizePage from './customizepage';

import '../home.css';

const TRENDING_DRINKS = [
  {
    id: 'iced-ube-coconut-macchiato',
    name: 'Iced Ube Coconut Macchiato',
    calories: '380 calories, 41g sugar, 18g fat',
    tag: 'Cold Coffee',
    src: '/images/ube-coconut-macchiato.png',
    description:
      'Full-bodied espresso layered over creamy milk and toasted-coconut-flavored syrup, served over ice, topped with an ube coconut cold foam and sprinkled with toasted coconut flakes. Ube adds a sweet, nutty-vanilla taste and vibrant pop of purple to every sip.',
    customizations: ['Milk', 'Ice', 'Ube Coconut Cold Foam', 'Brewed Espresso', 'Toasted Coconut Syrup', 'Toasted Coconut Topping'],
    accentColor: '#4A7C59',
    bgColor: '#EAF3EC',
    collapsedImageHeight: 200,
    expandedImageHeight: 180,
    dropdownImageHeight: 69,
    dropdownImageMarginTop: 73,
    dropdownImageMarginBottom: 50,
    collapsedImageMarginTop: 54,
    collapsedImageMarginBottom: 0,
    expandedImageMarginTop: -3,
    expandedImageMarginBottom: 0,
    expandedBgColor: '#1e3932'
  },
  {
    id: 'toasted-coconut-cream-cold-brew',
    name: 'Toasted Coconut Cream Cold Brew',
    calories: '240 calories, 27g sugar, 13g fat',
    tag: 'Cold Coffee',
    src: '/images/coconut-cold-brew.png',
    description:
      'Our signature Starbucks® Cold Brew finished with toasted coconut cold foam. Smooth and creamy, this sweet pairing delivers a refreshing take on one of our coffeehouse favorites.',
    customizations: ['Brewed Coffee', 'Ice', 'Toasted Coconut Cold Foam', 'Vanilla Syrup', 'Toasted Coconut Topping'],
    accentColor: '#4A7C59',
    bgColor: '#EAF3EC',
    collapsedImageHeight: 245,
    expandedImageHeight: 230,
    dropdownImageHeight: 88,
    dropdownImageMarginTop: 25,
    dropdownImageMarginBottom: 0,
    collapsedImageMarginTop: 58,
    collapsedImageMarginBottom: 0,
    expandedImageMarginTop: 25,
    expandedImageMarginBottom: 25,
    expandedBgColor: '#1e3932'
  },
  {
    id: 'iced-lavender-cream-matcha',
    name: 'Iced Lavender Cream Matcha',
    calories: '350 calories, 38g sugar, 17g fat',
    tag: 'Cold Tea',
    src: '/images/purple-matcha.png',
    description:
      'Smooth matcha with classic syrup, milk and subtle floral notes of lavender cold foam, served over ice. An unbeatable combination bursting with flavor and sweetness.',
    customizations: ['Milk', 'Ice', 'Lavender Cold Foam', 'Classic Syrup', 'Matcha'],
    accentColor: '#3D6B45',
    bgColor: '#E6F0E8',
    collapsedImageHeight: 210,
    expandedImageHeight: 180,
    dropdownImageHeight: 80,
    dropdownImageMarginTop: 26,
    dropdownImageMarginBottom: 0,
    collapsedImageMarginTop: 49,
    collapsedImageMarginBottom: 0,
    expandedImageMarginTop: 20,
    expandedImageMarginBottom: 20,
  },
  {
    id: 'iced-dubai-chocolate-matcha',
    name: 'Iced Dubai Chocolate Matcha',
    calories: '400 calories, 45g sugar, 19g fat',
    tag: 'Cold Tea',
    src: '/images/brown-matcha.png',
    description:
      'Inspired by matcha lovers and the Dubai chocolate dessert, this beverage combines our vibrant iced matcha latte with the nutty sweetness of pistachio sauce, silky chocolate cream cold foam and a salted brown-buttery topping. Only available for a limited time.',
    customizations: ['Milk', 'Ice', 'Chocolate Cold Foam', 'Pistachio Sauce', 'Matcha', 'Salted Brown Butter Cookie Flavoured Topping'],
    accentColor: '#4A7C59',
    bgColor: '#EAF3EC',
    collapsedImageHeight: 206,
    expandedImageHeight: 180,
    dropdownImageHeight: 79,
    dropdownImageMarginTop: 29,
    dropdownImageMarginBottom: 0,
    collapsedImageMarginTop: 59,
    collapsedImageMarginBottom: 0,
    expandedImageMarginTop: 50,
    expandedImageMarginBottom: 50,
  },
  {
    id: 'cannon-ball-drink',
    name: 'Cannon Ball Drink',
    calories: '160 calories, 33g sugar, 0g fat',
    tag: 'Refreshers',
    src: '/images/pink-orange.png',
    description:
      'Created for fans of the biggest competition show in the world, Beast Games. The Cannon Ball Drink is a bold, tart lemonade with our Strawberry Açaí and Mango Dragonfruit Refreshers, topped with cascading fruit inclusions and served ice cold. Inspired by the Cannon Ball Challenge from Beast Games Season 2. Available for a limited time, get it while you can.',
    customizations: ['Ice', 'Water', 'Strawberry Acai Base', 'Lemonade', 'Mango Dragonfruit Refresher Base', 'Freeze Dried Dragonfruit Pieces', 'Freeze Dried Strawberries'],
    accentColor: '#4A7C59',
    bgColor: '#EAF3EC',
    collapsedImageHeight: 193,
    expandedImageHeight: 180,
    dropdownImageHeight: 76,
    dropdownImageMarginTop: 31,
    dropdownImageMarginBottom: 0,
    collapsedImageMarginTop: 60,
    collapsedImageMarginBottom: 0,
    expandedImageMarginTop: 0,
    expandedImageMarginBottom: 0,
  },
  {
    id: 'pink-cannon-ball-drink',
    name: 'Pink Cannon Ball Drink',
    calories: '150 calories, 26g sugar, 3g fat',
    tag: 'Refreshers',
    src: '/images/pink-white.png',
    description:
      'Created for fans of the biggest competition show in the world, Beast Games. The Pink Cannon Ball Drink is creamy coconutmilk with our Strawberry Açaí and Mango Dragonfruit Refreshers, topped with cascading fruit inclusions and served ice-cold. Inspired by the Cannon Ball Challenge from Beast Games Season 2. Available for a limited time, get it while you can.',
    customizations: ['Ice', 'Coconutmilk', 'Strawberry Acai Base','Mango Dragonfruit Refresher Base', 'Freeze Dried Dragonfruit Pieces', 'Freeze Dried Strawberries'],
    accentColor: '#4A7C59',
    bgColor: '#EAF3EC',
    collapsedImageHeight: 210,
    expandedImageHeight: 180,
    dropdownImageHeight: 85,
    dropdownImageMarginTop: 30,
    dropdownImageMarginBottom: 0,
    collapsedImageMarginTop: 50,
    collapsedImageMarginBottom: 0,
    expandedImageMarginTop: 49,
    expandedImageMarginBottom: 49,
  },
];

// ─── No-store guard modal ─────────────────────────────────────────────────────
function NoStoreModal({ onClose }) {
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 250);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSelectStore = () => {
    setClosing(true);
    localStorage.setItem('postStoreAction', 'proceedToPayment');
    setTimeout(() => {
      router.push('/store-locator');
    }, 200);
  };

  return (
    <div
      className={`store-popup-overlay${closing ? ' closing' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="store-popup-modal">
        <p className="store-popup-message">
          Please select a store before continuing to the cart.
        </p>
        <div className="store-popup-actions">
          <button className="store-popup-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="store-popup-select" onClick={handleSelectStore}>
            Select Store
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function TrendingDropdown({ drinks, onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={dd.shell}>
      <div style={dd.arrow} />
      <div style={dd.header}>
        <span style={dd.headerLabel}>Fan Favorites · Trending </span>
        <button onClick={onClose} style={dd.closeX}>✕</button>
      </div>
      <div style={dd.list}>
        {drinks.map((drink, i) => (
          <button
            key={drink.id}
            style={{ ...dd.row, animationDelay: `${i * 38}ms` }}
            onClick={() => { onSelect(drink.id); onClose(); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = drink.bgColor;
              const thumb = e.currentTarget.querySelector('[data-thumb]');
              if (thumb) thumb.style.outline = '1.5px solid white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              const thumb = e.currentTarget.querySelector('[data-thumb]');
              if (thumb) thumb.style.outline = 'none';
            }}
          >
            <div data-thumb="" style={{ ...dd.thumb, background: drink.dropdownBgColor ?? drink.bgColor }}>
              <img
                src={drink.src}
                alt={drink.name}
                style={{
                  ...dd.thumbImg,
                  height: drink.dropdownImageHeight,
                  marginTop: drink.dropdownImageMarginTop,
                  marginBottom: drink.dropdownImageMarginBottom,
                  transition: 'outline 0.15s',
                }}
              />
            </div>
            <div style={dd.rowText}>
              <div style={dd.rowName}>{drink.name}</div>
              <div style={dd.rowMeta}>{drink.calories}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <span style={{ ...dd.pill, color: drink.accentColor, background: drink.bgColor }}>{drink.tag}</span>
            </div>
          </button>
        ))}
      </div>
      <div style={dd.foot}>
        <span style={{ fontSize: 11, color: '#aaa' }}>Tap any drink to jump directly to it</span>
      </div>
    </div>
  );
}

const dd = {
  shell: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    left: 0,
    zIndex: 300,
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 16px 56px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)',
    width: 430,
    overflow: 'hidden',
    animation: 'dropIn 0.22s cubic-bezier(0.34,1.4,0.64,1)',
  },
  arrow: {
    position: 'absolute',
    top: -7,
    left: 30,
    width: 14,
    height: 14,
    background: '#fff',
    transform: 'rotate(45deg)',
    borderRadius: 2,
    boxShadow: '-2px -2px 5px rgba(0,0,0,0.04)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px 10px',
    borderBottom: '1px solid #F2F2F0',
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: '#1E3932',
  },
  closeX: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#aaa',
    padding: '2px 4px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    padding: '6px 0',
    maxHeight: 370,
    overflowY: 'auto',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 18px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'background 0.15s',
    animation: 'rowFadeIn 0.25s ease both',
  },
  thumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  thumbImg: { objectFit: 'contain' },
  rowText: { flex: 1, minWidth: 0 },
  rowName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1a1a1a',
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rowMeta: { fontSize: 11, color: '#aaa', marginTop: 2 },
  pill: {
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: 50,
    whiteSpace: 'nowrap',
  },
  foot: {
    padding: '10px 18px',
    borderTop: '1px solid #F2F2F0',
    background: '#FAFAF8',
  },
};

// ─── Expanded Overlay Card ────────────────────────────────────────────────────
function ExpandedOverlay({ drink, onCollapse, onCustomize, storeSelected, itemQty, onIncrement, onDecrement }) {
  const EXPANDED_WIDTH = 700;
  const EXPANDED_HEIGHT = 280;
  const router = useRouter();

  const [orderMode, setOrderMode] = useState(itemQty > 0);
  const [showNoStore, setShowNoStore] = useState(false);

  useEffect(() => {
    if (itemQty === 0) setOrderMode(false);
  }, [itemQty]);

  const handleOrderNowClick = () => {
    // Always read from localStorage so we get the real-time saved store
    const savedStore = (() => { try { return JSON.parse(localStorage.getItem('selectedStore')); } catch { return null; } })();
    if (savedStore) {
      // Write item to cart so bag count updates in real time
      const item = {
        id: Date.now(),
        drinkId: drink.id,
        name: drink.name,
        size: 'Grande',
        qty: 1,
        price: drink.price || 0,
      };
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
      localStorage.setItem('checkoutCart', JSON.stringify(cart));
      localStorage.setItem('checkoutTotal', JSON.stringify(subtotal * 1.0875));
      window.dispatchEvent(new Event('cartUpdated'));
      onIncrement();
      router.push('/payment');
      return;
    }
    // No store saved — save pending drink and show store selector modal
    localStorage.setItem('pendingOrderDrink', JSON.stringify(drink));
    setShowNoStore(true);
  };

  const handlePlus = () => {
    const savedStore = (() => { try { return JSON.parse(localStorage.getItem('selectedStore')); } catch { return null; } })();
    if (!savedStore) { setShowNoStore(true); return; }
    const item = {
      id: Date.now(),
      drinkId: drink.id,
      name: drink.name,
      size: 'Grande',
      qty: 1,
      price: drink.price || 0,
    };
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    onIncrement();
  };

  const handleMinus = () => {
    const savedStore = (() => { try { return JSON.parse(localStorage.getItem('selectedStore')); } catch { return null; } })();
    if (!savedStore) { setShowNoStore(true); return; }
    onDecrement();
    if (itemQty - 1 <= 0) setOrderMode(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCollapse}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 400,
          background: 'rgba(0,0,0,0.18)',
          animation: 'backdropIn 0.22s ease',
        }}
      />

      {/* Expanded card */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          marginTop: `-${EXPANDED_HEIGHT / 2}px`,
          marginLeft: `-${EXPANDED_WIDTH / 2}px`,
          width: EXPANDED_WIDTH,
          zIndex: 401,
          background: '#fff',
          borderRadius: 14,
          border: `2px solid ${drink.accentColor}`,
          boxShadow: `0 20px 60px ${drink.accentColor}33, 0 4px 16px rgba(0,0,0,0.12)`,
          overflow: 'hidden',
          animation: 'expandFromCard 0.3s cubic-bezier(0.34, 1.3, 0.64, 1)',
          transformOrigin: 'center center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'stretch', minHeight: EXPANDED_HEIGHT }}>
          {/* Image panel */}
          <div
            style={{
              background: drink.expandedBgColor ?? drink.bgColor,
              width: 220,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <img
              src={drink.src}
              alt={drink.name}
              draggable={false}
              style={{
                height: drink.expandedImageHeight,
                marginTop: drink.expandedImageMarginTop,
                marginBottom: drink.expandedImageMarginBottom,
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Content panel */}
          <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: drink.accentColor,
                    background: `${drink.accentColor}18`,
                    padding: '3px 9px',
                    borderRadius: 50,
                    display: 'inline-block',
                    marginBottom: 8,
                  }}
                >
                  {drink.tag}
                </span>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: drink.accentColor,
                    lineHeight: 1.2,
                    letterSpacing: '-0.4px',
                    marginBottom: 4,
                  }}
                >
                  {drink.name}
                </h3>
                <div style={{ fontSize: 12, color: '#999' }}>
                  {drink.calories}
                </div>
              </div>
              <button
                onClick={onCollapse}
                aria-label="Close"
                style={{
                  background: `${drink.accentColor}18`,
                  border: 'none',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: drink.accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${drink.accentColor}30`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = `${drink.accentColor}18`)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.65, margin: 0 }}>
              {drink.description}
            </p>

            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#AAAAAA', marginBottom: 6 }}>
                Key Ingredients
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {drink.customizations.map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: '#444',
                      border: `1.5px solid ${drink.accentColor}44`,
                      borderRadius: 50,
                      padding: '3px 10px',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Action row ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                paddingTop: 10,
                borderTop: `1px solid ${drink.accentColor}22`,
                marginTop: 'auto',
                justifyContent: 'flex-end'
              }}
            >
              {!orderMode ? (
                <button
                  onClick={handleOrderNowClick}
                  style={{
                    background: drink.accentColor,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 50,
                    padding: '9px 22px',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.82')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Order Now
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    border: `1.5px solid ${drink.accentColor}`,
                    borderRadius: 50, overflow: 'hidden', height: 36,
                  }}>
                    <button
                      onClick={handleMinus}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', width: 36, height: '100%', fontSize: 18, color: drink.accentColor, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${drink.accentColor}14`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >−</button>
                    <span style={{ minWidth: 28, textAlign: 'center', fontSize: 14, fontWeight: 700, color: drink.accentColor }}>
                      {itemQty}
                    </span>
                    <button
                      onClick={handlePlus}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', width: 36, height: '100%', fontSize: 18, color: drink.accentColor, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${drink.accentColor}14`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >+</button>
                  </div>
                  <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>
                    {itemQty === 1 ? '1 item in order' : `${itemQty} items in order`}
                  </span>
                </div>
              )}

              <button
                onClick={onCustomize}
                style={{
                  background: 'transparent',
                  color: drink.accentColor,
                  border: `1.5px solid ${drink.accentColor}55`,
                  borderRadius: 50,
                  padding: '8px 18px',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${drink.accentColor}14`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNoStore && (
        <NoStoreModal onClose={() => setShowNoStore(false)} />
      )}
    </>
  );
}

// ─── Single Collapsed Card ────────────────────────────────────────────────────
function TrendingCard({ drink, isDimmed, onExpand }) {
  return (
    <div
      onClick={onExpand}
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '1.5px solid #f0f0ee',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        cursor: 'pointer',
        opacity: isDimmed ? 0.3 : 1,
        transform: isDimmed ? 'scale(0.97)' : 'scale(1)',
        pointerEvents: isDimmed ? 'none' : 'auto',
        overflow: 'hidden',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        if (!isDimmed) {
          e.currentTarget.style.boxShadow = `0 12px 32px ${drink.accentColor}22`;
          e.currentTarget.style.borderColor = `${drink.accentColor}33`;
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
        e.currentTarget.style.borderColor = '#f0f0ee';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Image area */}
      <div style={{
        background: drink.collapsedBgColor ?? drink.bgColor,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img
          src={drink.src}
          alt={drink.name}
          draggable={false}
          style={{
            height: drink.collapsedImageHeight,
            marginTop: drink.collapsedImageMarginTop,
            marginBottom: drink.collapsedImageMarginBottom,
            objectFit: 'contain',
            transition: 'transform 0.35s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.07)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>

      {/* Text area */}
      <div style={{ padding: '16px 18px 20px' }}>
        <span style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: drink.accentColor,
          background: drink.bgColor,
          padding: '3px 10px',
          borderRadius: 50,
          display: 'inline-block',
          marginBottom: 10,
        }}>
          {drink.tag}
        </span>
        <div style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#1a1a1a',
          lineHeight: 1.3,
          marginBottom: 5,
          letterSpacing: '-0.2px',
        }}>
          {drink.name}
        </div>
        <div style={{ fontSize: 11, color: '#bbb', fontWeight: 500 }}>{drink.calories}</div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function TrendingFooter() {
  const cols = [
    { heading: 'About Us', links: ['Our Company', 'Our Coffee', 'Stories & News', 'Starbucks Archive', 'Investor Relations'] },
    { heading: 'Careers', links: ['Culture & Values', 'Inclusion, Diversity & Equity', 'College Achievement Plan', 'Alumni Community', 'U.S. Careers', 'International Careers'] },
    { heading: 'Social Impact', links: ['People', 'Planet', 'Environmental & Social Impact Reporting'] },
    { heading: 'For Business Partners', links: ['Landlord Support Center', 'Supplier Portal', 'Corporate Gift Card Sales', 'Office & Foodservice Coffee'] },
    { heading: 'Order & Pick Up', links: ['Order on the App', 'Order Online', 'Find a Store', 'Try Seasonal Menu'] },
  ];
  const social = [
    { label: 'Spotify', icon: '♫' },
    { label: 'Facebook', icon: 'f' },
    { label: 'Instagram', icon: '◎' },
    { label: 'Twitter/X', icon: '✕' },
    { label: 'YouTube', icon: '▶' },
    { label: 'Pinterest', icon: 'P' },
  ];

  return (
    <footer style={{ background: '#1E3932', marginTop: 72 }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28, width: 52, height: 52, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☕</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>Starbucks</div>
              <div style={{ fontSize: 12, color: '#8aada4', marginTop: 2 }}>More than coffee. A community.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {social.map(({ label, icon }) => (
              <button key={label} title={label}
                style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#cde8e0', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, transform 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >{icon}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 32 }}>
        {cols.map(({ heading, links }) => (
          <div key={heading} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', marginBottom: 6 }}>{heading}</div>
            {links.map((link) => (
              <a key={link} href="#" style={{ fontSize: 13, color: '#8aada4', textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8aada4')}
              >{link}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px' }}>
            {['Privacy Notice', 'Terms of Use', 'Cookie Preferences', 'Do Not Sell My Personal Information', 'Site Map'].map((l) => (
              <a key={l} href="#" style={{ fontSize: 11, color: '#6b9188', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#cde8e0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6b9188')}
              >{l}</a>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#4d756c' }}>© {new Date().getFullYear()} Starbucks Coffee Company. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main TrendingGrid ────────────────────────────────────────────────────────
export default function TrendingGrid({ onBack, bagCount, setBagCount, storeSelected = false }) {
  const [expandedId, setExpandedId] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [itemQtys, setItemQtys] = useState({});
  const [customizeDrink, setCustomizeDrink] = useState(null);

  const cardRefs = useRef({});

  useEffect(() => {
    window.history.pushState({ trending: true }, '');
    const onPop = () => {
      if (customizeDrink) {
        setCustomizeDrink(null);
        window.history.pushState({ trending: true }, '');
      } else if (expandedId) {
        setExpandedId(null);
        setAnchorRect(null);
        window.history.pushState({ trending: true }, '');
      } else {
        onBack();
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [expandedId, customizeDrink, onBack]);

  const handleExpand = useCallback((id, el) => {
    if (el) setAnchorRect(el.getBoundingClientRect());
    setExpandedId(id);
    setDropdownOpen(false);
  }, []);

  const handleCollapse = useCallback(() => {
    setExpandedId(null);
    setAnchorRect(null);
  }, []);

  const handleDropdownSelect = useCallback((id) => {
    setDropdownOpen(false);
    const el = cardRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setAnchorRect(el.getBoundingClientRect());
        setExpandedId(id);
      }, 400);
    }
  }, []);

  const handleCustomize = useCallback((drink) => {
    setExpandedId(null);
    setAnchorRect(null);
    setCustomizeDrink(drink);
    window.history.pushState({ customize: drink.id }, '');
  }, []);

  const handleIncrement = useCallback((id) => {
    setItemQtys((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setBagCount?.((prev) => prev + 1);
  }, [setBagCount]);

  const handleDecrement = useCallback((id) => {
    setItemQtys((prev) => {
      const current = prev[id] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
    setBagCount?.((prev) => Math.max(0, prev - 1));
  }, [setBagCount]);

  const expandedDrink = TRENDING_DRINKS.find((d) => d.id === expandedId);

  if (customizeDrink) {
    return (
      <CustomizePage
        drink={customizeDrink}
        storeSelected={storeSelected}
        onBack={() => setCustomizeDrink(null)}
        onAddToBag={(id, qty) => {
          setItemQtys((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + qty }));
          setBagCount?.((prev) => prev + qty);
        }}
      />
    );
  }

  return (
    <div>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#aaa', padding: 0,
            transition: 'color 0.18s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1e3932')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#aaa')}
        >
          Menu
        </button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1e3932' }}>
          Trending
        </span>
      </div>

      {/* ── Title + dropdown ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ width: 32, height: 3, background: '#00a862', borderRadius: 2, marginBottom: 12 }} />
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <h1 className="menu-title" style={{ marginBottom: 0, display: 'inline' }}>
                Trending
              </h1>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.22s ease',
                marginBottom: 2,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e3932" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            {dropdownOpen && (
              <TrendingDropdown drinks={TRENDING_DRINKS} onSelect={handleDropdownSelect} onClose={() => setDropdownOpen(false)} />
            )}
          </div>
          <p style={{ fontSize: 13, color: '#999', margin: '8px 0 0', fontWeight: 400 }}>
            Fan favorites right now — {TRENDING_DRINKS.length} drinks
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}
      >
        {TRENDING_DRINKS.map((drink) => (
          <div key={drink.id} ref={(el) => (cardRefs.current[drink.id] = el)}>
            <TrendingCard
              drink={drink}
              isDimmed={expandedId !== null && drink.id !== expandedId}
              onExpand={() => handleExpand(drink.id, cardRefs.current[drink.id])}
            />
          </div>
        ))}
      </div>

      {expandedDrink && (
        <ExpandedOverlay
          drink={expandedDrink}
          onCollapse={handleCollapse}
          onCustomize={() => handleCustomize(expandedDrink)}
          storeSelected={storeSelected}
          itemQty={itemQtys[expandedDrink.id] ?? 0}
          onIncrement={() => handleIncrement(expandedDrink.id)}
          onDecrement={() => handleDecrement(expandedDrink.id)}
        />
      )}

      <style>{`
        @keyframes expandFromCard {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rowFadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes noStoreIn {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0.9); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
      `}</style>
    </div>
  );
}