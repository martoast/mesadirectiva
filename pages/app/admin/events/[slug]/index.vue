<template>
  <div class="event-page">
    <!-- Loading -->
    <div v-if="loading" class="state-container">
      <div class="loading-state">
        <div class="loader"></div>
        <span>{{ t.loadingEvent }}</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-container">
      <div class="error-state">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3>{{ t.errorLoading }}</h3>
        <p>{{ error }}</p>
        <button @click="fetchEvent" class="btn-primary">{{ t.tryAgain }}</button>
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="event">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/app/admin/events">{{ t.events }}</NuxtLink>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span>{{ event.name }}</span>
      </nav>

      <!-- Header -->
      <header class="page-header">
        <div class="header-main">
          <div class="title-row">
            <h1>{{ event.name }}</h1>
            <div class="badges">
              <span :class="['status-badge', event.status]">
                <span class="status-dot"></span>
                {{ statusLabel(event.status) }}
              </span>
              <span v-if="event.group" class="group-badge" :style="{ '--accent': event.group.color || '#264653' }">
                {{ event.group.name }}
              </span>
            </div>
          </div>
          <div class="meta-row">
            <div class="meta-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke-width="1.5"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke-width="1.5"/>
              </svg>
              <span>{{ formatEventDate(event.starts_at) }}</span>
            </div>
            <div class="meta-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
                <path d="M12 6v6l4 2" stroke-width="1.5"/>
              </svg>
              <span>{{ formatEventTime(event.starts_at) }}</span>
            </div>
            <div class="meta-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke-width="1.5"/>
                <circle cx="12" cy="10" r="3" stroke-width="1.5"/>
              </svg>
              <span>{{ formatLocationShort() }}</span>
            </div>
            <span class="type-tag">
              {{ event.seating_type === 'seated' ? t.seated : t.generalAdmission }}
            </span>
          </div>
        </div>

        <!-- Desktop Actions -->
        <div class="header-actions desktop-only">
          <NuxtLink :to="`/app/events/${event.slug}`" target="_blank" class="btn-ghost">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"/>
            </svg>
            <span>{{ t.preview }}</span>
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
          <button @click="handleDelete" class="btn-icon-danger" :title="t.deleteEvent">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Progress Steps -->
      <div class="progress-section">
        <div class="progress-steps">
          <div class="step completed">
            <div class="step-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
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
              <svg v-if="isSetupComplete" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
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
              <svg v-if="event.status === 'live'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
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
        <div class="alert-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke-width="1.5"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="alert-content">
          <h3>{{ event.seating_type === 'seated' ? t.setupTables : t.addTicketPricing }}</h3>
          <p>{{ event.seating_type === 'seated' ? t.setupTablesDesc : t.addTicketTiersDesc }}</p>
        </div>
        <NuxtLink
          :to="event.seating_type === 'seated' ? `/app/admin/events/${event.slug}/tables` : `/app/admin/events/${event.slug}/tiers`"
          class="alert-action"
        >
          {{ event.seating_type === 'seated' ? t.setUpTablesBtn : t.addTicketTiersBtn }}
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Main Grid -->
      <div class="main-grid">
        <!-- Stats Card (Shows first on mobile) -->
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
              :to="event.seating_type === 'seated' ? `/app/admin/events/${event.slug}/tables` : `/app/admin/events/${event.slug}/tiers`"
              class="action-link"
            >
              <div class="action-icon">
                <svg v-if="event.seating_type === 'seated'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" stroke-width="1.5"/>
                  <rect x="14" y="3" width="7" height="7" stroke-width="1.5"/>
                  <rect x="3" y="14" width="7" height="7" stroke-width="1.5"/>
                  <rect x="14" y="14" width="7" height="7" stroke-width="1.5"/>
                </svg>
                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" stroke-width="1.5"/>
                </svg>
              </div>
              <div class="action-text">
                <span class="action-title">{{ event.seating_type === 'seated' ? t.tablesAndSeats : t.ticketTiers }}</span>
                <span class="action-desc">
                  {{ event.seating_type === 'seated' ? `${tables.length} ${t.tables} · ${totalSeats} ${t.seats}` : `${event.active_ticket_tiers?.length || 0} ${t.activeTiers}` }}
                </span>
              </div>
              <svg class="action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" stroke-width="1.5"/>
              </svg>
            </NuxtLink>

            <NuxtLink
              v-if="event.seating_type === 'seated'"
              :to="`/app/admin/events/${event.slug}/floor-plan`"
              class="action-link"
            >
              <div class="action-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke-width="1.5"/>
                </svg>
              </div>
              <div class="action-text">
                <span class="action-title">{{ t.floorPlanEditor }}</span>
                <span class="action-desc">{{ t.arrangeTableLayout }}</span>
              </div>
              <svg class="action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" stroke-width="1.5"/>
              </svg>
            </NuxtLink>

            <NuxtLink :to="`/app/events/${event.slug}`" target="_blank" class="action-link external">
              <div class="action-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" stroke-width="1.5"/>
                </svg>
              </div>
              <div class="action-text">
                <span class="action-title">{{ t.publicEventPage }}</span>
                <span class="action-desc">{{ t.viewAsAttendees }}</span>
              </div>
              <svg class="action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" stroke-width="1.5"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

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
            <div v-for="(img, i) in event.media.images.slice(0, 4)" :key="i" class="gallery-thumb">
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
          <div class="details-list">
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

      <!-- Mobile FAB Actions -->
      <div class="mobile-fab-container">
        <NuxtLink :to="`/app/admin/events/${event.slug}/edit`" class="fab-btn secondary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </NuxtLink>
        <button
          v-if="event.status === 'draft' && isSetupComplete"
          @click="handlePublish"
          :disabled="actionLoading"
          class="fab-btn primary"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"/>
          </svg>
          <span>{{ t.publish }}</span>
        </button>
        <button
          v-if="event.status === 'live'"
          @click="handleClose"
          :disabled="actionLoading"
          class="fab-btn warning"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
          </svg>
          <span>{{ t.close }}</span>
        </button>
      </div>
    </template>

    <!-- Delete Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteModalOpen" class="modal-backdrop" @click.self="deleteModalOpen = false">
          <div class="modal-box">
            <div class="modal-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3>{{ t.deleteEvent }}</h3>
            <p>{{ t.deleteConfirm }} <strong>"{{ event.name }}"</strong> {{ t.andAllData }}</p>
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

