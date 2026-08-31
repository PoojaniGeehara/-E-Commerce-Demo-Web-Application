# ShopEase - QA Test Plan & Test Suite Documentation

## 1. Overview
This test plan defines the testing strategy, test coverage, scenarios, test cases, and bug tracking for the **ShopEase Demo E-Commerce Web Application**.

---

## 2. Test Scope & Environments

- **Application Type:** Static Client-Side Single/Multi-page Application (HTML5, CSS3, Vanilla JS, LocalStorage)
- **Supported Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge, Safari
- **Target Devices / Viewports:**
  - Desktop (>= 1024px)
  - Tablet (768px - 1023px)
  - Mobile (360px - 767px)

---

## 3. Test Cases Matrix

### 3.1 Authentication & Session Management (AUTH)
| Test ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-AUTH-01 | Successful login with default demo account | 1. Navigate to Login page.<br>2. Enter `demo@example.com` and `Password123`.<br>3. Click 'Login'. | User logged in, redirected to Home, navbar shows Profile/Logout. | High |
| TC-AUTH-02 | Login with invalid password | 1. Enter `demo@example.com` and `WrongPass`.<br>2. Click 'Login'. | Error message 'Invalid email or password.' displayed. | High |
| TC-AUTH-03 | Login form required fields | 1. Leave email and password blank.<br>2. Click 'Login'. | Inline field errors displayed for empty fields. | Medium |
| TC-AUTH-04 | User registration | 1. Navigate to Register page.<br>2. Fill in Name, Email, Phone (10 digits), Password (>=8 chars), Confirm Password.<br>3. Submit form. | Account created, success alert shown, redirected to Login. | High |
| TC-AUTH-05 | Login with newly registered account | 1. Enter credentials of registered user.<br>2. Click 'Login'. | Login succeeds with registered profile data loaded. | High |
| TC-AUTH-06 | Duplicate email registration | 1. Attempt registering with an existing email. | Error 'An account with this email address already exists.' shown. | Medium |
| TC-AUTH-07 | User logout | 1. Log in.<br>2. Click 'Logout' in navbar. | Session cleared from LocalStorage, redirected to Login page. | High |

---

### 3.2 Product Catalog, Search & Filtering (CAT)
| Test ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-CAT-01 | Product Catalog Display | 1. Navigate to Products page. | All 20 products displayed with image, title, category, price, discount, and stock status. | High |
| TC-CAT-02 | Case-Insensitive Search | 1. Enter lowercase keyword (e.g. 'headphones'). | Matching products containing 'headphones' in title or description returned. | High |
| TC-CAT-03 | Category Filtering | 1. Select 'Electronics' from Category dropdown. | Only products in Electronics category displayed. | High |
| TC-CAT-04 | Price Range Filtering | 1. Select 'Under Rs. 2,000' or other range. | Displayed products match the selected price bracket accurately. | Medium |
| TC-CAT-05 | Product Sorting | 1. Select 'Price: Low to High', 'Rating: High to Low', etc. | Products sorted correctly by final price / rating. | Medium |
| TC-CAT-06 | Product Details Page | 1. Click 'View Details' on any product. | Product details page renders full description, price, stock status, and quantity selector. | High |
| TC-CAT-07 | Out of Stock product | 1. Open an out-of-stock product (e.g. Leather Sandals). | 'Out of Stock' badge shown; 'Add to Cart' button is disabled. | High |

---

### 3.3 Shopping Cart & State Persistence (CART)
| Test ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-CART-01 | Add product to cart | 1. Click 'Add to Cart' from card or details page. | Cart badge counter increments; toast feedback displayed. | High |
| TC-CART-02 | Modify cart item quantity | 1. Go to Cart page.<br>2. Click '+' or '-' buttons. | Quantity updates; line item subtotal and order summary recalculate immediately. | High |
| TC-CART-03 | Stock limit ceiling in cart | 1. Increase quantity up to available stock. | '+' button disables when quantity reaches max stock available. | High |
| TC-CART-04 | Remove item from cart | 1. Click 'Remove' on cart item. | Item removed from cart list and LocalStorage; totals update. | High |
| TC-CART-05 | Free delivery threshold | 1. Add items totaling >= Rs. 15,000. | Delivery fee changes to 'Free' (Rs. 0.00). | Medium |

---

### 3.4 Checkout & Order Processing (CHK)
| Test ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-CHK-01 | Logged-in user pre-fill | 1. Log in and navigate to Checkout. | Name, email, and phone pre-filled in customer fields. | Medium |
| TC-CHK-02 | Cash on Delivery order | 1. Fill shipping address.<br>2. Select 'Cash on Delivery'.<br>3. Submit. | Order placed successfully; redirected to Order Confirmation page. | High |
| TC-CHK-03 | Card payment validation | 1. Select 'Credit/Debit Card'.<br>2. Enter valid 16-digit card, valid future MM/YY expiry, 3-4 digit CVV. | Form validates and processes order. | High |
| TC-CHK-04 | Card validation negative test | 1. Enter expired date or invalid CVV/Card length. | Clear inline error messages displayed; submission prevented. | High |
| TC-CHK-05 | Order confirmation verification | 1. Check Order Confirmation screen. | Unique Order ID, customer details, itemized list, and total amount shown. | High |

---

### 3.5 User Profile Management (PROF)
| Test ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-PROF-01 | Profile view | 1. Log in and open Profile page. | Current user information displayed accurately. | Medium |
| TC-PROF-02 | Edit profile | 1. Click 'Edit Profile'.<br>2. Change Name, Phone, or Address.<br>3. Save Changes. | Profile updated in view and LocalStorage; success alert shown. | Medium |
| TC-PROF-03 | Profile validation | 1. Enter invalid phone (<10 digits) or empty name. | Inline field errors displayed; save blocked. | Medium |

---

## 4. Defect Log & Resolution Summary

| Defect ID | Severity | Description | Status |
|---|---|---|---|
| DEF-001 | Critical | Script filenames `data/product.js` and `js/product.js` caused 404 errors across all HTML pages referencing plural names. | **Fixed** (files synced and path resolution added) |
| DEF-002 | Critical | Product links and image paths from `index.html` were broken due to hardcoded relative paths. | **Fixed** (added dynamic `resolveAssetPath` and `resolvePageLink`) |
| DEF-003 | High | Product ID 3 was exempted from cart stock limits in `js/cart.js`. | **Fixed** (stock ceiling enforced for all products) |
| DEF-004 | High | Registration did not store passwords or integrate with login, preventing newly registered users from logging in. | **Fixed** (integrated `registered_users` storage and multi-user authentication) |
| DEF-005 | Medium | Product search was case-sensitive and failed for lowercase queries. | **Fixed** (case-insensitive search across name, description, category) |
| DEF-006 | Medium | CVV validator and error messages were inconsistent (3 digits vs 'must contain 4 digits'). | **Fixed** (supports 3 or 4 digits with matching validation) |
| DEF-007 | Medium | Card expiry validation did not check for expired dates. | **Fixed** (validates future MM/YY format) |
