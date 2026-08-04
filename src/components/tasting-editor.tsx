"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { TastingCategory } from "@/lib/db-types";
import { RatingField } from "@/components/fields";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type EntryState = { id?: string; rating: number | null; notes: string };

export function TastingEditor({
  sessionId,
  categories,
  readOnly = false,
  nextTimeField,
}: {
  sessionId: string;
  categories: TastingCategory[];
  readOnly?: boolean;
  /** Next-time adjustments lives on the session row, so the owner passes it in to sit
   *  beside overall enjoyment in the left panel. */
  nextTimeField?: React.ReactNode;
}) {
  const [tastingId, setTastingId] = useState<string | null>(null);
  const [overall, setOverall] = useState<number | null>(null);
  const [entries, setEntries] = useState<Record<string, EntryState>>({});
  const tastingPromise = useRef<Promise<string> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: t } = await supabase
        .from("tastings")
        .select("id, overall_rating")
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
      setOverall((t as { overall_rating: number | null }).overall_rating);
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

  async function saveOverall(v: number | null) {
    setOverall(v);
    try {
      const tid = await ensureTasting();
      const supabase = createClient();
      await supabase.from("tastings").update({ overall_rating: v }).eq("id", tid);
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    }
  }

  return (
    <div className="grid items-start gap-6 min-[60rem]:grid-cols-[20rem_1fr]">
      {/* Enjoyment and the forward-looking note — one score, set directly. */}
      <div
        className={
          readOnly
            ? "flex flex-col gap-5 rounded-2xl border border-border bg-card p-6"
            : "flex flex-col gap-5 rounded-2xl border border-edit-border bg-edit-surface p-6"
        }
      >
        {readOnly ? (
          <div className="flex flex-col gap-0.5">
            <span className="eyebrow">Overall enjoyment</span>
            <span className="text-2xl font-semibold tabular-nums text-heading">
              {overall != null ? `${overall}/10` : "—"}
            </span>
          </div>
        ) : (
          <RatingField
            label="Overall enjoyment (1–10)"
            defaultValue={overall}
            hint="Standalone enjoyment, set directly (1–10, 0.5 steps)"
            onCommit={saveOverall}
          />
        )}
        {nextTimeField}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Per-category 1–5 describes prominence on each parameter&apos;s spectrum — not
          enjoyment.
        </p>

        {categories.map((c) => {
          const e = entries[c.id] ?? { rating: null, notes: "" };
          return (
            <div
              key={c.id}
              className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-heading">{c.display}</span>
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

        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">SCA flavor wheel (reference)</summary>
          <p className="pt-1">
            Use the SCA flavor wheel to help name notes (fruity, floral, nutty/cocoa, spices,
            etc.) — a writing aid, not a required structure.
          </p>
        </details>
      </div>
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
