<template>
  <section class="py-16 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- Content -->
        <div class="md:col-span-2">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
          <div class="prose prose-lg max-w-none">
            <p class="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {{ event.description }}
            </p>
          </div>

          <!-- Event Details Grid -->
          <div class="mt-12 grid grid-cols-2 gap-6">
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Event Date</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatDate(event.starts_at) }}</p>
              <p class="text-gray-600 mt-1">{{ formatTime(event.starts_at, event.timezone) }}</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">
                {{ event.location_type === 'online' ? 'Platform' : 'Location' }}
              </p>
              <p class="text-2xl font-bold text-gray-900">{{ locationName }}</p>
              <p v-if="locationDetail" class="text-gray-600 text-sm mt-1">{{ locationDetail }}</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Tickets Available</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalAvailable }}</p>
              <p v-if="totalCapacity" class="text-gray-600 text-sm mt-1">of {{ totalCapacity }} total</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Price</p>
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
              <p class="font-semibold text-success-900">Event Status</p>
            </div>
            <p class="text-success-800">
              {{ event.status === 'live' ? 'Live & Accepting Tickets' : 'Coming Soon' }}
            </p>
          </div>

          <!-- Sales Progress -->
          <div v-if="totalCapacity > 0" class="p-6 bg-gray-50 rounded-xl">
            <p class="text-sm font-semibold text-gray-600 uppercase mb-3">Ticket Sales</p>
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
              {{ totalSold }} of {{ totalCapacity }} tickets sold
            </p>
            <p class="text-lg font-bold text-primary-600 mt-2">
              {{ salesPercentage }}% Sold
            </p>
          </div>

          <!-- Organizer Info -->
          <div v-if="event.organizer_name" class="mt-6 p-6 bg-gray-50 rounded-xl">
            <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Organized by</p>
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

const locationName = computed(() => {
  const loc = props.event.location
  if (!loc) return 'TBA'

  if (props.event.location_type === 'online') {
    return getPlatformLabel(loc.platform) || 'Online'
  }
  return loc.name || loc.city || 'Venue TBA'
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
  const total = activeTiers.value.reduce((sum, t) => {
    if (t.available === null || t.available === undefined) return sum
    return sum + t.available
  }, 0)

  const hasUnlimited = activeTiers.value.some(t => t.available === null || t.available === undefined)
  if (hasUnlimited && total === 0) return 'Unlimited'
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
  if (lowestPrice.value === null) return 'TBA'
  if (lowestPrice.value === 0 && highestPrice.value === 0) return 'Free'
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
