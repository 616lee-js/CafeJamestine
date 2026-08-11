"use client";

import { useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import type {
  HomeCafeSession,
  MenuItemType,
  Order,
  RecipeStep,
} from "@/lib/db-types";
import { secondsToMMSS } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/action-button";
import { ListRail, RailGroup } from "@/components/list-rail";
import { cn } from "@/lib/utils";
import {
  createHomeCafeSession,
  deleteOrder,
  setOrderStatus,
  setSessionActive,
} from "../actions";

export type OrderView = {
  order: Order;
  itemName: string;
  itemType: MenuItemType | null;
  recipe: {
    id: string;
    name: string | null;
    method: string | null;
    dose_grams: number | null;
    water_grams: number | null;
    water_temp_celsius: number | null;
    grind_setting: string | null;
    steps: RecipeStep[];
  } | null;
};

export function OrdersScreen({
  sessions,
  orders,
}: {
  sessions: HomeCafeSession[];
  orders: OrderView[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(orders[0]?.order.id ?? null);
  const selected = orders.find((o) => o.order.id === selectedId) ?? null;
  const active = sessions.find((s) => s.is_active) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <SessionBar sessions={sessions} active={active} />

      <div className="flex flex-col gap-6 min-[60rem]:flex-row min-[60rem]:items-start min-[60rem]:gap-8">
        <div className="w-full shrink-0 min-[60rem]:w-[var(--list-pane)]">
          <ListRail title="Orders">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              // Receipt order, oldest at top — the order they arrived is the order you work them.
              <RailGroup label="Received">
                {orders.map((o) => {
                  const selected = o.order.id === selectedId;
                  return (
                    <li key={o.order.id}>
                      <button
                        type="button"
                        aria-current={selected ? "true" : undefined}
                        onClick={() => setSelectedId(o.order.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left transition-colors",
                          selected ? "bg-surface-selected" : "hover:bg-muted",
                        )}
                      >
                        <span className="flex min-w-0 flex-col">
                          <span
                            className={cn(
                              "truncate text-sm",
                              selected
                                ? "font-semibold text-heading"
                                : "font-medium text-body",
                            )}
                          >
                            {o.itemName}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {[
                              new Date(o.order.received_at).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              }),
                              o.order.visitor_name,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </span>
                        <span className="shrink-0">
                          <StatusBadge status={o.order.status} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </RailGroup>
            )}
          </ListRail>
        </div>

        <div className="min-w-0 flex-1">
          <div className="max-w-[var(--detail-measure)]">
            {selected ? (
              <OrderDetail view={selected} />
            ) : (
              <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-[var(--slate-300)] bg-surface-sunken">
                <p className="text-sm text-muted-foreground">Select an order.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionBar({
  sessions,
  active,
}: {
  sessions: HomeCafeSession[];
  active: HomeCafeSession | null;
}) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {active
              ? `Ordering is OPEN — ${active.name ?? "untitled session"}`
              : "Ordering is closed. Activate a session to take orders."}
          </p>
        </div>
        {active ? (
          <ActionButton
            variant="outline"
            size="touch"
            confirm={{
              title: "Close ordering?",
              description:
                "Visitors will see the menu but cannot place orders until you activate a session again.",
              confirmLabel: "Close ordering",
            }}
            confirmVariant="default"
            onAction={() => setSessionActive(active.id, false)}
          >
            <X />
            Close ordering
          </ActionButton>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {sessions.map((s) => (
          <Button
            key={s.id}
            size="sm"
            variant={s.is_active ? "default" : "outline"}
            aria-pressed={s.is_active}
            onClick={() => setSessionActive(s.id, !s.is_active)}
          >
            {s.is_active && <Check />}
            {s.name ?? new Date(s.created_at).toLocaleDateString()}
          </Button>
        ))}

        {creating ? (
          <span className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Session name"
              className="h-8 w-44"
              autoFocus
            />
            <Button
              size="sm"
              onClick={async () => {
                await createHomeCafeSession(name);
                setName("");
                setCreating(false);
              }}
            >
              Create
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </span>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setCreating(true)}>
            <Plus />
            New session
          </Button>
        )}
      </div>
    </div>
  );
}

function OrderDetail({ view }: { view: OrderView }) {
  const { order, itemName, itemType, recipe } = view;

  return (
    <div className="flex flex-col gap-6" id={`order-${order.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-3xl">{itemName}</h2>
          <p className="text-sm text-muted-foreground">
            {[
              new Date(order.received_at).toLocaleString(),
              itemType === "coffee" ? "Coffee" : itemType === "specialty" ? "Specialty" : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          {order.status !== "completed" && (
            <ActionButton size="sm" onAction={() => setOrderStatus(order.id, "completed")}>
              <Check />
              Complete
            </ActionButton>
          )}
          {order.status === "active" && (
            <ActionButton
              size="sm"
              variant="outline"
              confirm={{
                title: "Cancel this order?",
                description: "It stays in the list, marked cancelled.",
                confirmLabel: "Cancel order",
              }}
              onAction={() => setOrderStatus(order.id, "cancelled")}
            >
              <X />
              Cancel
            </ActionButton>
          )}
          <ActionButton
            size="sm"
            variant="ghost"
            className="text-destructive"
            confirm={{
              title: "Delete this order?",
              description: "It is removed for good. This cannot be undone.",
              confirmLabel: "Delete",
            }}
            onAction={() => deleteOrder(order.id)}
          >
            <Trash2 />
            Delete
          </ActionButton>
        </div>
      </div>

      {(order.visitor_name || order.visitor_note) && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          {order.visitor_name && (
            <div className="flex flex-col gap-0.5">
              <span className="eyebrow">For</span>
              <span className="text-base text-heading">{order.visitor_name}</span>
            </div>
          )}
          {order.visitor_note && (
            <div className="flex flex-col gap-0.5">
              <span className="eyebrow">Note</span>
              <span className="whitespace-pre-wrap text-base text-heading">
                {order.visitor_note}
              </span>
            </div>
          )}
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h3 className="font-display text-lg font-semibold tracking-snug text-heading">
          {itemType === "coffee" ? "Favorite recipe for this coffee" : "Recipe"}
        </h3>
        {recipe === null ? (
          <p className="rounded-lg border border-dashed border-[var(--slate-300)] bg-surface-sunken p-6 text-sm text-muted-foreground">
            {itemType === "coffee"
              ? "No favorite recipe set for this coffee yet."
              : "That recipe is no longer available."}
          </p>
        ) : (
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-heading">
                {recipe.name || "Untitled recipe"}
              </span>
              {recipe.method && (
                <span className="text-sm text-muted-foreground">{recipe.method}</span>
              )}
            </div>

            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 min-[60rem]:grid-cols-4">
              <Param label="Dose (g)" value={recipe.dose_grams} />
              <Param label="Water (g)" value={recipe.water_grams} />
              <Param label="Temp (°C)" value={recipe.water_temp_celsius} />
              <Param label="Grind" value={recipe.grind_setting} />
            </div>

            {recipe.steps.length > 0 && (
              <ol className="flex flex-col gap-2">
                {recipe.steps.map((s, i) => (
                  <li
                    key={s.id}
                    className="flex items-baseline gap-3 rounded-lg border border-border px-4 py-2"
                  >
                    <span className="w-14 shrink-0 tabular-nums text-muted-foreground">
                      {secondsToMMSS(s.timestamp_seconds) || `${i + 1}.`}
                    </span>
                    <span className="flex-1 text-heading">{s.description}</span>
                    {s.target_weight_grams != null && (
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {s.target_weight_grams} g
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Param({ label, value }: { label: string; value: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="eyebrow">{label}</span>
      <span className="text-base tabular-nums text-heading">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  if (status === "completed") return <Badge tone="bag-active">completed</Badge>;
  if (status === "cancelled") return <Badge tone="bag-finished">cancelled</Badge>;
  return <Badge tone="session-active" dot>active</Badge>;
}
