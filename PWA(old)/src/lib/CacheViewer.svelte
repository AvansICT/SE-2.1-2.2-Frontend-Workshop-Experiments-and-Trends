<script>
  import { listCaches } from './pwa.svelte.js';

  let cachesList = $state(null);

  async function refresh() {
    cachesList = await listCaches();
  }
</script>

<button onclick={refresh}>Cache bekijken</button>

{#if cachesList}
  {#if cachesList.length === 0}
    <p class="hint">Nog niets gecachet. Draai de productie-build om de service worker te activeren.</p>
  {/if}
  {#each cachesList as cache (cache.name)}
    <h3>{cache.name} <small>({cache.urls.length} bestanden)</small></h3>
    <ul>
      {#each cache.urls as url (url)}
        <li><code>{url}</code></li>
      {/each}
    </ul>
  {/each}
{/if}

<style>
  h3 {
    font-size: 1rem;
    margin: 1rem 0 0.25rem;
  }
  ul {
    margin: 0;
    padding-left: 1.25rem;
    font-size: 0.9rem;
    overflow-wrap: anywhere;
  }
</style>
