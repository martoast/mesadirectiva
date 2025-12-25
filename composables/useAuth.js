import { ref, computed } from 'vue'

// Global reactive state for auth
const user = ref(null)
const token = ref(null)
const initialized = ref(false)

/**
 * Authentication composable
 * Manages user authentication state and provides auth methods
 */
export const useAuth = () => {
  const { get, post } = useApi()
  const config = useRuntimeConfig()
  const router = useRouter()

  /**
   * Initialize auth state from localStorage
   */
  const init = () => {
    if (initialized.value) return

    if (import.meta.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken) {
        token.value = storedToken
      }

      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch (e) {
          user.value = null
        }
      }
    }

    initialized.value = true
  }

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    const response = await post('/auth/login', { email, password }, { auth: false })

    // Store token first
    token.value = response.token

    if (import.meta.client) {
      localStorage.setItem('auth_token', response.token)
    }

    // Fetch full profile to get groups with permissions
    const profileResponse = await get('/profile')
    user.value = profileResponse.user

    if (import.meta.client) {
      localStorage.setItem('auth_user', JSON.stringify(profileResponse.user))
    }

    return response
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      await post('/auth/logout')
    } catch (e) {
      // Ignore errors during logout
    }

    // Clear state
    token.value = null
    user.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }

    router.push('/login')
  }

  /**
   * Fetch current user from API
   * Uses /profile to get full user data including groups with permissions
   */
  const fetchUser = async () => {
    try {
      // Use /profile instead of /auth/user to get groups with permissions
      const response = await get('/profile')
      user.value = response.user

      if (import.meta.client) {
        localStorage.setItem('auth_user', JSON.stringify(response.user))
      }

      return response.user
    } catch (e) {
      // Token invalid, clear auth state
      token.value = null
      user.value = null

      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }

      throw e
    }
  }

  /**
   * Handle OAuth callback - store token from URL
   */
  const handleOAuthCallback = async (callbackToken) => {
    token.value = callbackToken

    if (import.meta.client) {
      localStorage.setItem('auth_token', callbackToken)
    }

    // Fetch full user info
    await fetchUser()
  }

  /**
   * Get Google OAuth redirect URL
   */
  const getGoogleRedirectUrl = () => {
    return `${config.public.apiUrl}/auth/google/redirect`
  }

  /**
   * Request password reset email
   */
  const forgotPassword = async (email) => {
    return await post('/auth/forgot-password', { email }, { auth: false })
  }

  /**
   * Reset password with token
   */
  const resetPassword = async (resetToken, email, password, passwordConfirmation) => {
    return await post('/auth/reset-password', {
      token: resetToken,
      email,
      password,
      password_confirmation: passwordConfirmation
    }, { auth: false })
  }

  // Computed properties
  const isAuthenticated = computed(() => !!token.value)

  const isViewer = computed(() => user.value?.role === 'viewer')

  const isAdmin = computed(() => {
    return user.value?.role === 'admin' || user.value?.role === 'super_admin'
  })

  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')

  const userGroups = computed(() => user.value?.groups || [])

  /**
   * Check if user has permission for a group
   */
  const hasPermission = (groupId, requiredPermission) => {
    if (isSuperAdmin.value) return true

    const group = userGroups.value.find(g => g.id === groupId)
    if (!group) return false

    const permissionLevels = { view: 1, edit: 2, manage: 3 }
    const userLevel = permissionLevels[group.permission] || 0
    const requiredLevel = permissionLevels[requiredPermission] || 0

    return userLevel >= requiredLevel
  }

  // Initialize on first use
  init()

  return {
    // State
    user,
    token,
    initialized,

    // Methods
    init,
    login,
    logout,
    fetchUser,
    handleOAuthCallback,
    getGoogleRedirectUrl,
    forgotPassword,
    resetPassword,
    hasPermission,

    // Computed
    isAuthenticated,
    isViewer,
    isAdmin,
    isSuperAdmin,
    userGroups
  }
}
