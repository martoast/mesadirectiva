/**
 * Checkout composable
 * Handles Stripe checkout session creation for all event types
 */
export const useCheckout = () => {
  const { post } = useApi()

  /**
   * Create a Stripe checkout session for General Admission with tiers
   * @param {Object} data - {
   *   event_slug,
   *   customer_name,
   *   customer_email,
   *   customer_phone,
   *   tiers: [{ tier_id, quantity }],
   *   extra_items: [{ item_id, quantity }]
   * }
   */
  const createTierCheckoutSession = async (data) => {
    return await post('/checkout/create-session', data, { auth: false })
  }

  /**
   * Create a Stripe checkout session for Seated events
   * @param {Object} data - {
   *   event_slug,
   *   customer_name,
   *   customer_email,
   *   customer_phone,
   *   tables: [tableId, ...],
   *   seats: [seatId, ...],
   *   reservation_token,
   *   extra_items: [{ item_id, quantity }]
   * }
   */
  const createSeatedCheckoutSession = async (data) => {
    return await post('/checkout/create-session', data, { auth: false })
  }

  /**
   * Create a Stripe checkout session (legacy - single ticket price)
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

  /**
   * Smart checkout session creator - determines the right format based on data
   * @param {Object} data - Checkout data with either tiers, tables/seats, or tickets
   */
  const createSession = async (data) => {
    // Validate required fields
    if (!data.event_slug || !data.customer_name || !data.customer_email) {
      throw new Error('Missing required checkout fields')
    }

    // Determine checkout type and create session
    if (data.tiers && data.tiers.length > 0) {
      // General admission with tiers
      return await createTierCheckoutSession(data)
    } else if (data.tables?.length > 0 || data.seats?.length > 0) {
      // Seated event
      return await createSeatedCheckoutSession(data)
    } else if (data.tickets) {
      // Legacy single-price tickets
      return await createCheckoutSession(data)
    } else {
      throw new Error('No items selected for checkout')
    }
  }

  return {
    // Specific methods
    createCheckoutSession,
    createTierCheckoutSession,
    createSeatedCheckoutSession,

    // Smart method
    createSession
  }
}
