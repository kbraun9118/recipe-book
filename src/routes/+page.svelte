<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;

  let time = new Date().toISOString();

  const interval = setInterval(() => (time = new Date().toISOString()), 100);
  onDestroy(() => {
    clearInterval(interval);
  });

  $: time = time.substring(0, 19);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>Current time is {time}</p>
<a href="/login">Login</a>

<ul>
  {#each data.todos as todo (todo.id)}
    <li>{todo.name}</li>
  {/each}
</ul>
