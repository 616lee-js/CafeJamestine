"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  BAG_STATUSES,
  type BagStatus,
  type CoffeeBag,
  type CoffeeBagStatusEvent,
} from "@/lib/db-types";
import {
  bagCountsByStatus,
  coffeeStatus,
  daysRested,
  priceRange,
} from "@/lib/compute";
import { DateField, MoneyField, TextareaField, ViewRow } from "@/components/fields";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const latestStatus = (events: CoffeeBagStatusEvent[]): BagStatus | null => {
  if (events.length === 0) return null;
  return [...events].sort(
    (a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime(),
  )[0].status;
};

export function BagsSection({ coffeeId }: { coffeeId: string }) {
  const [bags, setBags] = useState<CoffeeBag[]>([]);
  const [events, setEvents] = useState<Record<string, CoffeeBagStatusEvent[]>>({});
  const [newBagId, setNewBagId] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    const { data: bagRows } = await supabase
      .from("coffee_bags")
      .select("*")
      .eq("coffee_id", coffeeId)
      .order("created_at", { ascending: false });
    const list = (bagRows ?? []) as CoffeeBag[];
    setBags(list);
    if (list.length) {
      const { data: evRows } = await supabase
        .from("coffee_bag_status_events")
        .select("*")
        .in("coffee_bag_id", list.map((b) => b.id))
        .order("changed_at", { ascending: true });
      const grouped: Record<string, CoffeeBagStatusEvent[]> = {};
      for (const e of (evRows ?? []) as CoffeeBagStatusEvent[]) {
        (grouped[e.coffee_bag_id] ??= []).push(e);
      }
      setEvents(grouped);
    } else {
      setEvents({});
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coffeeId]);

  // Keep bag.status synced to the latest event (so coffee-level rollups stay correct).
  async function syncStatus(bagId: string, evs: CoffeeBagStatusEvent[]) {
    const latest = latestStatus(evs);
    if (!latest) return;
    const supabase = createClient();
    await supabase.from("coffee_bags").update({ status: latest }).eq("id", bagId);
    setBags((prev) => prev.map((b) => (b.id === bagId ? { ...b, status: latest } : b)));
  }

  async function addBag() {
    const supabase = createClient();
    // New bag opens directly in edit; the user sets status + effective date in the log.
    const { data, error } = await supabase
      .from("coffee_bags")
      .insert({ coffee_id: coffeeId, status: "resting" })
      .select("id")
      .single();
    if (error || !data) return toast.error(error?.message ?? "Add failed");
    setNewBagId(data.id);
    load();
  }

  // Auto-resting: a roast date implies resting begins then. Create the first resting event at
  // the roast date if none, else move the earliest resting event to match.
  async function ensureRestingAtRoast(bagId: string, roastDate: string | null) {
    if (!roastDate) return;
    const iso = new Date(`${roastDate}T00:00:00`).toISOString();
    const supabase = createClient();
    const resting = (events[bagId] ?? [])
      .filter((e) => e.status === "resting")
      .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());
    if (resting.length === 0) {
      await supabase
        .from("coffee_bag_status_events")
        .insert({ coffee_bag_id: bagId, status: "resting", changed_at: iso });
    } else if (resting[0].changed_at !== iso) {
      await supabase
        .from("coffee_bag_status_events")
        .update({ changed_at: iso })
        .eq("id", resting[0].id);
    }
  }

  async function saveBag(id: string, patch: Partial<CoffeeBag>) {
    const supabase = createClient();
    const { error } = await supabase.from("coffee_bags").update(patch).eq("id", id);
    if (error) return toast.error(`Save failed: ${error.message}`);
    setBags((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    if ("roast_date" in patch) {
      await ensureRestingAtRoast(id, patch.roast_date ?? null);
      load();
    }
  }

  async function deleteBag(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("coffee_bags").delete().eq("id", id);
    if (error) {
      return toast.error(
        error.message.toLowerCase().includes("foreign key")
          ? "Can't delete: this bag has sessions (history preserved)."
          : `Delete failed: ${error.message}`,
      );
    }
    setBags((prev) => prev.filter((b) => b.id !== id));
  }

  async function addEvent(bagId: string, status: BagStatus, changedAtISO: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("coffee_bag_status_events")
      .insert({ coffee_bag_id: bagId, status, changed_at: changedAtISO });
    if (error) return toast.error(error.message);
    const evs = [...(events[bagId] ?? []), { id: "tmp", coffee_bag_id: bagId, status, changed_at: changedAtISO } as CoffeeBagStatusEvent];
    await syncStatus(bagId, evs);
    load();
  }

  async function updateEvent(bagId: string, eventId: string, patch: Partial<CoffeeBagStatusEvent>) {
    const supabase = createClient();
    const { error } = await supabase.from("coffee_bag_status_events").update(patch).eq("id", eventId);
    if (error) return toast.error(error.message);
    const evs = (events[bagId] ?? []).map((e) => (e.id === eventId ? { ...e, ...patch } : e));
    setEvents((prev) => ({ ...prev, [bagId]: evs }));
    await syncStatus(bagId, evs);
  }

  async function deleteEvent(bagId: string, eventId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("coffee_bag_status_events").delete().eq("id", eventId);
    if (error) return toast.error(error.message);
    const evs = (events[bagId] ?? []).filter((e) => e.id !== eventId);
    setEvents((prev) => ({ ...prev, [bagId]: evs }));
    await syncStatus(bagId, evs);
  }

  const status = coffeeStatus(bags);
  const counts = bagCountsByStatus(bags);
  const range = priceRange(bags);

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Coffee bags</h2>
        <Button size="sm" variant="outline" onClick={addBag}>
          <Plus className="size-4" />
          Add bag
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          Status: {status ? <Badge variant="secondary">{status}</Badge> : "—"}
        </span>
        <span>
          Bags:{" "}
          {bags.length === 0
            ? "0"
            : BAG_STATUSES.filter((s) => counts[s] > 0)
                .map((s) => `${counts[s]} ${s}`)
                .join(" · ")}
        </span>
        <span>
          Price:{" "}
          {range
            ? range.min === range.max
              ? formatMoney(range.min)
              : `${formatMoney(range.min)}–${formatMoney(range.max)}`
            : "—"}
        </span>
      </div>

      {bags.length === 0 ? (
        <p className="text-sm text-muted-foreground">No bags yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {bags.map((bag) => (
            <BagCard
              key={bag.id}
              bag={bag}
              events={events[bag.id] ?? []}
              initialEditing={bag.id === newBagId}
              onSave={saveBag}
              onDelete={deleteBag}
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onDeleteEvent={deleteEvent}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function BagCard({
  bag,
  events,
  initialEditing = false,
  onSave,
  onDelete,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: {
  bag: CoffeeBag;
  events: CoffeeBagStatusEvent[];
  initialEditing?: boolean;
  onSave: (id: string, patch: Partial<CoffeeBag>) => void;
  onDelete: (id: string) => void;
  onAddEvent: (bagId: string, status: BagStatus, iso: string) => void;
  onUpdateEvent: (bagId: string, eventId: string, patch: Partial<CoffeeBagStatusEvent>) => void;
  onDeleteEvent: (bagId: string, eventId: string) => void;
}) {
  const [open, setOpen] = useState(initialEditing);
  const [editing, setEditing] = useState(initialEditing);
  const [draft, setDraft] = useState<Partial<CoffeeBag>>(bag);

  // add-status controls
  const [newStatus, setNewStatus] = useState<BagStatus>(bag.status);
  const [newAt, setNewAt] = useState(toLocalInput(new Date()));

  const rested = daysRested(bag.roast_date, events);
  const ordered = [...events].sort(
    (a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime(),
  );

  function startEdit() {
    setDraft(bag);
    setEditing(true);
    setOpen(true);
  }
  function save() {
    onSave(bag.id, {
      roast_date: draft.roast_date ?? null,
      price: draft.price ?? null,
      notes: draft.notes ?? null,
    });
    setEditing(false);
  }

  return (
    <li className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2">
          {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          <Badge variant="secondary">{bag.status}</Badge>
          <span className="text-sm text-muted-foreground">
            {bag.roast_date ? `roasted ${bag.roast_date}` : "no roast date"}
          </span>
        </span>
        <span className="text-sm text-muted-foreground">
          {rested == null ? "" : `${rested}d rested`}
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-5 border-t border-border p-4">
          {/* Scalars: view / edit */}
          {!editing ? (
            <div className="flex flex-col gap-2">
              <div className="grid gap-x-8 sm:grid-cols-2">
                <ViewRow label="Roast date" value={bag.roast_date} />
                <ViewRow label="Price" value={bag.price != null ? formatMoney(bag.price) : undefined} />
                <ViewRow label="Total days rested" value={rested ?? undefined} />
              </div>
              <ViewRow label="Notes" value={bag.notes} />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={startEdit}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => onDelete(bag.id)}
                >
                  <Trash2 className="size-4" />
                  Delete bag
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid gap-5 sm:grid-cols-2">
                <DateField
                  label="Roast date"
                  defaultValue={draft.roast_date ?? null}
                  onCommit={(v) => setDraft((d) => ({ ...d, roast_date: v }))}
                />
                <MoneyField
                  label="Price"
                  defaultValue={draft.price ?? null}
                  onCommit={(v) => setDraft((d) => ({ ...d, price: v }))}
                />
              </div>
              <TextareaField
                label="Notes"
                defaultValue={draft.notes ?? null}
                onCommit={(v) => setDraft((d) => ({ ...d, notes: v }))}
              />
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={save}>
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Status timeline */}
          <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status timeline
            </span>
            {/* roast_date anchor: display-only, not a status event */}
            <div className="text-sm text-muted-foreground">
              {bag.roast_date ? `Roasted — ${bag.roast_date}` : "Roast date not set"}
            </div>
            {ordered.map((e) => (
              <div key={e.id} className="flex flex-wrap items-center gap-2">
                <Select
                  value={e.status}
                  onValueChange={(v) =>
                    onUpdateEvent(bag.id, e.id, { status: v as BagStatus })
                  }
                >
                  <SelectTrigger className="h-9 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BAG_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="datetime-local"
                  value={toLocalInput(new Date(e.changed_at))}
                  onChange={(ev) =>
                    onUpdateEvent(bag.id, e.id, {
                      changed_at: new Date(ev.target.value).toISOString(),
                    })
                  }
                  className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive"
                  onClick={() => onDeleteEvent(bag.id, e.id)}
                  aria-label="Delete event"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {/* add a status event */}
            <div className="flex flex-wrap items-end gap-2 border-t border-border pt-2">
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as BagStatus)}>
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BAG_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="datetime-local"
                value={newAt}
                onChange={(e) => setNewAt(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onAddEvent(bag.id, newStatus, new Date(newAt).toISOString())}
              >
                <Plus className="size-4" />
                Add status
              </Button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
