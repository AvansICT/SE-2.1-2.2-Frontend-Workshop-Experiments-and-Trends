<script>
  const STORAGE_KEY = 'pwa-demo-notes';

  let notes = $state(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
  let text = $state('');

  // Elke wijziging direct opslaan
  $effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  });

  function add(event) {
    event.preventDefault();
    if (!text.trim()) return;
    notes.push({ id: crypto.randomUUID(), text: text.trim() });
    text = '';
  }

  function remove(id) {
    notes = notes.filter((note) => note.id !== id);
  }
</script>

<form onsubmit={add}>
  <input bind:value={text} placeholder="Nieuwe notitie…" aria-label="Nieuwe notitie" />
  <button type="submit">Toevoegen</button>
</form>

{#if notes.length}
  <ul>
    {#each notes as note (note.id)}
      <li>
        <span>{note.text}</span>
        <button class="link" onclick={() => remove(note.id)} aria-label="Verwijder notitie">✕</button>
      </li>
    {/each}
  </ul>
{:else}
  <p class="hint">Nog geen notities.</p>
{/if}

<style>
  form {
    display: flex;
    gap: 0.5rem;
  }
  input {
    flex: 1;
    min-width: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
  }
</style>
