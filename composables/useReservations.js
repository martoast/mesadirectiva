/**
 * Reservations composable
 * Handles seat/table reservations for seated events during checkout
 */
export const useReservations = () => {
  const { post, del } = useApi()

  // Reactive state for current reservation
  const reservation = ref(null)
  const reservationTimer = ref(null)
  const timeRemaining = ref(0)

  /**
   * Create a reservation for tables and/or seats
   * @param {string} eventSlug
   * @param {Object} data - { tables: [id, ...], seats: [id, ...] }
   * @returns {Object} - { token, expires_at, tables, seats }
   */
  const createReservation = async (eventSlug, data) => {
    const response = await post(`/public/events/${eventSlug}/reserve`, data, { auth: false })

    if (response.reservation) {
      reservation.value = response.reservation
      startTimer(response.reservation.expires_at)
    }

    return response
  }

  /**
   * Release a reservation
   * @param {string} eventSlug
   * @param {string} token - Reservation token
   */
  const releaseReservation = async (eventSlug, token) => {
    // Use POST with _method override since we need to send body
    const response = await post(`/public/events/${eventSlug}/reserve`, {
      token,
      _method: 'DELETE'
    }, { auth: false })

    clearReservation()
    return response
  }

  /**
   * Start the countdown timer
   * @param {string} expiresAt - ISO datetime string
   */
  const startTimer = (expiresAt) => {
    stopTimer()

    const updateTime = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const diff = Math.max(0, Math.floor((expiry - now) / 1000))

      timeRemaining.value = diff

      if (diff <= 0) {
        clearReservation()
      }
    }

    updateTime()
    reservationTimer.value = setInterval(updateTime, 1000)
  }

  /**
   * Stop the countdown timer
   */
  const stopTimer = () => {
    if (reservationTimer.value) {
      clearInterval(reservationTimer.value)
      reservationTimer.value = null
    }
  }

  /**
   * Clear the current reservation
   */
  const clearReservation = () => {
    stopTimer()
    reservation.value = null
    timeRemaining.value = 0
  }

  /**
   * Format time remaining as MM:SS
   */
  const formattedTimeRemaining = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  /**
   * Check if reservation is expiring soon (< 2 minutes)
   */
  const isExpiringSoon = computed(() => {
    return timeRemaining.value > 0 && timeRemaining.value < 120
  })

  /**
   * Check if reservation has expired
   */
  const isExpired = computed(() => {
    return reservation.value && timeRemaining.value <= 0
  })

  /**
   * Check if there's an active reservation
   */
  const hasReservation = computed(() => {
    return reservation.value && timeRemaining.value > 0
  })

  // Clean up timer on unmount
  onUnmounted(() => {
    stopTimer()
  })

  return {
    // State
    reservation,
    timeRemaining,
    formattedTimeRemaining,
    isExpiringSoon,
    isExpired,
    hasReservation,

    // Methods
    createReservation,
    releaseReservation,
    clearReservation,
    startTimer,
    stopTimer
  }
}
