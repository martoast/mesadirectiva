<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="border-b border-gray-200 sticky top-0 bg-white z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <NuxtLink to="/app/events" class="text-2xl font-bold text-primary-600">
              EventHub
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/app/events"
              class="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Events
            </NuxtLink>

            <!-- Authenticated User -->
            <template v-if="isAuthenticated">
              <NuxtLink
                to="/app/admin/events"
                class="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Dashboard
              </NuxtLink>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600 hidden sm:inline">{{ user?.name }}</span>
                <button
                  @click="handleLogout"
                  class="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </template>

            <!-- Guest User -->
            <template v-else>
              <NuxtLink
                to="/login"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Login
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div>
      <slot />
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold mb-4">EventHub</h3>
            <p class="text-gray-400 text-sm">Your premier event ticketing platform.</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Platform</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><NuxtLink to="/app/events" class="hover:text-white transition-colors">Browse Events</NuxtLink></li>
              <li v-if="isAuthenticated"><NuxtLink to="/app/admin/events" class="hover:text-white transition-colors">Admin Panel</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { user, isAuthenticated, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>
