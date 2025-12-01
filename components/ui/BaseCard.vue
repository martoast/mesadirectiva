<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-card p-6 transition-all duration-200',
      hoverable && 'hover:shadow-card-hover hover:scale-105'
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  hoverable: {
    type: Boolean,
    default: false
  }
})
</script>
