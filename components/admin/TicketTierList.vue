<template>
  <div class="space-y-3">
    <!-- Empty State -->
    <div v-if="tiers.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
      <p>No ticket tiers yet</p>
      <p class="text-sm">Add your first tier to start selling tickets</p>
    </div>

    <!-- Tier List -->
    <div
      v-for="tier in sortedTiers"
      :key="tier.id"
      :class="[
        'border rounded-lg p-4 bg-white',
        !tier.is_active && 'opacity-60'
      ]"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h4 class="font-semibold text-gray-900">{{ tier.name }}</h4>
            <span
              v-if="!tier.is_active"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
            >
              Inactive
            </span>
            <span
              v-if="tier.is_early_bird"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700"
            >
              Early Bird Active
            </span>
          </div>

          <p v-if="tier.description" class="text-sm text-gray-500 mt-1">
            {{ tier.description }}
          </p>

          <div class="flex items-center gap-4 mt-2 text-sm">
            <span class="text-gray-900 font-medium">
              ${{ formatPrice(tier.current_price) }}
              <span v-if="tier.is_early_bird && tier.price !== tier.current_price" class="text-gray-400 line-through ml-1">
                ${{ formatPrice(tier.price) }}
              </span>
            </span>

            <span class="text-gray-500">
              {{ tier.quantity_sold || 0 }} sold
              <template v-if="tier.max_quantity">
                / {{ tier.max_quantity }}
              </template>
            </span>

            <span v-if="tier.available_quantity !== undefined" :class="[
              tier.available_quantity === 0 ? 'text-danger-600' : 'text-gray-500'
            ]">
              {{ tier.available_quantity }} available
            </span>
          </div>

          <p v-if="tier.early_bird_deadline" class="text-xs text-gray-400 mt-1">
            Early bird ends: {{ formatDate(tier.early_bird_deadline) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="$emit('edit', tier)"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            title="Edit"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            type="button"
            @click="$emit('delete', tier)"
            class="p-2 text-gray-400 hover:text-danger-600 rounded-lg hover:bg-gray-100"
            title="Delete"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  tiers: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const sortedTiers = computed(() => {
  return [...props.tiers].sort((a, b) => {
    return (a.sort_order || 0) - (b.sort_order || 0)
  })
})

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script>
