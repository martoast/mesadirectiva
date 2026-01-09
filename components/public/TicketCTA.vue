<template>
  <div>
    <!-- Mobile Sticky Bar -->
    <div
      class="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg p-4 z-40"
    >
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm text-gray-600">{{ priceLabel }}</p>
          <p class="text-2xl font-bold text-primary-600">${{ displayPrice }}</p>
        </div>
        <UiBaseButton
          v-if="canPurchase"
          @click="handleBuyTickets"
          variant="success"
          size="lg"
          class="flex-1"
        >
          {{ ctaText }}
        </UiBaseButton>
        <div v-else class="flex-1 text-center">
          <span class="text-sm font-medium text-gray-500">{{ blockedMessage }}</span>
        </div>
      </div>
    </div>

    <!-- Desktop Sidebar Card -->
    <div class="hidden md:block sticky top-24">
      <UiBaseCard class="border-2 border-primary-200">
        <!-- Pricing Display -->
        <div class="text-center mb-6">
          <p class="text-sm font-semibold text-gray-600 uppercase mb-2">{{ priceLabel }}</p>
          <p class="text-5xl font-bold text-primary-600 mb-1">${{ displayPrice }}</p>
          <p v-if="isSeatedEvent && hasTables" class="text-sm text-gray-600">
            {{ tablesAvailableCount }} {{ tablesAvailableCount === 1 ? 'table' : 'tables' }} available
          </p>
          <p v-else-if="isSeatedEvent" class="text-sm text-gray-600">Table reservations</p>
          <p v-else-if="hasTiers && activeTiers.length > 1" class="text-sm text-gray-600">Multiple tiers available</p>
          <p v-else class="text-sm text-gray-600">Individual ticket</p>
        </div>

        <!-- Tables Preview (Seated Events) -->
        <div v-if="isSeatedEvent && hasTables" class="mb-6">
          <p class="text-sm font-semibold text-gray-700 mb-3">Available Tables:</p>
          <div class="space-y-2">
            <div
              v-for="table in displayTables"
              :key="table.id"
              class="flex justify-between items-center p-2 rounded-lg bg-gray-50"
            >
              <div>
                <span class="text-sm font-medium text-gray-900">{{ table.name }}</span>
                <span class="ml-2 text-xs text-gray-500">{{ table.capacity }} seats</span>
              </div>
              <span class="font-semibold text-primary-600">${{ formatPrice(table.price) }}</span>
            </div>
            <p v-if="activeTables.length > 3" class="text-xs text-gray-500 text-center mt-2">
              +{{ activeTables.length - 3 }} more tables
            </p>
          </div>
        </div>

        <!-- Ticket Tiers Preview (General Admission with Tiers) -->
        <div v-else-if="hasTiers && !isSeatedEvent" class="mb-6">
          <p class="text-sm font-semibold text-gray-700 mb-3">Available Tiers:</p>
          <div class="space-y-2">
            <div
              v-for="tier in displayTiers"
              :key="tier.id"
              class="flex justify-between items-center p-2 rounded-lg bg-gray-50"
            >
              <div>
                <span class="text-sm font-medium text-gray-900">{{ tier.name }}</span>
                <span v-if="tier.available === 0" class="ml-2 text-xs text-red-600 font-semibold">SOLD OUT</span>
              </div>
              <span class="font-semibold text-primary-600">${{ formatPrice(tier.price) }}</span>
            </div>
            <p v-if="activeTiers.length > 3" class="text-xs text-gray-500 text-center mt-2">
              +{{ activeTiers.length - 3 }} more tiers
            </p>
          </div>
        </div>

        <!-- Availability Info (GA events only) -->
        <div v-if="showAvailabilityBar" class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-600 mb-2">
            {{ ticketsAvailable }} / {{ totalCapacity }} tickets remaining
          </p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full"
              :style="{
                width: `${soldPercentage}%`
              }"
            />
          </div>
        </div>

        <!-- Extra Items Preview (only show when can purchase) -->
        <div v-if="hasExtraItems && canPurchase" class="mb-6">
          <p class="text-sm font-semibold text-gray-700 mb-2">Available Add-ons:</p>
          <div class="space-y-2">
            <div
              v-for="item in extraItems.slice(0, 3)"
              :key="item.id"
              class="flex justify-between items-center text-sm"
            >
              <span class="text-gray-600">{{ item.name }}</span>
              <span class="font-medium text-gray-900">${{ item.price }}</span>
            </div>
          </div>
        </div>

        <UiBaseButton
          v-if="canPurchase"
          @click="handleBuyTickets"
          variant="success"
          size="lg"
          full-width
          class="mb-3"
        >
          {{ ctaText }}
        </UiBaseButton>

        <div v-else class="mb-3 text-center py-3 bg-gray-100 rounded-lg">
          <p class="text-gray-600 font-medium">{{ blockedMessage }}</p>
        </div>

        <p v-if="canPurchase" class="text-xs text-gray-500 text-center">
          Secure payment powered by Stripe
        </p>

        <!-- Event Quick Info -->
        <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div class="flex items-start gap-3">
            <span class="text-lg">📅</span>
            <div class="text-sm">
              <p class="text-gray-600">{{ formattedDate }}</p>
              <p class="font-semibold text-gray-900">{{ formattedTime }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-lg">{{ event.location_type === 'online' ? '💻' : '📍' }}</span>
            <div class="text-sm">
              <p class="font-semibold text-gray-900">{{ formattedLocation }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-lg">🎟️</span>
            <div class="text-sm">
              <p class="text-gray-600">
                {{ seatingTypeLabel }}
              </p>
            </div>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Padding for mobile bottom bar -->
    <div class="h-20 md:h-0" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDate, formatTime } from '~/utils/dateTime'
import { formatLocation } from '~/utils/location'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  availability: {
    type: Object,
    default: null
  }
})

