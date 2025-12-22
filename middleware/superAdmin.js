/**
 * Super Admin middleware - Requires super_admin role
 * Must be used after auth middleware
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // Skip on server - auth state is only available on client
  if (import.meta.server) return

  const { isAuthenticated, isSuperAdmin } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isSuperAdmin.value) {
    // Non-super admins cannot access this page
    return navigateTo('/app/admin/events')
  }
})
