<script lang="ts">
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<h1>Login</h1>
<form method="post">
  <label>Password: <input name="password" type="password" autofocus/></label>
  <button>Login</button>
  {#if form?.message}
    <p class="text-red-500">{form.message}</p>
  {/if}
</form>
