"use client";

import { useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { ReferenceTable } from "@/lib/db-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Row = { id: string; name: string; country?: string | null };

const TABLES: { table: ReferenceTable; label: string }[] = [
  { table: "roasters", label: "Roasters" },
  { table: "countries", label: "Countries" },
  { table: "regions", label: "Regions" },
  { table: "producers", label: "Producers" },
  { table: "processes", label: "Processes" },
  { table: "varietals", label: "Varietals" },
  { table: "units", label: "Units" },
];

// Regions carry a required country, so they are created from a coffee (where the country
// is already known) rather than from a bare name here.
const NEEDS_PARENT: ReferenceTable[] = ["regions"];

export function ReferenceManager() {
  const [table, setTable] = useState<ReferenceTable>("roasters");
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const label = TABLES.find((t) => t.table === table)!.label;
  const canAdd = !NEEDS_PARENT.includes(table);

  async function load(t: ReferenceTable) {
    const supabase = createClient();
    const select = t === "regions" ? "id, name, countries(name)" : "id, name";
    const { data } = await supabase.from(t).select(select).order("name");
    const list = (data ?? []) as unknown as Array<Record<string, unknown>>;
    setRows(
      list.map((r) => ({
        id: String(r.id),
        name: String(r.name ?? ""),
        country:
          t === "regions"
            ? ((r.countries as { name: string } | null)?.name ?? null)
            : undefined,
      })),
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(table);
  }, [table]);

  async function add() {
    const name = draft.trim();
    if (name === "") return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from(table).insert({ name });
    setBusy(false);
    if (error) {
      toast.error(error.code === "23505" ? "That name already exists." : error.message);
      return;
    }
    setDraft("");
    load(table);
  }

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1.5">
        {TABLES.map((t) => (
          <Button
            key={t.table}
            size="sm"
            variant={t.table === table ? "default" : "outline"}
            aria-pressed={t.table === table}
            onClick={() => setTable(t.table)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {canAdd ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Add to ${label}…`}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="touch" disabled={busy || draft.trim() === ""}>
            <Plus />
            Add
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          Regions are added from a coffee, where the country is known.
        </p>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing in {label} yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {rows.map((r) => (
            <RefChip key={r.id} row={r} onRename={rename} onDelete={remove} />
          ))}
        </ul>
      )}
    </div>
  );
}

function RefChip({
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
      <li className="flex items-center gap-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-8 w-40"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setValue(row.name);
              setEditing(false);
            }
          }}
        />
        <Button
          size="icon-sm"
          aria-label="Save name"
          onClick={() => {
            onRename(row.id, value);
            setEditing(false);
          }}
        >
          <Check />
        </Button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-1 rounded-full border border-border bg-card py-1 pr-1 pl-3">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-sm text-heading"
        aria-label={`Rename ${row.name}`}
      >
        {row.name}
        {row.country && (
          <span className="ml-1.5 text-xs text-muted-foreground">{row.country}</span>
        )}
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="rounded-full text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(row.id)}
        aria-label={`Delete ${row.name}`}
      >
        <X />
      </Button>
    </li>
  );
}
