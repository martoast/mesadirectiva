<template>
  <div class="edit-page">
    <!-- Header -->
    <header class="page-header">
      <NuxtLink :to="`/app/admin/events/${route.params.slug}`" class="back-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="back-text">{{ t.backToEvent }}</span>
      </NuxtLink>

      <div v-if="event" class="header-content">
        <div class="title-row">
          <h1>{{ t.editEvent }}</h1>
          <span :class="['status-badge', event.status]">
            <span class="status-dot"></span>
            {{ statusLabel(event.status) }}
          </span>
        </div>
        <p class="event-name">{{ event.name }}</p>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-state">
        <div class="loader"></div>
        <span>{{ t.loadingEvent }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="state-container">
      <div class="error-state">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3>{{ t.errorLoading }}</h3>
        <p>{{ loadError }}</p>
        <NuxtLink to="/app/admin/events" class="btn-primary">{{ t.backToEvents }}</NuxtLink>
      </div>
    </div>

    <!-- Event Form -->
    <div v-else-if="event" class="form-container">
      <AdminEventFormSimple
        :initial-data="event"
        @draft="handleSave"
        @publish="handleSaveAndPublish"
      />
    </div>

    <!-- Error Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="error" class="toast-error">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
          <button @click="error = ''" class="toast-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { t: createT } = useLanguage()

const translations = {
  backToEvent: { es: 'Volver al evento', en: 'Back to event' },
  editEvent: { es: 'Editar Evento', en: 'Edit Event' },
  loadingEvent: { es: 'Cargando evento...', en: 'Loading event...' },
  errorLoading: { es: 'Error al cargar', en: 'Error loading' },
  backToEvents: { es: 'Volver a eventos', en: 'Back to events' },
  draft: { es: 'Borrador', en: 'Draft' },
  live: { es: 'En vivo', en: 'Live' },
  closed: { es: 'Cerrado', en: 'Closed' }
}

const t = createT(translations)

const route = useRoute()
const router = useRouter()
const { getEvent, updateEvent, publishEvent } = useEvents()

const event = ref(null)
const loading = ref(true)
const loadError = ref('')
const error = ref('')

const statusLabel = (status) => {
  const labels = { draft: t.draft, live: t.live, closed: t.closed }
  return labels[status] || status
}

const fetchEvent = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const response = await getEvent(route.params.slug)
    event.value = response.event
  } catch (e) {
    loadError.value = e.message || 'Failed to load event'
  } finally {
    loading.value = false
  }
}

const handleSave = async (eventData) => {
  error.value = ''
  const slug = eventData.slug || route.params.slug
  router.push(`/app/admin/events/${slug}`)
}

const handleSaveAndPublish = async (eventData) => {
  error.value = ''
  const slug = eventData.slug || route.params.slug
  router.push(`/app/admin/events/${slug}`)
}

onMounted(() => {
  fetchEvent()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

.edit-page {
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

  --font-display: 'Zen Maru Gothic', 'Noto Sans JP', system-ui, sans-serif;
  --font-body: 'Noto Sans JP', system-ui, sans-serif;

  min-height: 100vh;
  background: var(--color-paper);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

.edit-page *,
.edit-page *::before,
.edit-page *::after {
  box-sizing: border-box;
}

/* Header */
.page-header {
  padding: 20px 24px;
  background: #ffffff;
  border-bottom: 1px solid var(--color-stone);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: var(--color-ink-muted);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;
  margin-bottom: 16px;
}

.back-btn:hover {
  color: var(--color-ink);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.title-row h1 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  line-height: 1.2;
}

.event-name {
  font-size: 14px;
  color: var(--color-ink-muted);
  margin: 0;
  line-height: 1.4;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
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

.status-badge.draft {
  background: var(--color-amber-light);
  color: var(--color-amber);
}

.status-badge.draft .status-dot {
  background: var(--color-amber);
}

.status-badge.live {
  background: var(--color-bamboo-light);
  color: var(--color-bamboo);
}

.status-badge.live .status-dot {
  background: var(--color-bamboo);
  animation: pulse 2s infinite;
}

.status-badge.closed {
  background: var(--color-stone-light);
  color: var(--color-ink-muted);
}

.status-badge.closed .status-dot {
  background: var(--color-ink-muted);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* States */
.state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 24px;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 400px;
}

.loader {
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-stone);
  border-top-color: var(--color-indigo);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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
  line-height: 1.5;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: var(--color-ink);
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: var(--color-ink-light);
}

/* Form Container */
.form-container {
  width: 100%;
}

/* Toast */
.toast-error {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--color-ink);
  color: #ffffff;
  font-size: 14px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  max-width: calc(100vw - 48px);
}

.toast-error svg:first-child {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--color-vermillion);
}

.toast-close {
  padding: 4px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.15s;
}

.toast-close:hover {
  color: #ffffff;
}

.toast-close svg {
  width: 16px;
  height: 16px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 20px;
  }

  .back-btn {
    margin-bottom: 12px;
  }

  .back-text {
    display: none;
  }

  .back-btn svg {
    width: 20px;
    height: 20px;
  }

  .title-row h1 {
    font-size: 20px;
  }

  .toast-error {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
    max-width: none;
  }

  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(20px);
  }
}
</style>
