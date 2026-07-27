<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  layout: false
})

// This used to be a marketing landing with hardcoded fake stats.
// The events listing IS the landing — send everyone there.
await navigateTo('/app/events', { replace: true, redirectCode: 302 })
</script>
