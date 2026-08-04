import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

type ResumeRow = {
  id: string;
  recipe_type: "brewed_coffee" | "specialty_drink";
  coffee_bags: { coffees: { name: string | null } | null } | null;
  recipes: { name: string | null } | null;
};

const AREAS = [
  { href: "/coffees", label: "Coffees", description: "Beans, bags and their history" },
  { href: "/sessions", label: "Sessions", description: "Every brew, planned and reflected on" },
  { href: "/recipes", label: "Recipes", description: "Reusable parameter templates" },
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
    <div className="flex flex-col gap-12">
      {/* Act zone — landscape two-column: hero + quiet resume left, reserved slot right */}
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-5 pt-6">
          <Logo size={60} />
          <h1 className="text-4xl leading-[1.05] tracking-tight">Café Jamestine</h1>
          {/* The only hero-size button in the app. Contained, not stretched. */}
          <Button asChild size="hero">
            <Link href="/sessions/new">
              <Play />
              Start a session
            </Link>
          </Button>
          {/* A soft reminder — it must never compete with the hero. */}
          {resume && (
            <Link
              href={`/sessions/${resume.id}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-heading hover:underline"
            >
              Resume active session{resumeTitle ? ` · ${resumeTitle}` : ""}
            </Link>
          )}
        </div>

        {/* Reserved insight region — intentionally empty until a dashboard lands here. */}
        <div className="hidden min-h-60 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[var(--slate-300)] bg-surface-sunken lg:flex">
          <span className="eyebrow">Insights</span>
          <p className="text-sm text-muted-foreground">Reserved for a dashboard.</p>
        </div>
      </div>

      {/* Area cards — plain entry points, no counts or activity. */}
      <div className="grid gap-4 sm:grid-cols-3">
        {AREAS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-6 py-5 shadow-sm transition-colors hover:bg-surface-selected"
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-lg font-semibold tracking-snug text-heading">
                {a.label}
              </span>
              <span className="text-sm text-muted-foreground">{a.description}</span>
            </span>
            <ArrowRight className="size-[18px] shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
