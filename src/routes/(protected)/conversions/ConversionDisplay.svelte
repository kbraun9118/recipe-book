<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Conversion } from '$lib/server/db/schema/recipe';
    import { createEventDispatcher } from 'svelte';

  export let conversion: Conversion;
  export let edit: boolean;

  const dispatch = createEventDispatcher<{ edited: void }>();
</script>

<form class="flex justify-between gap-2" method="post" use:enhance>
  <input class="hidden" name="ingredientId" bind:value={conversion.ingredientId} />
  <input class="hidden" name="to" bind:value={conversion.to} />
  <span class="first-letter:capitalize basis-1/2 py-2">{conversion.to} at {conversion.scale}</span>
  <div class="space-x-1">
    {#if !edit}
      <button
        class="btn variant-filled-warning py-2"
        type="button"
        on:click={() => dispatch('edited')}>Edit</button>
      <button class=" btn variant-filled-error py-2" formaction="?/delete">Delete</button>
    {/if}
  </div>
</form>
