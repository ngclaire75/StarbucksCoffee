'use client';
/**
 * AppOrchestrator.jsx
 *
 * Manages navigation between:
 *   1. CustomizePage  – drink customisation + cart
 *   2. StoreLocator   – pick a Pickup store
 *   3. PaymentPage    – card details + order confirmation
 *
 * ── Flows ──────────────────────────────────────────────────────────────────
 *
 * A) Store selected FIRST (user taps "Select a store" in the store bar before
 *    adding anything):
 *    - handleSelectStore(null) is called → navigate to StoreLocator, no item queued
 *    - StoreLocator fires onStoreSelect(store) → store saved, return to CustomizePage
 *    - CustomizePage detects storeSelected flipped true with empty cart → shows
 *      StoreConfirmedModal ("Store selected! Got it")
 *    - User customises drink, clicks "Add to Order" → item added directly to cart
 *    - Cart bubble shows count, user clicks it → CartDrawer opens
 *    - "Proceed to Checkout" → PaymentPage
 *
 * B) "Add to Order" with NO store selected:
 *    - CustomizePage shows NoStoreModal
 *    - User clicks "Select Store" → handleSelectStore(item) called with current item
 *    - item is stored as pendingItem, navigate to StoreLocator
 *    - StoreLocator fires onStoreSelect(store) → store saved, pendingItem merged
 *      into cart, return to CustomizePage (same drink, all choices preserved)
 *    - Cart bubble shows count. User manually opens cart drawer to review
 *    - "Proceed to Checkout" → PaymentPage
 *
 * C) Bag/bubble click with NO store:
 *    - Same as B (item queued from current customisation state)
 *
 * D) "Order" button on menu card (before customise):
 *    - Same queue logic as B with default-options item
 */

import { useState, useCallback } from 'react';
import CustomizePage from './menupage/customizepage';
import StoreLocator  from './store-locator/storelocator';
import PaymentPage   from './payment/paymentpage';

const VIEW = {
  CUSTOMIZE: 'customize',
  STORE:     'store',
  PAYMENT:   'payment',
};

export default function AppOrchestrator({ drink, onBack: onBackToMenu }) {
  const [view,        setView]        = useState(VIEW.CUSTOMIZE);
  const [savedStore,  setSavedStore]  = useState(null);
  const [cartItems,   setCartItems]   = useState([]);
  const [orderTotal,  setOrderTotal]  = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  // Item queued while user goes to pick a store (null when just pre-selecting)
  const [pendingItem, setPendingItem] = useState(null);

  /* ── Cart merge helper ── */
  const mergeIntoCart = useCallback((item, prev) => {
    const idx = prev.findIndex(
      c =>
        c.id    === item.id    &&
        c.size  === item.size  &&
        c.ice   === item.ice   &&
        c.sugar === item.sugar
    );
    if (idx >= 0) {
      const updated = [...prev];
      updated[idx]  = { ...updated[idx], qty: updated[idx].qty + item.qty };
      return updated;
    }
    return [...prev, { ...item }];
  }, []);

  /* ── Add to bag (store already selected) ── */
  const handleAddToBag = useCallback((item) => {
    setCartItems(prev => mergeIntoCart(item, prev));
  }, [mergeIntoCart]);

  /* ── Navigate to StoreLocator ─────────────────────────────────────────────
   *  itemToQueue – item snapshot from current UI; null when user is just
   *                pre-selecting / changing a store with nothing in progress.
   */
  const handleSelectStore = useCallback((itemToQueue = null) => {
    if (itemToQueue) setPendingItem(itemToQueue);
    setView(VIEW.STORE);
  }, []);

  /* ── Store confirmed from StoreLocator ── */
  const handleStoreSelect = useCallback((store) => {
    setSavedStore(store);
    // If an item was waiting, merge it into the cart NOW
    if (pendingItem) {
      setCartItems(prev => mergeIntoCart(pendingItem, prev));
      setPendingItem(null);
    }
    // Always return to CustomizePage (local drink state is preserved there)
    setView(VIEW.CUSTOMIZE);
  }, [pendingItem, mergeIntoCart]);

  /* ── Cart qty / remove ── */
  const handleUpdateQty = useCallback((idx, qty) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[idx]  = { ...updated[idx], qty };
      return updated;
    });
  }, []);

  const handleRemoveItem = useCallback((idx) => {
    setCartItems(prev => prev.filter((_, i) => i !== idx));
  }, []);

  /* ── Checkout ── */
  const handleCheckout = useCallback((total) => {
    setOrderTotal(total);
    setView(VIEW.PAYMENT);
  }, []);

  /* ── Order complete – reset ── */
  const handleOrderComplete = useCallback(() => {
    setCartItems([]);
    setOrderTotal(0);
    setPendingItem(null);
    setView(VIEW.CUSTOMIZE);
  }, []);

  /* ── Render ── */
  if (view === VIEW.STORE) {
    return (
      <StoreLocator
        savedStore={savedStore}
        onStoreSelect={handleStoreSelect}
      />
    );
  }

  if (view === VIEW.PAYMENT) {
    return (
      <PaymentPage
        total={orderTotal}
        cartItems={cartItems}
        store={savedStore}
        onBack={() => setView(VIEW.CUSTOMIZE)}
        onComplete={handleOrderComplete}
      />
    );
  }

  // VIEW.CUSTOMIZE (default)
  return (
    <CustomizePage
        drink={selectedDrink}
  cartCount={cartCount}
  onAddToBag={handleBagUpdate}
      storeSelected={!!savedStore}
      savedStore={savedStore}
      onBack={onBackToMenu}
     
      onSelectStore={handleSelectStore}
      onCheckout={handleCheckout}
      cartItems={cartItems}
      onUpdateCartQty={handleUpdateQty}
      onRemoveCartItem={handleRemoveItem}
    />
  );
}