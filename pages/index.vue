<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-inner">
        <NuxtLink to="/" class="nav-brand">
          <div class="brand-mark">M</div>
          <span>Evently</span>
        </NuxtLink>
        <div class="nav-actions">
          <NuxtLink to="/login" class="nav-link">Sign In</NuxtLink>
          <NuxtLink to="/app/events" class="nav-btn">Browse Events</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>Event Management Platform</span>
        </div>
        <h1>The Complete Platform for<br>Event Ticketing</h1>
        <p>Create events, manage tickets, and accept payments—all in one place. Built for organizers who want control and simplicity.</p>
        <div class="hero-actions">
          <NuxtLink to="/app/events" class="btn-primary">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Browse Events
          </NuxtLink>
          <NuxtLink to="/app/admin/events" class="btn-secondary">
            Admin Dashboard
            <svg class="btn-icon-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="section-header">
        <span class="section-label">Features</span>
        <h2>Everything You Need</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-number">01</div>
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3>Create Events</h3>
          <p>Set up beautiful event pages with custom details, pricing tiers, and descriptions.</p>
          <ul class="feature-list">
            <li>Multi-step event creation</li>
            <li>Custom landing pages</li>
            <li>Draft & publish workflow</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-number">02</div>
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3>Manage Tickets</h3>
          <p>Track inventory, monitor sales, and see real-time statistics for each event.</p>
          <ul class="feature-list">
            <li>Real-time sales tracking</li>
            <li>Capacity management</li>
            <li>Revenue analytics</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-number">03</div>
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3>Secure Payments</h3>
          <p>Integrated Stripe processing with per-event products for easy tracking.</p>
          <ul class="feature-list">
            <li>Encrypted transactions</li>
            <li>Per-event products</li>
            <li>Automatic payouts</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Two Sides Section -->
    <section class="platforms">
      <div class="section-header">
        <span class="section-label">Platforms</span>
        <h2>Two Powerful Experiences</h2>
      </div>
      <div class="platforms-grid">
        <div class="platform-card attendees">
          <div class="platform-header">
            <div class="platform-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3>For Attendees</h3>
          </div>
          <p>Discover events, view details, check availability, and purchase tickets securely.</p>
          <ul class="platform-list">
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Browse all live events
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              View detailed event pages
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Real-time availability
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Secure checkout
            </li>
          </ul>
          <NuxtLink to="/app/events" class="platform-btn">
            Explore Events
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </NuxtLink>
        </div>
        <div class="platform-card organizers">
          <div class="platform-header">
            <div class="platform-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3>For Organizers</h3>
          </div>
          <p>Create, manage, and promote your events. Track sales and payments with ease.</p>
          <ul class="platform-list">
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Create unlimited events
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Design custom pages
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Real-time analytics
            </li>
            <li>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Integrated payments
            </li>
          </ul>
          <NuxtLink to="/app/admin/events" class="platform-btn">
            Go to Admin
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Tech Stack -->
    <section class="tech">
      <div class="section-header">
        <span class="section-label">Technology</span>
        <h2>Built With Modern Stack</h2>
      </div>
      <div class="tech-grid">
        <div class="tech-card">
          <div class="tech-icon vue"></div>
          <span class="tech-name">Vue 3</span>
          <span class="tech-desc">Reactive UI</span>
        </div>
        <div class="tech-card">
          <div class="tech-icon nuxt"></div>
          <span class="tech-name">Nuxt 4</span>
          <span class="tech-desc">Full-stack</span>
        </div>
        <div class="tech-card">
          <div class="tech-icon tailwind"></div>
          <span class="tech-name">Tailwind</span>
          <span class="tech-desc">Styling</span>
        </div>
        <div class="tech-card">
          <div class="tech-icon stripe"></div>
          <span class="tech-name">Stripe</span>
          <span class="tech-desc">Payments</span>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-inner">
        <span class="section-label light">Get Started</span>
        <h2>Start Using Evently Today</h2>
        <p>Whether you're attending events or organizing them, we make it simple and secure.</p>
        <div class="cta-actions">
          <NuxtLink to="/app/events" class="btn-cta-primary">Browse Events</NuxtLink>
          <NuxtLink to="/app/admin/events" class="btn-cta-outline">Create Events</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand-section">
            <div class="footer-brand">
              <div class="brand-mark">M</div>
              <span>Evently</span>
            </div>
            <p>The complete event management and ticketing platform.</p>
          </div>
          <div class="footer-links-section">
            <div class="footer-col">
              <h4>Platform</h4>
              <NuxtLink to="/app/events">Browse Events</NuxtLink>
              <NuxtLink to="/app/admin/events">Admin Panel</NuxtLink>
              <NuxtLink to="/app">Dashboard</NuxtLink>
            </div>
            <div class="footer-col">
              <h4>Account</h4>
              <NuxtLink to="/login">Sign In</NuxtLink>
              <NuxtLink to="/forgot-password">Reset Password</NuxtLink>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 Evently. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.landing-page {
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
  --color-success: #10b981;

  font-family: var(--font-sans);
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
}

