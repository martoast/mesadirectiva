<template>
  <div class="create-event-page">
    <!-- Page Header -->
    <div class="page-header">
      <NuxtLink to="/app/admin/events" class="back-link">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Events</span>
      </NuxtLink>
      <h1>Create New Event</h1>
      <p>Set up your event in just a few steps</p>
    </div>

    <!-- Event Form -->
    <AdminEventForm
      @draft="handleSaveDraft"
      @publish="handlePublish"
      @slug-created="handleSlugCreated"
    />

    <!-- Success Modal (for seated events without tables) -->
    <div v-if="showSuccessModal" class="modal-backdrop" @click.self="closeSuccessModal">
      <div class="success-modal">
        <div class="modal-icon success">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3>{{ successData.isPublished ? 'Event Published!' : 'Event Created!' }}</h3>
        <p v-if="successData.isPublished">Your event is now live and ready for attendees.</p>
        <p v-else>Your event has been saved as a draft.</p>

        <!-- Floor Plan CTA for seated events -->
        <div v-if="successData.isSeated && !successData.hasTables" class="floor-plan-prompt">
          <div class="prompt-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div class="prompt-content">
            <strong>Set up your floor plan</strong>
            <p>Arrange tables and configure seating for your event</p>
          </div>
        </div>

        <div class="modal-actions">
          <button v-if="successData.isSeated && !successData.hasTables" class="btn-primary" @click="goToFloorPlan">
            Set Up Floor Plan
          </button>
          <button v-else class="btn-primary" @click="goToEvent">
            View Event
          </button>
          <button class="btn-secondary" @click="closeSuccessModal">
            {{ successData.isSeated && !successData.hasTables ? 'Skip for Now' : 'Close' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <Transition name="toast">
      <div v-if="error" class="error-toast">
        <span>{{ error }}</span>
        <button @click="error = ''" class="toast-close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()

const error = ref('')
const createdSlug = ref('')
const showSuccessModal = ref(false)
const successData = reactive({
  isPublished: false,
  isSeated: false,
  hasTables: false,
  slug: ''
})

// Track when slug is created via auto-save
const handleSlugCreated = (slug) => {
  createdSlug.value = slug
}

const handleSaveDraft = async (eventData) => {
  error.value = ''

  // Event was already saved by the form, just navigate
  const slug = eventData.slug || createdSlug.value
  if (slug) {
    router.push(`/app/admin/events/${slug}`)
  }
}

const handlePublish = async (eventData) => {
  error.value = ''

  const slug = eventData.slug || createdSlug.value
  if (slug) {
    // Check if it's a seated event that might need floor plan setup
    if (eventData.seating_type === 'seated') {
      successData.isPublished = true
      successData.isSeated = true
      successData.hasTables = false // We don't know yet, user can skip
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
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #111827;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 0.9375rem;
  color: #6b7280;
}

/* Success Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.success-modal {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  text-align: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-icon.success {
  background: #d1fae5;
  color: #059669;
}

.success-modal h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.success-modal > p {
  font-size: 0.9375rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Floor Plan Prompt */
.floor-plan-prompt {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.08) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  text-align: left;
}

.prompt-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  color: #6366f1;
  flex-shrink: 0;
}

.prompt-content strong {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.125rem;
}

.prompt-content p {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #6366f1;
  border: none;
  color: white;
}

.btn-primary:hover {
  background: #4f46e5;
}

.btn-secondary {
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

.btn-secondary:hover {
  background: #f9fafb;
  color: #111827;
}

/* Error Toast */
.error-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #1a1a1a;
  color: white;
  border-radius: 10px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
  z-index: 1000;
}

.toast-close {
  padding: 4px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
}

.toast-close:hover {
  color: white;
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
</style>
