// Phase 2 verification: compute helpers (unit) + storage isolation + CRUD/RLS (live).
// Run: node --env-file=.env.local scripts/verify-phase2.ts
import { createClient } from "@supabase/supabase-js";
import {
  coffeeStatus,
  bagCountsByStatus,
  priceRange,
  daysRested,
} from "../src/lib/compute.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ts = Date.now();
let pass = 0, fail = 0;
const ok = (c: boolean, label: string, extra = "") => {
  console.log(`${c ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`);
  if (c) pass++; else fail++;
};
const isoDaysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

// ---------- compute unit checks ----------
ok(coffeeStatus([{ status: "frozen" }, { status: "active" }]) === "active", "coffeeStatus: active wins");
ok(coffeeStatus([{ status: "finished" }, { status: "resting" }]) === "resting", "coffeeStatus: resting over finished");
ok(coffeeStatus([]) === null, "coffeeStatus: none when empty");
const counts = bagCountsByStatus([{ status: "active" }, { status: "active" }, { status: "frozen" }]);
ok(counts.active === 2 && counts.frozen === 1, "bagCountsByStatus");
const pr = priceRange([{ price: 18 }, { price: 22 }, { price: null }]);
ok(pr?.min === 18 && pr?.max === 22, "priceRange min/max ignores null");
ok(priceRange([{ price: null }]) === null, "priceRange null when no prices");
// roast 20d ago; frozen from 20d-ago to 15d-ago (5 frozen days) then resting → ~15 rested
const roast = new Date(Date.now() - 20 * 86400000).toISOString().slice(0, 10);
const dr = daysRested(roast, [
  { status: "frozen", changed_at: isoDaysAgo(20) },
  { status: "resting", changed_at: isoDaysAgo(15) },
]);
ok(dr === 15, "daysRested subtracts 5 frozen days", String(dr));
ok(daysRested(null, []) === null, "daysRested null without roast date");

// ---------- live storage + CRUD/RLS ----------
const mkUser = async (tag: string) => {
  const email = `p2-${tag}-${ts}@example.com`;
  const password = "passw0rd-test";
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const client = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
  const si = await client.auth.signInWithPassword({ email, password });
  if (si.error) throw si.error;
  return { id: data.user!.id, client };
};

const A = await mkUser("a");
const B = await mkUser("b");

try {
  // storage: A uploads under its own folder
  const path = `${A.id}/coffees/test/${ts}.txt`;
  const up = await A.client.storage.from("images").upload(path, new Blob(["hello"], { type: "text/plain" }));
  ok(!up.error, "A uploads to own folder", up.error?.message ?? "");

  const signed = await A.client.storage.from("images").createSignedUrl(path, 60);
  const res = signed.data?.signedUrl ? await fetch(signed.data.signedUrl) : null;
  ok(res?.status === 200, "A signed URL fetch 200", String(res?.status));

  // B cannot upload into A's folder, nor read A's object
  const bUp = await B.client.storage.from("images").upload(`${A.id}/coffees/evil/${ts}.txt`, new Blob(["x"]));
  ok(!!bUp.error, "B cannot write into A's folder (RLS)");
  const bDl = await B.client.storage.from("images").download(path);
  ok(!!bDl.error, "B cannot read A's object (RLS)");

  const del = await A.client.storage.from("images").remove([path]);
  ok(!del.error, "A deletes own object");
  const after = await A.client.storage.from("images").download(path);
  ok(!!after.error, "object gone after delete");

  // CRUD/RLS: A builds coffee + roaster + 2 bags + events
  const roaster = await A.client.from("roasters").insert({ name: `R-${ts}` }).select().single();
  const coffee = await A.client.from("coffees").insert({ name: `C-${ts}`, roaster_id: roaster.data!.id }).select().single();
  ok(!coffee.error, "A insert coffee with roaster", coffee.error?.message ?? "");
  const bag1 = await A.client.from("coffee_bags").insert({ coffee_id: coffee.data!.id, status: "active", price: 18 }).select().single();
  const bag2 = await A.client.from("coffee_bags").insert({ coffee_id: coffee.data!.id, status: "frozen", price: 22 }).select().single();
  ok(!bag1.error && !bag2.error, "A insert 2 bags");
  const ev = await A.client.from("coffee_bag_status_events").insert({ coffee_bag_id: bag1.data!.id, status: "active", changed_at: new Date().toISOString() });
  ok(!ev.error, "A insert status event");

  // join tables
  const proc = await A.client.from("processes").insert({ name: `P-${ts}` }).select().single();
  const cp = await A.client.from("coffee_processes").insert({ coffee_id: coffee.data!.id, process_id: proc.data!.id });
  ok(!cp.error, "A insert coffee_processes join");

  // isolation
  const aCoffees = (await A.client.from("coffees").select("name").ilike("name", `C-${ts}`)).data ?? [];
  const bCoffees = (await B.client.from("coffees").select("name").ilike("name", `C-${ts}`)).data ?? [];
  ok(aCoffees.length === 1, "A sees own coffee");
  ok(bCoffees.length === 0, "B cannot see A's coffee (RLS)");
  const bBags = (await B.client.from("coffee_bags").select("id").eq("coffee_id", coffee.data!.id)).data ?? [];
  ok(bBags.length === 0, "B cannot see A's bags (RLS)");
} finally {
  await admin.auth.admin.deleteUser(A.id);
  await admin.auth.admin.deleteUser(B.id);
  // remove any stray storage objects from the test
  const { data: aFiles } = await admin.storage.from("images").list(`${A.id}/coffees/test`);
  if (aFiles?.length) await admin.storage.from("images").remove(aFiles.map((f) => `${A.id}/coffees/test/${f.name}`));
  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
