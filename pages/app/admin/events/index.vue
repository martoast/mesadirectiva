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
        ➕ Create Event
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Total Events</p>
        <p class="text-4xl font-bold text-gray-900">{{ events.length }}</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Live Events</p>
        <p class="text-4xl font-bold text-success-600">{{ liveEvents.length }}</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Draft Events</p>
        <p class="text-4xl font-bold text-warning-600">{{ draftEvents.length }}</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Total Tickets Sold</p>
        <p class="text-4xl font-bold text-primary-600">{{ totalTicketsSold }}</p>
      </div>
    </div>

    <!-- Table/Cards -->
    <div class="bg-white rounded-xl shadow-card">
      <!-- Desktop Table -->
      <div class="hidden md:block">
        <AdminEventTable
          v-if="events.length > 0"
          :events="events"
          @delete="handleDelete"
        />
        <div v-else class="p-12 text-center">
          <p class="text-gray-600 text-lg">No events yet.</p>
          <NuxtLink
            to="/app/admin/events/create"
            class="text-primary-600 hover:text-primary-700 font-semibold mt-2 inline-block"
          >
            Create your first event →
          </NuxtLink>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden p-4 space-y-4">
        <AdminEventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          @delete="handleDelete"
        />
        <div v-if="events.length === 0" class="p-12 text-center">
          <p class="text-gray-600 text-lg">No events yet.</p>
          <NuxtLink
            to="/app/admin/events/create"
            class="text-primary-600 hover:text-primary-700 font-semibold mt-2 inline-block"
          >
            Create your first event →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
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
import { ref, computed } from 'vue'
import { useMockEvents } from '~/composables/useMockEvents'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'

definePageMeta({
  layout: 'admin'
})

const { getEvents, deleteEvent } = useMockEvents()
const events = ref(getEvents())
const deleteModalOpen = ref(false)
const eventToDelete = ref(null)

const liveEvents = computed(() => events.value.filter(e => e.status === 'live'))
const draftEvents = computed(() => events.value.filter(e => e.status === 'draft'))
const totalTicketsSold = computed(() => events.value.reduce((sum, e) => sum + e.ticketsSold, 0))

const handleDelete = (slug) => {
  eventToDelete.value = slug
  deleteModalOpen.value = true
}

const confirmDelete = () => {
  if (eventToDelete.value) {
    deleteEvent(eventToDelete.value)
    events.value = getEvents()
    deleteModalOpen.value = false
    eventToDelete.value = null
  }
}
</script>
