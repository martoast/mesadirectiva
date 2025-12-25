<template>
  <div class="success-page">
    <div class="success-container">
      <div class="success-card">
        <!-- Success Icon -->
        <div class="success-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1>Thank You!</h1>
        <p class="success-message">Your order has been confirmed.</p>

        <!-- Order Info -->
        <div v-if="orderNumber" class="order-info">
          <span class="order-label">Order Number</span>
          <span class="order-number">{{ orderNumber }}</span>
        </div>

        <p class="email-notice">
          A confirmation email has been sent to your email address with your ticket details.
        </p>

        <div class="success-actions">
          <NuxtLink :to="`/app/events/${route.params.slug}`" class="btn-primary">
            Back to Event
          </NuxtLink>
          <NuxtLink to="/app/events" class="btn-secondary">
            Browse More Events
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({
  layout: 'public'
})

const route = useRoute()

// Extract order number from session storage or query params
const orderNumber = computed(() => {
  if (import.meta.client) {
    const stored = sessionStorage.getItem('lastOrderNumber')
    if (stored) {
      sessionStorage.removeItem('lastOrderNumber')
      return stored
    }
  }
  return route.query.order || null
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

.success-page {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --color-text: #1a1a1a;
  --color-text-light: #666;
  --color-text-muted: #999;
  --color-bg: #fff;
  --color-bg-alt: #f8f8f8;
  --color-border: #eee;
  --color-primary: #2563eb;
  --color-success: #059669;
  --radius: 12px;

  font-family: var(--font-body);
  min-height: 100vh;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.success-container {
  width: 100%;
  max-width: 420px;
}

.success-card {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: scaleIn 0.4s ease-out;
}

.success-icon svg {
  width: 40px;
  height: 40px;
  color: var(--color-success);
  animation: checkDraw 0.5s ease-out 0.2s both;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes checkDraw {
  from {
    stroke-dashoffset: 24;
    opacity: 0;
  }
  to {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

h1 {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.success-message {
  font-size: 16px;
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.order-info {
  background: var(--color-bg-alt);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.order-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.order-number {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  font-family: monospace;
}

.email-notice {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 32px;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  display: block;
  width: 100%;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-text);
  color: #fff;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--color-text-muted);
}

/* Tablet+ */
@media (min-width: 640px) {
  .success-card {
    padding: 48px 40px;
  }

  h1 {
    font-size: 36px;
  }
}
</style>
