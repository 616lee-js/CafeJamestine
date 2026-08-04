import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { RecipeStep, Session } from "@/lib/db-types";
import { secondsToMMSS } from "@/lib/format";
import { CompleteButton } from "./complete-button";

export const dynamic = "force-dynamic";

type Joined = Session & {
  coffee_bags: { coffees: { name: string | null } | null } | null;
  recipes: { name: string | null } | null;
  brew_methods: { name: string | null } | null;
};

// Full-screen brew reference, read from an eye-level mount at 1–2 feet. Read-only: no
// inputs, and no timer — the user's own equipment owns timing.
export default async function BrewPage({
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
    .select("*, coffee_bags(coffees(name)), recipes(name), brew_methods(name)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const session = data as unknown as Joined;

  // Specialty drinks are made inside the workflow (the Make phase), not on the mount.
  if (session.recipe_type === "specialty_drink") {
    redirect(`/sessions/${id}?phase=make`);
  }

  const { data: grinder } = session.grinder_id
    ? await supabase.from("equipment").select("name").eq("id", session.grinder_id).maybeSingle()
    : { data: null };

  const { data: stepRows } = await supabase
    .from("recipe_steps")
    .select("*")
    .eq("session_id", id)
    .order("position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  const steps = (stepRows ?? []) as RecipeStep[];

  const title =
    session.coffee_bags?.coffees?.name ?? session.recipes?.name ?? "Session";
  const subtitle = [session.brew_methods?.name, grinder?.name].filter(Boolean).join(" · ");

  const params_ = [
    { caption: "Dose", value: session.dose_grams, unit: "g" },
    { caption: "Water", value: session.water_grams, unit: "g" },
    { caption: "Temp", value: session.water_temp_celsius, unit: "°C" },
    { caption: "Grind", value: session.grind_setting, unit: null },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <Link
          href={`/sessions/${id}`}
          className="flex items-center gap-2 text-base text-muted-foreground hover:text-heading"
        >
          <ArrowLeft className="size-5" />
          Back to Plan
        </Link>
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2 rounded-full bg-phase-brew"
          />
          <span className="text-sm font-semibold uppercase tracking-wide text-phase-brew">
            Brew
          </span>
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-[var(--brew-measure)] flex-1 flex-col gap-10 px-8 pt-8 pb-40">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-brew-title font-semibold tracking-tight text-heading">
            {title}
          </h1>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Parameter tiles — the numbers you actually read from across the bar. */}
        <div className="grid grid-cols-2 gap-4 min-[60rem]:grid-cols-4">
          {params_.map((p) => (
            <div
              key={p.caption}
              className="flex flex-col gap-1 rounded-3xl border border-border bg-card px-6 py-5"
            >
              <span className="text-brew-label font-semibold uppercase tracking-wide text-muted-foreground">
                {p.caption}
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-brew-value font-semibold tabular-nums text-heading">
                  {p.value ?? "—"}
                </span>
                {p.unit && p.value != null && (
                  <span className="text-xl font-medium text-muted-foreground">{p.unit}</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-brew-label font-semibold uppercase tracking-wide text-muted-foreground">
            Pour steps
          </span>
          {steps.length === 0 ? (
            <p className="text-brew-step text-muted-foreground">No steps recorded.</p>
          ) : (
            <ol className="flex flex-col gap-5">
              {steps.map((s) => (
                <li
                  key={s.id}
                  className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-5 rounded-3xl border border-border bg-card px-6 py-4"
                >
                  <span className="font-display text-brew-time font-semibold tabular-nums text-phase-brew">
                    {secondsToMMSS(s.timestamp_seconds) || "—"}
                  </span>
                  <span className="text-brew-step text-heading">{s.description}</span>
                  <span className="text-right text-brew-step font-semibold tabular-nums text-muted-foreground">
                    {[
                      s.target_weight_grams != null ? `${s.target_weight_grams} g` : null,
                      s.flow_rate_ml_s != null ? `${s.flow_rate_ml_s} ml/s` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background/94 px-8 py-4 backdrop-blur-[10px]">
        <div className="mx-auto w-full max-w-[var(--brew-measure)]">
          <CompleteButton sessionId={id} recipeType={session.recipe_type} />
        </div>
      </footer>
    </div>
  );
}
