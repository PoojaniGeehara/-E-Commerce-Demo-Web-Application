function validateRequired(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateMinLength(value, min) {
  return typeof value === "string" && value.trim().length >= min;
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(String(email).trim());
}

function validatePhone(phone) {
  const digitsOnly = String(phone).replace(/[\s-]/g, "");
  return /^\d{10}$/.test(digitsOnly);
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

function validatePasswordMatch(password, confirmPassword) {
  return password === confirmPassword;
}

/* Postal code should require exactly 5 digits. */
function validatePostalCode(code) {
  const pattern = /^\d{5}$/;
  return pattern.test(String(code).trim());
}

function validateCardNumber(cardNumber) {
  const digitsOnly = String(cardNumber).replace(/[\s-]/g, "");
  return /^\d{16}$/.test(digitsOnly);
}

function validateCVV(cvv) {
  return /^\d{3,4}$/.test(String(cvv).trim());
}

function validateExpiry(expiry) {
  const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const trimmed = String(expiry).trim();
  if (!pattern.test(trimmed)) return false;

  const [monthStr, yearStr] = trimmed.split("/");
  const expMonth = parseInt(monthStr, 10);
  const expYear = 2000 + parseInt(yearStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }
  return true;
}

/* ---------------------------------------------------------
   Helper: show / hide an inline field error message.
   Expects an element with id `${fieldId}-error` to exist.
   --------------------------------------------------------- */
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "-error");
  if (input) input.classList.add("input-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("show");
  }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "-error");
  if (input) input.classList.remove("input-error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("show");
  }
}

function clearAllFieldErrors(fieldIds) {
  fieldIds.forEach(clearFieldError);
}
