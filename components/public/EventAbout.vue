<template>
  <section class="py-16 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- Content -->
        <div class="md:col-span-2">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
          <div class="prose prose-lg max-w-none">
            <p class="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {{ event.about }}
            </p>
          </div>

          <!-- Event Details Grid -->
          <div class="mt-12 grid grid-cols-2 gap-6">
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Event Date</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatDate(event.date) }}</p>
              <p class="text-gray-600 mt-1">{{ event.time }}</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Location</p>
              <p class="text-2xl font-bold text-gray-900">{{ event.location }}</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Tickets Available</p>
              <p class="text-2xl font-bold text-gray-900">{{ event.maxTickets - event.ticketsSold }}</p>
              <p class="text-gray-600 text-sm mt-1">of {{ event.maxTickets }} total</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Price per Ticket</p>
              <p class="text-2xl font-bold text-primary-600">${{ event.price }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <!-- Status Badge -->
          <div class="mb-6 p-6 bg-success-50 rounded-xl border border-success-200">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">✅</span>
              <p class="font-semibold text-success-900">Event Status</p>
            </div>
            <p class="text-success-800">
              {{ event.status === 'live' ? 'Live & Accepting Tickets' : 'Coming Soon' }}
            </p>
          </div>

          <!-- Sales Progress -->
          <div class="p-6 bg-gray-50 rounded-xl">
            <p class="text-sm font-semibold text-gray-600 uppercase mb-3">Ticket Sales</p>
            <div class="mb-3">
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  :style="{
                    width: `${(event.ticketsSold / event.maxTickets) * 100}%`
                  }"
                />
              </div>
            </div>
            <p class="text-sm text-gray-600">
              {{ event.ticketsSold }} of {{ event.maxTickets }} tickets sold
            </p>
            <p class="text-lg font-bold text-primary-600 mt-2">
              {{ Math.round((event.ticketsSold / event.maxTickets) * 100) }}% Sold
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
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