const translations = {
  loadingEvent: { es: 'Cargando evento...', en: 'Loading event...' },
  errorLoading: { es: 'Error al cargar', en: 'Error loading' },
  tryAgain: { es: 'Intentar de nuevo', en: 'Try again' },
  events: { es: 'Eventos', en: 'Events' },
  preview: { es: 'Vista previa', en: 'Preview' },
  editEvent: { es: 'Editar', en: 'Edit' },
  publishEvent: { es: 'Publicar evento', en: 'Publish Event' },
  publish: { es: 'Publicar', en: 'Publish' },
  publishing: { es: 'Publicando...', en: 'Publishing...' },
  closeEvent: { es: 'Cerrar evento', en: 'Close Event' },
  close: { es: 'Cerrar', en: 'Close' },
  closing: { es: 'Cerrando...', en: 'Closing...' },
  seated: { es: 'Con asientos', en: 'Seated' },
  generalAdmission: { es: 'Admisión general', en: 'General Admission' },
  draft: { es: 'Borrador', en: 'Draft' },
  live: { es: 'En vivo', en: 'Live' },
  closed: { es: 'Cerrado', en: 'Closed' },
  eventCreated: { es: 'Evento creado', en: 'Event Created' },
  basicInfoSaved: { es: 'Información básica guardada', en: 'Basic info saved' },
  tablesAndSeats: { es: 'Mesas y asientos', en: 'Tables & Seats' },
  ticketPricing: { es: 'Precios de boletos', en: 'Ticket Pricing' },
  configured: { es: 'Configurado', en: 'Configured' },
  actionRequired: { es: 'Acción requerida', en: 'Action required' },
  published: { es: 'Publicado', en: 'Published' },
  readyToPublish: { es: 'Listo para publicar', en: 'Ready to Publish' },
  eventIsLive: { es: 'El evento está en vivo', en: 'Event is live' },
  clickPublishAbove: { es: 'Haz clic en publicar', en: 'Click publish' },
  completeStep2First: { es: 'Completa el paso 2 primero', en: 'Complete step 2 first' },
  setupTables: { es: 'Configura tus mesas', en: 'Set up your tables' },
  addTicketPricing: { es: 'Agrega precios de boletos', en: 'Add ticket pricing' },
  setupTablesDesc: { es: 'Configura las mesas y asientos antes de publicar este evento.', en: 'Configure tables and seating before publishing this event.' },
  addTicketTiersDesc: { es: 'Crea al menos un nivel de boletos con precios antes de publicar.', en: 'Create at least one ticket tier with pricing before publishing.' },
  setUpTablesBtn: { es: 'Configurar mesas', en: 'Set Up Tables' },
  addTicketTiersBtn: { es: 'Agregar niveles', en: 'Add Tiers' },
  about: { es: 'Acerca de', en: 'About' },
  noDescription: { es: 'Sin descripción.', en: 'No description provided.' },
  organizedBy: { es: 'Organizado por', en: 'Organized by' },
  gallery: { es: 'Galería', en: 'Gallery' },
  eventDetails: { es: 'Detalles', en: 'Details' },
  start: { es: 'Inicio', en: 'Start' },
  end: { es: 'Fin', en: 'End' },
  timezone: { es: 'Zona horaria', en: 'Timezone' },
  location: { es: 'Ubicación', en: 'Location' },
  visibility: { es: 'Visibilidad', en: 'Visibility' },
  private: { es: 'Privado', en: 'Private' },
  public: { es: 'Público', en: 'Public' },
  reservationHold: { es: 'Tiempo de reserva', en: 'Reservation Hold' },
  minutes: { es: 'minutos', en: 'minutes' },
  salesOverview: { es: 'Ventas', en: 'Sales' },
  seatsSold: { es: 'Asientos vendidos', en: 'Seats Sold' },
  ticketsSold: { es: 'Boletos vendidos', en: 'Tickets Sold' },
  available: { es: 'Disponibles', en: 'Available' },
  revenue: { es: 'Ingresos', en: 'Revenue' },
  manage: { es: 'Administrar', en: 'Manage' },
  ticketTiers: { es: 'Niveles de boletos', en: 'Ticket Tiers' },
  tables: { es: 'mesas', en: 'tables' },
  seats: { es: 'asientos', en: 'seats' },
  activeTiers: { es: 'niveles activos', en: 'active tiers' },
  floorPlanEditor: { es: 'Plano del evento', en: 'Floor Plan' },
  arrangeTableLayout: { es: 'Organiza el diseño visual', en: 'Arrange layout visually' },
  publicEventPage: { es: 'Página pública', en: 'Public Page' },
  viewAsAttendees: { es: 'Ver como asistentes', en: 'View as attendees' },
  deleteEvent: { es: 'Eliminar evento', en: 'Delete Event' },
  deleteConfirm: { es: 'Esto eliminará permanentemente', en: 'This will permanently delete' },
  andAllData: { es: 'y todos los datos asociados.', en: 'and all associated data.' },
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

const statusLabel = (status) => {
  const labels = { draft: t.draft, live: t.live, closed: t.closed }
  return labels[status] || status
}

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
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

.event-page {
  --color-paper: #faf9f7;
  --color-ink: #1a1a1a;
  --color-ink-light: #4a4a4a;
  --color-ink-muted: #8a8a8a;
  --color-stone: #e8e6e3;
  --color-stone-light: #f5f4f2;
  --color-bamboo: #2d5a27;
  --color-bamboo-light: rgba(45, 90, 39, 0.1);
  --color-vermillion: #c73e1d;
  --color-vermillion-light: rgba(199, 62, 29, 0.1);
  --color-amber: #b45309;
  --color-amber-light: rgba(180, 83, 9, 0.1);
  --color-indigo: #264653;
  --color-indigo-light: rgba(38, 70, 83, 0.1);

  --font-display: 'Zen Maru Gothic', 'Noto Sans JP', system-ui, sans-serif;
  --font-body: 'Noto Sans JP', system-ui, sans-serif;

  min-height: 100vh;
  background: var(--color-paper);
  font-family: var(--font-body);
  padding: 20px;
  padding-bottom: 100px;
  -webkit-font-smoothing: antialiased;
}

.event-page *,
.event-page *::before,
.event-page *::after {
  box-sizing: border-box;
}

/* States */
.state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 360px;
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

.loading-state span {
  font-size: 14px;
  color: var(--color-ink-muted);
}

.error-icon {
  width: 56px;
  height: 56px;
  background: var(--color-vermillion-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-vermillion);
}

.error-icon svg {
  width: 28px;
  height: 28px;
}

.error-state h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0;
}

