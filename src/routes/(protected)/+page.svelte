<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageServerData } from './$types';

  export let data: PageServerData;

  const { form, enhance, errors, allErrors } = superForm(data.form, { dataType: 'json' });
</script>

<h1 class="h1">Welcome to Recipe Book</h1>
<p>Authorized</p>

<form class="space-y-3" method="post" action="?/doThing" use:enhance>
  <label class="label"><span>Name</span><input class="input" bind:value={$form.name} /> </label>
  <label class="label"
    ><span>Age</span><input class="input" bind:value={$form.age} type="number" />
  </label>
  {#each $form.items as _, i}
    <label class="label"
      ><span>Item {i}</span><input class="input" bind:value={$form.items[i].value} /></label
    >
  {/each}
  <button class="btn variant-filled">Submit</button>
</form>
<!-- <code>{JSON.stringify($form)}</code> -->
<br />
{#if $allErrors.length !== 0}
  <div class="alert variant-filled-error">
    <div class="alert-message">
      <h3 class="h3">Errors:</h3>
      <pre>{JSON.stringify($errors, null, 2)}</pre>
    </div>
  </div>
{/if}
