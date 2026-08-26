# ShopEase - E-Commerce QA Demo

## Project Overview

This project is a demo e-commerce web application created for a Software
Quality Assurance internship project. It is **not** a production system —
there is no backend, no database, and no real payment processing. All data
is either static (product catalog) or stored locally in the browser via
`localStorage` (cart, user session, last order).

The goal of this application is to give a manual tester a realistic,
fully-clickable storefront where they can write test scenarios and test
cases, execute them, log defects, and perform regression testing.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

No frameworks, build tools, or backend services are used.

## Folder Structure

```
ecommerce-qa-demo/
├── index.html
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── products.html
│   ├── product-details.html
│   ├── cart.html
│   ├── checkout.html
│   ├── order-success.html
│   └── profile.html
├── css/
├── js/
├── data/
│   └── products.js
├── images/
├── tests/
│   └── README.md
└── README.md
```

## Features

- User Login (demo credentials)
- User Registration
- Product Listing
- Product Search
- Product Filtering (category, price)
- Product Sorting (price, rating, name)
- Product Details with quantity selector
- Shopping Cart (persisted in localStorage)
- Checkout (customer info, delivery address, payment method)
- Order Confirmation
- User Profile (view & edit)
- Responsive Design (desktop, tablet, mobile)

## Demo Login Credentials

```
Email:    demo@example.com
Password: Password123
```

## Testing Areas

- Functional Testing
- UI Testing
- Validation Testing
- Negative Testing
- Boundary Value Testing
- Compatibility Testing
- Regression Testing

See `tests/README.md` for suggested test case coverage and QA workflow.

## QA Tools

- Manual Testing
- Excel
- SQL

## Project Purpose

The application is designed to provide a realistic environment for creating
test scenarios, test cases, executing tests, identifying defects, and
performing regression testing as part of an SQA internship portfolio.

## Running the Project

No build step is required. Open `index.html` directly in a browser
(Chrome, Edge, or Firefox), or serve the folder with any static file
server.
