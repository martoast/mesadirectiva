<template>
  <div></div>
</template>

<script setup>
const { isAuthenticated } = useAuth()

definePageMeta({
  layout: false
})

// Redirect based on auth status
if (import.meta.client) {
  if (isAuthenticated.value) {
    navigateTo('/app/admin/events', { replace: true })
  } else {
    navigateTo('/login', { replace: true })
  }
}
</script>
