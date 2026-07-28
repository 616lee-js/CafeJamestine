import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  BrewMethod,
  CoffeeBagStatusEvent,
  Session,
  TastingCategory,
} from "@/lib/db-types";
import { SessionDetail } from "./session-detail";

export const dynamic = "force-dynamic";

type Bag = { roast_date: string | null; coffees: { name: string | null } | null } | null;
type EquipRow = { id: string; name: string | null; equipment_categories: { name: string } | null };

type Phase = "confirm" | "postbrew" | "make" | "tasting";
const PHASES: Phase[] = ["confirm", "postbrew", "make", "tasting"];

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ phase?: string; from?: string }>;
}) {
  const { id } = await params;
  const { phase: phaseParam, from } = await searchParams;
  const initialPhase: Phase = PHASES.includes(phaseParam as Phase) ? (phaseParam as Phase) : "confirm";
  // Context-aware back: honor an internal entry path, else default to the Sessions list.
  const backHref = from && from.startsWith("/") ? from : "/sessions";
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

  const { data: categories } = await supabase
    .from("tasting_categories")
    .select("id, slug, display, guidance, sort_order")
    .order("sort_order");

  let bagEvents: Pick<CoffeeBagStatusEvent, "status" | "changed_at">[] = [];
  if (session.coffee_bag_id) {
    const { data: evs } = await supabase
      .from("coffee_bag_status_events")
      .select("status, changed_at")
      .eq("coffee_bag_id", session.coffee_bag_id);
    bagEvents = (evs ?? []) as Pick<CoffeeBagStatusEvent, "status" | "changed_at">[];
  }

  return (
    <SessionDetail
      session={session}
      coffeeName={session.coffee_bags?.coffees?.name ?? null}
      roastDate={session.coffee_bags?.roast_date ?? null}
      bagEvents={bagEvents}
      brewMethods={(brewMethods ?? []) as BrewMethod[]}
      equipment={equipment}
      categories={(categories ?? []) as TastingCategory[]}
      initialPhase={initialPhase}
      backHref={backHref}
    />
  );
}
