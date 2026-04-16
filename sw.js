/* ═══════════════════════════════════════════════════════════════════
 * EnerTchad Groupe — Service Worker v1.0.0
 * ═══════════════════════════════════════════════════════════════════ */

const SW_VERSION = 'enertchad-groupe-v1.0.0';
const CACHE_STATIC = SW_VERSION + '-static';
const CACHE_IMMUTABLE = SW_VERSION + '-immutable';
const CACHE_RUNTIME = SW_VERSION + '-runtime';

const PRECACHE = [
  '/',
  '/index.html',
  '/logo.svg',
  '/manifest.json',
  '/offline.html'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_STATIC).then(function(c){
      return c.addAll(PRECACHE).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k.indexOf(SW_VERSION) !== 0; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if(url.origin !== self.location.origin) return;

  if(/\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?|css|js)$/i.test(url.pathname)){
    e.respondWith(staleWhileRevalidate(e.request, CACHE_STATIC));
    return;
  }

  e.respondWith(networkFirst(e.request, CACHE_RUNTIME));
});

function staleWhileRevalidate(req, cacheName){
  return caches.match(req).then(function(cached){
    var fetchPromise = fetch(req).then(function(resp){
      if(resp && resp.ok){
        var clone = resp.clone();
        caches.open(cacheName).then(function(c){ c.put(req, clone); });
      }
      return resp;
    }).catch(function(){ return cached; });
    return cached || fetchPromise;
  });
}

function networkFirst(req, cacheName){
  return fetch(req).then(function(resp){
    if(resp && resp.ok){
      var clone = resp.clone();
      caches.open(cacheName).then(function(c){ c.put(req, clone); });
    }
    return resp;
  }).catch(function(){
    return caches.match(req).then(function(cached){
      return cached || caches.match('/offline.html') || caches.match('/');
    });
  });
}

self.addEventListener('message', function(e){
  if(e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
