<template>
  <div class="users-page">
    <!-- Floating Action Button (Mobile) -->
    <NuxtLink to="/app/admin/users/create" class="fab-create" aria-label="Create new user">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </NuxtLink>

    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-title-row">
          <h1>{{ t.pageTitle }}</h1>
          <span class="user-count">{{ meta.total }}</span>
        </div>
        <p class="header-description">{{ t.pageSubtitle }}</p>
      </div>
      <NuxtLink to="/app/admin/users/create" class="btn-create">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        <span>{{ t.createUser }}</span>
      </NuxtLink>
    </header>

    <!-- Stats Overview -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ meta.total }}</span>
        <span class="stat-label">{{ t.totalUsers }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value stat-active">{{ activeCount }}</span>
        <span class="stat-label">{{ t.activeUsers }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ adminCount }}</span>
        <span class="stat-label">{{ t.admins }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-group-row">
        <div class="search-wrapper">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            :placeholder="t.searchPlaceholder"
            class="search-input"
            @input="debouncedSearch"
          />
        </div>

        <div class="filter-item">
          <label>{{ t.role }}</label>
          <div class="select-wrapper">
            <select v-model="filterRole">
              <option value="">{{ t.allRoles }}</option>
              <option value="super_admin">{{ t.superAdmin }}</option>
              <option value="admin">{{ t.admin }}</option>
              <option value="viewer">{{ t.viewer }}</option>
            </select>
            <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button v-if="search || filterRole" @click="clearFilters" class="clear-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ t.clear }}
        </button>
      </div>
      <span class="results-text">{{ meta.total }} {{ usersLabel }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-state">
        <div class="loader"></div>
        <span>{{ t.loadingUsers }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error">
      <div class="error-state">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3>{{ t.errorTitle }}</h3>
        <p>{{ error }}</p>
        <button @click="fetchUsers" class="btn-retry">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t.tryAgain }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="state-container">
      <div class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3>{{ t.noUsersFound }}</h3>
        <p>{{ t.tryAdjustingFilters }}</p>
      </div>
    </div>

    <!-- Users Content -->
    <div v-else class="users-content">
      <!-- Desktop Table View -->
      <div class="table-view">
        <table class="users-table">
          <thead>
            <tr>
              <th class="col-user">{{ t.user }}</th>
              <th class="col-role">{{ t.role }}</th>
              <th class="col-status">{{ t.status }}</th>
              <th class="col-groups">{{ t.groups }}</th>
              <th class="col-actions"></th>
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
                  {{ user.is_active ? t.active : t.inactive }}
                </span>
              </td>
              <td class="col-groups">
                <div v-if="user.groups?.length" class="group-list">
                  <span
                    v-for="group in user.groups.slice(0, 2)"
                    :key="group.id"
                    class="group-pill"
                    :style="{ '--group-color': group.color }"
                  >
                    {{ group.name }}
                  </span>
                  <span v-if="user.groups.length > 2" class="group-more">
                    +{{ user.groups.length - 2 }}
                  </span>
                </div>
                <span v-else class="no-groups">—</span>
              </td>
              <td class="col-actions">
                <div class="actions-dropdown" v-click-outside="() => closeDropdown(user.id)">
                  <button
                    class="dropdown-trigger"
                    @click="toggleDropdown(user.id)"
                    :aria-expanded="openDropdownId === user.id"
                    aria-label="Actions"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="openDropdownId === user.id" class="dropdown-menu">
                      <NuxtLink :to="`/app/admin/users/${user.id}`" class="dropdown-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {{ t.edit }}
                      </NuxtLink>
                      <button @click="handleToggleActive(user)" :class="['dropdown-item', user.is_active ? 'warning' : 'success']">
                        <svg v-if="user.is_active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ user.is_active ? t.deactivate : t.activate }}
                      </button>
                    </div>
                  </Transition>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards View -->
      <div class="cards-view">
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
            <div class="actions-dropdown" v-click-outside="() => closeDropdown(`mobile-${user.id}`)">
              <button
                class="dropdown-trigger"
                @click="toggleDropdown(`mobile-${user.id}`)"
                :aria-expanded="openDropdownId === `mobile-${user.id}`"
                aria-label="Actions"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <Transition name="dropdown">
                <div v-if="openDropdownId === `mobile-${user.id}`" class="dropdown-menu">
                  <NuxtLink :to="`/app/admin/users/${user.id}`" class="dropdown-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {{ t.edit }}
                  </NuxtLink>
                  <button @click="handleToggleActive(user)" :class="['dropdown-item', user.is_active ? 'warning' : 'success']">
                    <svg v-if="user.is_active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ user.is_active ? t.deactivate : t.activate }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <div class="card-meta">
            <span :class="['role-badge', user.role]">
              {{ roleLabel(user.role) }}
            </span>
            <span :class="['status-badge', user.is_active ? 'active' : 'inactive']">
              <span class="status-dot"></span>
              {{ user.is_active ? t.active : t.inactive }}
            </span>
          </div>

          <div v-if="user.groups?.length" class="card-groups">
            <span class="groups-label">{{ t.groups }}:</span>
            <div class="group-list">
              <span
                v-for="group in user.groups.slice(0, 3)"
                :key="group.id"
                class="group-pill"
                :style="{ '--group-color': group.color }"
              >
                {{ group.name }}
              </span>
              <span v-if="user.groups.length > 3" class="group-more">
                +{{ user.groups.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="pagination">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn page-nav"
          aria-label="Previous page"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="page !== '...' && (currentPage = page)"
            :class="['page-btn', { active: currentPage === page, ellipsis: page === '...' }]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage = Math.min(meta.last_page, currentPage + 1)"
          :disabled="currentPage === meta.last_page"
          class="page-btn page-nav"
          aria-label="Next page"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
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

const { t: createT, language } = useLanguage()

// Translations
const translations = {
  pageTitle: { es: 'Usuarios', en: 'Users' },
  pageSubtitle: { es: 'Gestionar usuarios del sistema y permisos', en: 'Manage system users and permissions' },
  createUser: { es: 'Crear Usuario', en: 'Create User' },
  searchPlaceholder: { es: 'Buscar por nombre o correo...', en: 'Search by name or email...' },
  role: { es: 'Rol', en: 'Role' },
  allRoles: { es: 'Todos', en: 'All' },
  superAdmin: { es: 'Super Admin', en: 'Super Admin' },
  admin: { es: 'Admin', en: 'Admin' },
  viewer: { es: 'Visor', en: 'Viewer' },
  clear: { es: 'Limpiar', en: 'Clear' },
  loadingUsers: { es: 'Cargando usuarios...', en: 'Loading users...' },
  noUsersFound: { es: 'No se encontraron usuarios', en: 'No users found' },
  tryAdjustingFilters: { es: 'Intenta ajustar tus filtros o crear un nuevo usuario', en: 'Try adjusting your filters or create a new user' },
  tryAgain: { es: 'Intentar de Nuevo', en: 'Try Again' },
  user: { es: 'Usuario', en: 'User' },
  status: { es: 'Estado', en: 'Status' },
  groups: { es: 'Grupos', en: 'Groups' },
  actions: { es: 'Acciones', en: 'Actions' },
  active: { es: 'Activo', en: 'Active' },
  inactive: { es: 'Inactivo', en: 'Inactive' },
  none: { es: 'Ninguno', en: 'None' },
  edit: { es: 'Editar', en: 'Edit' },
  deactivate: { es: 'Desactivar', en: 'Deactivate' },
  activate: { es: 'Activar', en: 'Activate' },
  previous: { es: 'Anterior', en: 'Previous' },
  next: { es: 'Siguiente', en: 'Next' },
  totalUsers: { es: 'Total', en: 'Total' },
  activeUsers: { es: 'Activos', en: 'Active' },
  admins: { es: 'Admins', en: 'Admins' },
  errorTitle: { es: 'Error al cargar', en: 'Failed to load' }
}

const t = createT(translations)

const usersLabel = computed(() => {
  if (language.value === 'es') {
    return meta.value.total === 1 ? 'usuario' : 'usuarios'
  }
  return meta.value.total === 1 ? 'user' : 'users'
})

const { getUsers, toggleActive } = useUsers()

const users = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const openDropdownId = ref(null)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

let searchTimeout = null

// Computed stats
const activeCount = computed(() => users.value.filter(u => u.is_active).length)
const adminCount = computed(() => users.value.filter(u => u.role === 'admin' || u.role === 'super_admin').length)

// Smart pagination
const visiblePages = computed(() => {
  const total = meta.value.last_page
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

const toggleDropdown = (id) => {
  openDropdownId.value = openDropdownId.value === id ? null : id
}

const closeDropdown = (id) => {
  if (openDropdownId.value === id) {
    openDropdownId.value = null
  }
}

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
  openDropdownId.value = null
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
  const colors = ['#264653', '#2a9d8f', '#2d5a27', '#457b9d', '#6366f1', '#8b5cf6', '#ec4899', '#c73e1d', '#f97316', '#1a1a1a']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const roleLabel = (role) => {
  const labels = {
    super_admin: t.superAdmin,
    admin: t.admin,
    viewer: t.viewer
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
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

/* Global box-sizing */
.users-page,
.users-page *,
.users-page *::before,
.users-page *::after {
  box-sizing: border-box;
}

.users-page {
  /* Japanese-inspired palette */
  --color-paper: #faf9f7;
  --color-ink: #1a1a1a;
  --color-ink-light: #4a4a4a;
  --color-ink-lighter: #7a7a7a;
  --color-ink-muted: #a8a8a8;
  --color-stone: #e8e6e3;
  --color-stone-dark: #d4d2cf;
  --color-bamboo: #2d5a27;
  --color-vermillion: #c73e1d;
  --color-indigo: #264653;

  /* Semantic colors */
  --color-surface: #ffffff;
  --color-border: #e8e6e3;
  --color-border-subtle: #f2f1ef;
  --color-hover: rgba(26, 26, 26, 0.03);
  --color-success: #2d5a27;
  --color-success-subtle: rgba(45, 90, 39, 0.08);
  --color-warning: #b45309;
  --color-warning-subtle: rgba(180, 83, 9, 0.08);
  --color-danger: #c73e1d;
  --color-danger-subtle: rgba(199, 62, 29, 0.08);

  /* Typography */
  --font-display: 'Zen Maru Gothic', 'Noto Sans JP', system-ui, sans-serif;
  --font-body: 'Noto Sans JP', system-ui, sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(26, 26, 26, 0.04);
  --shadow-md: 0 2px 8px rgba(26, 26, 26, 0.06);
  --shadow-lg: 0 4px 16px rgba(26, 26, 26, 0.08);

  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  width: 100%;
  max-width: 100%;
  padding-bottom: 80px;
}

/* ========================================
   Floating Action Button (Mobile)
   ======================================== */
.fab-create {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: var(--color-ink);
  color: white;
  border-radius: 16px;
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(26, 26, 26, 0.1);
  z-index: 100;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-create svg {
  width: 24px;
  height: 24px;
}

.fab-create:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg), 0 8px 24px rgba(26, 26, 26, 0.15);
}

.fab-create:active {
  transform: scale(0.98);
}

@media (min-width: 640px) {
  .fab-create {
    display: none;
  }
}

/* ========================================
   Header
   ======================================== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.header-title-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
}

.header-title-row h1 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.user-count {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink-muted);
  padding: 2px 10px;
  background: var(--color-border-subtle);
  border-radius: 20px;
}

.header-description {
  font-size: 14px;
  color: var(--color-ink-lighter);
  line-height: 1.5;
}

.btn-create {
  display: none;
  align-items: center;
  gap: var(--space-sm);
  padding: 12px 20px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--color-ink);
  border: none;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm);
}

.btn-create svg {
  width: 18px;
  height: 18px;
}

.btn-create:hover {
  background: var(--color-ink-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .btn-create {
    display: inline-flex;
  }
}

@media (min-width: 768px) {
  .header-title-row h1 {
    font-size: 32px;
  }
}

/* ========================================
   Stats Row
   ======================================== */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  margin-bottom: var(--space-lg);
  width: 100%;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 50px;
  flex: 1;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-value.stat-active {
  color: var(--color-success);
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-ink-muted);
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: var(--color-border);
  flex-shrink: 0;
}

@media (min-width: 480px) {
  .stats-row {
    gap: var(--space-lg);
    padding: var(--space-lg);
    flex-wrap: nowrap;
  }

  .stat-item {
    flex: none;
    min-width: 60px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-divider {
    height: 32px;
  }
}

@media (min-width: 640px) {
  .stats-row {
    gap: var(--space-xl);
    padding: var(--space-lg) var(--space-xl);
  }

  .stat-value {
    font-size: 28px;
  }
}

/* ========================================
   Filters Bar
   ======================================== */
.filters-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  width: 100%;
}

.filter-group-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: flex-end;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-ink-muted);
}

.search-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  outline: none;
  transition: all 0.15s ease;
}

.search-input:focus {
  border-color: var(--color-ink-light);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.search-input::placeholder {
  color: var(--color-ink-muted);
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-item label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  padding: 12px 36px 12px 14px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  appearance: none;
  min-width: 120px;
  transition: all 0.15s ease;
}

.select-wrapper select:hover {
  border-color: var(--color-stone-dark);
}

.select-wrapper select:focus {
  outline: none;
  border-color: var(--color-ink-light);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--color-ink-muted);
  pointer-events: none;
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-lighter);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.clear-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background: var(--color-danger-subtle);
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

.results-text {
  font-size: 13px;
  color: var(--color-ink-lighter);
}

@media (min-width: 640px) {
  .filters-bar {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .search-wrapper {
    min-width: 100%;
  }
}

/* ========================================
   State Containers
   ======================================== */
.state-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 60px var(--space-md);
  width: 100%;
}

.state-container.error {
  border-color: rgba(199, 62, 29, 0.2);
  background: rgba(199, 62, 29, 0.02);
}

@media (min-width: 480px) {
  .state-container {
    padding: 80px var(--space-xl);
  }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.loader {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-ink);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state span {
  font-size: 14px;
  color: var(--color-ink-lighter);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  background: var(--color-danger-subtle);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.error-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-danger);
}

.error-state h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-ink);
  margin-bottom: var(--space-xs);
}

.error-state p {
  font-size: 14px;
  color: var(--color-ink-lighter);
  margin-bottom: var(--space-lg);
  max-width: 280px;
}

.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 16px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-retry svg {
  width: 14px;
  height: 14px;
}

.btn-retry:hover {
  background: var(--color-hover);
  border-color: var(--color-stone-dark);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: var(--color-border-subtle);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
}

.empty-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-ink-muted);
}

