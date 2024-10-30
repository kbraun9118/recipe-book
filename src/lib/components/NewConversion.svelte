<script lang="ts">
  import ErrorText from '$lib/components/ErrorText.svelte';
  import IngredientUnitSelect from '$lib/components/IngredientUnitSelect.svelte';
  import type { insertConversionsSchema } from '$lib/server/db/schema/recipe';
  import { Autocomplete, popup, type AutocompleteOption } from '@skeletonlabs/skeleton';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms/client';

  interface Props {
    data: SuperValidated<Infer<typeof insertConversionsSchema>>;
    ingredients: {
      id: number;
      name: string;
      unit: string;
    }[];
  }

  let { data, ingredients }: Props = $props();

  let create = $state(false);

  const { form, errors, reset, enhance } = superForm(data, {
    onUpdated(event) {
      if (event.form.valid) {
        recipeName = '';
        reset({ data: { ingredientId: 0, scale: undefined, to: 'grams' } });
        create = false;
      }
    },
  });

  let recipeName = $state('');
  let recipeOptions: AutocompleteOption[] = ingredients.map((i) => {
    const value = `${i.name[0].toUpperCase() + i.name.slice(1)} (${
      i.unit[0].toUpperCase() + i.unit.slice(1)
    })`;
    return {
      value,
      label: value,
    };
  });

  function onRecipeNameselected(event: CustomEvent<AutocompleteOption>): void {
    const value = event.detail.value as string;
    recipeName = value;
    const [name, unit] = value
      .toLowerCase()
      .slice(0, value.length - 1)
      .split(' (');
    form.update((f) => {
      const updated = {
        ...f,
        ingredientId: ingredients.find((i) => i.name === name && i.unit === unit)?.id,
      };

      return updated;
    });
  }
</script>

<div>
  {#if create}
    <div>
      <form class="space-y-4 lg:w-fit" method="post" action="?/create" use:enhance>
        <div class="flex flex-col lg:flex-row gap-2">
          <input class="hidden" name="ingredientId" bind:value={$form.ingredientId} />
          <label class="label"
            >Ingredient Name
            <input
              autocomplete="off"
              class="input autocomplete"
              class:input-error={$errors.ingredientId}
              type="search"
              name="autocomplete-search"
              bind:value={recipeName}
              use:popup={{
                event: 'focus-click',
                target: 'popupAutocomplete',
                placement: 'bottom',
              }} />
            <div
              class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
              tabindex="-1"
              data-popup="popupAutocomplete">
              <Autocomplete
                bind:input={recipeName}
                options={recipeOptions}
                on:selection={onRecipeNameselected} />
            </div>
          </label>
          <label class="label">
            Unit
            <IngredientUnitSelect name="to" bind:value={$form.to} />
          </label>
          <label
            >Scale<input
              class="input"
              class:input-error={$errors.scale}
              name="scale"
              bind:value={$form.scale} /></label>
        </div>
        <ErrorText fieldName="ingredient name" text={$errors.ingredientId} />
        <ErrorText fieldName="scale" text={$errors.scale} />
        <button class="btn variant-filled-primary">Create</button>
        <button
          class="btn variant-filled-error"
          type="button"
          onclick={() => {
            create = false;
          }}>Cancel</button>
      </form>
    </div>
  {:else}
    <button class="btn variant-filled-secondary" onclick={() => (create = true)}>Create</button>
  {/if}
</div>
