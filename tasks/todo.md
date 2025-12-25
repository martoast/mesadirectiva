# Rename "Categories" to "Groups" - Frontend Migration Plan

## Overview
The API has been updated to rename "categories" to "groups". This plan covers all frontend files that need to be updated to match.

---

## 1. Composables (API Layer)

### 1.1 Rename composable file
- [ ] `composables/useCategories.js` → `composables/useGroups.js`
  - Rename function `useCategories` → `useGroups`
  - Update all API endpoints: `/categories` → `/groups`
  - Rename all functions: `getCategories` → `getGroups`, `getCategory` → `getGroup`, etc.

### 1.2 Update useUsers.js
- [ ] `composables/useUsers.js`
  - Line 50-55: Rename `assignCategories` → `assignGroups`
  - Update endpoint: `/users/${id}/categories` → `/users/${id}/groups`
  - Update param name: `categories` → `groups`

### 1.3 Update useAuth.js
- [ ] `composables/useAuth.js`
  - Line 56, 91, 95: Update comments from "categories" to "groups"
  - Line 169: Rename `userCategories` → `userGroups` and update `user.value?.categories` → `user.value?.groups`

### 1.4 Update useProfile.js
- [ ] `composables/useProfile.js`
  - Line 9: Update comment from "categories" to "groups"

### 1.5 Update useEvents.js
- [ ] `composables/useEvents.js`
  - Line 38: Update param comment `category_id` → `group_id`

### 1.6 Update useReports.js
- [ ] `composables/useReports.js`
  - Lines 10, 18, 27, 35: Update param comments `category_id` → `group_id`

---

## 2. Pages - Admin Section

### 2.1 Rename categories page directory
- [ ] `pages/app/admin/categories/` → `pages/app/admin/groups/`
  - Rename `index.vue` and update all internal references
  - Update page title, labels, error messages
  - Update CSS class names: `.categories-page` → `.groups-page`, `.categories-grid` → `.groups-grid`
  - Update `useCategories()` → `useGroups()`
  - Update response handling: `response.categories` → `response.groups`

### 2.2 Update admin layout
- [ ] `layouts/admin.vue`
  - Line 27: Update route `/app/admin/categories` → `/app/admin/groups`
  - Line 27: Update link text "Categories" → "Groups"
  - Line 114: Update mobile menu route and text

### 2.3 Update events pages
- [ ] `pages/app/admin/events/index.vue`
  - Line 114: Update loop variable and display
  - Line 284: Rename `categories` ref → `groups`
  - Line 338: Update `response.categories` → `response.groups`
  - Line 359: Update `category_id` param → `group_id`
  - Update `useCategories()` → `useGroups()`

- [ ] `pages/app/admin/events/create.vue`
  - Line 76-78: Update category dropdown to group
  - Line 589: Rename form field `category_id` → `group_id`
  - Line 751: Update form submission
  - Line 832: Update response handling
  - Update `useCategories()` → `useGroups()`

- [ ] `pages/app/admin/events/[slug]/edit.vue`
  - Line 60-64: Update dropdown
  - Line 533: Rename ref
  - Line 549: Update form field `category_id` → `group_id`
  - Line 626, 632: Update API calls and response
  - Line 639: Update form population
  - Update `useCategories()` → `useGroups()`

- [ ] `pages/app/admin/events/[slug]/index.vue`
  - Check for any category references and update

### 2.4 Update users pages
- [ ] `pages/app/admin/users/index.vue`
  - Line 82: Update column header "Categories" → "Groups"
  - Lines 110-124: Update `user.categories` → `user.groups`
  - Lines 210-223: Update mobile card category display
  - Line 836: Update CSS `.no-categories` → `.no-groups`
  - Line 1047: Update CSS `.col-categories` → `.col-groups`

- [ ] `pages/app/admin/users/[id].vue`
  - Lines 109-153: Update all category references to groups
  - Line 195: Rename `categories` ref → `groups`
  - Lines 222-243: Update API calls and response handling
  - Update `useCategories()` → `useGroups()`
  - Update `assignCategories()` → `assignGroups()`

