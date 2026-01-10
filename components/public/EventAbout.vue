<template>
  <section class="py-16 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- Content -->
        <div class="md:col-span-2">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ t.aboutThisEvent }}</h2>
          <div class="prose prose-lg max-w-none">
            <!-- Render as HTML if it contains HTML tags, otherwise as plain text -->
            <div
              v-if="isHtmlContent"
              class="text-gray-600 leading-relaxed description-content"
              v-html="sanitizedDescription"
            ></div>
            <p v-else class="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {{ event.description }}
            </p>
          </div>

          <!-- Event Details Grid -->
          <div class="mt-12 grid grid-cols-2 gap-6">
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">{{ t.eventDate }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatDate(event.starts_at) }}</p>
              <p class="text-gray-600 mt-1">{{ formatTime(event.starts_at, event.timezone) }}</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">
                {{ event.location_type === 'online' ? t.platform : t.location }}
              </p>
              <p class="text-2xl font-bold text-gray-900">{{ locationName }}</p>
              <p v-if="locationDetail" class="text-gray-600 text-sm mt-1">{{ locationDetail }}</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">{{ t.ticketsAvailable }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalAvailable }}</p>
              <p v-if="totalCapacity" class="text-gray-600 text-sm mt-1">{{ t.ofTotal }} {{ totalCapacity }} {{ t.total }}</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">{{ t.price }}</p>
              <p class="text-2xl font-bold text-primary-600">{{ priceDisplay }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <!-- Status Badge -->
          <div class="mb-6 p-6 bg-success-50 rounded-xl border border-success-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">✅</span>
              <p class="font-semibold text-success-900">{{ t.eventStatus }}</p>
            </div>
            <p class="text-success-800">
              {{ event.status === 'live' ? t.liveAccepting : t.comingSoon }}
            </p>
          </div>

          <!-- Sales Progress -->
          <div v-if="totalCapacity > 0" class="p-6 bg-gray-50 rounded-xl">
            <p class="text-sm font-semibold text-gray-600 uppercase mb-3">{{ t.ticketSales }}</p>
            <div class="mb-3">
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  :style="{
                    width: `${salesPercentage}%`
                  }"
                />
              </div>
            </div>
            <p class="text-sm text-gray-600">
              {{ totalSold }} {{ t.ofTotal }} {{ totalCapacity }} {{ t.ticketsSold }}
            </p>
            <p class="text-lg font-bold text-primary-600 mt-2">
              {{ salesPercentage }}% {{ t.sold }}
            </p>
          </div>

          <!-- Organizer Info -->
          <div v-if="event.organizer_name" class="mt-6 p-6 bg-gray-50 rounded-xl">
            <p class="text-sm font-semibold text-gray-600 uppercase mb-2">{{ t.organizedBy }}</p>
            <p class="font-semibold text-gray-900">{{ event.organizer_name }}</p>
            <p v-if="event.organizer_description" class="text-gray-600 text-sm mt-1">
              {{ event.organizer_description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate as formatDateUtil, formatTime as formatTimeUtil } from '~/utils/dateTime'
import { getPlatformLabel } from '~/utils/location'
import { isHtml, sanitizeHtml } from '~/utils/html'

const { t: createT, language } = useLanguage()

const translations = {
  aboutThisEvent: { es: 'Acerca de Este Evento', en: 'About This Event' },
  eventDate: { es: 'Fecha del Evento', en: 'Event Date' },
  platform: { es: 'Plataforma', en: 'Platform' },
  location: { es: 'Ubicación', en: 'Location' },
  ticketsAvailable: { es: 'Boletos Disponibles', en: 'Tickets Available' },
  ofTotal: { es: 'de', en: 'of' },
  total: { es: 'total', en: 'total' },
  price: { es: 'Precio', en: 'Price' },
  eventStatus: { es: 'Estado del Evento', en: 'Event Status' },
  liveAccepting: { es: 'En Vivo y Aceptando Boletos', en: 'Live & Accepting Tickets' },
  comingSoon: { es: 'Próximamente', en: 'Coming Soon' },
  ticketSales: { es: 'Venta de Boletos', en: 'Ticket Sales' },
  ticketsSold: { es: 'boletos vendidos', en: 'tickets sold' },
  sold: { es: 'Vendido', en: 'Sold' },
  organizedBy: { es: 'Organizado por', en: 'Organized by' },
  free: { es: 'Gratis', en: 'Free' },
  tba: { es: 'Por Anunciar', en: 'TBA' },
  unlimited: { es: 'Ilimitados', en: 'Unlimited' }
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

// Check if description contains HTML
const isHtmlContent = computed(() => {
  return isHtml(props.event.description)
})

// Sanitized HTML for safe rendering
const sanitizedDescription = computed(() => {
  return sanitizeHtml(props.event.description || '')
})

const locationName = computed(() => {
  const loc = props.event.location
  if (!loc) return t.tba

  if (props.event.location_type === 'online') {
    return getPlatformLabel(loc.platform) || 'Online'
  }
  return loc.name || loc.city || t.tba
})

const locationDetail = computed(() => {
  const loc = props.event.location
  if (!loc) return ''

  if (props.event.location_type === 'online') {
    return ''
  }

  const parts = []
  if (loc.city) parts.push(loc.city)
  if (loc.state) parts.push(loc.state)
  return parts.join(', ')
})

const activeTiers = computed(() => {
  return props.tiers.filter(t => t.is_active && !t.is_hidden)
})

const totalAvailable = computed(() => {
  const total = activeTiers.value.reduce((sum, tier) => {
    if (tier.available === null || tier.available === undefined) return sum
    return sum + tier.available
  }, 0)

  const hasUnlimited = activeTiers.value.some(tier => tier.available === null || tier.available === undefined)
  if (hasUnlimited && total === 0) return t.unlimited
  if (hasUnlimited) return `${total}+`
  return total.toString()
})

const totalCapacity = computed(() => {
  const total = activeTiers.value.reduce((sum, t) => {
    if (!t.quantity) return sum
    return sum + t.quantity
  }, 0)
  return total
})

const totalSold = computed(() => {
  return activeTiers.value.reduce((sum, t) => sum + (t.sold || 0), 0)
})

const salesPercentage = computed(() => {
  if (!totalCapacity.value || totalCapacity.value === 0) return 0
  return Math.round((totalSold.value / totalCapacity.value) * 100)
})

const lowestPrice = computed(() => {
  if (activeTiers.value.length === 0) return null
  return Math.min(...activeTiers.value.map(t => Number(t.price)))
})

const highestPrice = computed(() => {
  if (activeTiers.value.length === 0) return null
  return Math.max(...activeTiers.value.map(t => Number(t.price)))
})

const priceDisplay = computed(() => {
  if (lowestPrice.value === null) return t.tba
  if (lowestPrice.value === 0 && highestPrice.value === 0) return t.free
  if (lowestPrice.value === highestPrice.value) {
    return `$${Number(lowestPrice.value).toFixed(2)}`
  }
  return `$${Number(lowestPrice.value).toFixed(2)} - $${Number(highestPrice.value).toFixed(2)}`
})

const formatDate = (dateStr) => {
  return formatDateUtil(dateStr, props.event.timezone)
}

const formatTime = (dateStr, timezone) => {
  return formatTimeUtil(dateStr, timezone)
}
</script>

<style scoped>
/* Styles for HTML description content */
.description-content :deep(p) {
  margin-bottom: 1em;
}

.description-content :deep(p:last-child) {
  margin-bottom: 0;
}

.description-content :deep(ul),
.description-content :deep(ol) {
  margin: 1em 0;
  padding-left: 1.5em;
}

.description-content :deep(ul) {
  list-style-type: disc;
}

.description-content :deep(ol) {
  list-style-type: decimal;
}

.description-content :deep(li) {
  margin-bottom: 0.5em;
}

.description-content :deep(strong),
.description-content :deep(b) {
  font-weight: 600;
}

.description-content :deep(em),
.description-content :deep(i) {
  font-style: italic;
}

.description-content :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
}

.description-content :deep(a:hover) {
  color: #4338ca;
}
</style>
