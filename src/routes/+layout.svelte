<script lang="ts">
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import '../app.postcss';
  import { page } from '$app/stores';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<svelte:head>
  <title>{$page.data.title}</title>
</svelte:head>

{@render children?.()}
