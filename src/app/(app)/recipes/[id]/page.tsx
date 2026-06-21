import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BrewMethod, Recipe } from "@/lib/db-types";
import { RecipeDetail } from "./recipe-detail";

export const dynamic = "force-dynamic";

type Named = { name: string | null } | null;
type RecipeWithNames = Recipe & {
  coffees: Named;
  roasters: Named;
  countries: Named;
  processes: Named;
};
type EquipRow = { id: string; name: string | null; equipment_categories: { name: string } | null };

export default async function RecipePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { id } = await params;
  const { new: isNewParam } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("recipes")
    .select("*, coffees(name), roasters(name), countries(name), processes(name)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const recipe = data as unknown as RecipeWithNames;

  const { data: brewMethods } = await supabase
    .from("brew_methods")
    .select("id, name, slug, behavior_family, default_water_anchor")
    .order("name");

  const { data: equipData } = await supabase
    .from("equipment")
    .select("id, name, equipment_categories(name)")
    .eq("is_workflow_relevant", true)
    .order("name");
  const equipment = ((equipData ?? []) as unknown as EquipRow[]).map((e) => ({
    id: e.id,
    name: e.name,
    category: e.equipment_categories?.name ?? null,
  }));

  return (
    <RecipeDetail
      recipe={recipe}
      names={{
        coffee: recipe.coffees?.name ?? null,
        roaster: recipe.roasters?.name ?? null,
        country: recipe.countries?.name ?? null,
        process: recipe.processes?.name ?? null,
      }}
      brewMethods={(brewMethods ?? []) as BrewMethod[]}
      equipment={equipment}
      isNew={isNewParam === "1"}
    />
  );
}
