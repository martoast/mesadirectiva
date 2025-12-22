<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full text-center">
      <div class="bg-white rounded-xl shadow-card p-8">
        <!-- Success Icon -->
        <div class="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
        <p class="text-gray-600 mb-6">Your order has been confirmed.</p>

        <!-- Order Info -->
        <div v-if="orderNumber" class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-600 mb-1">Order Number</p>
          <p class="text-lg font-bold text-gray-900">{{ orderNumber }}</p>
        </div>

        <p class="text-sm text-gray-600 mb-6">
          A confirmation email has been sent to your email address with your ticket details.
        </p>

        <div class="space-y-3">
          <NuxtLink
            :to="`/app/events/${route.params.slug}`"
            class="block w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Back to Event
          </NuxtLink>
          <NuxtLink
            to="/app/events"
            class="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Browse More Events
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({
  layout: 'public'
})

const route = useRoute()

// Extract order number from session storage or query params
const orderNumber = computed(() => {
  if (import.meta.client) {
    const stored = sessionStorage.getItem('lastOrderNumber')
    if (stored) {
      sessionStorage.removeItem('lastOrderNumber')
      return stored
    }
  }
  return route.query.order || null
})
</script>
