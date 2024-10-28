<script lang="ts">
  import RecipeForm from '$lib/components/RecipeForm.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<div>
  <h2 class="h1">New Recipe</h2>
  <RecipeForm data={data.form} tags={data.tags} type="create" />
</div>
