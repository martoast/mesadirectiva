import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const show = (message, options = {}) => {
    const id = ++toastId
    const toast = {
      id,
      message,
      type: options.type || 'success', // success, error, warning, info
      duration: options.duration ?? 3000,
      visible: true
    }

    toasts.value.push(toast)

    if (toast.duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, toast.duration)
    }

    return id
  }

  const success = (message, options = {}) => {
    return show(message, { ...options, type: 'success' })
  }

  const error = (message, options = {}) => {
    return show(message, { ...options, type: 'error', duration: options.duration ?? 5000 })
  }

  const warning = (message, options = {}) => {
    return show(message, { ...options, type: 'warning' })
  }

  const info = (message, options = {}) => {
    return show(message, { ...options, type: 'info' })
  }

  const dismiss = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value[index].visible = false
      // Remove after animation
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, 300)
    }
  }

  const dismissAll = () => {
    toasts.value.forEach(t => t.visible = false)
    setTimeout(() => {
      toasts.value = []
    }, 300)
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll
  }
}
