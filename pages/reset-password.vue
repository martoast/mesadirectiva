<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-600">EventHub</h1>
        <h2 class="mt-6 text-2xl font-bold text-gray-900">Set new password</h2>
        <p class="mt-2 text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="text-center">
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          <p class="font-medium">Password reset successful!</p>
          <p class="mt-1 text-sm">You can now login with your new password.</p>
        </div>
        <NuxtLink
          to="/login"
          class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Go to login
        </NuxtLink>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage && !success" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              New password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter new password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </span>
            <span v-else>Reset password</span>
          </button>
        </div>
      </form>

      <!-- Back to Login -->
      <div v-if="!success" class="text-center">
        <NuxtLink to="/login" class="text-sm text-primary-600 hover:text-primary-700">
          Back to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'guest'
})

const { resetPassword } = useAuth()
const route = useRoute()
const router = useRouter()

const form = ref({
  password: '',
  password_confirmation: ''
})

const token = ref('')
const email = ref('')
const loading = ref(false)
const success = ref(false)
const errorMessage = ref('')
const errors = ref({})

onMounted(() => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''

  if (!token.value || !email.value) {
    errorMessage.value = 'Invalid reset link. Please request a new password reset.'
  }
})

const handleSubmit = async () => {
  if (!token.value || !email.value) {
    errorMessage.value = 'Invalid reset link. Please request a new password reset.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    await resetPassword(
      token.value,
      email.value,
      form.value.password,
      form.value.password_confirmation
    )
    success.value = true
  } catch (e) {
    if (e.errors) {
      errors.value = e.errors
    }
    errorMessage.value = e.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
