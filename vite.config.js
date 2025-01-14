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
        '192.png', // Ensure favicon is included
        '512.png',  // Include your static assets
        '512.png' // Optionally add an Apple touch icon
      ],
      workbox: {
        globPatterns: ['**/*.{html,js,css,png,jpg,svg,json}'], // Specify files to cache
      },
      manifest: {
        name: 'Platform of Perpetual Learnings',
        short_name: 'PoperL',
        description: 'A Progressive Web App built with Vite and React',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: "/?homescreen=1",
        icons: [
          {
            src: "144.png",
            sizes: "144x144",
            type: "image/png"
          },
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
        screenshots: [
          {
            src: "screenshot-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "screenshot-mobile.png",
            sizes: "720x1280",
            type: "image/png",
            form_factor: "narrow"
          }
        ]
      },
    }),
  ],
});
