<template>
  <div class="email-settings-page">
    <!-- Loading -->
    <div v-if="loading" class="state-container">
      <div class="loading-state">
        <div class="loader"></div>
        <span>{{ t.loading }}</span>
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
        <NuxtLink :to="`/app/admin/events/${event.slug}`">{{ event.name }}</NuxtLink>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span>{{ t.emailAndTickets }}</span>
      </nav>

      <!-- Header -->
      <header class="page-header">
        <div class="header-main">
          <h1>{{ t.emailAndTickets }}</h1>
          <p class="page-subtitle">{{ t.leaveEmptyForDefault }}</p>
        </div>
        <NuxtLink :to="`/app/admin/events/${event.slug}`" class="btn-secondary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>{{ t.back }}</span>
        </NuxtLink>
      </header>

      <!-- Placeholders Info -->
      <div class="info-callout">
        <div class="info-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="info-content">
          <span class="info-title">{{ t.availablePlaceholders }}</span>
          <div class="placeholder-tags">
            <code>{event_name}</code>
            <span class="tag-sep">&mdash;</span>
            <span class="tag-desc">{{ t.eventNameDesc }}</span>
          </div>
          <div class="placeholder-tags">
            <code>{customer_name}</code>
            <span class="tag-sep">&mdash;</span>
            <span class="tag-desc">{{ t.customerNameDesc }}</span>
          </div>
        </div>
      </div>

      <!-- Email Settings Card -->
      <div class="settings-card">
        <h2 class="section-title">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          {{ t.emailSettings }}
        </h2>

        <div class="form-fields">
          <!-- Email Subject -->
          <div class="field-group">
            <label for="email_subject">{{ t.emailSubject }}</label>
            <input
              id="email_subject"
              v-model="form.email_subject"
              type="text"
              :placeholder="t.emailSubjectDefault"
              class="field-input"
            />
          </div>

          <!-- Greeting -->
          <div class="field-group">
            <label for="email_greeting">{{ t.greeting }}</label>
            <input
              id="email_greeting"
              v-model="form.email_greeting"
              type="text"
              :placeholder="t.greetingDefault"
              class="field-input"
            />
          </div>

          <!-- Intro Text -->
          <div class="field-group">
            <label for="email_intro">{{ t.introText }}</label>
            <textarea
              id="email_intro"
              v-model="form.email_intro"
              :placeholder="t.introDefault"
              class="field-textarea"
              rows="2"
            ></textarea>
          </div>

          <!-- Instructions -->
          <div class="field-group">
            <label for="email_instructions">{{ t.instructions }}</label>
            <textarea
              id="email_instructions"
              v-model="form.email_instructions"
              :placeholder="t.instructionsDefault"
              class="field-textarea"
              rows="2"
            ></textarea>
          </div>

          <!-- Email Footer -->
          <div class="field-group">
            <label for="email_footer">{{ t.emailFooter }}</label>
            <input
              id="email_footer"
              v-model="form.email_footer"
              type="text"
              :placeholder="t.footerDefault"
              class="field-input"
            />
          </div>
        </div>
      </div>

      <!-- Ticket Settings Card -->
      <div class="settings-card">
        <h2 class="section-title">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
          </svg>
          {{ t.ticketSettings }}
        </h2>

        <div class="form-fields">
          <!-- Ticket Footer -->
          <div class="field-group">
            <label for="ticket_footer">{{ t.ticketFooter }}</label>
            <input
              id="ticket_footer"
              v-model="form.ticket_footer"
              type="text"
              :placeholder="t.ticketFooterDefault"
              class="field-input"
            />
            <span class="field-hint">{{ t.ticketFooterHint }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button
          @click="handleReset"
          :disabled="saving"
          class="btn-ghost"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ t.resetDefaults }}
        </button>
        <div class="save-area">
          <Transition name="fade">
            <span v-if="saved" class="save-success">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ t.saved }}
            </span>
          </Transition>
          <button
            @click="handleSave"
            :disabled="saving"
            class="btn-primary"
          >
            {{ saving ? t.saving : t.saveChanges }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { t: createT } = useLanguage()

const translations = {
  loading: { es: 'Cargando...', en: 'Loading...' },
  errorLoading: { es: 'Error al cargar', en: 'Error loading' },
  tryAgain: { es: 'Intentar de nuevo', en: 'Try again' },
  events: { es: 'Eventos', en: 'Events' },
  back: { es: 'Volver', en: 'Back' },
  emailAndTickets: { es: 'Email y Boletos', en: 'Email & Tickets' },
  leaveEmptyForDefault: { es: 'Deja vacío para usar el texto predeterminado', en: 'Leave empty to use default text' },
  availablePlaceholders: { es: 'Placeholders disponibles', en: 'Available Placeholders' },
  eventNameDesc: { es: 'Nombre del evento', en: 'Event name' },
  customerNameDesc: { es: 'Nombre del comprador', en: 'Customer name' },
  emailSettings: { es: 'Correo de Confirmación', en: 'Confirmation Email' },
  ticketSettings: { es: 'Boleto PDF', en: 'PDF Ticket' },
  emailSubject: { es: 'Asunto del correo', en: 'Email Subject' },
  emailSubjectDefault: { es: 'Tus boletos para {event_name}', en: 'Your tickets for {event_name}' },
  greeting: { es: 'Saludo', en: 'Greeting' },
  greetingDefault: { es: 'Hola {customer_name},', en: 'Hi {customer_name},' },
  introText: { es: 'Texto de introducción', en: 'Intro Text' },
  introDefault: { es: 'Tus boletos están adjuntos a este correo.', en: 'Your tickets are attached to this email.' },
  instructions: { es: 'Instrucciones', en: 'Instructions' },
  instructionsDefault: { es: 'Por favor ten tu boleto (impreso o en tu teléfono) listo en la entrada.', en: 'Please have your ticket (printed or on your phone) ready at the entrance.' },
  emailFooter: { es: 'Pie del correo', en: 'Email Footer' },
  footerDefault: { es: '¡Te esperamos!', en: 'We look forward to seeing you!' },
  ticketFooter: { es: 'Texto del boleto PDF', en: 'PDF Ticket Text' },
  ticketFooterDefault: { es: 'Presenta este boleto en la entrada', en: 'Present this ticket at the entrance' },
  ticketFooterHint: { es: 'Se muestra debajo del código QR en el boleto PDF', en: 'Shown below the QR code on the PDF ticket' },
  saveChanges: { es: 'Guardar Cambios', en: 'Save Changes' },
  saving: { es: 'Guardando...', en: 'Saving...' },
  saved: { es: 'Guardado', en: 'Saved' },
  resetDefaults: { es: 'Restablecer', en: 'Reset to Defaults' },
}

const t = createT(translations)

const route = useRoute()
const router = useRouter()
const { getEvent, updateEvent } = useEvents()

const event = ref(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const saved = ref(false)

const form = reactive({
  email_subject: '',
  email_greeting: '',
  email_intro: '',
  email_instructions: '',
  email_footer: '',
  ticket_footer: '',
})

const fetchEvent = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await getEvent(route.params.slug)
    event.value = response.event

    // Initialize form from existing settings
    const settings = response.event.email_settings || {}
    form.email_subject = settings.email_subject || ''
    form.email_greeting = settings.email_greeting || ''
    form.email_intro = settings.email_intro || ''
    form.email_instructions = settings.email_instructions || ''
    form.email_footer = settings.email_footer || ''
    form.ticket_footer = settings.ticket_footer || ''
  } catch (e) {
    error.value = e.message || 'Failed to load event'
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  saving.value = true
  saved.value = false
  try {
    // Build settings object with only non-empty values
    const emailSettings = {}
    let hasValue = false
    for (const key of Object.keys(form)) {
      if (form[key].trim()) {
        emailSettings[key] = form[key].trim()
        hasValue = true
      }
    }

    await updateEvent(route.params.slug, {
      email_settings: hasValue ? emailSettings : null
    })

    saved.value = true
    setTimeout(() => {
      router.push(`/app/admin/events/${route.params.slug}`)
    }, 1500)
  } catch (e) {
    error.value = e.message || 'Failed to save'
    saving.value = false
  }
}

const handleReset = async () => {
  saving.value = true
  saved.value = false
  try {
    await updateEvent(route.params.slug, { email_settings: null })

    // Clear form
    form.email_subject = ''
    form.email_greeting = ''
    form.email_intro = ''
    form.email_instructions = ''
    form.email_footer = ''
    form.ticket_footer = ''

    saved.value = true
    setTimeout(() => {
      router.push(`/app/admin/events/${route.params.slug}`)
    }, 1500)
  } catch (e) {
    error.value = e.message || 'Failed to reset'
    saving.value = false
  }
}

onMounted(fetchEvent)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

.email-settings-page {
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

.email-settings-page *,
.email-settings-page *::before,
.email-settings-page *::after {
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

.page-header h1 {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--color-ink);
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-ink-muted);
  margin: 0;
}

/* Info Callout */
.info-callout {
  display: flex;
  gap: 14px;
  background: var(--color-indigo-light);
  border: 1px solid rgba(38, 70, 83, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-icon {
  width: 36px;
  height: 36px;
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-indigo);
}

.info-icon svg {
  width: 20px;
  height: 20px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-indigo);
}

.placeholder-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  flex-wrap: wrap;
}

