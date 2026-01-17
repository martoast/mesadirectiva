<template>
  <div class="attendees-page">
    <!-- Loading -->
    <div v-if="loading && !attendees.length" class="state-container">
      <div class="loading-state">
        <div class="loader"></div>
        <span>{{ t.loading }}</span>
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/app/admin/events">{{ t.events }}</NuxtLink>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <NuxtLink :to="`/app/admin/events/${route.params.slug}`">{{ eventName }}</NuxtLink>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span>{{ t.attendees }}</span>
      </nav>

      <!-- Header -->
      <header class="page-header">
        <div class="header-main">
          <h1>{{ t.attendees }}</h1>
          <p class="header-subtitle">{{ eventName }}</p>
        </div>
        <button @click="openScanner" class="btn-scan">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          {{ t.scanQR }}
        </button>
      </header>

      <!-- QR Scanner Modal -->
      <div v-if="showScanner" class="scanner-modal" @click.self="closeScanner">
        <div class="scanner-container">
          <div class="scanner-header">
            <h2>{{ t.scanTicket }}</h2>
            <button @click="closeScanner" class="btn-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scan Result -->
          <div v-if="scanResult" :class="['scan-result', scanResult.success ? 'success' : 'error']">
            <div class="result-icon">
              <svg v-if="scanResult.success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div class="result-content">
              <p class="result-message">{{ scanResult.message }}</p>
              <p v-if="scanResult.attendee" class="result-attendee">{{ scanResult.attendee.attendee_name }}</p>
            </div>
            <button @click="continueScan" class="btn-continue">{{ t.scanNext }}</button>
          </div>

          <!-- Scanner -->
          <div v-show="!scanResult" id="qr-reader" class="scanner-view"></div>

          <p class="scanner-hint">{{ t.scannerHint }}</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ meta.total }}</span>
            <span class="stat-label">{{ t.totalAttendees }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon checked">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value success">{{ meta.checked_in_count }}</span>
            <span class="stat-label">{{ t.checkedIn }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pending">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ meta.not_checked_in_count }}</span>
            <span class="stat-label">{{ t.notCheckedIn }}</span>
          </div>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="filters-bar">
        <!-- Search -->
        <div class="search-box">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t.searchPlaceholder"
            @input="handleSearch"
          />
          <button v-if="searchQuery" @click="clearSearch" class="search-clear">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Filters -->
        <div class="filter-group">
          <select v-model="checkedInFilter" @change="fetchAttendees" class="filter-select">
            <option value="all">{{ t.allStatus }}</option>
            <option value="not_checked_in">{{ t.notCheckedIn }}</option>
            <option value="checked_in">{{ t.checkedIn }}</option>
          </select>

          <select v-if="isSeatedEvent" v-model="typeFilter" @change="fetchAttendees" class="filter-select">
            <option value="all">{{ t.allTypes }}</option>
            <option value="tables">{{ t.tablesOnly }}</option>
            <option value="seats">{{ t.seatsOnly }}</option>
          </select>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && attendees.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3>{{ searchQuery ? t.noResults : t.noAttendees }}</h3>
        <p>{{ searchQuery ? t.tryDifferentSearch : t.noAttendeesDesc }}</p>
      </div>

      <!-- Attendees List -->
      <div v-else class="attendees-list">
        <div
          v-for="attendee in attendees"
          :key="attendee.id"
          :class="['attendee-card', { 'checked-in': attendee.is_checked_in }]"
        >
          <!-- Attendee Info -->
          <div class="attendee-main">
            <div class="attendee-avatar" :class="{ checked: attendee.is_checked_in }">
              <span v-if="attendee.is_checked_in">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span v-else>{{ getInitials(attendee.attendee_name) }}</span>
            </div>

            <div class="attendee-info">
              <h3 class="attendee-name">{{ attendee.attendee_name || t.noName }}</h3>
              <p v-if="attendee.attendee_note" class="attendee-note">{{ attendee.attendee_note }}</p>

              <!-- Badges -->
              <div class="attendee-badges">
                <!-- Tier badge (GA events) -->
                <span v-if="attendee.tier" class="badge tier">
                  {{ attendee.tier.name }}
                </span>

                <!-- Table badge (Seated events) -->
                <span v-if="attendee.table" class="badge table">
                  {{ t.table }}: {{ attendee.table.name }}
                </span>

                <!-- Seat badge (Seated events) -->
                <span v-if="attendee.seat" class="badge seat">
                  {{ attendee.seat.table ? `${attendee.seat.table.name} - ` : '' }}{{ t.seat }}: {{ attendee.seat.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Buyer Info -->
          <div class="buyer-info">
            <span class="buyer-label">{{ t.purchasedBy }}</span>
            <span class="buyer-name">{{ attendee.order?.customer_name }}</span>
            <span class="buyer-email">{{ attendee.order?.customer_email }}</span>
            <span class="order-number">{{ attendee.order?.order_number }}</span>
          </div>

          <!-- Check-in Action -->
          <div class="checkin-action">
            <template v-if="attendee.is_checked_in">
              <div class="checked-status">
                <span class="checked-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ t.checkedIn }}
                </span>
                <span class="checked-time">{{ formatCheckedInTime(attendee.checked_in_at) }}</span>
              </div>
              <button
                @click="handleUndoCheckIn(attendee)"
                :disabled="checkingIn === attendee.id"
                class="btn-undo"
              >
                {{ t.undo }}
              </button>
            </template>
            <template v-else>
              <button
                @click="handleCheckIn(attendee)"
                :disabled="checkingIn === attendee.id"
                class="btn-checkin"
              >
                <svg v-if="checkingIn === attendee.id" class="spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="8" />
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ t.checkIn }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMorePages" class="load-more">
        <button @click="loadMore" :disabled="loading" class="btn-load-more">
          {{ loading ? t.loading : t.loadMore }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { t: createT } = useLanguage()

const translations = {
  loading: { es: 'Cargando...', en: 'Loading...' },
  events: { es: 'Eventos', en: 'Events' },
  attendees: { es: 'Asistentes', en: 'Attendees' },
  totalAttendees: { es: 'Total asistentes', en: 'Total Attendees' },
  checkedIn: { es: 'Registrados', en: 'Checked In' },
  notCheckedIn: { es: 'Sin registrar', en: 'Not Checked In' },
  searchPlaceholder: { es: 'Buscar por nombre, email, orden...', en: 'Search by name, email, order...' },
  allStatus: { es: 'Todos los estados', en: 'All Status' },
  allTypes: { es: 'Todos los tipos', en: 'All Types' },
  tablesOnly: { es: 'Solo mesas', en: 'Tables Only' },
  seatsOnly: { es: 'Solo asientos', en: 'Seats Only' },
  noAttendees: { es: 'No hay asistentes', en: 'No Attendees' },
  noAttendeesDesc: { es: 'Aún no hay asistentes registrados para este evento.', en: 'No attendees registered for this event yet.' },
  noResults: { es: 'Sin resultados', en: 'No Results' },
  tryDifferentSearch: { es: 'Intenta con una búsqueda diferente.', en: 'Try a different search.' },
  noName: { es: 'Sin nombre', en: 'No name' },
  table: { es: 'Mesa', en: 'Table' },
  seat: { es: 'Asiento', en: 'Seat' },
  purchasedBy: { es: 'Comprado por', en: 'Purchased by' },
  checkIn: { es: 'Registrar', en: 'Check In' },
  undo: { es: 'Deshacer', en: 'Undo' },
  loadMore: { es: 'Cargar más', en: 'Load More' },
  scanQR: { es: 'Escanear QR', en: 'Scan QR' },
  scanTicket: { es: 'Escanear boleto', en: 'Scan Ticket' },
  scannerHint: { es: 'Apunta la cámara al código QR del boleto', en: 'Point the camera at the ticket QR code' },
  scanNext: { es: 'Escanear siguiente', en: 'Scan Next' },
  checkedInSuccess: { es: 'Registrado exitosamente', en: 'Checked in successfully' },
  alreadyCheckedIn: { es: 'Ya está registrado', en: 'Already checked in' },
  invalidTicket: { es: 'Boleto no válido', en: 'Invalid ticket' },
  wrongEvent: { es: 'Este boleto es para otro evento', en: 'This ticket is for another event' },
  notPaid: { es: 'Este boleto no ha sido pagado', en: 'This ticket has not been paid' },
}

const t = createT(translations)

const route = useRoute()
const { getAttendees, checkInAttendee, undoCheckIn, scanCheckIn } = useAttendees()

// State
const attendees = ref([])
const meta = ref({
  total: 0,
  checked_in_count: 0,
  not_checked_in_count: 0,
  current_page: 1,
  last_page: 1,
})
const eventInfo = ref(null)
const loading = ref(true)
const checkingIn = ref(null)
const searchQuery = ref('')
const checkedInFilter = ref('all')
const typeFilter = ref('all')
let searchTimeout = null

// QR Scanner state
const showScanner = ref(false)
const scanResult = ref(null)
let html5QrCode = null

// Computed
const eventName = computed(() => eventInfo.value?.name || route.params.slug)
const isSeatedEvent = computed(() => eventInfo.value?.seating_type === 'seated')
const hasMorePages = computed(() => meta.value.current_page < meta.value.last_page)

// Methods
const fetchAttendees = async (append = false) => {
  loading.value = true
  try {
    const params = {
      search: searchQuery.value || undefined,
      checked_in: checkedInFilter.value !== 'all' ? checkedInFilter.value : undefined,
      type: typeFilter.value !== 'all' ? typeFilter.value : undefined,
      per_page: 50,
      page: append ? meta.value.current_page + 1 : 1,
    }

    const response = await getAttendees(route.params.slug, params)

    if (append) {
      attendees.value = [...attendees.value, ...response.attendees]
    } else {
      attendees.value = response.attendees
    }

    meta.value = response.meta
    eventInfo.value = response.event
  } catch (e) {
    console.error('Failed to fetch attendees:', e)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchAttendees()
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  fetchAttendees()
}

const loadMore = () => {
  fetchAttendees(true)
}

const handleCheckIn = async (attendee) => {
  checkingIn.value = attendee.id
  try {
    const response = await checkInAttendee(route.params.slug, attendee.id)

    // Update the attendee in the list
    const index = attendees.value.findIndex(a => a.id === attendee.id)
    if (index !== -1) {
      attendees.value[index] = response.attendee
    }

    // Update meta counts
    meta.value.checked_in_count++
    meta.value.not_checked_in_count--
  } catch (e) {
    console.error('Failed to check in:', e)
  } finally {
    checkingIn.value = null
  }
}

const handleUndoCheckIn = async (attendee) => {
  checkingIn.value = attendee.id
  try {
    const response = await undoCheckIn(route.params.slug, attendee.id)

    // Update the attendee in the list
    const index = attendees.value.findIndex(a => a.id === attendee.id)
    if (index !== -1) {
      attendees.value[index] = response.attendee
    }

    // Update meta counts
    meta.value.checked_in_count--
    meta.value.not_checked_in_count++
  } catch (e) {
    console.error('Failed to undo check-in:', e)
  } finally {
    checkingIn.value = null
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatCheckedInTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

// QR Scanner methods
const openScanner = async () => {
  showScanner.value = true
  scanResult.value = null

  // Wait for DOM to update
  await nextTick()

  // Dynamically import html5-qrcode to avoid SSR issues
  const { Html5Qrcode } = await import('html5-qrcode')

  html5QrCode = new Html5Qrcode('qr-reader')

  try {
    await html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanFailure
    )
  } catch (err) {
    console.error('Failed to start camera:', err)
  }
}

const closeScanner = async () => {
  if (html5QrCode) {
    try {
      await html5QrCode.stop()
    } catch (e) {
      // Ignore stop errors
    }
    html5QrCode = null
  }
  showScanner.value = false
  scanResult.value = null
}

const onScanSuccess = async (decodedText) => {
  // Pause scanner while processing
  if (html5QrCode) {
    try {
      await html5QrCode.pause()
    } catch (e) {
      // Ignore pause errors
    }
  }

  try {
    const response = await scanCheckIn(route.params.slug, decodedText)

    scanResult.value = {
      success: true,
      message: t.value.checkedInSuccess,
      attendee: response.attendee,
    }

    // Update the attendee in the list if present
    if (response.attendee) {
      const index = attendees.value.findIndex(a => a.id === response.attendee.id)
      if (index !== -1) {
        attendees.value[index] = response.attendee
      }
      // Update meta counts
      meta.value.checked_in_count++
      meta.value.not_checked_in_count--
    }
  } catch (error) {
    const errorData = error?.data || {}
    let message = t.value.invalidTicket

    if (errorData.already_checked_in) {
      message = t.value.alreadyCheckedIn
    } else if (errorData.message?.includes('different event')) {
      message = t.value.wrongEvent
    } else if (errorData.message?.includes('not been paid')) {
      message = t.value.notPaid
    }

    scanResult.value = {
      success: false,
      message,
      attendee: errorData.attendee || null,
    }
  }
}

const onScanFailure = (error) => {
  // Silently ignore - QR not found in frame
}

const continueScan = async () => {
  scanResult.value = null

  if (html5QrCode) {
    try {
      await html5QrCode.resume()
    } catch (e) {
      // If resume fails, restart the scanner
      await openScanner()
    }
  }
}

onMounted(fetchAttendees)

onUnmounted(() => {
  if (html5QrCode) {
    try {
      html5QrCode.stop()
    } catch (e) {
      // Ignore stop errors
    }
  }
})
</script>

<style scoped>
.attendees-page {
  --color-paper: #faf9f7;
  --color-ink: #1a1a1a;
  --color-ink-light: #4a4a4a;
  --color-ink-muted: #8a8a8a;
  --color-stone: #e8e6e3;
  --color-stone-light: #f5f4f2;
  --color-success: #16a34a;
  --color-success-light: rgba(22, 163, 74, 0.1);
  --color-indigo: #264653;
  --color-indigo-light: rgba(38, 70, 83, 0.1);

  min-height: 100vh;
  background: var(--color-paper);
  padding: 16px;
  padding-bottom: 100px;
}

/* States */
.state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loader {
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-stone);
  border-top-color: var(--color-indigo);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 16px;
  overflow-x: auto;
  white-space: nowrap;
}

.breadcrumb a {
  color: var(--color-ink-muted);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--color-ink);
}

.breadcrumb svg {
  width: 14px;
  height: 14px;
  color: var(--color-stone);
  flex-shrink: 0;
}

.breadcrumb span {
  color: var(--color-ink-light);
  font-weight: 500;
}

/* Header */
.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
}

.header-subtitle {
  font-size: 14px;
  color: var(--color-ink-muted);
  margin: 4px 0 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border: 1px solid var(--color-stone);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
}

.stat-icon.total {
  background: var(--color-indigo-light);
  color: var(--color-indigo);
}

.stat-icon.checked {
  background: var(--color-success-light);
  color: var(--color-success);
}

.stat-icon.pending {
  background: var(--color-stone-light);
  color: var(--color-ink-muted);
}

.stat-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1;
}

.stat-value.success {
  color: var(--color-success);
}

.stat-label {
  font-size: 11px;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-top: 4px;
}

/* Filters Bar */
.filters-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-ink-muted);
}

