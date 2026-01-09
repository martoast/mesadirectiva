<template>
  <div
    :class="[
      'border rounded-xl p-4 transition-all duration-200 cursor-pointer',
      statusClasses,
      selected && 'ring-2 ring-primary-500 border-primary-500'
    ]"
    @click="handleClick"
  >
    <div class="flex justify-between items-start">
      <div>
        <h4 class="font-semibold text-gray-900">{{ table.name }}</h4>
        <p class="text-sm text-gray-500">
          {{ table.capacity }} {{ table.capacity === 1 ? t.seat : t.seats }}
        </p>
      </div>

      <!-- Status Badge -->
      <span :class="['inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', statusBadgeClasses]">
        {{ statusLabel }}
      </span>
    </div>

    <!-- Price -->
    <div class="mt-3">
      <span v-if="table.sell_as_whole" class="text-lg font-bold text-gray-900">
        ${{ formatPrice(table.price) }}
      </span>
      <span v-else class="text-sm text-gray-500">
        {{ t.startingAt }} ${{ formatPrice(minSeatPrice) }}
      </span>
    </div>

    <!-- Available Seats (for individual seat tables) -->
    <div v-if="!table.sell_as_whole && table.available_seats_count !== undefined" class="mt-2 text-sm text-gray-500">
      {{ table.available_seats_count }} / {{ table.seats_count }} {{ t.seatsAvailable }}
    </div>

    <!-- Selection indicator -->
    <div v-if="selected" class="mt-3 flex items-center text-primary-600 text-sm font-medium">
      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      {{ t.selected }}
    </div>
  </div>
</template>

<script setup>
const { t: createT, language } = useLanguage()

const translations = {
  seat: { es: 'asiento', en: 'seat' },
  seats: { es: 'asientos', en: 'seats' },
  startingAt: { es: 'Desde', en: 'Starting at' },
  seatsAvailable: { es: 'asientos disponibles', en: 'seats available' },
  selected: { es: 'Seleccionado', en: 'Selected' },
  sold: { es: 'Vendido', en: 'Sold' },
  reserved: { es: 'Reservado', en: 'Reserved' },
  available: { es: 'Disponible', en: 'Available' }
}

const t = createT(translations)

const props = defineProps({
  table: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const isAvailable = computed(() => props.table.status === 'available')
const isReserved = computed(() => props.table.status === 'reserved')
const isSold = computed(() => props.table.status === 'sold')

const statusLabel = computed(() => {
  if (isSold.value) return t.sold
  if (isReserved.value) return t.reserved
  return t.available
})

const statusClasses = computed(() => {
  if (isSold.value) return 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
  if (isReserved.value) return 'bg-warning-50 border-warning-200 cursor-not-allowed'
  return 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
})

const statusBadgeClasses = computed(() => {
  if (isSold.value) return 'bg-gray-100 text-gray-600'
  if (isReserved.value) return 'bg-warning-100 text-warning-700'
  return 'bg-success-100 text-success-700'
})

const minSeatPrice = computed(() => {
  if (!props.table.seats || props.table.seats.length === 0) return 0
  return Math.min(...props.table.seats.map(s => s.price || 0))
})

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const handleClick = () => {
  if (isAvailable.value && props.table.sell_as_whole) {
    emit('select', props.table)
  } else if (isAvailable.value && !props.table.sell_as_whole) {
    // For individual seat tables, emit to open seat selection
    emit('select', props.table)
  }
}
</script>
