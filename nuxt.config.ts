// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],

  // Enable SSR for dynamic meta tags (social sharing)
  ssr: true,

  // Configure Nitro for Netlify SSR
  nitro: {
    preset: 'netlify'
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_API_URL || 'http://localhost:8001',
      stripeKey: process.env.VITE_STRIPE_KEY || '',
      siteUrl: process.env.VITE_SITE_URL || 'https://mesa-directiva.netlify.app'
    }
  }
})