<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Account</h1>
        <p class="text-gray-600 mt-1">View your profile information and permissions</p>
      </div>
      <NuxtLink
        to="/app/admin/account/edit"
        class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
      >
        Edit Profile
      </NuxtLink>
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
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Profile Content -->
    <template v-else-if="profile">
      <!-- User Info Card -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Full Name</p>
            <p class="text-lg text-gray-900">{{ profile.name }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Email Address</p>
            <p class="text-lg text-gray-900">{{ profile.email }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
            <p class="text-lg text-gray-900">{{ profile.phone || 'Not set' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Role</p>
            <span :class="roleClass">{{ roleLabel }}</span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Account Status</p>
            <span :class="statusClass">{{ profile.is_active ? 'Active' : 'Inactive' }}</span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Member Since</p>
            <p class="text-lg text-gray-900">{{ formatDate(profile.created_at) }}</p>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <NuxtLink
            to="/app/admin/account/password"
            class="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Change Password
          </NuxtLink>
        </div>
      </div>

      <!-- Permissions Card -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Group Permissions</h2>
        <p class="text-gray-600 mb-6">Your access level for each event group</p>

        <!-- Super Admin Notice -->
        <div v-if="profile.role === 'super_admin'" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <div class="flex items-center gap-2">
            <span class="text-xl">👑</span>
            <p class="font-medium">Super Admin Access</p>
          </div>
          <p class="mt-1 text-sm">You have full access to all groups and all actions.</p>
        </div>

        <!-- Group Permissions List -->
        <div v-else-if="profile.groups && profile.groups.length > 0" class="space-y-3">
          <div
            v-for="group in profile.groups"
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
            <span :class="permissionClass(group.permission)">
              {{ permissionLabel(group.permission) }}
            </span>
          </div>
        </div>

        <!-- No Permissions -->
        <div v-else class="text-center py-8">
          <p class="text-gray-600">You don't have any group permissions assigned.</p>
          <p class="text-sm text-gray-500 mt-1">Contact a Super Admin to request access.</p>
        </div>

        <!-- Permission Legend -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-semibold text-gray-700 mb-3">Permission Levels:</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="flex items-start gap-2">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 whitespace-nowrap">View</span>
              <span class="text-gray-600">Read-only access to events</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-100 text-warning-800 whitespace-nowrap">Edit</span>
              <span class="text-gray-600">Create and update events</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-success-100 text-success-800 whitespace-nowrap">Manage</span>
              <span class="text-gray-600">Full control including delete</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { getProfile } = useProfile()

const profile = ref(null)
const loading = ref(true)
const error = ref('')

const roleLabel = computed(() => {
  const labels = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    viewer: 'Viewer'
  }
  return labels[profile.value?.role] || profile.value?.role
})

const roleClass = computed(() => {
  const classes = {
    super_admin: 'px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800',
    admin: 'px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800',
    viewer: 'px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800'
  }
  return classes[profile.value?.role] || classes.viewer
})

const statusClass = computed(() => {
  return profile.value?.is_active
    ? 'px-3 py-1 rounded-full text-sm font-semibold bg-success-100 text-success-800'
    : 'px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800'
})

const permissionLabel = (permission) => {
  const labels = {
    view: 'View Only',
    edit: 'View & Edit',
    manage: 'Full Control'
  }
  return labels[permission] || permission
}

const permissionClass = (permission) => {
  const classes = {
    view: 'px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800',
    edit: 'px-3 py-1 rounded-full text-xs font-semibold bg-warning-100 text-warning-800',
    manage: 'px-3 py-1 rounded-full text-xs font-semibold bg-success-100 text-success-800'
  }
  return classes[permission] || classes.view
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const fetchProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getProfile()
    profile.value = response.user
  } catch (e) {
    error.value = e.message || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>
