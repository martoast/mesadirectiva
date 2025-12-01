<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation for app landing -->
    <nav class="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="text-3xl font-bold text-primary-600">🎫 EventHub</div>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/app/events"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Browse Events
            </NuxtLink>
            <NuxtLink
              to="/app/admin/events"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Admin Panel
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-24 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to EventHub
        </h1>
        <p class="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
          The easiest way to discover, manage, and sell event tickets. Create events, track sales, and process payments all in one place.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink
            to="/app/events"
            class="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            🎫 Browse Events
          </NuxtLink>
          <NuxtLink
            to="/app/admin/events"
            class="px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-400 transition-colors font-bold text-lg border-2 border-white"
          >
            ⚙️ Go to Admin
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">How EventHub Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white rounded-xl shadow-card p-8">
            <div class="text-4xl mb-4">📅</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Create Events</h3>
            <p class="text-gray-600">
              Use our intuitive admin panel to create events with custom details, pricing, and event page designs.
            </p>
            <NuxtLink
              to="/app/admin/events/create"
              class="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
            >
              Create Event →
            </NuxtLink>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white rounded-xl shadow-card p-8">
            <div class="text-4xl mb-4">🎟️</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Manage Tickets</h3>
            <p class="text-gray-600">
              Set ticket quantities, track sales in real-time, and manage all your event details from one dashboard.
            </p>
            <NuxtLink
              to="/app/admin/events"
              class="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
            >
              View Dashboard →
            </NuxtLink>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white rounded-xl shadow-card p-8">
            <div class="text-4xl mb-4">💳</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Accept Payments</h3>
            <p class="text-gray-600">
              Integrated with Stripe for secure payment processing. Each event is a separate product for easy revenue tracking.
            </p>
            <NuxtLink
              to="/app/events"
              class="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
            >
              Browse Events →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- User vs Admin Section -->
    <section class="py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Two Powerful Sides</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- User Side -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-300">
            <h3 class="text-2xl font-bold text-green-900 mb-4">👥 For Attendees</h3>
            <ul class="space-y-3 text-green-900 mb-6">
              <li class="flex items-start gap-3">
                <span>✓</span>
                <span>Browse live events from all over</span>
              </li>
              <li class="flex items-start gap-3">
                <span>✓</span>
                <span>View detailed event information and descriptions</span>
              </li>
              <li class="flex items-start gap-3">
                <span>✓</span>
                <span>See real-time ticket availability</span>
              </li>
              <li class="flex items-start gap-3">
                <span>✓</span>
                <span>Secure payment via Stripe</span>
              </li>
            </ul>
            <NuxtLink
              to="/app/events"
              class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Explore Events →
            </NuxtLink>
          </div>

          <!-- Admin Side -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-300">
            <h3 class="text-2xl font-bold text-blue-900 mb-4">⚙️ For Event Organizers</h3>
            <ul class="space-y-3 text-blue-900 mb-6">
              <li class="flex items-start gap-3">
                <span>✓</span>
                <span>Create and manage unlimited events</span>
              </li>
              <li class="flex items-start gap-3">
                <span>✓</span>
                <span>Design beautiful public event pages</span>
              </li>
              <li class="flex items-start gap-3">
                <span>✓</span>
                <span>Track ticket sales and revenue in real-time</span>
              </li>
              <li class="flex items-start gap-3">
                <span>✓</span>
                <span>Integrated Stripe payments per event</span>
              </li>
            </ul>
            <NuxtLink
              to="/app/admin/events"
              class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Go to Admin →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">{{ totalEvents }}</div>
            <p class="text-gray-600 font-medium">Total Events</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-success-600 mb-2">{{ liveEvents }}</div>
            <p class="text-gray-600 font-medium">Live Events</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">{{ totalTickets }}</div>
            <p class="text-gray-600 font-medium">Tickets Sold</p>
          </div>
          <div>
            <div class="text-4xl font-bold text-success-600 mb-2">${{ totalRevenue }}</div>
            <p class="text-gray-600 font-medium">Revenue</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 bg-primary-600">
      <div class="max-w-3xl mx-auto text-center text-white">
        <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-lg text-gray-100 mb-8">
          Whether you're looking to attend amazing events or organize your own, EventHub is here to help.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink
            to="/app/events"
            class="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-bold"
          >
            Browse Events
          </NuxtLink>
          <NuxtLink
            to="/app/admin/events"
            class="px-8 py-4 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-bold border-2 border-white"
          >
            Create an Event
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-gray-400 mb-4">
          EventHub — The easiest way to manage events and tickets
        </p>
        <p class="text-sm text-gray-500">
          &copy; 2025 EventHub. Built with Vue 3, Nuxt 4, and Tailwind CSS.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMockEvents } from '~/composables/useMockEvents'

definePageMeta({
  layout: 'default'
})

const { getEvents } = useMockEvents()
const events = getEvents()

const totalEvents = computed(() => events.length)
const liveEvents = computed(() => events.filter(e => e.status === 'live').length)
const totalTickets = computed(() => events.reduce((sum, e) => sum + e.ticketsSold, 0))
const totalRevenue = computed(() => events.reduce((sum, e) => sum + (e.ticketsSold * e.price), 0))
</script>
