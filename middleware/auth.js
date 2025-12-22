/**
 * Auth middleware - Requires authentication
 * Redirects to login if user is not authenticated
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // Skip on server - auth state is only available on client
  if (import.meta.server) return

  const { isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    // Store intended destination for redirect after login
    sessionStorage.setItem('intendedUrl', to.fullPath)
    return navigateTo('/login')
  }
})
