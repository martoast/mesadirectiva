<template>
  <div class="events-dashboard">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-title-group">
          <h1>{{ t.title }}</h1>
          <span class="header-badge">{{ meta.total }}</span>
        </div>
        <p class="header-subtitle">{{ t.subtitle }}</p>
      </div>
      <NuxtLink to="/app/admin/events/create" class="btn-create">
        <span class="btn-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </span>
        <span class="btn-label">{{ t.newEvent }}</span>
      </NuxtLink>
    </header>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-visual total">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ meta.total }}</span>
          <span class="stat-title">{{ t.totalEvents }}</span>
        </div>
        <div class="stat-trend neutral">
          <span>{{ t.allTime }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-visual live">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span class="pulse-ring"></span>
        </div>
        <div class="stat-info">
          <span class="stat-number live">{{ liveCount }}</span>
          <span class="stat-title">{{ t.liveNow }}</span>
        </div>
        <div class="stat-trend positive" v-if="liveCount > 0">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
          </svg>
          <span>{{ t.active }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-visual draft">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ draftCount }}</span>
          <span class="stat-title">{{ t.drafts }}</span>
        </div>
        <div class="stat-trend neutral" v-if="draftCount > 0">
          <span>{{ t.pendingReview }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-visual tickets">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ formatNumber(totalTicketsSold) }}</span>
          <span class="stat-title">{{ t.ticketsSold }}</span>
        </div>
        <div class="stat-trend positive" v-if="totalTicketsSold > 0">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>{{ t.revenueActive }}</span>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="filter-group">
        <div class="filter-item">
          <label class="filter-label">{{ t.status }}</label>
          <div class="select-wrapper">
            <select v-model="filterStatus" class="filter-select">
              <option value="">{{ t.allStatus }}</option>
              <option value="draft">{{ t.draft }}</option>
              <option value="live">{{ t.live }}</option>
              <option value="closed">{{ t.closed }}</option>
            </select>
            <svg class="select-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div class="filter-item">
          <label class="filter-label">{{ t.group }}</label>
          <div class="select-wrapper">
            <select v-model="filterGroup" class="filter-select">
              <option value="">{{ t.allGroups }}</option>
              <option v-for="group in groups" :key="group.id" :value="group.id">
                {{ group.name }}
              </option>
            </select>
            <svg class="select-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="view-controls">
        <span class="results-count">{{ meta.total }} {{ eventsLabel }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <span class="loading-text">{{ t.loadingEvents }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container">
      <div class="error-state">
        <div class="error-visual">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="error-title">{{ t.unableToLoad }}</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="fetchEvents" class="btn-retry">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t.tryAgain }}
        </button>
      </div>
    </div>

    <!-- Events Content -->
    <div v-else class="events-content">
      <!-- Desktop Table -->
      <div class="table-container">
        <AdminEventTable
          v-if="events.length > 0"
          :events="events"
          :has-permission="hasPermission"
          :is-super-admin="isSuperAdmin"
          @delete="handleDelete"
          @publish="handlePublish"
          @close="handleClose"
        />
        <div v-else class="empty-state">
          <div class="empty-visual">
            <div class="empty-icon-wrapper">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="empty-decoration"></div>
          </div>
          <h3 class="empty-title">{{ t.noEventsYet }}</h3>
          <p class="empty-description">{{ t.createFirstDescription }}</p>
          <NuxtLink to="/app/admin/events/create" class="btn-create-empty">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ t.createFirstEvent }}
          </NuxtLink>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="cards-container">
        <AdminEventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          :has-permission="hasPermission"
          :is-super-admin="isSuperAdmin"
          @delete="handleDelete"
          @publish="handlePublish"
          @close="handleClose"
        />
        <div v-if="events.length === 0" class="empty-state">
          <div class="empty-visual">
            <div class="empty-icon-wrapper">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 class="empty-title">{{ t.noEventsYet }}</h3>
          <p class="empty-description">{{ t.createFirstShort }}</p>
          <NuxtLink to="/app/admin/events/create" class="btn-create-empty">
            {{ t.createEvent }}
          </NuxtLink>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="pagination">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-nav"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="page !== '...' && (currentPage = page)"
            :class="['page-btn', { active: currentPage === page, ellipsis: page === '...' }]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage = Math.min(meta.last_page, currentPage + 1)"
          :disabled="currentPage === meta.last_page"
          class="page-nav"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UiConfirmModal
      :is-open="deleteModalOpen"
      :title="t.deleteEvent"
      :message="t.deleteConfirmMessage"
      :confirm-text="t.delete"
      :cancel-text="t.cancel"
      @confirm="confirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { getEvents, deleteEvent, publishEvent, closeEvent } = useEvents()
const { getGroups } = useGroups()
const { hasPermission, isSuperAdmin } = useAuth()
const { t: createT, language } = useLanguage()

// Translations
const translations = {
  title: { es: 'Eventos', en: 'Events' },
  subtitle: { es: 'Administra tus eventos y monitorea el rendimiento', en: 'Manage your events and track performance' },
  newEvent: { es: 'Nuevo Evento', en: 'New Event' },
  totalEvents: { es: 'Total de Eventos', en: 'Total Events' },
  allTime: { es: 'Todo el tiempo', en: 'All time' },
  liveNow: { es: 'En Vivo', en: 'Live Now' },
  active: { es: 'Activo', en: 'Active' },
  drafts: { es: 'Borradores', en: 'Drafts' },
  pendingReview: { es: 'Pendiente de revisión', en: 'Pending review' },
  ticketsSold: { es: 'Boletos Vendidos', en: 'Tickets Sold' },
  revenueActive: { es: 'Ingresos activos', en: 'Revenue active' },
  status: { es: 'Estado', en: 'Status' },
  allStatus: { es: 'Todos los Estados', en: 'All Status' },
  draft: { es: 'Borrador', en: 'Draft' },
  live: { es: 'En Vivo', en: 'Live' },
  closed: { es: 'Cerrado', en: 'Closed' },
  group: { es: 'Grupo', en: 'Group' },
  allGroups: { es: 'Todos los Grupos', en: 'All Groups' },
  loadingEvents: { es: 'Cargando eventos...', en: 'Loading events...' },
  unableToLoad: { es: 'No se pueden cargar los eventos', en: 'Unable to load events' },
  tryAgain: { es: 'Intentar de nuevo', en: 'Try Again' },
  noEventsYet: { es: 'Sin eventos aún', en: 'No events yet' },
  createFirstDescription: { es: 'Crea tu primer evento para comenzar a vender boletos y gestionar asistentes.', en: 'Create your first event to start selling tickets and managing attendees.' },
  createFirstEvent: { es: 'Crea tu primer evento', en: 'Create your first event' },
  createFirstShort: { es: 'Crea tu primer evento para comenzar.', en: 'Create your first event to get started.' },
  createEvent: { es: 'Crear Evento', en: 'Create Event' },
  deleteEvent: { es: 'Eliminar Evento', en: 'Delete Event' },
  deleteConfirmMessage: { es: '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.', en: 'Are you sure you want to delete this event? This action cannot be undone.' },
  delete: { es: 'Eliminar', en: 'Delete' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  event: { es: 'evento', en: 'event' },
  events: { es: 'eventos', en: 'events' }
}

const t = createT(translations)

// Computed label for events count
const eventsLabel = computed(() => {
  if (language.value === 'es') {
    return meta.value.total === 1 ? 'evento' : 'eventos'
  }
  return meta.value.total === 1 ? 'event' : 'events'
})

const events = ref([])
const groups = ref([])
const loading = ref(true)
const error = ref('')
const deleteModalOpen = ref(false)
const eventToDelete = ref(null)
const filterStatus = ref('')
const filterGroup = ref('')
const currentPage = ref(1)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

// Computed stats
const liveCount = computed(() => events.value.filter(e => e.status === 'live').length)
const draftCount = computed(() => events.value.filter(e => e.status === 'draft').length)
const totalTicketsSold = computed(() => events.value.reduce((sum, e) => sum + (e.tickets_sold || 0), 0))

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Smart pagination
const visiblePages = computed(() => {
  const total = meta.value.last_page
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

const fetchGroups = async () => {
  try {
    const response = await getGroups()
    groups.value = response.groups || []
  } catch (e) {
    // Groups are optional for filtering
  }
}

const fetchEvents = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = {
      per_page: 15,
      page: currentPage.value
    }

    if (filterStatus.value) {
      params.status = filterStatus.value
    }

    if (filterGroup.value) {
      params.group_id = filterGroup.value
    }

    const response = await getEvents(params)
    events.value = response.events || []
    meta.value = response.meta || meta.value
  } catch (e) {
    error.value = e.message || 'Failed to load events'
  } finally {
    loading.value = false
  }
}

const handleDelete = (slug) => {
  eventToDelete.value = slug
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (eventToDelete.value) {
    try {
      await deleteEvent(eventToDelete.value)
      fetchEvents()
    } catch (e) {
      error.value = e.message || 'Failed to delete event'
    }
    deleteModalOpen.value = false
    eventToDelete.value = null
  }
}

const handlePublish = async (slug) => {
  try {
    await publishEvent(slug)
    fetchEvents()
  } catch (e) {
    error.value = e.message || 'Failed to publish event'
  }
}

const handleClose = async (slug) => {
  try {
    await closeEvent(slug)
    fetchEvents()
  } catch (e) {
    error.value = e.message || 'Failed to close event'
  }
}

// Watch for filter changes
watch([filterStatus, filterGroup], () => {
  currentPage.value = 1
  fetchEvents()
})

watch(currentPage, () => {
  fetchEvents()
})

onMounted(() => {
  fetchGroups()
  fetchEvents()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.events-dashboard {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Refined neutral palette */
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;
  --color-text: #09090b;
  --color-text-secondary: #3f3f46;
  --color-text-tertiary: #71717a;
  --color-text-muted: #a1a1aa;
  --color-border: #e4e4e7;
  --color-border-subtle: #f4f4f5;
  --color-hover: rgba(0, 0, 0, 0.02);

  /* Accent colors */
  --color-primary: #18181b;
  --color-primary-hover: #27272a;
  --color-accent: #6366f1;
  --color-accent-subtle: rgba(99, 102, 241, 0.08);

  /* Status colors */
  --color-success: #22c55e;
  --color-success-subtle: rgba(34, 197, 94, 0.1);
  --color-warning: #f59e0b;
  --color-warning-subtle: rgba(245, 158, 11, 0.1);
  --color-danger: #ef4444;
  --color-danger-subtle: rgba(239, 68, 68, 0.1);

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);

  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title-group h1 {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.header-badge {
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  background: var(--color-border-subtle);
  border-radius: 6px;
}

.header-subtitle {
  font-size: 14px;
  color: var(--color-text-tertiary);
  line-height: 1.5;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-create:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.btn-icon svg {
  width: 14px;
  height: 14px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
}

.stat-card:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.stat-visual {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.stat-visual svg {
  width: 18px;
  height: 18px;
  position: relative;
  z-index: 1;
}

.stat-visual.total {
  background: linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%);
  color: var(--color-text-secondary);
}

.stat-visual.live {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
}

.stat-visual.draft {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.stat-visual.tickets {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  color: #7c3aed;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.3);
  animation: pulse-out 2s ease-out infinite;
}

@keyframes pulse-out {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.stat-number.live {
  color: #16a34a;
}

.stat-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-tertiary);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border-subtle);
  font-size: 11px;
  font-weight: 500;
}

.stat-trend svg {
  width: 12px;
  height: 12px;
}

.stat-trend.positive {
  color: #16a34a;
}

.stat-trend.neutral {
  color: var(--color-text-muted);
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 10px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  max-width: 160px;
}

.filter-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.select-wrapper {
  position: relative;
}

.filter-select {
  width: 100%;
  padding: 8px 32px 8px 12px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  appearance: none;
  transition: all 0.15s ease;
}

.filter-select:hover {
  border-color: var(--color-text-muted);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

.select-chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.view-controls {
  display: flex;
  align-items: center;
}

.results-count {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* State Container */
.state-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 80px 20px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  animation-duration: 0.8s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  animation-duration: 0.6s;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-visual {
  width: 56px;
  height: 56px;
  background: var(--color-danger-subtle);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.error-visual svg {
  width: 28px;
  height: 28px;
  color: var(--color-danger);
}

.error-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.error-message {
  font-size: 14px;
  color: var(--color-text-tertiary);
  margin-bottom: 20px;
  max-width: 300px;
}

.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-retry:hover {
  background: var(--color-hover);
  border-color: var(--color-text-muted);
}

.btn-retry svg {
  width: 14px;
  height: 14px;
}

/* Events Content */
.events-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}

.table-container {
  display: none;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
  text-align: center;
}

.empty-visual {
  position: relative;
  margin-bottom: 20px;
}

.empty-icon-wrapper {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--color-border-subtle) 0%, var(--color-border) 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon-wrapper svg {
  width: 32px;
  height: 32px;
  color: var(--color-text-muted);
}

.empty-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(circle at 50% 50%, var(--color-accent-subtle) 0%, transparent 60%);
  filter: blur(20px);
  transform: translateY(10px);
  z-index: -1;
}

.empty-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 6px;
}

.empty-description {
  font-size: 14px;
  color: var(--color-text-tertiary);
  margin-bottom: 24px;
  max-width: 280px;
  line-height: 1.5;
}

.btn-create-empty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-create-empty:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-create-empty svg {
  width: 16px;
  height: 16px;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  border-top: 1px solid var(--color-border-subtle);
}

.page-nav {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-nav:hover:not(:disabled) {
  border-color: var(--color-text-muted);
  color: var(--color-text);
}

.page-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-nav svg {
  width: 14px;
  height: 14px;
}

.page-numbers {
  display: flex;
  gap: 4px;
  margin: 0 8px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  color: var(--color-text-tertiary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(.active):not(.ellipsis) {
  background: var(--color-hover);
  border-color: var(--color-border);
}

.page-btn.active {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}

.page-btn.ellipsis {
  cursor: default;
  color: var(--color-text-muted);
}

/* Tablet */
@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .toolbar {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .filter-item {
    flex: none;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .header-title-group h1 {
    font-size: 30px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-number {
    font-size: 28px;
  }

  .table-container {
    display: block;
  }

  .cards-container {
    display: none;
  }
}
</style>
