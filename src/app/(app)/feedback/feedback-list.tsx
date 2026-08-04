"use client";

import { Check, RotateCcw, Trash2 } from "lucide-react";
import type { Feedback } from "@/lib/db-types";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/action-button";
import { setFeedbackStatus, deleteFeedback } from "./actions";

// Collapsible sections use <details>/<summary> — the codebase's existing idiom (coffee-detail,
// tasting-editor), so no new primitive is needed.
export function FeedbackList({
  open: newItems,
  completed,
}: {
  open: Feedback[];
  completed: Feedback[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <Section label="New" count={newItems.length} defaultOpen>
        {newItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing new.</p>
        ) : (
          newItems.map((f) => <Item key={f.id} item={f} />)
        )}
      </Section>

      <Section label="Completed" count={completed.length}>
        {completed.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing completed yet.</p>
        ) : (
          completed.map((f) => <Item key={f.id} item={f} />)
        )}
      </Section>
    </div>
  );
}

function Section({
  label,
  count,
  defaultOpen = false,
  children,
}: {
  label: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-xl border border-border bg-surface-rail p-4 [&[open]>summary]:mb-3"
    >
      <summary className="flex cursor-pointer items-center gap-2 select-none">
        <span className="eyebrow">{label}</span>
        <span className="text-xs tabular-nums text-muted-foreground">({count})</span>
      </summary>
      <div className="flex flex-col gap-2">{children}</div>
    </details>
  );
}

function Item({ item }: { item: Feedback }) {
  const isComplete = item.status === "complete";
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Semantic vocabulary (warning), NOT the phase ramp — that ramp belongs to the
              session stepper alone. */}
          {item.kind === "bug" ? (
            <Badge className="bg-warning-soft text-warning">Bug</Badge>
          ) : (
            <Badge variant="secondary">Request</Badge>
          )}
          <span className="text-xs text-muted-foreground tabular-nums">
            {new Date(item.created_at).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ActionButton
            size="sm"
            variant={isComplete ? "ghost" : "outline"}
            onAction={() => setFeedbackStatus(item.id, isComplete ? "new" : "complete")}
          >
            {isComplete ? <RotateCcw /> : <Check />}
            {isComplete ? "Reopen" : "Mark complete"}
          </ActionButton>
          <ActionButton
            size="icon-sm"
            variant="ghost"
            className="text-destructive"
            confirm={{
              title: "Delete this feedback?",
              description: "It will be removed for good. This cannot be undone.",
              confirmLabel: "Delete",
            }}
            onAction={() => deleteFeedback(item.id)}
          >
            <Trash2 />
          </ActionButton>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-base text-heading">{item.body}</p>

      {item.page_path && (
        <p className="text-xs text-muted-foreground">
          Submitted from <span className="font-mono">{item.page_path}</span>
        </p>
      )}
    </article>
  );
}
