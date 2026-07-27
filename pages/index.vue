<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  layout: false
})

// The front door shows events, not a login wall. Admins reach their
// dashboard from the navbar; this also runs on the server so visitors
// never sit on a blank page.
await navigateTo('/app/events', { replace: true, redirectCode: 302 })
</script>