.error-state p {
  font-size: 14px;
  color: var(--color-ink-muted);
  margin: 0;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 16px;
  overflow: hidden;
}

.breadcrumb a {
  color: var(--color-ink-muted);
  text-decoration: none;
  flex-shrink: 0;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 20px;
}

.header-main {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.title-row h1 {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  line-height: 1.2;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-radius: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.draft { background: var(--color-amber-light); color: var(--color-amber); }
.status-badge.draft .status-dot { background: var(--color-amber); }
.status-badge.live { background: var(--color-bamboo-light); color: var(--color-bamboo); }
.status-badge.live .status-dot { background: var(--color-bamboo); animation: pulse 2s infinite; }
.status-badge.closed { background: var(--color-stone-light); color: var(--color-ink-muted); }
.status-badge.closed .status-dot { background: var(--color-ink-muted); }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.group-badge {
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
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
  color: var(--color-ink-light);
}

.meta-item svg {
  width: 16px;
  height: 16px;
  color: var(--color-ink-muted);
  flex-shrink: 0;
}

.type-tag {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  background: var(--color-stone-light);
  color: var(--color-ink-muted);
  border-radius: 6px;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.desktop-only {
  display: none;
}

/* Buttons */
.btn-ghost,
.btn-secondary,
.btn-primary,
.btn-warning,
.btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-ghost {
  background: transparent;
  color: var(--color-ink-muted);
}

.btn-ghost:hover {
  background: var(--color-stone-light);
  color: var(--color-ink);
}

.btn-ghost svg {
  width: 16px;
  height: 16px;
}

.btn-secondary {
  background: #ffffff;
  color: var(--color-ink);
  border: 1px solid var(--color-stone);
}

.btn-secondary:hover {
  background: var(--color-stone-light);
  border-color: var(--color-ink-muted);
}

.btn-primary {
  background: var(--color-ink);
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-ink-light);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-warning {
  background: var(--color-amber);
  color: #ffffff;
}

.btn-warning:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-danger {
  background: var(--color-vermillion);
  color: #ffffff;
}

.btn-danger:hover {
  opacity: 0.9;
}

.btn-icon-danger {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-stone);
  border-radius: 8px;
  color: var(--color-ink-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-icon-danger svg {
  width: 18px;
  height: 18px;
}

.btn-icon-danger:hover {
  background: var(--color-vermillion-light);
  border-color: var(--color-vermillion);
  color: var(--color-vermillion);
}

/* Progress Section */
.progress-section {
  background: #ffffff;
  border: 1px solid var(--color-stone);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
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
  background: var(--color-bamboo);
  color: #ffffff;
}

.step.completed .step-icon svg {
  width: 16px;
  height: 16px;
}

.step.pending .step-icon {
  background: var(--color-amber-light);
  color: var(--color-amber);
}

.step.ready .step-icon {
  background: var(--color-indigo-light);
  color: var(--color-indigo);
}

.step.locked .step-icon {
  background: var(--color-stone-light);
  color: var(--color-ink-muted);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.step-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
}

.step-desc {
  font-size: 12px;
  color: var(--color-ink-muted);
}

.step.pending .step-desc {
  color: var(--color-amber);
}

.step-connector {
  width: 2px;
  height: 20px;
  background: var(--color-stone);
  margin-left: 15px;
}

.step-connector.active {
  background: var(--color-bamboo);
}

/* Setup Alert */
.setup-alert {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fcd34d;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.alert-icon {
  width: 44px;
  height: 44px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-amber);
}

.alert-icon svg {
  width: 24px;
  height: 24px;
}

.alert-content h3 {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 4px 0;
}

.alert-content p {
  font-size: 13px;
  color: var(--color-ink-light);
  margin: 0;
  line-height: 1.5;
}

.alert-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--color-ink);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  align-self: flex-start;
  transition: background 0.15s;
}

.alert-action:hover {
  background: var(--color-ink-light);
}

.alert-action svg {
  width: 18px;
  height: 18px;
}

/* Main Grid */
.main-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Section Title */
.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-ink-muted);
  margin: 0 0 16px 0;
}