.search-box input {
  width: 100%;
  padding: 12px 40px 12px 44px;
  background: #fff;
  border: 1px solid var(--color-stone);
  border-radius: 10px;
  font-size: 14px;
  color: var(--color-ink);
}

.search-box input::placeholder {
  color: var(--color-ink-muted);
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-indigo);
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: var(--color-stone);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ink-muted);
}

.search-clear svg {
  width: 12px;
  height: 12px;
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-select {
  flex: 1;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid var(--color-stone);
  border-radius: 8px;
  font-size: 13px;
  color: var(--color-ink);
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-indigo);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: var(--color-stone-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: var(--color-ink-muted);
}

.empty-icon svg {
  width: 32px;
  height: 32px;
}

.empty-state h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  color: var(--color-ink-muted);
  margin: 0;
}

/* Attendees List */
.attendees-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attendee-card {
  background: #fff;
  border: 1px solid var(--color-stone);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.2s;
}

.attendee-card.checked-in {
  border-color: var(--color-success);
  background: linear-gradient(to right, var(--color-success-light), transparent);
}

.attendee-main {
  display: flex;
  gap: 12px;
}

.attendee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-indigo-light);
  color: var(--color-indigo);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.attendee-avatar.checked {
  background: var(--color-success);
  color: #fff;
}

