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

<h1>Welcome to Recipe Book</h1>
<p>Authorized</p>
