/**
 * Service Worker para Visus - Lectura Rápida Avanzada.
 * Proporciona soporte offline para archivos estáticos y gestión de caché de lectura.
 */

const CACHE_NAME = "visus-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use Promise.allSettled to prevent SW installation failure if an asset (like an icon) is missing (404)
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => 
          fetch(url).then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}`);
            }
            return cache.put(url, response);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Solo interceptar peticiones de nuestro origen y de tipo 'get'
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        
        // Cachear dinámicamente recursos del mismo origen
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, responseToCache);
          }
        });
        
        return networkResponse;
      }).catch(() => {
        // Fallback offline en caso de fallo de red
        return caches.match("/");
      });
    })
  );
});
