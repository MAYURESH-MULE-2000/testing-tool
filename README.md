# SauceDemo Test Automation - Playwright + TypeScript

A self-initiated UI and API test automation project built to practise and demonstrate
automation skills. It automates the core end-to-end user journeys of the public demo
e-commerce site [SauceDemo](https://www.saucedemo.com) - login, product listing,
cart and checkout - using Playwright with TypeScript and the Page Object Model.
A small API test suite is included as well, run against the free public
[reqres.in](https://reqres.in) test API, since SauceDemo does not expose one.

---

## Tech stack

| Area | Tool |
| --- | --- |
| Language | TypeScript |
| Automation framework | Playwright |
| Test runner | Playwright Test (built in) |
| Design pattern | Page Object Model (POM) |
| Assertions | Playwright's built-in `expect` (web-first, auto-retrying) |
| Reporting | Playwright HTML reporter |
| API testing | Playwright's built-in `request` fixture |
| CI | GitHub Actions |

---

## Folder structure

```
saucedemo-playwright-automation/
├── pages/                    # Page Object classes - locators + page actions
│   ├── LoginPage.ts          # Login form, submit, error banner
│   ├── ProductsPage.ts       # Inventory list, sorting, add/remove, cart badge
│   ├── CartPage.ts           # Cart contents, remove item, proceed to checkout
│   └── CheckoutPage.ts       # Checkout info form, order summary, confirmation
│
├── tests/                    # Test specs, grouped by feature
│   ├── login.spec.ts         # Valid login, locked out user, wrong password, empty fields
│   ├── products.spec.ts      # Product listing and all four sort options
│   ├── cart.spec.ts          # Add single/multiple items, remove items, badge count
│   ├── checkout.spec.ts      # Full checkout flow + form validation
│   └── api/
│       └── users-api.spec.ts # GET/POST requests, status codes, response body checks
│
├── utils/                    # Shared test data and small helpers
│   ├── testData.ts           # Credentials, expected error text, checkout data
│   └── helpers.ts            # Price parsing, product-name to selector slug
│
├── .github/workflows/
│   └── playwright.yml        # CI: install, run tests, upload HTML report
│
├── playwright.config.ts      # Projects (ui / api), reporters, retries, artefacts
├── tsconfig.json
└── package.json
```

**Why this layout:** every selector lives in a Page Object, so a UI change is fixed in one
file instead of across many specs. Test data lives in `utils/testData.ts` so credentials and
expected messages are not duplicated. The spec files then read as plain user journeys.

---

## Setup

Requires Node.js 18 or newer.

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/saucedemo-playwright-automation.git
cd saucedemo-playwright-automation

# 2. Install project dependencies
npm install

# 3. Download the browsers Playwright drives
npx playwright install
```

---

## Running the tests

```bash
# Run everything (UI + API)
npx playwright test

# UI tests only
npm run test:ui

# API tests only
npm run test:api

# Watch the browser while the UI tests run
npm run test:headed

# Run a single spec file
npx playwright test tests/login.spec.ts

# Run tests whose title matches a keyword
npx playwright test -g "checkout"
```

### Two test projects

`playwright.config.ts` defines two projects so UI and API tests can live in one repo
without conflicting base URLs:

- **`ui`** - runs everything outside `tests/api` in Chromium against `https://www.saucedemo.com`
- **`api`** - runs only `tests/api` against `https://reqres.in`

The `api` project also sends the `x-api-key: reqres-free-v1` header, which reqres.in
requires on its free public endpoints.

---

## Viewing the HTML report

A report is generated into `playwright-report/` on every run. Open it with:

```bash
npx playwright show-report
```

That serves the report locally and opens it in the browser. It shows each test's status
and duration, and for failures it includes the error, a screenshot, and (on retry) a trace
that can be stepped through action by action.

---

## Test coverage

| Feature | Scenarios |
| --- | --- |
| Login | Valid `standard_user` login, `locked_out_user` error, wrong password error, empty credentials |
| Product listing | All 6 products load with name and price; sorting by price (low-high, high-low) and name (A-Z, Z-A) |
| Add to cart | Add one item, add multiple items, cart badge count verification |
| Remove from cart | Remove from cart page, remove from products page, badge disappears when cart is empty |
| Checkout | Fill customer info, verify order summary items and that total = subtotal + tax, complete order, verify confirmation message |
| API | `GET /api/users` list + response structure, `GET /api/users/2` single user, `GET /api/users/23` 404, `POST /api/users` 201, `POST /api/login` 400 validation error |

Total: 23 tests across 5 spec files.

---

## Continuous Integration

`.github/workflows/playwright.yml` runs the full suite on every push and pull request to
`main`. The HTML report is uploaded as a build artifact, so a failed run can be downloaded
and inspected from the GitHub Actions run summary.

---

## Screenshots

> Screenshots of the HTML report and a sample test run will be added here after running
> the suite locally.
>
> _Placeholder - add `docs/report.png` and reference it here._

---

## Notes

- The credentials used are the public demo accounts published on the SauceDemo login page; they are not secrets.
- Tests rely on SauceDemo's `data-test` attributes where available, since those are more stable than CSS classes.
- Assertions use Playwright's auto-retrying `expect`, so no manual waits or `sleep` calls are needed anywhere in the suite.
