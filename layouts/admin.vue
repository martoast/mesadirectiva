<template>
  <div class="admin-layout">
    <!-- Desktop Sidebar -->
    <aside class="sidebar">
      <!-- Brand -->
      <div class="sidebar-brand">
        <NuxtLink to="/app/admin/events" class="brand-link">
          <span class="brand-icon">M</span>
          <div class="brand-text">
            <span class="brand-name">Evently</span>
            <span class="brand-label">Admin</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-label">Menu</span>
          <NuxtLink to="/app/admin/events" class="nav-item" active-class="active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Events</span>
          </NuxtLink>

          <NuxtLink v-if="isSuperAdmin" to="/app/admin/categories" class="nav-item" active-class="active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Categories</span>
          </NuxtLink>

          <NuxtLink v-if="isSuperAdmin" to="/app/admin/users" class="nav-item" active-class="active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Users</span>
          </NuxtLink>

          <NuxtLink to="/app/admin/orders" class="nav-item" active-class="active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Orders</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <span class="nav-label">Reports</span>
          <NuxtLink to="/app/admin/reports/sales" class="nav-item" active-class="active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sales</span>
          </NuxtLink>

          <NuxtLink to="/app/admin/reports/orders" class="nav-item" active-class="active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Analytics</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <NuxtLink to="/app/events" class="nav-item external">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>View Site</span>
        </NuxtLink>

        <div v-if="user" class="user-card">
          <NuxtLink to="/app/admin/account" class="user-info">
            <div class="user-avatar">{{ user.name?.charAt(0) || 'U' }}</div>
            <div class="user-details">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">{{ roleLabel }}</span>
            </div>
          </NuxtLink>
          <button @click="handleLogout" class="logout-btn" title="Sign out">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="mobile-header">
      <NuxtLink to="/app/admin/events" class="mobile-brand">
        <span class="brand-icon">M</span>
        <span>Evently</span>
      </NuxtLink>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-toggle">
        <svg v-if="!mobileMenuOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Mobile Menu -->
    <Transition name="slide">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <nav class="mobile-nav">
          <NuxtLink to="/app/admin/events" class="mobile-link" @click="mobileMenuOpen = false">Events</NuxtLink>
          <NuxtLink v-if="isSuperAdmin" to="/app/admin/categories" class="mobile-link" @click="mobileMenuOpen = false">Categories</NuxtLink>
          <NuxtLink v-if="isSuperAdmin" to="/app/admin/users" class="mobile-link" @click="mobileMenuOpen = false">Users</NuxtLink>
          <NuxtLink to="/app/admin/orders" class="mobile-link" @click="mobileMenuOpen = false">Orders</NuxtLink>
          <NuxtLink to="/app/admin/reports/sales" class="mobile-link" @click="mobileMenuOpen = false">Sales Report</NuxtLink>
          <div class="mobile-divider"></div>
          <NuxtLink to="/app/events" class="mobile-link" @click="mobileMenuOpen = false">View Public Site</NuxtLink>
          <NuxtLink to="/app/admin/account" class="mobile-link" @click="mobileMenuOpen = false">My Account</NuxtLink>
          <button @click="handleLogout" class="mobile-link danger">Sign Out</button>
        </nav>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-inner">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { user, logout, isSuperAdmin } = useAuth()
const router = useRouter()

const mobileMenuOpen = ref(false)

const roleLabel = computed(() => {
  const labels = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    viewer: 'Viewer'
  }
  return labels[user.value?.role] || user.value?.role
})

const handleLogout = async () => {
  mobileMenuOpen.value = false
  await logout()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

.admin-layout {
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --sidebar-width: 240px;
  --header-height: 56px;

  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-sidebar: #0a0a0a;
  --color-sidebar-hover: #171717;
  --color-sidebar-active: #262626;

  --color-text: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-muted: #a1a1aa;
  --color-text-inverse: #fafafa;

  --color-border: #e4e4e7;
  --color-border-light: #f4f4f5;

  --color-primary: #6366f1;
  --color-primary-light: #eef2ff;

  font-family: var(--font-sans);
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-sidebar);
  display: none;
  flex-direction: column;
  z-index: 50;
}

/* Brand */
.sidebar-brand {
  padding: 20px 16px;
  border-bottom: 1px solid #262626;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-primary), #818cf8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: white;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-inverse);
  letter-spacing: -0.01em;
}

.brand-label {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-label {
  display: block;
  padding: 0 8px;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #a1a1aa;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.15s ease;
  margin-bottom: 2px;
}

.nav-item:hover {
  color: var(--color-text-inverse);
  background: var(--color-sidebar-hover);
}

.nav-item.active {
  color: var(--color-text-inverse);
  background: var(--color-sidebar-active);
}

.nav-item.external {
  color: var(--color-text-muted);
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #262626;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--color-sidebar-hover);
  border-radius: 8px;
  margin-top: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  text-decoration: none;
  min-width: 0;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-inverse);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11px;
  color: var(--color-text-muted);
}

.logout-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.logout-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.logout-btn svg {
  width: 18px;
  height: 18px;
}

/* Mobile Header */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--color-sidebar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 50;
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-inverse);
  text-decoration: none;
}

.mobile-brand .brand-icon {
  width: 28px;
  height: 28px;
  font-size: 12px;
}

.mobile-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-inverse);
  cursor: pointer;
}

.mobile-toggle svg {
  width: 22px;
  height: 22px;
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-sidebar);
  z-index: 49;
  overflow-y: auto;
}

.mobile-nav {
  padding: 16px;
}

.mobile-link {
  display: block;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #a1a1aa;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.mobile-link:hover {
  color: var(--color-text-inverse);
  background: var(--color-sidebar-hover);
}

.mobile-link.danger {
  color: #f87171;
}

.mobile-divider {
  height: 1px;
  background: #262626;
  margin: 12px 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Main Content */
.main-content {
  flex: 1;
  padding-top: var(--header-height);
  min-height: 100vh;
}

.content-inner {
  padding: 24px 16px;
  max-width: 1280px;
  margin: 0 auto;
}

/* Desktop */
@media (min-width: 768px) {
  .sidebar {
    display: flex;
  }

  .mobile-header,
  .mobile-menu {
    display: none;
  }

  .main-content {
    margin-left: var(--sidebar-width);
    padding-top: 0;
  }

  .content-inner {
    padding: 32px 40px;
  }
}
</style>
