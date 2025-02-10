// This file is used to register the service worker for PWA functionality
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname === '127.0.0.1'
);

// serviceWorker.js (or service-worker.js)
import { precacheAndRoute } from 'workbox-precaching';
// Optional: Add custom runtime caching for additional resources
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';





const CACHE_NAME = 'poperl-cache-v1';
const urlsToCache = [
  { url: '/', revision: '1234567890' }, // Replace with the actual revision (e.g., hash or timestamp)
  { url: '/index.html', revision: '1234567890' },
  { url: '/styles/after-login/general.css', revision: 'abcd1234' }
  // { url: '/styles/before-login/form.css', revision: 'efgh5678' },
  // { url: '/styles/private/private.css', revision: 'ijkl9012' },
  // { url: '/192.png', revision: 'mnop3456' },
  // { url: '/512.png', revision: 'qrst7890' },
  // { url: '/favicon.ico', revision: 'uvwxyz1234' },
  // { url: '/offline.html', revision: 'abcdef1234' }, // Ensure you add this file to be cached for offline fallback
  // { url: '/assests/328039808_553574763481911_1410511776054264885_n.jpg', revision: 'a1b2c3d4' },
  // { url: '/assests/avatar.avif', revision: 'd5e6f7g8' },
  // { url: '/assests/logo-white.svg', revision: 'h9i0j1k2' },
  // { url: '/assests/logo.svg', revision: 'l3m4n5o6' },
];


// Workbox will automatically precache the assets listed in the self.__WB_MANIFEST
precacheAndRoute(urlsToCache);

registerRoute(
  ({ request }) => request.destination === 'image', // Cache images at runtime
  new CacheFirst({
    cacheName: 'images',
    plugins: [],
  })
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

registerRoute(
  ({ request }) => request.mode === 'navigate', // Handle navigation requests
  async ({ event }) => {
    try {
      // Attempt to fetch the requested page
      const response = await new NetworkOnly().handle({ event });
      console.log('onlien')
      return response;
    } catch (error) {
      // If offline, serve the offline.html file
      console.log('Offline: Serving offline.html');
      return caches.match('/offline.html');
    }
  }
);



export function register() {
  if (import.meta.env.VITE_NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(import.meta.env.VITE_PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }
    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
      } else {
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('Error registering service worker:', error);
    });
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl)
    .then((response) => {
      if (response.status === 404 || response.headers.get('content-type')?.indexOf('javascript') === -1) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister();
        });
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}
