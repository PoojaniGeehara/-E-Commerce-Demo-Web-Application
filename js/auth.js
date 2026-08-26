const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "Password123";

function showAlert(alertEl, message, type) {
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = "alert show " + (type === "success" ? "alert-success" : "alert-error");
}

/* ---------------------------------------------------------
   LOGIN
   --------------------------------------------------------- */
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const alertEl = document.getElementById("login-alert");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const remember = document.getElementById("login-remember").checked;

    clearAllFieldErrors(["login-email", "login-password"]);
    if (alertEl) alertEl.className = "alert";

    let valid = true;

    if (!validateRequired(email)) {
      showFieldError("login-email", "Email is required.");
      valid = false;
    } else if (!validateEmail(email)) {
      showFieldError("login-email", "Please enter a valid email address.");
      valid = false;
    }

    if (!validateRequired(password)) {
      showFieldError("login-password", "Password is required.");
      valid = false;
    }

    if (!valid) return;

    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const existingUser = getCurrentUser();
      const user = existingUser || {
        fullName: "Demo User",
        email: DEMO_EMAIL,
        phone: "0771234567",
        address: "",
        city: "",
        postalCode: ""
      };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      if (remember) {
        localStorage.setItem("rememberMe", "true");
      }

      showAlert(alertEl, "Login successful.", "success");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 900);
    } else {
      showAlert(alertEl, "Invalid email or password.", "error");
    }
  });
}

/* ---------------------------------------------------------
   REGISTER
   --------------------------------------------------------- */
function initRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const alertEl = document.getElementById("register-alert");
  const fieldIds = ["register-name", "register-email", "register-phone", "register-password", "register-confirm-password"];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const phone = document.getElementById("register-phone").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;

    clearAllFieldErrors(fieldIds);
    if (alertEl) alertEl.className = "alert";

    let valid = true;

    if (!validateRequired(name)) {
      showFieldError("register-name", "Full name is required.");
      valid = false;
    } else if (!validateMinLength(name, 3)) {
      showFieldError("register-name", "Full name must be at least 3 characters.");
      valid = false;
    }

    if (!validateRequired(email)) {
      showFieldError("register-email", "Email is required.");
      valid = false;
    } else if (!validateEmail(email)) {
      showFieldError("register-email", "Please enter a valid email address.");
      valid = false;
    }

    if (!validateRequired(phone)) {
      showFieldError("register-phone", "Phone number is required.");
      valid = false;
    } else if (!validatePhone(phone)) {
      showFieldError("register-phone", "Phone number must contain 10 digits.");
      valid = false;
    }

    if (!validateRequired(password)) {
      showFieldError("register-password", "Password is required.");
      valid = false;
    } else if (!validatePassword(password)) {
      showFieldError("register-password", "Password must be at least 8 characters.");
      valid = false;
    }

    if (!validateRequired(confirmPassword)) {
      showFieldError("register-confirm-password", "Please confirm your password.");
      valid = false;
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      showFieldError("register-confirm-password", "Passwords do not match.");
      valid = false;
    }

    if (!valid) return;

    /* Demo only: never store real passwords. */
    const user = {
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: "",
      city: "",
      postalCode: ""
    };
    localStorage.setItem("user", JSON.stringify(user));

    showAlert(alertEl, "Registration successful.", "success");
    form.reset();
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  });
}

/* ---------------------------------------------------------
   LOGOUT
   --------------------------------------------------------- */
function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  /* Note: session-related demo values are cleared above. */
  window.location.href = window.location.pathname.includes("/pages/")
    ? "login.html"
    : "pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initRegisterForm();
});
