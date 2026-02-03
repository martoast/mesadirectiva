<template>
  <div>
    <!-- Mobile Sticky Bar -->
    <div
      class="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg z-40"
    >
      <!-- Expandable Tiers/Tables Section -->
      <Transition name="slide">
        <div v-if="mobileExpanded" class="border-b border-gray-200 max-h-64 overflow-y-auto">
          <!-- Tables (Seated Events) -->
          <div v-if="isSeatedEvent && hasTables" class="p-4">
            <p class="text-sm font-semibold text-gray-700 mb-3">{{ t.availableTables }}</p>
            <div class="space-y-2">
              <div
                v-for="table in activeTables.slice(0, 5)"
                :key="table.id"
                class="flex justify-between items-center p-2 rounded-lg bg-gray-50"
              >
                <div>
                  <span class="text-sm font-medium text-gray-900">{{ table.name }}</span>
                  <span class="ml-2 text-xs text-gray-500">{{ table.capacity }} {{ t.seats }}</span>
                </div>
                <span class="font-semibold text-primary-600">${{ formatPrice(table.price) }}</span>
              </div>
              <p v-if="activeTables.length > 5" class="text-xs text-gray-500 text-center mt-2">
                +{{ activeTables.length - 5 }} {{ t.moreTables }}
              </p>
            </div>
          </div>

          <!-- Ticket Tiers (General Admission) -->
          <div v-else-if="hasTiers && !isSeatedEvent" class="p-4">
            <p class="text-sm font-semibold text-gray-700 mb-3">{{ t.availableTiers }}</p>
            <div class="space-y-2">
              <div
                v-for="tier in activeTiers.slice(0, 5)"
                :key="tier.id"
                class="flex justify-between items-center p-2 rounded-lg bg-gray-50"
              >
                <div>
                  <span class="text-sm font-medium text-gray-900">{{ tier.name }}</span>
                  <span v-if="tier.available === 0" class="ml-2 text-xs text-red-600 font-semibold">{{ t.soldOut }}</span>
                </div>
                <span class="font-semibold text-primary-600">${{ formatPrice(tier.price) }}</span>
              </div>
              <p v-if="activeTiers.length > 5" class="text-xs text-gray-500 text-center mt-2">
                +{{ activeTiers.length - 5 }} {{ t.moreTiers }}
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Main Bar -->
      <div class="p-4">
        <div class="flex items-center justify-between gap-4">
          <button
            v-if="(hasTiers && !isSeatedEvent) || (isSeatedEvent && hasTables)"
            @click="mobileExpanded = !mobileExpanded"
            class="flex items-center gap-2 text-left"
          >
            <div>
              <p class="text-sm text-gray-600">{{ priceLabel }}</p>
              <p class="text-2xl font-bold text-primary-600">${{ displayPrice }}</p>
            </div>
            <svg
              :class="['w-5 h-5 text-gray-400 transition-transform', mobileExpanded && 'rotate-180']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <div v-else>
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
    </div>

    <!-- Desktop Sidebar Card -->
    <div class="hidden md:block sticky top-24">
      <UiBaseCard class="border-2 border-primary-200">
        <!-- Pricing Display -->
        <div class="text-center mb-6">
          <p class="text-sm font-semibold text-gray-600 uppercase mb-2">{{ priceLabel }}</p>
          <p class="text-5xl font-bold text-primary-600 mb-1">${{ displayPrice }}</p>
          <p v-if="isSeatedEvent && hasTables" class="text-sm text-gray-600">
            {{ tablesAvailableCount }} {{ tablesAvailableCount === 1 ? t.tableAvailable : t.tablesAvailable }}
          </p>
          <p v-else-if="isSeatedEvent" class="text-sm text-gray-600">{{ t.tableReservations }}</p>
          <p v-else-if="hasTiers && activeTiers.length > 1" class="text-sm text-gray-600">{{ t.multipleTiersAvailable }}</p>
          <p v-else class="text-sm text-gray-600">{{ event?.slug === 'fiesta-del-60-aniversario' ? t.tableTicket : t.individualTicket }}</p>
        </div>

        <!-- Tables Preview (Seated Events) -->
        <div v-if="isSeatedEvent && hasTables" class="mb-6">
          <p class="text-sm font-semibold text-gray-700 mb-3">{{ t.availableTables }}</p>
          <div class="space-y-2">
            <div
              v-for="table in displayTables"
              :key="table.id"
              class="flex justify-between items-center p-2 rounded-lg bg-gray-50"
            >
              <div>
                <span class="text-sm font-medium text-gray-900">{{ table.name }}</span>
                <span class="ml-2 text-xs text-gray-500">{{ table.capacity }} {{ t.seats }}</span>
              </div>
              <span class="font-semibold text-primary-600">${{ formatPrice(table.price) }}</span>
            </div>
            <button
              v-if="activeTables.length > 3"
              @click="showTablesModal = true"
              class="w-full text-center py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              {{ t.viewAllTables }} ({{ activeTables.length }})
            </button>
          </div>
        </div>

        <!-- Ticket Tiers Preview (General Admission with Tiers) -->
        <div v-else-if="hasTiers && !isSeatedEvent" class="mb-6">
          <p class="text-sm font-semibold text-gray-700 mb-3">{{ t.availableTiers }}</p>
          <div class="space-y-2">
            <div
              v-for="tier in displayTiers"
              :key="tier.id"
              class="flex justify-between items-center p-2 rounded-lg bg-gray-50"
            >
              <div>
                <span class="text-sm font-medium text-gray-900">{{ tier.name }}</span>
                <span v-if="tier.available === 0" class="ml-2 text-xs text-red-600 font-semibold">{{ t.soldOut }}</span>
              </div>
              <span class="font-semibold text-primary-600">${{ formatPrice(tier.price) }}</span>
            </div>
            <p v-if="activeTiers.length > 3" class="text-xs text-gray-500 text-center mt-2">
              +{{ activeTiers.length - 3 }} {{ t.moreTiers }}
            </p>
          </div>
        </div>

        <!-- Availability Info (GA events only) -->
        <div v-if="showAvailabilityBar" class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-600 mb-2">
            {{ ticketsAvailable }} / {{ totalCapacity }} {{ t.ticketsRemaining }}
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
          <p class="text-sm font-semibold text-gray-700 mb-2">{{ t.availableAddOns }}</p>
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
          {{ t.securePayment }}
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
              <p v-if="fullAddress && event.location_type === 'venue'" class="text-gray-600 mt-1">{{ fullAddress }}</p>
              <a
                v-if="mapUrl && event.location_type === 'venue'"
                :href="mapUrl"
                target="_blank"
                rel="noopener"
                class="text-primary-600 hover:underline mt-1 inline-block"
              >
                {{ t.viewOnMap }} →
              </a>
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

    <!-- Tables Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showTablesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="showTablesModal = false">
          <div class="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-xl">
            <!-- Modal Header -->
            <div class="p-4 border-b border-gray-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ t.allTables }}</h3>
                <button @click="showTablesModal = false" class="p-1 text-gray-400 hover:text-gray-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <!-- Search Input -->
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="tableSearch"
                  type="text"
                  :placeholder="t.searchTables"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <!-- Quick Stats -->
              <div class="flex gap-4 mt-3 text-sm text-gray-600">
                <span>{{ filteredTables.length }} {{ t.tablesFound }}</span>
                <span v-if="tableSearch">·</span>
                <button v-if="tableSearch" @click="tableSearch = ''" class="text-primary-600 hover:underline">{{ t.clearSearch }}</button>
              </div>
            </div>

            <!-- Tables List -->
            <div class="flex-1 overflow-y-auto p-4 space-y-2">
              <div v-if="filteredTables.length === 0" class="text-center py-8 text-gray-500">
                {{ t.noTablesMatch }}
              </div>
              <div
                v-for="table in paginatedTables"
                :key="table.id"
                class="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <span class="font-medium text-gray-900">{{ table.name }}</span>
                  <span class="ml-2 text-sm text-gray-500">{{ table.capacity }} {{ t.seats }}</span>
                </div>
                <span class="font-semibold text-primary-600">${{ formatPrice(table.price) }}</span>
              </div>

              <!-- Load More Button -->
              <button
                v-if="hasMoreTables"
                @click="loadMoreTables"
                class="w-full py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {{ t.loadMore }} ({{ remainingTablesCount }} {{ t.more }})
              </button>
            </div>

            <!-- Modal Footer -->
            <div class="p-4 border-t border-gray-200">
              <UiBaseButton
                @click="handleBuyTickets"
                variant="success"
                size="lg"
                full-width
              >
                {{ ctaText }}
              </UiBaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { formatDate, formatTime } from '~/utils/dateTime'
