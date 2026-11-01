# ShopEase – QA Testing Documentation

## 1. Overview

This folder contains the Software Quality Assurance (SQA) testing documents for the ShopEase e-commerce demo website.

The purpose of these documents is to plan, perform, record, and report manual testing activities. They are also used to identify software defects and verify whether the website functions according to the expected requirements.

## 2. Testing Documents

The following documents are included in this folder:

### 2.1 Test Plan
**File:** `test-plan.md`

Describes the testing objectives, scope, testing types, test environment, test deliverables, and activities planned for the ShopEase project.

### 2.2 Test Scenarios
**File:** `test-scenarios.md`

Contains high-level test scenarios covering the main functionalities of the website, including Login, Registration, Products, Shopping Cart, Checkout, Profile, and Logout.

### 2.3 Test Cases
**File:** `test-cases.xlsx`

Contains detailed test cases with:
- Test Case ID
- Test Scenario
- Test Case Description
- Preconditions
- Test Steps
- Test Data
- Expected Result
- Actual Result
- Status
- Bug ID

### 2.4 Test Execution
**File:** `test-execution.xlsx`

Records the results of executing test cases. It includes the execution date, tester name, test status (PASS, FAIL, or NOT RUN), actual results, and related bug IDs.

### 2.5 Bug Reports
**File:** `bug-reports.xlsx`

Documents defects identified during testing. Each bug report includes information such as Bug ID, Bug Title, Description, Steps to Reproduce, Expected Result, Actual Result, Severity, Priority, and Status.

### 2.6 Test Summary Report
**File:** `test-summary-report.md`

Provides an overall summary of testing activities, including the number of test cases executed, passed, failed, not run, defects identified, and the overall testing conclusion.

### 2.7 Screenshots
**Folder:** `screenshots`

Contains screenshots captured during test execution. These screenshots provide evidence of test results and identified defects.

## 3. Testing Scope

The following website functionalities are included in testing:

- Login
- User Registration
- Product Listing
- Product Search
- Product Filtering and Sorting
- Product Details
- Shopping Cart
- Checkout
- Order Confirmation
- User Profile
- Logout
- Access Control

## 4. Testing Approach

Manual testing is performed using Google Chrome.

The following testing techniques are used:

- Functional Testing
- Positive Testing
- Negative Testing
- Boundary Value Analysis
- Validation Testing
- UI Testing
- Smoke Testing
- Regression Testing
- Responsive Testing

## 5. Test Execution Status

Test cases are categorized using the following statuses:

- **PASS:** Actual result matches the expected result.
- **FAIL:** Actual result does not match the expected result.
- **NOT RUN:** Test case has not yet been executed.

Identified defects are recorded in the Bug Reports document and linked to the relevant test cases using Bug IDs.

## 6. Test Environment

- **Project Name:** ShopEase
- **Testing Type:** Manual Testing
- **Browser:** Google Chrome
- **Operating System:** Windows
- **Technologies:** HTML5, CSS3, Vanilla JavaScript
- **Data Storage:** Browser Local Storage

## 7. Conclusion

This folder provides the testing documentation and evidence for the ShopEase e-commerce demo project. It helps maintain organized test records, track identified defects, and evaluate the overall quality of the application.