- [ ] `pages/app/admin/users/create.vue`
  - Lines 76-77, 97-110: Update labels and help text
  - Line 181: Rename ref
  - Lines 206-208: Update response handling
  - Update composable imports

### 2.5 Update reports pages
- [ ] `pages/app/admin/reports/sales.vue`
  - Line 34: Update dropdown
  - Line 160: Rename ref
  - Line 177: Update param `category_id` → `group_id`
  - Lines 185-190: Update API calls
  - Update `useCategories()` → `useGroups()`

- [ ] `pages/app/admin/reports/orders.vue`
  - Line 34: Update dropdown
  - Line 164: Rename ref
  - Line 181: Update param `category_id` → `group_id`
  - Lines 190-195: Update API calls
  - Update `useCategories()` → `useGroups()`

### 2.6 Update account page
- [ ] `pages/app/admin/account/index.vue`
  - Line 85: Update text "categories" → "groups"
  - Lines 89-91: Update `profile.categories` → `profile.groups`

---

## 3. Pages - Public Section

### 3.1 Update public events pages
- [ ] `pages/app/events/index.vue`
  - Line 23: Update loop variable
  - Line 135: Rename ref
  - Line 150: Update response handling
  - Update `useCategories()` → `useGroups()`

- [ ] `pages/app/events/[slug]/index.vue`
  - Check for category references

### 3.2 Update app index
- [ ] `pages/app/index.vue`
  - Check for category references

---

## 4. Components

### 4.1 Update EventForm component
- [ ] `components/admin/EventForm.vue`
  - Line 23-28: Update form field and dropdown
  - Line 353: Rename ref
  - Line 359: Update form field `category_id` → `group_id`
  - Lines 383-385: Update response handling
  - Line 395: Update validation
  - Line 420: Update submission data
  - Update `useCategories()` → `useGroups()`

### 4.2 Update EventCard component
- [ ] `components/admin/EventCard.vue`
  - Lines 116, 122: Update `category_id` → `group_id`, `event.category` → `event.group`

### 4.3 Update EventTable component
- [ ] `components/admin/EventTable.vue`
  - Lines 114, 120: Update `category_id` → `group_id`, `event.category` → `event.group`

### 4.4 Update EventHero component
- [ ] `components/public/EventHero.vue`
  - Check for category display and update

---

## 5. Summary of Changes

| Type | Count | Files |
|------|-------|-------|
| Composables | 6 | useGroups.js (rename), useUsers.js, useAuth.js, useProfile.js, useEvents.js, useReports.js |
| Admin Pages | 11 | groups/index.vue (rename), events/*, users/*, reports/*, account/* |
| Public Pages | 3 | app/index.vue, events/index.vue, events/[slug]/index.vue |
| Components | 4 | EventForm, EventCard, EventTable, EventHero |
| Layouts | 1 | admin.vue |
| **Total** | **25** | |

---

## 6. Implementation Order

1. **Phase 1 - Composables** (Foundation)
   - Rename and update useCategories.js → useGroups.js
   - Update useUsers.js, useAuth.js, useProfile.js, useEvents.js, useReports.js

2. **Phase 2 - Components** (Shared UI)
   - Update EventForm, EventCard, EventTable, EventHero

3. **Phase 3 - Admin Pages**
   - Rename categories directory → groups
   - Update layouts/admin.vue navigation
   - Update all admin pages (events, users, reports, account)

4. **Phase 4 - Public Pages**
   - Update public event listing and detail pages

5. **Phase 5 - Testing**
   - Run build to verify no errors
   - Test all affected functionality

---

## 7. Key Renames

| Old | New |
|-----|-----|
| `useCategories` | `useGroups` |
| `getCategories` | `getGroups` |
| `createCategory` | `createGroup` |
| `updateCategory` | `updateGroup` |
| `deleteCategory` | `deleteGroup` |
| `assignCategories` | `assignGroups` |
| `userCategories` | `userGroups` |
| `category_id` | `group_id` |
| `categories` (ref) | `groups` (ref) |
| `/categories` (route) | `/groups` (route) |
| `response.categories` | `response.groups` |
| `event.category` | `event.group` |
| `user.categories` | `user.groups` |
| `profile.categories` | `profile.groups` |
