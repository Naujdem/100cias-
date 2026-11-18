import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      // El JS pasó de 2 MiB (18 nov 2026): se sube el límite para que siga funcionando sin internet.
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'], maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 },
      manifest: {
        name: '100cias',
        short_name: '100cias',
        description: 'Material didáctico interactivo de ciencias naturales',
        lang: 'es',
        theme_color: '#0f766e',
        background_color: '#f6f7f4',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
