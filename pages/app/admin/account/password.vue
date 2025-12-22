<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink
        to="/app/admin/account"
        class="text-primary-600 hover:text-primary-700 font-semibold mb-4 inline-block"
      >
        ← Back to Account
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Change Password</h1>
      <p class="text-gray-600 mt-2">Update your account password</p>
    </div>

    <!-- Password Form -->
    <form @submit.prevent="handleSubmit" class="max-w-2xl space-y-6">
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Password Settings</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Current Password *</label>
          <input
            v-model="form.current_password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="8"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password *</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Confirm your new password"
          />
          <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">Passwords do not match</p>
        </div>

        <div class="p-4 bg-blue-50 rounded-lg">
          <p class="text-sm font-semibold text-blue-900 mb-2">Password Requirements:</p>
          <ul class="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>At least 8 characters long</li>
            <li>Must match the confirmation password</li>
          </ul>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
        Password changed successfully! You will be redirected shortly.
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex gap-4 justify-between">
        <NuxtLink
          to="/app/admin/account"
          class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting || passwordMismatch"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
        >
          {{ submitting ? 'Changing...' : 'Change Password' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()
const { changePassword } = useProfile()

const error = ref('')
const success = ref(false)
const submitting = ref(false)

const form = reactive({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const passwordMismatch = computed(() => {
  return form.password && form.password_confirmation && form.password !== form.password_confirmation
})

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  submitting.value = true
  error.value = ''
  success.value = false

  try {
    await changePassword({
      current_password: form.current_password,
      password: form.password,
      password_confirmation: form.password_confirmation
    })
    success.value = true

    // Clear form
    form.current_password = ''
    form.password = ''
    form.password_confirmation = ''

    // Redirect after short delay
    setTimeout(() => {
      router.push('/app/admin/account')
    }, 2000)
  } catch (e) {
    error.value = e.message || 'Failed to change password'
  } finally {
    submitting.value = false
  }
}
</script>
