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
      <div class="relative min-h-[500px] md:min-h-[600px] overflow-hidden bg-gradient-to-br from-primary-600 to-primary-900">
        <div
          v-if="event.hero_image_url"
          class="absolute inset-0 bg-cover bg-center opacity-40"
          :style="{ backgroundImage: `url('${event.hero_image_url}')` }"
        />
        <div class="absolute inset-0 bg-black opacity-30" />

        <div class="relative h-full flex flex-col items-center justify-center text-center px-4 py-20">
          <div class="max-w-3xl">
            <div v-if="event.category" class="mb-4">
              <span
                class="inline-block px-4 py-1 rounded-full text-sm font-semibold text-white"
                :style="{ backgroundColor: event.category.color }"
              >
                {{ event.category.name }}
              </span>
            </div>

            <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {{ event.hero_title || event.name }}
            </h1>
            <p class="text-xl md:text-2xl text-gray-100 mb-8 drop-shadow-md">
              {{ event.hero_subtitle || event.description }}
            </p>

            <div class="flex flex-col md:flex-row items-center justify-center gap-6 text-white mb-8">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📅</span>
                <div class="text-left">
                  <p class="text-sm opacity-80">Date & Time</p>
                  <p class="font-semibold">{{ formatDate(event.date) }} at {{ event.time }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-2xl">📍</span>
                <div class="text-left">
                  <p class="text-sm opacity-80">Location</p>
                  <p class="font-semibold">{{ event.location }}</p>
                </div>
              </div>
            </div>

            <div class="inline-block bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-8 py-4 border border-white border-opacity-20 mb-6">
              <p class="text-gray-200 text-sm mb-1">Starting at</p>
              <p class="text-4xl font-bold text-white">${{ event.price }}</p>
            </div>

            <div>
              <button
                v-if="availability?.can_purchase"
                @click="navigateTo(`/app/events/${event.slug}/checkout`)"
                class="px-8 py-4 bg-success-600 text-white text-lg font-bold rounded-lg hover:bg-success-700 transition-colors shadow-lg"
              >
                {{ event.hero_cta_text || 'Buy Tickets' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <!-- Left Column: Content -->
          <div class="flex-1 space-y-16">
            <!-- About Section -->
            <section>
              <h2 class="text-3xl font-bold text-gray-900 mb-6">
                {{ event.about_title || 'About This Event' }}
              </h2>
              <div class="flex flex-col md:flex-row gap-8" :class="{ 'md:flex-row-reverse': event.about_image_position === 'left' }">
                <div class="flex-1">
                  <div v-if="event.about_content" class="prose prose-lg max-w-none" v-html="event.about_content"></div>
                  <p v-else class="text-gray-600 whitespace-pre-wrap leading-relaxed text-lg">{{ event.about }}</p>
                </div>
                <div v-if="event.about_image_url" class="md:w-80 flex-shrink-0">
                  <img :src="event.about_image_url" alt="About" class="w-full rounded-xl shadow-lg" />
                </div>
              </div>
            </section>

            <!-- Highlights Section -->
            <section v-if="event.highlights?.length > 0">
              <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Event Highlights</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(highlight, index) in event.highlights"
                  :key="index"
                  class="bg-white rounded-xl shadow-card p-6 text-center hover:shadow-card-hover transition-shadow"
                >
                  <div v-if="highlight.icon" class="text-4xl mb-4">
                    {{ getIconEmoji(highlight.icon) }}
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{{ highlight.title }}</h3>
                  <p v-if="highlight.description" class="text-gray-600">{{ highlight.description }}</p>
                </div>
              </div>
            </section>

            <!-- Schedule Section -->
            <section v-if="event.schedule?.length > 0">
              <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Event Schedule</h2>
              <div class="max-w-2xl mx-auto">
                <div class="relative">
                  <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-200"></div>
                  <div
                    v-for="(item, index) in event.schedule"
                    :key="index"
                    class="relative pl-12 pb-8 last:pb-0"
                  >
                    <div class="absolute left-2 w-5 h-5 bg-primary-600 rounded-full border-4 border-white shadow"></div>
                    <div class="bg-white rounded-xl shadow-card p-4">
                      <p class="text-primary-600 font-bold text-lg">{{ item.time }}</p>
                      <h3 class="text-xl font-bold text-gray-900">{{ item.title }}</h3>
                      <p v-if="item.description" class="text-gray-600 mt-1">{{ item.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Gallery Section -->
            <section v-if="event.gallery_images?.length > 0">
              <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Gallery</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in event.gallery_images"
                  :key="index"
                  class="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  @click="openGallery(index)"
                >
                  <img :src="image" :alt="`Gallery image ${index + 1}`" class="w-full h-full object-cover" />
                </div>
              </div>
            </section>

            <!-- FAQ Section -->
            <section v-if="event.faq_items?.length > 0">
              <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
              <div class="max-w-2xl mx-auto space-y-4">
                <div
                  v-for="(faq, index) in event.faq_items"
                  :key="index"
                  class="bg-white rounded-xl shadow-card overflow-hidden"
                >
                  <button
                    @click="toggleFaq(index)"
                    class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span class="font-semibold text-gray-900">{{ faq.question }}</span>
                    <svg
                      class="w-5 h-5 text-gray-500 transform transition-transform"
                      :class="{ 'rotate-180': openFaqs.includes(index) }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div v-show="openFaqs.includes(index)" class="px-6 pb-4">
                    <p class="text-gray-600">{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Venue & Contact Section -->
            <section v-if="hasVenueInfo">
              <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Venue & Contact</h2>
              <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-card p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div v-if="event.venue_name || event.venue_address">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span class="text-xl">📍</span> Venue
                    </h3>
                    <p v-if="event.venue_name" class="text-lg font-semibold text-gray-900">{{ event.venue_name }}</p>
                    <p v-if="event.venue_address" class="text-gray-600 mt-1">{{ event.venue_address }}</p>
                    <a
                      v-if="event.venue_map_url"
                      :href="event.venue_map_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-block mt-3 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium"
                    >
                      View on Map
                    </a>
                  </div>
                  <div v-if="event.contact_email || event.contact_phone">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span class="text-xl">📞</span> Contact
                    </h3>
                    <p v-if="event.contact_email" class="text-gray-600">
                      <a :href="`mailto:${event.contact_email}`" class="text-primary-600 hover:underline">
                        {{ event.contact_email }}
                      </a>
                    </p>
                    <p v-if="event.contact_phone" class="text-gray-600 mt-2">
                      <a :href="`tel:${event.contact_phone}`" class="text-primary-600 hover:underline">
                        {{ event.contact_phone }}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Sticky CTA -->
          <div class="lg:w-80">
            <PublicTicketCTA :event="event" :availability="availability" />
          </div>
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
                <p class="text-sm text-gray-600 mb-3">{{ formatDate(relatedEvent.date) }}</p>
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

      <!-- Gallery Modal -->
      <div
        v-if="galleryOpen"
        class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
        @click.self="galleryOpen = false"
      >
        <button
          @click="galleryOpen = false"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <button
          v-if="galleryIndex > 0"
          @click="galleryIndex--"
          class="absolute left-4 text-white hover:text-gray-300"
        >
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <img
          :src="event.gallery_images[galleryIndex]"
          alt="Gallery"
          class="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        <button
          v-if="galleryIndex < event.gallery_images.length - 1"
          @click="galleryIndex++"
          class="absolute right-4 text-white hover:text-gray-300"
        >
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
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
import { ref, computed, onMounted } from 'vue'

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

// FAQ accordion state
const openFaqs = ref([])

// Gallery modal state
const galleryOpen = ref(false)
const galleryIndex = ref(0)

const hasVenueInfo = computed(() => {
  return event.value?.venue_name || event.value?.venue_address ||
         event.value?.contact_email || event.value?.contact_phone
})

const toggleFaq = (index) => {
  const idx = openFaqs.value.indexOf(index)
  if (idx === -1) {
    openFaqs.value.push(index)
  } else {
    openFaqs.value.splice(idx, 1)
  }
}

const openGallery = (index) => {
  galleryIndex.value = index
  galleryOpen.value = true
}

// Simple icon name to emoji mapping
const getIconEmoji = (iconName) => {
  const iconMap = {
    utensils: '🍽️',
    music: '🎵',
    gift: '🎁',
    star: '⭐',
    heart: '❤️',
    camera: '📷',
    users: '👥',
    clock: '🕐',
    calendar: '📅',
    map: '🗺️',
    drink: '🍸',
    wine: '🍷',
    dance: '💃',
    microphone: '🎤',
    award: '🏆',
    ticket: '🎟️',
    car: '🚗',
    parking: '🅿️',
    wifi: '📶',
    coffee: '☕'
  }
  return iconMap[iconName?.toLowerCase()] || '✨'
}

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
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
