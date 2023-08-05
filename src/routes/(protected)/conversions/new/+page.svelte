<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';

  export let data: PageData;

  const { form } = superForm(data.form);
</script>

<pre>
    {JSON.stringify($form)}
    {JSON.stringify(data.ingredients, null, 2)}
</pre>
