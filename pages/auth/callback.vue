<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="error" class="max-w-md mx-auto">
        <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
          {{ error }}
        </div>
        <NuxtLink to="/login" class="text-primary-600 hover:text-primary-700">
          Back to login
        </NuxtLink>
      </div>
      <div v-else class="flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { handleOAuthCallback } = useAuth()
const router = useRouter()
const route = useRoute()

const error = ref('')

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    error.value = 'No authentication token provided.'
    return
  }

  try {
    await handleOAuthCallback(token)
    router.push('/app/admin/events')
  } catch (e) {
    error.value = e.message || 'Authentication failed. Please try again.'
  }
})
</script>
