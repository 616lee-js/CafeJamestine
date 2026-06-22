// Phase 2–5 fix batch verification. Run: node --env-file=.env.local scripts/verify-phase5-fixes.ts
import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import { daysRested, roundHalf, coffeeRating } from "../src/lib/compute.ts";
import { formatMoney, roundMoney, mmssToSeconds, secondsToMMSS } from "../src/lib/format.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ts = Date.now();
let pass = 0, fail = 0;
const ok = (c: boolean, label: string, extra = "") => { console.log(`${c ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`); if (c) pass++; else fail++; };

// ---- compute / format units ----
const rested = daysRested("2026-05-11", [
  { status: "resting", changed_at: "2026-05-11T00:00:00Z" },
  { status: "active", changed_at: "2026-05-26T00:00:00Z" },
  { status: "finished", changed_at: "2026-06-10T00:00:00Z" },
]);
ok(rested === 30, "daysRested finished-end = 30 (not 41)", String(rested));
ok(formatMoney(27) === "$27.00", "formatMoney(27)=$27.00", formatMoney(27));
ok(formatMoney(30.5) === "$30.50", "formatMoney(30.5)=$30.50", formatMoney(30.5));
ok(roundMoney(30.511) === 30.51, "roundMoney 2dp");
ok(roundHalf(8.3) === 8.5 && roundHalf(8.2) === 8, "roundHalf 0.5");
ok(mmssToSeconds("3:45") === 225 && secondsToMMSS(225) === "3:45", "m:ss round trip");
ok(coffeeRating([8, 9], null) === 8.5 && coffeeRating([8], 6) === 6, "coffeeRating avg / override");

// ---- migration (pg) ----
const client = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
const tcols = (await client.query("select column_name from information_schema.columns where table_schema='public' and table_name='tastings'")).rows.map((r) => r.column_name);
ok(tcols.includes("overall_rating") && !tcols.includes("overall_override"), "tastings.overall_rating renamed");
const trig = (await client.query("select tgname from pg_trigger where tgname like '%frozen_guard%'")).rows;
ok(trig.length === 0, "freeze guard triggers dropped (Option B)", String(trig.length));
await client.end();

// ---- behavior ----
const mk = async (tag: string) => {
  const email = `p5f-${tag}-${ts}@example.com`, password = "passw0rd-test";
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const c = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
  await c.auth.signInWithPassword({ email, password });
  return { id: data.user!.id, c };
};
const A = await mk("a");
const B = await mk("b");

try {
  const coffee = (await A.c.from("coffees").insert({ name: `C-${ts}` }).select().single()).data;
  const bag = (await A.c.from("coffee_bags").insert({ coffee_id: coffee.id, status: "active", price: 30.5 }).select().single()).data;
  ok(Number(bag.price) === 30.5, "bag price persists (30.5)");
  const sess = (await A.c.from("sessions").insert({ recipe_type: "brewed_coffee", status: "active", coffee_bag_id: bag.id, grind_setting: "20" }).select().single()).data;

  // complete then EDIT (Option B: no freeze)
  await A.c.from("sessions").update({ status: "complete", brewed_at: new Date().toISOString(), days_rested_snapshot: 12 }).eq("id", sess.id);
  const edit = await A.c.from("sessions").update({ grind_setting: "18" }).eq("id", sess.id);
  ok(!edit.error, "completed session editable (freeze removed)", edit.error?.message ?? "");

  // tasting overall_rating standalone → coffee aggregate
  const tasting = (await A.c.from("tastings").insert({ session_id: sess.id, overall_rating: 8.5 }).select().single()).data;
  ok(!tasting.error && Number(tasting.overall_rating) === 8.5, "overall_rating set directly");
  const agg = (await A.c.from("sessions").select("tastings(overall_rating)").eq("id", sess.id).single()).data as { tastings: { overall_rating: number | null }[] };
  ok(coffeeRating([agg.tastings[0].overall_rating], null) === 8.5, "coffee aggregate from overall_rating");

  // clone-to-correct (replicate): copy instance to a new active session
  const clone = await A.c.from("sessions").insert({ recipe_type: "brewed_coffee", status: "active", coffee_bag_id: bag.id, grind_setting: "18" }).select().single();
  ok(!clone.error && clone.data.status === "active", "clone → new active session");

  // delete works
  ok(!(await A.c.from("sessions").delete().eq("id", clone.data.id)).error, "session delete works");

  // RLS
  ok(((await B.c.from("sessions").select("id").eq("id", sess.id)).data ?? []).length === 0, "B cannot see A's session (RLS)");
} finally {
  await admin.auth.admin.deleteUser(A.id);
  await admin.auth.admin.deleteUser(B.id);
  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