.attendee-avatar svg {
  width: 24px;
  height: 24px;
}

.attendee-info {
  flex: 1;
  min-width: 0;
}

.attendee-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0;
}

.attendee-note {
  font-size: 13px;
  color: var(--color-ink-muted);
  margin: 4px 0 0;
}

.attendee-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.badge {
  display: inline-flex;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge.tier {
  background: var(--color-indigo-light);
  color: var(--color-indigo);
}

.badge.table {
  background: #fef3c7;
  color: #b45309;
}

.badge.seat {
  background: #dbeafe;
  color: #1d4ed8;
}

.buyer-info {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-stone-light);
  font-size: 12px;
}

.buyer-label {
  width: 100%;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-size: 10px;
}

.buyer-name {
  color: var(--color-ink);
  font-weight: 500;
}

.buyer-email {
  color: var(--color-ink-muted);
}

.order-number {
  color: var(--color-ink-muted);
  font-family: monospace;
  font-size: 11px;
}

/* Check-in Action */
.checkin-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-stone-light);
}

.checked-status {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checked-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-success);
}

.checked-badge svg {
  width: 16px;
  height: 16px;
}

.checked-time {
  font-size: 11px;
  color: var(--color-ink-muted);
}

.btn-checkin {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  background: var(--color-success);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-checkin:hover:not(:disabled) {
  background: #15803d;
}

.btn-checkin:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-checkin svg {
  width: 20px;
  height: 20px;
}

.btn-checkin .spinner {
  animation: spin 1s linear infinite;
}

.btn-undo {
  padding: 8px 16px;
  background: transparent;
  color: var(--color-ink-muted);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--color-stone);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-undo:hover {
  background: var(--color-stone-light);
  color: var(--color-ink);
}

/* Load More */
.load-more {
  text-align: center;
  margin-top: 24px;
}

.btn-load-more {
  padding: 12px 32px;
  background: #fff;
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--color-stone);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-load-more:hover:not(:disabled) {
  background: var(--color-stone-light);
}

.btn-load-more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Tablet+ */
@media (min-width: 640px) {
  .attendees-page {
    padding: 24px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .filters-bar {
    flex-direction: row;
    align-items: center;
  }

  .filter-group {
    flex: 0 0 auto;
  }

  .filter-select {
    flex: 0 0 auto;
    min-width: 160px;
  }

  .attendee-card {
    flex-direction: row;
    align-items: center;
    padding: 20px;
  }

  .attendee-main {
    flex: 1;
    min-width: 0;
  }

  .buyer-info {
    flex: 0 0 200px;
    flex-direction: column;
    gap: 2px;
    padding-top: 0;
    padding-left: 20px;
    border-top: none;
    border-left: 1px solid var(--color-stone-light);
  }

  .buyer-label {
    width: auto;
  }

  .checkin-action {
    flex: 0 0 auto;
    padding-top: 0;
    padding-left: 20px;
    border-top: none;
    border-left: 1px solid var(--color-stone-light);
  }

  .btn-checkin {
    width: auto;
    padding: 12px 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .attendees-page {
    padding: 32px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .stats-grid {
    gap: 20px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-value {
    font-size: 32px;
  }
}

/* Page Header with Scan Button */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.btn-scan {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-indigo);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-scan:hover {
  background: #1d3d4a;
}

.btn-scan svg {
  width: 20px;
  height: 20px;
}

/* QR Scanner Modal */
.scanner-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.scanner-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.scanner-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-stone);
}

.scanner-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0;
}

.btn-close {
  width: 32px;
  height: 32px;
  background: var(--color-stone-light);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ink-muted);
  transition: all 0.2s;
}

.btn-close:hover {
  background: var(--color-stone);
  color: var(--color-ink);
}

.btn-close svg {
  width: 18px;
  height: 18px;
}

.scanner-view {
  width: 100%;
  min-height: 300px;
}

.scanner-hint {
  text-align: center;
  padding: 16px 20px;
  font-size: 13px;
  color: var(--color-ink-muted);
  margin: 0;
}

/* Scan Result */
.scan-result {
  padding: 32px 20px;
  text-align: center;
}

.scan-result.success .result-icon {
  background: var(--color-success-light);
  color: var(--color-success);
}

.scan-result.error .result-icon {
  background: #fef2f2;
  color: #dc2626;
}

.result-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.result-icon svg {
  width: 32px;
  height: 32px;
}

.result-message {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 4px;
}

.result-attendee {
  font-size: 14px;
  color: var(--color-ink-muted);
  margin: 0;
}

.btn-continue {
  margin-top: 24px;
  padding: 12px 32px;
  background: var(--color-indigo);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-continue:hover {
  background: #1d3d4a;
}
</style>
