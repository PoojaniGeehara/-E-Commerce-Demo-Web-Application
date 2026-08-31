function initCheckoutPage() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  const cart = getCart();
  const emptyState = document.getElementById("checkout-empty-state");
  const checkoutContent = document.getElementById("checkout-content");

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    if (checkoutContent) checkoutContent.style.display = "none";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (checkoutContent) checkoutContent.style.display = "grid";

  prefillCustomerInfo();
  renderOrderSummary(cart);
  setupPaymentToggle();
  setupCheckoutValidation(form, cart);
}

function prefillCustomerInfo() {
  const user = getCurrentUser();
  if (!user) return;
  const nameField = document.getElementById("checkout-name");
  const emailField = document.getElementById("checkout-email");
  const phoneField = document.getElementById("checkout-phone");
  const addressField = document.getElementById("checkout-address");
  const cityField = document.getElementById("checkout-city");
  const postalField = document.getElementById("checkout-postal");

  if (nameField && user.fullName) nameField.value = user.fullName;
  if (emailField && user.email) emailField.value = user.email;
  if (phoneField && user.phone) phoneField.value = user.phone;
  if (addressField && user.address) addressField.value = user.address;
  if (cityField && user.city) cityField.value = user.city;
  if (postalField && user.postalCode) postalField.value = user.postalCode;
}

function renderOrderSummary(cart) {
  const listEl = document.getElementById("order-summary-items");
  const totals = calculateCartTotals(cart);

  if (listEl) {
    listEl.innerHTML = cart.map(item => {
      const product = getProductById(item.productId);
      if (!product) return "";
      const finalPrice = getDiscountedPrice(product.price, product.discount);
      return `
        <div class="order-line-item">
          <span>${product.name} &times; ${item.quantity}</span>
          <span>${formatCurrency(finalPrice * item.quantity)}</span>
        </div>
      `;
    }).join("");
  }

  const subtotalEl = document.getElementById("checkout-subtotal");
  const discountEl = document.getElementById("checkout-discount");
  const deliveryEl = document.getElementById("checkout-delivery");
  const totalEl = document.getElementById("checkout-total");

  if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
  if (discountEl) discountEl.textContent = "- " + formatCurrency(totals.discount);
  if (deliveryEl) deliveryEl.textContent = totals.delivery === 0 ? "Free" : formatCurrency(totals.delivery);
  if (totalEl) totalEl.textContent = formatCurrency(totals.total);
}

function setupPaymentToggle() {
  const radios = document.querySelectorAll("input[name='payment-method']");
  const cardFields = document.getElementById("card-fields");

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".radio-option").forEach(opt => opt.classList.remove("selected"));
      const parentLabel = radio.closest(".radio-option");
      if (parentLabel) parentLabel.classList.add("selected");
      if (cardFields) cardFields.classList.toggle("show", radio.value === "card");
    });
  });
}

