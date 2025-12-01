<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        Tailwind Test Page
      </h1>
      <p class="text-gray-600 mb-6">
        If you see styled content below, Tailwind is working correctly.
      </p>

      <!-- Color Test -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="h-20 bg-primary-500 rounded-lg flex items-center justify-center text-white font-medium">
          Primary
        </div>
        <div class="h-20 bg-secondary-500 rounded-lg flex items-center justify-center text-white font-medium">
          Secondary
        </div>
        <div class="h-20 bg-success-500 rounded-lg flex items-center justify-center text-white font-medium">
          Success
        </div>
        <div class="h-20 bg-danger-500 rounded-lg flex items-center justify-center text-white font-medium">
          Danger
        </div>
      </div>

      <!-- Button Test -->
      <div class="flex flex-wrap gap-3 mb-8">
        <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Primary Button
        </button>
        <button class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Secondary Button
        </button>
        <button class="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors">
          Danger Button
        </button>
      </div>

      <!-- Card Test -->
      <div class="bg-white rounded-xl shadow-card p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Card Component</h2>
        <p class="text-gray-600">This card uses our custom shadow-card utility.</p>
      </div>

      <!-- Responsive Test -->
      <div class="p-4 rounded-lg bg-primary-100 text-primary-800 md:bg-secondary-100 md:text-secondary-800 lg:bg-success-100 lg:text-success-800">
        <p class="font-medium">Responsive Test:</p>
        <p class="text-sm">Mobile = Blue | Tablet = Purple | Desktop = Green</p>
      </div>
    </div>
  </div>
</template>