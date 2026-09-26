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

        <h1>{{ t.title }}</h1>
        <p class="success-message">{{ t.subtitle }}</p>

        <!-- Order Info -->
        <div v-if="orderNumber" class="order-info">
          <span class="order-label">{{ t.orderNumber }}</span>
          <span class="order-number">{{ orderNumber }}</span>
          <span class="order-keep">{{ t.keepThisNumber }}</span>
        </div>

        <!-- What happens next -->
        <div class="next-steps">
          <div class="next-step">
            <span class="step-icon">📩</span>
            <p>{{ t.step1 }}</p>
          </div>
          <div class="next-step">
            <span class="step-icon">{{ isProduct ? '🛍️' : '🎟️' }}</span>
            <p>{{ t.step2 }}</p>
          </div>
          <div v-if="!isProduct" class="next-step">
            <span class="step-icon">📱</span>
            <p>{{ t.step3 }}</p>
          </div>
        </div>

        <p class="spam-notice">{{ t.spamNotice }}</p>

        <div class="success-actions">
          <NuxtLink :to="`/app/events/${route.params.slug}`" class="btn-primary">
            {{ t.backToEvent }}
          </NuxtLink>
          <NuxtLink to="/app/events" class="btn-secondary">
            {{ t.browseMore }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { withProductLabels } from '~/utils/productLabels'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { t: createT } = useLanguage()

const translations = {
  title: { es: '¡Listo, tu compra está confirmada!', en: 'All set — your purchase is confirmed!' },
  subtitle: { es: 'Gracias por tu compra. Esto es lo que sigue:', en: 'Thank you for your purchase. Here\'s what happens next:' },
  orderNumber: { es: 'Número de orden', en: 'Order number' },
  keepThisNumber: { es: 'Guárdalo por si necesitas ayuda con tu compra', en: 'Keep it handy in case you need help with your purchase' },
  step1: { es: 'Te enviamos un correo de confirmación con tus boletos en PDF adjuntos.', en: 'We sent you a confirmation email with your PDF tickets attached.' },
  step2: { es: 'Cada boleto trae un código QR único para entrar al evento.', en: 'Each ticket has a unique QR code for entry to the event.' },
  step3: { es: 'El día del evento, presenta tu boleto impreso o desde tu teléfono.', en: 'On event day, show your ticket printed or on your phone.' },
  spamNotice: { es: '¿No ves el correo? Revisa tu carpeta de spam o correo no deseado.', en: 'Don\'t see the email? Check your spam or junk folder.' },
  backToEvent: { es: 'Volver al evento', en: 'Back to Event' },
  browseMore: { es: 'Ver más eventos', en: 'Browse More Events' }
}

const productTranslations = {
  step1: { es: 'Te enviamos un correo con el comprobante de tu compra.', en: 'We sent you an email with your purchase receipt.' },
  step2: { es: 'El comprobante indica dónde y cuándo recoger tu pedido.', en: 'The receipt tells you where and when to pick up your order.' },
  backToEvent: { es: 'Volver al producto', en: 'Back to product' },
  browseMore: { es: 'Ver más', en: 'Browse more' }
}

// The API appends &kind=product to the success URL for store purchases
const isProduct = computed(() => route.query.kind === 'product')

const t = withProductLabels(createT(translations), createT(productTranslations), isProduct)

// The API appends ?order={order_number} to the Stripe success URL
const orderNumber = computed(() => route.query.order || null)
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
  max-width: 460px;
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
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.success-message {
  font-size: 15px;
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.order-info {
  background: var(--color-bg-alt);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
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
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  font-family: monospace;
  letter-spacing: 0.5px;
}

.order-keep {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 6px;
}

.next-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  margin-bottom: 20px;
}

.next-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--color-bg-alt);
  border-radius: 8px;
  padding: 12px 14px;
}

.step-icon {
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1.4;
}

.next-step p {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.5;
  margin: 0;
}

.spam-notice {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 28px;
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
    font-size: 32px;
  }
}
</style>