/* Stats Card */
.stats-card {
  background: #ffffff;
  border: 1px solid var(--color-stone);
  border-radius: 12px;
  padding: 20px;
}

.stat-hero {
  text-align: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-stone-light);
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--color-indigo);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
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
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 2px;
}

.stat-num.success {
  color: var(--color-bamboo);
}

.stat-lbl {
  font-size: 11px;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Actions Card */
.actions-card {
  background: #ffffff;
  border: 1px solid var(--color-stone);
  border-radius: 12px;
  padding: 20px;
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
  padding: 14px;
  background: var(--color-stone-light);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s;
}

.action-link:hover,
.action-link:active {
  background: var(--color-stone);
}

.action-link.external:hover {
  background: var(--color-indigo-light);
}

.action-icon {
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 1px solid var(--color-stone);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-ink-muted);
}

.action-link.external .action-icon {
  border-color: var(--color-indigo);
}

.action-link.external .action-icon svg {
  color: var(--color-indigo);
}

.action-text {
  flex: 1;
  min-width: 0;
}

.action-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink);
}

.action-desc {
  display: block;
  font-size: 12px;
  color: var(--color-ink-muted);
}

.action-arrow {
  width: 18px;
  height: 18px;
  color: var(--color-ink-muted);
  flex-shrink: 0;
}

