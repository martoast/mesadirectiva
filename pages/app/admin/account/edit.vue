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
      <h1 class="text-3xl font-bold text-gray-900">Edit Profile</h1>
      <p class="text-gray-600 mt-2">Update your personal information</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading profile...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ loadError }}
    </div>

    <!-- Edit Form -->
    <form v-else @submit.prevent="handleSubmit" class="max-w-2xl space-y-6">
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Personal Information</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            :value="email"
            type="email"
            disabled
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
          <p class="mt-1 text-sm text-gray-500">Email address cannot be changed</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
        Profile updated successfully!
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
          :disabled="submitting"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
        >
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()
const { getProfile, updateProfile } = useProfile()

const loading = ref(true)
const loadError = ref('')
const error = ref('')
const success = ref(false)
const submitting = ref(false)
const email = ref('')

const form = reactive({
  name: '',
  phone: ''
})

const fetchProfile = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const response = await getProfile()
    const user = response.user
    form.name = user.name || ''
    form.phone = user.phone || ''
    email.value = user.email || ''
  } catch (e) {
    loadError.value = e.message || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''
  success.value = false

  try {
    await updateProfile({
      name: form.name,
      phone: form.phone || null
    })
    success.value = true

    // Redirect after short delay
    setTimeout(() => {
      router.push('/app/admin/account')
    }, 1500)
  } catch (e) {
    error.value = e.message || 'Failed to update profile'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>
