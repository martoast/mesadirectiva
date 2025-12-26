# Frontend Update: Simplified Event System

This document outlines the implementation plan for updating the frontend to match the new simplified event API.

---

## Phase 1: Composables & API Layer

### 1.1 Update `composables/useEvents.js`
- [ ] Remove `toggleRegistration` method (endpoint removed)
- [ ] Rename `uploadHeroImage` to `uploadEventImage` (endpoint changed from `/hero-image` to `/image`)
- [ ] Add `addMedia(slug, data)` method for `POST /events/{slug}/media`
- [ ] Add `removeMedia(slug, data)` method for `DELETE /events/{slug}/media`
- [ ] Update JSDoc comments to reflect new field names

### 1.2 Update `composables/useTicketTiers.js`
- [ ] Update `createTicketTier` JSDoc with new fields:
  - `quantity` (renamed from `max_quantity`)
  - `sales_start`, `sales_end`
  - `min_per_order`, `max_per_order`
  - `show_description`, `is_hidden`
- [ ] Remove references to `early_bird_price`, `early_bird_deadline`

---

## Phase 2: Event Creation Form (Complete Rewrite)

### 2.1 Rewrite `components/admin/EventForm.vue`

**New 5-step wizard:**

#### Step 1: Basic Info
- [ ] Event name (required)
- [ ] Description (rich text editor or textarea)
- [ ] Main image upload/URL input
- [ ] Group selection (keep existing)

#### Step 2: Date & Time
- [ ] Start datetime picker (`starts_at`)
- [ ] End datetime picker (`ends_at`)
- [ ] Timezone dropdown (default: `America/Los_Angeles`)
- [ ] Common timezone presets for Mexico

#### Step 3: Location
- [ ] Location type toggle: `venue` | `online`
- [ ] **Venue fields:**
  - Name
  - Address
  - City
  - State
  - Country (default: Mexico)
  - Postal code
  - Map URL (optional)
- [ ] **Online fields:**
  - Platform (Zoom, Google Meet, Teams, Other)
  - URL
  - Instructions

#### Step 4: Tickets (Initial Setup)
- [ ] Seating type selection (keep: `general_admission` | `seated`)
- [ ] For general admission: Option to create first tier inline
- [ ] For seated: Reservation minutes setting

#### Step 5: Additional Details (Optional)
- [ ] Organizer name
- [ ] Organizer description
- [ ] Privacy toggle (`is_private`)
- [ ] Show remaining toggle (`show_remaining`)
- [ ] FAQ items (add/remove dynamically)

### 2.2 Create new helper components

- [ ] `components/admin/LocationForm.vue` - Reusable venue/online location form
- [ ] `components/admin/DateTimePicker.vue` - Combined date+time picker with timezone
- [ ] `components/admin/MediaGallery.vue` - Image upload + YouTube URL management
- [ ] `components/admin/FAQEditor.vue` - Dynamic FAQ items editor

---

## Phase 3: Ticket Tier Form Update

### 3.1 Update `components/admin/TicketTierForm.vue`
- [ ] Replace `early_bird_price` / `early_bird_deadline` with:
  - `sales_start` datetime picker
  - `sales_end` datetime picker
- [ ] Add `min_per_order` field (default: 1)
- [ ] Add `max_per_order` field (default: 10)
- [ ] Add `show_description` toggle
- [ ] Add `is_hidden` toggle
- [ ] Rename `max_quantity` to `quantity`
- [ ] Add sales status preview (calculated from dates)

### 3.2 Update `components/admin/TicketTierList.vue`
- [ ] Display `sales_status` badge (on_sale, scheduled, ended, sold_out)
- [ ] Show `sales_start` / `sales_end` dates
- [ ] Update sold/available display

### 3.3 Update `pages/app/admin/events/[slug]/tiers.vue`
- [ ] Handle new tier response fields
- [ ] Add filtering by sales status (optional)

---

## Phase 4: Event Detail/Edit Pages

### 4.1 Update `pages/app/admin/events/[slug]/index.vue`
- [ ] Display new date format (`starts_at`, `ends_at`, `timezone`)
- [ ] Display location based on `location_type`
- [ ] Show organizer info section
- [ ] Show media gallery
- [ ] Show FAQ section
- [ ] Update stats to use `total_tickets_sold`, `total_tickets_available`
- [ ] Remove references to old fields (`date`, `time`, `price`, etc.)

### 4.2 Update `pages/app/admin/events/[slug]/edit.vue`
- [ ] Use new EventForm with all fields pre-populated
- [ ] Handle image upload to new endpoint
- [ ] Handle media gallery management
- [ ] Handle FAQ editing

### 4.3 Update `pages/app/admin/events/create.vue`
- [ ] Use new EventForm component
- [ ] Handle initial image upload flow

---

## Phase 5: Event List & Cards

### 5.1 Update `components/admin/EventCard.vue`
- [ ] Display date using `starts_at` instead of `date`
- [ ] Format: Show both start and end times
- [ ] Handle venue vs online location display
- [ ] Update price display (may need to show tier range)

