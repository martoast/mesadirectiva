<template>
  <div class="space-y-6">
    <div class="mb-8">
      <NuxtLink
        to="/app/admin/users"
        class="text-primary-600 hover:text-primary-700 font-semibold mb-4 inline-block"
      >
        ← Back to Users
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Edit User</h1>
      <p v-if="user" class="text-gray-600 mt-2">{{ user.name }} ({{ user.email }})</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading user...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ loadError }}
    </div>

    <!-- Edit Form -->
    <form v-else-if="user" @submit.prevent="handleSubmit" class="max-w-2xl space-y-6">
      <!-- User Information -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">User Information</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            v-model="form.password"
            type="password"
            minlength="8"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Leave empty to keep current password"
          />
        </div>

        <div v-if="form.password">
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Confirm new password"
          />
          <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">Passwords do not match</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role *</label>
          <select
            v-model="form.role"
            required
            :disabled="user.role === 'super_admin'"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
          >
            <option v-if="user.role === 'super_admin'" value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <p v-if="user.role === 'super_admin'" class="mt-1 text-sm text-gray-500">
            Super Admin role cannot be changed.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.is_active"
            type="checkbox"
            id="is_active"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label for="is_active" class="text-sm font-medium text-gray-700">Active</label>
          <span class="text-sm text-gray-500">(Inactive users cannot log in)</span>
        </div>
      </div>

      <!-- Category Permissions -->
      <div v-if="user.role !== 'super_admin'" class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Category Permissions</h2>
        <p class="text-sm text-gray-600">
          Assign which categories this user can access and what permissions they have.
        </p>

        <div v-if="categories.length === 0" class="text-center py-4">
          <p class="text-gray-600">No categories available.</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: category.color }"
              ></div>
              <span class="font-medium text-gray-900">{{ category.name }}</span>
            </div>
            <select
              v-model="categoryPermissions[category.id]"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">No access</option>
              <option value="view">View only</option>
              <option value="edit">View & Edit</option>
              <option value="manage">Full control</option>
            </select>
          </div>
        </div>

        <!-- Permission Legend -->
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm font-semibold text-blue-900 mb-2">Permission Levels:</p>
          <ul class="text-sm text-blue-800 space-y-1">
            <li><strong>View:</strong> Can see events in this category (read-only)</li>
            <li><strong>Edit:</strong> Can create and update events</li>
            <li><strong>Manage:</strong> Full control - create, update, and delete events</li>
          </ul>
        </div>
      </div>

      <div v-else class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        Super Admins have full access to all categories and don't need category-specific permissions.
      </div>

      <!-- Form Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex gap-4 justify-between">
        <NuxtLink
          to="/app/admin/users"
          class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting || passwordMismatch"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
        >
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'super-admin']
})

const route = useRoute()
const router = useRouter()
const { getUser, updateUser, assignCategories } = useUsers()
const { getCategories } = useCategories()

const user = ref(null)
const categories = ref([])
const loading = ref(true)
const loadError = ref('')
const error = ref('')
const submitting = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'admin',
  is_active: true
})

// Track permissions for each category
const categoryPermissions = reactive({})

const passwordMismatch = computed(() => {
  return form.password && form.password_confirmation && form.password !== form.password_confirmation
})

const fetchData = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const [userResponse, categoriesResponse] = await Promise.all([
      getUser(route.params.id),
      getCategories()
    ])

    user.value = userResponse.user
    categories.value = categoriesResponse.categories || []

    // Populate form with user data
    form.name = user.value.name
    form.email = user.value.email
    form.role = user.value.role
    form.is_active = user.value.is_active

    // Initialize category permissions
    categories.value.forEach(cat => {
      categoryPermissions[cat.id] = ''
    })

    // Set existing permissions
    if (user.value.categories) {
      user.value.categories.forEach(cat => {
        categoryPermissions[cat.id] = cat.pivot?.permission || cat.permission || ''
      })
    }
  } catch (e) {
    loadError.value = e.message || 'Failed to load user'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  submitting.value = true
  error.value = ''

  try {
    // 1. Update user info
    const userData = {
      name: form.name,
      email: form.email,
      role: form.role,
      is_active: form.is_active
    }

    // Only include password if provided
    if (form.password) {
      userData.password = form.password
      userData.password_confirmation = form.password_confirmation
    }

    await updateUser(route.params.id, userData)

    // 2. Update category permissions (if not super_admin)
    if (user.value.role !== 'super_admin') {
      const selectedCategories = Object.entries(categoryPermissions)
        .filter(([_, permission]) => permission !== '')
        .map(([id, permission]) => ({
          id: parseInt(id),
          permission
        }))

      await assignCategories(route.params.id, selectedCategories)
    }

    // Success - redirect to users list
    router.push('/app/admin/users')
  } catch (e) {
    error.value = e.message || 'Failed to update user'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
