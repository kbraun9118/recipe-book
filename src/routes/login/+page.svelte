<script lang="ts">
  import type { ActionData } from './$types';

  interface Props {
    form: ActionData;
  }

  let { form }: Props = $props();
</script>

<main class="flex p-5">
  <div class="m-auto flex flex-col card p-4 space-y-5">
    <h1 class="h1">Login</h1>
    <form class="w-full space-y-4" method="post">
      <!-- svelte-ignore a11y_autofocus -->
      <label class="label"
        >Password<input class="input" name="password" type="password" autofocus /></label>
      <button class="btn variant-filled-primary">Login</button>
      {#if form?.message}
        <p class="text-red-500">{form.message}</p>
      {/if}
    </form>
  </div>
</main>
