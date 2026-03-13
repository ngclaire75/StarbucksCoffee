export function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function savePendingItem(item) {
  localStorage.setItem("pendingCartItem", JSON.stringify(item));
}

export function getSelectedStore() {
  return JSON.parse(localStorage.getItem("selectedStore") || "null");
}