<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="py-24 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 text-xl">Loading event...</p>
    </div>

    <!-- Event Content -->
    <div v-else-if="event">
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
          <PublicTicketCTA :event="event" :availability="availability" />
        </div>
      </div>

      <!-- Related Events Section -->
      <section v-if="relatedEvents.length > 0" class="bg-gray-50 py-16 px-4 mt-12">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Other Events You Might Like</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="relatedEvent in relatedEvents"
              :key="relatedEvent.id"
              class="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-200"
            >
              <div
                class="h-40 bg-gradient-to-br from-primary-400 to-primary-600 bg-cover bg-center"
                :style="relatedEvent.hero_image_url ? { backgroundImage: `url('${relatedEvent.hero_image_url}')` } : {}"
              />
              <div class="p-4">
                <h3 class="font-bold text-gray-900 mb-2">{{ relatedEvent.name }}</h3>
                <p class="text-sm text-gray-600 mb-3">
                  {{ formatDate(relatedEvent.date) }}
                </p>
                <p class="text-lg font-bold text-primary-600 mb-3">${{ relatedEvent.price }}</p>
                <NuxtLink
                  :to="`/app/events/${relatedEvent.slug}`"
                  class="block w-full px-3 py-2 bg-primary-100 text-primary-700 rounded-lg text-center font-semibold hover:bg-primary-200 transition-colors"
                >
                  View
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found State -->
    <div v-else-if="notFound" class="py-24 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
      <p class="text-gray-600 mb-6">Sorry, we couldn't find the event you're looking for.</p>
      <NuxtLink
        to="/app/events"
        class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
      >
        Back to Events
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { getPublicEvent, checkAvailability, getPublicEvents } = useEvents()

const event = ref(null)
const availability = ref(null)
const relatedEvents = ref([])
const loading = ref(true)
const notFound = ref(false)

const fetchEvent = async () => {
  loading.value = true
  notFound.value = false

  try {
    const [eventResponse, availabilityResponse] = await Promise.all([
      getPublicEvent(route.params.slug),
      checkAvailability(route.params.slug)
    ])

    event.value = eventResponse.event
    availability.value = availabilityResponse

    // Fetch related events
    fetchRelatedEvents()
  } catch (e) {
    if (e.status === 404) {
      notFound.value = true
    }
  } finally {
    loading.value = false
  }
}

const fetchRelatedEvents = async () => {
  try {
    const response = await getPublicEvents({
      per_page: 4,
      category: event.value?.category?.slug
    })

    // Filter out current event and limit to 3
    relatedEvents.value = (response.events || [])
      .filter(e => e.slug !== route.params.slug)
      .slice(0, 3)
  } catch (e) {
    // Related events are optional
  }
}

onMounted(() => {
  fetchEvent()
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
