const CACHE_NAME = 'quickcheck-uk-v6';
const BASE = '/QuickCheck-UK/';
const APP_SHELL = [
  BASE,
  BASE + 'index.html',
  BASE + 'calculator-directory.html',
  BASE + 'standard-calculator.html',
  BASE + 'budget-planner.html',
  BASE + 'money-profile.html',
  BASE + 'feedback.html',
  BASE + 'support.html',
  BASE + 'assets/styles.css?v=10',
  BASE + 'assets/pro-app.css?v=5',
  BASE + 'assets/app-mode.css?v=2',
  BASE + 'assets/pwa.js?v=5',
  BASE + 'assets/home-routes.js?v=2',
  BASE + 'assets/profile-core.js?v=2',
  BASE + 'assets/smart-money.css?v=3',
  BASE + 'assets/smart-money.js?v=2',
  BASE + 'assets/saved-calcs.js?v=1',
  BASE + 'assets/recent-tools.js?v=1',
  BASE + 'assets/privacy-mode.css?v=1',
  BASE + 'assets/privacy-mode.js?v=1',
  BASE + 'assets/smart-results.css?v=1',
  BASE + 'assets/smart-results.js?v=1',
  BASE + 'assets/onboarding.css?v=1',
  BASE + 'assets/onboarding.js?v=1',
  BASE + 'assets/ads.css?v=1',
  BASE + 'assets/ads.js?v=1',
  BASE + 'assets/icon.svg',
  BASE + 'site.webmanifest',
  BASE + 'version.json'
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
  if (request.url.includes('pagead2.googlesyndication.com')) return;
  if (request.url.includes('/version.json') || request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => null);
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match(BASE + 'index.html'))));
    return;
  }
  event.respondWith(
    caches.match(request).then(cached => {
      const fresh = fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => null);
        return response;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(BASE));
});
