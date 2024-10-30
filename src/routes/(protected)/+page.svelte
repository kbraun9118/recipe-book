<script lang="ts">
  import RecipeDisplay from '$lib/components/RecipeDisplay.svelte';
  import type { PageServerData } from './$types';

  interface Props {
    data: PageServerData;
  }

  let { data }: Props = $props();
</script>

<div class="space-y-2">
  <h1 class="h1">Welcome to Recipe Book</h1>
  <ul class="space-y-2">
    {#each data.recipes as recipe (recipe.id)}
      <li>
        <RecipeDisplay {recipe} />
      </li>
    {/each}
  </ul>
</div>
