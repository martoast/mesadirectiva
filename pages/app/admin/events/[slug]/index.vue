<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <NuxtLink
      to="/app/admin/events"
      class="text-primary-600 hover:text-primary-700 font-semibold inline-block"
    >
      ← Back to Events
    </NuxtLink>

    <!-- Header with Actions -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div v-if="event" class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900">{{ event.name }}</h1>
        <p class="text-gray-600 mt-2">
          <span
            :class="[
              'inline-block px-3 py-1 rounded-full text-xs font-semibold',
              event.status === 'live'
                ? 'bg-success-100 text-success-800'
                : 'bg-warning-100 text-warning-800'
            ]"
          >
            {{ event.status === 'live' ? '🔴 Live' : '📝 Draft' }}
          </span>
        </p>
      </div>
      <div v-if="event" class="flex gap-3 w-full sm:w-auto">
        <NuxtLink
          :to="`/app/admin/events/${event.slug}/edit`"
          class="flex-1 sm:flex-none px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-semibold text-center"
        >
          ✏️ Edit
        </NuxtLink>
        <button
          @click="handleDelete"
          class="flex-1 sm:flex-none px-6 py-3 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors font-semibold"
        >
          🗑️ Delete
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="event" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Event Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Info Card -->
        <BaseCard>
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
              <p class="text-lg text-gray-900">{{ event.maxTickets }} tickets</p>
            </div>
          </div>
        </BaseCard>

        <!-- Page Design Card -->
        <BaseCard>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Page Design</h2>
          <div class="space-y-4">
            <div>
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Hero Title</p>
              <p class="text-gray-900">{{ event.heroTitle }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Hero Subtitle</p>
              <p class="text-gray-900">{{ event.heroSubtitle }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Description</p>
              <p class="text-gray-600 whitespace-pre-wrap">{{ event.about }}</p>
            </div>
          </div>
        </BaseCard>

        <!-- Stripe Info -->
        <BaseCard>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
          <div class="space-y-4">
            <div>
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Stripe Product ID</p>
              <p class="text-gray-900 font-mono text-sm">
                {{ event.stripeProductId || '(Not set yet)' }}
              </p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Stripe Price ID</p>
              <p class="text-gray-900 font-mono text-sm">
                {{ event.stripePriceId || '(Not set yet)' }}
              </p>
            </div>
            <p class="text-sm text-gray-600 pt-4 border-t">
              💡 Stripe integration will be set up when you publish to production.
            </p>
          </div>
        </BaseCard>
      </div>

      <!-- Right Column: Stats & Preview -->
      <div class="space-y-6">
        <!-- Stats Card -->
        <BaseCard>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Sales Statistics</h2>
          <div class="space-y-4">
            <div>
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Tickets Sold</p>
              <p class="text-4xl font-bold text-primary-600">{{ event.ticketsSold }}</p>
              <p class="text-sm text-gray-600 mt-1">of {{ event.maxTickets }} total</p>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="bg-primary-600 h-3 rounded-full transition-all"
                :style="{
                  width: `${(event.ticketsSold / event.maxTickets) * 100}%`
                }"
              />
            </div>
            <p class="text-sm text-gray-600">
              {{ Math.round((event.ticketsSold / event.maxTickets) * 100) }}% capacity
            </p>
            <div class="pt-4 border-t">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Estimated Revenue</p>
              <p class="text-3xl font-bold text-success-600">
                ${{ event.ticketsSold * event.price }}
              </p>
            </div>
          </div>
        </BaseCard>

        <!-- Public Link Card -->
        <BaseCard>
          <h2 class="text-xl font-bold text-gray-900 mb-4">Public Page</h2>
          <NuxtLink
            :to="`/app/events/${event.slug}`"
            target="_blank"
            class="block p-4 bg-primary-50 border-2 border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <p class="text-sm font-semibold text-primary-700">View Public Page</p>
            <p class="text-xs text-primary-600 mt-1">Opens in new tab</p>
          </NuxtLink>
        </BaseCard>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600">Loading event...</p>
    </div>

    <!-- Delete Modal -->
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
import BaseCard from '~/components/ui/BaseCard.vue'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const { getEventBySlug, deleteEvent } = useMockEvents()
const event = computed(() => getEventBySlug(route.params.slug))
const deleteModalOpen = ref(false)

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleDelete = () => {
  deleteModalOpen.value = true
}

const confirmDelete = () => {
  if (event.value) {
    deleteEvent(event.value.slug)
    navigateTo('/app/admin/events')
  }
}
</script>
