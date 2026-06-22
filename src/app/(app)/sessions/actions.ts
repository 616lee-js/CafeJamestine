"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CoffeeBagStatusEvent, RecipeType } from "@/lib/db-types";
import { daysRested } from "@/lib/compute";

// Embedded recipe-instance columns copied onto a session from a recipe/session source.
const INSTANCE_COLS = [
  "brew_method_id", "brewer_device_id", "grinder_id", "grind_setting",
  "dose_grams", "water_grams", "water_anchor", "water_temp_celsius",
  "bloom_grams", "bloom_seconds", "is_iced", "ice_grams",
] as const;
const STEP_COLS = [
  "position", "timestamp_seconds", "target_weight_grams", "flow_rate_ml_s", "description",
] as const;
const INGREDIENT_COLS = ["name", "quantity", "unit_id", "position"] as const;

export async function createSession({
  recipeType,
  coffeeBagId,
  source,
  sourceId,
}: {
  recipeType: RecipeType;
  coffeeBagId: string | null;
  source: "new" | "session" | "recipe";
  sourceId?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const base: Record<string, unknown> = {
    recipe_type: recipeType,
    status: "active",
    coffee_bag_id: coffeeBagId,
  };

  if (source === "recipe" && sourceId) {
    const { data } = await supabase
      .from("recipes")
      .select(INSTANCE_COLS.join(", "))
      .eq("id", sourceId)
      .maybeSingle();
    const rec = data as unknown as Record<string, unknown> | null;
    if (rec) for (const c of INSTANCE_COLS) base[c] = rec[c];
    base.recipe_breadcrumb_id = sourceId; // breadcrumb = the template
  } else if (source === "session" && sourceId) {
    const { data } = await supabase
      .from("sessions")
      .select([...INSTANCE_COLS, "recipe_breadcrumb_id"].join(", "))
      .eq("id", sourceId)
      .maybeSingle();
    const src = data as unknown as Record<string, unknown> | null;
    if (src) {
      for (const c of INSTANCE_COLS) base[c] = src[c];
      base.recipe_breadcrumb_id = src.recipe_breadcrumb_id ?? null; // carry the TEMPLATE forward
    }
  }

  const { data: created, error } = await supabase
    .from("sessions")
    .insert(base)
    .select("id")
    .single();
  if (error || !created) throw new Error(error?.message ?? "create failed");

  // Copy steps forward from the source (recipe_id or session_id).
  if (source !== "new" && sourceId) {
    const parentField = source === "recipe" ? "recipe_id" : "session_id";
    const { data: stepData } = await supabase
      .from("recipe_steps")
      .select(STEP_COLS.join(", "))
      .eq(parentField, sourceId)
      .order("position", { ascending: true });
    const steps = (stepData ?? []) as unknown as Array<Record<string, unknown>>;
    if (steps.length) {
      const rows = steps.map((s) => {
        const r: Record<string, unknown> = { session_id: created.id };
        for (const c of STEP_COLS) r[c] = s[c];
        return r;
      });
      await supabase.from("recipe_steps").insert(rows);
    }

    // Specialty drinks carry an ingredients list too (brewed sources have none → no-op).
    const { data: ingData } = await supabase
      .from("recipe_ingredients")
      .select(INGREDIENT_COLS.join(", "))
      .eq(parentField, sourceId)
      .order("position", { ascending: true });
    const ings = (ingData ?? []) as unknown as Array<Record<string, unknown>>;
    if (ings.length) {
      const rows = ings.map((s) => {
        const r: Record<string, unknown> = { session_id: created.id };
        for (const c of INGREDIENT_COLS) r[c] = s[c];
        return r;
      });
      await supabase.from("recipe_ingredients").insert(rows);
    }
  }

  redirect(`/sessions/${created.id}?new=1`);
}

// The single freeze point: snapshot days-rested + brewed_at and mark complete.
// Triggers (migration 0015) make the session immutable once status='complete'.
export async function completeSession(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("sessions")
    .select("coffee_bag_id")
    .eq("id", id)
    .maybeSingle();

  let snapshot: number | null = null;
  if (session?.coffee_bag_id) {
    const { data: bag } = await supabase
      .from("coffee_bags")
      .select("roast_date")
      .eq("id", session.coffee_bag_id)
      .maybeSingle();
    const { data: events } = await supabase
      .from("coffee_bag_status_events")
      .select("status, changed_at")
      .eq("coffee_bag_id", session.coffee_bag_id);
    snapshot = daysRested(
      bag?.roast_date ?? null,
      (events ?? []) as Pick<CoffeeBagStatusEvent, "status" | "changed_at">[],
    );
  }

  const { error } = await supabase
    .from("sessions")
    .update({
      status: "complete",
      brewed_at: new Date().toISOString(),
      days_rested_snapshot: snapshot,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/sessions/${id}`);
  redirect(`/sessions/${id}`);
}

// Clone-to-correct: copy a session (instance + steps + ingredients) into a new active session.
export async function cloneSession(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: src } = await supabase
    .from("sessions")
    .select(
      [...INSTANCE_COLS, "recipe_type", "coffee_bag_id", "recipe_breadcrumb_id"].join(", "),
    )
    .eq("id", id)
    .single();
  const s = src as unknown as Record<string, unknown>;

  const base: Record<string, unknown> = {
    recipe_type: s.recipe_type,
    status: "active",
    coffee_bag_id: s.coffee_bag_id ?? null,
    recipe_breadcrumb_id: s.recipe_breadcrumb_id ?? null,
  };
  for (const c of INSTANCE_COLS) base[c] = s[c];

  const { data: created, error } = await supabase
    .from("sessions")
    .insert(base)
    .select("id")
    .single();
  if (error || !created) throw new Error(error?.message ?? "clone failed");

  const { data: steps } = await supabase
    .from("recipe_steps")
    .select(STEP_COLS.join(", "))
    .eq("session_id", id);
  const sRows = (steps ?? []) as unknown as Array<Record<string, unknown>>;
  if (sRows.length) {
    await supabase.from("recipe_steps").insert(
      sRows.map((r) => {
        const o: Record<string, unknown> = { session_id: created.id };
        for (const c of STEP_COLS) o[c] = r[c];
        return o;
      }),
    );
  }
  const { data: ings } = await supabase
    .from("recipe_ingredients")
    .select(INGREDIENT_COLS.join(", "))
    .eq("session_id", id);
  const iRows = (ings ?? []) as unknown as Array<Record<string, unknown>>;
  if (iRows.length) {
    await supabase.from("recipe_ingredients").insert(
      iRows.map((r) => {
        const o: Record<string, unknown> = { session_id: created.id };
        for (const c of INGREDIENT_COLS) o[c] = r[c];
        return o;
      }),
    );
  }
  redirect(`/sessions/${created.id}?new=1`);
}

export async function deleteSession(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  // recipe_steps.session_id and tastings.session_id cascade on delete.
  await supabase.from("sessions").delete().eq("id", id);
  revalidatePath("/sessions");
  redirect("/sessions");
}
