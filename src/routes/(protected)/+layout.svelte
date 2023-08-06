<script>
  import { enhance } from '$app/forms';
  import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar gridColumns="grid-cols-2" slotTrail="place-content-end">
      <a class="font-bold text-xl" href="/">Recipe Book</a>
      <svelte:fragment slot="trail">
        <nav class="flex space-x-4">
          <a href="/recipes/new" class="btn hover:variant-soft-primary">Add Recipe</a>
          <a href="/conversions" class="btn hover:variant-soft-primary">Conversions</a>
          <form method="post" action="/?/logout" use:enhance>
            <button class="btn hover:variant-soft-primary">Logout</button>
          </form>
        </nav>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <div class="flex justify-center px-5 lg:p-0">
    <div class="w-full lg:w-4/6 m-auto py-2">
      <slot />
    </div>
  </div>
</AppShell>