/* Event Card */
.event-card {
  background: #ffffff;
  border: 1px solid var(--color-stone);
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
  padding: 20px;
}

.event-description {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-ink-light);
  margin: 0;
  white-space: pre-wrap;
}

.organizer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-stone-light);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.organizer .label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-ink-muted);
}

.organizer .value {
  font-size: 14px;
  color: var(--color-ink);
}

/* Gallery Card */
.gallery-card {
  background: #ffffff;
  border: 1px solid var(--color-stone);
  border-radius: 12px;
  padding: 20px;
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
  background: var(--color-stone-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink-muted);
}

/* Details Card */
.details-card {
  background: #ffffff;
  border: 1px solid var(--color-stone);
  border-radius: 12px;
  padding: 20px;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-stone-light);
}

.detail-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.detail-item .label {
  font-size: 13px;
  color: var(--color-ink-muted);
  flex-shrink: 0;
}

.detail-item .value {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink);
  text-align: right;
}

.detail-item .value.success {
  color: var(--color-bamboo);
}

.detail-item .value.muted {
  color: var(--color-ink-muted);
}

/* Mobile FAB */
.mobile-fab-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.fab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  padding: 0 20px;
  border: none;
  border-radius: 26px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.15s;
}

.fab-btn svg {
  width: 20px;
  height: 20px;
}

.fab-btn.secondary {
  width: 52px;
  padding: 0;
  background: #ffffff;
  color: var(--color-ink);
  border: 1px solid var(--color-stone);
}

.fab-btn.secondary:hover {
  background: var(--color-stone-light);
}

.fab-btn.primary {
  background: var(--color-ink);
  color: #ffffff;
}

.fab-btn.primary:hover:not(:disabled) {
  background: var(--color-ink-light);
}

.fab-btn.primary:disabled {
  opacity: 0.6;
}

.fab-btn.warning {
  background: var(--color-amber);
  color: #ffffff;
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
  padding: 20px;
}

.modal-box {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px;
  max-width: 380px;
  width: 100%;
  text-align: center;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: var(--color-vermillion-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--color-vermillion);
}

.modal-icon svg {
  width: 26px;
  height: 26px;
}

.modal-box h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 8px 0;
}

.modal-box p {
  font-size: 14px;
  color: var(--color-ink-light);
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.modal-box p strong {
  color: var(--color-ink);
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.modal-buttons button {
  flex: 1;
  padding: 12px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Desktop */
@media (min-width: 768px) {
  .event-page {
    padding: 24px 32px;
    padding-bottom: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .title-row h1 {
    font-size: 28px;
  }

  .desktop-only {
    display: flex;
  }

  .mobile-fab-container {
    display: none;
  }

  .progress-section {
    padding: 20px 24px;
  }

  .progress-steps {
    flex-direction: row;
    align-items: center;
  }

  .step {
    flex: 1;
    padding: 0;
  }

  .step-connector {
    width: 40px;
    height: 2px;
    margin: 0 8px;
  }

  .setup-alert {
    flex-direction: row;
    align-items: center;
    padding: 20px 24px;
  }

  .alert-content {
    flex: 1;
  }

  .alert-action {
    align-self: center;
    flex-shrink: 0;
  }

  .main-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
  }

  .stats-card {
    grid-column: 2;
    grid-row: 1;
  }

  .actions-card {
    grid-column: 2;
    grid-row: 2;
  }

  .event-card {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .gallery-card {
    grid-column: 1;
  }

  .details-card {
    grid-column: 1;
  }

  .details-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .detail-item {
    flex-direction: column;
    gap: 4px;
    padding-bottom: 0;
    border-bottom: none;
  }

  .detail-item .value {
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .gallery-preview {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
