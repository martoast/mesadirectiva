/**
 * Ticket tier sales status utility functions
 */

/**
 * Sales status labels
 */
export const SALES_STATUS_LABELS = {
  on_sale: 'On Sale',
  scheduled: 'Scheduled',
  ended: 'Ended',
  sold_out: 'Sold Out',
  inactive: 'Inactive',
  hidden: 'Hidden'
}

/**
 * Sales status colors (Tailwind classes)
 */
export const SALES_STATUS_COLORS = {
  on_sale: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500'
  },
  scheduled: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-500'
  },
  ended: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400'
  },
  sold_out: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500'
  },
  inactive: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500'
  },
  hidden: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    dot: 'bg-purple-500'
  }
}

/**
 * Get human-readable sales status label
 * @param {string} status - Sales status value
 * @returns {string}
 */
export const getSalesStatusLabel = (status) => {
  return SALES_STATUS_LABELS[status] || status
}

/**
 * Get sales status color classes
 * @param {string} status - Sales status value
 * @returns {object}
 */
export const getSalesStatusColors = (status) => {
  return SALES_STATUS_COLORS[status] || SALES_STATUS_COLORS.inactive
}

/**
 * Check if tier can be purchased
 * @param {object} tier - Ticket tier object
 * @returns {boolean}
 */
export const isTierPurchasable = (tier) => {
  if (!tier) return false

  // Check computed field if available
  if (typeof tier.is_on_sale === 'boolean') {
    return tier.is_on_sale
  }

  // Manual check
  if (!tier.is_active) return false
  if (tier.is_hidden) return false
  if (tier.is_sold_out) return false

  const now = new Date()

  // Check sales window
  if (tier.sales_start && new Date(tier.sales_start) > now) return false
  if (tier.sales_end && new Date(tier.sales_end) < now) return false

  return true
}

/**
 * Calculate sales status from tier data
 * @param {object} tier - Ticket tier object
 * @returns {string}
 */
export const calculateSalesStatus = (tier) => {
  if (!tier) return 'inactive'

  // Use server-provided status if available
  if (tier.sales_status) return tier.sales_status

  // Manual calculation
  if (!tier.is_active) return 'inactive'
  if (tier.is_hidden) return 'hidden'
  if (tier.is_sold_out || (tier.available !== undefined && tier.available <= 0)) return 'sold_out'

  const now = new Date()

  if (tier.sales_start && new Date(tier.sales_start) > now) return 'scheduled'
  if (tier.sales_end && new Date(tier.sales_end) < now) return 'ended'

  return 'on_sale'
}

/**
 * Get tier availability text
 * @param {object} tier - Ticket tier object
 * @returns {string}
 */
export const getTierAvailabilityText = (tier) => {
  if (!tier) return ''

  const status = tier.sales_status || calculateSalesStatus(tier)

  switch (status) {
    case 'sold_out':
      return 'Sold out'
    case 'scheduled':
      return tier.sales_start
        ? `Sales start ${new Date(tier.sales_start).toLocaleDateString()}`
        : 'Coming soon'
    case 'ended':
      return 'Sales ended'
    case 'inactive':
      return 'Not available'
    case 'hidden':
      return 'Hidden'
    case 'on_sale':
      if (tier.available !== undefined && tier.available > 0) {
        return `${tier.available} remaining`
      }
      return 'Available'
    default:
      return ''
  }
}

/**
 * Format tier price display
 * @param {object} tier - Ticket tier object
 * @returns {string}
 */
export const formatTierPrice = (tier) => {
  if (!tier) return ''

  const price = parseFloat(tier.price) || 0

  if (price === 0) return 'Free'

  return `$${price.toFixed(2)}`
}

/**
 * Get order quantity constraints text
 * @param {object} tier - Ticket tier object
 * @returns {string}
 */
export const getQuantityConstraintsText = (tier) => {
  if (!tier) return ''

  const min = tier.min_per_order || 1
  const max = tier.max_per_order || 10

  if (min === 1 && max === 10) return ''
  if (min > 1 && max === 10) return `Minimum ${min} per order`
  if (min === 1 && max < 10) return `Maximum ${max} per order`

  return `${min} - ${max} per order`
}

/**
 * Validate quantity against tier constraints
 * @param {number} quantity - Selected quantity
 * @param {object} tier - Ticket tier object
 * @returns {{ valid: boolean, error: string }}
 */
export const validateQuantity = (quantity, tier) => {
  if (!tier) return { valid: false, error: 'Invalid tier' }

  const min = tier.min_per_order || 1
  const max = tier.max_per_order || 10
  const available = tier.available

  if (quantity < min) {
    return { valid: false, error: `Minimum ${min} tickets required` }
  }

  if (quantity > max) {
    return { valid: false, error: `Maximum ${max} tickets allowed` }
  }

  if (available !== undefined && quantity > available) {
    return { valid: false, error: `Only ${available} tickets remaining` }
  }

  return { valid: true, error: '' }
}
