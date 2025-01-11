import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      includeAssets: [
        'logo.png',  // Include your static assets
        'favicon.ico', // Ensure favicon is included
        '512.png' // Optionally add an Apple touch icon
      ],
      manifest: {
        name: 'Platform of Perpetual Learnings',
        short_name: 'PoperL',
        description: 'A Progressive Web App built with Vite and React',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/192.png', // Ensure the correct path relative to `public/`
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/512.png', // 512x512 icon for larger resolutions
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/maskable_icon.png', // Optionally add a maskable icon
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
