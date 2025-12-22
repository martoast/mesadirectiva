<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full text-center">
      <div class="bg-white rounded-xl shadow-card p-8">
        <!-- Cancel Icon -->
        <div class="w-20 h-20 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p class="text-gray-600 mb-6">
          Your payment was not completed. No charges have been made to your account.
        </p>

        <div class="space-y-3">
          <NuxtLink
            :to="`/app/events/${route.params.slug}/checkout`"
            class="block w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Try Again
          </NuxtLink>
          <NuxtLink
            :to="`/app/events/${route.params.slug}`"
            class="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Back to Event
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public'
})

const route = useRoute()
</script>
