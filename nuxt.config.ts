// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000',
    },
  },

  pwa: {
    manifest: {
      name: 'StratBaker',
      short_name: 'StratBaker',
      theme_color: '#00ff88',
      background_color: '#0f1117',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: 'index.html',
      runtimeCaching: [
        {
          urlPattern: /^https?.*\/api\/.*/i,
          handler: 'NetworkFirst',
          method: 'GET',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
        {
          urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-assets',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
})
