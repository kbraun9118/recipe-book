<script lang="ts">
  import ingredientUnits from '$lib/ingredient-units';

  export let value: string;
  export let name = '';
  export let id = '';
  let clazz = '';

  export { clazz as class };
</script>

<select {id} class={`capitalize input ${clazz}`} {name} bind:value>
  {#each ingredientUnits as unit (unit)}
    <option class="capitalize" value={unit}>{unit}</option>
  {/each}
</select>
