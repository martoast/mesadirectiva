/**
 * Categories composable
 * Handles all category-related API operations
 */
export const useCategories = () => {
  const { get, post, put, del } = useApi()

  /**
   * Get list of categories
   */
  const getCategories = async () => {
    return await get('/categories')
  }

  /**
   * Get category by ID
   * @param {number} id
   */
  const getCategory = async (id) => {
    return await get(`/categories/${id}`)
  }

  /**
   * Create new category (super_admin only)
   * @param {Object} data - { name, description, color }
   */
  const createCategory = async (data) => {
    return await post('/categories', data)
  }

  /**
   * Update category (super_admin only)
   * @param {number} id
   * @param {Object} data - { name, description, color }
   */
  const updateCategory = async (id, data) => {
    return await put(`/categories/${id}`, data)
  }

  /**
   * Delete category (super_admin only)
   * @param {number} id
   */
  const deleteCategory = async (id) => {
    return await del(`/categories/${id}`)
  }

  return {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
