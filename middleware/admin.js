/**
 * Admin middleware - Requires admin or super_admin role
 * Must be used after auth middleware
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // Skip on server - auth state is only available on client
  if (import.meta.server) return

  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isAdmin.value) {
    // Viewers can only access public pages
    return navigateTo('/app/events')
  }
})
