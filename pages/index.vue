<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="text-3xl font-bold text-primary-600">🎫 EventHub</div>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/app"
              class="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Go to App
            </NuxtLink>
            <NuxtLink
              to="/app/events"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Browse Events
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-32 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-6xl font-bold text-white mb-6">
          Welcome to EventHub
        </h1>
        <p class="text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
          The complete event management and ticketing platform. Create events, manage tickets, and accept payments all in one place.
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
            ⚙️ Admin Panel
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-16">Everything You Need</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white rounded-xl shadow-card p-8 hover:shadow-card-hover transition-all">
            <div class="text-5xl mb-4">📅</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Create Events</h3>
            <p class="text-gray-600 mb-6">
              Set up beautiful event pages with custom details, pricing, hero images, and descriptions.
            </p>
            <div class="space-y-2 text-sm text-gray-700">
              <p>✓ Multi-step event creation</p>
              <p>✓ Custom event pages</p>
              <p>✓ Draft & publish</p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white rounded-xl shadow-card p-8 hover:shadow-card-hover transition-all">
            <div class="text-5xl mb-4">🎟️</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Manage Tickets</h3>
            <p class="text-gray-600 mb-6">
              Track ticket inventory, monitor sales, and see real-time statistics for each event.
            </p>
            <div class="space-y-2 text-sm text-gray-700">
              <p>✓ Real-time sales tracking</p>
              <p>✓ Capacity management</p>
              <p>✓ Revenue analytics</p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white rounded-xl shadow-card p-8 hover:shadow-card-hover transition-all">
            <div class="text-5xl mb-4">💳</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Stripe Integration</h3>
            <p class="text-gray-600 mb-6">
              Secure payment processing with Stripe. Each event gets its own product for easy tracking.
            </p>
            <div class="space-y-2 text-sm text-gray-700">
              <p>✓ Secure payments</p>
              <p>✓ Per-event products</p>
              <p>✓ Revenue tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Two Sides Section -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-16">Two Powerful Platforms</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Public Side -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-12 border-2 border-green-300">
            <h3 class="text-3xl font-bold text-green-900 mb-6">👥 For Event Attendees</h3>
            <p class="text-green-900 mb-8 text-lg">
              Discover amazing events, view details, check availability, and buy tickets securely.
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-3">
                <span class="text-2xl">✓</span>
                <span class="text-green-900">Browse all live events</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-2xl">✓</span>
                <span class="text-green-900">View detailed event pages</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-2xl">✓</span>
                <span class="text-green-900">See real-time ticket availability</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-2xl">✓</span>
                <span class="text-green-900">Secure Stripe checkout</span>
              </li>
            </ul>
            <NuxtLink
              to="/app/events"
              class="inline-block px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
            >
              Explore Events →
            </NuxtLink>
          </div>

          <!-- Admin Side -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 border-2 border-blue-300">
            <h3 class="text-3xl font-bold text-blue-900 mb-6">⚙️ For Event Organizers</h3>
            <p class="text-blue-900 mb-8 text-lg">
              Create, manage, and promote your events. Track sales and payments with ease.
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-3">
                <span class="text-2xl">✓</span>
                <span class="text-blue-900">Create unlimited events</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-2xl">✓</span>
                <span class="text-blue-900">Design custom event pages</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-2xl">✓</span>
                <span class="text-blue-900">Monitor sales in real-time</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-2xl">✓</span>
                <span class="text-blue-900">Integrated Stripe payments</span>
              </li>
            </ul>
            <NuxtLink
              to="/app/admin/events"
              class="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg"
            >
              Go to Admin →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="py-20 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-12">Built With Modern Tech</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="bg-white rounded-xl shadow-card p-6">
            <div class="text-4xl mb-3">🔵</div>
            <p class="font-bold text-gray-900">Vue 3</p>
            <p class="text-sm text-gray-600">Reactive UI framework</p>
          </div>
          <div class="bg-white rounded-xl shadow-card p-6">
            <div class="text-4xl mb-3">📦</div>
            <p class="font-bold text-gray-900">Nuxt 4</p>
            <p class="text-sm text-gray-600">Full-stack framework</p>
          </div>
          <div class="bg-white rounded-xl shadow-card p-6">
            <div class="text-4xl mb-3">🎨</div>
            <p class="font-bold text-gray-900">Tailwind CSS</p>
            <p class="text-sm text-gray-600">Utility-first styling</p>
          </div>
          <div class="bg-white rounded-xl shadow-card p-6">
            <div class="text-4xl mb-3">💳</div>
            <p class="font-bold text-gray-900">Stripe</p>
            <p class="text-sm text-gray-600">Payment processing</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 bg-primary-600">
      <div class="max-w-3xl mx-auto text-center text-white">
        <h2 class="text-4xl font-bold mb-6">Start Using EventHub Today</h2>
        <p class="text-lg text-gray-100 mb-10">
          Whether you're attending events or organizing them, EventHub makes it simple and secure.
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
            class="px-8 py-4 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-bold text-lg border-2 border-white"
          >
            ⚙️ Create Events
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-xl font-bold text-primary-400 mb-4">EventHub</h3>
            <p class="text-gray-400">The complete event management platform.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Platform</h4>
            <ul class="space-y-2 text-gray-400">
              <li><NuxtLink to="/app/events" class="hover:text-white transition-colors">Browse Events</NuxtLink></li>
              <li><NuxtLink to="/app/admin/events" class="hover:text-white transition-colors">Admin Panel</NuxtLink></li>
              <li><NuxtLink to="/app" class="hover:text-white transition-colors">App Dashboard</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Resources</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Legal</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 EventHub. Built with Vue 3, Nuxt 4, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>