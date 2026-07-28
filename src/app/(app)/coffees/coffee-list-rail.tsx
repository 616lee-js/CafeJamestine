"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import type { BagStatus } from "@/lib/db-types";
import { coffeeGroup, isIncomplete } from "@/lib/compute";
import { Button } from "@/components/ui/button";
import { createCoffee } from "./actions";

type Coffee = {
  id: string;
  name: string | null;
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
    <aside className="flex w-full shrink-0 flex-col gap-4 md:w-56">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Coffees</h1>
        <form action={createCoffee}>
          <Button type="submit" size="sm" variant="outline">
            <Plus className="size-4" />
            New
          </Button>
        </form>
      </div>

      {incomplete.length > 0 && (
        <Button
          type="button"
          variant={showIncomplete ? "default" : "ghost"}
          size="sm"
          className="justify-start"
          onClick={() => setShowIncomplete((v) => !v)}
        >
          Incomplete ({incomplete.length})
        </Button>
      )}

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
    </aside>
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
    <section className="flex flex-col gap-1">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h2>
      <ul className="flex flex-col gap-0.5">
        {coffees.map((c) => (
          <li key={c.id}>
            <Link
              href={`/coffees/${c.id}`}
              className={
                "block rounded-md px-3 py-2 text-sm font-medium " +
                (c.id === selectedId ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")
              }
            >
              {c.name || "Untitled coffee"}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
