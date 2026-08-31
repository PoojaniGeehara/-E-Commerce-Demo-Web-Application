const CATEGORIES = ["Electronics", "Clothing", "Shoes", "Accessories", "Home"];
const CATEGORY_ICONS = {
  Electronics: "\u{1F4F1}",
  Clothing: "\u{1F455}",
  Shoes: "\u{1F45F}",
  Accessories: "\u{1F45C}",
  Home: "\u{1F3E1}"
};

/* ---------------------------------------------------------
   Rendering helpers
   --------------------------------------------------------- */
function stockLabel(product) {
  if (product.stock === 0) return { text: "Out of Stock", cls: "stock-out" };
  if (product.stock <= 5) return { text: "Low Stock (" + product.stock + " left)", cls: "stock-low" };
  return { text: "In Stock", cls: "stock-ok" };
}

function renderProductCard(product) {
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const stock = stockLabel(product);
  const disabled = product.stock === 0 ? "disabled" : "";
  const detailsLink = resolvePageLink("product-details.html?id=" + product.id);
  const imageSrc = resolveAssetPath(product.image);

  return `
    <article class="product-card card" data-product-id="${product.id}">
      <a href="${detailsLink}" class="product-card-image">
        <img src="${imageSrc}" alt="${product.name}" onerror="this.parentElement.textContent='${CATEGORY_ICONS[product.category] || "\u{1F6CD}"}'">
      </a>
      <div class="product-card-body">
        <span class="product-card-category">${product.category}</span>
        <a href="${detailsLink}" class="product-card-name">${product.name}</a>
        <div class="product-card-rating">\u2B50 ${product.rating.toFixed(1)}</div>
        <div class="product-card-price">
          <span class="price-current">${formatCurrency(finalPrice)}</span>
          ${product.discount ? `<span class="price-original">${formatCurrency(product.price)}</span><span class="badge badge-accent">${product.discount}% OFF</span>` : ""}
        </div>
        <div class="product-card-stock ${stock.cls}">${stock.text}</div>
        <div class="product-card-actions">
          <a href="${detailsLink}" class="btn btn-outline">View Details</a>
          <button class="btn btn-primary" ${disabled} onclick="addToCart(${product.id}, 1); event.stopPropagation();">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

/* ---------------------------------------------------------
   Homepage: featured products + categories
   --------------------------------------------------------- */
function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container || typeof PRODUCTS === "undefined") return;

  const featured = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
  container.innerHTML = featured.map(renderProductCard).join("");
}

function renderCategoryGrid() {
  const container = document.getElementById("category-grid");
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card card">
      <div class="category-icon">${CATEGORY_ICONS[cat]}</div>
      <h3>${cat}</h3>
      <a href="${resolvePageLink("products.html?category=" + encodeURIComponent(cat))}" class="btn btn-outline btn-sm">View Products</a>
    </div>
  `).join("");
}

/* ---------------------------------------------------------
   Products page: search, filter, sort
   --------------------------------------------------------- */
function initProductsPage() {
  const grid = document.getElementById("product-grid");
  if (!grid || typeof PRODUCTS === "undefined") return;

  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-filter");
  const priceSelect = document.getElementById("price-filter");
  const sortSelect = document.getElementById("sort-select");
  const countLabel = document.getElementById("product-count");

  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category");
  if (initialCategory && CATEGORIES.includes(initialCategory)) {
    categorySelect.value = initialCategory;
    localStorage.setItem("lastViewedCategory", initialCategory);
  }
  const initialSearch = params.get("search");
  if (initialSearch) {
    searchInput.value = initialSearch;
  }

  function applyFilters() {
    let results = [...PRODUCTS];

    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      /* Case-insensitive search on name, description, and category */
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    const category = categorySelect.value;
    if (category && category !== "all") {
      results = results.filter(p => p.category === category);
    }

    const priceRange = priceSelect.value;
    if (priceRange && priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      results = results.filter(p => {
        const finalPrice = getDiscountedPrice(p.price, p.discount);
        if (max && max > 0) return finalPrice >= min && finalPrice <= max;
        return finalPrice >= min;
      });
    }

    const sortBy = sortSelect.value;
    if (sortBy === "price-asc") {
      results.sort((a, b) => getDiscountedPrice(a.price, a.discount) - getDiscountedPrice(b.price, b.discount));
    } else if (sortBy === "price-desc") {
      results.sort((a, b) => getDiscountedPrice(b.price, b.discount) - getDiscountedPrice(a.price, a.discount));
    } else if (sortBy === "rating-desc") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name-asc") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderResults(results);
  }

  function renderResults(results) {
    if (countLabel) {
      countLabel.textContent = results.length + (results.length === 1 ? " product found" : " products found");
    }

    if (results.length === 0) {
      grid.innerHTML = `<div class="no-results">
        <p>No products matched your search.</p>
        <p class="text-muted">Try a different keyword or clear your filters.</p>
      </div>`;
      return;
    }

    grid.innerHTML = results.map(renderProductCard).join("");
  }

  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", () => {
    if (categorySelect.value !== "all") {
      localStorage.setItem("lastViewedCategory", categorySelect.value);
    }
    applyFilters();
  });
  priceSelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  applyFilters();
}

