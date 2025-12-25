<template>
  <div class="space-y-6">
    <!-- Header -->
    <div v-if="showHeader" class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900">Select Your Seats</h3>
      <span v-if="hasSelections" class="text-sm text-gray-500">
        {{ selectionSummary }}
      </span>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-4 text-sm bg-gray-50 p-3 rounded-lg">
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

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="animate-pulse">
        <div class="border rounded-xl p-4 bg-gray-50">
          <div class="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="tables.length === 0" class="text-center py-8 text-gray-500">
      No tables available for this event.
    </div>

    <!-- Tables Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <TableCard
        v-for="table in tables"
        :key="table.id"
        :table="table"
        :selected="isTableSelected(table.id)"
        @select="handleTableSelect"
      />
    </div>

    <!-- Seat Selection Modal -->
    <div
      v-if="selectedTableForSeats"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeSeatSelection"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <SeatGrid
          :table="selectedTableForSeats"
          :seats="selectedTableForSeats.seats || []"
          :selected-seats="getTableSeats(selectedTableForSeats.id)"
          @update:selected-seats="(seats) => updateTableSeats(selectedTableForSeats.id, seats)"
          @close="closeSeatSelection"
        />

        <div class="mt-4 flex justify-end gap-3">
          <button
            type="button"
            @click="closeSeatSelection"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirmSeatSelection"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>

    <!-- Selection Summary -->
    <div v-if="hasSelections" class="border-t pt-4 space-y-3">
      <!-- Selected Tables (whole) -->
      <div v-if="selectedTables.length > 0">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Selected Tables</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tableId in selectedTables"
            :key="tableId"
            class="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
          >
            {{ getTableName(tableId) }}
            <button
              type="button"
              @click="removeTable(tableId)"
              class="ml-2 hover:text-primary-900"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Selected Seats -->
      <div v-if="selectedSeats.length > 0">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Selected Seats</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="seatId in selectedSeats"
            :key="seatId"
            class="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
          >
            {{ getSeatInfo(seatId) }}
            <button
              type="button"
              @click="removeSeat(seatId)"
              class="ml-2 hover:text-primary-900"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Total -->
      <div class="flex justify-between items-center text-lg font-semibold pt-2">
        <span class="text-gray-900">Total</span>
        <span class="text-primary-600">${{ formatPrice(totalAmount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tables: {
    type: Array,
    required: true
  },
  selectedTables: {
    type: Array,
    default: () => []
  },
  selectedSeats: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  showHeader: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:selectedTables', 'update:selectedSeats', 'select-table', 'select-seat'])

// For individual seat selection
const selectedTableForSeats = ref(null)
const tempSeatSelection = ref({})

const hasSelections = computed(() => {
  return props.selectedTables.length > 0 || props.selectedSeats.length > 0
})

const selectionSummary = computed(() => {
  const parts = []
  if (props.selectedTables.length > 0) {
    parts.push(`${props.selectedTables.length} table${props.selectedTables.length !== 1 ? 's' : ''}`)
  }
  if (props.selectedSeats.length > 0) {
    parts.push(`${props.selectedSeats.length} seat${props.selectedSeats.length !== 1 ? 's' : ''}`)
  }
  return parts.join(', ')
})

const isTableSelected = (tableId) => {
  return props.selectedTables.includes(tableId)
}

const handleTableSelect = (table) => {
  if (table.sell_as_whole) {
    // Toggle whole table selection
    const newSelection = [...props.selectedTables]
    const index = newSelection.indexOf(table.id)

    if (index > -1) {
      newSelection.splice(index, 1)
    } else {
      newSelection.push(table.id)
    }

    emit('update:selectedTables', newSelection)
    emit('select-table', table)
  } else {
    // Open seat selection for this table
    selectedTableForSeats.value = table
    tempSeatSelection.value[table.id] = [...getTableSeats(table.id)]
  }
}

const getTableSeats = (tableId) => {
  // Return seats that belong to this table
  const table = props.tables.find(t => t.id === tableId)
  if (!table || !table.seats) return []

  return props.selectedSeats.filter(seatId =>
    table.seats.some(s => s.id === seatId)
  )
}

const updateTableSeats = (tableId, seatIds) => {
  tempSeatSelection.value[tableId] = seatIds
}

const closeSeatSelection = () => {
  selectedTableForSeats.value = null
}

const confirmSeatSelection = () => {
  if (!selectedTableForSeats.value) return

  const tableId = selectedTableForSeats.value.id
  const newSeats = tempSeatSelection.value[tableId] || []

  // Remove old seats from this table, add new ones
  const table = props.tables.find(t => t.id === tableId)
  const tableSeatIds = table?.seats?.map(s => s.id) || []

  const otherSeats = props.selectedSeats.filter(id => !tableSeatIds.includes(id))
  const updatedSeats = [...otherSeats, ...newSeats]

  emit('update:selectedSeats', updatedSeats)
  closeSeatSelection()
}

const getTableName = (tableId) => {
  const table = props.tables.find(t => t.id === tableId)
  return table ? table.name : ''
}

const getSeatInfo = (seatId) => {
  for (const table of props.tables) {
    if (table.seats) {
      const seat = table.seats.find(s => s.id === seatId)
      if (seat) {
        return `${table.name} - ${seat.label}`
      }
    }
  }
  return ''
}

const removeTable = (tableId) => {
  const newSelection = props.selectedTables.filter(id => id !== tableId)
  emit('update:selectedTables', newSelection)
}

const removeSeat = (seatId) => {
  const newSelection = props.selectedSeats.filter(id => id !== seatId)
  emit('update:selectedSeats', newSelection)
}

const totalAmount = computed(() => {
  let total = 0

  // Add table prices
  for (const tableId of props.selectedTables) {
    const table = props.tables.find(t => t.id === tableId)
    if (table) {
      total += table.price || 0
    }
  }

  // Add seat prices
  for (const seatId of props.selectedSeats) {
    for (const table of props.tables) {
      if (table.seats) {
        const seat = table.seats.find(s => s.id === seatId)
        if (seat) {
          total += seat.price || 0
          break
        }
      }
    }
  }

  return total
})

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

// Expose for parent
defineExpose({
  totalAmount,
  hasSelections
})
</script>
