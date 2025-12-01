<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary-50 to-primary-100">
    <div class="max-w-md w-full">
        <UiBaseCard class="text-center">
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 animate-pulse">
              <span class="text-3xl">💳</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p class="text-gray-600">{{ event?.name }}</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-600">Ticket Price:</span>
              <span class="text-2xl font-bold text-primary-600">${{ event?.price }}</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-600">Quantity:</span>
              <span class="text-lg font-semibold">1 Ticket</span>
            </div>
            <div class="border-t pt-4 flex justify-between items-center">
              <span class="font-semibold text-gray-900">Total:</span>
              <span class="text-2xl font-bold text-primary-600">${{ event?.price }}</span>
            </div>
          </div>


          <p class="text-sm text-gray-500 mb-6">
            Event: {{ event?.date }} at {{ event?.location }}
          </p>

          <div class="space-y-3">
            <p class="text-sm text-gray-600">
              🎟️ If you are not automatically redirected in a few seconds...
            </p>
            <button
              @click="handleManualRedirect"
              class="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Continue to Stripe
            </button>
            <NuxtLink
              :to="`/app/events/${route.params.slug}`"
              class="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-center"
            >
              Back to Event
            </NuxtLink>
          </div>

          <!-- Development Info -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="p-4 bg-warning-50 rounded-lg text-left">
              <p class="text-xs font-semibold text-warning-900 uppercase mb-2">💡 Development Info</p>
              <p class="text-xs text-warning-800 mb-2">
                This is a prototype. In production, this page would redirect to Stripe Checkout using:
              </p>
              <code class="text-xs bg-white p-2 rounded border border-warning-200 block text-gray-700 break-words">
                {{ event?.stripePriceId || 'price_xxx' }}
              </code>
            </div>
          </div>
        </UiBaseCard>
      </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMockEvents } from '~/composables/useMockEvents'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { getEventBySlug } = useMockEvents()
const event = computed(() => getEventBySlug(route.params.slug))

// Auto-redirect after 3 seconds (in production)
onMounted(() => {
  // In a real implementation, this would redirect to Stripe
  // setTimeout(() => {
  //   window.location.href = `https://checkout.stripe.com/pay/${event.value.stripePriceId}`
  // }, 3000)
})

const handleManualRedirect = () => {
  // In a real implementation, this would open Stripe Checkout
  alert('🎟️ In production, this would redirect to Stripe Checkout for event: ' + event.value?.name)
}
</script>
