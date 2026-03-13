'use client';  

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart, savePendingItem, getSelectedStore } from "../utils/cart";
import { useCartCount } from "./itemavailability";

import './customizepage.css';

const DRINK_CONFIG = {
  'iced-ube-coconut-macchiato': {
    sizes: [
      { label: 'Tall',   oz: '12 fl oz' },
      { label: 'Grande', oz: '16 fl oz' },
      { label: 'Venti',  oz: '24 fl oz' },
    ],
    defaultSize: 'Grande',
    iceOptions:   ['No Ice', 'Light Ice', 'Default Ice', 'Extra Ice'],
    defaultIce:   'Default Ice',
    sugarOptions: ['No Sugar', 'Less Sugar', 'Regular', 'Extra Sugar'],
    defaultSugar: 'Regular',
  },
  'toasted-coconut-cream-cold-brew': {
    sizes: [
      { label: 'Tall',   oz: '12 fl oz' },
      { label: 'Grande', oz: '16 fl oz' },
      { label: 'Venti',  oz: '24 fl oz' },
      { label: 'Trenta', oz: '30 fl oz' },
    ],
    defaultSize: 'Grande',
    iceOptions:   ['No Ice', 'Light Ice', 'Default Ice', 'Extra Ice'],
    defaultIce:   'Default Ice',
    sugarOptions: ['No Sugar', 'Less Sugar', 'Regular', 'Extra Sugar'],
    defaultSugar: 'Regular',
  },
  'iced-lavender-cream-matcha': {
    sizes: [
      { label: 'Tall',   oz: '12 fl oz' },
      { label: 'Grande', oz: '16 fl oz' },
      { label: 'Venti',  oz: '24 fl oz' },
    ],
    defaultSize: 'Grande',
    iceOptions:   ['No Ice', 'Light Ice', 'Default Ice', 'Extra Ice'],
    defaultIce:   'Default Ice',
    sugarOptions: ['No Sugar', 'Less Sugar', 'Regular', 'Extra Sugar'],
    defaultSugar: 'Regular',
  },
  'iced-dubai-chocolate-matcha': {
    sizes: [
      { label: 'Tall',   oz: '12 fl oz' },
      { label: 'Grande', oz: '16 fl oz' },
      { label: 'Venti',  oz: '24 fl oz' },
    ],
    defaultSize: 'Grande',
    iceOptions:   ['No Ice', 'Light Ice', 'Default Ice', 'Extra Ice'],
    defaultIce:   'Default Ice',
    sugarOptions: ['No Sugar', 'Less Sugar', 'Regular', 'Extra Sugar'],
    defaultSugar: 'Regular',
  },
  'cannon-ball-drink': {
    sizes: [
      { label: 'Tall',   oz: '12 fl oz' },
      { label: 'Grande', oz: '16 fl oz' },
      { label: 'Venti',  oz: '24 fl oz' },
      { label: 'Trenta', oz: '30 fl oz' },
    ],
    defaultSize: 'Grande',
    iceOptions:   ['Light Ice', 'Default Ice', 'Extra Ice'],
    defaultIce:   'Default Ice',
    sugarOptions: ['No Sugar', 'Less Sugar', 'Regular', 'Extra Sugar'],
    defaultSugar: 'Regular',
  },
  'pink-cannon-ball-drink': {
    sizes: [
      { label: 'Tall',   oz: '12 fl oz' },
      { label: 'Grande', oz: '16 fl oz' },
      { label: 'Venti',  oz: '24 fl oz' },
      { label: 'Trenta', oz: '30 fl oz' },
    ],
    defaultSize: 'Grande',
    iceOptions:   ['Light Ice', 'Default Ice', 'Extra Ice'],
    defaultIce:   'Default Ice',
    sugarOptions: ['No Sugar', 'Less Sugar', 'Regular', 'Extra Sugar'],
    defaultSugar: 'Regular',
  },
};

