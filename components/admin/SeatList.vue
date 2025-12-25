<template>
  <div class="space-y-4">
    <!-- Header with bulk actions -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500">
        {{ seats.length }} seat{{ seats.length !== 1 ? 's' : '' }}
        <template v-if="availableCount !== undefined">
          ({{ availableCount }} available)
        </template>
      </div>
      <button
        type="button"
        @click="$emit('bulk-create')"
        class="text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        + Bulk Create
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="seats.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
      <p>No seats yet</p>
      <p class="text-sm">Add individual seats for this table</p>
    </div>

    <!-- Seats Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <div
        v-for="seat in sortedSeats"
        :key="seat.id"
        :class="[
          'border rounded-lg p-3 text-center relative',
          !seat.is_active && 'opacity-60',
          getSeatBackgroundClass(seat)
        ]"
      >
        <!-- Status indicator -->
        <div :class="['absolute top-2 right-2 w-2 h-2 rounded-full', getStatusDotClass(seat)]"></div>

        <div class="font-semibold text-gray-900">{{ seat.label }}</div>
        <div class="text-sm text-gray-600">${{ formatPrice(seat.price) }}</div>

        <div class="text-xs text-gray-400 mt-1 capitalize">{{ seat.status }}</div>

        <!-- Actions -->
        <div class="flex justify-center gap-1 mt-2">
          <button
            type="button"
            @click="$emit('edit', seat)"
            class="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            type="button"
            @click="$emit('delete', seat)"
            :disabled="seat.status === 'sold'"
            class="p-1 text-gray-400 hover:text-danger-600 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  seats: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'delete', 'bulk-create'])

const sortedSeats = computed(() => {
  return [...props.seats].sort((a, b) => {
    return a.label.localeCompare(b.label, undefined, { numeric: true })
  })
})

const availableCount = computed(() => {
  return props.seats.filter(s => s.status === 'available' && s.is_active).length
})

const getSeatBackgroundClass = (seat) => {
  if (seat.status === 'sold') return 'bg-gray-100'
  if (seat.status === 'reserved') return 'bg-warning-50'
  return 'bg-white'
}

const getStatusDotClass = (seat) => {
  if (seat.status === 'sold') return 'bg-gray-400'
  if (seat.status === 'reserved') return 'bg-warning-500'
  return 'bg-success-500'
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}
</script>
