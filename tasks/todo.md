# Roadmap (updated 2026-07-15)

Frontend side of the five workstreams. API counterpart plan: `mesadirectiva-api/tasks/todo.md` (read it first — schema/endpoints defined there).

---

## 1. Multi-Stripe: 3 accounts — DONE (2026-07-15)

- ~~EventFormSimple.vue "Cuenta de cobro" toggle (Eventos/Cafetería/Rifa, default eventos for new events, existing events keep cafeteria)~~
- ~~Admin event detail shows "Cuenta de cobro" row~~
- No checkout changes needed: the API routes the session to the right account from the event.

## 2. Parcialidades dependientes (tiers en orden) — DONE (2026-07-15)

Implemented: "Este pago depende de" select in TicketTierForm (cycle-safe, API-validated), dependency chip in TicketTierList, locked tier cards + clave verification box in checkout (verifies via eligibility endpoint, prefills the clave into that tier's attendee fields), `checkTierEligibility` in useTicketTiers. Original plan below.

- **TicketTierForm.vue** — "Este pago depende de" select (other tiers of the event, from a `availableTiers` prop). Send `depends_on_tier_id`.
- **TicketTierList.vue** — show dependency chip ("Requiere: Pago 1").
- **checkout.vue** — for a dependent tier:
  - render locked state ("Disponible al completar {tier}") until eligibility confirmed,
  - require clave del alumno, call `GET /public/events/{slug}/tiers/{id}/eligibility?student_key=...` (add to `useTicketTiers`),
  - unlock quantity selector on `eligible: true`, show the API's message otherwise.
- **Public event page tier list** — visually mark dependent tiers as sequential (Pago 1 → Pago 2 → Pago 3).

## 3. Checkout improvements — DONE (2026-07-15)

Implemented: student name/clave/nota section on GA checkout gated by `event.checkout_settings` (hidden entirely for external-buyer products), required marks + client validation when configured, clave sent per ticket, admin toggles in event form step 2 ("Datos del comprador"), clave shown+searchable on attendees page. Original plan below.

### Original plan

- **checkout.vue**:
  - New fields **"Nombre del alumno"** and **"Clave del alumno"**, rendered only when `event.checkout_settings.collect_student_fields` is true; required per settings — include in `isFormValid`.
  - Remove the "(opcional)" label from fields that are actually required (salón/generación/nota when the event requires them); required fields get `*` and validation.
  - Send `student_name`/`student_key` per ticket entry in the checkout payload.
- **Admin settings UI** — add the toggles to the event form (step 2) or a small card on the event detail page, saved via `updateEvent(slug, { checkout_settings })` (same pattern as email-settings).

## 4. Reportes con dos niveles de acceso — DONE (2026-07-15)

Implemented: viewers (coordinadoras) can now enter `/app/admin/reports/*` only (admin middleware carve-out; other admin URLs bounce them to reports), sidebar/mobile menu hides Events/Orders for viewers, login + OAuth callback redirect viewers to the sales report, both report pages render the API's summary columns/rows generically when `report_level === 'summary'`, export downloads the reduced Excel automatically. Original plan below.

- **Access**: `middleware/admin.js` currently kicks `viewer` out of ALL of `/app/admin`. Options: allow viewers into `/app/admin/reports/*` only (route check inside middleware), plus hide non-report sidebar items for viewers in `layouts/admin.vue`.
- **reports/sales.vue + reports/orders.vue** — column sets driven by role (`isViewer` from useAuth): viewers see the summary columns the API returns; admins see full (incl. hora, # orden, transacción, cuenta Stripe). Export button downloads whichever the API serves for the role.

## 5. Zona horaria fija (Tijuana) — DONE (2026-07-15)

Selector removed from EventFormSimple; new events always send America/Tijuana; existing events keep their timezone on edit.

### Original plan

- **EventFormSimple.vue** — remove the timezone `<select>`; always send `timezone: 'America/Tijuana'`; delete `detectTimezone()` usage.
- Sweep display helpers that pass timezone (dateTime utils already mostly ignore it).

---

## 6. UX pass (Chesky-style, guest journey) — DONE (2026-07-15)

- `/` and `/app` now land on the public events listing (SSR 302) — no more login wall / fake-stats page as the front door.
- Public layout fully bilingual with LanguageToggle in navbar + mobile menu; footer dead links removed, dynamic year.
- Confirmation page rewritten: Spanish-first, real order number (API now appends `?order=` to the Stripe success URL), "what happens next" steps, spam notice. Cancel page bilingual + reassuring.
- Checkout: `*` on required contact fields, total shows MXN, submit errors scroll into view.
- Free events show "Gratis" instead of "$0.00" (event page + TicketCTA).
- Admin fixes: QR-scan feedback no longer crashes (`t.value` bug), orders "Tipo" column derives type from order items instead of nonexistent fields.

---

# Previously Completed
- Email & Ticket CMS admin page (`[slug]/email-settings.vue`)
- QR scanner check-in on attendees page
- Tier drag-to-reorder, hide-availability toggle
- Translation system (useLanguage), attendees check-in
