import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      devOptions: {
        enabled: false,
        type: 'module',
        /* other options */
      },
      manifest: {
        name: 'ChatHouse',
        short_name: 'ChatHouse',
        description: 'ChatHouse, une application de chat en ligne',
        theme_color: '#1D232A',
        background_color: '#ffffff', // Add background color for better PWA support
        display: 'standalone', // Improve performance by running standalone
        start_url: '/', // Ensure the PWA starts at the root
        scope: '/', // Define the scope for the PWA
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/maskable-icon-192x192.png', // Add maskable icon for better UX
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      strategies: 'generateSW', // Use the generateSW strategy for optimal caching
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.chathouse\.com\/.*$/, // Cache API calls
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // Cache for 1 day
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/, // Cache static assets
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
              },
            },
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
