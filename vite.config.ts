// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Enable service worker in dev mode
        type: 'module', // Use module-type service worker
      },
      includeAssets: [
        'favicon.ico',
        'Pomo/pwa-192x192.png',
        'Pomo/pwa-512x512.png',
        'Pomo/vite.svg',
        'Pomo/vue.svg', // If in public/Pomo/
      ],
      manifest: {
        name: 'Pomo Funnel',
        short_name: 'PomoFunnel',
        description: 'Your application description',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/Pomo/',
        start_url: '/Pomo/',
        icons: [
          { src: '/Pomo/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/Pomo/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [/* ... */],
      },
    }),
  ],
  base: '/Pomo/',
});