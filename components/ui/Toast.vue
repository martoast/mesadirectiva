<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`, { 'toast-leaving': !toast.visible }]"
        >
          <div class="toast-icon">
            <!-- Success -->
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <!-- Error -->
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
            <!-- Warning -->
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <path d="M12 9v4M12 17h.01"/>
            </svg>
            <!-- Info -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-dismiss" @click="dismiss(toast.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #1C1917;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.toast-icon svg {
  width: 100%;
  height: 100%;
}

.toast-success .toast-icon {
  color: #6B9080;
}

.toast-error .toast-icon {
  color: #DC6B6B;
}

.toast-warning .toast-icon {
  color: #B08968;
}

.toast-info .toast-icon {
  color: #6366F1;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #FAF8F5;
  line-height: 1.4;
}

.toast-dismiss {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: none;
  color: #78716C;
  cursor: pointer;
  transition: color 0.15s ease;
}

.toast-dismiss:hover {
  color: #FAF8F5;
}

.toast-dismiss svg {
  width: 100%;
  height: 100%;
}

/* Animations */
.toast-enter-active {
  animation: toast-in 0.3s ease-out;
}

.toast-leave-active {
  animation: toast-out 0.3s ease-in forwards;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
}

/* Mobile */
@media (max-width: 480px) {
  .toast-container {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }

  .toast {
    min-width: unset;
    max-width: unset;
  }
}
</style>
