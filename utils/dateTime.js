/**
 * Date/Time utility functions for events
 */

/**
 * Common timezones for Mexico
 */
export const MEXICO_TIMEZONES = [
  { value: 'America/Mexico_City', label: 'Mexico City (Central)' },
  { value: 'America/Cancun', label: 'Cancun (Eastern)' },
  { value: 'America/Monterrey', label: 'Monterrey (Central)' },
  { value: 'America/Tijuana', label: 'Tijuana (Pacific)' },
  { value: 'America/Hermosillo', label: 'Hermosillo (Mountain)' },
  { value: 'America/Mazatlan', label: 'Mazatlan (Mountain)' }
]

/**
 * All common timezones
 */
export const ALL_TIMEZONES = [
  ...MEXICO_TIMEZONES,
  { value: 'America/Los_Angeles', label: 'Los Angeles (Pacific)' },
  { value: 'America/Denver', label: 'Denver (Mountain)' },
  { value: 'America/Chicago', label: 'Chicago (Central)' },
  { value: 'America/New_York', label: 'New York (Eastern)' },
  { value: 'UTC', label: 'UTC' }
]

/**
 * Format a datetime for display
 * @param {string} dateStr - ISO datetime string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export const formatDateTime = (dateStr, options = {}) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options
  })
}

/**
 * Format date only
 * @param {string} dateStr - ISO datetime string
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Format date short (e.g., "Dec 25")
 * @param {string} dateStr - ISO datetime string
 * @returns {string}
 */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format time only
 * @param {string} dateStr - ISO datetime string
 * @returns {string}
 */
export const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

/**
 * Format event date range
 * @param {string} startsAt - ISO datetime string
 * @param {string} endsAt - ISO datetime string
 * @returns {string}
 */
export const formatEventDateTime = (startsAt, endsAt) => {
  if (!startsAt) return ''

  const start = new Date(startsAt)
  const end = endsAt ? new Date(endsAt) : null

  const startDate = formatDate(startsAt)
  const startTime = formatTime(startsAt)

  if (!end) {
    return `${startDate} at ${startTime}`
  }

  // Check if same day
  const sameDay = start.toDateString() === end.toDateString()

  if (sameDay) {
    const endTime = formatTime(endsAt)
    return `${startDate}, ${startTime} - ${endTime}`
  }

  // Different days
  const endDate = formatDate(endsAt)
  const endTime = formatTime(endsAt)
  return `${startDate} ${startTime} - ${endDate} ${endTime}`
}

/**
 * Format time range only
 * @param {string} startsAt - ISO datetime string
 * @param {string} endsAt - ISO datetime string
 * @returns {string}
 */
export const formatTimeRange = (startsAt, endsAt) => {
  if (!startsAt) return ''
  const startTime = formatTime(startsAt)
  if (!endsAt) return startTime
  const endTime = formatTime(endsAt)
  return `${startTime} - ${endTime}`
}

/**
 * Get human-readable timezone label
 * @param {string} timezone - Timezone string
 * @returns {string}
 */
export const getTimezoneLabel = (timezone) => {
  const found = ALL_TIMEZONES.find(tz => tz.value === timezone)
  return found ? found.label : timezone
}

/**
 * Check if event has ended
 * @param {string} endsAt - ISO datetime string
 * @returns {boolean}
 */
export const isEventPast = (endsAt) => {
  if (!endsAt) return false
  return new Date(endsAt) < new Date()
}

/**
 * Check if event is currently happening
 * @param {string} startsAt - ISO datetime string
 * @param {string} endsAt - ISO datetime string
 * @returns {boolean}
 */
export const isEventLive = (startsAt, endsAt) => {
  if (!startsAt) return false
  const now = new Date()
  const start = new Date(startsAt)
  const end = endsAt ? new Date(endsAt) : null

  if (now < start) return false
  if (end && now > end) return false
  return true
}

/**
 * Check if event is upcoming (hasn't started yet)
 * @param {string} startsAt - ISO datetime string
 * @returns {boolean}
 */
export const isEventUpcoming = (startsAt) => {
  if (!startsAt) return false
  return new Date(startsAt) > new Date()
}

/**
 * Get relative time string (e.g., "in 2 days", "3 hours ago")
 * @param {string} dateStr - ISO datetime string
 * @returns {string}
 */
export const getRelativeTime = (dateStr) => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date - now
  const diffMins = Math.round(diffMs / 60000)
  const diffHours = Math.round(diffMs / 3600000)
  const diffDays = Math.round(diffMs / 86400000)

  if (diffMins === 0) return 'now'

  if (diffMins > 0) {
    // Future
    if (diffMins < 60) return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`
    if (diffHours < 24) return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`
    if (diffDays < 7) return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
    return formatDateShort(dateStr)
  } else {
    // Past
    const absMins = Math.abs(diffMins)
    const absHours = Math.abs(diffHours)
    const absDays = Math.abs(diffDays)
    if (absMins < 60) return `${absMins} minute${absMins !== 1 ? 's' : ''} ago`
    if (absHours < 24) return `${absHours} hour${absHours !== 1 ? 's' : ''} ago`
    if (absDays < 7) return `${absDays} day${absDays !== 1 ? 's' : ''} ago`
    return formatDateShort(dateStr)
  }
}

/**
 * Convert datetime-local input value to ISO string
 * @param {string} localValue - Value from datetime-local input
 * @returns {string}
 */
export const localToISO = (localValue) => {
  if (!localValue) return ''
  return new Date(localValue).toISOString()
}

/**
 * Convert ISO string to datetime-local input value
 * @param {string} isoValue - ISO datetime string
 * @returns {string}
 */
export const isoToLocal = (isoValue) => {
  if (!isoValue) return ''
  const date = new Date(isoValue)
  // Format: YYYY-MM-DDTHH:mm
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
