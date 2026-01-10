<template>
  <div class="relative h-96 md:h-screen overflow-hidden bg-gradient-to-br from-primary-600 to-primary-900">
    <!-- Background Image -->
    <div
      v-if="event.image_url"
      class="absolute inset-0 bg-cover bg-center opacity-40"
      :style="{
        backgroundImage: `url('${event.image_url}')`
      }"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-30" />

    <!-- Content -->
    <div class="relative h-full flex flex-col items-center justify-center text-center px-4">
      <div class="max-w-3xl">
        <!-- Group Badge -->
        <div v-if="event.group" class="mb-4">
          <span
            class="inline-block px-4 py-1 rounded-full text-sm font-semibold text-white"
            :style="{ backgroundColor: event.group.color }"
          >
            {{ event.group.name }}
          </span>
        </div>

        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {{ event.name }}
        </h1>
        <p v-if="truncatedDescription" class="text-xl md:text-2xl text-gray-100 mb-8 drop-shadow-md">
          {{ truncatedDescription }}
        </p>

        <!-- Event Meta -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-6 text-white mb-8">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📅</span>
            <div class="text-left">
              <p class="text-sm opacity-80">{{ t.dateTime }}</p>
              <p class="font-semibold">{{ formattedDateTime }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ event.location_type === 'online' ? '💻' : '📍' }}</span>
            <div class="text-left">
              <p class="text-sm opacity-80">{{ event.location_type === 'online' ? t.onlineEvent : t.location }}</p>
              <p class="font-semibold">{{ formattedLocation }}</p>
            </div>
          </div>
        </div>

        <!-- Ticket Info -->
        <div v-if="lowestPrice !== null" class="inline-block bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-8 py-4 border border-white border-opacity-20">
          <p class="text-gray-200 text-sm mb-1">{{ t.startingAt }}</p>
          <p class="text-4xl font-bold text-white">${{ formatPrice(lowestPrice) }}</p>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
      <span class="text-white text-2xl">↓</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatEventDateTime } from '~/utils/dateTime'
import { formatLocation } from '~/utils/location'
import { truncateText } from '~/utils/html'

const { t: createT, language } = useLanguage()

const translations = {
  dateTime: { es: 'Fecha y Hora', en: 'Date & Time' },
  onlineEvent: { es: 'Evento en Línea', en: 'Online Event' },
  location: { es: 'Ubicación', en: 'Location' },
  startingAt: { es: 'Desde', en: 'Starting at' }
}

const t = createT(translations)

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  tiers: {
    type: Array,
    default: () => []
  }
})

const truncatedDescription = computed(() => {
  if (!props.event.description) return ''
  return truncateText(props.event.description, 150)
})

const formattedDateTime = computed(() => {
  return formatEventDateTime(
    props.event.starts_at,
    props.event.ends_at,
    props.event.timezone
  )
})

const formattedLocation = computed(() => {
  return formatLocation(props.event.location_type, props.event.location)
})

const lowestPrice = computed(() => {
  if (!props.tiers || props.tiers.length === 0) return null
  const activeTiers = props.tiers.filter(t => t.is_active && !t.is_hidden)
  if (activeTiers.length === 0) return null
  return Math.min(...activeTiers.map(t => Number(t.price)))
})

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}
</script>
