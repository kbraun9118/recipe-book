<script lang="ts">
  import { enhance } from '$app/forms';
  import ErrorText from '$lib/components/ErrorText.svelte';
  import IngredientUnitSelect from '$lib/components/IngredientUnitSelect.svelte';
  import type { UpdateConversionSchema } from '$lib/schemas';
  import type { Conversion } from '$lib/server/db/schema/recipe';
  import { createEventDispatcher } from 'svelte';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms/client';

  interface Props {
    data: SuperValidated<Infer<UpdateConversionSchema>>;
    initialData: (Conversion & { previousTo: string }) | null;
  }

  let { data, initialData }: Props = $props();

  const { form, errors } = superForm(data, {
    onUpdate({ form }) {
      if (form.valid) {
        dispatch('submitted');
      }
    },
  });

  form.update((value) => initialData || value, { taint: false });

  const dispatch = createEventDispatcher<{ cancel: null; submitted: null }>();
</script>

<form method="post" action="?/update" use:enhance>
  <div class="flex flex-col lg:flex-row justify-between gap-2">
    <input class="hidden" name="ingredientId" bind:value={$form.ingredientId} />
    <input class="hidden" name="previousTo" bind:value={$form.previousTo} />
    <div class="input-group input-group-divider grid-cols-[1fr_1fr]">
      <IngredientUnitSelect
        class={$errors.ingredientId ? 'input-error' : ''}
        name="to"
        bind:value={$form.to} />
      <input
        type="number"
        step="any"
        class:input-error={$errors.scale}
        name="scale"
        bind:value={$form.scale} />
    </div>
    <div class="flex space-x-1">
      <button class="btn variant-filled-warning">Update</button>
      <button
        class="btn variant-filled-error"
        type="button"
        onclick={() => {
          errors.clear();
          dispatch('cancel');
        }}>Cancel</button>
    </div>
  </div>
  <ErrorText fieldName="ingredient name" text={$errors.ingredientId} />
  <ErrorText fieldName="scale" text={$errors.scale} />
</form>
