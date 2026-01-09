<template>
  <div class="event-dashboard">
    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <span>{{ t.loadingEvent }}</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">!</div>
      <p>{{ error }}</p>
      <button @click="fetchEvent" class="retry-btn">{{ t.tryAgain }}</button>
    </div>

    <!-- Content -->
    <template v-else-if="event">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/app/admin/events">{{ t.events }}</NuxtLink>
        <span class="sep">/</span>
        <span class="current">{{ event.name }}</span>
      </nav>

      <!-- Header -->
      <header class="event-header">
        <div class="header-main">
          <div class="title-row">
            <h1>{{ event.name }}</h1>
            <div class="badges">
              <span :class="['status-badge', event.status]">
                {{ event.status }}
              </span>
              <span v-if="event.group" class="group-badge" :style="{ '--accent': event.group.color }">
                {{ event.group.name }}
              </span>
            </div>
          </div>
          <div class="meta-row">
            <div class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span>{{ formatEventDate(event.starts_at) }}</span>
            </div>
            <div class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>{{ formatEventTime(event.starts_at) }}</span>
            </div>
            <div class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ formatLocationShort() }}</span>
            </div>
            <span class="type-tag">
              {{ event.seating_type === 'seated' ? t.seated : t.generalAdmission }}
            </span>
          </div>
        </div>
        <div class="header-actions">
          <NuxtLink :to="`/app/events/${event.slug}`" target="_blank" class="btn-ghost">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            {{ t.preview }}
          </NuxtLink>
          <NuxtLink :to="`/app/admin/events/${event.slug}/edit`" class="btn-secondary">
            {{ t.editEvent }}
          </NuxtLink>
          <button
            v-if="event.status === 'draft' && isSetupComplete"
            @click="handlePublish"
            :disabled="actionLoading"
            class="btn-primary"
          >
            {{ actionLoading ? t.publishing : t.publishEvent }}
          </button>
          <button
            v-if="event.status === 'live'"
            @click="handleClose"
            :disabled="actionLoading"
            class="btn-warning"
          >
            {{ actionLoading ? t.closing : t.closeEvent }}
          </button>
          <button @click="handleDelete" class="btn-icon danger" :title="t.deleteEvent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Setup Progress -->
      <div class="progress-section">
        <div class="progress-steps">
          <div class="step completed">
            <div class="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="step-content">
              <span class="step-label">{{ t.eventCreated }}</span>
              <span class="step-desc">{{ t.basicInfoSaved }}</span>
            </div>
          </div>

          <div class="step-connector" :class="{ active: isSetupComplete }"></div>

          <div :class="['step', isSetupComplete ? 'completed' : 'pending']">
            <div class="step-icon">
              <svg v-if="isSetupComplete" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span v-else class="step-number">2</span>
            </div>
            <div class="step-content">
              <span class="step-label">{{ event.seating_type === 'seated' ? t.tablesAndSeats : t.ticketPricing }}</span>
              <span class="step-desc">{{ isSetupComplete ? t.configured : t.actionRequired }}</span>
            </div>
          </div>

          <div class="step-connector" :class="{ active: event.status === 'live' }"></div>

          <div :class="['step', event.status === 'live' ? 'completed' : (isSetupComplete ? 'ready' : 'locked')]">
            <div class="step-icon">
              <svg v-if="event.status === 'live'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span v-else class="step-number">3</span>
            </div>
            <div class="step-content">
              <span class="step-label">{{ event.status === 'live' ? t.published : t.readyToPublish }}</span>
              <span class="step-desc">{{ event.status === 'live' ? t.eventIsLive : (isSetupComplete ? t.clickPublishAbove : t.completeStep2First) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Setup Required Alert -->
      <div v-if="!isSetupComplete" class="setup-alert">
        <div class="alert-content">
          <div class="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="alert-text">
            <h3>{{ event.seating_type === 'seated' ? t.setupTables : t.addTicketPricing }}</h3>
            <p v-if="event.seating_type === 'seated'">
              {{ t.setupTablesDesc }}
            </p>
            <p v-else>
              {{ t.addTicketTiersDesc }}
            </p>
          </div>
        </div>
        <NuxtLink
          :to="event.seating_type === 'seated'
            ? `/app/admin/events/${event.slug}/tables`
            : `/app/admin/events/${event.slug}/tiers`"
          class="alert-action"
        >
          {{ event.seating_type === 'seated' ? t.setUpTablesBtn : t.addTicketTiersBtn }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Main Grid -->
      <div class="main-grid">
        <!-- Left Column -->
        <div class="col-main">
          <!-- Event Card -->
          <div class="event-card">
            <div v-if="event.image_url" class="event-image">
              <img :src="event.image_url" :alt="event.name" />
            </div>
            <div class="event-body">
              <h2 class="section-title">{{ t.about }}</h2>
              <p class="event-description">{{ event.description || t.noDescription }}</p>

              <div v-if="event.organizer_name" class="organizer">
                <span class="label">{{ t.organizedBy }}</span>
                <span class="value">{{ event.organizer_name }}</span>
              </div>
            </div>
          </div>

          <!-- Gallery Preview -->
          <div v-if="event.media?.images?.length" class="gallery-card">
            <h2 class="section-title">{{ t.gallery }}</h2>
            <div class="gallery-preview">
              <div
                v-for="(img, i) in event.media.images.slice(0, 4)"
                :key="i"
                class="gallery-thumb"
              >
                <img :src="img.url" :alt="`Gallery ${i + 1}`" />
              </div>
              <div v-if="event.media.images.length > 4" class="gallery-more">
                +{{ event.media.images.length - 4 }}
              </div>
            </div>
          </div>

          <!-- Event Details -->
          <div class="details-card">
            <h2 class="section-title">{{ t.eventDetails }}</h2>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">{{ t.start }}</span>
                <span class="value">{{ formatEventDateTime(event.starts_at) }}</span>
              </div>
              <div v-if="event.ends_at" class="detail-item">
                <span class="label">{{ t.end }}</span>
                <span class="value">{{ formatEventDateTime(event.ends_at) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ t.timezone }}</span>
                <span class="value">{{ event.timezone || 'America/Mexico_City' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ t.location }}</span>
                <span class="value">{{ formatLocationDisplay() }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ t.visibility }}</span>
                <span :class="['value', event.is_private ? 'muted' : 'success']">
                  {{ event.is_private ? t.private : t.public }}
                </span>
              </div>
              <div v-if="event.seating_type === 'seated'" class="detail-item">
                <span class="label">{{ t.reservationHold }}</span>
                <span class="value">{{ event.reservation_minutes || 15 }} {{ t.minutes }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-side">
          <!-- Stats Card -->
          <div class="stats-card">
            <h2 class="section-title">{{ t.salesOverview }}</h2>
            <div class="stat-hero">
              <span class="stat-value">{{ event.seating_type === 'seated' ? soldSeats : (event.tickets_sold || 0) }}</span>
              <span class="stat-label">{{ event.seating_type === 'seated' ? t.seatsSold : t.ticketsSold }}</span>
            </div>
            <div class="stat-row">
              <div class="stat-item">
                <span class="stat-num success">{{ event.seating_type === 'seated' ? availableSeats : (event.tickets_available || 0) }}</span>
                <span class="stat-lbl">{{ t.available }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-num">${{ (event.total_revenue || 0).toLocaleString() }}</span>
                <span class="stat-lbl">{{ t.revenue }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="actions-card">
            <h2 class="section-title">{{ t.manage }}</h2>
            <div class="action-links">
              <NuxtLink
                :to="event.seating_type === 'seated'
                  ? `/app/admin/events/${event.slug}/tables`
                  : `/app/admin/events/${event.slug}/tiers`"
                class="action-link"
              >
                <div class="action-icon">
                  <svg v-if="event.seating_type === 'seated'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                  </svg>
                </div>
                <div class="action-text">
                  <span class="action-title">{{ event.seating_type === 'seated' ? t.tablesAndSeats : t.ticketTiers }}</span>
                  <span class="action-desc">
                    {{ event.seating_type === 'seated'
                      ? `${tables.length} ${t.tables} · ${totalSeats} ${t.seats}`
                      : `${event.active_ticket_tiers?.length || 0} ${t.activeTiers}`
                    }}
                  </span>
                </div>
                <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </NuxtLink>

              <NuxtLink
                v-if="event.seating_type === 'seated'"
                :to="`/app/admin/events/${event.slug}/floor-plan`"
                class="action-link"
              >
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                </div>
                <div class="action-text">
                  <span class="action-title">{{ t.floorPlanEditor }}</span>
                  <span class="action-desc">{{ t.arrangeTableLayout }}</span>
                </div>
                <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </NuxtLink>

              <NuxtLink :to="`/app/events/${event.slug}`" target="_blank" class="action-link external">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </div>
                <div class="action-text">
                  <span class="action-title">{{ t.publicEventPage }}</span>
                  <span class="action-desc">{{ t.viewAsAttendees }}</span>
                </div>
                <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Delete Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteModalOpen" class="modal-backdrop" @click.self="deleteModalOpen = false">
          <div class="modal-box">
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </div>
            <h3>{{ t.deleteEvent }}</h3>
            <p>{{ t.deleteConfirm }} "{{ event.name }}" {{ t.andAllData }}</p>
            <div class="modal-buttons">
              <button @click="deleteModalOpen = false" class="btn-secondary">{{ t.cancel }}</button>
              <button @click="confirmDelete" class="btn-danger">{{ t.deleteEvent }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatLocation, getPlatformLabel } from '~/utils/location'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { t: createT, language } = useLanguage()

// Translations
const translations = {
  loadingEvent: { es: 'Cargando evento...', en: 'Loading event...' },
  tryAgain: { es: 'Intentar de Nuevo', en: 'Try Again' },
  events: { es: 'Eventos', en: 'Events' },
  preview: { es: 'Vista Previa', en: 'Preview' },
  editEvent: { es: 'Editar Evento', en: 'Edit Event' },
  publishEvent: { es: 'Publicar Evento', en: 'Publish Event' },
  publishing: { es: 'Publicando...', en: 'Publishing...' },
  closeEvent: { es: 'Cerrar Evento', en: 'Close Event' },
  closing: { es: 'Cerrando...', en: 'Closing...' },
  seated: { es: 'Con Asientos', en: 'Seated' },
  generalAdmission: { es: 'Admisión General', en: 'General Admission' },
  eventCreated: { es: 'Evento Creado', en: 'Event Created' },
  basicInfoSaved: { es: 'Información básica guardada', en: 'Basic info saved' },
  tablesAndSeats: { es: 'Mesas y Asientos', en: 'Tables & Seats' },
  ticketPricing: { es: 'Precios de Boletos', en: 'Ticket Pricing' },
  configured: { es: 'Configurado', en: 'Configured' },
  actionRequired: { es: 'Acción requerida', en: 'Action required' },
  published: { es: 'Publicado', en: 'Published' },
  readyToPublish: { es: 'Listo para Publicar', en: 'Ready to Publish' },
  eventIsLive: { es: 'El evento está en vivo', en: 'Event is live' },
  clickPublishAbove: { es: 'Haz clic en publicar arriba', en: 'Click publish above' },
  completeStep2First: { es: 'Completa el paso 2 primero', en: 'Complete step 2 first' },
  setupTables: { es: 'Configura tus mesas', en: 'Set up your tables' },
  addTicketPricing: { es: 'Agrega precios de boletos', en: 'Add ticket pricing' },
  setupTablesDesc: { es: 'Configura las mesas y asientos antes de publicar este evento y comenzar a vender.', en: 'Configure tables and seating before you can publish this event and start selling.' },
  addTicketTiersDesc: { es: 'Crea al menos un nivel de boletos con precios antes de publicar este evento.', en: 'Create at least one ticket tier with pricing before you can publish this event.' },
  setUpTablesBtn: { es: 'Configurar Mesas', en: 'Set Up Tables' },
  addTicketTiersBtn: { es: 'Agregar Niveles de Boletos', en: 'Add Ticket Tiers' },
  about: { es: 'Acerca de', en: 'About' },
  noDescription: { es: 'Sin descripción.', en: 'No description provided.' },
  organizedBy: { es: 'Organizado por', en: 'Organized by' },
  gallery: { es: 'Galería', en: 'Gallery' },
  eventDetails: { es: 'Detalles del Evento', en: 'Event Details' },
  start: { es: 'Inicio', en: 'Start' },
  end: { es: 'Fin', en: 'End' },
  timezone: { es: 'Zona Horaria', en: 'Timezone' },
  location: { es: 'Ubicación', en: 'Location' },
  visibility: { es: 'Visibilidad', en: 'Visibility' },
  private: { es: 'Privado', en: 'Private' },
  public: { es: 'Público', en: 'Public' },
  reservationHold: { es: 'Tiempo de Reserva', en: 'Reservation Hold' },
  minutes: { es: 'minutos', en: 'minutes' },
  salesOverview: { es: 'Resumen de Ventas', en: 'Sales Overview' },
  seatsSold: { es: 'Asientos Vendidos', en: 'Seats Sold' },
  ticketsSold: { es: 'Boletos Vendidos', en: 'Tickets Sold' },
  available: { es: 'Disponibles', en: 'Available' },
  revenue: { es: 'Ingresos', en: 'Revenue' },
  manage: { es: 'Administrar', en: 'Manage' },
  ticketTiers: { es: 'Niveles de Boletos', en: 'Ticket Tiers' },
  tables: { es: 'mesas', en: 'tables' },
  seats: { es: 'asientos', en: 'seats' },
  activeTiers: { es: 'niveles activos', en: 'active tiers' },
  floorPlanEditor: { es: 'Editor de Plano', en: 'Floor Plan Editor' },
  arrangeTableLayout: { es: 'Organiza el diseño de mesas visualmente', en: 'Arrange table layout visually' },
  publicEventPage: { es: 'Página Pública del Evento', en: 'Public Event Page' },
  viewAsAttendees: { es: 'Ver como lo ven los asistentes', en: 'View as attendees see it' },
  deleteEvent: { es: 'Eliminar Evento', en: 'Delete Event' },
  deleteConfirm: { es: 'Esto eliminará permanentemente', en: 'This will permanently delete' },
  andAllData: { es: 'y todos los datos asociados. Esto no se puede deshacer.', en: 'and all associated data. This cannot be undone.' },
  cancel: { es: 'Cancelar', en: 'Cancel' }
}

const t = createT(translations)

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

// Computed
const isSetupComplete = computed(() => {
  if (!event.value) return false
  if (event.value.seating_type === 'seated') {
    return tables.value.length > 0
  }
  return (event.value.active_ticket_tiers?.length || 0) > 0
})

const totalSeats = computed(() => {
  return tables.value.reduce((total, table) => {
    if (table.sell_as_whole) return total + table.capacity
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

// Methods
const fetchEvent = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await getEvent(route.params.slug)
    event.value = response.event
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

const formatEventDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatEventTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatEventDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatLocationShort = () => {
  if (!event.value) return '—'
  if (event.value.location_type === 'online') {
    return getPlatformLabel(event.value.location?.platform) || 'Online'
  }
  return event.value.location?.name || event.value.location?.city || '—'
}

const formatLocationDisplay = () => {
  if (!event.value) return '—'
  if (event.value.location_type === 'online') {
    return getPlatformLabel(event.value.location?.platform) || 'Online Event'
  }
  const loc = event.value.location
  if (!loc) return '—'
  const parts = [loc.name, loc.address, loc.city, loc.state].filter(Boolean)
  return parts.join(', ') || '—'
}

const handlePublish = async () => {
  actionLoading.value = true
  try {
    await publishEvent(event.value.slug)
    await fetchEvent()
  } catch (e) {
    error.value = e.message || 'Failed to publish'
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
    error.value = e.message || 'Failed to close'
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
    error.value = e.message || 'Failed to delete'
  }
  deleteModalOpen.value = false
}

onMounted(fetchEvent)
</script>

<style scoped>
.event-dashboard {
  --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --mono: 'SF Mono', 'Fira Code', monospace;

  --gray-50: #fafafa;
  --gray-100: #f4f4f5;
  --gray-200: #e4e4e7;
  --gray-300: #d4d4d8;
  --gray-400: #a1a1aa;
  --gray-500: #71717a;
  --gray-600: #52525b;
  --gray-700: #3f3f46;
  --gray-800: #27272a;
  --gray-900: #18181b;

  --indigo: #6366f1;
  --indigo-dark: #4f46e5;
  --indigo-light: #eef2ff;

  --amber: #f59e0b;
  --amber-light: #fef3c7;
  --amber-dark: #d97706;

  --emerald: #10b981;
  --emerald-light: #d1fae5;

  --red: #ef4444;
  --red-light: #fee2e2;

  font-family: var(--font);
  background: var(--gray-50);
  min-height: 100vh;
  padding: 24px 32px;
  max-width: 1280px;
  margin: 0 auto;
}

/* Loading & Error */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: var(--gray-500);
}

.loader {
  width: 32px;
  height: 32px;
  border: 2px solid var(--gray-200);
  border-top-color: var(--indigo);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-icon {
  width: 48px;
  height: 48px;
  background: var(--red-light);
  color: var(--red);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
}

.retry-btn {
  padding: 10px 20px;
  background: var(--gray-900);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 20px;
}

.breadcrumb a {
  color: var(--gray-500);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--gray-700);
}

.breadcrumb .sep {
  color: var(--gray-300);
}

.breadcrumb .current {
  color: var(--gray-700);
  font-weight: 500;
}

/* Header */
.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.header-main {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.title-row h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.badges {
  display: flex;
  gap: 8px;
}

.status-badge {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
}

.status-badge.draft {
  background: var(--amber-light);
  color: var(--amber-dark);
}

.status-badge.live {
  background: var(--emerald-light);
  color: var(--emerald);
}

.status-badge.closed {
  background: var(--gray-100);
  color: var(--gray-500);
}

.group-badge {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  background: color-mix(in srgb, var(--accent) 15%, white);
  color: var(--accent);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--gray-600);
}

.meta-item svg {
  width: 16px;
  height: 16px;
  color: var(--gray-400);
}

.type-tag {
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  background: var(--gray-100);
  color: var(--gray-600);
  border-radius: 4px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Buttons */
.btn-ghost, .btn-secondary, .btn-primary, .btn-warning, .btn-danger, .btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-family: var(--font);
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-ghost {
  background: transparent;
  color: var(--gray-600);
}

.btn-ghost:hover {
  background: var(--gray-100);
}

.btn-ghost svg {
  width: 16px;
  height: 16px;
}

.btn-secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.btn-primary {
  background: var(--indigo);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--indigo-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-warning {
  background: var(--amber);
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: var(--amber-dark);
}

.btn-icon {
  padding: 8px;
  background: transparent;
  color: var(--gray-400);
}

.btn-icon:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.btn-icon.danger:hover {
  background: var(--red-light);
  color: var(--red);
}

.btn-icon svg {
  width: 18px;
  height: 18px;
}

/* Progress Steps */
.progress-section {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.progress-steps {
  display: flex;
  align-items: center;
  gap: 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
}

.step.completed .step-icon {
  background: var(--emerald);
  color: white;
}

.step.completed .step-icon svg {
  width: 16px;
  height: 16px;
}

.step.pending .step-icon {
  background: var(--amber-light);
  color: var(--amber-dark);
}

.step.ready .step-icon {
  background: var(--indigo-light);
  color: var(--indigo);
}

.step.locked .step-icon {
  background: var(--gray-100);
  color: var(--gray-400);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-800);
}

.step-desc {
  font-size: 12px;
  color: var(--gray-500);
}

.step.pending .step-desc {
  color: var(--amber-dark);
}

.step-connector {
  flex: 0 0 40px;
  height: 2px;
  background: var(--gray-200);
  margin: 0 8px;
}

.step-connector.active {
  background: var(--emerald);
}

/* Setup Alert */
.setup-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fcd34d;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.alert-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--amber);
}

.alert-icon svg {
  width: 22px;
  height: 22px;
}

.alert-text h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 4px 0;
}

.alert-text p {
  font-size: 13px;
  color: var(--gray-600);
  margin: 0;
  max-width: 400px;
}

.alert-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--gray-900);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  flex-shrink: 0;
  transition: background 0.15s;
}

.alert-action:hover {
  background: var(--gray-800);
}

.alert-action svg {
  width: 18px;
  height: 18px;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.col-main, .col-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Section Title */
.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-400);
  margin: 0 0 16px 0;
}

/* Event Card */
.event-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
}

.event-image {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-body {
  padding: 24px;
}

.event-description {
  font-size: 14px;
  line-height: 1.7;
  color: var(--gray-600);
  margin: 0;
  white-space: pre-wrap;
}

.organizer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--gray-100);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.organizer .label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-400);
}

.organizer .value {
  font-size: 14px;
  color: var(--gray-700);
}

/* Gallery Card */
.gallery-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
}

