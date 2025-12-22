/**
 * Checkout composable
 * Handles Stripe checkout session creation
 */
export const useCheckout = () => {
  const { post } = useApi()

  /**
   * Create a Stripe checkout session
   * @param {Object} data - {
   *   event_slug,
   *   customer_name,
   *   customer_email,
   *   customer_phone,
   *   tickets,
   *   extra_items: [{ item_id, quantity }]
   * }
   */
  const createCheckoutSession = async (data) => {
    return await post('/checkout/create-session', data, { auth: false })
  }

  return {
    createCheckoutSession
  }
}
