import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/apple-touch-icon.png', 'og-image.png'],
      manifest: {
        name: 'Calculadora de IMC',
        short_name: 'IMC',
        description: 'Calculadora de Índice de Massa Corporal',
        lang: 'pt-BR',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        id: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#EEF3F1',
        theme_color: '#1F6F5F',
        categories: ['health', 'medical', 'lifestyle'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'],
        navigateFallback: '/index.html',
        // A API nunca vai para o cache: sempre rede.
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
});
