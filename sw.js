// Service Worker for Maktabah Maftoohah Korpus Al-Quran
const CACHE_NAME = 'korpus-quran-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/grammar.js',
  './js/store.js',
  './js/i18n.js',
  './manifest.webmanifest',
  './data/surahs.json',
  './data/roots-index.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Stale-while-revalidate for local data
  if (url.origin === location.origin) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(e.request);
        const fetchPromise = fetch(e.request).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            cache.put(e.request, networkRes.clone());
          }
          return networkRes;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
