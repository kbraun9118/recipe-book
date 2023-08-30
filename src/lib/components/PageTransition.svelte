<script lang="ts">
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  export let url: string;

  const duration = 300;
  const delay = duration + 100;
  const y = 10;

  const transitionIn = { easing: cubicOut, y, duration, delay };
  const transitionOut = { easing: cubicIn, y: -y, duration };
</script>

{#key url}
  <div in:fly={transitionIn} out:fly={transitionOut}>
    <slot />
  </div>
{/key}
