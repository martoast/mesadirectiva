// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_API_URL || 'http://localhost:8001',
      stripeKey: process.env.VITE_STRIPE_KEY || ''
    }
  }
})