function setupCheckoutValidation(form, cart) {
  const fieldIds = [
    "checkout-name", "checkout-email", "checkout-phone",
    "checkout-address", "checkout-city", "checkout-postal",
    "card-number", "card-expiry", "card-cvv"
  ];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllFieldErrors(fieldIds);

    const paymentMethodEl = document.querySelector("input[name='payment-method']:checked");
    const paymentError = document.getElementById("payment-error");
    if (paymentError) paymentError.classList.remove("show");

    let valid = true;

    const name = document.getElementById("checkout-name").value;
    const email = document.getElementById("checkout-email").value;
    const phone = document.getElementById("checkout-phone").value;
    const address = document.getElementById("checkout-address").value;
    const city = document.getElementById("checkout-city").value;
    const postal = document.getElementById("checkout-postal").value;

    if (!validateRequired(name)) {
      showFieldError("checkout-name", "Full name is required.");
      valid = false;
    }

    if (!validateRequired(email)) {
      showFieldError("checkout-email", "Email is required.");
      valid = false;
    } else if (!validateEmail(email)) {
      showFieldError("checkout-email", "Please enter a valid email address.");
      valid = false;
    }

    if (!validateRequired(phone)) {
      showFieldError("checkout-phone", "Phone number is required.");
      valid = false;
    } else if (!validatePhone(phone)) {
      showFieldError("checkout-phone", "Phone number must contain 10 digits.");
      valid = false;
    }

    if (!validateRequired(address)) {
      showFieldError("checkout-address", "Address is required.");
      valid = false;
    }

    if (!validateRequired(city)) {
      showFieldError("checkout-city", "City is required.");
      valid = false;
    }

    if (!validateRequired(postal)) {
      showFieldError("checkout-postal", "Postal code is required.");
      valid = false;
    } else if (!validatePostalCode(postal)) {
      showFieldError("checkout-postal", "Postal code must contain 5 digits.");
      valid = false;
    }

    if (!paymentMethodEl) {
      if (paymentError) paymentError.classList.add("show");
      valid = false;
    } else if (paymentMethodEl.value === "card") {
      const cardNumber = document.getElementById("card-number").value;
      const expiry = document.getElementById("card-expiry").value;
      const cvv = document.getElementById("card-cvv").value;

      if (!validateRequired(cardNumber)) {
        showFieldError("card-number", "Card number is required.");
        valid = false;
      } else if (!validateCardNumber(cardNumber)) {
        showFieldError("card-number", "Card number must contain 16 digits.");
        valid = false;
      }

      if (!validateRequired(expiry)) {
        showFieldError("card-expiry", "Expiry date is required.");
        valid = false;
      } else if (!validateExpiry(expiry)) {
        showFieldError("card-expiry", "Enter a valid future expiry date (MM/YY).");
        valid = false;
      }

      if (!validateRequired(cvv)) {
        showFieldError("card-cvv", "CVV is required.");
        valid = false;
      } else if (!validateCVV(cvv)) {
        showFieldError("card-cvv", "CVV must contain 3 or 4 digits.");
        valid = false;
      }
    }

    if (!valid) return;

    placeOrder({
      name, email, phone, address, city, postal,
      paymentMethod: paymentMethodEl.value
    }, cart);
  });
}

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return "ORD-" + year + "-" + random;
}

function placeOrder(customer, cart) {
  const totals = calculateCartTotals(cart);
  const orderNumber = generateOrderNumber();

  const deliveryDays = 3 + Math.floor(Math.random() * 3);
  const estimatedDelivery = deliveryDays + "-" + (deliveryDays + 2) + " business days";

  const order = {
    orderNumber,
    items: cart,
    customer,
    totals,
    estimatedDelivery,
    placedAt: new Date().toISOString()
  };

  localStorage.setItem("order", JSON.stringify(order));
  clearCart();

  window.location.href = resolvePageLink("order-success.html");
}

/* ---------------------------------------------------------
   Order success page
   --------------------------------------------------------- */
function renderOrderSuccessPage() {
  const container = document.getElementById("order-success-details");
  if (!container) return;

  const raw = localStorage.getItem("order");
  if (!raw) {
    container.innerHTML = `<p class="text-muted">No recent order found.</p>`;
    return;
  }

  const order = JSON.parse(raw);
  const addressLine = [order.customer.address, order.customer.city, order.customer.postal]
    .filter(Boolean)
    .join(", ");

  const orderNumEl = document.getElementById("order-number-value");
  if (orderNumEl) orderNumEl.textContent = order.orderNumber;

  const itemsHtml = (order.items || []).map(item => {
    const product = getProductById(item.productId);
    const name = product ? product.name : `Product #${item.productId}`;
    const price = product ? getDiscountedPrice(product.price, product.discount) : 0;
    return `<div class="detail-row"><span>${name} &times; ${item.quantity}</span><span>${formatCurrency(price * item.quantity)}</span></div>`;
  }).join("");

  container.innerHTML = `
    <div class="detail-row"><span>Order Number</span><span>${order.orderNumber}</span></div>
    <div class="detail-row"><span>Customer Name</span><span>${order.customer.name || "-"}</span></div>
    <div class="detail-row"><span>Contact Email</span><span>${order.customer.email || "-"}</span></div>
    <div class="detail-row"><span>Delivery Address</span><span>${addressLine || "-"}</span></div>
    <div class="detail-row"><span>Estimated Delivery</span><span>${order.estimatedDelivery}</span></div>
    <div class="detail-row"><span>Payment Method</span><span>${order.customer.paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}</span></div>
    ${itemsHtml ? `<div style="margin-top:12px; padding-top:8px; border-top:1px dashed var(--color-border); font-weight:600; color:var(--color-text); text-align:left;">Items Ordered:</div>${itemsHtml}` : ""}
    <div class="detail-row" style="margin-top:8px; font-weight:700; font-size:1rem; border-top:1px solid var(--color-border); padding-top:12px;">
      <span>Total Paid</span><span>${formatCurrency(order.totals.total)}</span>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  initCheckoutPage();
  renderOrderSuccessPage();
});
