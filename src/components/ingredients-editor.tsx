"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { RecipeIngredient } from "@/lib/db-types";
import { ReferenceSelect } from "@/components/reference-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Item = RecipeIngredient & { unitName: string | null };
const MULTIPLIERS = [1, 2, 3, 4];
const scale = (q: number, m: number) => Math.round(q * m * 10) / 10;

export function IngredientsEditor({
  parentField,
  parentId,
  readOnly = false,
  showMultiplier = false,
}: {
  parentField: "recipe_id" | "session_id";
  parentId: string;
  readOnly?: boolean;
  showMultiplier?: boolean;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [mult, setMult] = useState(1);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("recipe_ingredients")
      .select("*, units(name)")
      .eq(parentField, parentId)
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });
    const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
    setItems(
      rows.map((r) => ({
        ...(r as unknown as RecipeIngredient),
        unitName: (r.units as { name: string | null } | null)?.name ?? null,
      })),
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentField, parentId]);

  async function addItem() {
    const supabase = createClient();
    const nextPos = items.reduce((m, i) => Math.max(m, i.position ?? 0), 0) + 1;
    const { error } = await supabase
      .from("recipe_ingredients")
      .insert({ [parentField]: parentId, position: nextPos });
    if (error) return toast.error(error.message);
    load();
  }

  async function update(id: string, patch: Partial<RecipeIngredient>, unitName?: string | null) {
    const supabase = createClient();
    const { error } = await supabase.from("recipe_ingredients").update(patch).eq("id", id);
    if (error) return toast.error(`Save failed: ${error.message}`);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch, unitName: unitName ?? i.unitName } : i)),
    );
  }

  async function remove(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("recipe_ingredients").delete().eq("id", id);
    if (error) return toast.error(`Delete failed: ${error.message}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[index], b = items[j];
    const posA = a.position ?? index + 1, posB = b.position ?? j + 1;
    const supabase = createClient();
    await supabase.from("recipe_ingredients").update({ position: posB }).eq("id", a.id);
    await supabase.from("recipe_ingredients").update({ position: posA }).eq("id", b.id);
    const next = [...items];
    next[index] = { ...b, position: posA };
    next[j] = { ...a, position: posB };
    next.sort((x, y) => (x.position ?? 0) - (y.position ?? 0));
    setItems(next);
  }

  if (readOnly) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ingredients</h2>
          {showMultiplier && items.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="mr-1 text-xs text-muted-foreground">Batch</span>
              {MULTIPLIERS.map((m) => (
                <Button key={m} size="sm" variant={mult === m ? "default" : "outline"} className="h-7 px-2" onClick={() => setMult(m)}>
                  {m}×
                </Button>
              ))}
            </div>
          )}
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">None.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                <span>{i.name || "—"}</span>
                <span className="text-muted-foreground">
                  {i.quantity != null ? `${scale(i.quantity, mult)}${i.unitName ? " " + i.unitName : ""}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
        {mult !== 1 && <p className="text-xs text-muted-foreground">Showing {mult}× batch — recipe unchanged.</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        <Button size="sm" variant="outline" onClick={addItem}>
          <Plus className="size-4" />
          Add ingredient
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing yet.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {items.map((item, i) => (
            <IngredientRow
              key={item.id}
              index={i}
              count={items.length}
              item={item}
              onUpdate={update}
              onDelete={remove}
              onMove={move}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

function IngredientRow({
  index,
  count,
  item,
  onUpdate,
  onDelete,
  onMove,
}: {
  index: number;
  count: number;
  item: Item;
  onUpdate: (id: string, patch: Partial<RecipeIngredient>, unitName?: string | null) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, dir: -1 | 1) => void;
}) {
  const [name, setName] = useState(item.name ?? "");
  const [qty, setQty] = useState(item.quantity?.toString() ?? "");

  return (
    <li className="flex items-start gap-2 rounded-lg border border-border p-2">
      <div className="flex flex-col">
        <Button type="button" variant="ghost" size="icon" className="size-6" disabled={index === 0} onClick={() => onMove(index, -1)} aria-label="Move up">
          <ArrowUp className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-6" disabled={index === count - 1} onClick={() => onMove(index, 1)} aria-label="Move down">
          <ArrowDown className="size-3.5" />
        </Button>
      </div>
      <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_5rem_8rem]">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Ingredient</Label>
          <Input value={name} placeholder="e.g. Whole milk" onChange={(e) => setName(e.target.value)} onBlur={() => onUpdate(item.id, { name: name.trim() || null })} className="h-10" />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Quantity</Label>
          <Input inputMode="decimal" value={qty} placeholder="e.g. 120" onChange={(e) => setQty(e.target.value)} onBlur={() => { const n = qty.trim() === "" ? null : Number(qty); onUpdate(item.id, { quantity: Number.isFinite(n as number) ? n : null }); }} className="h-10" />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Unit</Label>
          <ReferenceSelect table="units" value={item.unit_id} valueName={item.unitName} onChange={(id, nm) => onUpdate(item.id, { unit_id: id }, nm)} placeholder="unit" />
        </div>
      </div>
      <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-destructive" onClick={() => onDelete(item.id)} aria-label="Delete">
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}
