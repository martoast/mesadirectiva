<template>
  <div
    :class="[
      'border rounded-xl p-4 transition-all duration-200',
      !tier.is_available ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md',
      quantity > 0 && tier.is_available && 'border-primary-500 ring-2 ring-primary-100'
    ]"
  >
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="font-semibold text-gray-900">{{ tier.name }}</h3>
        <p v-if="tier.description" class="text-sm text-gray-500 mt-1">{{ tier.description }}</p>
      </div>

      <!-- Early Bird Badge -->
      <span
        v-if="tier.is_early_bird"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700"
      >
        Early Bird
      </span>
    </div>

    <!-- Pricing -->
    <div class="mt-3">
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold text-gray-900">${{ formatPrice(tier.current_price) }}</span>
        <span
          v-if="tier.is_early_bird && tier.price !== tier.early_bird_price"
          class="text-sm text-gray-400 line-through"
        >
          ${{ formatPrice(tier.price) }}
        </span>
      </div>

      <!-- Early Bird Deadline -->
      <p v-if="tier.is_early_bird && tier.early_bird_deadline" class="text-xs text-success-600 mt-1">
        Early bird ends {{ formatDate(tier.early_bird_deadline) }}
      </p>
    </div>

    <!-- Availability -->
    <div class="mt-3 flex items-center justify-between">
      <span v-if="!tier.is_available" class="text-sm font-medium text-gray-500">
        Sold Out
      </span>
      <span v-else-if="tier.available_quantity <= 10" class="text-sm text-warning-600">
        Only {{ tier.available_quantity }} left
      </span>
      <span v-else class="text-sm text-gray-500">
        {{ tier.available_quantity }} available
      </span>

      <!-- Quantity Selector -->
      <div v-if="tier.is_available" class="flex items-center gap-2">
        <button
          type="button"
          @click="decrementQuantity"
          :disabled="quantity <= 0"
          class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>

        <span class="w-8 text-center font-medium text-gray-900">{{ quantity }}</span>

        <button
          type="button"
          @click="incrementQuantity"
          :disabled="quantity >= maxQuantity"
          class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Line Total -->
    <div v-if="quantity > 0" class="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
      <span class="text-sm text-gray-600">Subtotal</span>
      <span class="font-semibold text-gray-900">${{ formatPrice(lineTotal) }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tier: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  maxPerOrder: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:quantity'])

const maxQuantity = computed(() => {
  return Math.min(props.tier.available_quantity || 0, props.maxPerOrder)
})

const lineTotal = computed(() => {
  return props.quantity * (props.tier.current_price || 0)
})

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const incrementQuantity = () => {
  if (props.quantity < maxQuantity.value) {
    emit('update:quantity', props.quantity + 1)
  }
}

const decrementQuantity = () => {
  if (props.quantity > 0) {
    emit('update:quantity', props.quantity - 1)
  }
}
</script>
