/**
 * Location utility functions for events
 */

/**
 * Online platform options
 */
export const ONLINE_PLATFORMS = [
  { value: 'zoom', label: 'Zoom' },
  { value: 'google_meet', label: 'Google Meet' },
  { value: 'microsoft_teams', label: 'Microsoft Teams' },
  { value: 'webex', label: 'Webex' },
  { value: 'youtube_live', label: 'YouTube Live' },
  { value: 'facebook_live', label: 'Facebook Live' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'other', label: 'Other' }
]

/**
 * Format location for display
 * @param {object} location - Location object
 * @param {string} locationType - 'venue' or 'online'
 * @returns {string}
 */
export const formatLocation = (location, locationType) => {
  if (!location) return ''

  if (locationType === 'online') {
    const platform = ONLINE_PLATFORMS.find(p => p.value === location.platform)
    return platform ? platform.label : 'Online Event'
  }

  // Venue location
  const parts = []
  if (location.name) parts.push(location.name)
  if (location.address) parts.push(location.address)
  if (location.city) {
    let cityPart = location.city
    if (location.state) cityPart += `, ${location.state}`
    parts.push(cityPart)
  }

  return parts.join(', ') || 'Venue'
}

/**
 * Format short location (just city or platform)
 * @param {object} location - Location object
 * @param {string} locationType - 'venue' or 'online'
 * @returns {string}
 */
export const formatLocationShort = (location, locationType) => {
  if (!location) return ''

  if (locationType === 'online') {
    return 'Online'
  }

  if (location.city) {
    return location.state ? `${location.city}, ${location.state}` : location.city
  }

  return location.name || 'Venue'
}

/**
 * Format full address for venue
 * @param {object} location - Location object
 * @returns {string}
 */
export const formatFullAddress = (location) => {
  if (!location) return ''

  const parts = []
  if (location.address) parts.push(location.address)
  if (location.city) parts.push(location.city)
  if (location.state) parts.push(location.state)
  if (location.postal_code) parts.push(location.postal_code)
  if (location.country) parts.push(location.country)

  return parts.join(', ')
}

/**
 * Build Google Maps URL for venue
 * @param {object} location - Location object
 * @returns {string}
 */
export const buildMapUrl = (location) => {
  if (!location) return ''

  // If map_url is already provided, use it
  if (location.map_url) return location.map_url

  // Build Google Maps search URL
  const address = formatFullAddress(location)
  if (!address) return ''

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/**
 * Check if location is valid for venue type
 * @param {object} location - Location object
 * @returns {boolean}
 */
export const isValidVenueLocation = (location) => {
  if (!location) return false
  // At minimum, require city or address
  return !!(location.city || location.address || location.name)
}

/**
 * Check if location is valid for online type
 * @param {object} location - Location object
 * @returns {boolean}
 */
export const isValidOnlineLocation = (location) => {
  if (!location) return false
  // At minimum, require platform
  return !!location.platform
}

/**
 * Get empty venue location object
 * @returns {object}
 */
export const getEmptyVenueLocation = () => ({
  name: '',
  address: '',
  city: '',
  state: '',
  country: 'Mexico',
  postal_code: '',
  map_url: ''
})

/**
 * Get empty online location object
 * @returns {object}
 */
export const getEmptyOnlineLocation = () => ({
  platform: '',
  url: '',
  instructions: ''
})

/**
 * Get platform label
 * @param {string} platform - Platform value
 * @returns {string}
 */
export const getPlatformLabel = (platform) => {
  const found = ONLINE_PLATFORMS.find(p => p.value === platform)
  return found ? found.label : platform
}
