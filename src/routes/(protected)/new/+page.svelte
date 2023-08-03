<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';

  export let data: PageData;

  const { form, enhance } = superForm(data.form, { dataType: 'json' });

  const ingredientUnits = ['grams', 'cups', 'tablespoons', 'teaspoons', 'ounces'];

  const addIngredient = () => {
    form.update((f) => {
      f.ingredients.push({ name: '', unit: 'cups', amount: 0 });
      return f;
    });
  };

  const removeIngredient = (index: number) => () => {
    form.update((f) => {
      console.log('removing', index);
      f.ingredients = f.ingredients.filter((_, i) => i !== index);
      console.log(f);
      return f;
    });
  };

  $: console.log($form.ingredients.length);
</script>

<div>
  <h2 class="h1">New Recipe</h2>
  <form class="space-y-2" method="post" use:enhance>
    <div class="lg:flex gap-2">
      <div class="space-y-2">
        <label class="label">Name*<input class="input" bind:value={$form.name} /></label>
        <label class="label">URL<input class="input" type="url" bind:value={$form.url} /></label>
        <label class="label">
          Description
          <textarea class="textarea" bind:value={$form.description} />
        </label>
        <label class="label">Notes<textarea class="textarea" bind:value={$form.notes} /></label>
      </div>
      <div>
        <div class="label">Ingrdients</div>
        <ul class="space-y-2">
          {#each $form.ingredients as _, i}
            <li class="flex gap-2">
              <div class="input-group input-group-divider grid-cols-[1fr_auto_auto]">
                <label hidden for={`ingredientname${i}`}>
                  Ingredient {i} Name
                </label>
                <input id={`ingredientname${i}`} bind:value={$form.ingredients[i].name} />
                <label hidden for={`ingredientamount${i}`}>
                  Ingredient {i} Amount
                </label>
                <input
                  id={`ingredientamount${i}`}
                  type="number"
                  bind:value={$form.ingredients[i].amount} />
                <label for={`ingredientunit${i}`} hidden>Ingredient {i} Unit</label>
                <select id={`ingredientunit${i}`} bind:value={$form.ingredients[i].unit}>
                  {#each ingredientUnits as unit}
                    <option value={unit}>{unit[0].toUpperCase() + unit.slice(1)}</option>
                  {/each}
                </select>
              </div>
              <button
                class={`btn variant-outline-error font-bold hover:variant-filled-error w-12 ${
                  $form.ingredients.length < 2 ? 'invisible' : ''
                }`}
                type="button"
                on:click={removeIngredient(i)}>-</button>
            </li>
          {/each}
        </ul>
        <div>
          <button
            class="btn variant-outline-primary font-bold hover:variant-filled-primary my-2 w-12"
            type="button"
            on:click={addIngredient}>+</button>
        </div>
      </div>
    </div>
    <div>
      <button class="btn variant-filled">Create</button>
      <button class="btn variant-outline" type="button" on:click={() => history.back()}
        >Back</button>
    </div>
  </form>
</div>
