import type { DbClient } from '$lib/server/db/index';
import { ingredients, recipeIngredients, recipes } from '$lib/server/db/schema/recipe';
import { eq, or, sql } from 'drizzle-orm';

export async function seedDB(db: DbClient) {
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(recipes);
  console.log(count);
  if (+(count as string) === 0) {
    const [{ id: chocolateChipCookies }, { id: pancakes }] = await db
      .insert(recipes)
      .values([
        {
          name: 'The Best Soft Chocolate Chip Cookies',
          description:
            'These are THE BEST soft chocolate chip cookies! No chilling required. Just ultra thick, soft, classic chocolate chip cookies!',
          url: 'https://pinchofyum.com/the-best-soft-chocolate-chip-cookies#tasty-recipes-39213-jump-target',
          notes: '',
          instructions: `* Preheat the oven to 350 degrees. Microwave the butter for about 40 seconds to just barely melt it. It shouldn’t be hot – but it should be almost entirely in liquid form.
          * Using a stand mixer or electric beaters, beat the butter with the sugars until creamy. Add the vanilla and the egg; beat on low speed until just incorporated – 10-15 seconds or so (if you beat the egg for too long, the cookies will be stiff).
          * Add the flour, baking soda, and salt. Mix until crumbles form. Use your hands to press the crumbles together into a dough. It should form one large ball that is easy to handle (right at the stage between “wet” dough and “dry” dough). Add the chocolate chips and incorporate with your hands.
          * Roll the dough into 12 large balls (or 9 for HUGELY awesome cookies) and place on a cookie sheet. Bake for 9-11 minutes until the cookies look puffy and dry and just barely golden. Warning, friends: DO NOT OVERBAKE. This advice is probably written on every cookie recipe everywhere, but this is essential for keeping the cookies soft. Take them out even if they look like they’re not done yet (see picture in the post). They’ll be pale and puffy.
          * Let them cool on the pan for a good 30 minutes or so (I mean, okay, eat four or five but then let the rest of them cool). They will sink down and turn into these dense, buttery, soft cookies that are the best in all the land. These should stay soft for many days if kept in an airtight container. I also like to freeze them.`,
        },
        {
          name: 'Best Fluffy Pancakes',
          description:
            'Look no further because a steaming stack of perfectly soft, Best Fluffy Pancakes are right here! Weekends will never be the same again!',
          url: '',
          notes: '',
          instructions: `* Combine together the flour, sugar (or sweetener), baking powder, baking soda and salt in a large-sized bowl. Make a well in the centre and add the milk, slightly cooled melted butter, vanilla and egg.
          * Use a wire whisk to whisk the wet ingredients together first before slowly folding them into the dry ingredients. Mix together until smooth (there may be a couple of lumps but that's okay). (The batter will be thick and creamy in consistency. If you find the batter too thick -- doesn't pour off the ladle or out of the measuring cup smoothly -- fold a couple tablespoons of extra milk into the batter at a time until reaching desired consistency)
          * Set the batter aside and allow to rest while heating up your pan or griddle.
          * Heat a nonstick pan or griddle over low-medium heat and wipe over with a little butter to lightly grease pan. Pour ¼ cup of batter onto the pan and spread out gently into a round shape with the back of your ladle or measuring cup.
          * When the underside is golden and bubbles begin to appear on the surface, flip with a spatula and cook until golden. Repeat with remaining batter.
          * Serve with honey, maple syrup, fruit, ice cream or frozen yoghurt, or enjoy plain!`,
        },
      ])
      .returning({ id: recipes.id });

    const [
      { id: saltedButter },
      { id: whiteSugar },
      { id: brownSugar },
      { id: vanilla },
      { id: egg },
      { id: flour },
      { id: bakingSoda },
      { id: salt },
      { id: chocolateChips },
      { id: bakingPowder },
      { id: milk },
      { id: butter },
    ] = await db
      .insert(ingredients)
      .values([
        { name: 'salted butter', unit: 'tablespoons' },
        { name: 'white sugar', unit: 'cups' },
        { name: 'light brown sugar', unit: 'cups' },
        { name: 'vanilla', unit: 'teaspoons' },
        { name: 'egg', unit: 'count' },
        { name: 'all purpose flour', unit: 'cups' },
        { name: 'baking soda', unit: 'teaspoons' },
        { name: 'salt', unit: 'teaspoons' },
        { name: 'chocolate chips', unit: 'cups' },
        { name: 'baking powder', unit: 'teaspoons' },
        { name: 'milk', unit: 'cups' },
        { name: 'butter', unit: 'cups' },
      ])
      .returning({
        id: ingredients.id,
      });

    await db.insert(recipeIngredients).values([
      { recipeId: chocolateChipCookies, ingredientId: saltedButter, amount: 8 },
      { recipeId: chocolateChipCookies, ingredientId: whiteSugar, amount: 0.5 },
      { recipeId: chocolateChipCookies, ingredientId: brownSugar, amount: 0.25 },
      { recipeId: chocolateChipCookies, ingredientId: vanilla, amount: 1 },
      { recipeId: chocolateChipCookies, ingredientId: egg, amount: 1 },
      { recipeId: chocolateChipCookies, ingredientId: flour, amount: 1.5 },
      { recipeId: chocolateChipCookies, ingredientId: bakingSoda, amount: 0.5 },
      { recipeId: chocolateChipCookies, ingredientId: salt, amount: 0.25 },
      { recipeId: chocolateChipCookies, ingredientId: chocolateChips, amount: 0.75 },

      { recipeId: pancakes, ingredientId: flour, amount: 2 },
      { recipeId: pancakes, ingredientId: whiteSugar, amount: 0.25 },
      { recipeId: pancakes, ingredientId: bakingPowder, amount: 4 },
      { recipeId: pancakes, ingredientId: bakingSoda, amount: 0.25 },
      { recipeId: pancakes, ingredientId: salt, amount: 0.5 },
      { recipeId: pancakes, ingredientId: milk, amount: 1.75 },
      { recipeId: pancakes, ingredientId: butter, amount: 0.25 },
      { recipeId: pancakes, ingredientId: vanilla, amount: 2 },
      { recipeId: pancakes, ingredientId: egg, amount: 1 },
    ]);
  }
}
