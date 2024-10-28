<script lang="ts">
  import RecipeForm from '$lib/components/RecipeForm.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<div>
  <h1 class="h1">Edit {data.recipe.name}</h1>
  <RecipeForm data={data.form} tags={data.tags} type="update" />
</div>
