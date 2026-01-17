# MesaDirectiva Frontend - LLM Developer Guide

> **Quick Context**: Nuxt 3 event ticketing platform with admin dashboard and public event pages. Supports General Admission (ticket tiers) and Seated events (tables/seats). Bilingual (Spanish/English).

---

## Tech Stack

- **Framework**: Nuxt 3.16 / Vue 3.5 with Composition API (`<script setup>`)
- **Styling**: Tailwind CSS with Japanese minimalist design system
- **Payments**: Stripe Checkout
- **Auth**: Bearer token (Sanctum) + Google OAuth
- **i18n**: Custom composable (no library)
- **State**: Reactive composables (no Pinia/Vuex)

---

## Directory Structure

```
app/
├── pages/                    # File-based routing
│   ├── index.vue             # Landing page
│   ├── login.vue             # Auth (middleware: guest)
│   ├── app/
│   │   ├── events/           # Public event pages
│   │   │   ├── index.vue     # Event listing
│   │   │   └── [slug]/       # Event detail, checkout, seat selection
│   │   └── admin/            # Admin dashboard (middleware: auth, admin)
│   │       ├── events/       # Event management
│   │       │   └── [slug]/   # Event detail, edit, attendees, tiers, tables
│   │       ├── groups/       # Group management (superAdmin only)
│   │       ├── users/        # User management (superAdmin only)
│   │       ├── orders/       # Order management
│   │       └── reports/      # Sales & order reports
├── components/
│   ├── admin/                # Admin UI (EventForm, TicketTierForm, TableForm, etc.)
│   ├── public/               # Public UI (EventHero, TicketTierSelector, SeatingMap, etc.)
│   └── ui/                   # Base components (BaseButton, BaseInput, Toast, etc.)
├── composables/              # Business logic (auto-imported)
│   ├── useApi.js             # HTTP client with auth
│   ├── useAuth.js            # Auth state & methods
│   ├── useLanguage.ts        # i18n system
│   ├── useEvents.js          # Event CRUD
│   ├── useTicketTiers.js     # Tier management
│   ├── useTables.js          # Table management
│   ├── useSeats.js           # Seat management
│   ├── useReservations.js    # Seat reservation with timer
│   ├── useCheckout.js        # Stripe checkout
│   ├── useAttendees.js       # Check-in management
│   ├── useOrders.js          # Order queries
│   ├── useGroups.js          # Group CRUD
│   ├── useUsers.js           # User CRUD (superAdmin)
│   └── useToast.js           # Notifications
├── layouts/
│   ├── admin.vue             # Admin layout (dark sidebar)
│   ├── admin-fullscreen.vue  # Fullscreen tools (floor plan)
│   └── public.vue            # Public layout (light navbar)
├── middleware/
│   ├── auth.js               # Requires authentication
│   ├── admin.js              # Requires admin/super_admin role
│   ├── superAdmin.js         # Requires super_admin role
│   └── guest.js              # Requires unauthenticated
└── utils/
    ├── dateTime.js           # Date formatting
    ├── location.js           # Location formatting
    ├── salesStatus.js        # Tier status labels
    ├── errorTranslations.js  # API error translation
    └── html.js               # HTML sanitization
```

---

## Key Patterns

### 1. Composable Pattern
All business logic lives in composables. They use global refs for shared state:

```javascript
// composables/useAuth.js
const user = ref(null)           // Global state
const token = ref(null)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!token.value)
  const login = async (email, password) => { /* ... */ }
  return { user, token, isAuthenticated, login, logout }
}
```

### 2. API Pattern
All API calls go through `useApi()`:

```javascript
const { get, post, put, del, upload } = useApi()

// GET with params
const response = await get('/events', { status: 'live' })

// POST with body
await post('/events', eventData)

// File upload
await upload(`/events/${slug}/image`, formData)
```

### 3. Translation Pattern
Each component defines its own translations:

```javascript
const { t: createT } = useLanguage()

const translations = {
  title: { es: 'Eventos', en: 'Events' },
  save: { es: 'Guardar', en: 'Save' }
}
const t = createT(translations)

// In template: {{ t.title }}
```

### 4. Page Meta Pattern
```javascript
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})
```

### 5. Form Pattern
```vue
<script setup>
const form = ref({ name: '', email: '' })
const errors = ref({})
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}
  try {
    await post('/endpoint', form.value)
    toast.success('Saved!')
  } catch (e) {
    errors.value = e.errors || {}
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" />
    <span v-if="errors.name" class="error">{{ errors.name[0] }}</span>
    <button :disabled="loading">{{ loading ? 'Saving...' : 'Save' }}</button>
  </form>
</template>
```

