<script lang="ts">
  import { enhance } from '$app/forms';
  import IngredientUnitSelect from '$lib/components/IngredientUnitSelect.svelte';
  import ingredientUnits from '$lib/ingredient-units';
  import type { insertConversionsSchema } from '$lib/server/db/schema/recipe';
  import { popup, type AutocompleteOption, Autocomplete } from '@skeletonlabs/skeleton';
  import type { SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: SuperValidated<typeof insertConversionsSchema>;
  export let ingredients: {
    id: number;
    name: string;
    unit: string;
  }[];

  let create = false;

  const { form } = superForm(data, {
    onUpdate() {
      create = false;
    },
  });

  let recipeName: string = '';
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

      console.log(updated);

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
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            Unit
            <IngredientUnitSelect name="to" bind:value={$form.to} />
          </label>
          <label>Scale<input class="input" name="scale" bind:value={$form.scale} /></label>
        </div>
        <button class="btn variant-filled-primary">Create</button>
        <button class="btn variant-filled-error" type="button" on:click={() => (create = false)}
          >Cancel</button>
      </form>
    </div>
  {:else}
    <button class="btn variant-filled-secondary" on:click={() => (create = true)}>Create</button>
  {/if}
</div>
