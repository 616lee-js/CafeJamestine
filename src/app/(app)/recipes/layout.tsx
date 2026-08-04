import { createClient } from "@/lib/supabase/server";
import { SplitPane } from "@/components/split-pane";
import { RecipeList, type RecipeListItem } from "./recipe-list";

export const dynamic = "force-dynamic";

// Same shape as Coffees: browsing a collection means list-beside-detail, everywhere.
export default async function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select(
      "id, name, recipe_type, is_standard, is_favorite, coffee_id, coffees(name), brew_methods(name)",
    )
    .order("created_at", { ascending: false });
  const recipes = (data ?? []) as unknown as RecipeListItem[];

  return (
    <SplitPane basePath="/recipes" rail={<RecipeList recipes={recipes} />}>
      {children}
    </SplitPane>
  );
}
