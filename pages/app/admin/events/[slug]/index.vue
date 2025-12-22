<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <NuxtLink
      to="/app/admin/events"
      class="text-primary-600 hover:text-primary-700 font-semibold inline-block"
    >
      ← Back to Events
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading event...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Event Content -->
    <template v-else-if="event">
      <!-- Header with Actions -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900">{{ event.name }}</h1>
          <div class="flex items-center gap-3 mt-2">
            <span
              :class="[
                'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                statusClass
              ]"
            >
              {{ statusLabel }}
            </span>
            <span
              v-if="event.category"
              class="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
              :style="{ backgroundColor: event.category.color }"
            >
              {{ event.category.name }}
            </span>
          </div>
        </div>
        <div class="flex gap-3 w-full sm:w-auto flex-wrap">
          <!-- Publish/Close buttons -->
          <button
            v-if="event.status === 'draft'"
            @click="handlePublish"
            :disabled="actionLoading"
            class="flex-1 sm:flex-none px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-semibold disabled:opacity-50"
          >
            {{ actionLoading ? 'Publishing...' : 'Publish' }}
          </button>
          <button
            v-if="event.status === 'live'"
            @click="handleClose"
            :disabled="actionLoading"
            class="flex-1 sm:flex-none px-6 py-3 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors font-semibold disabled:opacity-50"
          >
            {{ actionLoading ? 'Closing...' : 'Close Event' }}
          </button>
          <NuxtLink
            :to="`/app/admin/events/${event.slug}/edit`"
            class="flex-1 sm:flex-none px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-semibold text-center"
          >
            Edit
          </NuxtLink>
          <button
            @click="handleDelete"
            class="flex-1 sm:flex-none px-6 py-3 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors font-semibold"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Event Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info Card -->
          <div class="bg-white rounded-xl shadow-card p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Event Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Event Name</p>
                <p class="text-lg text-gray-900">{{ event.name }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Location</p>
                <p class="text-lg text-gray-900">{{ event.location }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Date</p>
                <p class="text-lg text-gray-900">{{ formatDate(event.date) }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Time</p>
                <p class="text-lg text-gray-900">{{ event.time }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Ticket Price</p>
                <p class="text-lg text-gray-900">${{ event.price }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Max Capacity</p>
                <p class="text-lg text-gray-900">{{ event.max_tickets }} tickets</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Registration</p>
                <p class="text-lg text-gray-900">{{ event.registration_open ? 'Open' : 'Closed' }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Registration Deadline</p>
                <p class="text-lg text-gray-900">{{ event.registration_deadline ? formatDate(event.registration_deadline) : 'Not set' }}</p>
              </div>
            </div>
          </div>

          <!-- Page Design Card -->
          <div class="bg-white rounded-xl shadow-card p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Page Design</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Hero Title</p>
                <p class="text-gray-900">{{ event.hero_title }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Hero Subtitle</p>
                <p class="text-gray-900">{{ event.hero_subtitle }}</p>
              </div>
              <div v-if="event.hero_image_url">
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Hero Image</p>
                <img :src="event.hero_image_url" alt="Hero" class="w-full max-w-md rounded-lg" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Description</p>
                <p class="text-gray-600 whitespace-pre-wrap">{{ event.about || event.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Stats & Preview -->
        <div class="space-y-6">
          <!-- Stats Card -->
          <div class="bg-white rounded-xl shadow-card p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Sales Statistics</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Tickets Sold</p>
                <p class="text-4xl font-bold text-primary-600">{{ event.tickets_sold }}</p>
                <p class="text-sm text-gray-600 mt-1">of {{ event.max_tickets }} total</p>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="bg-primary-600 h-3 rounded-full transition-all"
                  :style="{
                    width: `${(event.tickets_sold / event.max_tickets) * 100}%`
                  }"
                />
              </div>
              <p class="text-sm text-gray-600">
                {{ Math.round((event.tickets_sold / event.max_tickets) * 100) }}% capacity
              </p>
              <div class="pt-4 border-t">
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Tickets Available</p>
                <p class="text-3xl font-bold text-success-600">{{ event.tickets_available }}</p>
              </div>
              <div class="pt-4 border-t">
                <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Estimated Revenue</p>
                <p class="text-3xl font-bold text-success-600">
                  ${{ (event.tickets_sold * event.price).toLocaleString() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Public Link Card -->
          <div class="bg-white rounded-xl shadow-card p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Public Page</h2>
            <NuxtLink
              :to="`/app/events/${event.slug}`"
              target="_blank"
              class="block p-4 bg-primary-50 border-2 border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <p class="text-sm font-semibold text-primary-700">View Public Page</p>
              <p class="text-xs text-primary-600 mt-1">Opens in new tab</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <!-- Delete Modal -->
    <UiConfirmModal
      :is-open="deleteModalOpen"
      title="Delete Event"
      message="Are you sure you want to delete this event? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const router = useRouter()
const { getEvent, deleteEvent, publishEvent, closeEvent } = useEvents()

const event = ref(null)
const loading = ref(true)
const error = ref('')
const actionLoading = ref(false)
const deleteModalOpen = ref(false)

const statusClass = computed(() => {
  const classes = {
    draft: 'bg-warning-100 text-warning-800',
    live: 'bg-success-100 text-success-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return classes[event.value?.status] || classes.draft
})

const statusLabel = computed(() => {
  const labels = {
    draft: 'Draft',
    live: 'Live',
    closed: 'Closed'
  }
  return labels[event.value?.status] || 'Draft'
})

const fetchEvent = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getEvent(route.params.slug)
    event.value = response.event
  } catch (e) {
    error.value = e.message || 'Failed to load event'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const handlePublish = async () => {
  actionLoading.value = true
  try {
    await publishEvent(event.value.slug)
    await fetchEvent()
  } catch (e) {
    error.value = e.message || 'Failed to publish event'
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
    error.value = e.message || 'Failed to close event'
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
    error.value = e.message || 'Failed to delete event'
  }
  deleteModalOpen.value = false
}

onMounted(() => {
  fetchEvent()
})
</script>
