/**
 * Dashboard composable
 * Handles dashboard statistics API operations
 */
export const useDashboard = () => {
  const { get } = useApi()

  /**
   * Get overall dashboard statistics
   */
  const getStats = async () => {
    return await get('/dashboard/stats')
  }

  /**
   * Get statistics for a specific event
   * @param {string} slug - Event slug
   */
  const getEventStats = async (slug) => {
    return await get(`/dashboard/events/${slug}/stats`)
  }

  return {
    getStats,
    getEventStats
  }
}
