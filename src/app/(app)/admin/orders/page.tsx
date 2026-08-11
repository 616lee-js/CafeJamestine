import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import type { HomeCafeSession, MenuItem, Order, RecipeStep } from "@/lib/db-types";
import { OrdersScreen, type OrderView } from "./orders-screen";

export const dynamic = "force-dynamic";

type RecipeRow = {
  id: string;
  name: string | null;
  recipe_type: string;
  brew_methods: { name: string | null } | null;
  dose_grams: number | null;
  water_grams: number | null;
  water_temp_celsius: number | null;
  grind_setting: string | null;
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: sessionRows }, { data: orderRows }, { data: itemRows }] = await Promise.all([
    supabase.from("home_cafe_sessions").select("*").order("created_at", { ascending: false }),
    // Receipt order, oldest at top.
    supabase.from("orders").select("*").order("received_at", { ascending: true }),
    supabase.from("menu_items").select("*"),
  ]);

  const sessions = (sessionRows ?? []) as HomeCafeSession[];
  const orders = (orderRows ?? []) as Order[];
  const items = new Map(((itemRows ?? []) as MenuItem[]).map((m) => [m.id, m]));

  // Resolve each order's recipe LIVE: specialty -> the referenced recipe; coffee -> that
  // coffee's current favorite. Never snapshotted.
  const coffeeIds = [...new Set(
    orders.map((o) => items.get(o.menu_item_id)?.coffee_id).filter((v): v is string => !!v),
  )];
  const recipeIds = [...new Set(
    orders.map((o) => items.get(o.menu_item_id)?.recipe_id).filter((v): v is string => !!v),
  )];

  const RECIPE_COLS =
    "id, name, recipe_type, brew_methods(name), dose_grams, water_grams, water_temp_celsius, grind_setting";

  const [{ data: favRows }, { data: directRows }] = await Promise.all([
    coffeeIds.length
      ? supabase
          .from("recipes")
          .select(`${RECIPE_COLS}, coffee_id, is_favorite, updated_at`)
          .in("coffee_id", coffeeIds)
          .eq("is_favorite", true)
          .order("updated_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    recipeIds.length
      ? supabase.from("recipes").select(RECIPE_COLS).in("id", recipeIds)
      : Promise.resolve({ data: [] }),
  ]);

  // Nothing stops two favorites per coffee, so take the most recently updated deterministically.
  const favByCoffee = new Map<string, RecipeRow>();
  for (const r of (favRows ?? []) as unknown as (RecipeRow & { coffee_id: string })[]) {
    if (!favByCoffee.has(r.coffee_id)) favByCoffee.set(r.coffee_id, r);
  }
  const directById = new Map(
    ((directRows ?? []) as unknown as RecipeRow[]).map((r) => [r.id, r]),
  );

  const resolved = orders.map((o) => {
    const item = items.get(o.menu_item_id) ?? null;
    const recipe = item
      ? item.item_type === "coffee"
        ? (favByCoffee.get(item.coffee_id ?? "") ?? null)
        : (directById.get(item.recipe_id ?? "") ?? null)
      : null;
    return { order: o, item, recipe };
  });

  // Steps for whichever recipes actually resolved.
  const stepRecipeIds = [
    ...new Set(resolved.map((r) => r.recipe?.id).filter((v): v is string => !!v)),
  ];
  const { data: stepRows } = stepRecipeIds.length
    ? await supabase
        .from("recipe_steps")
        .select("*")
        .in("recipe_id", stepRecipeIds)
        .order("position", { ascending: true, nullsFirst: false })
    : { data: [] };
  const stepsByRecipe = new Map<string, RecipeStep[]>();
  for (const s of (stepRows ?? []) as RecipeStep[]) {
    if (!s.recipe_id) continue;
    const list = stepsByRecipe.get(s.recipe_id) ?? [];
    list.push(s);
    stepsByRecipe.set(s.recipe_id, list);
  }

  const views: OrderView[] = resolved.map(({ order, item, recipe }) => ({
    order,
    itemName: item?.public_name ?? "— removed item —",
    itemType: item?.item_type ?? null,
    recipe: recipe
      ? {
          id: recipe.id,
          name: recipe.name,
          method: recipe.brew_methods?.name ?? null,
          dose_grams: recipe.dose_grams,
          water_grams: recipe.water_grams,
          water_temp_celsius: recipe.water_temp_celsius,
          grind_setting: recipe.grind_setting,
          steps: stepsByRecipe.get(recipe.id) ?? [],
        }
      : null,
  }));

  return <OrdersScreen sessions={sessions} orders={views} />;
}
