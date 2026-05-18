const CACHE_NAME = 'quickcheck-uk-v1';
const BASE = '/QuickCheck-UK/';
const APP_SHELL = [
  BASE,
  BASE + 'index.html',
  BASE + 'standard-calculator.html',
  BASE + 'budget-planner.html',
  BASE + 'assets/styles.css?v=8',
  BASE + 'assets/app.js?v=8',
  BASE + 'assets/enhance.js?v=8',
  BASE + 'assets/pwa.js?v=1',
  BASE + 'assets/icon.svg',
  BASE + 'site.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => null);
        return response;
      }).catch(() => caches.match(BASE + 'index.html'));
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(BASE));
});
