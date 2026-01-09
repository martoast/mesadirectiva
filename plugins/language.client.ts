/**
 * Language initialization plugin
 * Loads saved language preference from localStorage on app mount
 */

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const { initializeLanguage } = useLanguage()
    initializeLanguage()
  })
})
