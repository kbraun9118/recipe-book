<script lang="ts">
  import type { Conversion } from '$lib/server/db/schema/recipe';
  import type { PageData } from './$types';
  import ConversionDisplay from '$lib/components/ConversionDisplay.svelte';
  import EditConversion from '$lib/components/EditConversion.svelte';
  import NewConversion from '$lib/components/NewConversion.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let ingredientConversions = $derived(
    data.conversions.reduce<{ [key: number]: typeof data.conversions }>((acc, item) => {
      if (acc[item.ingredientId]) {
        acc[item.ingredientId].push(item);
      } else {
        acc[item.ingredientId] = [item];
      }

      return acc;
    }, {}),
  );

  let edit: string | null = $state('');
  let editValue: (Conversion & { previousTo: string }) | null = $state(null);

  function enableEdit(ingredientId: number, to: string) {
    edit = ingredientId + to;
    const conversion = data.conversions.find(
      (conversion) => conversion.ingredientId === ingredientId && conversion.to === to,
    );

    if (conversion) {
      editValue = {
        ingredientId: conversion.ingredientId,
        scale: conversion.scale,
        to: conversion.to,
        previousTo: conversion.to,
      };
    }
  }
</script>

<div class="space-y-2">
  <h1 class="h1">Conversions</h1>
  <NewConversion data={data.createForm} ingredients={data.ingredients} />
  <div>
    <ul class="space-y-2 lg:max-w-md">
      {#each Object.keys(ingredientConversions) as key}
        {@const conversions = ingredientConversions[+key]}
        {@const ingredient = conversions[0].ingredient}
        <h2 class="h2 first-letter:capitalize">
          {ingredient.name} in {ingredient.unit}
        </h2>
        {#each conversions as conversion (conversion.ingredientId + conversion.to)}
          {@const conversionId = conversion.ingredientId + conversion.to}
          <li class="card p-2">
            {#if conversionId === edit}
              <EditConversion
                data={data.updateForm}
                initialData={editValue}
                on:cancel={() => (edit = null)}
                on:submitted={() => (edit = null)} />
            {:else}
              <ConversionDisplay
                {conversion}
                edit={!!edit}
                on:edited={() => enableEdit(conversion.ingredientId, conversion.to)} />
            {/if}
          </li>
        {/each}
      {/each}
    </ul>
  </div>
</div>
