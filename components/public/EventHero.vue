<template>
  <div class="relative h-96 md:h-screen overflow-hidden bg-gradient-to-br from-primary-600 to-primary-900">
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-center opacity-40"
      :style="{
        backgroundImage: `url('${event.heroImage}')`
      }"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-30" />

    <!-- Content -->
    <div class="relative h-full flex flex-col items-center justify-center text-center px-4">
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {{ event.heroTitle }}
        </h1>
        <p class="text-xl md:text-2xl text-gray-100 mb-8 drop-shadow-md">
          {{ event.heroSubtitle }}
        </p>

        <!-- Event Meta -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-6 text-white mb-8">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📅</span>
            <div class="text-left">
              <p class="text-sm opacity-80">Date & Time</p>
              <p class="font-semibold">{{ formatDate(event.date) }} at {{ event.time }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">📍</span>
            <div class="text-left">
              <p class="text-sm opacity-80">Location</p>
              <p class="font-semibold">{{ event.location }}</p>
            </div>
          </div>
        </div>

        <!-- Ticket Info -->
        <div class="inline-block bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-8 py-4 border border-white border-opacity-20">
          <p class="text-gray-200 text-sm mb-1">Starting at</p>
          <p class="text-4xl font-bold text-white">${{ event.price }}</p>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <span class="text-white text-2xl">↓</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
