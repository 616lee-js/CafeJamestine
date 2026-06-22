// Step trigger time is stored as seconds but entered/displayed as M:SS (e.g. 1:45).
export function secondsToMMSS(s: number | null | undefined): string {
  if (s == null) return "";
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

// Money: exactly 2 decimals, "$" prefix. Price is exempt from the 1-decimal rule.
export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}
export function formatMoney(n: number | null | undefined): string {
  if (n == null) return "";
  return `$${roundMoney(n).toFixed(2)}`;
}

// Parse "M:SS" (or "M:S") to seconds. Returns null for empty/invalid (so we don't save junk).
export function mmssToSeconds(v: string): number | null {
  const t = v.trim();
  if (t === "") return null;
  const m = t.match(/^(\d+):([0-5]?\d)$/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}
