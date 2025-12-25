<template>
  <div class="cancel-page">
    <div class="cancel-container">
      <div class="cancel-card">
        <!-- Cancel Icon -->
        <div class="cancel-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1>Payment Cancelled</h1>
        <p class="cancel-message">
          Your payment was not completed. No charges have been made to your account.
        </p>

        <div class="cancel-actions">
          <NuxtLink :to="`/app/events/${route.params.slug}/checkout`" class="btn-primary">
            Try Again
          </NuxtLink>
          <NuxtLink :to="`/app/events/${route.params.slug}`" class="btn-secondary">
            Back to Event
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public'
})

const route = useRoute()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

.cancel-page {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --color-text: #1a1a1a;
  --color-text-light: #666;
  --color-text-muted: #999;
  --color-bg: #fff;
  --color-bg-alt: #f8f8f8;
  --color-border: #eee;
  --color-warning: #d97706;
  --radius: 12px;

  font-family: var(--font-body);
  min-height: 100vh;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.cancel-container {
  width: 100%;
  max-width: 420px;
}

.cancel-card {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.cancel-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.cancel-icon svg {
  width: 40px;
  height: 40px;
  color: var(--color-warning);
}

h1 {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
}

.cancel-message {
  font-size: 15px;
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: 32px;
}

.cancel-actions {
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
  .cancel-card {
    padding: 48px 40px;
  }

  h1 {
    font-size: 32px;
  }
}
</style>
