// This file is used to register the service worker for PWA functionality
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname === '127.0.0.1'
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
  