const { getPublicTicketTiers } = useTicketTiers()
const { getPublicTables } = useTables()

const tiers = ref([])
const tables = ref([])
const tiersLoading = ref(false)
const tablesLoading = ref(false)

// Event type detection
const isSeatedEvent = computed(() => props.event?.seating_type === 'seated')

// === TIERS (General Admission) ===
const activeTiers = computed(() => {
  return tiers.value.filter(t => t.is_active && !t.is_hidden)
})

const hasTiers = computed(() => activeTiers.value.length > 0)

// Display tiers (first 3 active tiers)
const displayTiers = computed(() => activeTiers.value.slice(0, 3))

const lowestTierPrice = computed(() => {
  if (!hasTiers.value) return null
  return Math.min(...activeTiers.value.map(t => Number(t.price)))
})

// === TABLES (Seated Events) ===
const activeTables = computed(() => {
  return tables.value.filter(t => t.is_active && t.status !== 'sold')
})

const hasTables = computed(() => activeTables.value.length > 0)

const displayTables = computed(() => activeTables.value.slice(0, 3))

const tablesAvailableCount = computed(() => activeTables.value.length)

const lowestTablePrice = computed(() => {
  if (!hasTables.value) return null
  return Math.min(...activeTables.value.map(t => Number(t.price || 0)))
})

// === PRICING ===
const displayPrice = computed(() => {
  // For seated events, use table pricing
  if (isSeatedEvent.value) {
    if (lowestTablePrice.value !== null && lowestTablePrice.value > 0) {
      return lowestTablePrice.value.toFixed(2)
    }
    return '0.00'
  }
  // For GA events, use tier pricing
  if (hasTiers.value && lowestTierPrice.value !== null) {
    return lowestTierPrice.value.toFixed(2)
  }
  return '0.00'
})

const priceLabel = computed(() => {
  if (isSeatedEvent.value) {
    return hasTables.value ? 'Tables from' : 'Table reservations'
  }
  if (hasTiers.value && activeTiers.value.length > 1) return 'Starting from'
  return 'Price per Ticket'
})

