<template>
  <div class="space-y-6">
    <div class="mb-8">
      <NuxtLink
        to="/app/admin/users"
        class="text-primary-600 hover:text-primary-700 font-semibold mb-4 inline-block"
      >
        ← Back to Users
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Create New User</h1>
      <p class="text-gray-600 mt-2">Add a new admin or viewer to the system.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="max-w-2xl space-y-6">
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
            placeholder="Maria Garcia"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="maria@school.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Confirm password"
          />
          <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">Passwords do not match</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role *</label>
          <select
            v-model="form.role"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <p class="mt-1 text-sm text-gray-500">
            <span v-if="form.role === 'admin'">Admins can create, edit, and manage events in their assigned groups.</span>
            <span v-else>Viewers can only view events in their assigned groups (read-only).</span>
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

      <!-- Group Permissions -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Group Permissions</h2>
        <p class="text-sm text-gray-600">
          Assign which groups this user can access and what permissions they have.
        </p>

        <div v-if="loadingGroups" class="text-center py-4">
          <p class="text-gray-600">Loading groups...</p>
        </div>

        <div v-else-if="groups.length === 0" class="text-center py-4">
          <p class="text-gray-600">No groups available. Create groups first.</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="group in groups"
            :key="group.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: group.color }"
              ></div>
              <span class="font-medium text-gray-900">{{ group.name }}</span>
            </div>
            <select
              v-model="groupPermissions[group.id]"
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
            <li><strong>View:</strong> Can see events in this group (read-only)</li>
            <li><strong>Edit:</strong> Can create and update events</li>
            <li><strong>Manage:</strong> Full control - create, update, and delete events</li>
          </ul>
        </div>
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
          {{ submitting ? 'Creating...' : 'Create User' }}
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

const router = useRouter()
const { createUser, assignGroups } = useUsers()
const { getGroups } = useGroups()

const groups = ref([])
const loadingGroups = ref(true)
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

// Track permissions for each group
const groupPermissions = reactive({})

const passwordMismatch = computed(() => {
  return form.password && form.password_confirmation && form.password !== form.password_confirmation
})

const fetchGroups = async () => {
  loadingGroups.value = true
  try {
    const response = await getGroups()
    groups.value = response.groups || []
    // Initialize permissions as empty (no access)
    groups.value.forEach(group => {
      groupPermissions[group.id] = ''
    })
  } catch (e) {
    // Groups are optional
  } finally {
    loadingGroups.value = false
  }
}

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  submitting.value = true
  error.value = ''

  try {
    // 1. Create the user
    const userData = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      role: form.role,
      is_active: form.is_active
    }

    const response = await createUser(userData)
    const userId = response.user.id

    // 2. Assign group permissions (if any selected)
    const selectedGroups = Object.entries(groupPermissions)
      .filter(([_, permission]) => permission !== '')
      .map(([id, permission]) => ({
        id: parseInt(id),
        permission
      }))

    if (selectedGroups.length > 0) {
      await assignGroups(userId, selectedGroups)
    }

    // Success - redirect to users list
    router.push('/app/admin/users')
  } catch (e) {
    error.value = e.message || 'Failed to create user'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchGroups()
})
</script>