import { formatLocation, formatFullAddress, buildMapUrl } from '~/utils/location'

const { t: createT, language } = useLanguage()

const translations = {
  // Price labels
  tablesFrom: { es: 'Mesas desde', en: 'Tables from' },
  tableReservations: { es: 'Reservaciones de mesa', en: 'Table reservations' },
  startingFrom: { es: 'Desde', en: 'Starting from' },
  pricePerTicket: { es: 'Precio por Boleto', en: 'Price per Ticket' },
  pricePerTable: { es: 'Precio por Mesa', en: 'Price per Table' },
  tableTicket: { es: 'Boleto por mesa', en: 'Table ticket' },

  // Availability
  tablesAvailable: { es: 'mesas disponibles', en: 'tables available' },
  tableAvailable: { es: 'mesa disponible', en: 'table available' },
  multipleTiersAvailable: { es: 'Múltiples niveles disponibles', en: 'Multiple tiers available' },
  individualTicket: { es: 'Boleto individual', en: 'Individual ticket' },
  availableTables: { es: 'Mesas Disponibles:', en: 'Available Tables:' },
  availableTiers: { es: 'Niveles Disponibles:', en: 'Available Tiers:' },
  availableAddOns: { es: 'Extras Disponibles:', en: 'Available Add-ons:' },
  seats: { es: 'asientos', en: 'seats' },
  moreTables: { es: 'más mesas', en: 'more tables' },
  viewAllTables: { es: 'Ver todas las mesas', en: 'View all tables' },
  allTables: { es: 'Todas las Mesas', en: 'All Tables' },
  searchTables: { es: 'Buscar mesas...', en: 'Search tables...' },
  tablesFound: { es: 'mesas encontradas', en: 'tables found' },
  clearSearch: { es: 'Limpiar', en: 'Clear' },
  noTablesMatch: { es: 'No se encontraron mesas', en: 'No tables match your search' },
  loadMore: { es: 'Cargar más', en: 'Load more' },
  more: { es: 'más', en: 'more' },
  moreTiers: { es: 'más niveles', en: 'more tiers' },
  soldOut: { es: 'AGOTADO', en: 'SOLD OUT' },
  ticketsRemaining: { es: 'boletos restantes', en: 'tickets remaining' },

  // CTA
  chooseTable: { es: 'Elegir Mesa', en: 'Choose a Table' },
  buyTicketsNow: { es: 'Comprar Boletos', en: 'Buy Tickets Now' },
  securePayment: { es: 'Pago seguro con Stripe', en: 'Secure payment powered by Stripe' },

  // Blocked messages
  eventNotAvailable: { es: 'Evento no disponible', en: 'Event not available' },
  registrationClosed: { es: 'Registro cerrado', en: 'Registration closed' },
  deadlinePassed: { es: 'Fecha límite pasada', en: 'Registration deadline passed' },
  soldOutStatus: { es: 'Agotado', en: 'Sold out' },
  noTablesAvailable: { es: 'No hay mesas disponibles', en: 'No tables available' },
  noTicketsAvailable: { es: 'No hay boletos disponibles', en: 'No tickets available' },
  notAvailable: { es: 'No disponible', en: 'Not available' },

  // Event info
  seatedEvent: { es: 'Evento con Asientos', en: 'Seated Event' },
  totalCapacity: { es: 'Capacidad Total', en: 'Total Capacity' },
  generalAdmission: { es: 'Admisión General', en: 'General Admission' },
  tables: { es: 'mesas', en: 'tables' },
  viewOnMap: { es: 'Ver en Mapa', en: 'View on Map' }
}

