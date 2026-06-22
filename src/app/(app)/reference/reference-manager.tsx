"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

  async function rename(id: string, name: string) {
    const trimmed = name.trim();
    if (trimmed === "") return;
    const supabase = createClient();
    const { error } = await supabase.from(table).update({ name: trimmed }).eq("id", id);
    if (error) {
      toast.error(error.code === "23505" ? "That name already exists." : error.message);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, name: trimmed } : r)));
  }

  async function remove(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast.error(
        error.code === "23503"
          ? "In use — can't delete. Remove references first."
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
        <ul className="flex flex-col gap-1.5">
          {rows.map((r) => (
            <RefRow key={r.id} row={r} onRename={rename} onDelete={remove} />
          ))}
        </ul>
      )}
    </section>
  );
}

function RefRow({
  row,
  onRename,
  onDelete,
}: {
  row: Row;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(row.name);

  if (editing) {
    return (
      <li className="flex items-center gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-10" autoFocus />
        <Button
          size="sm"
          onClick={() => {
            onRename(row.id, value);
            setEditing(false);
          }}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setValue(row.name);
            setEditing(false);
          }}
        >
          Cancel
        </Button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
      <span className="flex-1 text-sm">{row.name}</span>
      {row.country && <span className="text-xs text-muted-foreground">{row.country}</span>}
      <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => setEditing(true)} aria-label={`Edit ${row.name}`}>
        <Pencil className="size-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => onDelete(row.id)} aria-label={`Delete ${row.name}`}>
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}
