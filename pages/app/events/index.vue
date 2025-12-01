<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-600 to-primary-900 py-16 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          🎫 Discover Amazing Events
        </h1>
        <p class="text-xl text-gray-100 max-w-2xl mx-auto">
          Find and book tickets to the best events happening near you. From concerts to conferences, we've got you covered.
        </p>
      </div>
    </section>

    <!-- Filters & Sorting -->
    <section class="bg-white border-b border-gray-200 py-6 px-4 sticky top-16 z-30">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div class="flex items-center gap-2 text-gray-600">
          <span>📊</span>
          <span class="font-medium">{{ liveEvents.length }} Live Events</span>
        </div>
        <div class="flex gap-2">
          <button
            @click="filterStatus = null"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filterStatus === null
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            All Events
          </button>
          <button
            @click="filterStatus = 'live'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filterStatus === 'live'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            🔴 Live
          </button>
          <button
            @click="filterStatus = 'draft'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filterStatus === 'draft'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            📝 Draft
          </button>
        </div>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="py-12 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <!-- Empty State -->
        <div v-if="filteredEvents.length === 0" class="text-center py-16">
          <p class="text-2xl font-bold text-gray-900 mb-2">No Events Found</p>
          <p class="text-gray-600">
            {{ filterStatus === 'draft' ? 'No draft events yet.' : 'Check back soon for more events!' }}
          </p>
        </div>

        <!-- Event Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="event in filteredEvents"
            :key="event.id"
            class="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-200 group"
          >
            <!-- Image -->
            <div class="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
              <div
                class="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                :style="{
                  backgroundImage: `url('${event.heroImage}')`
                }"
              />
              <div class="absolute inset-0 bg-black bg-opacity-20" />
              <div class="absolute top-4 right-4">
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                    event.status === 'live'
                      ? 'bg-success-500 text-white'
                      : 'bg-warning-500 text-white'
                  ]"
                >
                  {{ event.status === 'live' ? '🔴 Live' : '📝 Draft' }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {{ event.name }}
              </h3>

              <!-- Meta Info -->
              <div class="space-y-2 mb-4 text-sm text-gray-600">
                <p class="flex items-center gap-2">
                  <span>📅</span>
                  {{ formatDate(event.date) }}
                </p>
                <p class="flex items-center gap-2">
                  <span>📍</span>
                  {{ event.location }}
                </p>
                <p class="flex items-center gap-2">
                  <span>⏰</span>
                  {{ event.time }}
                </p>
              </div>

              <!-- Ticket Info -->
              <div class="mb-4 pb-4 border-b border-gray-200">
                <p class="text-gray-600 text-sm mb-1">Starting at</p>
                <p class="text-2xl font-bold text-primary-600">${{ event.price }}</p>
              </div>

              <!-- Availability -->
              <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs text-gray-600 font-medium">
                    {{ event.maxTickets - event.ticketsSold }} / {{ event.maxTickets }} available
                  </span>
                  <span class="text-xs font-semibold text-gray-900">
                    {{ Math.round((event.ticketsSold / event.maxTickets) * 100) }}% sold
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary-600 h-2 rounded-full transition-all"
                    :style="{
                      width: `${(event.ticketsSold / event.maxTickets) * 100}%`
                    }"
                  />
                </div>
              </div>

              <!-- CTA Button -->
              <NuxtLink
                :to="`/app/events/${event.slug}`"
                class="block w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-center"
              >
                View Event →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMockEvents } from '~/composables/useMockEvents'

definePageMeta({
  layout: 'public'
})

const { getEvents } = useMockEvents()
const events = ref(getEvents())
const filterStatus = ref(null)

const liveEvents = computed(() => events.value.filter(e => e.status === 'live'))

const filteredEvents = computed(() => {
  if (filterStatus.value === null) {
    return events.value
  }
  return events.value.filter(e => e.status === filterStatus.value)
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
