<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Users</h1>
        <p class="text-gray-600 mt-1">Manage system users and permissions</p>
      </div>
      <NuxtLink
        to="/app/admin/users/create"
        class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
      >
        + Create User
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center">
      <input
        v-model="search"
        type="text"
        placeholder="Search users..."
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        @input="debouncedSearch"
      />
      <select
        v-model="filterRole"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Roles</option>
        <option value="super_admin">Super Admin</option>
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white rounded-xl shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Categories</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-primary-600 font-medium">{{ getInitials(user.name) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="roleClass(user.role)">
                  {{ roleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="user.is_active ? 'text-success-600' : 'text-gray-500'">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div v-if="user.categories?.length" class="flex flex-wrap gap-1">
                  <span
                    v-for="cat in user.categories.slice(0, 2)"
                    :key="cat.id"
                    class="px-2 py-0.5 text-xs rounded-full text-white"
                    :style="{ backgroundColor: cat.color }"
                  >
                    {{ cat.name }}
                  </span>
                  <span v-if="user.categories.length > 2" class="text-xs text-gray-500">
                    +{{ user.categories.length - 2 }} more
                  </span>
                </div>
                <span v-else class="text-gray-400 text-sm">-</span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <NuxtLink
                    :to="`/app/admin/users/${user.id}`"
                    class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    @click="handleToggleActive(user)"
                    class="px-3 py-1 text-sm rounded-lg transition-colors"
                    :class="user.is_active ? 'bg-warning-100 text-warning-700 hover:bg-warning-200' : 'bg-success-100 text-success-700 hover:bg-success-200'"
                  >
                    {{ user.is_active ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="users.length === 0" class="p-12 text-center">
        <p class="text-gray-600 text-lg">No users found.</p>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="p-4 border-t border-gray-200 flex justify-center gap-2">
        <button
          v-for="page in meta.last_page"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'super-admin']
})

const { getUsers, toggleActive } = useUsers()

const users = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

let searchTimeout = null

const fetchUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = {
      per_page: 15,
      page: currentPage.value
    }

    if (search.value) {
      params.search = search.value
    }

    if (filterRole.value) {
      params.role = filterRole.value
    }

    const response = await getUsers(params)
    users.value = response.users || []
    meta.value = response.meta || meta.value
  } catch (e) {
    error.value = e.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUsers()
  }, 300)
}

const handleToggleActive = async (user) => {
  try {
    await toggleActive(user.id)
    fetchUsers()
  } catch (e) {
    error.value = e.message || 'Failed to update user status'
  }
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const roleLabel = (role) => {
  const labels = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    viewer: 'Viewer'
  }
  return labels[role] || role
}

const roleClass = (role) => {
  const classes = {
    super_admin: 'px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800',
    admin: 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800',
    viewer: 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
  }
  return classes[role] || classes.viewer
}

watch([filterRole, currentPage], () => {
  fetchUsers()
})

onMounted(() => {
  fetchUsers()
})
</script>
