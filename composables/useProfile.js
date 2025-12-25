/**
 * Profile management composable
 * Handles profile viewing and updating for the current user
 */
export const useProfile = () => {
  const { get, patch, put } = useApi()

  /**
   * Get the current user's full profile with groups and permissions
   */
  const getProfile = async () => {
    return await get('/profile')
  }

  /**
   * Update the user's profile (name, phone)
   */
  const updateProfile = async (data) => {
    return await patch('/profile', data)
  }

  /**
   * Change the user's password
   */
  const changePassword = async (data) => {
    return await put('/profile/password', data)
  }

  return {
    getProfile,
    updateProfile,
    changePassword
  }
}
