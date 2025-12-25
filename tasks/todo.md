# Event Ticketing Frontend - Implementation Plan

## Status: COMPLETED

**Tech Stack**: Nuxt 4 + Vue 3 + Tailwind CSS
**API Base**: `http://localhost:8001`
**Completed**: December 24, 2024

---

## Overview

This plan covers the implementation of the new ticketing system features:
- **General Admission Events**: Ticket tiers with early bird pricing
- **Seated Events**: Tables and individual seat selection
- **Reservation System**: Temporary holds during checkout
- **Enhanced Checkout Flows**: Different flows per event type

---

## Phase 1: API Composables & Data Layer - COMPLETED

### 1.1 Ticket Tiers Composable
- [x] Create `composables/useTicketTiers.js`
  - `getTicketTiers(eventSlug)` - List tiers for event
  - `getPublicTicketTiers(eventSlug)` - Public available tiers
  - `createTicketTier(eventSlug, data)` - Create tier
  - `updateTicketTier(eventSlug, tierId, data)` - Update tier
  - `deleteTicketTier(eventSlug, tierId)` - Delete tier

### 1.2 Tables Composable
- [x] Create `composables/useTables.js`
  - `getTables(eventSlug)` - List tables for event (admin)
  - `getPublicTables(eventSlug)` - Public available tables with seats
  - `createTable(eventSlug, data)` - Create table
  - `createTablesBulk(eventSlug, tables[])` - Bulk create tables
  - `updateTable(eventSlug, tableId, data)` - Update table
  - `deleteTable(eventSlug, tableId)` - Delete table

### 1.3 Seats Composable
- [x] Create `composables/useSeats.js`
  - `getSeats(eventSlug, tableId)` - List seats for table
  - `getPublicSeats(eventSlug, tableId)` - Public available seats
  - `createSeat(eventSlug, tableId, data)` - Create seat
  - `createSeatsBulk(eventSlug, tableId, seats[])` - Bulk create seats
  - `updateSeat(eventSlug, seatId, data)` - Update seat
  - `deleteSeat(eventSlug, seatId)` - Delete seat

### 1.4 Reservations Composable
- [x] Create `composables/useReservations.js`
  - `createReservation(eventSlug, { tables[], seats[] })` - Reserve tables/seats
  - `releaseReservation(eventSlug, token)` - Release reservation
  - Reservation timer state management
  - Auto-release on timeout

### 1.5 Update Checkout Composable
- [x] Update `composables/useCheckout.js`
  - Support tier-based checkout: `{ tiers: [{ tier_id, quantity }], extra_items }`
  - Support seated checkout: `{ tables[], seats[], reservation_token, extra_items }`
  - Backward compatibility with legacy `tickets` field

### 1.6 Update Events Composable
- [x] Update `composables/useEvents.js`
  - Add `seating_type` to event create/update
  - Add `reservation_minutes` to event create/update
  - Update availability response handling for both event types

---

## Phase 2: UI Components - COMPLETED

### 2.1 Ticket Tier Components
- [x] Create `components/public/TicketTierCard.vue`
  - Display tier name, description, price
  - Early bird badge and countdown
  - Quantity selector (+/- buttons, max available)
  - Sold out state
  - Props: `tier`, `quantity`, `@update:quantity`

- [x] Create `components/public/TicketTierSelector.vue`
  - List of TicketTierCard components
  - Computed total based on selections
  - Props: `tiers`, `selections`, `@update:selections`

### 2.2 Seating Components
- [x] Create `components/public/SeatingMap.vue`
  - Visual table/seat layout display
  - Table click to select (for sell_as_whole)
  - Seat click to select (for individual seats)
  - Status colors: available (green), reserved (yellow), sold (gray), selected (blue)
  - Legend component
  - Props: `tables`, `selectedTables`, `selectedSeats`, `@select-table`, `@select-seat`

- [x] Create `components/public/TableCard.vue`
  - Table display with capacity info
  - Price display
  - Availability status
  - Selection state
  - Props: `table`, `selected`, `@select`

- [x] Create `components/public/SeatGrid.vue`
  - Grid of seats for a table (when sell_as_whole=false)
  - Seat status visualization
  - Multi-select support
  - Props: `table`, `seats`, `selectedSeats`, `@select-seat`

- [x] Create `components/public/ReservationTimer.vue`
  - Countdown timer display
  - Warning state when < 2 minutes
  - Expired state handling
  - Props: `expiresAt`, `@expired`

### 2.3 Admin Ticket Tier Components
- [x] Create `components/admin/TicketTierForm.vue`
  - Form for creating/editing tiers
  - Fields: name, description, price, early_bird_price, early_bird_deadline, max_quantity, sort_order, is_active
  - Props: `tier` (optional for edit), `@submit`, `@cancel`

