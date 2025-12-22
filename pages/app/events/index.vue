<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-600 to-primary-900 py-16 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Amazing Events
        </h1>
        <p class="text-xl text-gray-100 max-w-2xl mx-auto">
          Find and book tickets to the best events happening near you. From concerts to conferences, we've got you covered.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="bg-white border-b border-gray-200 py-6 px-4 sticky top-16 z-30">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div class="flex items-center gap-2 text-gray-600">
          <span class="font-medium">{{ meta.total || 0 }} Events</span>
        </div>
        <div class="flex gap-2 flex-wrap justify-center">
          <button
            @click="selectedCategory = null"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            All Events
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.slug"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedCategory === category.slug
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="py-12 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="i in 6"
            :key="i"
            class="bg-white rounded-xl shadow-card overflow-hidden animate-pulse"
          >
            <div class="h-48 bg-gray-200" />
            <div class="p-6 space-y-4">
              <div class="h-6 bg-gray-200 rounded w-3/4" />
              <div class="h-4 bg-gray-200 rounded w-1/2" />
              <div class="h-4 bg-gray-200 rounded w-2/3" />
              <div class="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <p class="text-2xl font-bold text-gray-900 mb-2">Error Loading Events</p>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="fetchEvents"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="events.length === 0" class="text-center py-16">
          <p class="text-2xl font-bold text-gray-900 mb-2">No Events Found</p>
          <p class="text-gray-600">
            Check back soon for more events!
          </p>
        </div>

        <!-- Event Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="event in events"
            :key="event.id"
            class="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-200 group"
          >
            <!-- Image -->
            <div class="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
              <div
                v-if="event.hero_image_url"
                class="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                :style="{
                  backgroundImage: `url('${event.hero_image_url}')`
                }"
              />
              <div class="absolute inset-0 bg-black bg-opacity-20" />
              <div v-if="event.category" class="absolute top-4 left-4">
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                  :style="{ backgroundColor: event.category.color }"
                >
                  {{ event.category.name }}
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
                    {{ event.tickets_available }} / {{ event.max_tickets }} available
                  </span>
                  <span class="text-xs font-semibold text-gray-900">
                    {{ Math.round((event.tickets_sold / event.max_tickets) * 100) }}% sold
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary-600 h-2 rounded-full transition-all"
                    :style="{
                      width: `${(event.tickets_sold / event.max_tickets) * 100}%`
                    }"
                  />
                </div>
              </div>

              <!-- CTA Button -->
              <NuxtLink
                :to="`/app/events/${event.slug}`"
                class="block w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-center"
              >
                View Event
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="meta.last_page > 1" class="mt-8 flex justify-center gap-2">
          <button
            v-for="page in meta.last_page"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              currentPage === page
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

const { getPublicEvents } = useEvents()
const { getCategories } = useCategories()

const events = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref('')
const selectedCategory = ref(null)
const currentPage = ref(1)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 12,
  total: 0
})

const fetchCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.categories || []
  } catch (e) {
    // Categories are optional, continue without them
  }
}

const fetchEvents = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = {
      per_page: 12,
      page: currentPage.value
    }

    if (selectedCategory.value) {
      params.category = selectedCategory.value
    }

    const response = await getPublicEvents(params)
    events.value = response.events || []
    meta.value = response.meta || meta.value
  } catch (e) {
    error.value = e.message || 'Failed to load events'
  } finally {
    loading.value = false
  }
}

// Watch for filter/page changes
watch([selectedCategory, currentPage], () => {
  if (selectedCategory.value !== null) {
    currentPage.value = 1
  }
  fetchEvents()
}, { deep: true })

// Reset page when category changes
watch(selectedCategory, () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchCategories()
  fetchEvents()
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
