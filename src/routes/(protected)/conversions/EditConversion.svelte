<script lang="ts">
  import { enhance } from '$app/forms';
  import IngredientUnitSelect from '$lib/components/IngredientUnitSelect.svelte';
  import type { UpdateConversionSchema } from '$lib/schemas';
  import type { Conversion } from '$lib/server/db/schema/recipe';
  import { createEventDispatcher } from 'svelte';
  import type { SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: SuperValidated<UpdateConversionSchema>;
  export let initialData: (Conversion & { previousTo: string }) | null;

  const { form } = superForm(data, {
    onUpdate() {
      dispatch('submitted');
    },
  });

  form.update((value) => initialData || value, { taint: false });

  const dispatch = createEventDispatcher<{ cancel: null; submitted: null }>();
</script>

<form
  class="flex flex-col lg:flex-row justify-between gap-2"
  method="post"
  action="?/update"
  use:enhance>
  <input class="hidden" name="ingredientId" bind:value={$form.ingredientId} />
  <input class="hidden" name="previousTo" bind:value={$form.previousTo} />
  <div class="input-group input-group-divider grid-cols-[1fr_1fr]">
    <IngredientUnitSelect name="to" bind:value={$form.to} />
    <input type="number" step="any" name="scale" bind:value={$form.scale} />
  </div>
  <div class="flex space-x-1">
    <button class="btn variant-filled-warning">Update</button>
    <button class="btn variant-filled-error" type="button" on:click={() => dispatch('cancel')}
      >Cancel</button>
  </div>
</form>
