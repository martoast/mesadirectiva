<template>
  <div class="events-page">
    <!-- Floating Action Button (Mobile) -->
    <NuxtLink to="/app/admin/events/create" class="fab-create" aria-label="Create new event">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </NuxtLink>

    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-title-row">
          <h1>{{ t.title }}</h1>
          <span class="event-count">{{ meta.total }}</span>
        </div>
        <p class="header-description">{{ t.subtitle }}</p>
      </div>
      <NuxtLink to="/app/admin/events/create" class="btn-create">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        <span>{{ t.newEvent }}</span>
      </NuxtLink>
    </header>

    <!-- Stats Overview -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ meta.total }}</span>
        <span class="stat-label">{{ t.totalEvents }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value stat-live">{{ liveCount }}</span>
        <span class="stat-label">{{ t.liveNow }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ draftCount }}</span>
        <span class="stat-label">{{ t.drafts }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ formatNumber(totalTicketsSold) }}</span>
        <span class="stat-label">{{ t.ticketsSold }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-group">
        <div class="filter-item">
          <label>{{ t.status }}</label>
          <div class="select-wrapper">
            <select v-model="filterStatus">
              <option value="">{{ t.allStatus }}</option>
              <option value="draft">{{ t.draft }}</option>
              <option value="live">{{ t.live }}</option>
              <option value="closed">{{ t.closed }}</option>
            </select>
            <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div class="filter-item">
          <label>{{ t.group }}</label>
          <div class="select-wrapper">
            <select v-model="filterGroup">
              <option value="">{{ t.allGroups }}</option>
              <option v-for="group in groups" :key="group.id" :value="group.id">
                {{ group.name }}
              </option>
            </select>
            <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      <span class="results-text">{{ meta.total }} {{ eventsLabel }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-state">
        <div class="loader"></div>
        <span>{{ t.loadingEvents }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container">
      <div class="error-state">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3>{{ t.unableToLoad }}</h3>
        <p>{{ error }}</p>
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
      <!-- Empty State -->
      <div v-if="events.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3>{{ t.noEventsYet }}</h3>
        <p>{{ t.createFirstDescription }}</p>
        <NuxtLink to="/app/admin/events/create" class="btn-create-first">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ t.createFirstEvent }}
        </NuxtLink>
      </div>

      <!-- Desktop Table View -->
      <div v-else class="table-view">
        <AdminEventTable
          :events="events"
          :has-permission="hasPermission"
          :is-super-admin="isSuperAdmin"
          @delete="handleDelete"
          @publish="handlePublish"
          @close="handleClose"
        />
      </div>

      <!-- Mobile Card View -->
      <div v-if="events.length > 0" class="cards-view">
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
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="pagination">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn page-nav"
          aria-label="Previous page"
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
          class="page-btn page-nav"
          aria-label="Next page"
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
  totalEvents: { es: 'Total', en: 'Total' },
  liveNow: { es: 'En Vivo', en: 'Live' },
  drafts: { es: 'Borradores', en: 'Drafts' },
  ticketsSold: { es: 'Vendidos', en: 'Sold' },
  status: { es: 'Estado', en: 'Status' },
  allStatus: { es: 'Todos', en: 'All' },
  draft: { es: 'Borrador', en: 'Draft' },
  live: { es: 'En Vivo', en: 'Live' },
  closed: { es: 'Cerrado', en: 'Closed' },
  group: { es: 'Grupo', en: 'Group' },
  allGroups: { es: 'Todos', en: 'All' },
  loadingEvents: { es: 'Cargando eventos...', en: 'Loading events...' },
  unableToLoad: { es: 'No se pueden cargar los eventos', en: 'Unable to load events' },
  tryAgain: { es: 'Intentar de nuevo', en: 'Try Again' },
  noEventsYet: { es: 'Sin eventos aún', en: 'No events yet' },
  createFirstDescription: { es: 'Crea tu primer evento para comenzar a vender boletos y gestionar asistentes.', en: 'Create your first event to start selling tickets and managing attendees.' },
  createFirstEvent: { es: 'Crea tu primer evento', en: 'Create your first event' },
  deleteEvent: { es: 'Eliminar Evento', en: 'Delete Event' },
  deleteConfirmMessage: { es: '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.', en: 'Are you sure you want to delete this event? This action cannot be undone.' },
  delete: { es: 'Eliminar', en: 'Delete' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  event: { es: 'evento', en: 'event' },
  events: { es: 'eventos', en: 'events' }
}

const t = createT(translations)

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
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

.events-page {
  /* Japanese-inspired palette */
  --color-paper: #faf9f7;
  --color-ink: #1a1a1a;
  --color-ink-light: #4a4a4a;
  --color-ink-lighter: #7a7a7a;
  --color-ink-muted: #a8a8a8;
  --color-stone: #e8e6e3;
  --color-stone-dark: #d4d2cf;
  --color-bamboo: #2d5a27;
  --color-vermillion: #c73e1d;
  --color-indigo: #264653;

  /* Semantic colors */
  --color-surface: #ffffff;
  --color-border: #e8e6e3;
  --color-border-subtle: #f2f1ef;
  --color-hover: rgba(26, 26, 26, 0.03);
  --color-success: #2d5a27;
  --color-success-subtle: rgba(45, 90, 39, 0.08);
  --color-warning: #b45309;
  --color-warning-subtle: rgba(180, 83, 9, 0.08);
  --color-danger: #c73e1d;
  --color-danger-subtle: rgba(199, 62, 29, 0.08);

  /* Typography */
  --font-display: 'Zen Maru Gothic', 'Noto Sans JP', system-ui, sans-serif;
  --font-body: 'Noto Sans JP', system-ui, sans-serif;

  /* Spacing - generous Ma */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Shadows - subtle, soft */
  --shadow-sm: 0 1px 2px rgba(26, 26, 26, 0.04);
  --shadow-md: 0 2px 8px rgba(26, 26, 26, 0.06);
  --shadow-lg: 0 4px 16px rgba(26, 26, 26, 0.08);

  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  min-height: 100vh;
  padding-bottom: 100px;
}

/* ========================================
   Floating Action Button (Mobile)
   ======================================== */
.fab-create {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: var(--color-ink);
  color: white;
  border-radius: 16px;
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(26, 26, 26, 0.1);
  z-index: 100;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-create svg {
  width: 24px;
  height: 24px;
}

.fab-create:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg), 0 8px 24px rgba(26, 26, 26, 0.15);
}