const CUP_SVG_URLS = {
  Grande: 'https://www.starbucks.com/app-assets/2920fb2a8c34d3ddb95a.svg',
  Tall:   'https://www.starbucks.com/app-assets/76b8892b0db8f5d41198.svg',
  Venti:  'https://www.starbucks.com/app-assets/55e7819f7cf8e1959ec3.svg',
  Trenta: 'https://www.starbucks.com/app-assets/55e7819f7cf8e1959ec3.svg',
};

function ColdCupImg({ sizeLabel, active }) {
  const url = CUP_SVG_URLS[sizeLabel] ?? CUP_SVG_URLS.Grande;
  return (
    <img
      src={url}
      alt={sizeLabel}
      draggable={false}
    />
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4.5l4 4 4-4" stroke="#1E3932" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionLabel({ text }) {
  return <div>{text}</div>;
}

function PillChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.borderColor = '#1E3932';
          e.currentTarget.style.background = '#f5f9f7';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.borderColor = '#ccc';
          e.currentTarget.style.background = '#fff';
        }
      }}
    >
      {label}
    </button>
  );
}

function AccordionSection({ title, selected, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <div>
          <div>{title}</div>
          <div>{selected}</div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div>
          <div>
            {options.map(opt => (
              <PillChip
                key={opt}
                label={opt}
                active={selected === opt}
                onClick={() => { onChange(opt); setOpen(false); }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectionTag({ label }) {
  return <span>{label}</span>;
}

function Toast({ drinkName, sizeName, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div>
      <div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6.5L4.5 9L10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div>{sizeName} added to order</div>
        <div>{drinkName}</div>
      </div>
      <button onClick={onClose}>✕</button>
    </div>
  );
}

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
    setTimeout(() => {
      router.push('/store-locator');
    }, 200);
  };

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));

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

function formatNutritionValue(raw) {
  if (!raw) return raw;
  return raw.replace(/(\d+)(g|mg|ml)/gi, (_, num, unit) => `${num}${unit.toUpperCase()}`);
}

export default function CustomizePage({ drink, storeSelected, onBack, onAddToBag, onBagClick }) {
  // Always read cart count live from localStorage so badge updates instantly
  const cartCount = useCartCount();
  const config = DRINK_CONFIG[drink?.id] ?? DRINK_CONFIG['iced-ube-coconut-macchiato'];

  const [size,    setSize]    = useState(config.defaultSize);
  const [ice,     setIce]     = useState(config.defaultIce);
  const [sugar,   setSugar]   = useState(config.defaultSugar);
  const [qty,     setQty]     = useState(1);
  const [toast,   setToast]   = useState(false);
  const [noStore, setNoStore] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const pendingItem = localStorage.getItem("pendingCartItem");
    if (pendingItem) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(JSON.parse(pendingItem));
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.removeItem("pendingCartItem");
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, []);

  const drinkData = drink ?? {
    name: 'Iced Ube Coconut Macchiato',
    tag: 'Iced Espresso',
    description: 'Creamy coconut milk poured over ice and espresso, layered with vibrant ube sauce for a visually stunning, sweet and earthy drink.',
    calories: '280 calories, 10g fat, 38g sugar',
    src: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20250204-IcedUbeCoconutMacchiato.jpg',
    expandedBgColor: '#2C1654',
  };

  const handleAdd = () => {
    const store = getSelectedStore();

    const item = {
      id: Date.now(),
      drinkId: drink?.id,
      name: drinkData.name,
      size,
      ice,
      sugar,
      qty,
      price: drink?.price || 0,
    };

    if (store) {
      // Add to cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));

      // Set checkout data for payment page
      localStorage.setItem('checkoutCart', JSON.stringify(cart));
      const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
      const total = subtotal * 1.0875;
      localStorage.setItem('checkoutTotal', JSON.stringify(total));

      window.dispatchEvent(new Event('cartUpdated'));
      if (onAddToBag) onAddToBag();

      return;
    }

    savePendingItem(item);
    setNoStore(true);
  };

  const handlePlus = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart[idx].qty += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  function handleOrderNow(drink) {
    const store = getSelectedStore();
    const item = {
      id: Date.now(),
      name: drink.name,
      size: "Grande",
      quantity: 1
    };
    if (store) {
      addToCart(item);
      alert("Added to cart");
    } else {
      savePendingItem(item);
      alert("Please select a store first");
      router.push("/store-locator");
    }
  }

  const calVal  = drinkData.calories?.match(/^(\d+)/)?.[1] ?? '280';
  const fatRaw  = drinkData.calories?.match(/(\d+g)\s*fat/i)?.[1] ?? '10g';
  const sugRaw  = drinkData.calories?.match(/(\d+g)\s*sugar/i)?.[1] ?? '38g';

  const sizeOz = config.sizes.find(s => s.label === size)?.oz ?? '';
  const selectionSummary = [
    `${size} · ${sizeOz}`,
    ice,
    sugar,
  ];

  const syncQtyToCart = (newQty) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const index = cart.findIndex(
      i =>
        i.drinkId === drink?.id &&
        i.size === size &&
        i.ice === ice &&
        i.sugar === sugar
    );
    if (index !== -1) {
      cart[index].quantity = newQty;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div>
      <nav>
        <button className="sbBackBtn" onClick={onBack}>
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span>{drinkData.name}</span>


      </nav>

      <div>
        <div>
          <img
            src={drinkData.src}
            alt={drinkData.name}
            draggable={false}
            onError={e => {
              e.target.src = 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20250204-IcedUbeCoconutMacchiato.jpg';
            }}
          />
          <div>
            {[
              { label: 'Calories', val: calVal },
              { label: 'Fat',      val: formatNutritionValue(fatRaw) },
              { label: 'Sugar',    val: formatNutritionValue(sugRaw) },
            ].map(({ label, val }) => (
              <div key={label}>
                <div>{val}</div>
                <div>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sbRightPanel">
          <div>
            <div>{drinkData.tag ?? 'Iced Espresso'}</div>
            <h1>{drinkData.name}</h1>
            <p>{drinkData.description}</p>

            <div>
              {selectionSummary.map(label => (
                <SelectionTag key={label} label={label} />
              ))}
            </div>

            <div>
              <SectionLabel text="Size" />
              <div>
                {config.sizes.map(s => {
                  const active = size === s.label;
                  return (
                    <button
                      key={s.label}
                      className={`sbSizeBtn${active ? ' sbSizeBtn--active' : ''}`}
                      onClick={() => setSize(s.label)}
                    >
                      <ColdCupImg sizeLabel={s.label} active={active} />
                      <span>{s.label}</span>
                      <span>{s.oz}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div>Customize</div>
              <AccordionSection
                title="Ice"
                selected={ice}
                options={config.iceOptions}
                onChange={v => setIce(v)}
              />
              <AccordionSection
                title="Sugar Level"
                selected={sugar}
                options={config.sugarOptions}
                onChange={v => setSugar(v)}
              />
            </div>

            <p>
              We cannot guarantee that any unpackaged products served in our stores are allergen-free because we use shared equipment to store, prepare, and serve them. Customers with allergies can find ingredient information for products on the labels of our packaged products or online.
            </p>
          </div>

          <div>
            <div>
              <button
                className="sbQtyBtn"
                onClick={() => {
                  setQty(q => {
                    const newQty = Math.max(1, q - 1);
                    syncQtyToCart(newQty);
                    return newQty;
                  });
                }}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{qty}</span>
              <button
                className="sbQtyBtn"
                onClick={() => {
                  setQty(q => {
                    const newQty = q + 1;
                    syncQtyToCart(newQty);
                    return newQty;
                  });
                }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button className="sbAddBtn" onClick={handleAdd}>
              Add to Order
            </button>
          </div>
        </div>
      </div>

      {toast   && <Toast drinkName={drinkData.name} sizeName={size} onClose={() => setToast(false)} />}
      {noStore && <NoStoreModal onClose={() => setNoStore(false)} />}
    </div>
  );
}