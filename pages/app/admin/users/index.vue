<template>
  <div class="users-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Manage system users and permissions</p>
      </div>
      <NuxtLink to="/app/admin/users/create" class="create-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        Create User
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-wrapper">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or email..."
          class="search-input"
          @input="debouncedSearch"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">Role</label>
        <select v-model="filterRole" class="filter-select">
          <option value="">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <button v-if="search || filterRole" @click="clearFilters" class="clear-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-spinner"></div>
      <p class="state-text">Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error">
      <svg class="state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="state-text">{{ error }}</p>
      <button @click="fetchUsers" class="retry-btn">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="state-container">
      <svg class="state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p class="state-text">No users found</p>
      <p class="state-hint">Try adjusting your filters or create a new user</p>
    </div>

    <!-- Users Table -->
    <div v-else class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th class="col-user">User</th>
            <th class="col-role">Role</th>
            <th class="col-status">Status</th>
            <th class="col-categories">Categories</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="col-user">
              <div class="user-info">
                <div class="avatar" :style="{ '--avatar-color': getAvatarColor(user.name) }">
                  {{ getInitials(user.name) }}
                </div>
                <div class="user-details">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </td>
            <td class="col-role">
              <span :class="['role-badge', user.role]">
                {{ roleLabel(user.role) }}
              </span>
            </td>
            <td class="col-status">
              <span :class="['status-badge', user.is_active ? 'active' : 'inactive']">
                <span class="status-dot"></span>
                {{ user.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="col-categories">
              <div v-if="user.categories?.length" class="category-list">
                <span
                  v-for="cat in user.categories.slice(0, 2)"
                  :key="cat.id"
                  class="category-pill"
                  :style="{ '--cat-color': cat.color }"
                >
                  {{ cat.name }}
                </span>
                <span v-if="user.categories.length > 2" class="category-more">
                  +{{ user.categories.length - 2 }}
                </span>
              </div>
              <span v-else class="no-categories">—</span>
            </td>
            <td class="col-actions">
              <div class="actions-row">
                <NuxtLink :to="`/app/admin/users/${user.id}`" class="action-btn edit" title="Edit">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </NuxtLink>
                <button
                  @click="handleToggleActive(user)"
                  :class="['action-btn', user.is_active ? 'deactivate' : 'activate']"
                  :title="user.is_active ? 'Deactivate' : 'Activate'"
                >
                  <svg v-if="user.is_active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="pagination">
        <button
          @click="currentPage = currentPage - 1"
          :disabled="currentPage === 1"
          class="page-btn nav"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage = currentPage + 1"
          :disabled="currentPage === meta.last_page"
          class="page-btn nav"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div v-if="!loading && !error && users.length > 0" class="mobile-cards">
      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="card-header">
          <div class="user-info">
            <div class="avatar" :style="{ '--avatar-color': getAvatarColor(user.name) }">
              {{ getInitials(user.name) }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
          </div>
          <span :class="['status-badge', user.is_active ? 'active' : 'inactive']">
            <span class="status-dot"></span>
            {{ user.is_active ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <div class="card-details">
          <div class="detail-item">
            <span class="detail-label">Role</span>
            <span :class="['role-badge', user.role]">
              {{ roleLabel(user.role) }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Categories</span>
            <div v-if="user.categories?.length" class="category-list">
              <span
                v-for="cat in user.categories.slice(0, 2)"
                :key="cat.id"
                class="category-pill small"
                :style="{ '--cat-color': cat.color }"
              >
                {{ cat.name }}
              </span>
              <span v-if="user.categories.length > 2" class="category-more">
                +{{ user.categories.length - 2 }}
              </span>
            </div>
            <span v-else class="no-categories">None</span>
          </div>
        </div>

        <div class="card-actions">
          <NuxtLink :to="`/app/admin/users/${user.id}`" class="card-btn primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </NuxtLink>
          <button
            @click="handleToggleActive(user)"
            :class="['card-btn', user.is_active ? 'warning' : 'success']"
          >
            <svg v-if="user.is_active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ user.is_active ? 'Deactivate' : 'Activate' }}
          </button>
        </div>
      </div>

      <!-- Mobile Pagination -->
      <div v-if="meta.last_page > 1" class="pagination mobile">
        <button
          @click="currentPage = currentPage - 1"
          :disabled="currentPage === 1"
          class="page-btn nav"
        >
          Previous
        </button>
        <span class="page-info">{{ currentPage }} / {{ meta.last_page }}</span>
        <button
          @click="currentPage = currentPage + 1"
          :disabled="currentPage === meta.last_page"
          class="page-btn nav"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

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

const visiblePages = computed(() => {
  const pages = []
  const total = meta.value.last_page
  const current = currentPage.value

  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)

  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const clearFilters = () => {
  search.value = ''
  filterRole.value = ''
  currentPage.value = 1
  fetchUsers()
}

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

const getAvatarColor = (name) => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const roleLabel = (role) => {
  const labels = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    viewer: 'Viewer'
  }
  return labels[role] || role
}

watch([filterRole, currentPage], () => {
  fetchUsers()
})

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

.users-page {
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --color-text: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-muted: #a1a1aa;
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-border: #e4e4e7;
  --color-border-light: #f4f4f5;
  --color-hover: #f4f4f5;

  --color-primary: #6366f1;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  font-family: var(--font-sans);
  padding: 24px;
  max-width: 1200px;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 4px 0 0 0;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--color-text);
  border: none;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
}

.create-btn:hover {
  background: #262626;
}

.create-btn svg {
  width: 16px;
  height: 16px;
}

/* Filters */
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  margin-bottom: 20px;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  padding: 10px 12px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  outline: none;
  min-width: 140px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.filter-select:focus {
  border-color: var(--color-primary);
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.clear-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background: #fef2f2;
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

/* States */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.state-container.error {
  border-color: #fecaca;
  background: #fef2f2;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.state-container.error .state-icon {
  color: var(--color-danger);
}

.state-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0;
}

.state-hint {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 4px 0 0 0;
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--color-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.retry-btn:hover {
  background: #262626;
}

/* Table */
.table-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead tr {
  border-bottom: 1px solid var(--color-border);
}

.users-table th {
  padding: 14px 16px;
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.users-table tbody tr {
  border-bottom: 1px solid var(--color-border-light);
  transition: background 0.1s;
}

.users-table tbody tr:last-child {
  border-bottom: none;
}

.users-table tbody tr:hover {
  background: var(--color-hover);
}

.users-table td {
  padding: 14px 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
  vertical-align: middle;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--avatar-color, var(--color-primary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: var(--color-text);
}

.user-email {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Role Badge */
.role-badge {
  display: inline-flex;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 50px;
}

.role-badge.super_admin {
  color: #7c3aed;
  background: #ede9fe;
}

.role-badge.admin {
  color: #2563eb;
  background: #dbeafe;
}

.role-badge.viewer {
  color: var(--color-text-muted);
  background: var(--color-border-light);
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 50px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.active {
  color: var(--color-success);
  background: #d1fae5;
}

.status-badge.active .status-dot {
  background: var(--color-success);
}

.status-badge.inactive {
  color: var(--color-text-muted);
  background: var(--color-border-light);
}

.status-badge.inactive .status-dot {
  background: var(--color-text-muted);
}

/* Categories */
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.category-pill {
  display: inline-flex;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 500;
  color: var(--cat-color, var(--color-primary));
  background: color-mix(in srgb, var(--cat-color, var(--color-primary)) 12%, transparent);
  border-radius: 50px;
}

.category-pill.small {
  padding: 2px 6px;
  font-size: 9px;
}

.category-more {
  font-size: 10px;
  color: var(--color-text-muted);
}

.no-categories {
  color: var(--color-text-muted);
}

/* Actions */
.actions-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.edit:hover {
  color: var(--color-primary);
  background: #eef2ff;
}

.action-btn.deactivate:hover {
  color: var(--color-warning);
  background: #fef3c7;
}

.action-btn.activate:hover {
  color: var(--color-success);
  background: #d1fae5;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  border-top: 1px solid var(--color-border-light);
}

.page-btn {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-border-light);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
  background: var(--color-border);
}

.page-btn.active {
  color: white;
  background: var(--color-text);
}

.page-btn.nav {
  background: transparent;
}

.page-btn.nav svg {
  width: 16px;
  height: 16px;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Mobile Cards */
.mobile-cards {
  display: none;
}

.user-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
}

.user-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
}

.card-btn svg {
  width: 14px;
  height: 14px;
}

.card-btn.primary {
  color: white;
  background: var(--color-text);
}

.card-btn.primary:hover {
  background: #262626;
}

.card-btn.success {
  color: var(--color-success);
  background: #d1fae5;
}

.card-btn.success:hover {
  background: #a7f3d0;
}

.card-btn.warning {
  color: var(--color-warning);
  background: #fef3c7;
}

.card-btn.warning:hover {
  background: #fde68a;
}

.pagination.mobile {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px;
}

.page-info {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* Column widths */
.col-user { min-width: 200px; }
.col-role { min-width: 100px; }
.col-status { min-width: 100px; }
.col-categories { min-width: 160px; }
.col-actions { min-width: 80px; }

/* Responsive */
@media (max-width: 1024px) {
  .table-container {
    display: none;
  }

  .mobile-cards {
    display: block;
  }
}

@media (max-width: 768px) {
  .users-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .create-btn {
    justify-content: center;
  }

  .filters-bar {
    padding: 12px;
  }

  .search-wrapper {
    min-width: 100%;
  }
}
</style>
