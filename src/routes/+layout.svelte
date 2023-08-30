<script lang="ts">
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import '../app.postcss';
  import { page } from '$app/stores';

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<svelte:head>
  <title>{$page.data.title}</title>
</svelte:head>

<slot />
