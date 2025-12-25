<template>
  <div class="event-detail-page">
    <!-- Back Button -->
    <NuxtLink to="/app/admin/events" class="back-link">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Events
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-spinner"></div>
      <p class="state-text">Loading event...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error">
      <svg class="state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="state-text">{{ error }}</p>
      <button @click="fetchEvent" class="retry-btn">Try Again</button>
    </div>

    <!-- Event Content -->
    <template v-else-if="event">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ event.name }}</h1>
          <div class="badges-row">
            <span :class="['status-badge', event.status]">
              <span class="status-dot"></span>
              {{ statusLabel }}
            </span>
            <span v-if="event.group" class="group-badge" :style="{ '--group-color': event.group.color }">
              {{ event.group.name }}
            </span>
            <span :class="['type-badge', event.seating_type]">
              {{ event.seating_type === 'seated' ? 'Seated Event' : 'General Admission' }}
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button
            v-if="event.status === 'draft'"
            @click="handlePublish"
            :disabled="actionLoading"
            class="action-btn success"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            {{ actionLoading ? 'Publishing...' : 'Publish' }}
          </button>
          <button
            v-if="event.status === 'live'"
            @click="handleClose"
            :disabled="actionLoading"
            class="action-btn warning"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            {{ actionLoading ? 'Closing...' : 'Close Event' }}
          </button>
          <NuxtLink :to="`/app/admin/events/${event.slug}/edit`" class="action-btn secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </NuxtLink>
          <button @click="handleDelete" class="action-btn danger">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <!-- Floor Plan Card (for seated events) -->
      <div v-if="event.seating_type === 'seated'" class="floor-plan-card">
        <div class="floor-plan-preview">
          <div class="preview-grid">
            <div class="preview-stage">STAGE</div>
            <div
              v-for="(table, index) in tables.slice(0, 6)"
              :key="table.id"
              :class="['preview-table', { 'is-vip': table.sell_as_whole }]"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <span class="preview-table-name">{{ table.name }}</span>
            </div>
            <div v-if="tables.length > 6" class="preview-more">
              +{{ tables.length - 6 }} more
            </div>
          </div>
        </div>
        <div class="floor-plan-info">
          <div class="floor-plan-header">
            <div class="floor-plan-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div class="floor-plan-title">
              <h3>Floor Plan Editor</h3>
              <p>Drag tables to arrange your event layout</p>
            </div>
          </div>
          <div class="floor-plan-stats">
            <div class="fp-stat">
              <span class="fp-stat-value">{{ tables.length }}</span>
              <span class="fp-stat-label">Tables</span>
            </div>
            <div class="fp-stat">
              <span class="fp-stat-value">{{ totalSeats }}</span>
              <span class="fp-stat-label">Seats</span>
            </div>
            <div class="fp-stat available">
              <span class="fp-stat-value">{{ availableSeats }}</span>
              <span class="fp-stat-label">Available</span>
            </div>
          </div>
          <div class="floor-plan-actions">
            <NuxtLink :to="`/app/admin/events/${event.slug}/floor-plan`" class="fp-primary-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Open Editor
            </NuxtLink>
            <NuxtLink :to="`/app/admin/events/${event.slug}/tables`" class="fp-secondary-btn">
              Manage Tables
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Management Card (for non-seated events or as secondary link) -->
      <div v-if="event.seating_type !== 'seated'" class="management-card">
        <div class="management-content">
          <div class="management-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div class="management-text">
            <h3 class="management-title">Manage Ticket Tiers</h3>
            <p class="management-subtitle">Create pricing tiers with early bird options</p>
          </div>
        </div>
        <NuxtLink :to="`/app/admin/events/${event.slug}/tiers`" class="management-btn">
          Manage Tiers
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Left Column -->
        <div class="main-column">
          <!-- Event Info Card -->
          <div class="card">
            <h2 class="card-title">Event Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Event Name</span>
                <span class="info-value">{{ event.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Location</span>
                <span class="info-value">{{ event.location }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date</span>
                <span class="info-value mono">{{ formatDate(event.date) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Time</span>
                <span class="info-value mono">{{ event.time }}</span>
              </div>
              <div v-if="event.seating_type === 'general_admission'" class="info-item">
                <span class="info-label">Base Ticket Price</span>
                <span class="info-value mono">${{ event.price }}</span>
              </div>
              <div v-if="event.seating_type === 'seated'" class="info-item">
                <span class="info-label">Reservation Time</span>
                <span class="info-value mono">{{ event.reservation_minutes || 15 }} min</span>
              </div>
              <div v-if="event.seating_type === 'general_admission'" class="info-item">
                <span class="info-label">Max Capacity</span>
                <span class="info-value mono">{{ event.max_tickets }} tickets</span>
              </div>
              <div class="info-item">
                <span class="info-label">Registration</span>
                <span :class="['info-value', event.registration_open ? 'text-success' : 'text-muted']">
                  {{ event.registration_open ? 'Open' : 'Closed' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Page Design Card -->
          <div class="card">
            <h2 class="card-title">Page Design</h2>
            <div class="design-section">
              <div class="design-item">
                <span class="design-label">Hero Title</span>
                <p class="design-value">{{ event.hero_title || '—' }}</p>
              </div>
              <div class="design-item">
                <span class="design-label">Hero Subtitle</span>
                <p class="design-value">{{ event.hero_subtitle || '—' }}</p>
              </div>
              <div v-if="event.hero_image_url" class="design-item">
                <span class="design-label">Hero Image</span>
                <img :src="event.hero_image_url" alt="Hero" class="hero-preview" />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="side-column">
          <!-- Stats Card -->
          <div class="card stats-card">
            <h2 class="card-title">Sales Statistics</h2>

            <div class="stat-main">
              <span class="stat-label">Tickets Sold</span>
              <span class="stat-value">{{ event.tickets_sold }}</span>
              <span v-if="event.max_tickets" class="stat-sub">of {{ event.max_tickets }} total</span>
            </div>

            <div v-if="event.max_tickets" class="progress-bar">
              <div class="progress-fill" :style="{ width: `${(event.tickets_sold / event.max_tickets) * 100}%` }"></div>
            </div>
            <p v-if="event.max_tickets" class="progress-label">
              {{ Math.round((event.tickets_sold / event.max_tickets) * 100) }}% capacity
            </p>

            <div class="stat-row">
              <div class="stat-item">
                <span class="stat-label">Available</span>
                <span class="stat-number success">{{ event.tickets_available }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Est. Revenue</span>
                <span class="stat-number">${{ ((event.tickets_sold || 0) * (event.price || 0)).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Links Card -->
          <div class="card">
            <h2 class="card-title">Quick Links</h2>
            <div class="quick-links">
              <NuxtLink
                :to="event.seating_type === 'seated'
                  ? `/app/admin/events/${event.slug}/tables`
                  : `/app/admin/events/${event.slug}/tiers`"
                class="quick-link"
              >
                <span>{{ event.seating_type === 'seated' ? 'Tables & Seats' : 'Ticket Tiers' }}</span>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
              <NuxtLink :to="`/app/events/${event.slug}`" target="_blank" class="quick-link external">
                <span>View Public Page</span>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="deleteModalOpen" class="modal-overlay" @click.self="deleteModalOpen = false">
        <div class="modal-content">
          <div class="modal-icon danger">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="modal-title">Delete Event</h3>
          <p class="modal-message">Are you sure you want to delete this event? This action cannot be undone.</p>
          <div class="modal-actions">
            <button @click="deleteModalOpen = false" class="modal-btn secondary">Cancel</button>
            <button @click="confirmDelete" class="modal-btn danger">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const router = useRouter()
const { getEvent, deleteEvent, publishEvent, closeEvent } = useEvents()
const { getTables } = useTables()

const event = ref(null)
const tables = ref([])
const loading = ref(true)
const error = ref('')
const actionLoading = ref(false)
const deleteModalOpen = ref(false)

const statusLabel = computed(() => {
  const labels = {
    draft: 'Draft',
    live: 'Live',
    closed: 'Closed'
  }
  return labels[event.value?.status] || 'Draft'
})

const totalSeats = computed(() => {
  return tables.value.reduce((total, table) => {
    if (table.sell_as_whole) {
      return total + table.capacity
    }
    return total + (table.seats?.length || 0)
  }, 0)
})

const availableSeats = computed(() => {
  return tables.value.reduce((total, table) => {
    if (table.sell_as_whole) {
      return total + (table.status === 'available' ? table.capacity : 0)
    }
    return total + (table.seats?.filter(s => s.status === 'available').length || 0)
  }, 0)
})

const soldSeats = computed(() => {
  return tables.value.reduce((total, table) => {
    if (table.sell_as_whole) {
      return total + (table.status === 'sold' ? table.capacity : 0)
    }
    return total + (table.seats?.filter(s => s.status === 'sold').length || 0)
  }, 0)
})

const fetchEvent = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getEvent(route.params.slug)
    event.value = response.event

    // Fetch tables if seated event
    if (response.event.seating_type === 'seated') {
      await fetchTables()
    }
  } catch (e) {
    error.value = e.message || 'Failed to load event'
  } finally {
    loading.value = false
  }
}

const fetchTables = async () => {
  try {
    const response = await getTables(route.params.slug)
    tables.value = response.tables || []
  } catch (e) {
    console.error('Failed to load tables:', e)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handlePublish = async () => {
  actionLoading.value = true
  try {
    await publishEvent(event.value.slug)
    await fetchEvent()
  } catch (e) {
    error.value = e.message || 'Failed to publish event'
  } finally {
    actionLoading.value = false
  }
}

const handleClose = async () => {
  actionLoading.value = true
  try {
    await closeEvent(event.value.slug)
    await fetchEvent()
  } catch (e) {
    error.value = e.message || 'Failed to close event'
  } finally {
    actionLoading.value = false
  }
}

const handleDelete = () => {
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  try {
    await deleteEvent(event.value.slug)
    router.push('/app/admin/events')
  } catch (e) {
    error.value = e.message || 'Failed to delete event'
  }
  deleteModalOpen.value = false
}

onMounted(() => {
  fetchEvent()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

.event-detail-page {
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --color-text: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-muted: #a1a1aa;
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-border: #e4e4e7;
  --color-border-light: #f4f4f5;

  --color-primary: #6366f1;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  font-family: var(--font-sans);
  padding: 24px;
  max-width: 1400px;
}

/* Back Link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--color-text);
}

.back-link svg {
  width: 16px;
  height: 16px;
}

/* States */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.state-container.error {
  border-color: #fecaca;
  background: #fef2f2;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.state-container.error .state-icon {
  color: var(--color-danger);
}

.state-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0;
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--color-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.retry-btn:hover {
  background: #262626;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.draft {
  color: var(--color-warning);
  background: #fef3c7;
}

.status-badge.draft .status-dot {
  background: var(--color-warning);
}

.status-badge.live {
  color: var(--color-success);
  background: #d1fae5;
}

.status-badge.live .status-dot {
  background: var(--color-success);
  animation: pulse 2s infinite;
}

.status-badge.closed {
  color: var(--color-text-muted);
  background: var(--color-border-light);
}

.status-badge.closed .status-dot {
  background: var(--color-text-muted);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Group Badge */
.group-badge {
  display: inline-flex;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--group-color, var(--color-primary));
  background: color-mix(in srgb, var(--group-color, var(--color-primary)) 12%, transparent);
  border-radius: 50px;
}

/* Type Badge */
.type-badge {
  display: inline-flex;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50px;
}

.type-badge.seated {
  color: #7c3aed;
  background: #ede9fe;
}

.type-badge.general_admission {
  color: #2563eb;
  background: #dbeafe;
}

/* Header Actions */
.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.success {
  color: white;
  background: var(--color-success);
}

.action-btn.success:hover:not(:disabled) {
  background: #059669;
}

.action-btn.warning {
  color: white;
  background: var(--color-warning);
}

.action-btn.warning:hover:not(:disabled) {
  background: #d97706;
}

.action-btn.secondary {
  color: var(--color-text-secondary);
  background: var(--color-border-light);
}

.action-btn.secondary:hover {
  background: var(--color-border);
}

.action-btn.danger {
  color: var(--color-danger);
  background: #fee2e2;
}

.action-btn.danger:hover {
  background: #fecaca;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Floor Plan Card */
.floor-plan-card {
  display: grid;
  grid-template-columns: 280px 1fr;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.floor-plan-preview {
  background: #1a1a2e;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
}

.preview-stage {
  grid-column: 1 / -1;
  padding: 8px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(124, 58, 237, 0.4) 100%);
  border: 1px solid rgba(99, 102, 241, 0.5);
  border-radius: 6px;
  font-size: 9px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  text-align: center;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.preview-table {
  padding: 10px 8px;
  background: rgba(255,255,255,0.9);
  border-radius: 6px;
  text-align: center;
  animation: fadeIn 0.3s ease-out both;
}

.preview-table.is-vip {
  border: 2px solid var(--color-warning);
  background: rgba(245, 158, 11, 0.15);
}

.preview-table-name {
  font-size: 9px;
  font-weight: 600;
  color: var(--color-text);
}

.preview-table.is-vip .preview-table-name {
  color: var(--color-warning);
}

.preview-more {
  grid-column: 1 / -1;
  padding: 8px;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.floor-plan-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.floor-plan-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.floor-plan-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  border-radius: 10px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.floor-plan-icon svg {
  width: 22px;
  height: 22px;
}

.floor-plan-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 4px 0;
}

.floor-plan-title p {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

.floor-plan-stats {
  display: flex;
  gap: 24px;
}

.fp-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fp-stat-value {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
}

.fp-stat-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fp-stat.available .fp-stat-value {
  color: var(--color-success);
}

.floor-plan-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.fp-primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s;
}

.fp-primary-btn:hover {
  background: #4f46e5;
}

.fp-primary-btn svg {
  width: 16px;
  height: 16px;
}

.fp-secondary-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-border-light);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s;
}

.fp-secondary-btn:hover {
  background: var(--color-border);
}

/* Management Card */
.management-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border: 1px solid #c7d2fe;
  border-radius: 10px;
  margin-bottom: 24px;
}

.management-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.management-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  color: var(--color-primary);
}

.management-icon svg {
  width: 24px;
  height: 24px;
}

.management-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 4px 0;
}

.management-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

.management-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--color-primary);
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.15s;
  white-space: nowrap;
}

.management-btn:hover {
  background: #4f46e5;
}

.management-btn svg {
  width: 16px;
  height: 16px;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Cards */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 20px 0;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 14px;
  color: var(--color-text);
}

.info-value.mono {
  font-family: var(--font-mono);
}

.info-value.text-success {
  color: var(--color-success);
}

.info-value.text-muted {
  color: var(--color-text-muted);
}

/* Design Section */
.design-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.design-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.design-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.design-value {
  font-size: 14px;
  color: var(--color-text);
  margin: 0;
}

.hero-preview {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

/* Stats Card */
.stats-card .stat-main {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 16px;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 48px;
  font-weight: 500;
  color: var(--color-primary);
  display: block;
  margin: 8px 0 4px 0;
}

.stat-sub {
  font-size: 13px;
  color: var(--color-text-muted);
}

.progress-bar {
  height: 6px;
  background: var(--color-border-light);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-label {
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0 0 20px 0;
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text);
  display: block;
  margin-top: 6px;
}

.stat-number.success {
  color: var(--color-success);
}

/* Quick Links */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-border-light);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s;
}

.quick-link:hover {
  background: var(--color-border);
}

.quick-link span {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.quick-link svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.quick-link.external {
  background: #eef2ff;
}

.quick-link.external:hover {
  background: #e0e7ff;
}

.quick-link.external span {
  color: var(--color-primary);
}

.quick-link.external svg {
  color: var(--color-primary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.modal-icon.danger {
  background: #fee2e2;
  color: var(--color-danger);
}

.modal-icon svg {
  width: 28px;
  height: 28px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.modal-message {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px 20px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.modal-btn.secondary {
  color: var(--color-text-secondary);
  background: var(--color-border-light);
}

.modal-btn.secondary:hover {
  background: var(--color-border);
}

.modal-btn.danger {
  color: white;
  background: var(--color-danger);
}

.modal-btn.danger:hover {
  background: #dc2626;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    order: -1;
  }

  .floor-plan-card {
    grid-template-columns: 1fr;
  }

  .floor-plan-preview {
    display: none;
  }
}

@media (max-width: 768px) {
  .event-detail-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .floor-plan-info {
    padding: 20px;
  }

  .floor-plan-stats {
    gap: 16px;
  }

  .floor-plan-actions {
    flex-direction: column;
  }

  .fp-primary-btn,
  .fp-secondary-btn {
    width: 100%;
    justify-content: center;
  }

  .management-card {
    flex-direction: column;
    text-align: center;
  }

  .management-content {
    flex-direction: column;
  }

  .management-btn {
    width: 100%;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
