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
