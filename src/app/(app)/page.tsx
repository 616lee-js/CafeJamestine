import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type ResumeRow = {
  id: string;
  recipe_type: "brewed_coffee" | "specialty_drink";
  coffee_bags: { coffees: { name: string | null } | null } | null;
  recipes: { name: string | null } | null;
};

const AREAS = [
  { href: "/coffees", label: "Coffees" },
  { href: "/sessions", label: "Sessions" },
  { href: "/recipes", label: "Recipes" },
];

// Landing — a pure launchpad. Hero starts a session; a quiet Resume appears only when a
// session is active; plain area cards; a reserved (empty) insight slot for a later dashboard.
export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("sessions")
    .select("id, recipe_type, coffee_bags(coffees(name)), recipes(name)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);
  const resume = ((data ?? []) as unknown as ResumeRow[])[0] ?? null;
  const resumeTitle = resume
    ? resume.coffee_bags?.coffees?.name ??
      resume.recipes?.name ??
      (resume.recipe_type === "specialty_drink" ? "Specialty drink" : "Session")
    : null;

  return (
    <div className="flex flex-col gap-10">
      {/* Act zone — landscape two-column: hero + quiet resume left, reserved slot right */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Café Jamestine</h1>
          <Button asChild size="lg" className="h-14 px-8 text-base">
            <Link href="/sessions/new">
              <Play className="size-5" />
              Start a session
            </Link>
          </Button>
          {resume && (
            <Link
              href={`/sessions/${resume.id}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Resume active session{resumeTitle ? ` · ${resumeTitle}` : ""}
            </Link>
          )}
        </div>

        {/* Reserved insight region — intentionally empty until a dashboard lands here. */}
        <div
          aria-hidden
          className="hidden min-h-40 rounded-lg border border-dashed border-border lg:block"
        />
      </div>

      {/* Area cards — plain entry points, no counts or activity. */}
      <div className="grid gap-3 sm:grid-cols-3">
        {AREAS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-4 font-medium hover:bg-accent"
          >
            {a.label}
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