const t = createT(translations)

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

// Tables modal state
const showTablesModal = ref(false)
const tableSearch = ref('')
const tablesDisplayLimit = ref(20)

// Mobile expanded state
const mobileExpanded = ref(false)

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

// Filtered tables based on search
const filteredTables = computed(() => {
  if (!tableSearch.value.trim()) return activeTables.value
  const search = tableSearch.value.toLowerCase().trim()
  return activeTables.value.filter(t =>
    t.name.toLowerCase().includes(search)
  )
})

// Paginated tables for modal
const paginatedTables = computed(() => {
  return filteredTables.value.slice(0, tablesDisplayLimit.value)
})

const hasMoreTables = computed(() => {
  return filteredTables.value.length > tablesDisplayLimit.value
})

const remainingTablesCount = computed(() => {
  return filteredTables.value.length - tablesDisplayLimit.value
})

const loadMoreTables = () => {
  tablesDisplayLimit.value += 20
}

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
    return hasTables.value ? t.tablesFrom : t.tableReservations
  }
  if (hasTiers.value && activeTiers.value.length > 1) return t.startingFrom
  // Override for specific event
  if (props.event?.slug === 'fiesta-del-60-aniversario') return t.pricePerTable
  return t.pricePerTicket
})

const ctaText = computed(() => {
  if (isSeatedEvent.value) return t.chooseTable
  return t.buyTicketsNow
})