.placeholder-tags code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 12px;
  background: rgba(38, 70, 83, 0.1);
  color: var(--color-indigo);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.tag-sep {
  color: var(--color-ink-muted);
  font-size: 11px;
}

.tag-desc {
  color: var(--color-ink-light);
  font-size: 12px;
}

/* Settings Card */
.settings-card {
  background: #ffffff;
  border: 1px solid var(--color-stone);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-ink-muted);
  margin: 0 0 20px 0;
}

.section-title svg {
  width: 16px;
  height: 16px;
}

/* Form */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
}

.field-input,
.field-textarea {
  width: 100%;
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-ink);
  background: var(--color-stone-light);
  border: 1px solid var(--color-stone);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: var(--color-ink-muted);
  font-style: italic;
}

.field-input:focus,
.field-textarea:focus {
  border-color: var(--color-indigo);
  box-shadow: 0 0 0 3px var(--color-indigo-light);
  background: #ffffff;
}

.field-textarea {
  resize: vertical;
  min-height: 60px;
  line-height: 1.5;
}

.field-hint {
  font-size: 12px;
  color: var(--color-ink-muted);
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.save-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.save-success {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-bamboo);
}

.save-success svg {
  width: 16px;
  height: 16px;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-ghost {
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

.btn-secondary {
  background: #ffffff;
  color: var(--color-ink);
  border: 1px solid var(--color-stone);
}

.btn-secondary:hover {
  background: var(--color-stone-light);
  border-color: var(--color-ink-muted);
}

.btn-secondary svg {
  width: 16px;
  height: 16px;
}

.btn-ghost {
  background: transparent;
  color: var(--color-ink-muted);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-stone-light);
  color: var(--color-ink);
}

.btn-ghost:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ghost svg {
  width: 16px;
  height: 16px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Desktop */
@media (min-width: 768px) {
  .email-settings-page {
    padding: 24px 32px;
    padding-bottom: 40px;
    max-width: 720px;
    margin: 0 auto;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .settings-card {
    padding: 24px;
  }
}
</style>
