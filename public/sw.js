/**
 * Service Worker for Visus - Advanced speed reading.
 * Provides offline support and intelligent caching strategy.
 */

const CACHE_NAME = "visus-cache-v5"; // Increment version to bust old cache
const ASSETS_TO_CACHE = [
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
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(
        ASSETS_TO_CACHE.map(async (url) => {
          try {
            const response = await fetch(url, { redirect: "follow" });
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn("[SW] Failed to cache asset:", url, err);
          }
        })
      );
    })()
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

  // Strategy A: Navigation — let browser handle natively
  // Don't intercept navigations. Browser follows middleware
  // redirects (/ → /library) correctly, avoiding ERR_FAILED.
  // Sub-resources (JS, CSS, images) are cached via Strategy B
  // for offline app shell support.
  if (event.request.mode === 'navigate') return;

  // Skip external origins — let browser handle them natively
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Strategy B: Stale-While-Revalidate for same-origin assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
