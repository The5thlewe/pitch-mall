# Pitch Mall

A single-page goods & delivery storefront for **Pitch Mall**, built with React,
Vite and React Router — backed by the live
[api.oluwasetemi.dev](https://api.oluwasetemi.dev) Products API, with an
offline fallback, an in-app notification system, and an admin area for
managing the catalog from the UI.

Sign up is required before anything in the storefront is reachable — a
visitor with no session is redirected to `/signup` first.

## Stack

- React 18 + Vite
- React Router v6
- Plain CSS with design tokens (green / cream / white palette, dark mode)
- `fetch` against `https://api.oluwasetemi.dev/products` for the live catalog
- State in React Context, persisted to `localStorage` (customer session,
  basket, order history, admin session, notifications, theme)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (defaults to `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## What's new in this version

### 1. Live Products API integration

`src/context/ProductsContext.jsx` loads the catalog from
`GET https://api.oluwasetemi.dev/products` on startup and exposes
`createProduct`, `updateProduct`, `deleteProduct` that call the matching
`POST` / `PATCH` / `DELETE` endpoints.

**When the API is not available** (network error, timeout, service down):
the app falls back to a small bundled catalog (`src/data/goods.js`), sets
`offline: true`, shows a dismissible-by-retry banner on the storefront and
disables catalog editing in the admin area until the API is reachable again
(a "Retry" button re-checks). This is handled in `src/api/client.js`
(`NetworkError`) and `ProductsContext`'s `load()`.

**Per-product availability**: a product with `quantity <= 0` is shown as
"Not available" on its card and can't be added to the basket, independent of
whether the whole API is up.

### 2. Notification system

`src/context/NotificationContext.jsx` provides:
- **Toasts** — short-lived pop-ups (bottom-right) for immediate feedback
  (order placed, product saved, API errors, etc.), auto-dismissing after 6s.
- **Notification center** — a bell icon in the header with an unread badge;
  click it to see the full history, persisted in `localStorage`.

**"Ready for delivery" notifications**: `src/utils/orderStatus.js` derives
an order's status (`PLACED → PREPARING → READY_FOR_DELIVERY → DELIVERED`)
from elapsed time since it was placed (5s / 15s / 30s thresholds — tune these
for a demo or wire them to real courier events). `AppContext` polls every 2s
while an order is in flight and fires a notification exactly once when an
order crosses into "ready for delivery" (and again on "delivered"), tracked
in `localStorage` so a page refresh doesn't re-fire it. The order's live
status is also shown on the confirmation page and in the dashboard's order
history.

### 3. Admin product management UI

A separate `/admin` area (linked from the footer) lets you manage the
catalog without touching the API directly:

- `/admin/login` — register or sign in as an admin. This calls the real
  `/auth/register` and `/auth/login` endpoints on api.oluwasetemi.dev and is
  a **separate session** from the storefront's customer sign up.
- `/admin` — table of all products (including unpublished ones) with
  Edit / Delete actions (delete asks for confirmation inline).
- `/admin/products/new` and `/admin/products/:id/edit` — a form covering
  name, description, price, compare-at price, SKU, stock quantity, category,
  tags, an image URL, and Featured / Published toggles.

Mutations use the admin's access token; if a request comes back `401`
(expired token), the app calls `/auth/refresh` once and retries automatically
before falling back to signing the admin out.

## Project structure

```
pitch-mall/
├─ index.html
├─ public/favicon.svg
├─ src/
│  ├─ main.jsx / App.jsx            routes + provider tree + the sign-up gate
│  ├─ index.css                     design tokens + all styles
│  ├─ api/
│  │  ├─ client.js                  fetch wrapper: timeouts, ApiError/NetworkError
│  │  ├─ products.js                list/create/update/delete against /products
│  │  └─ auth.js                    admin register/login/refresh against /auth
│  ├─ context/
│  │  ├─ NotificationContext.jsx    toasts + persistent notification center
│  │  ├─ AdminAuthContext.jsx       real-API admin session (register/login/refresh)
│  │  ├─ ProductsContext.jsx        live catalog + offline fallback + CRUD
│  │  └─ AppContext.jsx             customer session, basket, orders, delivery status
│  ├─ components/
│  │  ├─ Header.jsx, Footer.jsx, Logo.jsx
│  │  ├─ GoodCard.jsx               product card incl. out-of-stock state
│  │  ├─ NotificationBell.jsx, ToastStack.jsx
│  │  └─ RequireAuth.jsx, RequireAdmin.jsx   route gates
│  ├─ pages/
│  │  ├─ SignUp.jsx, SignIn.jsx, Home.jsx, Dashboard.jsx, Checkout.jsx,
│  │  │  Confirm.jsx, NotFound.jsx
│  │  └─ admin/
│  │     ├─ AdminLogin.jsx
│  │     ├─ AdminDashboard.jsx      product table, edit/delete
│  │     └─ AdminProductForm.jsx    create/edit form
│  ├─ data/goods.js                 offline fallback catalog (Product-shaped)
│  └─ utils/
│     ├─ format.js, storage.js
│     ├─ categoryIcon.js            emoji fallback + image URL detection
│     └─ orderStatus.js             time-based order status derivation
```

## Customizing

- **Delivery status timings**: `PREPARING_AFTER_MS`, `READY_AFTER_MS`,
  `DELIVERED_AFTER_MS` in `src/utils/orderStatus.js`.
- **Delivery fee**: `AppContext.jsx` (`deliveryFee`).
- **Fallback catalog**: `src/data/goods.js`.
- **API base URL**: `API_BASE_URL` in `src/api/client.js`.
