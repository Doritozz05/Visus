/**
 * Service Worker for Visus - Advanced speed reading.
 * Provides offline support and intelligent caching strategy.
 */

const CACHE_NAME = "visus-cache-v4"; // Increment version to bust old cache
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// 1. Install Phase: Cache core assets atomically
self.addEventListener("install", (event) => {
  // Opt out of Chromium ServiceWorkerAutoPreload bug (https://crbug.com/466790291)
  if (event.addRoutes) {
    event.addRoutes({
      condition: { urlPattern: new URLPattern({}) },
      source: "fetch-event",
    });
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activation Phase: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Phase: Intelligent Strategies
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Strategy A: Cache-first for HTML/Navigation
  // Serve from cache immediately, background-update on each navigation.
  // Prevents blank screen on cold start (Chromium bug #466790291).
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        }).catch(() => cachedResponse || caches.match("/"));

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy B: Stale-While-Revalidate for other assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && url.origin === self.location.origin) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
