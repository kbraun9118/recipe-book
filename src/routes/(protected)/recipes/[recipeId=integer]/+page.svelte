<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  function formatInstructions(instructions: string): string {
    instructions.str
  }
</script>

<div class="text-left">
  <h1 class="h1">{data.recipe.name}</h1>
  <div><p>{data.recipe.description}</p></div>
  <div>
    {#if data.recipe.notes}
      <h2 class="h2">Notes</h2>
      <p>{data.recipe.notes}</p>
    {/if}
  </div>
  <div>
    <h2 class="h2">Ingredients</h2>
    <ul>
      {#each data.recipe.recipeIngredients as ingredient (ingredient.ingredientId)}
        <li>{ingredient.amount} {ingredient.ingredient.unit} {ingredient.ingredient.name}</li>
      {/each}
    </ul>
  </div>
  <div>
    <h2 class="h2">Instructions</h2>
    <ol bind:innerHTML={formatInstructions(data.recipe)}/>
  </div>
</div>
