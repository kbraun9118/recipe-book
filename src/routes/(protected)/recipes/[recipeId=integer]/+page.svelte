<script lang="ts">
  import { page } from '$app/stores';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  function formatInstructions(instructions: string): string {
    return instructions
      .split('*')
      .splice(1)
      .map(
        (line, i) =>
          `<li><span class="badge-icon p-2 my-1 variant-soft-primary self-start">${
            i + 1
          }</span><span>${line}</span></li>`,
      )
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
        break;
      case 0.6:
        fraction = '2/3';
        break;
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

  function popupHover(ingredientId: number): PopupSettings {
    return {
      event: 'hover',
      target: 'popupHover' + ingredientId,
      placement: 'right',
    };
  }
</script>

<div class="text-left space-y-2">
  <h1 class="h1">{data.recipe.name}</h1>
  <div class="space-x-2">
    {#if data.recipe.recipesTags}
      {#each data.recipe.recipesTags as recipesTags (recipesTags.tagId)}
        <a class="chip variant-filled-primary" href={`/recipes/tags?name=${recipesTags.tag.name}`}
          >{recipesTags.tag.name}</a>
      {/each}
    {/if}
  </div>
  <a class="anchor" href={data.recipe.url}>{data.recipe.url}</a>
  <div><p>{data.recipe.description}</p></div>
  <div>
    {#if data.recipe.notes}
      <h2 class="h2">Notes</h2>
      <p>{data.recipe.notes}</p>
    {/if}
  </div>
  <div class="space-y-2 lg:flex lg:gap-2">
    <div class="lg:basis-1/2 lg:overflow-y-auto lg:max-h-[75vh]">
      <h2 class="h2">Ingredients</h2>
      <ul>
        {#if data.recipe.recipesIngredients}
          {#each data.recipe.recipesIngredients as ingredient (ingredient.ingredientId)}
            <li>
              <span>{formatAmount(ingredient.amount)}</span>
              <span>{formatUnit(ingredient)}</span>
              {#if ingredient.ingredient.conversions.length > 0}
                <span
                  class="font-bold border-b-2 border-dotted [&>*]:pointer-events-none"
                  use:popup={popupHover(ingredient.ingredient.id)}
                  >{ingredient.ingredient.name}</span>
                <div
                  class="card p-4 variant-glass-secondary"
                  data-popup={`popupHover${ingredient.ingredient.id}`}>
                  {#each ingredient.ingredient.conversions as conversion (conversion.to + conversion.ingredientId)}
                    <p>
                      {formatAmount(ingredient.amount * conversion.scale)}
                      {conversion.to}
                    </p>
                  {/each}
                  <div class="arrow variant-glass-secondary"></div>
                </div>
              {:else}
                <span class="font-bold">{ingredient.ingredient.name}</span>
              {/if}
            </li>
          {/each}
        {/if}
      </ul>
    </div>
    <div class="lg:basis-1/2 lg:overflow-y-auto lg:max-h-[75vh]">
      <h2 class="h2">Instructions</h2>
      <ol class="list space-y-2">
        <!-- eslint-disable-next-line -->
        {@html formatInstructions(data.recipe.instructions)}
      </ol>
    </div>
  </div>
  <div>
    <a class="btn variant-filled-warning" href={`${$page.url}/edit`}>Edit</a>
  </div>
</div>

<style>
</style>
