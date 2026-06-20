// Read-time computations. NEVER stored (store facts, compute summaries).
import type { BagStatus, CoffeeBag, CoffeeBagStatusEvent } from "./db-types";

const DAY_MS = 24 * 60 * 60 * 1000;

// Coffee-level status from its bags: most-active wins.
const STATUS_PRECEDENCE: BagStatus[] = ["active", "resting", "frozen", "finished"];

export function coffeeStatus(bags: Pick<CoffeeBag, "status">[]): BagStatus | null {
  if (bags.length === 0) return null;
  for (const s of STATUS_PRECEDENCE) {
    if (bags.some((b) => b.status === s)) return s;
  }
  return null;
}

export function bagCountsByStatus(
  bags: Pick<CoffeeBag, "status">[],
): Record<BagStatus, number> {
  const counts: Record<BagStatus, number> = {
    frozen: 0,
    resting: 0,
    active: 0,
    finished: 0,
  };
  for (const b of bags) counts[b.status]++;
  return counts;
}

export function priceRange(
  bags: Pick<CoffeeBag, "price">[],
): { min: number; max: number } | null {
  const prices = bags
    .map((b) => b.price)
    .filter((p): p is number => p != null);
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// Days rested = elapsed since roast_date minus total time the bag spent `frozen`.
// Frozen intervals reconstructed from the status-event log (each event runs until the
// next event, or until `now` for the last). Null if no roast_date. Whole days, >= 0.
export function daysRested(
  roastDate: string | null,
  statusEvents: Pick<CoffeeBagStatusEvent, "status" | "changed_at">[],
  now: Date = new Date(),
): number | null {
  if (!roastDate) return null;
  const roastMs = new Date(roastDate + "T00:00:00").getTime();
  const nowMs = now.getTime();

  const events = [...statusEvents].sort(
    (a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime(),
  );

  let frozenMs = 0;
  for (let i = 0; i < events.length; i++) {
    if (events[i].status !== "frozen") continue;
    const start = new Date(events[i].changed_at).getTime();
    const end =
      i + 1 < events.length
        ? new Date(events[i + 1].changed_at).getTime()
        : nowMs;
    // Only count frozen time after the roast date.
    frozenMs += Math.max(0, Math.min(end, nowMs) - Math.max(start, roastMs));
  }

  const restedMs = nowMs - roastMs - frozenMs;
  return Math.max(0, Math.floor(restedMs / DAY_MS));
}
