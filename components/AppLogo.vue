<template>
  <component :is="to ? NuxtLink : 'div'" :to="to" class="app-logo" :class="[variant, size]">
    <div class="logo-mark">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div v-if="showText" class="logo-text">
      <span class="logo-name">APFIM A.C.</span>
      <span v-if="label" class="logo-label">{{ label }}</span>
    </div>
  </component>
</template>

<script setup>
import { NuxtLink } from '#components'

defineProps({
  to: {
    type: String,
    default: null
  },
  showText: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'dark', // 'dark' (for light backgrounds) or 'light' (for dark backgrounds)
    validator: (value) => ['dark', 'light'].includes(value)
  },
  size: {
    type: String,
    default: 'default', // 'small', 'default', 'large'
    validator: (value) => ['small', 'default', 'large'].includes(value)
  }
})
</script>

<style scoped>
.app-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

/* Logo Mark */
.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-mark svg {
  width: 100%;
  height: 100%;
}

/* Logo Text */
.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.logo-label {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
}

/* Size Variants */
.app-logo.small {
  gap: 8px;
}

.app-logo.small .logo-mark {
  width: 28px;
  height: 28px;
}

.app-logo.small .logo-name {
  font-size: 14px;
}

.app-logo.small .logo-label {
  font-size: 9px;
}

.app-logo.default .logo-mark {
  width: 36px;
  height: 36px;
}

.app-logo.default .logo-name {
  font-size: 18px;
}

.app-logo.large {
  gap: 14px;
}

.app-logo.large .logo-mark {
  width: 44px;
  height: 44px;
}

.app-logo.large .logo-name {
  font-size: 22px;
}

.app-logo.large .logo-label {
  font-size: 11px;
}

/* Color Variants */
.app-logo.dark .logo-mark {
  color: #6366f1;
}

.app-logo.dark .logo-name {
  color: #0f0f0f;
}

.app-logo.dark .logo-label {
  color: #71717a;
}

.app-logo.light .logo-mark {
  color: #818cf8;
}

.app-logo.light .logo-name {
  color: #ffffff;
}

.app-logo.light .logo-label {
  color: #a1a1aa;
}

/* Hover effect when used as link */
a.app-logo:hover .logo-mark {
  transform: scale(1.05);
}

a.app-logo .logo-mark {
  transition: transform 0.2s ease;
}
</style>
