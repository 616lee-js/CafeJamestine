import { createClient } from "@/lib/supabase/server";
import { SessionsBrowser, type SessionRow } from "./sessions-browser";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  status: "active" | "complete";
  recipe_type: "brewed_coffee" | "specialty_drink";
  created_at: string;
  brewed_at: string | null;
  coffee_bags: { coffees: { name: string | null } | null } | null;
  recipes: { name: string | null } | null;
  brew_methods: { name: string | null } | null;
  tastings: { overall_rating: number | null }[] | null;
};

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sessions")
    .select(
      "id, status, recipe_type, created_at, brewed_at, coffee_bags(coffees(name)), recipes(name), brew_methods(name), tastings(overall_rating)",
    )
    .order("created_at", { ascending: false });

  const rows: SessionRow[] = ((data ?? []) as unknown as Row[]).map((s) => ({
    id: s.id,
    status: s.status,
    recipe_type: s.recipe_type,
    created_at: s.created_at,
    brewed_at: s.brewed_at,
    title:
      s.coffee_bags?.coffees?.name ??
      s.recipes?.name ??
      (s.recipe_type === "specialty_drink" ? "Specialty drink" : "Session"),
    method: s.brew_methods?.name ?? null,
    rating: s.tastings?.[0]?.overall_rating ?? null,
  }));

  return <SessionsBrowser rows={rows} />;
}
