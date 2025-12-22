<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Events</h1>
        <p class="text-gray-600 mt-1">Manage all your events and ticket sales</p>
      </div>
      <NuxtLink
        to="/app/admin/events/create"
        class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
      >
        + Create Event
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center">
      <select
        v-model="filterStatus"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="live">Live</option>
        <option value="closed">Closed</option>
      </select>
      <select
        v-model="filterCategory"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Total Events</p>
        <p class="text-4xl font-bold text-gray-900">{{ meta.total }}</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Live Events</p>
        <p class="text-4xl font-bold text-success-600">{{ liveCount }}</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Draft Events</p>
        <p class="text-4xl font-bold text-warning-600">{{ draftCount }}</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Total Tickets Sold</p>
        <p class="text-4xl font-bold text-primary-600">{{ totalTicketsSold }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading events...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl shadow-card p-12 text-center">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="fetchEvents"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Try Again
      </button>
    </div>

    <!-- Table/Cards -->
    <div v-else class="bg-white rounded-xl shadow-card">
      <!-- Desktop Table -->
      <div class="hidden md:block">
        <AdminEventTable
          v-if="events.length > 0"
          :events="events"
          :has-permission="hasPermission"
          :is-super-admin="isSuperAdmin"
          @delete="handleDelete"
          @publish="handlePublish"
          @close="handleClose"
        />
        <div v-else class="p-12 text-center">
          <p class="text-gray-600 text-lg">No events yet.</p>
          <NuxtLink
            to="/app/admin/events/create"
            class="text-primary-600 hover:text-primary-700 font-semibold mt-2 inline-block"
          >
            Create your first event
          </NuxtLink>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden p-4 space-y-4">
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
        <div v-if="events.length === 0" class="p-12 text-center">
          <p class="text-gray-600 text-lg">No events yet.</p>
          <NuxtLink
            to="/app/admin/events/create"
            class="text-primary-600 hover:text-primary-700 font-semibold mt-2 inline-block"
          >
            Create your first event
          </NuxtLink>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="p-4 border-t border-gray-200 flex justify-center gap-2">
        <button
          v-for="page in meta.last_page"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
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
import { ref, computed, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { getEvents, deleteEvent, publishEvent, closeEvent } = useEvents()
const { getCategories } = useCategories()
const { hasPermission, isSuperAdmin } = useAuth()

const events = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref('')
const deleteModalOpen = ref(false)
const eventToDelete = ref(null)
const filterStatus = ref('')
const filterCategory = ref('')
const currentPage = ref(1)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

// Simple counts from current page (for full stats, would need separate API call)
const liveCount = computed(() => events.value.filter(e => e.status === 'live').length)
const draftCount = computed(() => events.value.filter(e => e.status === 'draft').length)
const totalTicketsSold = computed(() => events.value.reduce((sum, e) => sum + (e.tickets_sold || 0), 0))

const fetchCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.categories || []
  } catch (e) {
    // Categories are optional for filtering
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

    if (filterCategory.value) {
      params.category_id = filterCategory.value
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
watch([filterStatus, filterCategory], () => {
  currentPage.value = 1
  fetchEvents()
})

watch(currentPage, () => {
  fetchEvents()
})

onMounted(() => {
  fetchCategories()
  fetchEvents()
})
</script>