.fab-create:active {
  transform: scale(0.98);
}

@media (min-width: 640px) {
  .fab-create {
    display: none;
  }
}

/* ========================================
   Header
   ======================================== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.header-title-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
}

.header-title-row h1 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.event-count {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink-muted);
  padding: 2px 10px;
  background: var(--color-border-subtle);
  border-radius: 20px;
}

.header-description {
  font-size: 14px;
  color: var(--color-ink-lighter);
  line-height: 1.5;
}

.btn-create {
  display: none;
  align-items: center;
  gap: var(--space-sm);
  padding: 12px 20px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--color-ink);
  border: none;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm);
}

.btn-create svg {
  width: 18px;
  height: 18px;
}

.btn-create:hover {
  background: var(--color-ink-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .btn-create {
    display: inline-flex;
  }
}

@media (min-width: 768px) {
  .header-title-row h1 {
    font-size: 32px;
  }
}

/* ========================================
   Stats Row
   ======================================== */
.stats-row {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  margin-bottom: var(--space-lg);
  overflow-x: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 60px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-value.stat-live {
  color: var(--color-success);
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-ink-muted);
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .stats-row {
    gap: var(--space-xl);
  }

  .stat-value {
    font-size: 28px;
  }
}

/* ========================================
   Filters Bar
   ======================================== */
.filters-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.filter-group {
  display: flex;
  gap: var(--space-sm);
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  max-width: 140px;
}

.filter-item label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  padding: 10px 32px 10px 12px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  appearance: none;
  transition: all 0.15s ease;
}

.select-wrapper select:hover {
  border-color: var(--color-stone-dark);
}

.select-wrapper select:focus {
  outline: none;
  border-color: var(--color-ink-light);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.select-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--color-ink-muted);
  pointer-events: none;
}

.results-text {
  font-size: 13px;
  color: var(--color-ink-lighter);
}

@media (min-width: 640px) {
  .filters-bar {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .filter-item {
    flex: none;
    min-width: 120px;
  }
}

/* ========================================
   State Containers
   ======================================== */
.state-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 80px var(--space-xl);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.loader {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-ink);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state span {
  font-size: 14px;
  color: var(--color-ink-lighter);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  background: var(--color-danger-subtle);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.error-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-danger);
}

.error-state h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-ink);
  margin-bottom: var(--space-xs);
}

.error-state p {
  font-size: 14px;
  color: var(--color-ink-lighter);
  margin-bottom: var(--space-lg);
  max-width: 280px;
}

.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 16px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-retry svg {
  width: 14px;
  height: 14px;
}

.btn-retry:hover {
  background: var(--color-hover);
  border-color: var(--color-stone-dark);
}

/* ========================================
   Events Content
   ======================================== */
.events-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px var(--space-xl);
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: var(--color-border-subtle);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
}

.empty-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-ink-muted);
}

.empty-state h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  font-size: 14px;
  color: var(--color-ink-lighter);
  margin-bottom: var(--space-xl);
  max-width: 280px;
  line-height: 1.5;
}

.btn-create-first {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 14px 24px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--color-ink);
  border: none;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm);
}

.btn-create-first svg {
  width: 18px;
  height: 18px;
}

.btn-create-first:hover {
  background: var(--color-ink-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Table View (Desktop) */
.table-view {
  display: none;
}

/* Cards View (Mobile) */
.cards-view {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--color-border-subtle);
}

@media (min-width: 768px) {
  .table-view {
    display: block;
  }

  .cards-view {
    display: none;
  }
}

/* ========================================
   Pagination
   ======================================== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border-subtle);
  background: var(--color-surface);
}

.page-numbers {
  display: flex;
  gap: var(--space-xs);
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-lighter);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(.active):not(.ellipsis):not(:disabled) {
  background: var(--color-hover);
  border-color: var(--color-border);
}

.page-btn.active {
  background: var(--color-ink);
  color: white;
  font-weight: 600;
}

.page-btn.ellipsis {
  cursor: default;
  color: var(--color-ink-muted);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.page-nav {
  border: 1px solid var(--color-border);
}

.page-btn.page-nav svg {
  width: 14px;
  height: 14px;
}

.page-btn.page-nav:hover:not(:disabled) {
  border-color: var(--color-stone-dark);
  color: var(--color-ink);
}
</style>
