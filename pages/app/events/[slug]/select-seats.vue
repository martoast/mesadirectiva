<template>
  <div class="seats-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
      </div>
      <p>Loading seating...</p>
    </div>

    <!-- Not a Seated Event -->
    <div v-else-if="!isSeatedEvent" class="message-state">
      <div class="message-card">
        <div class="message-icon info">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1>Not a Seated Event</h1>
        <p>This event uses general admission tickets.</p>
        <NuxtLink :to="`/app/events/${route.params.slug}/checkout`" class="btn-primary">
          Go to Checkout
        </NuxtLink>
      </div>
    </div>

    <!-- Cannot Purchase State -->
    <div v-else-if="!canPurchase" class="message-state">
      <div class="message-card">
        <div class="message-icon warning">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1>Cannot Select Seats</h1>
        <p>{{ blockedMessage }}</p>
        <NuxtLink :to="`/app/events/${route.params.slug}`" class="btn-primary">
          Back to Event
        </NuxtLink>
      </div>
    </div>

    <!-- Seat Selection -->
    <div v-else class="seats-content">
      <!-- Header -->
      <header class="seats-header">
        <NuxtLink :to="`/app/events/${route.params.slug}`" class="back-link">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Event
        </NuxtLink>
        <div class="header-content">
          <h1>Select Your Seats</h1>
          <p v-if="event?.name">{{ event.name }}</p>
        </div>
      </header>

      <!-- Error Message -->
      <div v-if="error" class="error-banner">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </div>

      <div class="seats-layout">
        <!-- Seating Map -->
        <div class="map-section">
          <div class="map-container">
            <PublicSeatingMap
              :tables="tables"
              :selected-tables="selectedTables"
              :selected-seats="selectedSeats"
              :loading="tablesLoading"
              @update:selected-tables="selectedTables = $event"
              @update:selected-seats="selectedSeats = $event"
            />
          </div>

          <!-- Legend -->
          <div class="map-legend">
            <div class="legend-item">
              <span class="legend-dot available"></span>
              <span>Available</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot selected"></span>
              <span>Selected</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot sold"></span>
              <span>Sold</span>
            </div>
          </div>
        </div>

        <!-- Selection Summary -->
        <div class="summary-section">
          <div class="summary-card">
            <h2>Your Selection</h2>

            <!-- Empty State -->
            <div v-if="!hasSelections" class="empty-selection">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p class="empty-title">No seats selected</p>
              <p class="empty-desc">Click on tables or seats to select them</p>
            </div>

            <!-- Selected Items -->
            <div v-else class="selection-list">
              <!-- Tables -->
              <div v-if="selectedTables.length > 0" class="selection-group">
                <span class="group-label">Tables</span>
                <div class="selection-items">
                  <div v-for="tableId in selectedTables" :key="tableId" class="selection-item">
                    <span class="item-name">{{ getTableName(tableId) }}</span>
                    <span class="item-price">${{ getTablePrice(tableId) }}</span>
                    <button @click="removeTable(tableId)" class="item-remove">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Seats -->
              <div v-if="selectedSeats.length > 0" class="selection-group">
                <span class="group-label">Seats</span>
                <div class="selection-items">
                  <div v-for="seatId in selectedSeats" :key="seatId" class="selection-item">
                    <span class="item-name">{{ getSeatInfo(seatId) }}</span>
                    <span class="item-price">${{ getSeatPrice(seatId) }}</span>
                    <button @click="removeSeat(seatId)" class="item-remove">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div class="selection-total">
                <div class="total-row">
                  <span class="total-label">Total</span>
                  <span class="total-value">${{ totalPrice.toFixed(2) }}</span>
                </div>

                <p class="hold-notice">
                  Your selection will be held for {{ event?.reservation_minutes || 15 }} minutes after you proceed.
                </p>

                <button
                  @click="handleContinue"
                  :disabled="reserving"
                  class="btn-continue"
                >
                  <span v-if="reserving" class="btn-loading">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                    </svg>
                    Reserving...
                  </span>
                  <span v-else>Continue to Checkout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const router = useRouter()
