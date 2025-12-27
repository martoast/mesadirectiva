<template>
  <div class="admin-fullscreen-layout">
    <slot />
  </div>
</template>

<script setup>
// This layout provides a clean fullscreen canvas for admin tools
// that need maximum screen real estate (floor plan editor, etc.)
// Auth is handled by page middleware, not the layout
</script>

<style scoped>
.admin-fullscreen-layout {
  min-height: 100vh;
  min-height: 100dvh;
  background: #09090b;
}
</style>
