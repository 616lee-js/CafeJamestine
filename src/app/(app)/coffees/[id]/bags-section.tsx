"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
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
import { DateField, NumberField, TextareaField } from "@/components/fields";
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

export function BagsSection({ coffeeId }: { coffeeId: string }) {
  const [bags, setBags] = useState<CoffeeBag[]>([]);
  const [events, setEvents] = useState<Record<string, CoffeeBagStatusEvent[]>>({});

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
        .in(
          "coffee_bag_id",
          list.map((b) => b.id),
        )
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

  async function addBag() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("coffee_bags")
      .insert({ coffee_id: coffeeId, status: "resting" })
      .select("id")
      .single();
    if (error || !data) return toast.error(error?.message ?? "Add failed");
    await supabase.from("coffee_bag_status_events").insert({
      coffee_bag_id: data.id,
      status: "resting",
      changed_at: new Date().toISOString(),
    });
    load();
  }

  async function updateBag(id: string, patch: Partial<CoffeeBag>) {
    const supabase = createClient();
    const { error } = await supabase.from("coffee_bags").update(patch).eq("id", id);
    if (error) return toast.error(`Save failed: ${error.message}`);
    setBags((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  async function changeStatus(id: string, status: BagStatus, changedAtISO: string) {
    const supabase = createClient();
    const { error } = await supabase.from("coffee_bags").update({ status }).eq("id", id);
    if (error) return toast.error(`Save failed: ${error.message}`);
    await supabase
      .from("coffee_bag_status_events")
      .insert({ coffee_bag_id: id, status, changed_at: changedAtISO });
    setBags((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    load();
  }

  async function deleteBag(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("coffee_bags").delete().eq("id", id);
    if (error) {
      return toast.error(
        error.message.includes("foreign key")
          ? "Can't delete: this bag has sessions."
          : `Delete failed: ${error.message}`,
      );
    }
    setBags((prev) => prev.filter((b) => b.id !== id));
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

      {/* Computed rollups (read-time, never stored) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>
          Status:{" "}
          {status ? <Badge variant="secondary">{status}</Badge> : "—"}
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
          Price: {range ? (range.min === range.max ? range.min : `${range.min}–${range.max}`) : "—"}
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
              onUpdate={updateBag}
              onChangeStatus={changeStatus}
              onDelete={deleteBag}
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
  onUpdate,
  onChangeStatus,
  onDelete,
}: {
  bag: CoffeeBag;
  events: CoffeeBagStatusEvent[];
  onUpdate: (id: string, patch: Partial<CoffeeBag>) => void;
  onChangeStatus: (id: string, status: BagStatus, changedAtISO: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<BagStatus>(bag.status);
  const [changedAt, setChangedAt] = useState(toLocalInput(new Date()));

  const rested = daysRested(bag.roast_date, events);

  return (
    <li className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
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
          <div className="grid gap-5 sm:grid-cols-2">
            <DateField
              label="Roast date"
              defaultValue={bag.roast_date}
              onCommit={(v) => onUpdate(bag.id, { roast_date: v })}
            />
            <NumberField
              label="Price"
              defaultValue={bag.price}
              onCommit={(v) => onUpdate(bag.id, { price: v })}
            />
          </div>

          <TextareaField
            label="Notes"
            defaultValue={bag.notes}
            onCommit={(v) => onUpdate(bag.id, { notes: v })}
          />

          {/* Status change with backdatable timestamp */}
          <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
            <span className="text-sm font-medium">Change status</span>
            <div className="flex flex-wrap items-end gap-2">
              <Select
                value={newStatus}
                onValueChange={(v) => setNewStatus(v as BagStatus)}
              >
                <SelectTrigger className="h-11 w-36">
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
                value={changedAt}
                onChange={(e) => setChangedAt(e.target.value)}
                className="h-11 rounded-md border border-input bg-transparent px-3 text-sm"
              />
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  onChangeStatus(
                    bag.id,
                    newStatus,
                    new Date(changedAt).toISOString(),
                  )
                }
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Status history */}
          {events.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status history
              </span>
              <ul className="flex flex-col gap-1 text-sm">
                {[...events]
                  .sort(
                    (a, b) =>
                      new Date(b.changed_at).getTime() -
                      new Date(a.changed_at).getTime(),
                  )
                  .map((e) => (
                    <li key={e.id} className="flex justify-between gap-3">
                      <span>{e.status}</span>
                      <span className="text-muted-foreground">
                        {new Date(e.changed_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(bag.id)}
            >
              <Trash2 className="size-4" />
              Delete bag
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
