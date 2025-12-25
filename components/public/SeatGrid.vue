<template>
  <div class="space-y-4">
    <!-- Table Header -->
    <div class="flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-900">{{ table.name }}</h3>
        <p class="text-sm text-gray-500">Select individual seats</p>
      </div>
      <button
        type="button"
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-success-500"></div>
        <span>Available</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-primary-500"></div>
        <span>Selected</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-warning-500"></div>
        <span>Reserved</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-gray-300"></div>
        <span>Sold</span>
      </div>
    </div>

    <!-- Seats Grid -->
    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
      <button
        v-for="seat in sortedSeats"
        :key="seat.id"
        type="button"
        :disabled="!isSeatAvailable(seat)"
        @click="toggleSeat(seat)"
        :class="[
          'relative p-3 rounded-lg text-center transition-all duration-200',
          'flex flex-col items-center justify-center min-h-[70px]',
          getSeatClasses(seat)
        ]"
      >
        <span class="font-medium text-sm">{{ seat.label }}</span>
        <span class="text-xs mt-1">${{ formatPrice(seat.price) }}</span>

        <!-- Selected checkmark -->
        <div
          v-if="isSelected(seat.id)"
          class="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
        >
          <svg class="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </button>
    </div>

    <!-- Selection Summary -->
    <div v-if="selectedSeats.length > 0" class="border-t pt-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-600">{{ selectedSeats.length }} seat{{ selectedSeats.length !== 1 ? 's' : '' }} selected</span>
        <button
          type="button"
          @click="clearSelection"
          class="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear all
        </button>
      </div>

      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="seatId in selectedSeats"
          :key="seatId"
          class="inline-flex items-center px-2 py-1 rounded bg-primary-100 text-primary-700 text-sm"
        >
          {{ getSeatLabel(seatId) }}
          <button
            type="button"
            @click.stop="toggleSeat({ id: seatId })"
            class="ml-1 hover:text-primary-900"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
      </div>

      <div class="flex justify-between items-center text-lg font-semibold">
        <span>Total</span>
        <span class="text-primary-600">${{ formatPrice(totalPrice) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  table: {
    type: Object,
    required: true
  },
  seats: {
    type: Array,
    required: true
  },
  selectedSeats: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selectedSeats', 'close'])

const sortedSeats = computed(() => {
  return [...props.seats].sort((a, b) => {
    // Sort by label (alphanumeric)
    return a.label.localeCompare(b.label, undefined, { numeric: true })
  })
})

const isSeatAvailable = (seat) => {
  return seat.status === 'available' && seat.is_active
}

const isSelected = (seatId) => {
  return props.selectedSeats.includes(seatId)
}

const getSeatLabel = (seatId) => {
  const seat = props.seats.find(s => s.id === seatId)
  return seat ? seat.label : ''
}

const getSeatClasses = (seat) => {
  if (seat.status === 'sold') {
    return 'bg-gray-200 text-gray-400 cursor-not-allowed'
  }
  if (seat.status === 'reserved') {
    return 'bg-warning-100 text-warning-700 cursor-not-allowed'
  }
  if (isSelected(seat.id)) {
    return 'bg-primary-500 text-white hover:bg-primary-600 cursor-pointer'
  }
  return 'bg-success-100 text-success-700 hover:bg-success-200 cursor-pointer'
}

const toggleSeat = (seat) => {
  if (!isSeatAvailable(seat) && !isSelected(seat.id)) return

  const newSelection = [...props.selectedSeats]
  const index = newSelection.indexOf(seat.id)

  if (index > -1) {
    newSelection.splice(index, 1)
  } else {
    newSelection.push(seat.id)
  }

  emit('update:selectedSeats', newSelection)
}

const clearSelection = () => {
  emit('update:selectedSeats', [])
}

const totalPrice = computed(() => {
  return props.selectedSeats.reduce((sum, seatId) => {
    const seat = props.seats.find(s => s.id === seatId)
    return sum + (seat ? seat.price : 0)
  }, 0)
})

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}
</script>
