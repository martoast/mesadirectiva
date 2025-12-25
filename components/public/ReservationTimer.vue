<template>
  <div
    v-if="isActive"
    :class="[
      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
      isExpiringSoon ? 'bg-warning-100 text-warning-800' : 'bg-primary-100 text-primary-800',
      isExpired && 'bg-danger-100 text-danger-800'
    ]"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <span v-if="isExpired">
      Reservation expired
    </span>
    <span v-else>
      Reservation expires in <strong>{{ formattedTime }}</strong>
    </span>

    <span v-if="isExpiringSoon && !isExpired" class="ml-1 animate-pulse">
      - Complete checkout soon!
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  expiresAt: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['expired'])

const timeRemaining = ref(0)
let timer = null

const isActive = computed(() => {
  return props.expiresAt && timeRemaining.value >= 0
})

const isExpiringSoon = computed(() => {
  return timeRemaining.value > 0 && timeRemaining.value < 120
})

const isExpired = computed(() => {
  return timeRemaining.value <= 0
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60)
  const seconds = timeRemaining.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const updateTime = () => {
  if (!props.expiresAt) return

  const now = new Date().getTime()
  const expiry = new Date(props.expiresAt).getTime()
  const diff = Math.max(0, Math.floor((expiry - now) / 1000))

  timeRemaining.value = diff

  if (diff <= 0) {
    stopTimer()
    emit('expired')
  }
}

const startTimer = () => {
  stopTimer()
  updateTime()
  timer = setInterval(updateTime, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(() => props.expiresAt, (newVal) => {
  if (newVal) {
    startTimer()
  } else {
    stopTimer()
  }
}, { immediate: true })

onUnmounted(() => {
  stopTimer()
})
</script>
