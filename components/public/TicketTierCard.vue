<template>
  <div
    :class="[
      'border rounded-xl p-4 transition-all duration-200',
      !isAvailable ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md',
      quantity > 0 && isAvailable && 'border-primary-500 ring-2 ring-primary-100'
    ]"
  >
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="font-semibold text-gray-900">{{ tier.name }}</h3>
        <p v-if="tier.description && tier.show_description" class="text-sm text-gray-500 mt-1">{{ tier.description }}</p>
      </div>
    </div>

    <!-- Pricing -->
    <div class="mt-3">
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold text-gray-900">{{ currencySymbol }}{{ formatPrice(tier.price) }}</span>
        <span class="text-sm text-gray-500">{{ tier.currency || 'MXN' }}</span>
      </div>

      <!-- Sales Window Info -->
      <p v-if="tier.sales_end && !isSalesEnded" class="text-xs text-primary-600 mt-1">
        {{ t.saleEnds }} {{ formatDate(tier.sales_end) }}
      </p>
    </div>

    <!-- Availability -->
    <div class="mt-3 flex items-center justify-between">
      <span v-if="!isAvailable" class="text-sm font-medium text-gray-500">
        {{ availabilityMessage }}
      </span>
      <span v-else-if="tier.available !== null && tier.available <= 10" class="text-sm text-warning-600">
        {{ t.onlyLeft }} {{ tier.available }} {{ t.left }}
      </span>
      <span v-else-if="tier.available !== null" class="text-sm text-gray-500">
        {{ tier.available }} {{ t.available }}
      </span>
      <span v-else class="text-sm text-gray-500">
        {{ t.availableLabel }}
      </span>

      <!-- Quantity Selector -->
      <div v-if="isAvailable" class="flex items-center gap-2">
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

    <!-- Order Limits Info -->
    <p v-if="hasOrderLimits" class="text-xs text-gray-500 mt-2">
      {{ orderLimitsText }}
    </p>

    <!-- Line Total -->
    <div v-if="quantity > 0" class="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
      <span class="text-sm text-gray-600">{{ t.subtotal }}</span>
      <span class="font-semibold text-gray-900">{{ currencySymbol }}{{ formatPrice(lineTotal) }} {{ tier.currency || 'MXN' }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { t: createT, language } = useLanguage()

const translations = {
  soldOut: { es: 'Agotado', en: 'Sold Out' },
  notYetAvailable: { es: 'Aún No Disponible', en: 'Not Yet Available' },
  saleEnded: { es: 'Venta Finalizada', en: 'Sale Ended' },
  unavailable: { es: 'No Disponible', en: 'Unavailable' },
  onlyLeft: { es: 'Solo quedan', en: 'Only' },
  left: { es: '', en: 'left' },
  available: { es: 'disponibles', en: 'available' },
  availableLabel: { es: 'Disponible', en: 'Available' },
  saleEnds: { es: 'La venta termina', en: 'Sale ends' },
  subtotal: { es: 'Subtotal', en: 'Subtotal' },
  perOrder: { es: 'por pedido', en: 'per order' },
  minimum: { es: 'Mínimo', en: 'Minimum' },
  maximum: { es: 'Máximo', en: 'Maximum' }
}

const t = createT(translations)

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

const isAvailable = computed(() => {
  // Check if tier is active and not hidden
  if (!props.tier.is_active || props.tier.is_hidden) return false

  // Check if sold out
  if (props.tier.available !== null && props.tier.available <= 0) return false

  // Check sales window
  const now = new Date()
  if (props.tier.sales_start && new Date(props.tier.sales_start) > now) return false
  if (props.tier.sales_end && new Date(props.tier.sales_end) < now) return false

  return true
})

const isSalesEnded = computed(() => {
  if (!props.tier.sales_end) return false
  return new Date(props.tier.sales_end) < new Date()
})

const availabilityMessage = computed(() => {
  if (props.tier.available !== null && props.tier.available <= 0) return t.soldOut
  if (props.tier.sales_start && new Date(props.tier.sales_start) > new Date()) return t.notYetAvailable
  if (isSalesEnded.value) return t.saleEnded
  if (!props.tier.is_active) return t.unavailable
  return t.unavailable
})

const maxQuantity = computed(() => {
  const available = props.tier.available ?? Infinity
  const maxOrder = props.tier.max_per_order || props.maxPerOrder
  return Math.min(available, maxOrder)
})

const hasOrderLimits = computed(() => {
  return (props.tier.min_per_order && props.tier.min_per_order > 1) ||
         (props.tier.max_per_order && props.tier.max_per_order < 10)
})

const orderLimitsText = computed(() => {
  const min = props.tier.min_per_order
  const max = props.tier.max_per_order

  if (min && max) return `${min}-${max} ${t.perOrder}`
  if (min) return `${t.minimum} ${min} ${t.perOrder}`
  if (max) return `${t.maximum} ${max} ${t.perOrder}`
  return ''
})

const lineTotal = computed(() => {
  return props.quantity * (props.tier.price || 0)
})

const currencySymbol = computed(() => {
  return props.tier.currency === 'USD' ? '$' : '$'
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
