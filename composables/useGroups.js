/**
 * Groups composable
 * Handles all group-related API operations
 */
export const useGroups = () => {
  const { get, post, put, del } = useApi()

  /**
   * Get list of groups
   */
  const getGroups = async () => {
    return await get('/groups')
  }

  /**
   * Get group by ID
   * @param {number} id
   */
  const getGroup = async (id) => {
    return await get(`/groups/${id}`)
  }

  /**
   * Create new group (super_admin only)
   * @param {Object} data - { name, description, color }
   */
  const createGroup = async (data) => {
    return await post('/groups', data)
  }

  /**
   * Update group (super_admin only)
   * @param {number} id
   * @param {Object} data - { name, description, color }
   */
  const updateGroup = async (id, data) => {
    return await put(`/groups/${id}`, data)
  }

  /**
   * Delete group (super_admin only)
   * @param {number} id
   */
  const deleteGroup = async (id) => {
    return await del(`/groups/${id}`)
  }

  return {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup
  }
}
