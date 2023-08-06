<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div>
  <h1 class="h1">Conversions</h1>
  <div>
    <ul>
      {#each data.conversions as conversion (conversion.ingredientId + conversion.to)}
        <li>
          {conversion.ingredient.name} to {conversion.to}
        </li>
      {/each}
    </ul>
  </div>
</div>
