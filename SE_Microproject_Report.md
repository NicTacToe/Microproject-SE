# SE Microproject Report
## Custom Automated Testing Tool with Verdant Library Systems Web Application

**Branch:** Third Year - Artificial Intelligence & Data Science (TY AIDS)  
**Academic Year:** 2025-2026  
**Under the Guidance of:** Prof. Prerna Patil

## Team Members

| Roll No. | Name | Testing Tool / Responsibility |
|---|---|---|
| 03 | Shriya Sabnis | Selenium (UI Testing) |
| 05 | Sanika Deshmukh | Postman (API Testing) + COCOMO 2 Estimation |
| 08 | Rutav Mehta | Cypress (End-to-End Testing) |
| 10 | Shaurya Panhale | Vitest (Unit Testing) |

## Project Overview

**Project Name:** SE Microproject  
**Project Title:** Custom Automated Testing Tool with Verdant Library Systems Web Application

This microproject consists of two integrated components:
1. A full-stack **Library Management Web Application** (Verdant Library Systems).
2. A **multi-tool automated testing approach** designed to validate functionality across unit, API, UI, and end-to-end levels.

The system supports role-based workflows for Students and Admins, secure authentication, catalog operations, and rental lifecycle management.

## What We Built

### Verdant Library Systems Web Application

The application was developed using:
- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Authentication:** JWT + bcrypt

Implemented features:
- User signup and login with role support (Student/Admin)
- Secure authenticated routes using JWT
- Browse and search book catalog
- View detailed book information
- Admin-only catalog management (add, edit, delete books)
- Rent books for 7 days
- Return rented books
- One-time rental extension by 7 days
- Active rental tracking and overdue late-fee calculation

### REST API Coverage (Backend)

The backend exposes the following core endpoints:
- `POST /api/signup`
- `POST /api/login`
- `GET /api/books`
- `POST /api/books` (Admin only)
- `PUT /api/books/:id` (Admin only)
- `DELETE /api/books/:id` (Admin only)
- `GET /api/rentals`
- `POST /api/rentals`
- `POST /api/rentals/:id/return`
- `POST /api/rentals/:id/extend`

## Automated Testing Suite

A multi-layer testing strategy was planned using four tools:
- **Vitest** for unit testing
- **Cypress** for end-to-end scenarios
- **Selenium** for UI automation
- **Postman/Newman** for API validation

## Tools Used and Team Contributions

### Shaurya Panhale - Vitest (Unit Testing)
- Targeted component-level and utility-level test coverage for React modules.
- Focus areas: UI component behavior, validation logic, and helper method correctness.

### Rutav Mehta - Cypress (End-to-End Testing)
- Planned end-to-end scenarios for complete user workflows:
  - Login/signup
  - Book search and selection
  - Rent/return/extend flow
  - Admin catalog operations

### Shriya Sabnis - Selenium (UI Testing)
- Planned browser automation for UI-level validation:
  - Page rendering and navigation visibility
  - Form field and button interaction checks
  - Role-based UI access checks

### Sanika Deshmukh - Postman (API Testing) + COCOMO 2
- Planned API request collection for authentication, book management, and rental lifecycle endpoints.
- Newman-based automated assertion execution.
- COCOMO 2 post-architecture estimation applied to approximate effort/schedule for an academic part-time project.

## Test Results Summary

Note: The current repository snapshot does not contain committed test specs/reports for Vitest, Cypress, Selenium, or Postman/Newman runs. Use the table below to fill final execution outcomes from your team test runs.

| Tool | Tester | Tests Run | Tests Passed |
|---|---|---|---|
| Vitest | Shaurya Panhale | To be updated | To be updated |
| Selenium | Shriya Sabnis | To be updated | To be updated |
| Postman (Newman) | Sanika Deshmukh | To be updated | To be updated |
| Cypress | Rutav Mehta | To be updated | To be updated |

## Screenshots

Insert screenshots for:
- Login / Signup screen
- Dashboard view
- Catalog search page
- Book details modal
- My Rentals page
- Admin catalog management modal
- API testing (Postman/Newman run)
- UI/E2E/unit test execution evidence

---

Submitted in partial fulfilment of the Software Engineering Microproject  
Department of Artificial Intelligence & Data Science
