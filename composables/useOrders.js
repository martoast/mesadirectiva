/**
 * Orders composable
 * Handles order-related API operations
 */
export const useOrders = () => {
  const { get } = useApi()

  /**
   * Get order by order number
   * @param {string} orderNumber
   */
  const getOrder = async (orderNumber) => {
    return await get(`/orders/${orderNumber}`)
  }

  return {
    getOrder
  }
}
