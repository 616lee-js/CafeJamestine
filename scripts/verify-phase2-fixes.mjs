// Verify the Phase-2 bug-fix batch: renames/new columns, FK RESTRICT, persistence,
// no-auto-status-event, reference rename propagation, status-event edit/delete.
// Run: node --env-file=.env.local scripts/verify-phase2-fixes.mjs
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ts = Date.now();
let pass = 0, fail = 0;
const ok = (c, label, extra = "") => { console.log(`${c ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`); if (c) pass++; else fail++; };

// ---- schema checks via pg ----
const client = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
const cols = async (t) =>
  (await client.query("select column_name from information_schema.columns where table_schema='public' and table_name=$1", [t])).rows.map((r) => r.column_name);

const coffeeCols = await cols("coffees");
ok(coffeeCols.includes("flavor_notes"), "coffees.flavor_notes exists");
ok(!coffeeCols.includes("roaster_notes"), "coffees.roaster_notes gone");
ok(["elevation", "salinity", "humidity"].every((c) => coffeeCols.includes(c)), "coffees Tier-3 fields exist");
const eqCols = await cols("equipment");
ok(eqCols.includes("sub_category"), "equipment.sub_category exists");
ok(!eqCols.includes("type"), "equipment.type gone");

const fks = (await client.query(`
  select rel.relname tbl, c.confdeltype,
    (select attname from pg_attribute where attrelid=c.conrelid and attnum=c.conkey[1]) col
  from pg_constraint c join pg_class rel on rel.oid=c.conrelid join pg_namespace n on n.oid=rel.relnamespace
  where c.contype='f' and n.nspname='public'`)).rows;
const isRestrict = (tbl, col) => fks.find((f) => f.tbl === tbl && f.col === col)?.confdeltype === "r";
for (const [t, c] of [
  ["coffees", "roaster_id"], ["coffees", "country_id"], ["coffees", "region_id"], ["coffees", "producer_id"],
  ["recipes", "roaster_id"], ["recipes", "country_id"], ["recipes", "process_id"],
  ["regions", "country_id"], ["coffee_processes", "process_id"], ["coffee_varietals", "varietal_id"],
]) ok(isRestrict(t, c), `FK RESTRICT ${t}.${c}`);
await client.end();

// ---- behavior checks via PostgREST as a real user ----
const email = `fix-${ts}@example.com`;
const password = "passw0rd-test";
const { data: u, error: ce } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
if (ce) throw ce;
const A = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
await A.auth.signInWithPassword({ email, password });

try {
  const roaster = await A.from("roasters").insert({ name: `R-${ts}` }).select().single();
  const coffee = await A.from("coffees").insert({ name: `C-${ts}`, roaster_id: roaster.data.id, flavor_notes: "melon", elevation: "1900" }).select().single();
  ok(!coffee.error, "insert coffee with flavor_notes/elevation", coffee.error?.message ?? "");

  // bag persistence
  const bag = await A.from("coffee_bags").insert({ coffee_id: coffee.data.id }).select().single();
  const evCount = (await A.from("coffee_bag_status_events").select("id").eq("coffee_bag_id", bag.data.id)).data ?? [];
  ok(evCount.length === 0, "no auto status event on bag create", String(evCount.length));
  await A.from("coffee_bags").update({ price: 19.5, notes: "kept" }).eq("id", bag.data.id);
  const readBack = (await A.from("coffee_bags").select("price, notes").eq("id", bag.data.id).single()).data;
  ok(Number(readBack.price) === 19.5 && readBack.notes === "kept", "bag price+notes persist", JSON.stringify(readBack));

  // status event add / edit / delete
  const ev = await A.from("coffee_bag_status_events").insert({ coffee_bag_id: bag.data.id, status: "frozen", changed_at: new Date().toISOString() }).select().single();
  ok(!ev.error, "add status event");
  const upd = await A.from("coffee_bag_status_events").update({ status: "resting" }).eq("id", ev.data.id);
  ok(!upd.error, "edit status event");
  const del = await A.from("coffee_bag_status_events").delete().eq("id", ev.data.id);
  ok(!del.error, "delete status event");

  // reference rename propagates (read coffee's roaster name via join)
  await A.from("roasters").update({ name: `R-${ts}-renamed` }).eq("id", roaster.data.id);
  const joined = (await A.from("coffees").select("roasters(name)").eq("id", coffee.data.id).single()).data;
  ok(joined.roasters.name === `R-${ts}-renamed`, "reference rename propagates via FK");

  // RESTRICT: roaster in use can't be deleted
  const delR = await A.from("roasters").delete().eq("id", roaster.data.id);
  ok(!!delR.error && delR.error.code === "23503", "delete in-use roaster RESTRICTED", delR.error?.code ?? "");
} finally {
  await admin.auth.admin.deleteUser(u.user.id);
  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
