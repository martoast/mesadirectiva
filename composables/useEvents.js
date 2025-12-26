/**
 * Events composable
 * Handles all event-related API operations
 *
 * Event fields:
 * - name, description, image
 * - starts_at, ends_at, timezone
 * - location_type ('venue' | 'online'), location (object)
 * - media ({ images: [], videos: [] })
 * - organizer_name, organizer_description
 * - faq_items, is_private, show_remaining
 */
export const useEvents = () => {
  const { get, post, put, del, upload } = useApi()

  // ========== PUBLIC ENDPOINTS ==========

  /**
   * Get list of public live events
   * @param {Object} params - { group, per_page, page }
   */
  const getPublicEvents = async (params = {}) => {
    return await get('/public/events', params, { auth: false })
  }

  /**
   * Get public event details by slug
   * @param {string} slug
   */
  const getPublicEvent = async (slug) => {
    return await get(`/public/events/${slug}`, {}, { auth: false })
  }

  /**
   * Check event availability for purchase
   * @param {string} slug
   */
  const checkAvailability = async (slug) => {
    return await get(`/public/events/${slug}/availability`, {}, { auth: false })
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get list of events (admin)
   * @param {Object} params - { status, group_id, per_page, page }
   */
  const getEvents = async (params = {}) => {
    return await get('/events', params)
  }

  /**
   * Get event details (admin)
   * @param {string} slug
   */
  const getEvent = async (slug) => {
    return await get(`/events/${slug}`)
  }

  /**
   * Create new event
   * @param {Object} data - Event data
   */
  const createEvent = async (data) => {
    return await post('/events', data)
  }

  /**
   * Update event
   * @param {string} slug
   * @param {Object} data - Event data
   */
  const updateEvent = async (slug, data) => {
    return await put(`/events/${slug}`, data)
  }

  /**
   * Delete event
   * @param {string} slug
   */
  const deleteEvent = async (slug) => {
    return await del(`/events/${slug}`)
  }

  /**
   * Publish event (draft -> live)
   * @param {string} slug
   */
  const publishEvent = async (slug) => {
    return await post(`/events/${slug}/publish`)
  }

  /**
   * Close event
   * @param {string} slug
   */
  const closeEvent = async (slug) => {
    return await post(`/events/${slug}/close`)
  }

  /**
   * Duplicate event
   * @param {string} slug
   */
  const duplicateEvent = async (slug) => {
    return await post(`/events/${slug}/duplicate`)
  }

  /**
   * Upload event image
   * @param {string} slug
   * @param {File} file
   */
  const uploadEventImage = async (slug, file) => {
    const formData = new FormData()
    formData.append('image', file)
    return await upload(`/events/${slug}/image`, formData)
  }

  /**
   * Add media to event gallery
   * @param {string} slug
   * @param {Object} data - { type: 'image'|'youtube', file?: File, url?: string }
   */
  const addMedia = async (slug, data) => {
    if (data.type === 'image' && data.file) {
      const formData = new FormData()
      formData.append('type', 'image')
      formData.append('file', data.file)
      return await upload(`/events/${slug}/media`, formData)
    }
    return await post(`/events/${slug}/media`, data)
  }

  /**
   * Remove media from event gallery
   * @param {string} slug
   * @param {Object} data - { type: 'images'|'videos', index: number }
   */
  const removeMedia = async (slug, data) => {
    return await del(`/events/${slug}/media`, data)
  }

  /**
   * Get event orders
   * @param {string} slug
   * @param {Object} params - { per_page, page }
   */
  const getEventOrders = async (slug, params = {}) => {
    return await get(`/events/${slug}/orders`, params)
  }

  return {
    // Public
    getPublicEvents,
    getPublicEvent,
    checkAvailability,

    // Admin
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
    closeEvent,
    duplicateEvent,
    uploadEventImage,
    addMedia,
    removeMedia,
    getEventOrders
  }
}
