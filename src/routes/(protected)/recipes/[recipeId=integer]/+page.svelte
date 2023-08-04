<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';

  export let data: PageData;

  function formatInstructions(instructions: string): string {
    return instructions
      .split('*')
      .splice(1)
      .map((line) => `<li>${line}</li>`)
      .join('');
  }

  function formatAmount(amount: number): string {
    const whole = Math.floor(amount);
    const decimal = amount - whole;

    if (decimal === 0) {
      return whole.toString();
    }

    let fraction = '';

    switch (decimal) {
      case 0.25:
        fraction = '1/4';
        break;
      case 0.5:
        fraction = '1/2';
        break;
      case 0.75:
        fraction = '3/4';
        break;
      case 0.3:
        fraction = '1/3';
      case 0.6:
        fraction = '2/3';
    }

    return whole === 0 ? fraction : `${whole} ${fraction}`;
  }

  function formatUnit(ingredient: { amount: number; ingredient: { unit: string } }): string {
    if (ingredient.ingredient.unit === 'count') {
      return '';
    }

    return ingredient.amount === 1
      ? ingredient.ingredient.unit.slice(0, ingredient.ingredient.unit.length - 1)
      : ingredient.ingredient.unit;
  }
</script>

<div class="text-left space-y-2">
  <h1 class="h1">{data.recipe.name}</h1>
  <a class="anchor" href={data.recipe.url}>{data.recipe.url}</a>
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
        <li>
          <span>{formatAmount(ingredient.amount)}</span>
          <span>{formatUnit(ingredient)}</span>
          <span class="font-bold">{ingredient.ingredient.name}</span>
        </li>
      {/each}
    </ul>
  </div>
  <div>
    <h2 class="h2">Instructions</h2>
    <ol class="list-decimal">
      {@html formatInstructions(data.recipe.instructions)}
    </ol>
  </div>
  <div>
    <a class="btn variant-filled-warning" href={`${$page.url}/edit`}>Edit</a>
  </div>
</div>
