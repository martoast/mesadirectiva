<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="w-64 bg-secondary-800 text-white p-6 overflow-y-auto hidden md:block">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-primary-400">AdminHub</h2>
        <p class="text-secondary-400 text-sm mt-1">Event Management</p>
      </div>

      <nav class="space-y-2">
        <NuxtLink
          to="/app/admin/events"
          class="block px-4 py-2 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
          active-class="bg-primary-600 text-white"
        >
          📋 Events
        </NuxtLink>
        <NuxtLink
          to="/app/events"
          class="block px-4 py-2 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors"
        >
          👁️ View Public
        </NuxtLink>
      </nav>

      <div class="mt-8 pt-8 border-t border-secondary-700">
        <button
          @click="navigateTo('/')"
          class="w-full px-4 py-2 rounded-lg text-secondary-100 hover:bg-secondary-700 transition-colors text-left"
        >
          🏠 Back to Home
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Event Management</h1>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/app/admin/events"
            class="text-sm text-primary-600 hover:text-primary-700"
          >
            Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto">
        <div class="p-6 max-w-7xl mx-auto">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>