.gallery-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.gallery-thumb {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-more {
  aspect-ratio: 1;
  border-radius: 8px;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-500);
}

/* Details Card */
.details-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-400);
}

.detail-item .value {
  font-size: 14px;
  color: var(--gray-700);
}

.detail-item .value.success {
  color: var(--emerald);
}

.detail-item .value.muted {
  color: var(--gray-400);
}

/* Stats Card */
.stats-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
}

.stat-hero {
  text-align: center;
  padding-bottom: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--gray-100);
}

.stat-value {
  display: block;
  font-family: var(--mono);
  font-size: 48px;
  font-weight: 600;
  color: var(--indigo);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-num {
  display: block;
  font-family: var(--mono);
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 2px;
}

.stat-num.success {
  color: var(--emerald);
}

.stat-lbl {
  font-size: 11px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Actions Card */
.actions-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
}

.action-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--gray-50);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s;
}

.action-link:hover {
  background: var(--gray-100);
}

.action-link.external:hover {
  background: var(--indigo-light);
}

.action-icon {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon svg {
  width: 20px;
  height: 20px;
  color: var(--gray-500);
}

.action-link.external .action-icon {
  border-color: var(--indigo);
}

.action-link.external .action-icon svg {
  color: var(--indigo);
}

.action-text {
  flex: 1;
  min-width: 0;
}

.action-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
}

.action-desc {
  display: block;
  font-size: 12px;
  color: var(--gray-500);
}

.action-arrow {
  width: 18px;
  height: 18px;
  color: var(--gray-300);
  flex-shrink: 0;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-box {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-box .modal-icon {
  width: 56px;
  height: 56px;
  background: var(--red-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--red);
}

.modal-box .modal-icon svg {
  width: 26px;
  height: 26px;
}

.modal-box h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 8px 0;
}

.modal-box p {
  font-size: 14px;
  color: var(--gray-600);
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.modal-buttons button {
  flex: 1;
  padding: 12px 20px;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-danger {
  background: var(--red);
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .col-side {
    order: -1;
  }
}

@media (max-width: 768px) {
  .event-dashboard {
    padding: 16px;
  }

  .event-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-actions > * {
    flex: 1;
    justify-content: center;
  }

  .header-actions .btn-icon {
    flex: 0;
  }

  .progress-steps {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .step-connector {
    width: 2px;
    height: 24px;
    margin: 0 0 0 15px;
  }

  .setup-alert {
    flex-direction: column;
    text-align: center;
  }

  .alert-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .alert-text p {
    max-width: none;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .gallery-preview {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
