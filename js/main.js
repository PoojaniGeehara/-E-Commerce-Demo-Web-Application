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

function updateNavActive(pageName) {
  const links = document.querySelectorAll(".navbar-links a[data-page]");
  links.forEach(link => {
    if (link.getAttribute("data-page") === pageName) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function highlightActiveNavLink() {
  if (window.location.hash === "#categories" || window.location.hash === "#/categories") {
    updateNavActive("categories");
    return;
  }
  const current = document.body ? document.body.getAttribute("data-page") : "";
  updateNavActive(current);
}

function setupCategoryNav() {
  const isHome = document.body && document.body.getAttribute("data-page") === "home";

  function scrollToCategories(smooth) {
    const target = document.getElementById("categories");
    if (!target) return false;
    const navbar = document.querySelector(".navbar");
    const navHeight = navbar ? navbar.offsetHeight : 70;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - navHeight - 16);

    window.scrollTo({
      top: offsetPosition,
      behavior: smooth ? "smooth" : "auto"
    });
    return true;
  }

  // Intercept category link clicks
  const categoryLinks = document.querySelectorAll("a[data-page='categories'], a[href*='#categories']");
  categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (isHome) {
        e.preventDefault();
        scrollToCategories(true);
        if (window.history && window.history.pushState) {
          window.history.pushState(null, "", "#categories");
        } else {
          window.location.hash = "categories";
        }
        updateNavActive("categories");
      }
    });
  });

  // Handle direct hash navigation when page loads
  if (isHome && (window.location.hash === "#categories" || window.location.hash === "#/categories")) {
    const doScroll = () => {
      scrollToCategories(true);
      updateNavActive("categories");
    };
    setTimeout(doScroll, 120);
    window.addEventListener("load", () => setTimeout(doScroll, 200), { once: true });
  }

  // Scroll spy to highlight Categories when scrolled into view on Home
  if (isHome) {
    let scrollTimeout;
    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const categoriesSection = document.getElementById("categories");
        if (!categoriesSection) return;

        const navbar = document.querySelector(".navbar");
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const rect = categoriesSection.getBoundingClientRect();

        // Check if categories section is in viewport
        if (rect.top <= navHeight + 80 && rect.bottom >= navHeight + 100) {
          updateNavActive("categories");
        } else if (window.scrollY < 200) {
          updateNavActive("home");
        }
      }, 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }
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
  setupCategoryNav();
  setupMobileMenu();
  setupLogoutButtons();

  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
