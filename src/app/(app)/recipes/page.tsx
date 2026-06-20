import { createClient } from "@/lib/supabase/server";
import { NewRecipeButton } from "./new-recipe-button";
import { RecipeList, type RecipeListItem } from "./recipe-list";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select(
      "id, name, recipe_type, is_standard, is_favorite, coffee_id, coffees(name), brew_methods(name)",
    )
    .order("created_at", { ascending: false });
  const recipes = (data ?? []) as unknown as RecipeListItem[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
        <NewRecipeButton />
      </div>
      <RecipeList recipes={recipes} />
    </div>
  );
}
