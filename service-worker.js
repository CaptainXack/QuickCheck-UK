const CACHE_NAME = 'quickcheck-uk-v43';
const BASE = '/QuickCheck-UK/';
const APP_SHELL = [
  BASE,
  BASE + 'index.html',
  BASE + 'app.html',
  BASE + 'app-v2.html',
  BASE + 'app-v3.html',
  BASE + 'app-orbit-carousel.html',
  BASE + 'guides.html',
  BASE + 'calculator-directory.html',
  BASE + 'standard-calculator.html',
  BASE + 'budget-planner.html',
  BASE + 'money-profile.html',
  BASE + 'insights.html',
  BASE + 'bill-calendar.html',
  BASE + 'data-manager.html',
  BASE + 'subscription-cost-calculator.html',
  BASE + 'feedback.html',
  BASE + 'support.html',
  BASE + 'guides/how-to-budget-when-paid-weekly.html',
  BASE + 'guides/how-to-budget-when-paid-monthly.html',
  BASE + 'guides/track-bills-before-payday.html',
  BASE + 'guides/money-left-after-bills.html',
  BASE + 'guides/save-weekly-from-monthly-income.html',
  BASE + 'guides/reduce-subscription-costs.html',
  BASE + 'assets/styles.css?v=11',
  BASE + 'assets/orbit-brand.css?v=1',
  BASE + 'assets/orbit-global.css?v=2',
  BASE + 'assets/orbit-global.js?v=1',
  BASE + 'assets/pro-app.css?v=5',
  BASE + 'assets/fresh-ui.css?v=1',
  BASE + 'assets/fresh-ui.js?v=1',
  BASE + 'assets/app-v2.css?v=1',
  BASE + 'assets/app-v2.js?v=1',
  BASE + 'assets/app-v3.css?v=6',
  BASE + 'assets/app-v3-ads.css?v=1',
  BASE + 'assets/app-v3-fit.css?v=1',
  BASE + 'assets/app-v3-motion.css?v=1',
  BASE + 'assets/app-v3-carousel.css?v=1',
  BASE + 'assets/orbit-carousel.css?v=1',
  BASE + 'assets/orbit-carousel-smooth.css?v=1',
  BASE + 'assets/orbit-carousel.js?v=1',
  BASE + 'assets/orbit-app-shell.css?v=1',
  BASE + 'assets/orbit-app-shell.js?v=1',
  BASE + 'assets/app-mode.css?v=2',
  BASE + 'assets/pwa.js?v=23',
  BASE + 'assets/app.js?v=8',
  BASE + 'assets/enhance.js?v=8',
  BASE + 'assets/home-routes.js?v=3',
  BASE + 'assets/home-dashboard.css?v=3',
  BASE + 'assets/home-dashboard.js?v=5',
  BASE + 'assets/money-shelves.js?v=4',
  BASE + 'assets/profile-core.js?v=3',
  BASE + 'assets/profile-shelves.js?v=1',
  BASE + 'assets/profile-tracker-sync.js?v=1',
  BASE + 'assets/subscription-smart.js?v=2',
  BASE + 'assets/smart-money.css?v=8',
  BASE + 'assets/smart-money.js?v=3',
  BASE + 'assets/saved-calcs.js?v=1',
  BASE + 'assets/recent-tools.js?v=1',
  BASE + 'assets/privacy-mode.css?v=1',
  BASE + 'assets/privacy-mode.js?v=1',
  BASE + 'assets/smart-results.css?v=1',
  BASE + 'assets/smart-results.js?v=1',
  BASE + 'assets/onboarding.css?v=1',
  BASE + 'assets/onboarding.js?v=1',
  BASE + 'assets/bill-calendar.css?v=2',
  BASE + 'assets/bill-calendar.js?v=4',
  BASE + 'assets/data-manager.css?v=1',
  BASE + 'assets/data-manager.js?v=2',
  BASE + 'assets/insights.css?v=1',
  BASE + 'assets/insights.js?v=1',
  BASE + 'assets/ads.css?v=2',
  BASE + 'assets/ads.js?v=2',
  BASE + 'assets/ad-layout.js?v=1',
  BASE + 'assets/seo-schema.js?v=1',
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
