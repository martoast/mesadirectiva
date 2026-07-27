<template>
  <div class="public-layout">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-inner">
        <NuxtLink to="/app/events" class="nav-brand">
          <span class="brand-icon">✦</span>
          <span class="brand-text">APFIM A.C.</span>
        </NuxtLink>

        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg v-if="!mobileMenuOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Desktop nav -->
        <div class="nav-links">
          <NuxtLink to="/app/events" class="nav-link">{{ t.events }}</NuxtLink>
          <template v-if="isAuthenticated">
            <NuxtLink :to="dashboardPath" class="nav-link">{{ t.dashboard }}</NuxtLink>
            <div class="nav-user">
              <span class="user-name">{{ user?.name }}</span>
              <button @click="handleLogout" class="nav-link logout">{{ t.signOut }}</button>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="nav-cta">{{ t.signIn }}</NuxtLink>
          </template>
          <div class="nav-lang">
            <LanguageToggle />
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="mobile-menu">
          <div class="mobile-lang">
            <LanguageToggle :show-labels="true" />
          </div>
          <NuxtLink to="/app/events" class="mobile-link" @click="mobileMenuOpen = false">{{ t.events }}</NuxtLink>
          <template v-if="isAuthenticated">
            <NuxtLink :to="dashboardPath" class="mobile-link" @click="mobileMenuOpen = false">{{ t.dashboard }}</NuxtLink>
            <button @click="handleLogout" class="mobile-link logout">{{ t.signOut }}</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="mobile-link cta" @click="mobileMenuOpen = false">{{ t.signIn }}</NuxtLink>
          </template>
        </div>
      </Transition>
    </nav>

    <!-- Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="brand-logo">
              <span class="brand-icon">✦</span>
              <span>APFIM A.C.</span>
            </div>
            <p class="brand-tagline">Asociación de Padres de Familia del Instituto México A.C.</p>
          </div>
          <div class="footer-links">
            <h4>{{ t.explore }}</h4>
            <NuxtLink to="/app/events">{{ t.allEvents }}</NuxtLink>
            <template v-if="isAuthenticated">
              <NuxtLink :to="dashboardPath">{{ t.dashboard }}</NuxtLink>
            </template>
            <NuxtLink v-else to="/login">{{ t.organizerAccess }}</NuxtLink>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} APFIM A.C. {{ t.allRights }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { user, isAuthenticated, logout, isViewer } = useAuth()
const { t: createT } = useLanguage()
const router = useRouter()
const mobileMenuOpen = ref(false)

const translations = {
  events: { es: 'Eventos', en: 'Events' },
  dashboard: { es: 'Panel', en: 'Dashboard' },
  signIn: { es: 'Iniciar Sesión', en: 'Sign In' },
  signOut: { es: 'Cerrar Sesión', en: 'Sign Out' },
  explore: { es: 'Explorar', en: 'Explore' },
  allEvents: { es: 'Todos los eventos', en: 'All Events' },
  organizerAccess: { es: 'Acceso organizadores', en: 'Organizer access' },
  allRights: { es: 'Todos los derechos reservados.', en: 'All rights reserved.' }
}

const t = createT(translations)

const dashboardPath = computed(() =>
  isViewer.value ? '/app/admin/reports/sales' : '/app/admin/events'
)

const handleLogout = async () => {
  mobileMenuOpen.value = false
  await logout()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

.public-layout {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --color-text: #1a1a1a;
  --color-text-light: #666;
  --color-text-muted: #999;
  --color-bg: #fff;
  --color-bg-dark: #0a0a0a;
  --color-border: #eee;
  --color-primary: #2563eb;

  font-family: var(--font-body);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navigation */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.brand-icon {
  font-size: 20px;
  color: var(--color-primary);
}

.brand-text {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.brand-accent {
  color: var(--color-primary);
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
}

.nav-links {
  display: none;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-light);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link.logout {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 14px;
  color: var(--color-text-muted);
}

.nav-cta {
  padding: 10px 20px;
  background: var(--color-text);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s;
}

.nav-cta:hover {
  background: #333;
}

/* Mobile Menu */
.mobile-menu {
  padding: 16px 20px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-link {
  display: block;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s;
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  cursor: pointer;
}

.mobile-link:hover {
  background: var(--color-border);
}

.mobile-link.logout {
  color: var(--color-text-light);
}

.mobile-link.cta {
  background: var(--color-text);
  color: #fff;
  text-align: center;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Main Content */
.main-content {
  flex: 1;
}

/* Footer */
.footer {
  background: var(--color-bg-dark);
  color: #fff;
  margin-top: auto;
}

.nav-lang :deep(.language-toggle) {
  background: #f4f4f5;
}

.mobile-lang {
  display: flex;
  justify-content: center;
  padding: 4px 0 12px;
}

.mobile-lang :deep(.language-toggle) {
  background: #f4f4f5;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 32px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.footer-brand .brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.footer-brand .brand-logo .brand-icon {
  color: var(--color-primary);
}

.brand-tagline {
  font-size: 14px;
  color: #888;
  line-height: 1.5;
}

.footer-links h4 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
  margin-bottom: 16px;
}

.footer-links a {
  display: block;
  font-size: 14px;
  color: #ccc;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #fff;
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid #222;
  text-align: center;
}

.footer-bottom p {
  font-size: 13px;
  color: #666;
}

/* Tablet+ */
@media (min-width: 640px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .mobile-menu-btn {
    display: none;
  }

  .nav-links {
    display: flex;
  }

  .nav-inner {
    padding: 20px 40px;
  }

  .footer-inner {
    padding: 64px 40px 40px;
  }
}
</style>
