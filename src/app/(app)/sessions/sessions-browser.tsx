"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SessionStatusBadge } from "@/components/status-badge";
import { ListRail, RailGroup, RailItem } from "@/components/list-rail";

export type SessionRow = {
  id: string;
  status: "active" | "complete";
  recipe_type: "brewed_coffee" | "specialty_drink";
  created_at: string;
  brewed_at: string | null;
  title: string;
  method: string | null;
  rating: number | null;
};

type Scope = "all" | "active" | "complete";

const SCOPES: { v: Scope; label: string }[] = [
  { v: "all", label: "All" },
  { v: "active", label: "Active" },
  { v: "complete", label: "History" },
];

// Sessions browse: the rail scopes, the pane holds the grouped list. The workflow itself
// is a full-width route, so the rail deliberately stops at the section index.
export function SessionsBrowser({ rows }: { rows: SessionRow[] }) {
  const [scope, setScope] = useState<Scope>("all");

  const active = rows.filter((r) => r.status === "active");
  const history = rows.filter((r) => r.status === "complete");
  const groups: { label: string; items: SessionRow[] }[] = [];
  if (scope !== "complete") groups.push({ label: "Active", items: active });
  if (scope !== "active") groups.push({ label: "History", items: history });

  return (
    <div className="flex flex-col gap-6 min-[60rem]:flex-row min-[60rem]:items-start min-[60rem]:gap-8">
      <div className="w-full shrink-0 min-[60rem]:w-[var(--list-pane)]">
        <ListRail
          title="Sessions"
          filters={SCOPES.map((s) => (
            <Button
              key={s.v}
              size="xs"
              variant={scope === s.v ? "default" : "outline"}
              aria-pressed={scope === s.v}
              onClick={() => setScope(s.v)}
            >
              {s.label}
            </Button>
          ))}
        >
          <RailGroup label="Active">
            {active.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">None.</li>
            ) : (
              active.map((s) => (
                <RailItem
                  key={s.id}
                  href={`/sessions/${s.id}`}
                  name={s.title}
                  meta={s.method}
                  trailing={<SessionStatusBadge status={s.status} />}
                />
              ))
            )}
          </RailGroup>
        </ListRail>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex max-w-[var(--detail-measure)] flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl">Sessions</h1>
            <Button asChild>
              <Link href="/sessions/new">
                <Plus />
                Start a session
              </Link>
            </Button>
          </div>

          {groups.map((g) => (
            <section key={g.label} className="flex flex-col gap-2">
              <h2 className="eyebrow">{g.label}</h2>
              {g.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No {g.label.toLowerCase()} sessions.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {g.items.map((s) => (
                    <Item key={s.id} s={s} />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function Item({ s }: { s: SessionRow }) {
  const date = s.brewed_at ?? s.created_at;
  const meta = [
    date ? new Date(date).toLocaleDateString() : null,
    s.method,
    s.rating != null ? `${s.rating}/10` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li>
      <Link
        href={`/sessions/${s.id}`}
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-surface-selected"
      >
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-heading">{s.title}</span>
          {meta && <span className="text-sm text-muted-foreground">{meta}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <Badge variant="secondary">
            {s.recipe_type === "brewed_coffee" ? "Brewed" : "Specialty"}
          </Badge>
          <SessionStatusBadge status={s.status} />
        </span>
      </Link>
    </li>
  );
}