const canPurchase = computed(() => {
  return props.availability?.can_purchase ?? props.event.can_purchase ?? true
})

const blockedReason = computed(() => {
  return props.availability?.blocked_reason ?? props.event.purchase_blocked_reason
})

const blockedMessage = computed(() => {
  const messages = {
    not_live: t.eventNotAvailable,
    registration_closed: t.registrationClosed,
    deadline_passed: t.deadlinePassed,
    sold_out: t.soldOutStatus,
    no_available_tickets: isSeatedEvent.value ? t.noTablesAvailable : t.noTicketsAvailable
  }
  return messages[blockedReason.value] || t.notAvailable
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
      const totalSeats = activeTables.value.reduce((sum, tbl) => sum + (tbl.capacity || 0), 0)
      return `${tablesAvailableCount.value} ${t.tables} · ${totalSeats} ${t.seats}`
    }
    return t.seatedEvent
  }
  if (totalCapacity.value > 0) return `${totalCapacity.value} ${t.totalCapacity}`
  return t.generalAdmission
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
  return formatLocation(props.event?.location, props.event?.location_type)
})

const fullAddress = computed(() => {
  if (!props.event?.location) return ''
  return formatFullAddress(props.event.location)
})

const mapUrl = computed(() => {
  if (!props.event?.location) return ''
  return buildMapUrl(props.event.location)
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

    // Override tier name for specific event
    if (props.event.slug === 'fiesta-del-60-aniversario') {
      tiers.value = tiers.value.map(t =>
        t.name === 'Boleto individual' ? { ...t, name: 'Boleto por mesa' } : t
      )
    }
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

// Reset pagination when search changes
watch(tableSearch, () => {
  tablesDisplayLimit.value = 20
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 20rem;
  opacity: 1;
}
</style>
