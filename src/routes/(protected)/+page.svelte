<script lang="ts">
  import RecipeDisplay from '$lib/components/RecipeDisplay.svelte';
  import type { PageServerData } from './$types';

  export let data: PageServerData;

</script>

<div class="space-y-2">
  <h1 class="h1">Welcome to Recipe Book</h1>
  <ul class="space-y-2">
    {#each data.recipes as recipe (recipe.id)}
      <li>
        <RecipeDisplay recipe={recipe} />
      </li>
    {/each}
  </ul>
</div>
