import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BrewMethod, EquipmentOption, Recipe } from "@/lib/db-types";
import { RecipeEditor } from "./recipe-editor";

export const dynamic = "force-dynamic";

type Named = { name: string | null } | null;
type RecipeWithNames = Recipe & {
  coffees: Named;
  roasters: Named;
  countries: Named;
  processes: Named;
};

export default async function RecipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data: equipment } = await supabase
    .from("equipment")
    .select("id, name")
    .eq("is_workflow_relevant", true)
    .order("name");

  return (
    <RecipeEditor
      recipe={recipe}
      names={{
        coffee: recipe.coffees?.name ?? null,
        roaster: recipe.roasters?.name ?? null,
        country: recipe.countries?.name ?? null,
        process: recipe.processes?.name ?? null,
      }}
      brewMethods={(brewMethods ?? []) as BrewMethod[]}
      equipment={(equipment ?? []) as EquipmentOption[]}
    />
  );
}
