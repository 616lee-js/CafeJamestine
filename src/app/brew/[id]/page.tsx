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

  // Brew mode is read from a mount mid-pour, so the whole recipe must be visible at a glance.
  // The page is locked to the viewport and nothing scrolls: the steps region takes whatever is
  // left over and its type scales with the step count. 100cqh is the steps list's own height, so
  // dividing by the number of steps gives each row its share — clamped so a 4-step recipe is
  // never blown up past the design system's brew sizes, and a 10-step one never shrinks to
  // illegible. Real recipes here run 4-10 steps.
  // Coefficients calibrated against the real recipes here (4-10 steps, descriptions averaging
  // 42 chars but reaching 83, which wraps to two lines at full size). At 4-6 steps every
  // viewport lands on the design system's full brew sizes - 24px description, 32px timestamp -
  // with room for a two-line wrap. At 10 steps the type shrinks rather than the page scrolling.
  const stepTime = "clamp(0.85rem, calc(46cqh / var(--n)), 2rem)";
  const stepText = "clamp(0.8rem, calc(28cqh / var(--n)), 1.5rem)";
  const stepPadY = "clamp(0.15rem, calc(9cqh / var(--n)), 0.875rem)";

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-8 py-3">
        <Link
          href={`/sessions/${id}`}
          className="flex items-center gap-2 text-base text-muted-foreground hover:text-heading"
        >
          <ArrowLeft className="size-5" />
          Back to Plan
        </Link>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2 rounded-full bg-phase-brew" />
          <span className="text-sm font-semibold uppercase tracking-wide text-phase-brew">
            Brew
          </span>
        </span>
      </header>

      <main className="mx-auto flex w-full min-h-0 max-w-[var(--brew-measure)] flex-1 flex-col gap-4 px-8 py-4">
        {/* Title and method share one baseline row. You already know what you are brewing, so
            the vertical space is worth more to the steps than to a 44px heading. */}
        <div className="flex shrink-0 flex-wrap items-baseline gap-x-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-heading">
            {title}
          </h1>
          {subtitle && <p className="text-base text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Parameter tiles — the numbers you read from across the bar. Caption and value sit on
            one line so the tiles cost ~70px instead of ~112px. */}
        <div className="grid shrink-0 grid-cols-2 gap-3 min-[60rem]:grid-cols-4">
          {params_.map((p) => (
            <div
              key={p.caption}
              className="flex items-baseline justify-between gap-2 rounded-3xl border border-border bg-card px-5 py-3"
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

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <span className="shrink-0 text-brew-label font-semibold uppercase tracking-wide text-muted-foreground">
            Pour steps
          </span>
          {steps.length === 0 ? (
            <p className="text-brew-step text-muted-foreground">No steps recorded.</p>
          ) : (
            <ol
              className="grid min-h-0 flex-1 gap-2 [container-type:size]"
              style={
                {
                  "--n": steps.length,
                  gridTemplateRows: `repeat(${steps.length}, minmax(0, 1fr))`,
                } as React.CSSProperties
              }
            >
              {steps.map((s) => (
                <li
                  key={s.id}
                  className="grid min-h-0 grid-cols-[5.5rem_1fr_auto] items-center gap-4 overflow-hidden rounded-3xl border border-border bg-card px-5"
                  style={{ paddingBlock: stepPadY }}
                >
                  <span
                    className="font-display font-semibold tabular-nums text-phase-brew"
                    style={{ fontSize: stepTime, lineHeight: 1.1 }}
                  >
                    {secondsToMMSS(s.timestamp_seconds) || "—"}
                  </span>
                  {/* Two lines max: a long step shrinks the row rather than pushing the list
                      past the viewport and reintroducing the scroll this screen must not have. */}
                  <span
                    className="line-clamp-2 text-heading"
                    style={{ fontSize: stepText, lineHeight: 1.25 }}
                  >
                    {s.description}
                  </span>
                  <span
                    className="whitespace-nowrap text-right font-semibold tabular-nums text-muted-foreground"
                    style={{ fontSize: stepText, lineHeight: 1.25 }}
                  >
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

      <footer className="shrink-0 border-t border-border bg-background px-8 py-3">
        <div className="mx-auto w-full max-w-[var(--brew-measure)]">
          <CompleteButton sessionId={id} recipeType={session.recipe_type} />
        </div>
      </footer>
    </div>
  );
}
