function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return "Rs. " + value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/* ---------------------------------------------------------
   Discounted price calculation.
   --------------------------------------------------------- */
function getDiscountedPrice(price, discount) {
  if (!discount) return price;
  const reduced = price - (price * discount) / 100;
  return Math.floor(reduced);
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

/* ---------------------------------------------------------
   Session helpers
   --------------------------------------------------------- */
function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function getCartCount() {
  const raw = localStorage.getItem("cart");
  const cart = raw ? JSON.parse(raw) : [];
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/* ---------------------------------------------------------
   Navbar: login state, active link, cart badge, mobile menu
   --------------------------------------------------------- */
function renderNavbarAuthState() {
  const loggedIn = isLoggedIn();
  const guestLinks = document.querySelectorAll("[data-nav='guest-only']");
  const authLinks = document.querySelectorAll("[data-nav='auth-only']");

  guestLinks.forEach(el => {
    el.style.display = loggedIn ? "none" : "";
  });
  authLinks.forEach(el => {
    el.style.display = loggedIn ? "" : "none";
  });
}

function updateCartBadge() {
  const badge = document.querySelector("[data-cart-count]");
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = "Cart (" + count + ")";
}

function highlightActiveNavLink() {
  const links = document.querySelectorAll(".navbar-links a[data-page]");
  const current = document.body.getAttribute("data-page");
  links.forEach(link => {
    if (link.getAttribute("data-page") === current) {
      link.classList.add("active");
    }
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector(".navbar-toggle");
  const links = document.querySelector(".navbar-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
    });
  });
}

function setupLogoutButtons() {
  document.querySelectorAll("[data-action='logout']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbarAuthState();
  updateCartBadge();
  highlightActiveNavLink();
  setupMobileMenu();
  setupLogoutButtons();

  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
