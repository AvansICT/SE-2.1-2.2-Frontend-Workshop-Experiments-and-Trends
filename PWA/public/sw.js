// Service worker: draait los van de pagina en onderschept netwerkverzoeken.
// Verhoog CACHE_VERSION bij een nieuwe release, zodat oude caches worden opgeruimd.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `pwa-demo-${CACHE_VERSION}`;

// De "app shell": alles wat nodig is om de app zonder netwerk te starten.
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// 1. INSTALL — app shell vooraf in de cache zetten (precaching)
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_SHELL);

      // Vite geeft gebouwde JS/CSS een hash in de bestandsnaam (bv. index-a1b2c3.js).
      // Die namen lezen we uit de zojuist gecachete index.html.
      const html = await (await cache.match('/')).text();
      const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
      await cache.addAll(assets);
    })()
  );
  // Geen skipWaiting() hier: een nieuwe versie wacht tot de gebruiker op "Bijwerken" klikt.
});

// 2. ACTIVATE — oude caches opruimen en direct de controle over open tabs nemen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

// 3. FETCH — bepalen waar een antwoord vandaan komt
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Pagina's: network-first, zodat je altijd de nieuwste HTML krijgt als je online bent
    event.respondWith(fetch(request).catch(() => caches.match('/')));
    return;
  }

  // Overige bestanden: cache-first, anders ophalen van het netwerk en bewaren
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    })()
  );
});

// Bericht vanuit de pagina: wachtende versie direct activeren
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

// Klik op een notificatie: bestaand venster focussen of een nieuw openen
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      if (windows.length > 0) return windows[0].focus();
      return self.clients.openWindow('/');
    })()
  );
});
