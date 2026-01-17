/**
 * Attendees composable
 * Handles all attendee-related API operations for check-in functionality
 */
export const useAttendees = () => {
  const { get, post } = useApi()

  /**
   * Get list of attendees for an event
   * @param {string} eventSlug - Event slug
   * @param {Object} params - { search, status, checked_in, type, per_page, page }
   */
  const getAttendees = async (eventSlug, params = {}) => {
    return await get(`/events/${eventSlug}/attendees`, params)
  }

  /**
   * Check in an attendee
   * @param {string} eventSlug - Event slug
   * @param {number} orderItemId - Order item ID to check in
   */
  const checkInAttendee = async (eventSlug, orderItemId) => {
    return await post(`/events/${eventSlug}/attendees/${orderItemId}/check-in`)
  }

  /**
   * Undo check-in for an attendee
   * @param {string} eventSlug - Event slug
   * @param {number} orderItemId - Order item ID to undo check-in
   */
  const undoCheckIn = async (eventSlug, orderItemId) => {
    return await post(`/events/${eventSlug}/attendees/${orderItemId}/undo-check-in`)
  }

  return {
    getAttendees,
    checkInAttendee,
    undoCheckIn,
  }
}
