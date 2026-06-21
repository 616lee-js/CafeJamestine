"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { TastingCategory } from "@/lib/db-types";
import { sessionOverall } from "@/lib/compute";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type EntryState = { id?: string; rating: number | null; notes: string };

export function TastingEditor({
  sessionId,
  categories,
  readOnly = false,
}: {
  sessionId: string;
  categories: TastingCategory[];
  readOnly?: boolean;
}) {
  const [tastingId, setTastingId] = useState<string | null>(null);
  const [override, setOverride] = useState<number | null>(null);
  const [entries, setEntries] = useState<Record<string, EntryState>>({});
  const tastingPromise = useRef<Promise<string> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: t } = await supabase
        .from("tastings")
        .select("id, overall_override")
        .eq("session_id", sessionId)
        .maybeSingle();
      if (!t) return;
      const { data: es } = await supabase
        .from("tasting_entries")
        .select("id, category_id, rating, notes")
        .eq("tasting_id", t.id);
      const map: Record<string, EntryState> = {};
      for (const e of (es ?? []) as Array<{ id: string; category_id: string; rating: number | null; notes: string | null }>) {
        map[e.category_id] = { id: e.id, rating: e.rating, notes: e.notes ?? "" };
      }
      setTastingId(t.id);
      setOverride((t as { overall_override: number | null }).overall_override);
      setEntries(map);
    })();
  }, [sessionId]);

  async function ensureTasting(): Promise<string> {
    if (tastingId) return tastingId;
    if (!tastingPromise.current) {
      tastingPromise.current = (async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("tastings")
          .insert({ session_id: sessionId })
          .select("id")
          .single();
        if (error || !data) throw new Error(error?.message ?? "tasting create failed");
        setTastingId(data.id);
        return data.id as string;
      })();
    }
    return tastingPromise.current;
  }

  async function writeEntry(categoryId: string, patch: Partial<EntryState>) {
    const supabase = createClient();
    const current = entries[categoryId] ?? { rating: null, notes: "" };
    const next = { ...current, ...patch };
    setEntries((p) => ({ ...p, [categoryId]: next }));
    try {
      const tid = await ensureTasting();
      if (next.id) {
        const { error } = await supabase
          .from("tasting_entries")
          .update({ rating: next.rating, notes: next.notes || null })
          .eq("id", next.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("tasting_entries")
          .insert({ tasting_id: tid, category_id: categoryId, rating: next.rating, notes: next.notes || null })
          .select("id")
          .single();
        if (error) throw error;
        setEntries((p) => ({ ...p, [categoryId]: { ...next, id: data.id } }));
      }
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    }
  }

  async function saveOverride(v: number | null) {
    setOverride(v);
    try {
      const tid = await ensureTasting();
      const supabase = createClient();
      await supabase.from("tastings").update({ overall_override: v }).eq("id", tid);
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    }
  }

  const ratings = categories.map((c) => entries[c.id]?.rating ?? null);
  const computed = sessionOverall(ratings, null);
  const effective = override ?? computed;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasting</h2>
        <div className="text-right text-sm">
          <div>
            <span className="text-muted-foreground">Overall </span>
            <span className="font-semibold">{effective ?? "—"}</span>
            {override != null && (
              <span className="text-muted-foreground"> (manual · computed {computed ?? "—"})</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((c) => {
          const e = entries[c.id] ?? { rating: null, notes: "" };
          return (
            <div key={c.id} className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{c.display}</span>
                <RatingControl
                  value={e.rating}
                  readOnly={readOnly}
                  onChange={(r) => writeEntry(c.id, { rating: r })}
                />
              </div>
              <p className="text-xs text-muted-foreground">{c.guidance}</p>
              {readOnly ? (
                e.notes ? <p className="whitespace-pre-wrap text-sm">{e.notes}</p> : null
              ) : (
                <NotesInput initial={e.notes} onCommit={(n) => writeEntry(c.id, { notes: n })} />
              )}
            </div>
          );
        })}
      </div>

      {!readOnly && (
        <div className="flex items-center gap-2">
          <Label className="text-sm">Override overall (1–10)</Label>
          <Input
            inputMode="decimal"
            defaultValue={override ?? ""}
            placeholder="optional"
            onBlur={(ev) => {
              const v = ev.target.value.trim();
              const n = v === "" ? null : Number(v);
              saveOverride(n != null && Number.isFinite(n) ? n : null);
            }}
            className="h-10 w-24"
          />
        </div>
      )}

      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer">SCA flavor wheel (reference)</summary>
        <p className="pt-1">
          Use the SCA flavor wheel to help name notes (fruity, floral, nutty/cocoa, spices,
          etc.) — a writing aid, not a required structure.
        </p>
      </details>
    </div>
  );
}

function RatingControl({
  value,
  onChange,
  readOnly,
}: {
  value: number | null;
  onChange: (r: number | null) => void;
  readOnly: boolean;
}) {
  if (readOnly) {
    return <span className="text-sm text-muted-foreground">{value != null ? `${value}/5` : "—"}</span>;
  }
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Button
          key={n}
          type="button"
          size="icon"
          variant={value === n ? "default" : "outline"}
          className="size-8"
          onClick={() => onChange(value === n ? null : n)}
        >
          {n}
        </Button>
      ))}
    </div>
  );
}

function NotesInput({ initial, onCommit }: { initial: string; onCommit: (n: string) => void }) {
  const [v, setV] = useState(initial);
  return (
    <Textarea
      value={v}
      placeholder="Notes (optional)"
      onChange={(e) => setV(e.target.value)}
      onBlur={() => onCommit(v)}
      className="min-h-9"
    />
  );
}
