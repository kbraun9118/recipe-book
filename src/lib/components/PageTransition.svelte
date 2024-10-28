<script lang="ts">
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  interface Props {
    url: string;
    children?: import('svelte').Snippet;
  }

  let { url, children }: Props = $props();

  const duration = 300;
  const delay = duration + 100;
  const y = 10;

  const transitionIn = { easing: cubicOut, y, duration, delay };
  const transitionOut = { easing: cubicIn, y: -y, duration };
</script>

{#key url}
  <div in:fly={transitionIn} out:fly={transitionOut}>
    {@render children?.()}
  </div>
{/key}
