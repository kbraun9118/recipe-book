<script lang="ts">
  import ingredientUnits from '$lib/ingredient-units';

  export let value: string;
  export let name: string = '';
  export let id: string = '';
  let clazz = '';

  export { clazz as class };
</script>

<select {id} class={clazz} {name} bind:value>
  {#each ingredientUnits as unit (unit)}
    <option value={unit}>{unit[0].toUpperCase() + unit.slice(1)}</option>
  {/each}
</select>
