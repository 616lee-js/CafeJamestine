"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { ReferenceTable } from "@/lib/db-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Row = { id: string; name: string; country?: string | null };

export function ReferenceManager({
  table,
  label,
}: {
  table: ReferenceTable;
  label: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    const supabase = createClient();
    const select = table === "regions" ? "id, name, countries(name)" : "id, name";
    const { data } = await supabase.from(table).select(select).order("name");
    const list = (data ?? []) as unknown as Array<Record<string, unknown>>;
    setRows(
      list.map((r) => ({
        id: String(r.id),
        name: String(r.name ?? ""),
        country:
          table === "regions"
            ? ((r.countries as { name: string } | null)?.name ?? null)
            : undefined,
      })),
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  async function rename(id: string, name: string, original: string) {
    const trimmed = name.trim();
    if (trimmed === "" || trimmed === original) return;
    const supabase = createClient();
    const { error } = await supabase.from(table).update({ name: trimmed }).eq("id", id);
    if (error) {
      toast.error(
        error.code === "23505" ? "A row with that name already exists." : error.message,
      );
      load();
    }
  }

  async function remove(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast.error(
        error.code === "23503"
          ? "In use by a coffee/recipe — can't delete. Remove references first."
          : `Delete failed: ${error.message}`,
      );
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">None yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-2">
              <Input
                defaultValue={r.name}
                onBlur={(e) => rename(r.id, e.target.value, r.name)}
                className="h-10"
              />
              {r.country && (
                <span className="shrink-0 text-xs text-muted-foreground">{r.country}</span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-destructive"
                onClick={() => remove(r.id)}
                aria-label={`Delete ${r.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
