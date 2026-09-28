// Gedeelde, reactieve PWA-status (Svelte 5 runes in een .svelte.js-bestand).
export const pwa = $state({
  online: navigator.onLine,
  standalone: window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
  installPrompt: null, // het bewaarde beforeinstallprompt-event
  swStatus: 'Wordt geregistreerd…',
  waitingWorker: null, // nieuwe service worker die klaarstaat
});

// Online / offline
window.addEventListener('online', () => (pwa.online = true));
window.addEventListener('offline', () => (pwa.online = false));

// Installeren (Chromium-browsers). We houden de standaard-melding tegen en tonen een eigen knop.
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  pwa.installPrompt = event;
});
window.addEventListener('appinstalled', () => {
  pwa.installPrompt = null;
  pwa.standalone = true;
});

export async function install() {
  if (!pwa.installPrompt) return;
  pwa.installPrompt.prompt();
  await pwa.installPrompt.userChoice;
  pwa.installPrompt = null; // het event kan maar één keer gebruikt worden
}

// Service worker registreren
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    pwa.swStatus = 'Niet ondersteund door deze browser';
    return;
  }
  if (!import.meta.env.PROD) {
    // In dev-modus zou caching Vite's hot reload in de weg zitten
    pwa.swStatus = 'Uit in dev-modus — gebruik "npm run build && npm run preview"';
    return;
  }

  const hadController = !!navigator.serviceWorker.controller;
  const registration = await navigator.serviceWorker.register('/sw.js');
  pwa.swStatus = registration.active ? 'Actief — app werkt offline' : 'Installeren…';

  // Er stond al een nieuwe versie klaar van een eerder bezoek
  if (registration.waiting && hadController) pwa.waitingWorker = registration.waiting;

  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && hadController) pwa.waitingWorker = worker;
      if (worker.state === 'activated') pwa.swStatus = 'Actief — app werkt offline';
    });
  });

  // Nieuwe service worker heeft het overgenomen → herladen voor de nieuwe versie
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) window.location.reload();
  });
}

export function applyUpdate() {
  pwa.waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
}

// Notificaties
export async function showNotification(title, body) {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission;

  const options = { body, icon: '/icons/icon-192.png', badge: '/icons/icon-192.png' };
  const registration = await navigator.serviceWorker?.getRegistration();
  if (registration?.active) {
    // Via de service worker: werkt ook op mobiel en als de app op de achtergrond staat
    await registration.showNotification(title, options);
  } else {
    new Notification(title, options);
  }
  return permission;
}

// Cache-inhoud opvragen (om te laten zien wat offline beschikbaar is)
export async function listCaches() {
  const result = [];
  for (const name of await caches.keys()) {
    const cache = await caches.open(name);
    const requests = await cache.keys();
    result.push({ name, urls: requests.map((r) => new URL(r.url).pathname) });
  }
  return result;
}