- [x] Create `components/admin/TicketTierList.vue`
  - Sortable list of tiers
  - Inline actions: edit, delete, toggle active
  - Drag to reorder (optional enhancement)
  - Props: `tiers`, `@edit`, `@delete`, `@reorder`

### 2.4 Admin Table/Seat Components
- [x] Create `components/admin/TableForm.vue`
  - Form for creating/editing tables
  - Fields: name, capacity, price, sell_as_whole, position_x, position_y, is_active
  - Props: `table` (optional for edit), `@submit`, `@cancel`

- [x] Create `components/admin/TableList.vue`
  - Grid/list of tables
  - Status badges (available/reserved/sold)
  - Actions: edit, delete, manage seats
  - Props: `tables`, `@edit`, `@delete`, `@manage-seats`

- [x] Create `components/admin/SeatForm.vue`
  - Form for creating/editing seats
  - Fields: label, price, position_x, position_y, is_active
  - Props: `seat` (optional for edit), `@submit`, `@cancel`

- [x] Create `components/admin/SeatList.vue`
  - Grid of seats for a table
  - Status indicators
  - Bulk create option
  - Props: `seats`, `tableId`, `@edit`, `@delete`

- [x] Create `components/admin/BulkTableForm.vue`
  - Quick create multiple tables
  - Pattern: name prefix, count, capacity, price per table
  - Generate seats option

- [x] Create `components/admin/SeatingLayoutEditor.vue` (Optional - Phase 3)
  - Drag-and-drop table positioning
  - Visual layout builder
  - Export/import layout

---

## Phase 3: Admin Pages - COMPLETED

### 3.1 Event Form Updates
- [x] Update `components/admin/EventForm.vue`
  - Add seating_type selector (general_admission / seated)
  - Add reservation_minutes field (for seated events)
  - Conditional display based on seating type
  - Step indicator update for new sections

### 3.2 Ticket Tiers Management Page
- [x] Create `pages/app/admin/events/[slug]/tiers.vue`
  - List all tiers for the event
  - Create/edit tier modal
  - Delete tier confirmation
  - Reorder tiers
  - Show sold/available counts per tier
  - Only accessible for general_admission events

### 3.3 Tables Management Page
- [x] Create `pages/app/admin/events/[slug]/tables.vue`
  - List all tables for the event
  - Create/edit table modal or inline
  - Bulk create tables
  - Delete table (with sold validation)
  - Status overview
  - Only accessible for seated events

### 3.4 Seats Management Page
- [x] Create `pages/app/admin/events/[slug]/tables/[tableId]/seats.vue`
  - List all seats for the table
  - Create/edit seat modal or inline
  - Bulk create seats
  - Delete seat (with sold validation)
  - Visual seat layout

### 3.5 Event Detail Page Updates
- [x] Update `pages/app/admin/events/[slug]/index.vue`
  - Show seating type badge
  - Show ticket tiers summary (for general_admission)
  - Show tables/seats summary (for seated)
  - Links to manage tiers/tables/seats
  - Enhanced stats per tier or table

### 3.6 Admin Navigation Updates
- [x] Update event detail navigation
  - Add "Ticket Tiers" link (general_admission)
  - Add "Tables & Seats" link (seated)
  - Conditional based on seating_type

---

## Phase 4: Public Pages - COMPLETED

### 4.1 Event Detail Page Updates
- [x] Update `pages/app/events/[slug]/index.vue`
  - Display seating type
  - For general_admission: Show tier options with prices
  - For seated: Show "Select Seats" CTA
  - Updated availability display

### 4.2 General Admission Checkout
- [x] Update `pages/app/events/[slug]/checkout.vue`
  - Replace quantity selector with TicketTierSelector
  - Each tier has its own quantity selector
  - Calculate totals based on tier selections
  - Support extra items as before
  - Update Stripe session creation payload

### 4.3 Seated Event Checkout Flow
- [x] Create `pages/app/events/[slug]/select-seats.vue`
  - Step 1: Seat/table selection
  - SeatingMap component
  - Selection summary sidebar
  - "Continue" button to reserve and proceed

- [x] Update checkout.vue for seated events
  - Detect seated event type
  - Show reservation timer
  - Display selected tables/seats
  - Lock selection during checkout
  - Handle reservation expiration

### 4.4 Checkout Flow Router Guard
- [x] Add route guard for seated checkout
  - Require valid reservation token
  - Redirect to select-seats if no reservation
  - Handle expired reservations

---

## Phase 5: Checkout Session Updates - COMPLETED

### 5.1 General Admission Session
- [x] Update checkout session creation
  - Send `tiers: [{ tier_id, quantity }]` instead of `tickets`
  - Include `extra_items` as before
  - Handle early bird pricing (API calculates)

### 5.2 Seated Event Session
- [x] Update checkout session creation
  - Send `tables: [tableId, ...]`
  - Send `seats: [seatId, ...]`
  - Send `reservation_token`
  - Include `extra_items`
  - Handle reservation validation errors

