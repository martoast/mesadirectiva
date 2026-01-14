<!-- components/admin/EventFormSimple.vue -->
<!-- Simplified 3-step event form with progressive disclosure -->
<template>
  <div class="event-form-simple">
    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${((currentStep + 1) / 3) * 100}%` }"></div>
    </div>

    <!-- Step Indicator -->
    <div class="step-header">
      <div class="step-info">
        <span class="step-count">{{ t.step }} {{ currentStep + 1 }} {{ t.of }} 3</span>
        <h1 class="step-title">{{ stepTitle }}</h1>
      </div>
      <div v-if="savedSlug && !initialData" class="saved-badge">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        {{ t.draftSaved }}
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-content">
      <!-- Step 1: Essentials -->
      <div v-show="currentStep === 0" class="step-panel">
        <!-- Event Name -->
        <div class="field">
          <label>{{ t.eventName }} <span class="required">*</span></label>
          <input
            ref="nameInputRef"
            v-model="form.name"
            type="text"
            :placeholder="t.eventNamePlaceholder"
            class="input-lg"
            required
          />
        </div>

        <!-- Group -->
        <div class="field">
          <label>{{ t.group }} <span class="required">*</span></label>
          <select v-model="form.group_id" required>
            <option value="">{{ t.selectGroup }}</option>
            <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>

        <!-- Date & Time -->
        <div class="field-row">
          <div class="field">
            <label>{{ t.startDateTime }} <span class="required">*</span></label>
            <input v-model="form.starts_at" type="datetime-local" required />
          </div>
          <div class="field">
            <label>{{ t.endDateTime }}</label>
            <input v-model="form.ends_at" type="datetime-local" />
          </div>
        </div>

        <!-- Timezone -->
        <div class="field">
          <label>{{ t.timezone }}</label>
          <select v-model="form.timezone">
            <optgroup :label="t.mexico">
              <option v-for="tz in mexicoTimezones" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </optgroup>
            <optgroup :label="t.other">
              <option v-for="tz in otherTimezones" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </optgroup>
          </select>
        </div>

        <!-- Location Type -->
        <div class="field">
          <label>{{ t.locationType }} <span class="required">*</span></label>
          <div class="toggle-group">
            <button
              type="button"
              :class="['toggle-btn', form.location_type === 'venue' && 'active']"
              @click="form.location_type = 'venue'"
            >
              {{ t.inPerson }}
            </button>
            <button
              type="button"
              :class="['toggle-btn', form.location_type === 'online' && 'active']"
              @click="form.location_type = 'online'"
            >
              {{ t.online }}
            </button>
          </div>
        </div>

        <!-- Venue Fields -->
        <template v-if="form.location_type === 'venue'">
          <div class="field">
            <label>{{ t.venueName }} <span class="required">*</span></label>
            <input v-model="form.location.name" type="text" :placeholder="t.venueNamePlaceholder" />
          </div>
          <div class="field-row">
            <div class="field">
              <label>{{ t.city }}</label>
              <input v-model="form.location.city" type="text" :placeholder="t.cityPlaceholder" />
            </div>
            <div class="field flex-2">
              <label>{{ t.streetAddress }}</label>
              <input v-model="form.location.address" type="text" :placeholder="t.streetAddressPlaceholder" />
            </div>
          </div>
        </template>

        <!-- Online Fields -->
        <template v-if="form.location_type === 'online'">
          <div class="field">
            <label>{{ t.platform }} <span class="required">*</span></label>
            <select v-model="form.location.platform">
              <option value="">{{ t.selectPlatform }}</option>
              <option v-for="p in onlinePlatforms" :key="p.value" :value="p.value">
                {{ p.label }}
              </option>
            </select>
          </div>
          <div class="field">
            <label>{{ t.eventUrl }}</label>
            <input v-model="form.location.url" type="url" placeholder="https://..." />
            <span class="field-hint">{{ t.addLaterHint }}</span>
          </div>
        </template>

        <!-- Ticket Type -->
        <div class="field">
          <label>{{ t.ticketType }}</label>
          <div class="toggle-group">
            <button
              type="button"
              :class="['toggle-btn', form.seating_type === 'general_admission' && 'active']"
              @click="form.seating_type = 'general_admission'"
            >
              {{ t.generalAdmission }}
            </button>
            <button
              type="button"
              :class="['toggle-btn', form.seating_type === 'seated' && 'active']"
              @click="form.seating_type = 'seated'"
            >
              {{ t.seatedEvent }}
            </button>
          </div>
          <span class="field-hint">{{ form.seating_type === 'seated' ? t.seatedShort : t.gaShort }}</span>
        </div>
      </div>

      <!-- Step 2: Details -->
      <div v-show="currentStep === 1" class="step-panel">
        <!-- Media (Main Image + Gallery) -->
        <div class="field">
          <AdminEventMediaStep
            :event-slug="eventSlug"
            :initial-data="mediaData"
            @upload-main-image="handleMainImageUpload"
            @upload-gallery-image="handleGalleryImageUpload"
            @add-video="handleAddVideo"
            @remove-gallery-image="handleRemoveGalleryImage"
            @remove-video="handleRemoveVideo"
          />
        </div>

        <!-- Description -->
        <div class="field">
          <label>{{ t.description }} <span class="optional">({{ t.optional }})</span></label>
          <AdminRichTextEditor
            v-model="form.description"
            :placeholder="t.descriptionPlaceholder"
          />
        </div>

        <!-- Organizer -->
        <div class="field">
          <label>{{ t.organizer }} <span class="optional">({{ t.optional }})</span></label>
          <input v-model="form.organizer_name" type="text" :placeholder="t.organizerNamePlaceholder" />
        </div>

        <!-- Event Settings -->
        <div class="field">
          <label>{{ t.settings }} <span class="optional">({{ t.optional }})</span></label>
          <div class="settings-list">
            <label class="setting-item">
              <input type="checkbox" v-model="form.is_private" />
              <span class="setting-content">
                <strong>{{ t.privateEvent }}</strong>
                <span>{{ t.privateEventDesc }}</span>
              </span>
            </label>
            <label class="setting-item">
              <input type="checkbox" v-model="form.show_remaining" />
              <span class="setting-content">
                <strong>{{ t.showRemaining }}</strong>
                <span>{{ t.showRemainingDesc }}</span>
              </span>
            </label>
          </div>
        </div>

        <!-- FAQ -->
        <div class="field">
          <div class="label-row">
            <label>{{ t.faq }} <span class="optional">({{ t.optional }})</span></label>
            <button
              v-if="form.faq_items.length < 10"
              type="button"
              class="add-link"
              @click="addFaqItem"
            >
              + {{ t.addFaq }}
            </button>
          </div>

          <div v-if="form.faq_items.length === 0" class="empty-state">
            {{ t.noFaqHint }}
          </div>

          <div v-for="(faq, index) in form.faq_items" :key="index" class="faq-item">
            <div class="faq-header">
              <span class="faq-number">Q{{ index + 1 }}</span>
              <button type="button" @click="removeFaqItem(index)" class="remove-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input v-model="faq.question" type="text" :placeholder="t.questionPlaceholder" />
            <textarea v-model="faq.answer" rows="2" :placeholder="t.answerPlaceholder"></textarea>
          </div>
        </div>

      </div>

      <!-- Step 3: Review & Publish -->
      <div v-show="currentStep === 2" class="step-panel">
        <div class="review-preview">
          <!-- Event Card Preview -->
          <div class="preview-card">
            <div class="preview-image" :style="previewImageStyle">
              <div v-if="!hasPreviewImage" class="no-image">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span v-if="selectedGroup" class="preview-badge" :style="{ backgroundColor: selectedGroup.color }">
                {{ selectedGroup.name }}
              </span>
            </div>
            <div class="preview-content">
              <h2 class="preview-title">{{ form.name || t.untitled }}</h2>
              <div class="preview-meta">
                <div class="meta-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formattedDate }}</span>
                </div>
                <div class="meta-item">
                  <svg v-if="form.location_type === 'venue'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{{ locationPreview }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Checklist -->
          <div class="publish-checklist">
            <div :class="['checklist-item', form.name && 'complete']">
              <div class="check-icon">
                <svg v-if="form.name" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span>{{ t.eventName }}</span>
            </div>
            <div :class="['checklist-item', form.starts_at && 'complete']">
              <div class="check-icon">
                <svg v-if="form.starts_at" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span>{{ t.dateTime }}</span>
            </div>
            <div :class="['checklist-item', hasLocation && 'complete']">
              <div class="check-icon">
                <svg v-if="hasLocation" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span>{{ t.location }}</span>
            </div>
            <div :class="['checklist-item', form.group_id && 'complete']">
              <div class="check-icon">
                <svg v-if="form.group_id" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span>{{ t.group }}</span>
            </div>
            <div :class="['checklist-item', form.description && 'complete']">
              <div class="check-icon">
                <svg v-if="form.description" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span>{{ t.description }}</span>
            </div>
          </div>

          <!-- Ready Message -->
          <div v-if="canPublish" class="ready-message">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong>{{ t.readyToPublish }}</strong>
              <p>{{ t.readyMessage }}</p>
            </div>
          </div>
          <div v-else class="not-ready-message">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <strong>{{ t.almostThere }}</strong>
              <p>{{ t.completeRequired }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="form-error">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </div>

    <!-- Navigation -->
    <div class="form-navigation">
      <button
        v-if="currentStep > 0"
        type="button"
        class="btn-back"
        @click="previousStep"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t.back }}
      </button>
      <div v-else></div>

      <div class="nav-actions">
        <template v-if="currentStep < 2">
          <button
            type="button"
            class="btn-continue"
            @click="nextStep"
            :disabled="!canProceedToNext"
          >
            {{ t.continue }}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="btn-draft"
            @click="handleSaveDraft"
            :disabled="submitting"
          >
            {{ t.saveAsDraft }}
          </button>
          <button
            type="button"
            class="btn-publish"
            @click="handlePublish"
            :disabled="!canPublish || submitting"
          >
            <svg v-if="submitting" class="spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ submitting ? t.publishing : t.publishEvent }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { MEXICO_TIMEZONES, ALL_TIMEZONES, getTimezoneLabel as getTzLabel, isoToLocal, localToISO } from '~/utils/dateTime'
import { ONLINE_PLATFORMS, getEmptyVenueLocation, getEmptyOnlineLocation, formatLocation, getPlatformLabel } from '~/utils/location'
import { translateError } from '~/utils/errorTranslations'

const { t: createT, language } = useLanguage()

const translations = {
  // Steps
  step: { es: 'Paso', en: 'Step' },
  of: { es: 'de', en: 'of' },
  essentials: { es: 'Lo Esencial', en: 'The Essentials' },
  details: { es: 'Los Detalles', en: 'The Details' },
  reviewPublish: { es: 'Revisar y Publicar', en: 'Review & Publish' },
  draftSaved: { es: 'Guardado', en: 'Saved' },

  // Step 1
  eventNamePlaceholder: { es: 'Nombre del evento...', en: 'Event name...' },
  startDateTime: { es: 'Fecha/hora de inicio', en: 'Start date/time' },
  endDateTime: { es: 'Fecha/hora de fin', en: 'End date/time' },
  timezone: { es: 'Zona horaria', en: 'Timezone' },
  mexico: { es: 'México', en: 'Mexico' },
  other: { es: 'Otros', en: 'Other' },
  locationType: { es: 'Tipo de ubicación', en: 'Location type' },
  inPerson: { es: 'Presencial', en: 'In Person' },
  online: { es: 'En Línea', en: 'Online' },
  venueName: { es: 'Nombre del lugar', en: 'Venue name' },
  venueNamePlaceholder: { es: 'Ej: Centro de Convenciones', en: 'E.g. Convention Center' },
  city: { es: 'Ciudad', en: 'City' },
  cityPlaceholder: { es: 'Ciudad...', en: 'City...' },
  streetAddress: { es: 'Dirección', en: 'Address' },
  streetAddressPlaceholder: { es: 'Calle y número...', en: 'Street address...' },
  platform: { es: 'Plataforma', en: 'Platform' },
  selectPlatform: { es: 'Seleccionar plataforma', en: 'Select platform' },
  eventUrl: { es: 'URL del evento', en: 'Event URL' },
  addLaterHint: { es: 'Puedes agregarlo después', en: 'You can add this later' },
  group: { es: 'Grupo', en: 'Group' },
  selectGroup: { es: 'Seleccionar grupo', en: 'Select group' },
  ticketType: { es: 'Tipo de boletos', en: 'Ticket type' },
  generalAdmission: { es: 'Admisión General', en: 'General Admission' },
  gaShort: { es: 'Boletos individuales', en: 'Individual tickets' },
  seatedEvent: { es: 'Con Mesas', en: 'Seated' },
  seatedShort: { es: 'Mesas con lugares asignados', en: 'Tables with assigned seats' },

  // Step 2
  tellPeopleAbout: { es: 'Cuéntale a la gente sobre tu evento', en: 'Tell people about your event' },
  descriptionPlaceholder: { es: '¿De qué trata? ¿Por qué deberían asistir?', en: "What's it about? Why should they attend?" },
  optional: { es: 'opcional', en: 'optional' },
  organizer: { es: 'Organizador', en: 'Organizer' },
  organizerNamePlaceholder: { es: 'Ej: Fundación Escolar, Comité de Padres...', en: 'E.g. School Foundation, Parent Committee...' },
  settings: { es: 'Configuración', en: 'Settings' },
  privateEvent: { es: 'Evento privado', en: 'Private event' },
  privateEventDesc: { es: 'Solo visible con enlace directo', en: 'Only visible with direct link' },
  showRemaining: { es: 'Mostrar disponibilidad', en: 'Show availability' },
  showRemainingDesc: { es: 'Muestra cuántos boletos quedan', en: 'Shows how many tickets are left' },
  faq: { es: 'Preguntas frecuentes', en: 'FAQ' },
  addFaq: { es: 'Agregar', en: 'Add' },
  noFaqHint: { es: 'Sin preguntas agregadas', en: 'No questions added' },
  questionPlaceholder: { es: 'Pregunta...', en: 'Question...' },
  answerPlaceholder: { es: 'Respuesta...', en: 'Answer...' },

  // Step 3
  untitled: { es: 'Sin título', en: 'Untitled' },
  eventName: { es: 'Nombre del evento', en: 'Event name' },
  dateTime: { es: 'Fecha y hora', en: 'Date & time' },
  location: { es: 'Ubicación', en: 'Location' },
  description: { es: 'Descripción', en: 'Description' },
  readyToPublish: { es: '¡Listo para publicar!', en: 'Ready to publish!' },
  readyMessage: { es: 'Tu evento tiene todo lo necesario', en: 'Your event has everything it needs' },
  almostThere: { es: 'Casi listo', en: 'Almost there' },
  completeRequired: { es: 'Completa los campos requeridos', en: 'Complete the required fields' },

  // Navigation
  back: { es: 'Atrás', en: 'Back' },
  continue: { es: 'Continuar', en: 'Continue' },
  saveAsDraft: { es: 'Guardar borrador', en: 'Save as draft' },
  publishEvent: { es: 'Publicar evento', en: 'Publish event' },
  publishing: { es: 'Publicando...', en: 'Publishing...' },

  // Errors
  failedToSave: { es: 'Error al guardar', en: 'Failed to save' },
  failedToPublish: { es: 'Error al publicar', en: 'Failed to publish' }
}

const t = createT(translations)

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['draft', 'publish', 'slug-created'])

const { getGroups } = useGroups()
const { createEvent, updateEvent, addMedia, removeMedia, uploadEventImage } = useEvents()

// State
const currentStep = ref(0)
const submitting = ref(false)
const error = ref('')
const savedSlug = ref(props.initialData?.slug || '')
const groups = ref([])
const nameInputRef = ref(null)

// Detect timezone
const detectTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'America/Mexico_City'
  }
}

// Form data
const form = reactive({
  name: '',
  group_id: '',
  seating_type: 'general_admission',
  starts_at: '',
  ends_at: '',
  timezone: detectTimezone(),
  location_type: 'venue',
  location: getEmptyVenueLocation(),
  description: '',
  organizer_name: '',
  is_private: false,
  show_remaining: true,
  faq_items: []
})

const mediaData = reactive({
  image_url: '',
  media: { images: [], videos: [] }
})

// Pending image file (not yet uploaded)
const pendingImageFile = ref(null)

// Computed
const stepTitle = computed(() => {
  const titles = [t.essentials, t.details, t.reviewPublish]
  return titles[currentStep.value]
})

const eventSlug = computed(() => savedSlug.value || props.initialData?.slug)

const mexicoTimezones = computed(() => MEXICO_TIMEZONES)
const otherTimezones = computed(() => ALL_TIMEZONES.filter(tz => !MEXICO_TIMEZONES.some(m => m.value === tz.value)))
const onlinePlatforms = computed(() => ONLINE_PLATFORMS)

const selectedGroup = computed(() => groups.value.find(g => g.id === form.group_id))

const hasLocation = computed(() => {
  if (form.location_type === 'venue') {
    return !!form.location.name
  }
  return !!form.location.platform
})

const canProceedToNext = computed(() => {
  if (currentStep.value === 0) {
    return form.name && form.starts_at && form.group_id && hasLocation.value
  }
  return true
})

const canPublish = computed(() => {
  return form.name && form.starts_at && form.group_id && hasLocation.value
})

const formattedDate = computed(() => {
  if (!form.starts_at) return '—'
  try {
    return new Date(form.starts_at).toLocaleDateString(language.value === 'es' ? 'es-MX' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  } catch {
    return form.starts_at
  }
})

const locationPreview = computed(() => {
  if (form.location_type === 'venue') {
    return form.location.name || '—'
  }
  return getPlatformLabel(form.location.platform) || '—'
})

const previewImageStyle = computed(() => {
  // Show pending file preview first, then existing image
  if (pendingImageFile.value) {
    return { backgroundImage: `url('${URL.createObjectURL(pendingImageFile.value)}')` }
  }
  if (mediaData.image_url) {
    return { backgroundImage: `url('${mediaData.image_url}')` }
  }
  return {}
})

const hasPreviewImage = computed(() => {
  return !!pendingImageFile.value || !!mediaData.image_url
})

// Methods
const nextStep = async () => {
  if (currentStep.value === 0 && !eventSlug.value) {
    // Auto-save draft before moving to step 2
    await autoSaveDraft()
  }
  if (currentStep.value < 2) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const autoSaveDraft = async () => {
  if (eventSlug.value) return // Already saved

  try {
    const data = prepareData()
    data.status = 'draft'
    const response = await createEvent(data)
    savedSlug.value = response.event.slug
    emit('slug-created', savedSlug.value)
  } catch (e) {
    error.value = translateError(e.message, language.value) || t.failedToSave
  }
}

const prepareData = () => {
  return {
    name: form.name,
    group_id: form.group_id,
    seating_type: form.seating_type,
    starts_at: form.starts_at ? localToISO(form.starts_at) : null,
    ends_at: form.ends_at ? localToISO(form.ends_at) : null,
    timezone: form.timezone,
    location_type: form.location_type,
    location: form.location,
    description: form.description || null,
    organizer_name: form.organizer_name || null,
    is_private: form.is_private,
    show_remaining: form.show_remaining,
    faq_items: form.faq_items.filter(f => f.question && f.answer)
  }
}

const handleSaveDraft = async () => {
  submitting.value = true
  error.value = ''
  try {
    const data = prepareData()
    data.status = 'draft'

    let slug = eventSlug.value
    if (slug) {
      await updateEvent(slug, data)
    } else {
      const response = await createEvent(data)
      slug = response.event.slug
      savedSlug.value = slug
    }

    // Upload pending image if exists
    await uploadPendingImage(slug)

    emit('draft', { ...data, slug })
  } catch (e) {
    error.value = translateError(e.message, language.value) || t.failedToSave
  } finally {
    submitting.value = false
  }
}

const handlePublish = async () => {
  submitting.value = true
  error.value = ''
  try {
    const data = prepareData()
    data.status = 'live'

    let slug = eventSlug.value
    if (slug) {
      await updateEvent(slug, data)
    } else {
      const response = await createEvent(data)
      slug = response.event.slug
      savedSlug.value = slug
    }

    // Upload pending image if exists
    await uploadPendingImage(slug)

    emit('publish', { ...data, slug })
  } catch (e) {
    error.value = translateError(e.message, language.value) || t.failedToPublish
  } finally {
    submitting.value = false
  }
}

// FAQ helpers
const addFaqItem = () => {
  form.faq_items.push({ question: '', answer: '' })
}

const removeFaqItem = (index) => {
  form.faq_items.splice(index, 1)
}

// Main image handler
const handleMainImageUpload = (imageData) => {
  if (imageData.type === 'file') {
    pendingImageFile.value = imageData.file
  }
  // URL type not supported for main image upload currently
}

const uploadPendingImage = async (slug) => {
  if (!pendingImageFile.value || !slug) return

  try {
    const response = await uploadEventImage(slug, pendingImageFile.value)
    if (response.url) {
      mediaData.image_url = response.url
    }
    pendingImageFile.value = null
  } catch (e) {
    console.error('Failed to upload image:', e)
    error.value = translateError(e.message, language.value) || 'Failed to upload image'
  }
}

// Media handlers
const handleGalleryImageUpload = async (imageData) => {
  if (!eventSlug.value) return
  try {
    if (imageData.type === 'file') {
      const response = await addMedia(eventSlug.value, { type: 'image', file: imageData.file })
      if (response.event?.media?.images) {
        mediaData.media.images = response.event.media.images
      } else if (response.media?.images) {
        mediaData.media.images = response.media.images
      }
    }
  } catch (e) {
    error.value = translateError(e.message, language.value)
  }
}

const handleAddVideo = async (videoData) => {
  if (!eventSlug.value) return
  try {
    const response = await addMedia(eventSlug.value, { type: 'youtube', url: videoData.url })
    if (response.event?.media?.videos) {
      mediaData.media.videos = response.event.media.videos
    } else if (response.media?.videos) {
      mediaData.media.videos = response.media.videos
    }
  } catch (e) {
    error.value = translateError(e.message, language.value)
  }
}

const handleRemoveGalleryImage = async (data) => {
  if (!eventSlug.value) return
  try {
    await removeMedia(eventSlug.value, { type: 'images', index: data.index })
    mediaData.media.images.splice(data.index, 1)
  } catch (e) {
    error.value = translateError(e.message, language.value)
  }
}

const handleRemoveVideo = async (data) => {
  if (!eventSlug.value) return
  try {
    await removeMedia(eventSlug.value, { type: 'videos', index: data.index })
    mediaData.media.videos = []
  } catch (e) {
    error.value = translateError(e.message, language.value)
  }
}

// Location type change
watch(() => form.location_type, (newType) => {
  if (newType === 'venue') {
    form.location = getEmptyVenueLocation()
  } else {
    form.location = getEmptyOnlineLocation()
  }
})

// Load initial data
const loadInitialData = () => {
  if (props.initialData) {
    const data = props.initialData
    form.name = data.name || ''
    form.group_id = data.group_id || data.group?.id || ''
    form.seating_type = data.seating_type || 'general_admission'
    form.starts_at = data.starts_at ? isoToLocal(data.starts_at) : ''
    form.ends_at = data.ends_at ? isoToLocal(data.ends_at) : ''
    form.timezone = data.timezone || detectTimezone()
    form.location_type = data.location_type || 'venue'
    form.location = data.location || (data.location_type === 'online' ? getEmptyOnlineLocation() : getEmptyVenueLocation())
    form.description = data.description || ''
    form.organizer_name = data.organizer_name || ''
    form.is_private = data.is_private || false
    form.show_remaining = data.show_remaining !== false
    form.faq_items = data.faq_items || []

    mediaData.image_url = data.image_url || ''
    mediaData.media = data.media || { images: [], videos: [] }
  }
}

// Fetch groups
const fetchGroups = async () => {
  try {
    const response = await getGroups()
    groups.value = response.groups || []
  } catch (e) {
    console.error('Failed to load groups', e)
  }
}

onMounted(async () => {
  await fetchGroups()
  loadInitialData()

  // Focus name input on mount
  await nextTick()
  if (nameInputRef.value) {
    nameInputRef.value.focus()
  }
})
</script>

<style scoped>
.event-form-simple {
  --color-primary: #4f46e5;
  --color-primary-light: #e0e7ff;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --radius: 12px;
  --radius-sm: 8px;

  max-width: 640px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

/* Progress Bar */
.progress-bar {
  height: 3px;
  background: var(--color-border);
  border-radius: 2px;
  margin-bottom: 32px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

/* Step Header */
.step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.step-count {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.step-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  margin: 4px 0 0 0;
}

.saved-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #dcfce7;
  color: #166534;
  font-size: 13px;
  font-weight: 500;
  border-radius: 50px;
}

.saved-badge svg {
  width: 14px;
  height: 14px;
}

/* Form Content */
.form-content {
  margin-bottom: 24px;
}

.step-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Form Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.field label .required {
  color: var(--color-error);
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  transition: border-color 0.15s;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-text);
}

.field input::placeholder {
  color: #9ca3af;
}

.field .input-lg {
  font-size: 18px;
  font-weight: 500;
  padding: 14px 16px;
}

.field-hint {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* Field Row (side by side) */
.field-row {
  display: flex;
  gap: 16px;
}

.field-row .field {
  flex: 1;
}

.field-row .field.flex-2 {
  flex: 2;
}

/* Toggle Group */
.toggle-group {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  flex: 1;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.toggle-btn.active {
  background: var(--color-text);
  border-color: var(--color-text);
  color: white;
}

/* Step 2 Styles */
.optional {
  font-weight: 400;
  color: var(--color-text-muted);
}

/* Settings List */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--color-bg-subtle);
  border-radius: var(--radius-sm);
}

.setting-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.setting-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
  flex-shrink: 0;
  accent-color: var(--color-primary);
}

.setting-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.setting-content strong {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.3;
}

.setting-content span {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.4;
}

/* Label Row */
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.add-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
}

.add-link:hover {
  text-decoration: underline;
}

/* Empty State */
.empty-state {
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 16px;
  background: var(--color-bg-subtle);
  border-radius: var(--radius-sm);
  text-align: center;
}

.faq-item {
  padding: 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.faq-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.remove-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--color-text-muted);
}

.remove-btn:hover {
  color: var(--color-error);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.faq-item input,
.faq-item textarea {
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  margin-bottom: 8px;
}

.faq-item textarea {
  resize: vertical;
  margin-bottom: 0;
}

/* Review Preview */
.review-preview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-bg);
}

.preview-image {
  height: 160px;
  background: linear-gradient(135deg, var(--color-primary), #1e40af);
  background-size: cover;
  background-position: center;
  position: relative;
}

.preview-image .no-image {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image .no-image svg {
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.3);
}

.preview-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  border-radius: 50px;
  text-transform: uppercase;
}

.preview-content {
  padding: 16px;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.preview-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.meta-item svg {
  width: 16px;
  height: 16px;
}

/* Checklist */
.publish-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--color-bg-subtle);
  border-radius: var(--radius);
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.checklist-item.complete {
  color: var(--color-text);
}

.check-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  flex-shrink: 0;
}

.checklist-item.complete .check-icon {
  background: var(--color-success);
  border-color: var(--color-success);
}

.check-icon svg {
  width: 12px;
  height: 12px;
  color: white;
}

/* Ready Messages */
.ready-message,
.not-ready-message {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: var(--radius);
}

.ready-message {
  background: #dcfce7;
  color: #166534;
}

.not-ready-message {
  background: #fef3c7;
  color: #92400e;
}

.ready-message svg,
.not-ready-message svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.ready-message strong,
.not-ready-message strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
}

.ready-message p,
.not-ready-message p {
  font-size: 13px;
  margin: 4px 0 0 0;
  opacity: 0.8;
}

/* Error */
.form-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  color: var(--color-error);
  font-size: 14px;
  margin-bottom: 16px;
}

.form-error svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Navigation */
.form-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
}

.btn-back:hover {
  color: var(--color-text);
}

.btn-back svg {
  width: 18px;
  height: 18px;
}

.nav-actions {
  display: flex;
  gap: 12px;
}

.btn-continue {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: var(--color-text);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-continue:hover:not(:disabled) {
  background: #374151;
}

.btn-continue:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-continue svg {
  width: 18px;
  height: 18px;
}

.btn-draft {
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
}

.btn-draft:hover:not(:disabled) {
  color: var(--color-text);
}

.btn-publish {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: var(--color-text);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-publish:hover:not(:disabled) {
  background: #374151;
}

.btn-publish:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 640px) {
  .field-row {
    flex-direction: column;
    gap: 24px;
  }

  .toggle-group {
    flex-direction: column;
  }
}

@media (min-width: 640px) {
  .event-form-simple {
    padding: 32px 24px 48px;
  }

  .step-title {
    font-size: 32px;
  }
}
</style>
