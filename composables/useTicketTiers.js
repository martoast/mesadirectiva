/**
 * Ticket Tiers composable
 * Handles all ticket tier-related API operations for general admission events
 */
export const useTicketTiers = () => {
  const { get, post, put, del } = useApi()

  // ========== PUBLIC ENDPOINTS ==========

  /**
   * Get available ticket tiers for public purchase
   * @param {string} eventSlug
   */
  const getPublicTicketTiers = async (eventSlug) => {
    return await get(`/public/events/${eventSlug}/ticket-tiers`, {}, { auth: false })
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get all ticket tiers for an event (admin)
   * @param {string} eventSlug
   */
  const getTicketTiers = async (eventSlug) => {
    return await get(`/events/${eventSlug}/ticket-tiers`)
  }

  /**
   * Get a single ticket tier
   * @param {string} eventSlug
   * @param {number} tierId
   */
  const getTicketTier = async (eventSlug, tierId) => {
    return await get(`/events/${eventSlug}/ticket-tiers/${tierId}`)
  }

  /**
   * Create a new ticket tier
   * @param {string} eventSlug
   * @param {Object} data - {
   *   name,
   *   description,
   *   price,
   *   early_bird_price,
   *   early_bird_deadline,
   *   max_quantity,
   *   sort_order,
   *   is_active
   * }
   */
  const createTicketTier = async (eventSlug, data) => {
    return await post(`/events/${eventSlug}/ticket-tiers`, data)
  }

  /**
   * Update a ticket tier
   * @param {string} eventSlug
   * @param {number} tierId
   * @param {Object} data
   */
  const updateTicketTier = async (eventSlug, tierId, data) => {
    return await put(`/events/${eventSlug}/ticket-tiers/${tierId}`, data)
  }

  /**
   * Delete a ticket tier
   * @param {string} eventSlug
   * @param {number} tierId
   */
  const deleteTicketTier = async (eventSlug, tierId) => {
    return await del(`/events/${eventSlug}/ticket-tiers/${tierId}`)
  }

  return {
    // Public
    getPublicTicketTiers,

    // Admin
    getTicketTiers,
    getTicketTier,
    createTicketTier,
    updateTicketTier,
    deleteTicketTier
  }
}