---

## Styling System

### Design Tokens (tailwind.config.js)
```javascript
colors: {
  paper: '#FAF8F5',      // Background
  ink: '#1C1917',        // Text
  washi: { /* gray scale */ },
  indigo: '#4338CA',     // Primary accent
  sage: '#6B9080',       // Success
  coral: '#DC6B6B',      // Danger
  gold: '#B08968'        // Warning
}
```

### Component Scoped CSS
Components use scoped CSS with custom properties:
```vue
<style scoped>
.card {
  --color-paper: #faf9f7;
  --color-ink: #1a1a1a;
  background: var(--color-paper);
  color: var(--color-ink);
}
</style>
```

---

## Authentication Flow

1. User logs in via `/login` or Google OAuth
2. Token stored in `localStorage.auth_token`
3. `useApi()` auto-attaches Bearer token
4. `useAuth()` provides reactive state:
   - `user`, `token`, `isAuthenticated`
   - `isAdmin`, `isSuperAdmin`, `isViewer`
   - `hasPermission(groupId, 'edit')`

### Role Hierarchy
| Role | Access |
|------|--------|
| `viewer` | Read-only on assigned groups |
| `admin` | Edit events in assigned groups |
| `super_admin` | Full access + users/groups |

---

## Event Types

### General Admission
- Uses **Ticket Tiers** with prices, quantities, sales windows
- Tiers have: `name`, `price`, `quantity`, `sales_start`, `sales_end`
- Sales status: `on_sale`, `scheduled`, `ended`, `sold_out`

### Seated Events
- Uses **Tables** and **Seats**
- Tables can be `sell_as_whole: true` (whole table) or `false` (individual seats)
- Reservations are time-limited (default 15 min)
- `useReservations()` handles countdown timer

---

## Key Flows

### Create Event (Admin)
1. Navigate to `/app/admin/events/create`
2. 6-step wizard (`EventForm.vue`):
   - Basic info → Date/time → Location → Tickets/Seating → Media → Review
3. Draft auto-saved after location step
4. Publish to make live

### Purchase Tickets (Public)
1. Browse events at `/app/events`
2. Select event → `/app/events/[slug]`
3. Choose tiers or seats
4. For seated: creates temporary reservation
5. Checkout via Stripe → redirect to success page

### Check-in Attendees (Admin)
1. Navigate to event → Attendees
2. Search by name/email/order number
3. Click check-in button
4. Can undo check-in if needed

---

## Common Tasks

### Add a New Page
1. Create file in `pages/` (file-based routing)
2. Add `definePageMeta()` for layout/middleware
3. Create translations object with `useLanguage()`

### Add a New API Endpoint
1. Add method to relevant composable (or create new one)
2. Use `useApi()` for the HTTP call
3. Handle errors and loading state

### Add a New Component
1. Create in appropriate folder (`admin/`, `public/`, `ui/`)
2. Use `<script setup>` with Composition API
3. Add scoped styles following design system

### Add Translations
```javascript
const translations = {
  newKey: { es: 'Spanish text', en: 'English text' }
}
```

---

## Environment Variables

```bash
VITE_API_URL=http://localhost:8001    # Backend API
VITE_STRIPE_KEY=pk_test_...           # Stripe publishable key
VITE_SITE_URL=https://example.com     # For OG meta tags
```

---

## Running Locally

```bash
yarn install
yarn dev          # http://localhost:3000
```

API defaults to `http://localhost:8001`. Backend must be running.

---

## Important Files to Read First

| File | Purpose |
|------|---------|
| `composables/useAuth.js` | Understand auth state & permissions |
| `composables/useApi.js` | Understand API integration |
| `composables/useLanguage.ts` | Understand i18n approach |
| `layouts/admin.vue` | Understand admin UI structure |
| `pages/app/admin/events/[slug]/index.vue` | Reference admin page |
| `pages/app/events/[slug]/index.vue` | Reference public page |
| `tailwind.config.js` | Design tokens |

---

## Notes for LLMs

- **Composables are auto-imported** - no need for explicit imports
- **Check `import.meta.client`** before accessing `localStorage` (SSR)
- **All dates are ISO strings** with separate `timezone` field
- **Form validation errors** come as `{ field: ['message'] }` from API
- **Use existing patterns** - look at similar components before creating new ones
- **Spanish is primary language** - always add both ES and EN translations
