<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h2>New Recipe</h2>
<form method="post">
  {data.foo}
  <label class="label">Name: <input class="input" name="name" /></label>
  <label class="label">Name: <input class="input" name="name" /></label>
  <button>Create</button>
</form>
<button on:click={() => goto('/', { replaceState: true })}>Back</button>
