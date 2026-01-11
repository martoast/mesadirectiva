<template>
  <div class="create-event-page">
    <!-- Minimal Header -->
    <div class="page-header">
      <NuxtLink to="/app/admin/events" class="back-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Simplified Event Form -->
    <AdminEventFormSimple
      @draft="handleSaveDraft"
      @publish="handlePublish"
      @slug-created="handleSlugCreated"
    />

    <!-- Success Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSuccessModal" class="modal-backdrop" @click.self="closeSuccessModal">
          <div class="success-modal">
            <div class="modal-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3>{{ successData.isPublished ? t.eventPublished : t.eventCreated }}</h3>
            <p>{{ successData.isPublished ? t.eventLiveNow : t.eventSavedDraft }}</p>

            <!-- Floor Plan CTA for seated events -->
            <div v-if="successData.isSeated" class="floor-plan-prompt">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <div>
                <strong>{{ t.nextStep }}</strong>
                <span>{{ t.setupFloorPlanDesc }}</span>
              </div>
            </div>

            <div class="modal-actions">
              <button v-if="successData.isSeated" class="btn-primary" @click="goToFloorPlan">
                {{ t.setupFloorPlan }}
              </button>
              <button v-else class="btn-primary" @click="goToEvent">
                {{ t.viewEvent }}
              </button>
              <button class="btn-secondary" @click="closeSuccessModal">
                {{ successData.isSeated ? t.doLater : t.close }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()
const { t: createT } = useLanguage()

const translations = {
  eventPublished: { es: '¡Evento publicado!', en: 'Event published!' },
  eventCreated: { es: 'Borrador guardado', en: 'Draft saved' },
  eventLiveNow: { es: 'Tu evento está en vivo', en: 'Your event is now live' },
  eventSavedDraft: { es: 'Puedes continuar editándolo después', en: 'You can continue editing later' },
  nextStep: { es: 'Siguiente paso', en: 'Next step' },
  setupFloorPlanDesc: { es: 'Configura las mesas de tu evento', en: 'Set up your event tables' },
  setupFloorPlan: { es: 'Configurar mesas', en: 'Set up tables' },
  viewEvent: { es: 'Ver evento', en: 'View event' },
  doLater: { es: 'Hacer después', en: 'Do later' },
  close: { es: 'Cerrar', en: 'Close' }
}

const t = createT(translations)

const createdSlug = ref('')
const showSuccessModal = ref(false)
const successData = reactive({
  isPublished: false,
  isSeated: false,
  slug: ''
})

const handleSlugCreated = (slug) => {
  createdSlug.value = slug
}

const handleSaveDraft = async (eventData) => {
  const slug = eventData.slug || createdSlug.value
  if (slug) {
    router.push(`/app/admin/events/${slug}`)
  }
}

const handlePublish = async (eventData) => {
  const slug = eventData.slug || createdSlug.value
  if (slug) {
    if (eventData.seating_type === 'seated') {
      successData.isPublished = true
      successData.isSeated = true
      successData.slug = slug
      showSuccessModal.value = true
    } else {
      router.push(`/app/admin/events/${slug}`)
    }
  }
}

const goToEvent = () => {
  if (successData.slug) {
    router.push(`/app/admin/events/${successData.slug}`)
  }
}

const goToFloorPlan = () => {
  if (successData.slug) {
    router.push(`/app/admin/events/${successData.slug}/floor-plan`)
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  if (successData.slug) {
    router.push(`/app/admin/events/${successData.slug}`)
  }
}
</script>

<style scoped>
.create-event-page {
  min-height: 100vh;
  background: #ffffff;
}

/* Minimal Header */
.page-header {
  position: fixed;
  top: 0;
  right: 0;
  padding: 16px;
  z-index: 40;
}

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 50%;
  color: #6b7280;
  transition: all 0.2s;
}

.back-link:hover {
  background: #e5e7eb;
  color: #111827;
}

.back-link svg {
  width: 20px;
  height: 20px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.success-modal {
  width: 100%;
  max-width: 380px;
  padding: 32px 24px;
  background: white;
  border-radius: 20px;
  text-align: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  border-radius: 50%;
}

.modal-icon svg {
  width: 32px;
  height: 32px;
  color: #16a34a;
}

.success-modal h3 {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.success-modal > p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

/* Floor Plan Prompt */
.floor-plan-prompt {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 24px;
  background: #f0fdf4;
  border-radius: 12px;
  text-align: left;
}

.floor-plan-prompt svg {
  width: 24px;
  height: 24px;
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 2px;
}

.floor-plan-prompt strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.floor-plan-prompt span {
  font-size: 13px;
  color: #6b7280;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #111827;
  border: none;
  color: white;
}

.btn-primary:hover {
  background: #1f2937;
}

.btn-secondary {
  background: transparent;
  border: none;
  color: #6b7280;
}

.btn-secondary:hover {
  color: #111827;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .success-modal,
.modal-leave-active .success-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .success-modal,
.modal-leave-to .success-modal {
  transform: scale(0.95);
  opacity: 0;
}
</style>
