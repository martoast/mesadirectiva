<template>
  <div class="space-y-3">
    <!-- Empty State -->
    <div v-if="tables.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
      <p>No tables yet</p>
      <p class="text-sm">Add tables for your seated event</p>
    </div>

    <!-- Tables Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="table in tables"
        :key="table.id"
        :class="[
          'border rounded-lg p-4 bg-white',
          !table.is_active && 'opacity-60'
        ]"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-semibold text-gray-900">{{ table.name }}</h4>
              <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', statusBadgeClasses(table)]">
                {{ statusLabel(table) }}
              </span>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              {{ table.capacity }} seats
              <template v-if="!table.sell_as_whole">
                (individual)
              </template>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <button
              v-if="!table.sell_as_whole"
              type="button"
              @click="$emit('manage-seats', table)"
              class="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              title="Manage Seats"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>

            <button
              type="button"
              @click="$emit('edit', table)"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Edit"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              type="button"
              @click="$emit('delete', table)"
              :disabled="table.status === 'sold'"
              class="p-2 text-gray-400 hover:text-danger-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Price -->
        <div class="text-lg font-semibold text-gray-900">
          ${{ formatPrice(table.price) }}
        </div>

        <!-- Seats info for individual seat tables -->
        <div v-if="!table.sell_as_whole" class="mt-2 text-sm text-gray-500">
          <template v-if="table.seats_count !== undefined">
            {{ table.available_seats_count || 0 }} / {{ table.seats_count }} seats available
          </template>
          <template v-else>
            <NuxtLink
              :to="`/app/admin/events/${eventSlug}/tables/${table.id}/seats`"
              class="text-primary-600 hover:text-primary-700"
            >
              Set up seats
            </NuxtLink>
          </template>
        </div>

        <!-- Inactive badge -->
        <div v-if="!table.is_active" class="mt-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            Inactive
          </span>
        </div>
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
  eventSlug: {
    type: String,
    required: true
  }
})

defineEmits(['edit', 'delete', 'manage-seats'])

const statusLabel = (table) => {
  if (table.status === 'sold') return 'Sold'
  if (table.status === 'reserved') return 'Reserved'
  return 'Available'
}

const statusBadgeClasses = (table) => {
  if (table.status === 'sold') return 'bg-gray-100 text-gray-600'
  if (table.status === 'reserved') return 'bg-warning-100 text-warning-700'
  return 'bg-success-100 text-success-700'
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}
</script>
