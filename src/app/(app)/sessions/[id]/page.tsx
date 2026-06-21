import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BrewMethod, Session } from "@/lib/db-types";
import { SessionDetail } from "./session-detail";

export const dynamic = "force-dynamic";

type Bag = { roast_date: string | null; coffees: { name: string | null } | null } | null;
type EquipRow = { id: string; name: string | null; equipment_categories: { name: string } | null };

export default async function SessionPage({
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
    .from("sessions")
    .select("*, coffee_bags(roast_date, coffees(name))")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const session = data as unknown as Session & { coffee_bags: Bag };

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
    <SessionDetail
      session={session}
      coffeeName={session.coffee_bags?.coffees?.name ?? null}
      roastDate={session.coffee_bags?.roast_date ?? null}
      brewMethods={(brewMethods ?? []) as BrewMethod[]}
      equipment={equipment}
    />
  );
}