const { getPublicEvent, checkAvailability } = useEvents()
const { getPublicTables } = useTables()
const { createReservation } = useReservations()

const event = ref(null)
const availability = ref(null)
const tables = ref([])
const loading = ref(true)
const tablesLoading = ref(false)
const reserving = ref(false)
const error = ref('')

const selectedTables = ref([])
const selectedSeats = ref([])

// Load data
onMounted(async () => {
  try {
    const [eventResponse, availabilityResponse] = await Promise.all([
      getPublicEvent(route.params.slug),
      checkAvailability(route.params.slug)
    ])

    event.value = eventResponse.event
    availability.value = availabilityResponse

    if (event.value?.seating_type === 'seated') {
      tablesLoading.value = true
      try {
        const tablesResponse = await getPublicTables(route.params.slug)
        tables.value = tablesResponse.tables || []
      } catch (e) {
        error.value = 'Failed to load seating information'
      } finally {
        tablesLoading.value = false
      }
    }
  } catch (e) {
    error.value = e.message || 'Failed to load event'
  } finally {
    loading.value = false
  }
})

// Computed
const isSeatedEvent = computed(() => event.value?.seating_type === 'seated')
const canPurchase = computed(() => availability.value?.can_purchase ?? false)

const blockedMessage = computed(() => {
  const messages = {
    not_live: 'This event is not available for purchase.',
    registration_closed: 'Registration for this event is currently closed.',
    deadline_passed: 'The registration deadline has passed.',
    sold_out: 'This event is sold out.'
  }
  return messages[availability.value?.blocked_reason] || 'This event is not available for purchase.'
})

const hasSelections = computed(() => {
  return selectedTables.value.length > 0 || selectedSeats.value.length > 0
})

const totalPrice = computed(() => {
  let total = 0

  for (const tableId of selectedTables.value) {
    const table = tables.value.find(t => t.id === tableId)
    if (table) total += table.price || 0
  }

  for (const seatId of selectedSeats.value) {
    for (const table of tables.value) {
      if (table.seats) {
        const seat = table.seats.find(s => s.id === seatId)
        if (seat) {
          total += seat.price || 0
          break
        }
      }
    }
  }

  return total
})

// Helper functions
const getTableName = (tableId) => {
  const table = tables.value.find(t => t.id === tableId)
  return table ? table.name : ''
}

const getTablePrice = (tableId) => {
  const table = tables.value.find(t => t.id === tableId)
  return table ? Number(table.price).toFixed(2) : '0.00'
}

const getSeatInfo = (seatId) => {
  for (const table of tables.value) {
    if (table.seats) {
      const seat = table.seats.find(s => s.id === seatId)
      if (seat) {
        return `${table.name} - ${seat.label}`
      }
    }
  }
  return ''
}

const getSeatPrice = (seatId) => {
  for (const table of tables.value) {
    if (table.seats) {
      const seat = table.seats.find(s => s.id === seatId)
      if (seat) return Number(seat.price).toFixed(2)
    }
  }
  return '0.00'
}

const removeTable = (tableId) => {
  selectedTables.value = selectedTables.value.filter(id => id !== tableId)
}

const removeSeat = (seatId) => {
  selectedSeats.value = selectedSeats.value.filter(id => id !== seatId)
}

