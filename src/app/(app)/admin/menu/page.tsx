import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { coffeeStatus } from "@/lib/compute";
import type { BagStatus, MenuItem } from "@/lib/db-types";
import { MenuBuilder, type SourceOption } from "./menu-builder";

export const dynamic = "force-dynamic";

type CoffeeRow = {
  id: string;
  name: string | null;
  coffee_bags: { status: BagStatus }[] | null;
  roasters: { name: string | null } | null;
};
type RecipeRow = { id: string; name: string | null };

export default async function AdminMenuPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: itemRows }, { data: coffeeRows }, { data: recipeRows }] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*")
      .order("position", { ascending: true, nullsFirst: false }),
    supabase.from("coffees").select("id, name, roasters(name), coffee_bags(status)"),
    supabase
      .from("recipes")
      .select("id, name")
      .eq("recipe_type", "specialty_drink")
      .order("name"),
  ]);

  const items = (itemRows ?? []) as MenuItem[];

  // "Active coffee" is computed from bag status, not stored — reuse the existing helper.
  const coffees: SourceOption[] = ((coffeeRows ?? []) as unknown as CoffeeRow[])
    .filter((c) => coffeeStatus(c.coffee_bags ?? []) === "active")
    .map((c) => ({
      id: c.id,
      label: c.name || "Untitled coffee",
      meta: c.roasters?.name ?? null,
    }));

  const specialties: SourceOption[] = ((recipeRows ?? []) as RecipeRow[]).map((r) => ({
    id: r.id,
    label: r.name || "Untitled recipe",
    meta: null,
  }));

  // Source labels for items already on the menu, so the builder can show what each links to.
  const coffeeNames = new Map(
    ((coffeeRows ?? []) as unknown as CoffeeRow[]).map((c) => [c.id, c.name || "Untitled coffee"]),
  );
  const recipeNames = new Map(
    ((recipeRows ?? []) as RecipeRow[]).map((r) => [r.id, r.name || "Untitled recipe"]),
  );
  const sourceLabels: Record<string, string> = {};
  for (const it of items) {
    const label =
      it.item_type === "coffee"
        ? coffeeNames.get(it.coffee_id ?? "")
        : recipeNames.get(it.recipe_id ?? "");
    sourceLabels[it.id] = label ?? "— source not found —";
  }

  return (
    <MenuBuilder
      items={items}
      coffees={coffees}
      specialties={specialties}
      sourceLabels={sourceLabels}
    />
  );
}
