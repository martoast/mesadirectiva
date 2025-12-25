/**
 * Seats composable
 * Handles all seat-related API operations for seated events
 */
export const useSeats = () => {
  const { get, post, put, del } = useApi()

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get all seats for a table (admin)
   * @param {string} eventSlug
   * @param {number} tableId
   */
  const getSeats = async (eventSlug, tableId) => {
    return await get(`/events/${eventSlug}/tables/${tableId}/seats`)
  }

  /**
   * Create a new seat
   * @param {string} eventSlug
   * @param {number} tableId
   * @param {Object} data - {
   *   label,
   *   price,
   *   position_x,
   *   position_y,
   *   is_active
   * }
   */
  const createSeat = async (eventSlug, tableId, data) => {
    return await post(`/events/${eventSlug}/tables/${tableId}/seats`, data)
  }

  /**
   * Bulk create seats
   * @param {string} eventSlug
   * @param {number} tableId
   * @param {Array} seats - Array of seat data objects
   */
  const createSeatsBulk = async (eventSlug, tableId, seats) => {
    return await post(`/events/${eventSlug}/tables/${tableId}/seats/bulk`, { seats })
  }

  /**
   * Update a seat
   * @param {string} eventSlug
   * @param {number} seatId
   * @param {Object} data
   */
  const updateSeat = async (eventSlug, seatId, data) => {
    return await put(`/events/${eventSlug}/seats/${seatId}`, data)
  }

  /**
   * Delete a seat
   * @param {string} eventSlug
   * @param {number} seatId
   */
  const deleteSeat = async (eventSlug, seatId) => {
    return await del(`/events/${eventSlug}/seats/${seatId}`)
  }

  return {
    getSeats,
    createSeat,
    createSeatsBulk,
    updateSeat,
    deleteSeat
  }
}
