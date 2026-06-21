// Phase 5 verification: feedback compute helpers + the atomic freeze (DB triggers) + RLS.
// Run: node --env-file=.env.local scripts/verify-phase5.ts
import { createClient } from "@supabase/supabase-js";
import { sessionOverall, coffeeRating, daysRested, roundHalf } from "../src/lib/compute.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ts = Date.now();
let pass = 0, fail = 0;
const ok = (c: boolean, label: string, extra = "") => { console.log(`${c ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`); if (c) pass++; else fail++; };
const isoDaysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

// ---- compute unit ----
ok(sessionOverall([4, 5], null) === 9, "sessionOverall avg×2 (4,5 → 9)", String(sessionOverall([4, 5], null)));
ok(sessionOverall([3], null) === 6, "sessionOverall (3 → 6)");
ok(sessionOverall([4, 5], 7) === 7, "sessionOverall override wins");
ok(sessionOverall([], null) === null, "sessionOverall null when empty");
ok(roundHalf(8.25) === 8.5 || roundHalf(8.25) === 8, "roundHalf to .5");
ok(coffeeRating([8, 9], null) === 8.5, "coffeeRating avg (8,9 → 8.5)");
ok(coffeeRating([8, 9], 6) === 6, "coffeeRating override wins");

const mk = async (tag: string) => {
  const email = `p5-${tag}-${ts}@example.com`, password = "passw0rd-test";
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const c = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
  await c.auth.signInWithPassword({ email, password });
  return { id: data.user!.id, c };
};
const A = await mk("a");
const B = await mk("b");

try {
  const roast = new Date(Date.now() - 20 * 86400000).toISOString().slice(0, 10);
  const coffee = (await A.c.from("coffees").insert({ name: `C-${ts}` }).select().single()).data;
  const bag = (await A.c.from("coffee_bags").insert({ coffee_id: coffee.id, status: "active", roast_date: roast }).select().single()).data;
  await A.c.from("coffee_bag_status_events").insert([
    { coffee_bag_id: bag.id, status: "frozen", changed_at: isoDaysAgo(20) },
    { coffee_bag_id: bag.id, status: "resting", changed_at: isoDaysAgo(15) },
  ]);
  const sess = (await A.c.from("sessions").insert({ recipe_type: "brewed_coffee", status: "active", coffee_bag_id: bag.id, dose_grams: 18 }).select().single()).data;
  const step = (await A.c.from("recipe_steps").insert({ session_id: sess.id, position: 1, description: "bloom" }).select().single()).data;
  const tasting = (await A.c.from("tastings").insert({ session_id: sess.id }).select().single()).data;
  const cat = (await A.c.from("tasting_categories").select("id").order("sort_order").limit(2)).data!;
  const entry = (await A.c.from("tasting_entries").insert({ tasting_id: tasting.id, category_id: cat[0].id, rating: 4 }).select().single()).data;
  await A.c.from("tasting_entries").insert({ tasting_id: tasting.id, category_id: cat[1].id, rating: 5 });

  // complete (replicates completeSession): compute snapshot then set complete
  const snap = daysRested(roast, [
    { status: "frozen", changed_at: isoDaysAgo(20) },
    { status: "resting", changed_at: isoDaysAgo(15) },
  ]);
  ok(snap === 15, "days_rested = 20 elapsed − 5 frozen", String(snap));
  const completeRes = await A.c.from("sessions").update({ status: "complete", brewed_at: new Date().toISOString(), days_rested_snapshot: snap }).eq("id", sess.id);
  ok(!completeRes.error, "active→complete update allowed", completeRes.error?.message ?? "");
  const done = (await A.c.from("sessions").select("status, brewed_at, days_rested_snapshot").eq("id", sess.id).single()).data;
  ok(done.status === "complete" && done.brewed_at != null && done.days_rested_snapshot === 15, "completed: status+brewed_at+snapshot set");

  // FREEZE: all writes to the completed session + children rejected
  ok(!!(await A.c.from("sessions").update({ dose_grams: 99 }).eq("id", sess.id)).error, "frozen session update REJECTED");
  ok(!!(await A.c.from("recipe_steps").update({ description: "x" }).eq("id", step.id)).error, "frozen session step update REJECTED");
  ok(!!(await A.c.from("recipe_steps").insert({ session_id: sess.id, position: 2 })).error, "insert step on frozen session REJECTED");
  ok(!!(await A.c.from("tasting_entries").update({ rating: 1 }).eq("id", entry.id)).error, "frozen tasting_entry update REJECTED");
  ok(!!(await A.c.from("tastings").update({ overall_override: 5 }).eq("id", tasting.id)).error, "frozen tasting update REJECTED");

  // active session still writable
  const sess2 = (await A.c.from("sessions").insert({ recipe_type: "brewed_coffee", status: "active", coffee_bag_id: bag.id }).select().single()).data;
  ok(!(await A.c.from("sessions").update({ dose_grams: 20 }).eq("id", sess2.id)).error, "active session still editable");

  // coffee rating from the completed session (entries 4,5 → 9)
  ok(coffeeRating([sessionOverall([4, 5], null)], null) === 9, "coffee rating from completed session");

  // RLS
  ok(((await B.c.from("tastings").select("id").eq("session_id", sess.id)).data ?? []).length === 0, "B cannot see A's tasting (RLS)");
} finally {
  await admin.auth.admin.deleteUser(A.id);
  await admin.auth.admin.deleteUser(B.id);
  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
