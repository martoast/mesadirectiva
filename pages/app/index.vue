<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>Event Ticketing Platform</span>
        </div>
        <h1>Discover & Book<br>Unforgettable Events</h1>
        <p>Find tickets to the best experiences near you. From concerts to conferences, we've got you covered.</p>
        <div class="hero-actions">
          <NuxtLink to="/app/events" class="btn-primary">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Events
          </NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/app/admin/events" class="btn-secondary">
            Dashboard
            <svg class="btn-icon-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
          <NuxtLink v-else to="/login" class="btn-secondary">
            Sign In
            <svg class="btn-icon-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar">
      <div class="stats-inner">
        <div class="stat-item">
          <span class="stat-value">{{ totalEvents }}</span>
          <span class="stat-label">Events</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ liveEvents }}</span>
          <span class="stat-label">Live Now</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ totalTickets }}</span>
          <span class="stat-label">Tickets Sold</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-header">
        <span class="section-label">How It Works</span>
        <h2>Simple & Seamless Experience</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-number">01</div>
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3>Discover Events</h3>
          <p>Browse upcoming events by category, date, or location to find your next experience.</p>
        </div>
        <div class="feature-card">
          <div class="feature-number">02</div>
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3>Select Your Seats</h3>
          <p>Choose your preferred tickets or seats with our interactive selection system.</p>
        </div>
        <div class="feature-card">
          <div class="feature-number">03</div>
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3>Secure Checkout</h3>
          <p>Complete your purchase with encrypted payment processing and instant confirmation.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="brand-mark">M</div>
          <span>MesaDirectiva</span>
        </div>
        <div class="footer-links">
          <NuxtLink to="/app/events">Events</NuxtLink>
          <span class="link-dot"></span>
          <NuxtLink to="/login">Sign In</NuxtLink>
        </div>
        <p class="footer-copy">© 2025 MesaDirectiva. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({
  layout: 'default'
})

const { user, isAuthenticated } = useAuth()

// Mock stats - replace with actual API calls if needed
const totalEvents = computed(() => 12)
const liveEvents = computed(() => 8)
const totalTickets = computed(() => 245)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.home-page {
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --color-text: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-muted: #a3a3a3;
  --color-bg: #fafafa;
  --color-bg-card: #ffffff;
  --color-bg-dark: #0a0a0a;
  --color-border: #e5e5e5;
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;

  font-family: var(--font-sans);
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
}

/* Hero Section */
.hero {
  position: relative;
  padding: 80px 24px 100px;
  background: var(--color-bg-dark);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(99, 102, 241, 0.1), transparent);
}

.hero-content {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.02em;
  margin-bottom: 28px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero h1 {
  font-family: var(--font-sans);
  font-size: 36px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.hero p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--color-primary-light);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-icon-right {
  width: 14px;
  height: 14px;
  margin-left: 2px;
}

/* Stats Bar */
.stats-bar {
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  padding: 0 24px;
}

.stats-inner {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 24px 16px;
}

.stat-value {
  display: block;
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
}

/* Features Section */
.features {
  padding: 72px 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-label {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.features-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.feature-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 32px 28px;
  transition: border-color 0.15s ease;
}

.feature-card:hover {
  border-color: #d4d4d4;
}

.feature-number {
  position: absolute;
  top: 24px;
  right: 24px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.feature-card h3 {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Footer */
.footer {
  background: var(--color-bg-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 32px 24px;
  text-align: center;
}

.footer-inner {
  max-width: 1000px;
  margin: 0 auto;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.brand-mark {
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.footer-brand span {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.footer-links a {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-links a:hover {
  color: rgba(255, 255, 255, 0.8);
}

.link-dot {
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.footer-copy {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}

/* Tablet */
@media (min-width: 640px) {
  .hero {
    padding: 100px 40px 120px;
  }

  .hero h1 {
    font-size: 48px;
  }

  .hero p {
    font-size: 17px;
  }

  .hero-actions {
    flex-direction: row;
    justify-content: center;
  }

  .features {
    padding: 88px 40px;
  }

  .features-header h2 {
    font-size: 32px;
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-value {
    font-size: 32px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero {
    padding: 120px 40px 140px;
  }

  .hero h1 {
    font-size: 56px;
  }

  .hero p {
    font-size: 18px;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }

  .features {
    padding: 100px 40px;
  }

  .feature-card {
    padding: 36px 32px;
  }
}
</style>
