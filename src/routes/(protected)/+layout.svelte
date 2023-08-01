<script>
  import { enhance } from '$app/forms';
  import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar gridColumns="grid-cols-2" slotTrail="place-content-end">
      <a href="/">Recipe Book</a>
      <svelte:fragment slot="trail">
        <nav class="flex">
          <a href="/new">Add Recipe</a>
          <form method="post" action="?/logout" use:enhance><button>Logout</button></form>
        </nav>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <slot />
</AppShell>
