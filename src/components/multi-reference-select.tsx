"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ReferenceSelect } from "./reference-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Item = { joinId: string; refId: string; name: string };

// Many-to-many chip editor: writes coffee_processes / coffee_varietals rows immediately.
export function MultiReferenceSelect({
  table,
  joinTable,
  refColumn,
  coffeeId,
  placeholder,
}: {
  table: "processes" | "varietals";
  joinTable: "coffee_processes" | "coffee_varietals";
  refColumn: "process_id" | "varietal_id";
  coffeeId: string;
  placeholder?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from(joinTable)
      .select(`id, ${refColumn}, ${table}(id, name)`)
      .eq("coffee_id", coffeeId);
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    setItems(
      rows.map((r) => {
        const ref = r[table] as { id: string; name: string } | null;
        return {
          joinId: String(r.id),
          refId: String(r[refColumn]),
          name: ref?.name ?? "",
        };
      }),
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coffeeId]);

  async function add(refId: string | null) {
    if (!refId || items.some((i) => i.refId === refId)) return;
    const supabase = createClient();
    const { error } = await supabase
      .from(joinTable)
      .insert({ coffee_id: coffeeId, [refColumn]: refId });
    if (!error || error.code === "23505") load();
  }

  async function remove(joinId: string) {
    const supabase = createClient();
    await supabase.from(joinTable).delete().eq("id", joinId);
    setItems((prev) => prev.filter((i) => i.joinId !== joinId));
  }

  return (
    <div className="flex flex-col gap-2">
      <ReferenceSelect
        table={table}
        value={null}
        onChange={(id) => add(id)}
        placeholder={placeholder ?? "Add…"}
      />
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((i) => (
            <Badge
              key={i.joinId}
              variant="secondary"
              className="gap-1 py-1 pl-2.5 pr-1 text-sm font-normal"
            >
              {i.name}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-4 hover:bg-transparent"
                onClick={() => remove(i.joinId)}
                aria-label={`Remove ${i.name}`}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
