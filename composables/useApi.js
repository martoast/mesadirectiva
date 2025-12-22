/**
 * Base API client composable
 * Handles authentication headers, error handling, and provides HTTP methods
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const baseUrl = config.public.apiUrl

  /**
   * Get the auth token from localStorage
   */
  const getToken = () => {
    if (import.meta.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  /**
   * Build headers with optional auth token
   */
  const buildHeaders = (includeAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (includeAuth) {
      const token = getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Handle API response
   */
  const handleResponse = async (response) => {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Only redirect to login if user had a token (session expired)
      // Don't redirect for unauthenticated requests to protected endpoints
      const hadToken = import.meta.client && localStorage.getItem('auth_token')

      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }

      if (hadToken) {
        router.push('/login')
        throw new Error('Session expired. Please login again.')
      }

      // For unauthenticated requests, just throw error without redirect
      throw new Error('Authentication required')
    }

    const data = await response.json()

    // Handle error responses
    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred')
      error.status = response.status
      error.errors = data.errors || {}
      throw error
    }

    return data
  }

  /**
   * Make a GET request
   */
  const get = async (endpoint, params = {}, options = {}) => {
    const url = new URL(`${baseUrl}${endpoint}`)
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(options.auth !== false)
    })

    return handleResponse(response)
  }

  /**
   * Make a POST request
   */
  const post = async (endpoint, body = {}, options = {}) => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(options.auth !== false),
      body: JSON.stringify(body)
    })

    return handleResponse(response)
  }

  /**
   * Make a PUT request
   */
  const put = async (endpoint, body = {}, options = {}) => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(options.auth !== false),
      body: JSON.stringify(body)
    })

    return handleResponse(response)
  }

  /**
   * Make a PATCH request
   */
  const patch = async (endpoint, body = {}, options = {}) => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: buildHeaders(options.auth !== false),
      body: JSON.stringify(body)
    })

    return handleResponse(response)
  }

  /**
   * Make a DELETE request
   */
  const del = async (endpoint, options = {}) => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(options.auth !== false)
    })

    return handleResponse(response)
  }

  /**
   * Upload a file (multipart/form-data)
   */
  const upload = async (endpoint, formData, options = {}) => {
    const headers = {}
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    headers['Accept'] = 'application/json'

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    })

    return handleResponse(response)
  }

  /**
   * Download a file (returns blob)
   */
  const download = async (endpoint, params = {}, filename = 'download') => {
    const url = new URL(`${baseUrl}${endpoint}`)
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })

    const token = getToken()
    const headers = {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Download failed')
    }

    const blob = await response.blob()

    // Trigger download
    if (import.meta.client) {
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    }

    return blob
  }

  return {
    get,
    post,
    put,
    patch,
    del,
    upload,
    download,
    getToken,
    baseUrl
  }
}
