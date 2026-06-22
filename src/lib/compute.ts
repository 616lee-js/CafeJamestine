// Read-time computations. NEVER stored (store facts, compute summaries).
import type { BagStatus, CoffeeBag, CoffeeBagStatusEvent } from "./db-types";

const DAY_MS = 24 * 60 * 60 * 1000;

// Ratings round to nearest 0.5 (global precision rule).
export function roundHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

// A coffee's aggregate rating: manual override wins; else avg of its completed sessions'
// standalone overall_rating values, round 0.5. (Per-category 1–5 are prominence, not enjoyment,
// and are NOT averaged into this.)
export function coffeeRating(
  sessionOveralls: (number | null | undefined)[],
  override: number | null | undefined,
): number | null {
  if (override != null) return override;
  const filled = sessionOveralls.filter((r): r is number => r != null);
  if (filled.length === 0) return null;
  return roundHalf(filled.reduce((a, b) => a + b, 0) / filled.length);
}

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

// Total days rested = (end − roast) − Σ(frozen spans), where end = the bag's FINISHED date if
// finished, else now. Frozen spans come from the status log (each event runs until the next,
// capped at end). Null if no roast_date. Whole days, >= 0.
export function daysRested(
  roastDate: string | null,
  statusEvents: Pick<CoffeeBagStatusEvent, "status" | "changed_at">[],
  now: Date = new Date(),
): number | null {
  if (!roastDate) return null;
  // Parse roast as UTC midnight to align with timestamptz event values (avoids tz off-by-one).
  const roastMs = new Date(roastDate + "T00:00:00Z").getTime();

  const events = [...statusEvents].sort(
    (a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime(),
  );

  // End of resting = the (latest) finished event, else now.
  const finished = events.filter((e) => e.status === "finished").at(-1);
  const endMs = finished ? new Date(finished.changed_at).getTime() : now.getTime();

  let frozenMs = 0;
  for (let i = 0; i < events.length; i++) {
    if (events[i].status !== "frozen") continue;
    const start = new Date(events[i].changed_at).getTime();
    const next = i + 1 < events.length ? new Date(events[i + 1].changed_at).getTime() : endMs;
    frozenMs += Math.max(0, Math.min(next, endMs) - Math.max(start, roastMs));
  }

  const restedMs = endMs - roastMs - frozenMs;
  return Math.max(0, Math.floor(restedMs / DAY_MS));
}
