function initProfilePage() {
  const container = document.getElementById("profile-container");
  if (!container) return;

  if (!isLoggedIn()) {
    window.location.href = "login.html";
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
  setupEditToggle(user);
}

function renderProfileView(user) {
  document.getElementById("profile-name").textContent = user.fullName || "-";
  document.getElementById("profile-email").textContent = user.email || "-";
  document.getElementById("profile-phone").textContent = user.phone || "-";
  document.getElementById("profile-address").textContent = user.address || "Not provided";

  document.getElementById("edit-name").value = user.fullName || "";
  document.getElementById("edit-phone").value = user.phone || "";
  document.getElementById("edit-address").value = user.address || "";
}

function setupEditToggle(user) {
  const viewSection = document.getElementById("profile-view");
  const editSection = document.getElementById("profile-edit-form");
  const editBtn = document.getElementById("edit-profile-btn");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const form = document.getElementById("profile-edit-form");
  const alertEl = document.getElementById("profile-alert");

  editBtn.addEventListener("click", () => {
    viewSection.style.display = "none";
    editSection.style.display = "block";
  });

  cancelBtn.addEventListener("click", () => {
    editSection.style.display = "none";
    viewSection.style.display = "block";
  });

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

    const updatedUser = {
      ...user,
      fullName: name.trim(),
      phone: phone.trim(),
      address: address.trim()
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    user = updatedUser;

    renderProfileView(updatedUser);
    editSection.style.display = "none";
    viewSection.style.display = "block";

    if (alertEl) {
      alertEl.textContent = "Profile updated successfully.";
      alertEl.className = "alert alert-success show";
      setTimeout(() => alertEl.classList.remove("show"), 2500);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initProfilePage();
});
