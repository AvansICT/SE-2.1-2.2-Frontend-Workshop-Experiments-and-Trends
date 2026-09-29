<script>
  import { pwa, install, applyUpdate, showNotification } from './lib/pwa.svelte.js';
  import Notes from './lib/Notes.svelte';
  import CacheViewer from './lib/CacheViewer.svelte';

  const notificationsSupported = 'Notification' in window;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let notificationResult = $state('');

  async function notify() {
    try {
      const permission = await showNotification('Hallo vanuit de PWA!', 'Deze melding komt via de Notification API.');
      notificationResult =
        permission === 'granted'
          ? 'Melding verstuurd. Niets te zien? Controleer de meldingsinstellingen van je besturingssysteem.'
          : permission === 'denied'
            ? 'Toestemming geweigerd. Sta meldingen toe via het slotje in de adresbalk.'
            : `Toestemming: ${permission}`;
    } catch (error) {
      notificationResult = `Fout: ${error.message}`;
    }
  }
</script>

{#if pwa.waitingWorker}
  <div class="banner">
    Er is een nieuwe versie beschikbaar.
    <button onclick={applyUpdate}>Bijwerken</button>
  </div>
{/if}

<header>
  <h1>Svelte PWA Demo</h1>
  <span class="pill" class:offline={!pwa.online}>{pwa.online ? 'Online' : 'Offline'}</span>
</header>

<main>
  <section>
    <h2>1. Status</h2>
    <dl>
      <dt>Netwerk</dt>
      <dd>{pwa.online ? 'Verbonden' : 'Geen verbinding — de app draait vanuit de cache'}</dd>
      <dt>Service worker</dt>
      <dd>{pwa.swStatus}</dd>
      <dt>Weergave</dt>
      <dd>{pwa.standalone ? 'Geïnstalleerde app (standalone)' : 'In de browser'}</dd>
    </dl>
  </section>

  <section>
    <h2>2. Installeren</h2>
    <p>Dankzij het <code>manifest.webmanifest</code> kun je deze site als app op je apparaat zetten.</p>
    {#if pwa.standalone}
      <p class="ok">De app is geïnstalleerd en draait standalone.</p>
    {:else if pwa.installPrompt}
      <button onclick={install}>App installeren</button>
    {:else if isIos}
      <p class="hint">Op iPhone/iPad: tik op <strong>Deel</strong> en kies <strong>Zet op beginscherm</strong>.</p>
    {:else}
      <p class="hint">
        Geen installatieknop? Gebruik het installatie-icoon in de adresbalk, of de app is al geïnstalleerd.
      </p>
    {/if}
  </section>

  <section>
    <h2>3. Offline data</h2>
    <p>Notities worden in <code>localStorage</code> bewaard en werken dus ook zonder internet.</p>
    <Notes />
  </section>

  <section>
    <h2>4. Notificaties</h2>
    {#if notificationsSupported}
      <button onclick={notify}>Stuur testmelding</button>
      {#if notificationResult}<p class="hint">{notificationResult}</p>{/if}
    {:else}
      <p class="hint">Deze browser ondersteunt geen notificaties (op iOS pas na installeren).</p>
    {/if}
  </section>

  <section>
    <h2>5. Cache</h2>
    <p>Dit zijn de bestanden die de service worker heeft opgeslagen voor offline gebruik.</p>
    <CacheViewer />
  </section>
</main>

<footer>
  Test offline: DevTools → Network → <em>Offline</em>, en herlaad de pagina.
</footer>
