# Translation System Implementation

Add Spanish/English language support to all frontend pages.

---

## Phase 1: Core Translation Infrastructure

### 1.1 Create Translation Composable
- [ ] Create `composables/useLanguage.ts` with:
  - Global `currentLanguage` ref (default: 'es')
  - `language` computed ref
  - `switchLanguage(lang)` function (saves to localStorage)
  - `initializeLanguage()` function (loads from localStorage)
  - `t(translations)` helper function for reactive translations
  - `onLanguageChange(callback)` watcher

### 1.2 Create Nuxt Plugin
- [ ] Create `plugins/language.client.ts`
  - Hook into `app:mounted` to call `initializeLanguage()`
  - Load saved language preference from localStorage

### 1.3 Create Language Toggle Component
- [ ] Create `components/LanguageToggle.vue`
  - Show Mexico flag (ES) and USA flag (EN)
  - Click to switch language
  - If logged in, save preference to user profile via API

---

## Phase 2: Admin Pages Translation

### 2.1 Admin Layout
- [ ] `layouts/admin.vue` - Sidebar navigation, header

### 2.2 Event Management
- [ ] `pages/app/admin/events/index.vue` - Event list
- [ ] `pages/app/admin/events/create.vue` - Create event
- [ ] `pages/app/admin/events/[slug]/index.vue` - Event detail
- [ ] `pages/app/admin/events/[slug]/edit.vue` - Edit event
- [ ] `pages/app/admin/events/[slug]/tiers.vue` - Ticket tiers
- [ ] `pages/app/admin/events/[slug]/tables.vue` - Tables management
- [ ] `pages/app/admin/events/[slug]/floor-plan.vue` - Floor plan

### 2.3 Admin Components
- [ ] `components/admin/EventForm.vue` - 6-step form wizard
- [ ] `components/admin/EventCard.vue` - Event card
- [ ] `components/admin/EventTable.vue` - Events table
- [ ] `components/admin/TicketTierForm.vue` - Tier form
- [ ] `components/admin/TicketTierList.vue` - Tiers list
- [ ] `components/admin/TableForm.vue` - Table form
- [ ] `components/admin/TableList.vue` - Tables list
- [ ] `components/admin/SeatForm.vue` - Seat form
- [ ] `components/admin/SeatList.vue` - Seats list
- [ ] `components/admin/EventMediaStep.vue` - Media upload

### 2.4 Other Admin Pages
- [ ] `pages/app/admin/orders/index.vue` - Orders list
- [ ] `pages/app/admin/groups/index.vue` - Groups
- [ ] `pages/app/admin/users/index.vue` - Users
- [ ] `pages/app/admin/reports/sales.vue` - Sales report
- [ ] `pages/app/admin/reports/orders.vue` - Orders report
- [ ] `pages/app/admin/account/index.vue` - Account settings

---

## Phase 3: Public Pages Translation

### 3.1 Authentication
- [ ] `pages/login.vue`
- [ ] `pages/forgot-password.vue`
- [ ] `pages/reset-password.vue`

### 3.2 Public Event Pages
- [ ] `pages/app/index.vue` - Public home
- [ ] `pages/app/events/index.vue` - Event listing
- [ ] `pages/app/events/[slug]/index.vue` - Event detail
- [ ] `pages/app/events/[slug]/checkout.vue` - Checkout
- [ ] `pages/app/events/[slug]/checkout-success.vue` - Success
- [ ] `pages/app/events/[slug]/checkout-cancel.vue` - Cancel
- [ ] `pages/app/events/[slug]/select-seats.vue` - Seat selection

### 3.3 Public Components
- [ ] `components/public/EventHero.vue`
- [ ] `components/public/EventAbout.vue`
- [ ] `components/public/TicketTierCard.vue`
- [ ] `components/public/TicketTierSelector.vue`
- [ ] `components/public/TableCard.vue`
- [ ] `components/public/SeatGrid.vue`
- [ ] `components/public/SeatingMap.vue`
- [ ] `components/public/ReservationTimer.vue`

---

## Phase 4: Shared Components

### 4.1 UI Components
- [ ] `components/ui/BaseButton.vue`
- [ ] `components/ui/BaseInput.vue`
- [ ] `components/ui/BaseCard.vue`
- [ ] `components/ui/ConfirmModal.vue`
- [ ] `components/ui/StepIndicator.vue`

### 4.2 Utility Text
- [ ] `utils/salesStatus.js` - Status labels
- [ ] `utils/dateTime.js` - Date format labels (if any)
- [ ] `utils/location.js` - Platform labels

---

## Translation Pattern

```js
// In component script setup:
const { t: createTranslations, language } = useLanguage()

const translations = {
  title: { es: 'Eventos', en: 'Events' },
  createButton: { es: 'Crear Evento', en: 'Create Event' },
  noEvents: { es: 'No hay eventos', en: 'No events' }
}

const t = createTranslations(translations)

// In template:
<h1>{{ t.title }}</h1>
<button>{{ t.createButton }}</button>
```

---

## Notes

- Default language: Spanish (es)
- Language saved to `localStorage.preferredLanguage`
- For logged-in users, also sync to user profile
- LanguageToggle should appear in admin header and public pages
