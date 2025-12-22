<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="w-64 bg-secondary-800 text-white p-6 overflow-y-auto hidden md:flex md:flex-col">
      <div class="mb-8">
        <NuxtLink to="/app/admin/events" class="block">
          <h2 class="text-2xl font-bold text-primary-400">EventHub</h2>
          <p class="text-secondary-400 text-sm mt-1">Admin Panel</p>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="space-y-1 flex-1">
        <NuxtLink
          to="/app/admin/events"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
          active-class="bg-primary-600 text-white hover:bg-primary-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Events
        </NuxtLink>

        <NuxtLink
          v-if="isSuperAdmin"
          to="/app/admin/categories"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
          active-class="bg-primary-600 text-white hover:bg-primary-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          Categories
        </NuxtLink>

        <NuxtLink
          v-if="isSuperAdmin"
          to="/app/admin/users"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
          active-class="bg-primary-600 text-white hover:bg-primary-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          Users
        </NuxtLink>

        <NuxtLink
          to="/app/admin/orders"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
          active-class="bg-primary-600 text-white hover:bg-primary-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          Orders
        </NuxtLink>

        <!-- Reports Submenu -->
        <div class="pt-4 mt-4 border-t border-secondary-700">
          <p class="px-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">Reports</p>
          <NuxtLink
            to="/app/admin/reports/sales"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
            active-class="bg-primary-600 text-white hover:bg-primary-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Sales Report
          </NuxtLink>
          <NuxtLink
            to="/app/admin/reports/orders"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
            active-class="bg-primary-600 text-white hover:bg-primary-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Orders Report
          </NuxtLink>
        </div>
      </nav>

      <!-- User Info & Actions -->
      <div class="mt-auto pt-6 border-t border-secondary-700">
        <NuxtLink
          to="/app/events"
          class="flex items-center gap-3 px-4 py-2 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors mb-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          View Public Site
        </NuxtLink>

        <NuxtLink
          v-if="user"
          to="/app/admin/account"
          class="block px-4 py-3 bg-secondary-700 rounded-lg mb-2 hover:bg-secondary-600 transition-colors"
        >
          <p class="font-medium text-white truncate">{{ user.name }}</p>
          <p class="text-sm text-secondary-400 truncate">{{ user.email }}</p>
          <span class="inline-block mt-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
            {{ roleLabel }}
          </span>
        </NuxtLink>

        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </button>
      </div>
    </div>

    <!-- Mobile Header -->
    <div class="md:hidden fixed top-0 left-0 right-0 bg-secondary-800 text-white z-50">
      <div class="flex items-center justify-between px-4 py-3">
        <NuxtLink to="/app/admin/events" class="text-xl font-bold text-primary-400">
          EventHub
        </NuxtLink>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 rounded-lg hover:bg-secondary-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="px-4 pb-4 space-y-1">
        <NuxtLink
          to="/app/admin/events"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 rounded-lg hover:bg-secondary-700"
        >
          Events
        </NuxtLink>
        <NuxtLink
          v-if="isSuperAdmin"
          to="/app/admin/categories"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 rounded-lg hover:bg-secondary-700"
        >
          Categories
        </NuxtLink>
        <NuxtLink
          v-if="isSuperAdmin"
          to="/app/admin/users"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 rounded-lg hover:bg-secondary-700"
        >
          Users
        </NuxtLink>
        <NuxtLink
          to="/app/admin/orders"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 rounded-lg hover:bg-secondary-700"
        >
          Orders
        </NuxtLink>
        <NuxtLink
          to="/app/admin/reports/sales"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 rounded-lg hover:bg-secondary-700"
        >
          Sales Report
        </NuxtLink>
        <div class="border-t border-secondary-700 my-2"></div>
        <NuxtLink
          to="/app/admin/account"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 rounded-lg hover:bg-secondary-700"
        >
          My Account
        </NuxtLink>
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 rounded-lg hover:bg-secondary-700 text-red-400"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden md:ml-0">
      <!-- Content -->
      <div class="flex-1 overflow-auto pt-14 md:pt-0">
        <div class="p-6 max-w-7xl mx-auto">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { user, logout, isSuperAdmin } = useAuth()
const router = useRouter()

const mobileMenuOpen = ref(false)

const roleLabel = computed(() => {
  const labels = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    viewer: 'Viewer'
  }
  return labels[user.value?.role] || user.value?.role
})

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>
