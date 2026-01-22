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

  app: {
    head: {
      title: 'Mesa Directiva',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Central de Eventos - Asociación de Padres de Familia del Instituto México A.C.' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Mesa Directiva' },
        { property: 'og:description', content: 'Central de Eventos - Asociación de Padres de Familia del Instituto México A.C.' },
        { property: 'og:image', content: 'https://mesa-directiva.netlify.app/logo.jpeg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: 'https://mesa-directiva.netlify.app' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Mesa Directiva' },
        { name: 'twitter:description', content: 'Central de Eventos - Asociación de Padres de Familia del Instituto México A.C.' },
        { name: 'twitter:image', content: 'https://mesa-directiva.netlify.app/logo.jpeg' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_API_URL || 'http://localhost:8001',
      stripeKey: process.env.VITE_STRIPE_KEY || '',
      siteUrl: process.env.VITE_SITE_URL || 'https://mesa-directiva.netlify.app'
    }
  }
})