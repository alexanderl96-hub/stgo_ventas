const CACHE_NAME = "ventas-express-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      ),
      self.clients.claim(),
    ])
  );
});

// FETCH
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Never cache API requests
  if (event.request.url.includes("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache only successful responses
        if (response.status === 200) {
          const clone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});