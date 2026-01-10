/**
 * Utility functions for handling HTML content in event descriptions
 */

/**
 * Check if a string contains HTML tags
 * @param {string} str - The string to check
 * @returns {boolean} - True if the string contains HTML tags
 */
export function isHtml(str) {
  if (!str || typeof str !== 'string') return false
  // Check for common HTML tags
  const htmlPattern = /<\/?[a-z][\s\S]*>/i
  return htmlPattern.test(str)
}

/**
 * Strip HTML tags from a string and return plain text
 * @param {string} html - The HTML string to strip
 * @returns {string} - Plain text without HTML tags
 */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') return ''

  // Create a temporary element to parse the HTML
  if (typeof document !== 'undefined') {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Fallback for SSR - use regex
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
}

/**
 * Truncate text to a maximum length, preserving words
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text with ellipsis if needed
 */
export function truncateText(text, maxLength = 150) {
  if (!text || typeof text !== 'string') return ''

  // Strip HTML first if present
  const plainText = isHtml(text) ? stripHtml(text) : text

  if (plainText.length <= maxLength) return plainText

  // Find the last space before maxLength to avoid cutting words
  const truncated = plainText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...'
  }

  return truncated + '...'
}

/**
 * Sanitize HTML content for safe rendering
 * Only allows a subset of safe tags
 * @param {string} html - The HTML to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return ''

  // Allowed tags for event descriptions
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span']

  // Create a pattern for allowed tags
  const tagPattern = new RegExp(`<(\\/?)(?!(${allowedTags.join('|')})(\\s|>|\\/))\\w+[^>]*>`, 'gi')

  // Remove script and style tags completely (including content)
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove disallowed tags but keep their content
  sanitized = sanitized.replace(tagPattern, '')

  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '')

  // Remove javascript: URLs
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')

  return sanitized
}
