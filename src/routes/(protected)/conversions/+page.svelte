<script lang="ts">
  import { enhance } from '$app/forms';
  import ingredientUnits from '$lib/ingredient-units';
  import { Autocomplete, popup, type AutocompleteOption } from '@skeletonlabs/skeleton';
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';

  export let data: PageData;

  const { form: updateForm } = superForm(data.updateForm, {
    onUpdated() {
      edit = {};
    },
  });

  const { form: createForm } = superForm(data.createForm, {
    onUpdate() {
      create = false;
    },
  });

  $: ingredientConversions = data.conversions.reduce<{ [key: number]: typeof data.conversions }>(
    (acc, item) => {
      if (acc[item.ingredientId]) {
        acc[item.ingredientId].push(item);
      } else {
        acc[item.ingredientId] = [item];
      }

      return acc;
    },
    {}
  );

  let edit: { [key: string]: boolean } = {};
  let create = false;

  function enableEdit(ingredientId: number, to: string) {
    edit[ingredientId + to] = true;
    updateForm.update(
      (value) => {
        const conversion = data.conversions.find(
          (conversion) => conversion.ingredientId === ingredientId && conversion.to === to
        );

        if (conversion) {
          return {
            updateIngredientId: conversion.ingredientId,
            updateScale: conversion.scale,
            updateTo: conversion.to,
            previousTo: conversion.to,
          };
        }

        return value;
      },
      {
        taint: false,
      }
    );
  }

  let recipeName: string = '';
  let recipeOptions: AutocompleteOption[] = data.ingredients.map((i) => {
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
    createForm.update((f) => {
      const updated = {
        ...f,
        ingredientId: data.ingredients.find((i) => i.name === name && i.unit === unit)?.id,
      };

      console.log(updated);

      return updated;
    });
  }
</script>

<div class="space-y-2">
  <h1 class="h1">Conversions</h1>
  {#if create}
    <div>
      <form class="space-y-4 lg:w-fit" method="post" action="?/create" use:enhance>
        <div class="flex flex-col lg:flex-row gap-2">
          <input class="hidden" name="ingredientId" bind:value={$createForm.ingredientId} />
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
          <label class="label">
            Unit
            <select class="input" name="to" bind:value={$createForm.to}>
              {#each ingredientUnits as unit (unit)}
                <option value={unit}>{unit[0].toUpperCase() + unit.slice(1)}</option>
              {/each}
            </select></label>
          <label>Scale<input class="input" name="scale" bind:value={$createForm.scale} /></label>
        </div>
        <button class="btn variant-filled-primary">Create</button>
        <button class="btn variant-filled-error" type="button" on:click={() => (create = false)}
          >Cancel</button>
      </form>
    </div>
  {:else}
    <button class="btn variant-filled-secondary" on:click={() => (create = true)}>Create</button>
  {/if}
  <div>
    <ul class="space-y-2 lg:w-fit">
      {#each Object.keys(ingredientConversions) as key}
        {@const conversions = ingredientConversions[+key]}
        {@const ingredient = conversions[0].ingredient}
        <h2 class="h2 first-letter:capitalize">
          {ingredient.name} in {ingredient.unit}
        </h2>
        {#each conversions as conversion (conversion.ingredientId + conversion.to)}
          {@const conversionId = conversion.ingredientId + conversion.to}
          <li class="card p-2">
            {#if edit[conversionId]}
              <form
                class="flex flex-col lg:flex-row justify-between gap-2"
                method="post"
                action="?/update"
                use:enhance>
                <input
                  class="hidden"
                  name="updateIngredientId"
                  bind:value={$updateForm.updateIngredientId} />
                <input class="hidden" name="previousTo" bind:value={$updateForm.previousTo} />
                <div class="input-group input-group-divider grid-cols-[1fr_1fr]">
                  <select name="updateTo" bind:value={$updateForm.updateTo}>
                    {#each ingredientUnits as unit (unit)}
                      <option value={unit}>{unit[0].toUpperCase() + unit.slice(1)}</option>
                    {/each}
                  </select>
                  <input
                    type="number"
                    step="any"
                    name="updateScale"
                    bind:value={$updateForm.updateScale} />
                </div>
                <div class="flex space-x-1">
                  <button class="btn variant-filled-warning">Update</button>
                  <button
                    class="btn variant-filled-error"
                    type="button"
                    on:click={() => (edit = {})}>Cancel</button>
                </div>
              </form>
            {:else}
              <form class="flex justify-between gap-2" method="post" use:enhance>
                <input
                  class="hidden"
                  name="deleteIngredientId"
                  bind:value={conversion.ingredientId} />
                <input class="hidden" name="deleteTo" bind:value={conversion.to} />
                <span class="first-letter:capitalize basis-1/2 py-2"
                  >{conversion.to} at {conversion.scale}</span>
                <div class="space-x-1">
                  {#if Object.values(edit).every(e => !e)}
                    <button
                      class="btn variant-filled-warning py-2"
                      type="button"
                      on:click={() => enableEdit(conversion.ingredientId, conversion.to)}
                      >Edit</button>
                    <button class=" btn variant-filled-error py-2" formaction="?/delete"
                      >Delete</button>
                  {/if}
                </div>
              </form>
            {/if}
          </li>
        {/each}
      {/each}
    </ul>
  </div>
</div>
