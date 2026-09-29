# Svelte PWA Demo

Een minimale Svelte 5 + Vite-app die de basisfunctionaliteit van een Progressive Web App laat zien. De service worker is met de hand geschreven (geen plugin), zodat je precies ziet wat er gebeurt.

## Starten

```bash
npm install
npm run dev                       # ontwikkelen (service worker staat UIT)
npm run build && npm run preview  # productie-build testen (service worker AAN)
```

De service worker staat alleen aan in de productie-build, omdat caching anders Vite's hot reload in de weg zit. Open de preview-URL (standaard http://localhost:4173).

## Wat zit erin

| PWA-onderdeel | Bestand | Wat het doet |
| --- | --- | --- |
| Web App Manifest | `public/manifest.webmanifest` | Naam, iconen, kleuren, `display: standalone` maakt de app installeerbaar |
| Service worker | `public/sw.js` | Precachet de app shell (install), ruimt oude caches op (activate), serveert uit de cache (fetch) |
| Registratie & status | `src/lib/pwa.svelte.js` | Registreert de SW, houdt online/offline, installatie en updates bij |
| Installatieknop | `src/App.svelte` | Vangt `beforeinstallprompt` op en toont een eigen knop (iOS: uitleg) |
| Update-melding | `src/App.svelte` | Toont een banner als er een nieuwe SW klaarstaat |
| Offline data | `src/lib/Notes.svelte` | Notities in `localStorage` |
| Notificaties | `src/lib/pwa.svelte.js` | `registration.showNotification()` via de SW |
| Cache bekijken | `src/lib/CacheViewer.svelte` | Laat zien welke bestanden offline beschikbaar zijn |
| Iconen | `scripts/generate-icons.js` | Genereert de PNG-iconen (`npm run icons`) |

## Cachingstrategieën

- **Pagina's (navigatie):** network-first — online altijd de nieuwste HTML, offline de gecachete versie.
- **Overige bestanden:** cache-first — snel, en na de eerste keer ook offline beschikbaar.

## Testen

1. `npm run build && npm run preview` en open de pagina in Chrome.
2. DevTools → **Application**: bekijk *Manifest*, *Service workers* en *Cache storage*.
3. DevTools → **Network** → zet op *Offline* en herlaad: de app blijft werken.
4. Update testen: verander `CACHE_VERSION` in `public/sw.js`, bouw opnieuw en herlaad → de banner "nieuwe versie" verschijnt.
5. Lighthouse → categorie *PWA* / installability-check.

PWA's vereisen HTTPS; `localhost` is een uitzondering. Wil je op je telefoon testen, zet de site dan op een HTTPS-host (bijv. Netlify, Vercel of GitHub Pages).
