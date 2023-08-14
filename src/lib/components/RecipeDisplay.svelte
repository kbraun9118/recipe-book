<script lang="ts">
  import type { RecipeWithTags } from '$lib/server/db/schema/recipe';

  export let recipe: RecipeWithTags;
</script>

<a class="block card card-hover variant-glass-primary p-4" href={`/recipes/${recipe.id}`}>
  <div>
    <h2 class="h3">{recipe.name}</h2>
    <div class="space-x-2">
      {#each recipe.recipesTags as recipesTags (recipesTags.tagId)}
        <span class="badge variant-filled-primary hover:variant-filled-primary"
          >{recipesTags.tag.name}</span>
      {/each}
    </div>
  </div>
  <p>{recipe.description}</p>
</a>
