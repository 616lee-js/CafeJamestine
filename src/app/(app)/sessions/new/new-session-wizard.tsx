"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coffee, GlassWater } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { RecipeType } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { createSession } from "../actions";

type ActiveCoffee = { coffeeId: string; name: string; activeBagId: string };
type RecipeOpt = { id: string; name: string | null; is_standard: boolean; coffee: string | null };
type SessionOpt = { id: string; date: string | null };

export function NewSessionWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipeType, setRecipeType] = useState<RecipeType | null>(null);
  const [coffee, setCoffee] = useState<ActiveCoffee | null>(null);
  const [busy, setBusy] = useState(false);

  const [activeCoffees, setActiveCoffees] = useState<ActiveCoffee[]>([]);
  const [recipes, setRecipes] = useState<RecipeOpt[]>([]);
  const [sessions, setSessions] = useState<SessionOpt[]>([]);

  // load active-bag coffees when entering the coffee step
  useEffect(() => {
    if (step !== 2) return;
    const supabase = createClient();
    supabase
      .from("coffee_bags")
      .select("id, coffee_id, coffees(name)")
      .eq("status", "active")
      .then(({ data }) => {
        const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
        const map = new Map<string, ActiveCoffee>();
        for (const r of rows) {
          const cid = String(r.coffee_id);
          const name = (r.coffees as { name: string | null } | null)?.name ?? "Untitled coffee";
          if (!map.has(cid)) map.set(cid, { coffeeId: cid, name, activeBagId: String(r.id) });
        }
        setActiveCoffees([...map.values()]);
      });
  }, [step]);

  // load sources when entering the source step
  useEffect(() => {
    if (step !== 3 || !recipeType) return;
    const supabase = createClient();
    supabase
      .from("recipes")
      .select("id, name, is_standard, coffees(name)")
      .eq("recipe_type", recipeType)
      .order("name")
      .then(({ data }) => {
        const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
        setRecipes(
          rows.map((r) => ({
            id: String(r.id),
            name: (r.name as string | null) ?? null,
            is_standard: Boolean(r.is_standard),
            coffee: (r.coffees as { name: string | null } | null)?.name ?? null,
          })),
        );
      });

    const sessionsQuery =
      recipeType === "brewed_coffee" && coffee
        ? supabase
            .from("sessions")
            .select("id, created_at, brewed_at, coffee_bags!inner(coffee_id)")
            .eq("recipe_type", "brewed_coffee")
            .eq("coffee_bags.coffee_id", coffee.coffeeId)
            .order("created_at", { ascending: false })
        : supabase
            .from("sessions")
            .select("id, created_at, brewed_at")
            .eq("recipe_type", recipeType)
            .order("created_at", { ascending: false })
            .limit(20);
    sessionsQuery.then(({ data }) => {
      const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
      setSessions(
        rows.map((r) => ({
          id: String(r.id),
          date: (r.brewed_at as string | null) ?? (r.created_at as string | null) ?? null,
        })),
      );
    });
  }, [step, recipeType, coffee]);

  function chooseType(t: RecipeType) {
    setRecipeType(t);
    setStep(t === "brewed_coffee" ? 2 : 3);
  }

  async function start(source: "new" | "session" | "recipe", sourceId?: string) {
    if (!recipeType) return;
    setBusy(true);
    try {
      await createSession({
        recipeType,
        coffeeBagId: recipeType === "brewed_coffee" ? (coffee?.activeBagId ?? null) : null,
        source,
        sourceId: sourceId ?? null,
      });
    } catch (e) {
      setBusy(false);
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/sessions" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Sessions
        </Link>
        {step > 1 && (
          <Button variant="ghost" size="sm" onClick={() => setStep(step === 3 && recipeType === "brewed_coffee" ? 2 : 1)} disabled={busy}>
            Back
          </Button>
        )}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Start a session</h1>
          <p className="text-sm text-muted-foreground">What are you making? (This sets the type — permanent.)</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="h-auto flex-col gap-2 py-6" onClick={() => chooseType("brewed_coffee")}>
              <Coffee className="size-7" />
              <span className="font-medium">Brewed coffee</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6" onClick={() => chooseType("specialty_drink")}>
              <GlassWater className="size-7" />
              <span className="font-medium">Specialty drink</span>
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Select coffee</h1>
          <p className="text-sm text-muted-foreground">Only coffees with an Active bag can be brewed.</p>
          {activeCoffees.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No coffees have an Active bag. Set a bag to Active on a coffee first.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {activeCoffees.map((c) => (
                <li key={c.coffeeId}>
                  <button
                    type="button"
                    onClick={() => { setCoffee(c); setStep(3); }}
                    className="w-full rounded-lg border border-border px-4 py-3 text-left font-medium hover:bg-accent"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Parameter source</h1>
            <p className="text-sm text-muted-foreground">
              {recipeType === "brewed_coffee" ? `Brewed coffee${coffee ? ` · ${coffee.name}` : ""}` : "Specialty drink"}
            </p>
          </div>

          <Button onClick={() => start("new")} disabled={busy} className="w-full justify-start">
            Build new (blank)
          </Button>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Clone a recipe</h2>
            {recipes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recipes of this type.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {recipes.map((r) => (
                  <li key={r.id}>
                    <button type="button" disabled={busy} onClick={() => start("recipe", r.id)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg border border-border px-4 py-3 text-left hover:bg-accent disabled:opacity-50">
                      <span className="font-medium">{r.name || "Untitled recipe"}</span>
                      <span className="text-sm text-muted-foreground">{r.is_standard ? "standard" : r.coffee}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Clone a prior session</h2>
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No prior sessions.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <button type="button" disabled={busy} onClick={() => start("session", s.id)}
                      className="w-full rounded-lg border border-border px-4 py-3 text-left hover:bg-accent disabled:opacity-50">
                      Session — {s.date ? new Date(s.date).toLocaleDateString() : "draft"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