/* Navigation */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-mark {
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.nav-brand span {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-btn {
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: var(--color-primary);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s ease;
}

.nav-btn:hover {
  background: var(--color-primary-light);
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
  max-width: 680px;
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
  background: var(--color-success);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero h1 {
  font-size: 40px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.hero p {
  font-size: 17px;
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
}

/* Section Headers */
.section-header {
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

.section-label.light {
  color: var(--color-primary-light);
}

.section-header h2 {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

/* Features Section */
.features {
  padding: 80px 24px;
  max-width: 1100px;
  margin: 0 auto;
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
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 10px;
}

.feature-card > p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-list li {
  font-size: 13px;
  color: var(--color-text-secondary);
  padding-left: 20px;
  position: relative;
}

.feature-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
}

/* Platforms Section */
.platforms {
  padding: 80px 24px;
  background: var(--color-bg);
  max-width: 1100px;
  margin: 0 auto;
}

.platforms-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.platform-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 36px 32px;
}

.platform-card.attendees {
  border-color: #d1fae5;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.platform-card.organizers {
  border-color: #c7d2fe;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.platform-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attendees .platform-icon {
  background: #10b981;
}

.organizers .platform-icon {
  background: var(--color-primary);
}

.platform-icon svg {
  width: 22px;
  height: 22px;
  color: #ffffff;
}

.platform-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.platform-card > p {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
}

.platform-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.platform-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--color-text);
}

.platform-list svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.attendees .platform-list svg {
  color: #10b981;
}

.organizers .platform-list svg {
  color: var(--color-primary);
}

.platform-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.attendees .platform-btn {
  background: #10b981;
}

.attendees .platform-btn:hover {
  background: #059669;
}

.organizers .platform-btn {
  background: var(--color-primary);
}

.organizers .platform-btn:hover {
  background: var(--color-primary-light);
}

.platform-btn svg {
  width: 16px;
  height: 16px;
}

/* Tech Section */
.tech {
  padding: 80px 24px;
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.tech-grid {
  max-width: 600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.tech-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.tech-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin: 0 auto 14px;
}

.tech-icon.vue { background: #42b883; }
.tech-icon.nuxt { background: #00dc82; }
.tech-icon.tailwind { background: #06b6d4; }
.tech-icon.stripe { background: #635bff; }

.tech-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.tech-desc {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* CTA Section */
.cta {
  background: var(--color-bg-dark);
  padding: 80px 24px;
  text-align: center;
}

.cta-inner {
  max-width: 560px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
}

.cta p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-cta-primary,
.btn-cta-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.btn-cta-primary {
  background: var(--color-primary);
  color: #ffffff;
}

.btn-cta-primary:hover {
  background: var(--color-primary-light);
}

.btn-cta-outline {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cta-outline:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Footer */
.footer {
  background: var(--color-bg-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 48px 24px 32px;
}

.footer-inner {
  max-width: 1000px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.footer-brand span {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.footer-brand-section p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

.footer-links-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.footer-col h4 {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-col a {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.15s ease;
}

.footer-col a:hover {
  color: rgba(255, 255, 255, 0.8);
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
}

.footer-bottom p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}

/* Tablet */
@media (min-width: 640px) {
  .hero {
    padding: 100px 40px 120px;
  }

  .hero h1 {
    font-size: 52px;
  }

  .hero-actions {
    flex-direction: row;
    justify-content: center;
  }

  .features {
    padding: 100px 40px;
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .platforms {
    padding: 100px 40px;
  }

  .platforms-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tech-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .cta {
    padding: 100px 40px;
  }

  .cta-actions {
    flex-direction: row;
    justify-content: center;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero {
    padding: 120px 40px 140px;
  }

  .hero h1 {
    font-size: 60px;
  }

  .hero p {
    font-size: 18px;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-header h2 {
    font-size: 36px;
  }

  .cta h2 {
    font-size: 32px;
  }
}
</style>
