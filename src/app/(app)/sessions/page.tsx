import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  status: "active" | "complete";
  recipe_type: "brewed_coffee" | "specialty_drink";
  created_at: string;
  brewed_at: string | null;
  coffee_bags: { coffees: { name: string | null } | null } | null;
  recipes: { name: string | null } | null;
};

function Item({ s }: { s: Row }) {
  const title =
    s.coffee_bags?.coffees?.name ??
    s.recipes?.name ??
    (s.recipe_type === "specialty_drink" ? "Specialty drink" : "Session");
  const date = s.brewed_at ?? s.created_at;
  return (
    <li>
      <Link
        href={`/sessions/${s.id}`}
        className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 hover:bg-accent"
      >
        <span className="flex items-center gap-2">
          <span className="font-medium">{title}</span>
          <span className="text-sm text-muted-foreground">
            {date ? new Date(date).toLocaleDateString() : ""}
          </span>
        </span>
        <Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge>
      </Link>
    </li>
  );
}

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sessions")
    .select("id, status, recipe_type, created_at, brewed_at, coffee_bags(coffees(name)), recipes(name)")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as unknown as Row[];
  const active = rows.filter((r) => r.status === "active");
  const history = rows.filter((r) => r.status === "complete");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
        <Button asChild size="sm">
          <Link href="/sessions/new">
            <Plus className="size-4" />
            Start a session
          </Link>
        </Button>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Active</h2>
        {active.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active sessions.</p>
        ) : (
          <ul className="flex flex-col gap-2">{active.map((s) => <Item key={s.id} s={s} />)}</ul>
        )}
      </section>

      {history.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">History</h2>
          <ul className="flex flex-col gap-2">{history.map((s) => <Item key={s.id} s={s} />)}</ul>
        </section>
      )}
    </div>
  );
}
