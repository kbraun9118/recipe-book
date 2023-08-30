<script lang="ts">
  import PageTransition from '$lib/components/PageTransition.svelte';
  import RecipeDisplay from '$lib/components/RecipeDisplay.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="space-y-2">
  <h1 class="h1 py-2">Tags</h1>
  <div class="flex flex-row gap-2">
    {#each data.tags as tag (tag.id)}
      <a
        class={`chip ${data.tag?.name === tag.name ? 'variant-filled' : 'variant-filled-primary'}`}
        href={`?name=${tag.name}`}>{tag.name}</a>
    {/each}
  </div>
  {#if data.tag}
    <PageTransition url={data.tag.name}>
      <div>
        <h2 class="h2 capitalize py-2">{data.tag.name} Recipes</h2>
        <ul class="space-y-2">
          {#each data.tag.recipesTags as recipesTags (recipesTags.recipeId)}
            <li>
              <RecipeDisplay recipe={recipesTags.recipe} />
            </li>
          {/each}
        </ul>
      </div>
    </PageTransition>
  {/if}
</div>