/* ---------------------------------------------------------
   Product details page
   --------------------------------------------------------- */
function initProductDetailsPage() {
  const container = document.getElementById("product-details-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = getProductById(id);

  if (!product) {
    container.innerHTML = `<div class="empty-state">
      <div class="empty-icon">\u26A0\uFE0F</div>
      <p>Product not found.</p>
      <a href="${resolvePageLink("products.html")}" class="btn btn-primary">Back to Products</a>
    </div>`;
    return;
  }

  document.title = product.name + " - ShopEase";

  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const stock = stockLabel(product);
  const outOfStock = product.stock === 0;
  const imageSrc = resolveAssetPath(product.image);

  container.innerHTML = `
    <div class="product-details-image">
      <img src="${imageSrc}" alt="${product.name}" onerror="this.parentElement.textContent='${CATEGORY_ICONS[product.category] || "\u{1F6CD}"}'; this.parentElement.style.fontSize='4rem';">
    </div>
    <div class="product-details-info">
      <div class="category-tag">${product.category}</div>
      <h1>${product.name}</h1>
      <div class="product-details-rating">\u2B50 ${product.rating.toFixed(1)} rating</div>
      <div class="product-details-price">
        <span class="price-current">${formatCurrency(finalPrice)}</span>
        ${product.discount ? `<span class="price-original">${formatCurrency(product.price)}</span><span class="badge badge-accent">${product.discount}% OFF</span>` : ""}
      </div>
      <p class="product-details-description">${product.description}</p>
      <div class="stock-line ${stock.cls}">${stock.text}</div>

      ${outOfStock ? "" : `
      <div class="qty-selector" id="qty-selector">
        <button type="button" id="qty-decrease" aria-label="Decrease quantity">-</button>
        <input type="number" id="qty-input" value="1" min="1" max="${product.stock}" readonly>
        <button type="button" id="qty-increase" aria-label="Increase quantity">+</button>
      </div>`}

      <div class="product-details-actions">
        <button class="btn btn-primary" id="add-to-cart-btn" ${outOfStock ? "disabled" : ""}>
          ${outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        <a href="${resolvePageLink("products.html")}" class="btn btn-outline">Back to Products</a>
      </div>
    </div>
  `;

  if (!outOfStock) {
    const qtyInput = document.getElementById("qty-input");
    const decreaseBtn = document.getElementById("qty-decrease");
    const increaseBtn = document.getElementById("qty-increase");

    function syncQtyButtons() {
      const qty = Number(qtyInput.value);
      decreaseBtn.disabled = qty <= 1;
      increaseBtn.disabled = qty >= product.stock;
    }

    decreaseBtn.addEventListener("click", () => {
      const qty = Math.max(1, Number(qtyInput.value) - 1);
      qtyInput.value = qty;
      syncQtyButtons();
    });

    increaseBtn.addEventListener("click", () => {
      const qty = Math.min(product.stock, Number(qtyInput.value) + 1);
      qtyInput.value = qty;
      syncQtyButtons();
    });

    syncQtyButtons();

    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      const qty = Number(qtyInput.value);
      addToCart(product.id, qty);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedProducts();
  renderCategoryGrid();
  initProductsPage();
  initProductDetailsPage();
});
