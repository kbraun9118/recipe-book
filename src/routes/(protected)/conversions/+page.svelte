<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

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
</script>

<div class="space-y-2">
  <h1 class="h1">Conversions</h1>
  <button class="btn variant-filled-secondary">Create</button>
  <div>
    <ul class="space-y-2">
      {#each Object.keys(ingredientConversions) as key}
        {@const conversions = ingredientConversions[+key]}
        {@const ingredient = conversions[0].ingredient}
        <h2 class="h2">
          {ingredient.name[0].toUpperCase() + ingredient.name.slice(1)} in {ingredient.unit}
        </h2>
        {#each conversions as conversion (conversion.ingredientId + conversion.to)}
          <li class="card">
            {conversion.to} at {conversion.scale}
            <div class="input-group input-group-divider grid-cols-[1fr_1fr]">
              <button class="variant-filled-warning">Edit</button>
              <button class="variant-filled-error">Delete</button>
            </div>
          </li>
        {/each}
      {/each}
    </ul>
  </div>
</div>
