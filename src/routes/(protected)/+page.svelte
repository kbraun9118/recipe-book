<script lang="ts">
  import type { PageServerData } from './$types';

  export let data: PageServerData;
</script>

<div>
  <h1 class="h1">Welcome to Recipe Book</h1>
  <ul>
    {#each data.recipes as recipe (recipe.id)}
      <li>
        <a class="w-full card variant-ghost-primary hover:variant-ghost-secondary" href={`/recipes/${recipe.id}`}
          >{JSON.stringify(recipe)}</a>
      </li>
    {/each}
  </ul>
</div>
