/**
 * Tables composable
 * Handles all table-related API operations for seated events
 */
export const useTables = () => {
  const { get, post, put, del } = useApi()

  // ========== PUBLIC ENDPOINTS ==========

  /**
   * Get available tables for public purchase
   * @param {string} eventSlug
   */
  const getPublicTables = async (eventSlug) => {
    return await get(`/public/events/${eventSlug}/tables`, {}, { auth: false })
  }

  /**
   * Get available seats for a specific table
   * @param {string} eventSlug
   * @param {number} tableId
   */
  const getPublicTableSeats = async (eventSlug, tableId) => {
    return await get(`/public/events/${eventSlug}/tables/${tableId}/seats`, {}, { auth: false })
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get all tables for an event (admin)
   * @param {string} eventSlug
   */
  const getTables = async (eventSlug) => {
    return await get(`/events/${eventSlug}/tables`)
  }

  /**
   * Get a single table with seats
   * @param {string} eventSlug
   * @param {number} tableId
   */
  const getTable = async (eventSlug, tableId) => {
    return await get(`/events/${eventSlug}/tables/${tableId}`)
  }

  /**
   * Create a new table
   * @param {string} eventSlug
   * @param {Object} data - {
   *   name,
   *   capacity,
   *   price,
   *   sell_as_whole,
   *   position_x,
   *   position_y,
   *   is_active
   * }
   */
  const createTable = async (eventSlug, data) => {
    return await post(`/events/${eventSlug}/tables`, data)
  }

  /**
   * Bulk create tables
   * @param {string} eventSlug
   * @param {Array} tables - Array of table data objects
   */
  const createTablesBulk = async (eventSlug, tables) => {
    return await post(`/events/${eventSlug}/tables/bulk`, { tables })
  }

  /**
   * Update a table
   * @param {string} eventSlug
   * @param {number} tableId
   * @param {Object} data
   */
  const updateTable = async (eventSlug, tableId, data) => {
    return await put(`/events/${eventSlug}/tables/${tableId}`, data)
  }

  /**
   * Delete a table
   * @param {string} eventSlug
   * @param {number} tableId
   */
  const deleteTable = async (eventSlug, tableId) => {
    return await del(`/events/${eventSlug}/tables/${tableId}`)
  }

  return {
    // Public
    getPublicTables,
    getPublicTableSeats,

    // Admin
    getTables,
    getTable,
    createTable,
    createTablesBulk,
    updateTable,
    deleteTable
  }
}
