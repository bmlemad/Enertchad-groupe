/* EnerTchad Groupe — Service Worker
 * Stratégie : stale-while-revalidate pour HTML, cache-first pour /assets/*
 * Fallback offline sur offline.html
 */

const CACHE_VERSION = 'enertchad-v1.2.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Précache critique : shell + offline fallback
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/404.html',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/img/favicon-32.png',
  '/assets/img/apple-touch-icon.png',
  '/assets/img/og-cover.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => !key.startsWith(CACHE_VERSION)).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Only GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip cross-origin (Google Fonts etc.)
  if (url.origin !== self.location.origin) return;

  // Assets — cache-first (immutable with 1y cache anyway)
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const clone = res.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
        return res;
      }))
    );
    return;
  }

  // HTML — network-first with offline fallback
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
        return res;
      }).catch(() =>
        caches.match(req).then(cached => cached || caches.match('/offline.html'))
      )
    );
    return;
  }

  // Default : network-first
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
