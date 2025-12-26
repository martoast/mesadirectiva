/**
 * Ticket Tiers composable
 * Handles all ticket tier-related API operations for general admission events
 *
 * Tier fields:
 * - name, description, price
 * - quantity (total available)
 * - sales_start, sales_end (sales window dates)
 * - min_per_order, max_per_order (order constraints)
 * - show_description, is_hidden, is_active
 * - sort_order
 *
 * Computed fields in response:
 * - sales_status: 'on_sale' | 'scheduled' | 'ended' | 'sold_out' | 'inactive' | 'hidden'
 * - is_on_sale, is_sold_out, available
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
   *   quantity,
   *   sales_start,
   *   sales_end,
   *   min_per_order,
   *   max_per_order,
   *   show_description,
   *   is_hidden,
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
