<template>
  <div>
    <div v-if="event">
      <!-- Hero Section -->
      <PublicEventHero :event="event" />

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto px-4 py-8">
        <!-- Left Column: About -->
        <div class="flex-1">
          <PublicEventAbout :event="event" />
        </div>

        <!-- Right Column: CTA -->
        <div class="lg:w-80">
          <PublicTicketCTA :event="event" />
        </div>
      </div>

      <!-- Related Events Section -->
      <section class="bg-gray-50 py-16 px-4 mt-12">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Other Events You Might Like</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="relatedEvent in relatedEvents"
              :key="relatedEvent.id"
              class="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-200"
            >
              <div class="h-40 bg-gradient-to-br from-primary-400 to-primary-600" />
              <div class="p-4">
                <h3 class="font-bold text-gray-900 mb-2">{{ relatedEvent.name }}</h3>
                <p class="text-sm text-gray-600 mb-3">
                  📅 {{ formatDate(relatedEvent.date) }}
                </p>
                <p class="text-lg font-bold text-primary-600 mb-3">${{ relatedEvent.price }}</p>
                <NuxtLink
                  :to="`/app/events/${relatedEvent.slug}`"
                  class="block w-full px-3 py-2 bg-primary-100 text-primary-700 rounded-lg text-center font-semibold hover:bg-primary-200 transition-colors"
                >
                  View →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Loading State -->
    <div v-else class="py-24 text-center">
      <p class="text-gray-600 text-xl">Loading event...</p>
    </div>

    <!-- Not Found State -->
    <div v-if="notFound" class="py-24 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
      <p class="text-gray-600 mb-6">Sorry, we couldn't find the event you're looking for.</p>
      <NuxtLink
        to="/app/events"
        class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
      >
        ← Back to Events
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMockEvents } from '~/composables/useMockEvents'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { getEventBySlug, getEvents } = useMockEvents()
const event = computed(() => getEventBySlug(route.params.slug))
const notFound = computed(() => !event.value)

const relatedEvents = computed(() => {
  if (!event.value) return []
  return getEvents()
    .filter(e => e.slug !== event.value.slug && e.status === 'live')
    .slice(0, 3)
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