const ctaText = computed(() => {
  if (isSeatedEvent.value) return 'Choose a Table'
  return 'Buy Tickets Now'
})

const canPurchase = computed(() => {
  return props.availability?.can_purchase ?? props.event.can_purchase ?? true
})

const blockedReason = computed(() => {
  return props.availability?.blocked_reason ?? props.event.purchase_blocked_reason
})

const blockedMessage = computed(() => {
  const messages = {
    not_live: 'Event not available',
    registration_closed: 'Registration closed',
    deadline_passed: 'Registration deadline passed',
    sold_out: 'Sold out',
    no_available_tickets: isSeatedEvent.value ? 'No tables available' : 'No tickets available'
  }
  return messages[blockedReason.value] || 'Not available'
})

const ticketsAvailable = computed(() => {
  // Calculate from tiers
  return activeTiers.value.reduce((sum, t) => {
    if (t.available === null || t.available === undefined) return sum
    return sum + t.available
  }, 0)
})

const totalCapacity = computed(() => {
  return activeTiers.value.reduce((sum, t) => {
    if (!t.quantity) return sum
    return sum + t.quantity
  }, 0)
})

const totalSold = computed(() => {
  return activeTiers.value.reduce((sum, t) => sum + (t.sold || 0), 0)
})

const showAvailabilityBar = computed(() => {
  // Show for general admission events with capacity set
  return !isSeatedEvent.value && totalCapacity.value > 0
})

const soldPercentage = computed(() => {
  if (!totalCapacity.value || totalCapacity.value === 0) return 0
  return Math.round((totalSold.value / totalCapacity.value) * 100)
})

const extraItems = computed(() => {
  const items = props.availability?.items || props.event?.active_items || []
  return items.filter(item => item.is_available || item.available)
})

const hasExtraItems = computed(() => extraItems.value.length > 0)

const seatingTypeLabel = computed(() => {
  if (isSeatedEvent.value) {
    if (hasTables.value) {
      const totalSeats = activeTables.value.reduce((sum, t) => sum + (t.capacity || 0), 0)
      return `${tablesAvailableCount.value} tables · ${totalSeats} seats`
    }
    return 'Seated Event'
  }
  if (totalCapacity.value > 0) return `${totalCapacity.value} Total Capacity`
  return 'General Admission'
})

// Formatted date/time/location
const formattedDate = computed(() => {
  if (!props.event?.starts_at) return ''
  return formatDate(props.event.starts_at, props.event.timezone)
})

const formattedTime = computed(() => {
  if (!props.event?.starts_at) return ''
  return formatTime(props.event.starts_at, props.event.timezone)
})

const formattedLocation = computed(() => {
  return formatLocation(props.event?.location_type, props.event?.location)
})

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const handleBuyTickets = () => {
  if (isSeatedEvent.value) {
    navigateTo(`/app/events/${props.event.slug}/select-seats`)
  } else {
    navigateTo(`/app/events/${props.event.slug}/checkout`)
  }
}

// Fetch tiers for general admission events
const fetchTiers = async () => {
  if (isSeatedEvent.value) return

  tiersLoading.value = true
  try {
    const response = await getPublicTicketTiers(props.event.slug)
    tiers.value = response.tiers || []
  } catch (e) {
    // Tiers are optional - event may use legacy single price
  } finally {
    tiersLoading.value = false
  }
}

// Fetch tables for seated events
const fetchTables = async () => {
  if (!isSeatedEvent.value) return

  tablesLoading.value = true
  try {
    const response = await getPublicTables(props.event.slug)
    tables.value = response.tables || []
  } catch (e) {
    // Tables fetch failed
    console.error('Failed to fetch tables:', e)
  } finally {
    tablesLoading.value = false
  }
}

onMounted(() => {
  if (isSeatedEvent.value) {
    fetchTables()
  } else {
    fetchTiers()
  }
})
</script>
