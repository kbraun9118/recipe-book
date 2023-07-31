CREATE TABLE IF NOT EXISTS "conversions" (
	"ingredient_id" serial PRIMARY KEY NOT NULL,
	"scale" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"unit" text NOT NULL,
	CONSTRAINT "name_type_unique" UNIQUE("name","unit")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipeIngredients" (
	"recipe_id" serial NOT NULL,
	"ingredient_id" serial NOT NULL,
	"amount" numeric NOT NULL,
	CONSTRAINT recipeIngredients_recipe_id_ingredient_id PRIMARY KEY("recipe_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"url" text,
	"notes" text,
	CONSTRAINT "recipes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversions" ADD CONSTRAINT "conversions_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipeIngredients" ADD CONSTRAINT "recipeIngredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipeIngredients" ADD CONSTRAINT "recipeIngredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