### 5.3 Checkout Success Page Updates
- [x] Update `pages/app/events/[slug]/checkout-success.vue`
  - Display tier breakdown (for general_admission)
  - Display table/seat info (for seated)
  - Show seat labels and table names

---

## Phase 6: Reports & Admin Enhancements - COMPLETED

### 6.1 Sales Report Updates
- [x] Update `pages/app/admin/reports/sales.vue`
  - Add tier breakdown column
  - Add table/seat info for seated events
  - Filter by tier
  - Tier-level revenue summary

### 6.2 Orders Report Updates
- [x] Update `pages/app/admin/reports/orders.vue`
  - Show tier names in order items
  - Show table/seat labels
  - Filter by tier

### 6.3 Event Stats Updates
- [x] Update dashboard stats
  - Per-tier sales breakdown
  - Per-table occupancy (seated)
  - Early bird vs regular sales comparison

---

## Phase 7: Polish & UX - COMPLETED

### 7.1 Loading States
- [x] Add loading states for:
  - Tier fetching
  - Table/seat fetching
  - Reservation creation
  - Checkout session creation

### 7.2 Error Handling
- [x] Handle specific errors:
  - Tier sold out during checkout
  - Seat already reserved
  - Reservation expired
  - Invalid reservation token

### 7.3 Responsive Design
- [x] Ensure all new components are mobile-friendly:
  - TicketTierSelector responsive layout
  - SeatingMap mobile view (scrollable, zoomable)
  - Admin tables/seats management on mobile

### 7.4 Accessibility
- [x] Keyboard navigation for seat selection
- [x] ARIA labels for status indicators
- [x] Screen reader support for tier info

---

## File Structure (New Files)

```
composables/
  useTicketTiers.js          # NEW - Ticket tiers API
  useTables.js               # NEW - Tables API
  useSeats.js                # NEW - Seats API
  useReservations.js         # NEW - Reservations API
  useCheckout.js             # UPDATE - Multi-flow support

components/
  public/
    TicketTierCard.vue       # NEW - Single tier display
    TicketTierSelector.vue   # NEW - Tier selection list
    SeatingMap.vue           # NEW - Visual table/seat layout
    TableCard.vue            # NEW - Table display card
    SeatGrid.vue             # NEW - Seats grid for table
    ReservationTimer.vue     # NEW - Countdown timer
  admin/
    TicketTierForm.vue       # NEW - Tier create/edit form
    TicketTierList.vue       # NEW - Tiers list with actions
    TableForm.vue            # NEW - Table create/edit form
    TableList.vue            # NEW - Tables grid/list
    SeatForm.vue             # NEW - Seat create/edit form
    SeatList.vue             # NEW - Seats grid for table
    BulkTableForm.vue        # NEW - Quick multi-table create
    EventForm.vue            # UPDATE - Add seating type

pages/
  app/
    admin/
      events/
        [slug]/
          tiers.vue          # NEW - Manage ticket tiers
          tables.vue         # NEW - Manage tables
          tables/
            [tableId]/
              seats.vue      # NEW - Manage seats for table
          index.vue          # UPDATE - Show tier/table summary
    events/
      [slug]/
        select-seats.vue     # NEW - Seat selection page
        checkout.vue         # UPDATE - Multi-flow checkout
        checkout-success.vue # UPDATE - Show tier/seat details
```

---

## Implementation Priority

### High Priority (Core Functionality)
1. Phase 1: API Composables (all)
2. Phase 2.1: Ticket Tier Components
3. Phase 4.2: General Admission Checkout
4. Phase 3.2: Ticket Tiers Management Page
5. Phase 3.1: Event Form Updates

### Medium Priority (Seated Events)
6. Phase 2.2: Seating Components
7. Phase 4.3: Seated Event Checkout Flow
8. Phase 3.3: Tables Management Page
9. Phase 3.4: Seats Management Page
10. Phase 5: Checkout Session Updates

### Lower Priority (Enhancements)
11. Phase 6: Reports Updates
12. Phase 7: Polish & UX
13. Phase 2.4 BulkTableForm, SeatingLayoutEditor

---

## Notes

- The API already supports all features - this is purely frontend work
- General admission with tiers is higher priority than seated events
- Backward compatibility: legacy `tickets` field still works for simple events
- Early bird pricing is calculated server-side based on tier settings
- Reservations expire after `reservation_minutes` (default 15)
- Use `can_purchase` and `blocked_reason` from availability endpoint

---

## Completed (Previous MVP)

See git history for the completed MVP implementation which included:
- Authentication system (email, OAuth, password reset)
- Basic event management (CRUD, publish/close)
- Simple checkout (quantity-based tickets + add-ons)
- Admin dashboard (events, users, categories, orders, reports)
- Role-based access control
- Excel export functionality