.empty-state h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  font-size: 14px;
  color: var(--color-ink-lighter);
  max-width: 280px;
  line-height: 1.5;
}

/* ========================================
   Users Content
   ======================================== */
.users-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
}

/* Table View (Desktop) */
.table-view {
  display: none;
  overflow-x: auto;
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
  font-size: 11px;
  font-weight: 600;
  color: var(--color-ink-muted);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.users-table tbody tr {
  border-bottom: 1px solid var(--color-border-subtle);
  transition: background 0.1s ease;
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
  color: var(--color-ink-light);
  vertical-align: middle;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--avatar-color, var(--color-indigo));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  color: var(--color-ink);
}

.user-email {
  font-size: 12px;
  color: var(--color-ink-muted);
}

/* Role Badge */
.role-badge {
  display: inline-flex;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
}

.role-badge.super_admin {
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
}

.role-badge.admin {
  color: var(--color-indigo);
  background: rgba(38, 70, 83, 0.1);
}

.role-badge.viewer {
  color: var(--color-ink-muted);
  background: var(--color-border-subtle);
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.active {
  color: var(--color-success);
  background: var(--color-success-subtle);
}

.status-badge.active .status-dot {
  background: var(--color-success);
}

.status-badge.inactive {
  color: var(--color-ink-muted);
  background: var(--color-border-subtle);
}

.status-badge.inactive .status-dot {
  background: var(--color-ink-muted);
}

/* Groups */
.group-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.group-pill {
  display: inline-flex;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 600;
  color: var(--group-color, var(--color-indigo));
  background: color-mix(in srgb, var(--group-color, var(--color-indigo)) 12%, transparent);
  border-radius: 4px;
}

.group-more {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-ink-muted);
}

