<template>
  <div class="space-y-4">
    <!-- Header -->
    <div v-if="showHeader" class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900">Select Tickets</h3>
      <span v-if="totalTickets > 0" class="text-sm text-gray-500">
        {{ totalTickets }} ticket{{ totalTickets !== 1 ? 's' : '' }} selected
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="border rounded-xl p-4 bg-gray-50">
          <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="tiers.length === 0" class="text-center py-8 text-gray-500">
      No ticket options available for this event.
    </div>

    <!-- Tier List -->
    <div v-else class="space-y-3">
      <TicketTierCard
        v-for="tier in sortedTiers"
        :key="tier.id"
        :tier="tier"
        :quantity="getQuantity(tier.id)"
        :max-per-order="maxPerOrder"
        @update:quantity="(qty) => updateQuantity(tier.id, qty)"
      />
    </div>

    <!-- Total Summary -->
    <div v-if="totalTickets > 0" class="border-t pt-4 mt-4">
      <div class="flex justify-between items-center text-lg font-semibold">
        <span class="text-gray-900">Total</span>
        <span class="text-primary-600">${{ formatPrice(totalAmount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tiers: {
    type: Array,
    required: true
  },
  selections: {
    type: Object,
    default: () => ({})
  },
  maxPerOrder: {
    type: Number,
    default: 10
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

const emit = defineEmits(['update:selections'])

// Sort tiers by sort_order, then by price
const sortedTiers = computed(() => {
  return [...props.tiers].sort((a, b) => {
    if (a.sort_order !== b.sort_order) {
      return (a.sort_order || 0) - (b.sort_order || 0)
    }
    return (a.current_price || 0) - (b.current_price || 0)
  })
})

const getQuantity = (tierId) => {
  return props.selections[tierId] || 0
}

const updateQuantity = (tierId, quantity) => {
  const newSelections = { ...props.selections }

  if (quantity > 0) {
    newSelections[tierId] = quantity
  } else {
    delete newSelections[tierId]
  }

  emit('update:selections', newSelections)
}

const totalTickets = computed(() => {
  return Object.values(props.selections).reduce((sum, qty) => sum + qty, 0)
})

const totalAmount = computed(() => {
  return Object.entries(props.selections).reduce((sum, [tierId, qty]) => {
    const tier = props.tiers.find(t => t.id === Number(tierId))
    if (tier) {
      return sum + (qty * (tier.current_price || 0))
    }
    return sum
  }, 0)
})

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

// Expose computed values for parent access
defineExpose({
  totalTickets,
  totalAmount
})
</script>
