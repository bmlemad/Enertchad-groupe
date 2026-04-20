/**
 * EnerTchad Groupe — Service Worker v3.0
 * Production-ready with cache-first for static assets, network-first for HTML
 * Offline fallback support with offline.html
 */

const CACHE_NAME = 'enertchad-groupe-v3';
const OFFLINE_URL = '/offline.html';

// Critical static assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/404.html',
  '/css/style.min.css',
  '/css/main.v1.css',
  '/css/amont.v1.css',
  '/css/premium.css',
  '/css/shared-hero-a.css',
  '/css/shared-hero-b.css',
  '/js/app.min.js',
  '/js/chad-map.js',
  '/js/premium.js',
  '/logo-enertchad.svg',
  '/favicon.svg',
  '/manifest.json'
];

/**
 * Install event: pre-cache critical assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/**
 * Activate event: clean up old cache versions
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch event: implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  /**
   * HTML pages: network-first strategy
   * Always fetch fresh content, fall back to cache, then offline page
   */
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful page loads
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  /**
   * Static assets (CSS, JS, images, SVGs, fonts): cache-first strategy
   * Serve from cache first, fetch from network if not cached
   */
  if (
    url.pathname.startsWith('/css/') ||
    url.pathname.startsWith('/js/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.eot')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  /**
   * Other assets (PDFs, docs, etc): network-first with cache fallback
   */
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
