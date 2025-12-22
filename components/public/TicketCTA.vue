<template>
  <div>
    <!-- Mobile Sticky Bar -->
    <div
      class="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg p-4 z-40"
    >
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm text-gray-600">Price per ticket</p>
          <p class="text-2xl font-bold text-primary-600">${{ event.price }}</p>
        </div>
        <UiBaseButton
          v-if="canPurchase"
          @click="handleBuyTickets"
          variant="success"
          size="lg"
          class="flex-1"
        >
          Buy Tickets
        </UiBaseButton>
        <div v-else class="flex-1 text-center">
          <span class="text-sm font-medium text-gray-500">{{ blockedMessage }}</span>
        </div>
      </div>
    </div>

    <!-- Desktop Sidebar Card -->
    <div class="hidden md:block sticky top-24">
      <UiBaseCard class="border-2 border-primary-200">
        <div class="text-center mb-6">
          <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Price per Ticket</p>
          <p class="text-5xl font-bold text-primary-600 mb-1">${{ event.price }}</p>
          <p class="text-sm text-gray-600">Individual ticket</p>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-600 mb-2">
            {{ ticketsAvailable }} / {{ event.max_tickets }} tickets remaining
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

        <!-- Extra Items Preview -->
        <div v-if="hasExtraItems" class="mb-6">
          <p class="text-sm font-semibold text-gray-700 mb-2">Available Add-ons:</p>
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
          Buy Tickets Now
        </UiBaseButton>

        <div v-else class="mb-3 text-center py-3 bg-gray-100 rounded-lg">
          <p class="text-gray-600 font-medium">{{ blockedMessage }}</p>
        </div>

        <p class="text-xs text-gray-500 text-center">
          Secure payment powered by Stripe
        </p>

        <!-- Event Quick Info -->
        <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div class="flex items-start gap-3">
            <span class="text-lg">📅</span>
            <div class="text-sm">
              <p class="text-gray-600">{{ formatDate(event.date) }}</p>
              <p class="font-semibold text-gray-900">{{ event.time }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-lg">📍</span>
            <div class="text-sm">
              <p class="font-semibold text-gray-900">{{ event.location }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-lg">🎟️</span>
            <div class="text-sm">
              <p class="text-gray-600">{{ event.max_tickets }} Total Capacity</p>
            </div>
          </div>
          <div v-if="registrationDeadline" class="flex items-start gap-3">
            <span class="text-lg">⏰</span>
            <div class="text-sm">
              <p class="text-gray-600">Register by</p>
              <p class="font-semibold text-gray-900">{{ registrationDeadline }}</p>
            </div>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Padding for mobile bottom bar -->
    <div class="h-20 md:h-0" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const canPurchase = computed(() => {
  return props.availability?.can_purchase ?? props.event.can_purchase ?? true
})

const blockedReason = computed(() => {
  return props.availability?.blocked_reason ?? props.event.purchase_blocked_reason
})

const blockedMessage = computed(() => {
  const messages = {
    not_live: 'Event not available',
    registration_closed: 'Registration closed',
    deadline_passed: 'Registration deadline passed',
    sold_out: 'Sold out'
  }
  return messages[blockedReason.value] || 'Not available'
})

const ticketsAvailable = computed(() => {
  return props.availability?.tickets_available ?? props.event.tickets_available ?? 0
})

const soldPercentage = computed(() => {
  const sold = props.event.tickets_sold || 0
  const max = props.event.max_tickets || 1
  return Math.round((sold / max) * 100)
})

const extraItems = computed(() => {
  // Items can be in availability response or in event.active_items
  const items = props.availability?.items || props.event?.active_items || []
  return items.filter(item => item.is_available || item.available)
})

const hasExtraItems = computed(() => extraItems.value.length > 0)

const registrationDeadline = computed(() => {
  if (!props.event.registration_deadline) return null
  const date = new Date(props.event.registration_deadline)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

const handleBuyTickets = () => {
  navigateTo(`/app/events/${props.event.slug}/checkout`)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
