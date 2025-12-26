<template>
  <div class="edit-event-page">
    <!-- Page Header -->
    <div class="page-header">
      <NuxtLink :to="`/app/admin/events/${route.params.slug}`" class="back-link">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Event</span>
      </NuxtLink>

      <template v-if="event">
        <h1>Edit Event</h1>
        <div class="event-info">
          <span class="event-name">{{ event.name }}</span>
          <span
            :class="[
              'status-badge',
              event.status === 'live' ? 'status-live' :
              event.status === 'closed' ? 'status-closed' : 'status-draft'
            ]"
          >
            {{ event.status }}
          </span>
        </div>
      </template>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p>Loading event...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="error-state">
      <p>{{ loadError }}</p>
      <NuxtLink to="/app/admin/events" class="back-btn">Back to Events</NuxtLink>
    </div>

    <!-- Event Form -->
    <AdminEventForm
      v-else-if="event"
      :initial-data="event"
      @draft="handleSave"
      @publish="handleSaveAndPublish"
    />

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
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const router = useRouter()
const { getEvent, updateEvent, publishEvent } = useEvents()

const event = ref(null)
const loading = ref(true)
const loadError = ref('')
const error = ref('')

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
  // EventForm now handles the API call, just navigate
  const slug = eventData.slug || route.params.slug
  router.push(`/app/admin/events/${slug}`)
}

const handleSaveAndPublish = async (eventData) => {
  error.value = ''
  // EventForm now handles the API call, just navigate
  const slug = eventData.slug || route.params.slug
  router.push(`/app/admin/events/${slug}`)
}

onMounted(() => {
  fetchEvent()
})
</script>

<style scoped>
.edit-event-page {
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

.event-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.event-name {
  font-size: 0.9375rem;
  color: #6b7280;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border-radius: 9999px;
}

.status-draft {
  background: #fef3c7;
  color: #92400e;
}

.status-live {
  background: #d1fae5;
  color: #065f46;
}

.status-closed {
  background: #f3f4f6;
  color: #374151;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.spinner {
  width: 40px;
  height: 40px;
  color: #6366f1;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 0.9375rem;
  color: #6b7280;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.error-state p {
  font-size: 0.9375rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.back-btn {
  padding: 0.625rem 1.25rem;
  background: #6366f1;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #4f46e5;
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
