<script lang="ts">
  import type { PageServerData } from './$types';

  export let data: PageServerData;
</script>

<div class="space-y-2">
  <h1 class="h1">Welcome to Recipe Book</h1>
  <ul class="space-y-2">
    {#each data.recipes as recipe (recipe.id)}
      <li>
        <a class="block card card-hover variant-glass-primary p-4" href={`/recipes/${recipe.id}`}>
          <h2 class="h3">{recipe.name}</h2>
          <p>{recipe.description}</p>
        </a>
      </li>
    {/each}
  </ul>
</div>
