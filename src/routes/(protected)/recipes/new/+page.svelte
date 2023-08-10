<script lang="ts">
  import RecipeForm from '../RecipeForm.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div>
  <h2 class="h1">New Recipe</h2>
  <RecipeForm data={data.form} type="create" />
</div>
