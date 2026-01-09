# MesaDirectiva - Developer Summary

A Nuxt 4 event management platform for creating, managing, and selling tickets to events.

---

## Tech Stack

- **Framework:** Nuxt 4.2.1 / Vue 3.5
- **Styling:** Tailwind CSS
- **Payments:** Stripe
- **Auth:** Email/password + Google OAuth

---

## Project Structure

```
/app
├── pages/                 # File-based routing
│   ├── app/admin/         # Admin dashboard (protected)
│   └── app/events/        # Public event pages
├── components/
│   ├── admin/             # Admin components (EventForm, TicketTierForm, etc.)
│   ├── public/            # Public components (EventHero, TicketTierSelector, etc.)
│   └── ui/                # Base UI components
├── composables/           # API & business logic (auto-imported)
├── middleware/            # Route guards (auth, admin, superAdmin)
├── utils/                 # Helper functions (dateTime, location, salesStatus)
└── layouts/               # Page layouts (admin, public)
```

---

## Core Concepts

### Events
Events have two types:
- **General Admission** - Ticket tiers with different prices
- **Seated** - Tables with individual seats

Key fields: `name`, `description`, `starts_at`, `ends_at`, `timezone`, `location_type` (venue/online), `location`, `image_url`, `media`, `faq_items`

Status flow: `draft` → `live` → `closed`

### Ticket Tiers (General Admission)
Each tier has: `name`, `price`, `quantity`, `sales_start`, `sales_end`, `min_per_order`, `max_per_order`

Sales statuses: `on_sale`, `scheduled`, `ended`, `sold_out`, `inactive`, `hidden`

### Tables & Seats (Seated Events)
- Tables have capacity and can be sold as whole or individual seats
- Seats are reserved via time-limited tokens before checkout

### Groups (Multi-org)
Events belong to groups. Users have permissions per group: `view`, `edit`, `manage`

---

## Key Composables

| Composable | Purpose |
|-----------|---------|
| `useApi` | HTTP client with auth headers |
| `useAuth` | Login, logout, user state |
| `useEvents` | Event CRUD |
| `useTicketTiers` | Tier management |
| `useTables` / `useSeats` | Seated events |
| `useCheckout` | Stripe sessions |
| `useReservations` | Seat reservations |
| `useGroups` | Group management |

---

## API Patterns

**Base URL:** Configured in `nuxt.config.ts` → `runtimeConfig.public.apiUrl`

**Auth:** Bearer token stored in `localStorage.auth_token`, included automatically via `useApi`

**Public endpoints:** `/public/events/*` (no auth required)

**Admin endpoints:** `/events/*`, `/orders/*`, etc. (auth required)

---

## Authentication

1. Login via `/auth/login` or Google OAuth
2. Token stored in localStorage
3. `useAuth()` provides: `user`, `isAuthenticated`, `isAdmin`, `isSuperAdmin`
4. Middleware protects routes: `auth`, `admin`, `superAdmin`

---

## User Roles

| Role | Access |
|------|--------|
| `viewer` | Public pages only |
| `admin` | Events, orders, reports |
| `super_admin` | + Users, groups |

---

## Utility Functions

- **`utils/dateTime.js`** - Format dates, check event status
- **`utils/location.js`** - Format venue/online locations
- **`utils/salesStatus.js`** - Tier status labels/colors

---

## Key Flows

### Event Creation
1. Admin fills 6-step form (EventForm.vue)
2. Draft auto-saved after location step
3. Media uploaded to existing draft
4. Publish makes event live

### Ticket Purchase (General Admission)
1. User selects tiers on public event page
2. Enters contact info
3. Stripe checkout session created
4. Redirect to Stripe → success callback

### Seated Event Purchase
1. User selects seats → creates reservation (time-limited)
2. Proceeds to checkout with reservation token
3. Payment converts reservation to order

---

## Running Locally

```bash
yarn install
yarn dev
```

API URL defaults to `http://localhost:8001`. Override with `VITE_API_URL`.

---

## Notes

- Composables are auto-imported (no explicit imports needed)
- Check `import.meta.client` before accessing localStorage (SSR)
- All dates stored as ISO strings with timezone field