.no-groups {
  color: var(--color-ink-muted);
}

/* Actions Dropdown */
.actions-dropdown {
  position: relative;
}

.dropdown-trigger {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-ink-lighter);
  transition: all 0.15s ease;
}

.dropdown-trigger:hover {
  background: var(--color-hover);
  color: var(--color-ink);
}

.dropdown-trigger svg {
  width: 18px;
  height: 18px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 150px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: var(--shadow-lg);
  z-index: 50;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 14px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-light);
  background: none;
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: var(--color-hover);
  color: var(--color-ink);
}

.dropdown-item.warning {
  color: var(--color-warning);
}

.dropdown-item.warning:hover {
  background: var(--color-warning-subtle);
}

.dropdown-item.success {
  color: var(--color-success);
}

.dropdown-item.success:hover {
  background: var(--color-success-subtle);
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Cards View (Mobile) */
.cards-view {
  display: flex;
  flex-direction: column;
}

.user-card {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border-subtle);
}

.user-card:last-child {
  border-bottom: none;
}

.user-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.card-meta {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.card-groups {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.groups-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-ink-muted);
}

@media (min-width: 768px) {
  .table-view {
    display: block;
  }

  .cards-view {
    display: none;
  }
}

/* Column widths */
.col-user { min-width: 220px; }
.col-role { min-width: 100px; }
.col-status { min-width: 100px; }
.col-groups { min-width: 160px; }
.col-actions { width: 60px; }

/* ========================================
   Pagination
   ======================================== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border-subtle);
  background: var(--color-surface);
}

.page-numbers {
  display: flex;
  gap: var(--space-xs);
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-lighter);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(.active):not(.ellipsis):not(:disabled) {
  background: var(--color-hover);
  border-color: var(--color-border);
}

.page-btn.active {
  background: var(--color-ink);
  color: white;
  font-weight: 600;
}

.page-btn.ellipsis {
  cursor: default;
  color: var(--color-ink-muted);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.page-nav {
  border: 1px solid var(--color-border);
}

.page-btn.page-nav svg {
  width: 14px;
  height: 14px;
}

.page-btn.page-nav:hover:not(:disabled) {
  border-color: var(--color-stone-dark);
  color: var(--color-ink);
}
</style>
