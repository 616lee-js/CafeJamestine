"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PublicMenuItem } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Visitors are anonymous and fire-and-forget: they place an order, get a confirmation, and can
// order again. There is no order status, no order list, and no way to read anything back —
// place_order() returns void and anon holds no read access to any table.
export function MenuBoard({
  items,
  orderingOpen,
}: {
  items: PublicMenuItem[];
  orderingOpen: boolean;
}) {
  const [selected, setSelected] = useState<PublicMenuItem | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    // The active session is resolved server-side inside place_order — nothing about it is sent
    // from here, so it cannot be tampered with.
    const { error: err } = await supabase.rpc("place_order", {
      p_menu_item_id: selected.id,
      p_visitor_name: name.trim() === "" ? null : name.trim(),
      p_visitor_note: note.trim() === "" ? null : note.trim(),
    });
    setBusy(false);
    if (err) {
      setError(
        err.message.includes("ordering is closed")
          ? "Ordering just closed. Sorry!"
          : "Something went wrong. Try again?",
      );
      return;
    }
    setPlaced(selected.public_name);
    setSelected(null);
    setName("");
    setNote("");
  }

  if (placed) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
          <Check className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-semibold tracking-snug text-heading">
            Order placed
          </h2>
          <p className="text-sm text-muted-foreground">{placed} is on the way.</p>
        </div>
        <Button variant="outline" size="touch" onClick={() => setPlaced(null)}>
          Order something else
        </Button>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-semibold tracking-snug text-heading">
            {selected.public_name}
          </h2>
          {selected.public_description && (
            <p className="text-sm text-muted-foreground">{selected.public_description}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visitor-name">Name (optional)</Label>
          <Input
            id="visitor-name"
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
            placeholder="Who's it for?"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visitor-note">Note (optional)</Label>
          <Textarea
            id="visitor-note"
            value={note}
            maxLength={2000}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Oat milk, extra hot, decaf…"
            className="min-h-20"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Button variant="ghost" size="touch" onClick={() => setSelected(null)} disabled={busy}>
            Back
          </Button>
          <Button size="touch" className="flex-1" onClick={submit} disabled={busy}>
            {busy ? "Placing…" : "Place order"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id}>
          {orderingOpen ? (
            <button
              type="button"
              onClick={() => setSelected(item)}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card px-6 py-5 text-left shadow-sm transition-colors hover:bg-surface-selected"
            >
              <ItemText item={item} />
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </button>
          ) : (
            <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card px-6 py-5">
              <ItemText item={item} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function ItemText({ item }: { item: PublicMenuItem }) {
  return (
    <span className="flex min-w-0 flex-col gap-1">
      <span className="font-display text-lg font-semibold tracking-snug text-heading">
        {item.public_name}
      </span>
      {item.public_description && (
        <span className="text-sm text-muted-foreground">{item.public_description}</span>
      )}
    </span>
  );
}
