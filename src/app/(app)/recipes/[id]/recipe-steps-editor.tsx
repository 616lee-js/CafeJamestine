"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { RecipeStep, RecipeType } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const num = (s: string): number | null => {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

export function RecipeStepsEditor({
  recipeId,
  mode,
}: {
  recipeId: string;
  mode: RecipeType;
}) {
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("recipe_steps")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });
    setSteps((data ?? []) as RecipeStep[]);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  async function addStep() {
    const supabase = createClient();
    const nextPos =
      steps.reduce((m, s) => Math.max(m, s.position ?? 0), 0) + 1;
    const { error } = await supabase
      .from("recipe_steps")
      .insert({ recipe_id: recipeId, position: nextPos });
    if (error) return toast.error(error.message);
    load();
  }

  async function updateStep(id: string, patch: Partial<RecipeStep>) {
    const supabase = createClient();
    const { error } = await supabase.from("recipe_steps").update(patch).eq("id", id);
    if (error) return toast.error(`Save failed: ${error.message}`);
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function deleteStep(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("recipe_steps").delete().eq("id", id);
    if (error) return toast.error(`Delete failed: ${error.message}`);
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= steps.length) return;
    const a = steps[index];
    const b = steps[j];
    const posA = a.position ?? index + 1;
    const posB = b.position ?? j + 1;
    // swap positions
    const supabase = createClient();
    await supabase.from("recipe_steps").update({ position: posB }).eq("id", a.id);
    await supabase.from("recipe_steps").update({ position: posA }).eq("id", b.id);
    const next = [...steps];
    next[index] = { ...b, position: posA };
    next[j] = { ...a, position: posB };
    // keep array ordered by new positions
    next.sort((x, y) => (x.position ?? 0) - (y.position ?? 0));
    setSteps(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === "brewed_coffee" ? "Steps" : "Ingredients & steps"}
        </h2>
        <Button size="sm" variant="outline" onClick={addStep}>
          <Plus className="size-4" />
          {mode === "brewed_coffee" ? "Add step" : "Add line"}
        </Button>
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing yet.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {steps.map((step, i) => (
            <StepRow
              key={step.id}
              index={i}
              count={steps.length}
              step={step}
              mode={mode}
              onUpdate={updateStep}
              onDelete={deleteStep}
              onMove={move}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

function StepRow({
  index,
  count,
  step,
  mode,
  onUpdate,
  onDelete,
  onMove,
}: {
  index: number;
  count: number;
  step: RecipeStep;
  mode: RecipeType;
  onUpdate: (id: string, patch: Partial<RecipeStep>) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, dir: -1 | 1) => void;
}) {
  const [ts, setTs] = useState(step.timestamp_seconds?.toString() ?? "");
  const [tw, setTw] = useState(step.target_weight_grams?.toString() ?? "");
  const [flow, setFlow] = useState(step.flow_rate_ml_s?.toString() ?? "");
  const [desc, setDesc] = useState(step.description ?? "");

  const moveCtrls = (
    <div className="flex flex-col">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-6"
        disabled={index === 0}
        onClick={() => onMove(index, -1)}
        aria-label="Move up"
      >
        <ArrowUp className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-6"
        disabled={index === count - 1}
        onClick={() => onMove(index, 1)}
        aria-label="Move down"
      >
        <ArrowDown className="size-3.5" />
      </Button>
    </div>
  );

  return (
    <li className="flex items-start gap-2 rounded-lg border border-border p-2">
      <span className="mt-2 w-5 text-center text-sm text-muted-foreground">
        {index + 1}
      </span>
      {moveCtrls}
      <div className="flex flex-1 flex-col gap-2">
        {mode === "brewed_coffee" && (
          <div className="grid grid-cols-3 gap-2">
            <Input
              inputMode="decimal"
              placeholder="Time s"
              value={ts}
              onChange={(e) => setTs(e.target.value)}
              onBlur={() => onUpdate(step.id, { timestamp_seconds: num(ts) })}
              className="h-10"
            />
            <Input
              inputMode="decimal"
              placeholder="To weight g"
              value={tw}
              onChange={(e) => setTw(e.target.value)}
              onBlur={() => onUpdate(step.id, { target_weight_grams: num(tw) })}
              className="h-10"
            />
            <Input
              inputMode="decimal"
              placeholder="Flow ml/s"
              value={flow}
              onChange={(e) => setFlow(e.target.value)}
              onBlur={() => onUpdate(step.id, { flow_rate_ml_s: num(flow) })}
              className="h-10"
            />
          </div>
        )}
        <Textarea
          placeholder={
            mode === "brewed_coffee"
              ? "Technique / description"
              : "Ingredient or step (e.g. 18g espresso, then steam 120g milk)"
          }
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={() => onUpdate(step.id, { description: desc.trim() || null })}
          className="min-h-10"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-destructive"
        onClick={() => onDelete(step.id)}
        aria-label="Delete"
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}