### 5.2 Update `components/admin/EventTable.vue`
- [ ] Same updates as EventCard
- [ ] Date column: format `starts_at`
- [ ] Location column: show venue name or "Online"

### 5.3 Update `pages/app/admin/events/index.vue`
- [ ] Ensure compatibility with new event response format

---

## Phase 6: Public Event Pages

### 6.1 Update `components/public/EventHero.vue`
- [ ] Use `starts_at` / `ends_at` instead of `date` / `time`
- [ ] Format datetime with timezone consideration
- [ ] Handle `image` field (renamed from `hero_image_url`)
- [ ] Display location based on `location_type`:
  - Venue: Show name + address
  - Online: Show "Online Event" badge
- [ ] Remove `hero_title`, `hero_subtitle` (use `name`, `description`)

### 6.2 Update `components/public/EventAbout.vue`
- [ ] Use `description` field (HTML content)
- [ ] Display organizer info (`organizer_name`, `organizer_description`)
- [ ] Display FAQ items
- [ ] Display media gallery (images + YouTube videos)

### 6.3 Update `components/public/TicketTierCard.vue`
- [ ] Handle new tier fields
- [ ] Show sales status (scheduled, on sale, ended)
- [ ] Respect `is_hidden` flag
- [ ] Display `min_per_order` / `max_per_order` constraints

### 6.4 Update `components/public/TicketTierSelector.vue`
- [ ] Filter by `is_on_sale` status
- [ ] Enforce `min_per_order` / `max_per_order` limits
- [ ] Show "Coming Soon" for scheduled tiers
- [ ] Show "Sales Ended" for past tiers

### 6.5 Update public event page
- [ ] Handle `available_ticket_tiers` for purchase flow
- [ ] Display venue map or online event instructions
- [ ] Show `show_remaining` conditional display

---

## Phase 7: Utility Functions

### 7.1 Create `utils/dateTime.js`
- [ ] `formatEventDateTime(startsAt, endsAt, timezone)` - Format date range
- [ ] `formatTimeRange(startsAt, endsAt)` - Format time only
- [ ] `getTimezoneLabel(timezone)` - Human-readable timezone
- [ ] `isEventPast(endsAt)` - Check if event has ended
- [ ] `isEventLive(startsAt, endsAt)` - Check if event is happening now

### 7.2 Create `utils/location.js`
- [ ] `formatLocation(location, locationType)` - Format location for display
- [ ] `getLocationIcon(locationType)` - Return appropriate icon
- [ ] `buildMapUrl(location)` - Generate Google Maps URL if not provided

### 7.3 Create `utils/salesStatus.js`
- [ ] `getSalesStatusLabel(status)` - Human-readable status
- [ ] `getSalesStatusColor(status)` - Color for badges
- [ ] `isTierPurchasable(tier)` - Check if tier can be purchased

---

## Phase 8: Cleanup

### 8.1 Remove deprecated code
- [ ] Remove `toggleRegistration` usage from all pages
- [ ] Remove references to old fields in templates:
  - `date`, `time` → `starts_at`, `ends_at`
  - `price`, `max_tickets` → ticket tiers
  - `hero_title`, `hero_subtitle` → `name`, `description`
  - `hero_image_url` → `image`
  - `gallery_images` → `media.images`
  - `venue_*` → `location.*`
  - `contact_*` → removed
  - `about` → `description`
  - `highlights`, `schedule` → removed
- [ ] Remove `early_bird_price`, `early_bird_deadline` from tier forms

### 8.2 Type definitions (optional but recommended)
- [ ] Create `types/event.ts` with TypeScript interfaces
- [ ] Create `types/ticketTier.ts` with TypeScript interfaces
- [ ] Create `types/location.ts` with TypeScript interfaces

---

## Implementation Order (Recommended)

1. **Phase 1** - API layer first (low risk, foundation)
2. **Phase 7** - Utility functions (needed by other phases)
3. **Phase 2** - Event form rewrite (biggest change)
4. **Phase 3** - Ticket tier updates
5. **Phase 4** - Admin detail pages
6. **Phase 5** - List views
7. **Phase 6** - Public pages
8. **Phase 8** - Final cleanup

---

## Testing Checklist

- [ ] Create new event with venue location
- [ ] Create new event with online location
- [ ] Upload event image
- [ ] Add media gallery items (upload + URL + YouTube)
- [ ] Create ticket tiers with sales windows
- [ ] Verify early bird flow (create tier with future sales_start)
- [ ] Edit existing event
- [ ] Verify public event page displays correctly
- [ ] Verify ticket purchase respects tier constraints
- [ ] Verify timezone handling across components

---

## Notes

- Keep `seating_type` logic (general_admission vs seated) - this is still relevant
- The `reservation_minutes` field is still used for seated events
- Group permissions system remains unchanged
- Event status flow (draft → live → closed) remains unchanged
