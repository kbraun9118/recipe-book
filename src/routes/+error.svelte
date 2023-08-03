<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="h-full flex justify-center items-center">
  <div class="text-center space-y-2">
    {#if $page.status === 404}
      <h1 class="h1">Page Could Not Be Found</h1>
      <button class="btn variant-filled-warning" on:click={() => history.back()}>Go Back</button>
    {:else if $page.status === 500}
      <h1 class="h1">Whoops Something Went Wrong On Our End</h1>
      <a class="btn variant-filled-warning" href="/">Go Home</a>
    {:else}
      <h1 class="h1">{$page.status}: {$page.error?.message}</h1>
      <a class="btn variant-filled-warning" href="/">Go Home</a>
    {/if}
  </div>
</div>
