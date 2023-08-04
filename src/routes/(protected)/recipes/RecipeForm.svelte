<script lang="ts">
  import ingredientUnits from '$lib/ingredient-units';
  import type { NewRecipeSchema } from '$lib/schemas';
  import type { SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: SuperValidated<NewRecipeSchema>;
  export let type: 'create' | 'update';

  const { form, enhance } = superForm(data, { dataType: 'json' });

  const addIngredient = () => {
    form.update((f) => {
      f.ingredients.push({ name: '', unit: 'cups', amount: 0 });
      return f;
    });
  };

  const removeIngredient = (index: number) => () => {
    form.update((f) => {
      f.ingredients = f.ingredients.filter((_, i) => i !== index);
      return f;
    });
  };
</script>

<form class="space-y-2" method="post" use:enhance>
  <div class="lg:flex gap-2">
    <div class="lg:basis-1/2 space-y-2">
      <label class="label">Name*<input class="input" bind:value={$form.name} /></label>
      <label class="label">URL<input class="input" type="url" bind:value={$form.url} /></label>
      <label class="label">
        Description*
        <textarea class="textarea" bind:value={$form.description} />
      </label>
      <label class="label">Notes<textarea class="textarea" bind:value={$form.notes} /></label>
      <div>
        <div class="label">Ingredients*</div>
        <ul class="space-y-2">
          {#each $form.ingredients as _, i}
            <li class="flex gap-2">
              <div
                class="input-group input-group-divider grid-cols-[minmax(100px,_2fr)_minmax(50px,_1fr)_minmax(50px,_1fr)]">
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
                  step="any"
                  bind:value={$form.ingredients[i].amount} />
                <label for={`ingredientunit${i}`} hidden>Ingredient {i} Unit</label>
                <select id={`ingredientunit${i}`} bind:value={$form.ingredients[i].unit}>
                  {#each ingredientUnits as unit}
                    <option value={unit}>{unit[0].toUpperCase() + unit.slice(1)}</option>
                  {/each}
                </select>
              </div>
              {#if $form.ingredients.length > 1}
                <button
                  class="btn variant-outline-error font-bold hover:variant-filled-error w-12"
                  type="button"
                  on:click={removeIngredient(i)}
                  >-
                </button>
              {/if}
            </li>
          {/each}
        </ul>
        <div>
          <button
            class="btn variant-outline-primary font-bold hover:variant-filled-primary my-2 w-12"
            type="button"
            on:click={addIngredient}
            >+
          </button>
        </div>
      </div>
    </div>
    <div class="lg:basis-1/2">
      <label class="label">
        Instructions*
        <textarea class="textarea" bind:value={$form.instructions} rows="10" /></label>
    </div>
  </div>
  <div>
    <button class="btn variant-filled">{type[0].toUpperCase() + type.slice(1)}</button>
    <button class="btn variant-outline" type="button" on:click={() => history.back()}>Back </button>
  </div>
</form>
