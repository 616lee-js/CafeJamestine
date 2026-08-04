"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import type { BagStatus } from "@/lib/db-types";
import { coffeeGroup, coffeeStatus, isIncomplete } from "@/lib/compute";
import { Button } from "@/components/ui/button";
import { ListRail, RailGroup, RailItem } from "@/components/list-rail";
import { BagStatusBadge } from "@/components/status-badge";
import { createCoffee } from "./actions";

type Coffee = {
  id: string;
  name: string | null;
  roaster: string | null;
  bags: { status: BagStatus; roast_date: string | null }[];
};

const GROUP_LABELS: Record<"active" | "storage" | "history", string> = {
  active: "Active",
  storage: "Storage",
  history: "History",
};

export function CoffeeListRail({ coffees }: { coffees: Coffee[] }) {
  const pathname = usePathname();
  const selectedId = pathname.startsWith("/coffees/") ? pathname.slice("/coffees/".length) : null;
  const [showIncomplete, setShowIncomplete] = useState(false);

  const incomplete = coffees.filter((c) => isIncomplete(c.bags));
  const inUse = coffees.filter((c) => !isIncomplete(c.bags));
  const groups: Record<"active" | "storage" | "history", Coffee[]> = {
    active: [],
    storage: [],
    history: [],
  };
  for (const c of inUse) {
    const g = coffeeGroup(c.bags);
    if (g) groups[g].push(c);
  }

  return (
    <ListRail
      title="Coffees"
      action={
        <form action={createCoffee}>
          <Button type="submit" size="sm" variant="outline">
            <Plus />
            New
          </Button>
        </form>
      }
      filters={
        incomplete.length > 0 ? (
          <Button
            type="button"
            variant={showIncomplete ? "default" : "outline"}
            size="xs"
            aria-pressed={showIncomplete}
            onClick={() => setShowIncomplete((v) => !v)}
          >
            Incomplete ({incomplete.length})
          </Button>
        ) : undefined
      }
    >
      {coffees.length === 0 ? (
        <p className="text-sm text-muted-foreground">No coffees yet.</p>
      ) : showIncomplete ? (
        <Group label="Incomplete" coffees={incomplete} selectedId={selectedId} />
      ) : (
        <>
          {(["active", "storage", "history"] as const).map((g) =>
            groups[g].length > 0 ? (
              <Group key={g} label={GROUP_LABELS[g]} coffees={groups[g]} selectedId={selectedId} />
            ) : null,
          )}
          {inUse.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No coffees in use.{incomplete.length > 0 ? " See Incomplete." : ""}
            </p>
          )}
        </>
      )}
    </ListRail>
  );
}

function Group({
  label,
  coffees,
  selectedId,
}: {
  label: string;
  coffees: Coffee[];
  selectedId: string | null;
}) {
  return (
    <RailGroup label={label}>
      {coffees.map((c) => {
        const status = coffeeStatus(c.bags);
        return (
          <RailItem
            key={c.id}
            href={`/coffees/${c.id}`}
            name={c.name || "Untitled coffee"}
            meta={c.roaster}
            selected={c.id === selectedId}
            trailing={status ? <BagStatusBadge status={status} /> : undefined}
          />
        );
      })}
    </RailGroup>
  );
}
