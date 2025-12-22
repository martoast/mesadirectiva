/**
 * Reports composable
 * Handles reports and exports API operations
 */
export const useReports = () => {
  const { get, download } = useApi()

  /**
   * Get sales report
   * @param {Object} params - { event_id, category_id, date_from, date_to, search }
   */
  const getSalesReport = async (params = {}) => {
    return await get('/reports/sales', params)
  }

  /**
   * Export sales report to Excel
   * @param {Object} params - { event_id, category_id, date_from, date_to, search }
   */
  const exportSales = async (params = {}) => {
    const today = new Date().toISOString().split('T')[0]
    return await download('/reports/sales/export', params, `sales-report-${today}.xlsx`)
  }

  /**
   * Get orders report
   * @param {Object} params - { event_id, category_id, date_from, date_to, status, search }
   */
  const getOrdersReport = async (params = {}) => {
    return await get('/reports/orders', params)
  }

  /**
   * Export orders report to Excel
   * @param {Object} params - { event_id, category_id, date_from, date_to, status, search }
   */
  const exportOrders = async (params = {}) => {
    const today = new Date().toISOString().split('T')[0]
    return await download('/reports/orders/export', params, `orders-report-${today}.xlsx`)
  }

  return {
    getSalesReport,
    exportSales,
    getOrdersReport,
    exportOrders
  }
}
