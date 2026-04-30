/**
 * EnerTchad Groupe SA/CA · Service Worker v1.1
 * Enriched cache strategy : navigated pages auto-cached, offline fallback complet
 */
const VERSION = 'enertchad-v2.1.7-z';
const STATIC = [
  '/',
  '/assets/css/enertchad.css',
  '/assets/js/enertchad.js',
  '/assets/favicon.svg',
  '/assets/logo-enertchad.svg',
  '/offline.html',
  '/404.html',
];
const PAGE_CACHE = 'enertchad-pages-v2.1.7';
const ASSET_CACHE = 'enertchad-assets-v2.1.7';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(k => ![VERSION, PAGE_CACHE, ASSET_CACHE].includes(k))
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  
  const url = new URL(req.url);
  
  // Network-first for HTML pages — cache successful navigations
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => 
        caches.match(req).then(c => c || caches.match('/offline.html'))
      )
    );
    return;
  }
  
  // Stale-while-revalidate for assets
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(res => {
          if (res.ok) {
            caches.open(ASSET_CACHE).then(c => c.put(req, res.clone()));
          }
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }
  
  // Network-only for everything else (analytics, fonts CDN, etc.)
});

// Listen for skipWaiting message from page (forced refresh)
self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
