<script lang="ts">
  import ingredientUnits from '$lib/ingredient-units';

  interface Props {
    value: string;
    name?: string;
    id?: string;
    isInput?: boolean;
    class?: string;
  }

  let {
    value = $bindable(),
    name = '',
    id = '',
    isInput = true,
    class: clazz = ''
  }: Props = $props();

  
</script>

<select {id} class={`capitalize ${isInput && 'input'} ${clazz}`} {name} bind:value>
  {#each ingredientUnits as unit (unit)}
    <option class="capitalize" value={unit}>{unit}</option>
  {/each}
</select>
