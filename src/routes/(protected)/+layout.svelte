<script lang="ts">
  import { enhance } from '$app/forms';
  import PageTransition from '$lib/components/PageTransition.svelte';
  import { faBars } from '@fortawesome/free-solid-svg-icons';
  import { AppBar, AppShell, ProgressBar, popup } from '@skeletonlabs/skeleton';
  import Fa from 'svelte-fa';
  import type { LayoutData } from './$types';
  import { navigating } from '$app/stores';

  export let data: LayoutData;

  $: navigationValue = !$navigating ? 0 : undefined;
</script>

<AppShell>
  <svelte:fragment slot="header">
    <ProgressBar
      rounded="rounded-none"
      height="h-1"
      track="bg-surface-100-800-token"
      meter="variant-filled-primary"
      value={navigationValue} />
    <AppBar gridColumns="grid-cols-2" slotTrail="place-content-end">
      <a class="font-bold text-xl" href="/">Recipe Book</a>
      <svelte:fragment slot="trail">
        <button
          class="lg:hidden btn"
          use:popup={{ event: 'click', target: 'navMenu', placement: 'bottom-end' }}
          ><Fa icon={faBars} /></button>
        <div class="card p-4 variant-filled-surface-800" data-popup="navMenu">
          <nav class="flex flex-col">
            <a href="/recipes/tags" class="btn hover:variant-soft-primary">Find By Tag</a>
            <a href="/recipes/new" class="btn hover:variant-soft-primary">Add Recipe</a>
            <a href="/conversions" class="btn hover:variant-soft-primary">Conversions</a>
            <form method="post" action="/?/logout" use:enhance>
              <button class="btn hover:variant-soft-primary">Logout</button>
            </form>
          </nav>
        </div>
        <nav class="hidden lg:flex space-x-4">
          <a href="/recipes/tags" class="btn hover:variant-soft-primary">Find By Tag</a>
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
      <PageTransition url={data.pathname}>
        <slot />
      </PageTransition>
    </div>
  </div>
</AppShell>
