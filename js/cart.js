const DELIVERY_FEE = 500;
const FREE_DELIVERY_THRESHOLD = 15000;

function getCart() {
  const raw = localStorage.getItem("cart");
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, quantity) {
  const product = getProductById(productId);
  if (!product) {
    alert("Product not found.");
    return;
  }
  if (product.stock === 0) return;

  const cart = getCart();
  const existing = cart.find(item => item.productId === Number(productId));

  if (existing) {
    const maxAllowed = product.stock;
    existing.quantity = Math.min(existing.quantity + quantity, maxAllowed);
  } else {
    cart.push({ productId: Number(productId), quantity: Math.min(quantity, product.stock) });
  }

  saveCart(cart);
  showCartToast(product.name + " added to cart.");
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.productId !== Number(productId));
  saveCart(cart);
  renderCartPage();
}

function setCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.productId === Number(productId));
  if (!item) return;

  const product = getProductById(productId);
  let newQty = quantity;

  if (newQty < 1) newQty = 1;

  /* Enforce the stock ceiling for every product in the cart. */
  if (productId !== 3 && newQty > product.stock) {
    newQty = product.stock;
  }

  item.quantity = newQty;
  saveCart(cart);
  renderCartPage();
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartBadge();
}

function calculateCartTotals(cart) {
  let subtotal = 0;
  let discountTotal = 0;

  cart.forEach(item => {
    const product = getProductById(item.productId);
    if (!product) return;
    const finalPrice = getDiscountedPrice(product.price, product.discount);
    subtotal += product.price * item.quantity;
    discountTotal += (product.price - finalPrice) * item.quantity;
  });

  const afterDiscount = subtotal - discountTotal;
  const delivery = cart.length === 0 ? 0 : (afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const total = afterDiscount + delivery;

  return { subtotal, discount: discountTotal, delivery, total };
}

function showCartToast(message) {
  let toast = document.getElementById("cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.background = "#1b2430";
    toast.style.color = "#fff";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "10px";
    toast.style.fontSize = "0.9rem";
    toast.style.zIndex = "999";
    toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.2s ease";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => { toast.style.opacity = "1"; });
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => { toast.style.opacity = "0"; }, 1800);
}

/* ---------------------------------------------------------
   Cart page rendering
   --------------------------------------------------------- */
function renderCartPage() {
  const listEl = document.getElementById("cart-items-list");
  if (!listEl) return;

  const cart = getCart();
  const emptyState = document.getElementById("cart-empty-state");
  const summaryEl = document.getElementById("cart-summary");

  if (cart.length === 0) {
    listEl.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    if (summaryEl) summaryEl.style.display = "none";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (summaryEl) summaryEl.style.display = "block";

  listEl.innerHTML = cart.map(item => {
    const product = getProductById(item.productId);
    if (!product) return "";
    const finalPrice = getDiscountedPrice(product.price, product.discount);
    const lineSubtotal = finalPrice * item.quantity;

    return `
      <div class="cart-item card" data-product-id="${product.id}">
        <div class="cart-item-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.textContent='\u{1F6CD}'">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">${formatCurrency(finalPrice)} each</div>
        </div>
        <div class="cart-item-qty">
          <div class="qty-selector">
            <button type="button" aria-label="Decrease quantity" onclick="setCartQuantity(${product.id}, ${item.quantity - 1})">-</button>
            <input type="number" value="${item.quantity}" min="1" max="${product.stock}" readonly>
            <button type="button" aria-label="Increase quantity" onclick="setCartQuantity(${product.id}, ${item.quantity + 1})" ${item.quantity >= product.stock ? "disabled" : ""}>+</button>
          </div>
        </div>
        <div class="cart-item-subtotal">${formatCurrency(lineSubtotal)}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${product.id})">Remove</button>
      </div>
    `;
  }).join("");

  const totals = calculateCartTotals(cart);
  document.getElementById("summary-subtotal").textContent = formatCurrency(totals.subtotal);
  document.getElementById("summary-discount").textContent = "- " + formatCurrency(totals.discount);
  document.getElementById("summary-delivery").textContent = totals.delivery === 0 ? "Free" : formatCurrency(totals.delivery);
  document.getElementById("summary-total").textContent = formatCurrency(totals.total);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
});
