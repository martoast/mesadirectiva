/**
 * Guest middleware - For unauthenticated pages only
 * Redirects authenticated users to admin dashboard
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // Skip on server - auth state is only available on client
  if (import.meta.server) return

  const { isAuthenticated } = useAuth()

  if (isAuthenticated.value) {
    return navigateTo('/app/admin/events')
  }
})
