<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, SubmitFunction } from './$types';
  import type { Data } from './form-data';

  export let form: ActionData;

  let formData: Data = {
    name: '',
    age: null,
    items: [
      {
        value: '',
      },
      { value: '' },
    ],
  };

  const formSubmission: SubmitFunction = ({ data }) => {
    data.set('value', JSON.stringify(formData));
    return ({ update }) => update({ reset: false });
  };
</script>

<h2 class="h2">Welcome to Recipe Book</h2>
<p>Authorized</p>

<form class="" method="post" action="?/doThing" use:enhance={formSubmission}>
  <label class="label"
    ><span>Name: </span><input class="input" bind:value={formData.name} />
  </label>
  <label class="label">Age: <input class="input" bind:value={formData.age} type="number" /> </label>
  {#each formData.items as _, i}
    <label class="label"
      >Item {i}: <input class="input" bind:value={formData.items[i].value} /></label
    >
  {/each}
  <button class="btn variant-filled">Submit</button>
</form>
<code>{JSON.stringify(formData)}</code>
<br />
{#if form}
  {form.validation?.name?._errors[0]}
  <pre>{JSON.stringify(form.validation?._errors, null, 2)}</pre>
{/if}
