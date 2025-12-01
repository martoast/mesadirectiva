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
          @click="handleBuyTickets"
          variant="success"
          size="lg"
          class="flex-1"
        >
          🎫 Buy Tickets
        </UiBaseButton>
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
            📊 {{ event.maxTickets - event.ticketsSold }} / {{ event.maxTickets }} tickets remaining
          </p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full"
              :style="{
                width: `${(event.ticketsSold / event.maxTickets) * 100}%`
              }"
            />
          </div>
        </div>

        <UiBaseButton
          @click="handleBuyTickets"
          variant="success"
          size="lg"
          full-width
          class="mb-3"
        >
          🎫 Buy Tickets Now
        </UiBaseButton>

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
              <p class="text-gray-600">{{ event.maxTickets }} Total Capacity</p>
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
const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const handleBuyTickets = () => {
  navigateTo(`/app/events/${props.event.slug}/checkout-redirect`)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>