const handleContinue = async () => {
  if (!hasSelections.value) return

  reserving.value = true
  error.value = ''

  try {
    const response = await createReservation(route.params.slug, {
      tables: selectedTables.value,
      seats: selectedSeats.value
    })

    // Save reservation to session storage
    const reservationData = {
      token: response.reservation.token,
      expires_at: response.reservation.expires_at,
      tables: selectedTables.value,
      seats: selectedSeats.value
    }
    sessionStorage.setItem(`reservation_${route.params.slug}`, JSON.stringify(reservationData))

    // Navigate to checkout
    router.push(`/app/events/${route.params.slug}/checkout`)
  } catch (e) {
    error.value = e.message || 'Failed to reserve seats. Please try again.'
    reserving.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

.seats-page {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --color-text: #1a1a1a;
  --color-text-light: #666;
  --color-text-muted: #999;
  --color-bg: #fff;
  --color-bg-alt: #f8f8f8;
  --color-border: #eee;
  --color-primary: #2563eb;
  --color-success: #059669;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --radius: 12px;

  font-family: var(--font-body);
  min-height: 100vh;
  background: var(--color-bg-alt);
}

/* Loading State */
.loading-state {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.loading-spinner svg {
  width: 48px;
  height: 48px;
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 15px;
  color: var(--color-text-light);
}

/* Message States */
.message-state {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.message-card {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 40px 24px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.message-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.message-icon.info {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.message-icon.info svg {
  color: var(--color-primary);
}

.message-icon.warning {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
}

.message-icon.warning svg {
  color: var(--color-warning);
}

.message-icon svg {
  width: 32px;
  height: 32px;
}

.message-card h1 {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.message-card p {
  font-size: 15px;
  color: var(--color-text-light);
  margin-bottom: 24px;
}

/* Seats Content */
.seats-content {
  padding: 20px 16px 100px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.seats-header {
  margin-bottom: 24px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-primary);
  text-decoration: none;
  margin-bottom: 16px;
}

.back-link svg {
  width: 16px;
  height: 16px;
}

.back-link:hover {
  text-decoration: underline;
}

.header-content h1 {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.header-content p {
  font-size: 15px;
  color: var(--color-text-light);
}

/* Error Banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: var(--color-danger);
  font-size: 14px;
  margin-bottom: 24px;
}

.error-banner svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Layout */
.seats-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Map Section */
.map-section {
  order: 1;
}

.map-container {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  min-height: 300px;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-light);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-dot.available {
  background: #d1fae5;
  border: 1px solid #6ee7b7;
}

.legend-dot.selected {
  background: var(--color-primary);
}

.legend-dot.sold {
  background: #e5e7eb;
  border: 1px solid #d1d5db;
}

/* Summary Section */
.summary-section {
  order: 2;
}

.summary-card {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 24px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.summary-card h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 20px;
}

/* Empty Selection */
.empty-selection {
  text-align: center;
  padding: 32px 16px;
}

.empty-selection svg {
  width: 48px;
  height: 48px;
  color: #d1d5db;
  margin-bottom: 12px;
}

.empty-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.empty-desc {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* Selection List */
.selection-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selection-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selection-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selection-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-alt);
  border-radius: 8px;
}

.item-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.item-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.item-remove {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.item-remove:hover {
  color: var(--color-danger);
  background: #fef2f2;
}

.item-remove svg {
  width: 16px;
  height: 16px;
}

/* Selection Total */
.selection-total {
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.total-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.total-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.hold-notice {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 16px;
}

/* Buttons */
.btn-primary,
.btn-continue {
  display: block;
  width: 100%;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  background: var(--color-text);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover,
.btn-continue:hover:not(:disabled) {
  background: #333;
}

.btn-continue:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-loading svg {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

/* Tablet */
@media (min-width: 640px) {
  .seats-content {
    padding: 32px 24px 100px;
  }

  .header-content h1 {
    font-size: 32px;
  }

  .map-container {
    padding: 24px;
    min-height: 400px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .seats-content {
    padding: 40px 40px 60px;
  }

  .seats-layout {
    flex-direction: row;
    align-items: flex-start;
  }

  .map-section {
    flex: 1;
    order: 1;
  }

  .summary-section {
    width: 340px;
    flex-shrink: 0;
    order: 2;
    position: sticky;
    top: 100px;
  }

  .map-container {
    min-height: 500px;
  }
}
</style>
