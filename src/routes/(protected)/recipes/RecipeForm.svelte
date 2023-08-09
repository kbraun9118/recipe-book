<script lang="ts">
  import ingredientUnits from '$lib/ingredient-units';
  import type { NewRecipeSchema } from '$lib/schemas';
  import { error, text } from '@sveltejs/kit';
  import type { SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms/client';
  import ErrorText from './ErrorText.svelte';

  export let data: SuperValidated<NewRecipeSchema>;
  export let type: 'create' | 'update';

  const { form, enhance, errors } = superForm(data, { dataType: 'json' });

  const addIngredient = () => {
    form.update((f) => {
      console.log(f.ingredients);
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
      <div>
        <label class="label"
          >Name*<input
            class="input"
            class:input-error={$errors.name}
            bind:value={$form.name} /></label>
        <ErrorText fieldName="name" text={$errors.name} />
      </div>
      <div>
        <label class="label"
          >URL<input class="input" class:input-error={$errors.url} bind:value={$form.url} /></label>
        <ErrorText fieldName="URL" text={$errors.url} />
      </div>
      <div>
        <label class="label">
          Description*
          <textarea
            class="textarea"
            class:input-error={$errors.description}
            bind:value={$form.description} />
        </label>
        <ErrorText fieldName="description" text={$errors.description} />
      </div>
      <div>
        <label class="label"
          >Notes<textarea
            class="textarea"
            class:input-error={$errors.notes}
            bind:value={$form.notes} /></label>
        <ErrorText fieldName="notes" text={$errors.notes} />
      </div>
      <div>
        <div class="label">Ingredients*</div>
        <ul class="space-y-2">
          {#each $form.ingredients as _, i}
            <li>
              <div>
                <div class="flex gap-2">
                  <div
                    class="input-group input-group-divider grid-cols-[minmax(100px,_2fr)_minmax(50px,_1fr)_minmax(50px,_1fr)]"
                    class:input-error={$errors.ingredients?.[i]?.name ||
                      $errors.ingredients?.[i]?.amount}>
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
                        <option class="first-letter:capitalize" value={unit}
                          >{unit[0].toUpperCase() + unit.slice(1)}</option>
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
                </div>
                <ErrorText fieldName="ingredient name" text={$errors.ingredients?.[i]?.name} />
                <ErrorText fieldName="ingredient amount" text={$errors.ingredients?.[i]?.amount} />
              </div>
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
      <div>
        <label class="label">
          Instructions*
          <textarea
            class="textarea"
            class:input-error={$errors.instructions}
            bind:value={$form.instructions}
            rows="10" /></label>
        <ErrorText fieldName="instructions" text={$errors.instructions} />
      </div>
    </div>
  </div>
  <div>
    <button class="btn variant-filled first-letter:capitalize">{type}</button>
    <button class="btn variant-outline" type="button" on:click={() => history.back()}>Back </button>
  </div>
</form>
