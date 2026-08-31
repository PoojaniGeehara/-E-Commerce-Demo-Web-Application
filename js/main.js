function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return "Rs. " + value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/* ---------------------------------------------------------
   Path helpers for multi-directory HTML support
   --------------------------------------------------------- */
function isSubPage() {
  const path = (window.location.pathname || "").replace(/\\/g, "/");
  return path.includes("/pages/") || (document.body && document.body.getAttribute("data-page") !== "home");
}

function resolveAssetPath(imagePath) {
  if (!imagePath) return "";
  const clean = imagePath.replace(/^(\.\.\/|\.\/)+/, "");
  return isSubPage() ? "../" + clean : clean;
}

function resolvePageLink(pagePath) {
  if (!pagePath) return "#";
  if (pagePath.startsWith("http://") || pagePath.startsWith("https://") || pagePath.startsWith("#")) {
    return pagePath;
  }
  const clean = pagePath.replace(/^(\.\.\/|\.\/)+/, "");
  if (isSubPage()) {
    if (clean === "index.html" || clean.startsWith("index.html#")) {
      return "../" + clean;
    }
    return clean.startsWith("pages/") ? clean.substring(6) : clean;
  } else {
    if (clean === "index.html" || clean.startsWith("index.html#")) {
      return clean;
    }
    return clean.startsWith("pages/") ? clean : "pages/" + clean;
  }
}

/* ---------------------------------------------------------
   Discounted price calculation.
   --------------------------------------------------------- */
function getDiscountedPrice(price, discount) {
  if (!discount) return price;
  const reduced = price - (price * discount) / 100;
  return Math.round(reduced);
}

function getProductById(id) {
  if (typeof PRODUCTS === "undefined") return null;
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
