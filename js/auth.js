const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "Password123";

function showAlert(alertEl, message, type) {
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = "alert show " + (type === "success" ? "alert-success" : "alert-error");
}

function getRegisteredUsers() {
  const raw = localStorage.getItem("registered_users");
  return raw ? JSON.parse(raw) : [];
}

function saveRegisteredUsers(users) {
  localStorage.setItem("registered_users", JSON.stringify(users));
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

    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const rememberInput = document.getElementById("login-remember");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const remember = rememberInput ? rememberInput.checked : false;

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

    const normalizedEmail = email.toLowerCase();
    const registeredUsers = getRegisteredUsers();
    const matchedUser = registeredUsers.find(u => (u.email || "").toLowerCase() === normalizedEmail && u.password === password);

    if (normalizedEmail === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD) {
      const existingUser = getCurrentUser();
      const user = existingUser && existingUser.email === DEMO_EMAIL ? existingUser : {
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

      showAlert(alertEl, "Login successful. Redirecting...", "success");
      setTimeout(() => {
        window.location.href = resolvePageLink("index.html");
      }, 700);
    } else if (matchedUser) {
      const sessionUser = {
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        phone: matchedUser.phone || "",
        address: matchedUser.address || "",
        city: matchedUser.city || "",
        postalCode: matchedUser.postalCode || ""
      };
      localStorage.setItem("user", JSON.stringify(sessionUser));
      localStorage.setItem("isLoggedIn", "true");
      if (remember) {
        localStorage.setItem("rememberMe", "true");
      }

      showAlert(alertEl, "Login successful. Welcome back!", "success");
      setTimeout(() => {
        window.location.href = resolvePageLink("index.html");
      }, 700);
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

    const normalizedEmail = email.trim().toLowerCase();
    const registeredUsers = getRegisteredUsers();

    if (normalizedEmail === DEMO_EMAIL.toLowerCase() || registeredUsers.some(u => (u.email || "").toLowerCase() === normalizedEmail)) {
      showAlert(alertEl, "An account with this email address already exists.", "error");
      showFieldError("register-email", "Email already in use.");
      return;
    }

    const newUser = {
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password,
      address: "",
      city: "",
      postalCode: ""
    };

    registeredUsers.push(newUser);
    saveRegisteredUsers(registeredUsers);

    showAlert(alertEl, "Registration successful! You can now log in.", "success");
    form.reset();
    setTimeout(() => {
      window.location.href = resolvePageLink("login.html");
    }, 1000);
  });
}

/* ---------------------------------------------------------
   LOGOUT
   --------------------------------------------------------- */
function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  window.location.href = resolvePageLink("login.html");
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initRegisterForm();
});
