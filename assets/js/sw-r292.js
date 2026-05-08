/* ============================================================
 R292 · Service Worker · cache strategy modernisée
 Wave R292 · 2026-05-05 · DG mandate PWA
 Strategy : stale-while-revalidate for assets · network-first for HTML
 ============================================================ */

const CACHE_NAME = 'enertchad-v292';
const PRECACHE = [
 '/',
 '/services/',
 '/amont/',
 '/intermediaire/',
 '/aval/',
 '/projets/',
 '/investisseurs/',
 '/manifest-r292.webmanifest',
 '/assets/css/enertchad.css?v=r272',
 '/assets/css/header-ultra.css?v=r272',
 '/assets/css/page-statement.css?v=r272',
 '/assets/css/responsive-images-r225.css?v=r272',
 '/assets/css/services-harmonized-r249.css?v=r272',
 '/assets/css/utilities-r278.css?v=r278',
 '/assets/css/theme-dark-r284.css?v=r284',
 '/assets/css/view-transitions-r287.css?v=r287',
 '/assets/css/container-queries-r288.css?v=r288',
 '/assets/images/logo.svg',
 '/assets/favicon.svg'
];

// Install · precache critical resources
self.addEventListener('install', function(event){
 self.skipWaiting();
 event.waitUntil(
  caches.open(CACHE_NAME).then(function(cache){
   return cache.addAll(PRECACHE).catch(function(){});
  })
 );
});

// Activate · cleanup old caches
self.addEventListener('activate', function(event){
 event.waitUntil(
  caches.keys().then(function(keys){
   return Promise.all(
    keys.map(function(k){
     if (k !== CACHE_NAME && k.indexOf('enertchad-') === 0) return caches.delete(k);
    })
   );
  }).then(function(){ return self.clients.claim(); })
 );
});

// Fetch · stale-while-revalidate for assets · network-first for HTML
self.addEventListener('fetch', function(event){
 var req = event.request;
 if (req.method !== 'GET') return;

 var url = new URL(req.url);
 if (url.origin !== self.location.origin) return; // skip cross-origin

 var isHTML = req.mode === 'navigate' || req.headers.get('accept').indexOf('text/html') !== -1;

 if (isHTML){
  // Network-first for HTML pages
  event.respondWith(
   fetch(req).then(function(res){
    var clone = res.clone();
    caches.open(CACHE_NAME).then(function(cache){ cache.put(req, clone); });
    return res;
   }).catch(function(){
    return caches.match(req).then(function(cached){
     return cached || caches.match('/');
    });
   })
  );
  return;
 }

 // Stale-while-revalidate for assets
 event.respondWith(
  caches.match(req).then(function(cached){
   var fetchPromise = fetch(req).then(function(res){
    if (res && res.status === 200){
     var clone = res.clone();
     caches.open(CACHE_NAME).then(function(cache){ cache.put(req, clone); });
    }
    return res;
   }).catch(function(){ return cached; });
   return cached || fetchPromise;
  })
 );
});
