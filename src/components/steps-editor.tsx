"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { RecipeStep, RecipeType } from "@/lib/db-types";
import { secondsToMMSS, mmssToSeconds } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const num = (s: string): number | null => {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

// Ordered steps belonging to EITHER a recipe or a session (exactly one parent).
export function StepsEditor({
  parentField,
  parentId,
  mode,
  readOnly = false,
}: {
  parentField: "recipe_id" | "session_id";
  parentId: string;
  mode: RecipeType;
  readOnly?: boolean;
}) {
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("recipe_steps")
      .select("*")
      .eq(parentField, parentId)
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });
    setSteps((data ?? []) as RecipeStep[]);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentField, parentId]);

  async function addStep() {
    const supabase = createClient();
    const nextPos = steps.reduce((m, s) => Math.max(m, s.position ?? 0), 0) + 1;
    const { error } = await supabase
      .from("recipe_steps")
      .insert({ [parentField]: parentId, position: nextPos });
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
    const supabase = createClient();
    await supabase.from("recipe_steps").update({ position: posB }).eq("id", a.id);
    await supabase.from("recipe_steps").update({ position: posA }).eq("id", b.id);
    const next = [...steps];
    next[index] = { ...b, position: posA };
    next[j] = { ...a, position: posB };
    next.sort((x, y) => (x.position ?? 0) - (y.position ?? 0));
    setSteps(next);
  }

  const brewed = mode === "brewed_coffee";

  if (readOnly) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{brewed ? "Steps" : "Steps"}</h2>
        {steps.length === 0 ? (
          <p className="text-sm text-muted-foreground">None.</p>
        ) : brewed ? (
          // Brewed-coffee steps render as a structured table.
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Time</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                  <th className="px-3 py-2 font-medium">Total weight</th>
                  <th className="px-3 py-2 font-medium">Flow rate</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 tabular-nums">{secondsToMMSS(s.timestamp_seconds) || "—"}</td>
                    <td className="px-3 py-2">{s.description || "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{s.target_weight_grams != null ? `${s.target_weight_grams} g` : "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{s.flow_rate_ml_s != null ? `${s.flow_rate_ml_s} ml/s` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Specialty prose steps render as an ordered list.
          <ol className="flex flex-col gap-2">
            {steps.map((s, i) => (
              <li key={s.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                <span className="mr-2 font-medium text-muted-foreground">{i + 1}.</span>
                {s.description}
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{brewed ? "Steps" : "Ingredients & steps"}</h2>
        <Button size="sm" variant="outline" onClick={addStep}>
          <Plus className="size-4" />
          {brewed ? "Add step" : "Add line"}
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
              brewed={brewed}
              onUpdate={updateStep}
              onDelete={deleteStep}
              onMove={move}
              numParse={num}
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
  brewed,
  onUpdate,
  onDelete,
  onMove,
  numParse,
}: {
  index: number;
  count: number;
  step: RecipeStep;
  brewed: boolean;
  onUpdate: (id: string, patch: Partial<RecipeStep>) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  numParse: (s: string) => number | null;
}) {
  const [time, setTime] = useState(secondsToMMSS(step.timestamp_seconds));
  const [tw, setTw] = useState(step.target_weight_grams?.toString() ?? "");
  const [flow, setFlow] = useState(step.flow_rate_ml_s?.toString() ?? "");
  const [desc, setDesc] = useState(step.description ?? "");

  // Masked m:ss — digits format from the right (345 → 3:45), iPad keypad friendly.
  function maskTime(raw: string) {
    const d = raw.replace(/\D/g, "").slice(0, 4);
    if (d === "") return setTime("");
    const s = d.slice(-2).padStart(2, "0");
    const m = d.slice(0, -2);
    setTime(`${m === "" ? "0" : String(parseInt(m, 10))}:${s}`);
  }

  return (
    <li className="flex items-start gap-2 rounded-lg border border-border p-2">
      <span className="mt-2 w-5 text-center text-sm text-muted-foreground">{index + 1}</span>
      <div className="flex flex-col">
        <Button type="button" variant="ghost" size="icon" className="size-6" disabled={index === 0} onClick={() => onMove(index, -1)} aria-label="Move up">
          <ArrowUp className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-6" disabled={index === count - 1} onClick={() => onMove(index, 1)} aria-label="Move down">
          <ArrowDown className="size-3.5" />
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {brewed && (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Time (from start)</Label>
              <Input inputMode="numeric" placeholder="m:ss" value={time} onChange={(e) => maskTime(e.target.value)} onBlur={() => onUpdate(step.id, { timestamp_seconds: time.trim() === "" ? null : mmssToSeconds(time) })} className="h-10" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">To weight (g)</Label>
              <Input inputMode="decimal" placeholder="e.g. 50" value={tw} onChange={(e) => setTw(e.target.value)} onBlur={() => onUpdate(step.id, { target_weight_grams: numParse(tw) })} className="h-10" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Flow (ml/s)</Label>
              <Input inputMode="decimal" placeholder="optional" value={flow} onChange={(e) => setFlow(e.target.value)} onBlur={() => onUpdate(step.id, { flow_rate_ml_s: numParse(flow) })} className="h-10" />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">
            {brewed ? "Technique / description" : "Ingredient or step"}
          </Label>
          <Textarea
            placeholder={brewed ? "e.g. center pour, slow" : "e.g. 18 g espresso, then 120 g steamed milk"}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={() => onUpdate(step.id, { description: desc.trim() || null })}
            className="min-h-10"
          />
        </div>
      </div>
      <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-destructive" onClick={() => onDelete(step.id)} aria-label="Delete">
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}
