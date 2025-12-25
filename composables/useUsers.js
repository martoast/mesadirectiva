/**
 * Users composable
 * Handles user management API operations (super_admin only)
 */
export const useUsers = () => {
  const { get, post, put, del } = useApi()

  /**
   * Get list of users
   * @param {Object} params - { role, search, per_page, page }
   */
  const getUsers = async (params = {}) => {
    return await get('/users', params)
  }

  /**
   * Get user by ID
   * @param {number} id
   */
  const getUser = async (id) => {
    return await get(`/users/${id}`)
  }

  /**
   * Create new user
   * @param {Object} data - { name, email, password, role, is_active }
   */
  const createUser = async (data) => {
    return await post('/users', data)
  }

  /**
   * Update user
   * @param {number} id
   * @param {Object} data - { name, email, password?, role, is_active }
   */
  const updateUser = async (id, data) => {
    return await put(`/users/${id}`, data)
  }

  /**
   * Delete (deactivate) user
   * @param {number} id
   */
  const deleteUser = async (id) => {
    return await del(`/users/${id}`)
  }

  /**
   * Assign groups to user
   * @param {number} id
   * @param {Array} groups - [{ id, permission }]
   */
  const assignGroups = async (id, groups) => {
    return await post(`/users/${id}/groups`, { groups })
  }

  /**
   * Toggle user active status
   * @param {number} id
   */
  const toggleActive = async (id) => {
    return await post(`/users/${id}/toggle-active`)
  }

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    assignGroups,
    toggleActive
  }
}
