# Roadmap — Frontend (updated 2026-09-05)

API counterpart: `mesadirectiva-api/tasks/todo.md` (read it first — schema/endpoints live there).

The five 2026-07 workstreams (multi-Stripe UI, parcialidades, checkout student fields,
viewer reports, Tijuana timezone) all shipped and are live. See "Shipped" at the bottom.

---

## Open

### 1. Password-reset links 404
The API emails `{frontend_url}/password-reset/{token}?email=`, but our route is
`pages/reset-password.vue` → `/reset-password?token=&email=`. The fix belongs on the
API side (one line in `AppServiceProvider`); nothing to change here unless we decide
to also accept the `/password-reset/{token}` shape as an alias.

### 2. Hardcoded `fiesta-del-60-aniversario` special-casing
Slug-specific table messaging and tier renaming is hardcoded in the public event page,
checkout page, and `TicketCTA`. It's inert for every other event but should become an
event-level setting (or be deleted) once that event is over.

### 3. Dead code to delete
- `components/admin/EventForm.vue` (~1.9k lines) — superseded by `EventFormSimple.vue`, unused.
- `composables/useMockEvents.js` — unused.

### 4. `tasks/summary.md` is out of date
Says Nuxt 3.16; `package.json` is on `nuxt ^4.2.1`.

---

## Shipped

- **Checkout copy pass** (2026-09-05) — "Clave del alumno" placeholder is now
  `(Salón + Número de lista)`; the note field is labeled "Notas" with placeholder
  `(Número de Planilla)`. Seated-event note fields keep the old generic placeholder
  (`noteGenericPlaceholder`).
- **Multi-Stripe UI** (2026-07) — "Cuenta de cobro" toggle in `EventFormSimple`, Cuenta
  row on admin event detail, Cuenta column in reports and the orders list.
  Checkout needs no account awareness: the API routes the session from the event.
- **Parcialidades** (2026-07) — dependency select in `TicketTierForm`, dependency chip in
  `TicketTierList`, locked tier cards + clave verification box in checkout,
  `checkTierEligibility` in `useTicketTiers`.
- **Checkout student fields** (2026-07) — name/clave/nota section gated by
  `event.checkout_settings`, required marks + client validation, clave sent per ticket,
  admin toggles in event form step 2, clave shown and searchable on the attendees page.
- **Viewer (coordinadora) reports** (2026-07) — viewers reach `/app/admin/reports/*` only;
  sidebar and mobile menu hide Events/Orders for them; login and OAuth callback land them
  on the sales report; report pages render the API's summary columns generically.
- **Timezone selector removed** (2026-07) — new events always send `America/Tijuana`;
  existing events keep theirs on edit.
- **Guest-journey UX pass** (2026-07) — `/` and `/app` land on the public events listing,
  bilingual public layout with language toggle, rewritten confirmation page with real
  order number, "Gratis" instead of "$0.00", required-field marks on contact fields.
- Earlier: Email & Ticket CMS admin page, QR scanner check-in, tier drag-to-reorder,
  hide-availability toggle, translation system (`useLanguage`).
