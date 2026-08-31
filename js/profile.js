function initProfilePage() {
  const container = document.getElementById("profile-container");
  if (!container) return;

  if (!isLoggedIn()) {
    window.location.href = resolvePageLink("login.html");
    return;
  }

  const user = getCurrentUser() || {
    fullName: "Demo User",
    email: "demo@example.com",
    phone: "0771234567",
    address: "",
    city: "",
    postalCode: ""
  };

  renderProfileView(user);
  setupEditToggle();
}

function renderProfileView(user) {
  const nameEl = document.getElementById("profile-name");
  const emailEl = document.getElementById("profile-email");
  const phoneEl = document.getElementById("profile-phone");
  const addressEl = document.getElementById("profile-address");

  if (nameEl) nameEl.textContent = user.fullName || "-";
  if (emailEl) emailEl.textContent = user.email || "-";
  if (phoneEl) phoneEl.textContent = user.phone || "-";
  if (addressEl) addressEl.textContent = user.address || "Not provided";

  const editName = document.getElementById("edit-name");
  const editPhone = document.getElementById("edit-phone");
  const editAddress = document.getElementById("edit-address");

  if (editName) editName.value = user.fullName || "";
  if (editPhone) editPhone.value = user.phone || "";
  if (editAddress) editAddress.value = user.address || "";
}

function setupEditToggle() {
  const viewSection = document.getElementById("profile-view");
  const editSection = document.getElementById("profile-edit-form");
  const editBtn = document.getElementById("edit-profile-btn");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const form = document.getElementById("profile-edit-form");
  const alertEl = document.getElementById("profile-alert");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const currentUser = getCurrentUser() || {};
      renderProfileView(currentUser);
      if (viewSection) viewSection.style.display = "none";
      if (editSection) editSection.style.display = "block";
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      if (editSection) editSection.style.display = "none";
      if (viewSection) viewSection.style.display = "block";
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fieldIds = ["edit-name", "edit-phone"];
      clearAllFieldErrors(fieldIds);

      const name = document.getElementById("edit-name").value;
      const phone = document.getElementById("edit-phone").value;
      const address = document.getElementById("edit-address").value;

      let valid = true;

      if (!validateRequired(name)) {
        showFieldError("edit-name", "Full name is required.");
        valid = false;
      } else if (!validateMinLength(name, 3)) {
        showFieldError("edit-name", "Full name must be at least 3 characters.");
        valid = false;
      }

      if (!validateRequired(phone)) {
        showFieldError("edit-phone", "Phone number is required.");
        valid = false;
      } else if (!validatePhone(phone)) {
        showFieldError("edit-phone", "Phone number must contain 10 digits.");
        valid = false;
      }

      if (!valid) return;

      const user = getCurrentUser() || {};
      const updatedUser = {
        ...user,
        fullName: name.trim(),
        phone: phone.trim(),
        address: address.trim()
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      try {
        const raw = localStorage.getItem("registered_users");
        const registeredUsers = raw ? JSON.parse(raw) : [];
        const idx = registeredUsers.findIndex(u => (u.email || "").toLowerCase() === (updatedUser.email || "").toLowerCase());
        if (idx !== -1) {
          registeredUsers[idx] = { ...registeredUsers[idx], ...updatedUser };
          localStorage.setItem("registered_users", JSON.stringify(registeredUsers));
        }
      } catch (err) {
        console.error(err);
      }

      renderProfileView(updatedUser);
      if (editSection) editSection.style.display = "none";
      if (viewSection) viewSection.style.display = "block";

      if (alertEl) {
        alertEl.textContent = "Profile updated successfully.";
        alertEl.className = "alert alert-success show";
        setTimeout(() => alertEl.classList.remove("show"), 2500);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initProfilePage();
});
