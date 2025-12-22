/**
 * Event Items composable
 * Handles event extra items (add-ons) API operations
 */
export const useEventItems = () => {
  const { get, post, put, del } = useApi()

  /**
   * Get items for an event
   * @param {string} eventSlug
   */
  const getItems = async (eventSlug) => {
    return await get(`/events/${eventSlug}/items`)
  }

  /**
   * Create new item for an event
   * @param {string} eventSlug
   * @param {Object} data - { name, description, price, max_quantity, is_active }
   */
  const createItem = async (eventSlug, data) => {
    return await post(`/events/${eventSlug}/items`, data)
  }

  /**
   * Update an event item
   * @param {string} eventSlug
   * @param {number} itemId
   * @param {Object} data - { name, description, price, max_quantity, is_active }
   */
  const updateItem = async (eventSlug, itemId, data) => {
    return await put(`/events/${eventSlug}/items/${itemId}`, data)
  }

  /**
   * Delete an event item
   * @param {string} eventSlug
   * @param {number} itemId
   */
  const deleteItem = async (eventSlug, itemId) => {
    return await del(`/events/${eventSlug}/items/${itemId}`)
  }

  return {
    getItems,
    createItem,
    updateItem,
    deleteItem
  }
}
