// Functional RLS + constraint test via the PostgREST API (real auth flow, Phase 0 pattern).
// Run: node --env-file=.env.local scripts/rls-test.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ts = Date.now();
let pass = 0, fail = 0;
const ok = (c, label, extra = "") => { console.log(`${c ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`); c ? pass++ : fail++; };

const mkUser = async (tag) => {
  const email = `rls-${tag}-${ts}@example.com`;
  const password = "passw0rd-test";
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const client = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
  const si = await client.auth.signInWithPassword({ email, password });
  if (si.error) throw si.error;
  return { id: data.user.id, client };
};

const A = await mkUser("a");
const B = await mkUser("b");

try {
  // A builds a small chain: roaster -> coffee -> coffee_bag
  const r = await A.client.from("roasters").insert({ name: `Roaster A ${ts}` }).select().single();
  ok(!r.error, "A insert roaster", r.error?.message ?? "");
  const cf = await A.client.from("coffees").insert({ name: `Coffee A ${ts}`, roaster_id: r.data.id }).select().single();
  ok(!cf.error, "A insert coffee", cf.error?.message ?? "");
  const bag = await A.client.from("coffee_bags").insert({ coffee_id: cf.data.id }).select().single();
  ok(!bag.error, "A insert coffee_bag (status defaults resting)", bag.error?.message ?? "");

  // B builds its own coffee
  const cfB = await B.client.from("coffees").insert({ name: `Coffee B ${ts}` }).select().single();
  ok(!cfB.error, "B insert coffee", cfB.error?.message ?? "");

  // isolation: A sees only its coffees; B sees only its; service_role sees both
  const aCoffees = (await A.client.from("coffees").select("name")).data?.map((x) => x.name) ?? [];
  const bCoffees = (await B.client.from("coffees").select("name")).data?.map((x) => x.name) ?? [];
  ok(aCoffees.length === 1 && aCoffees[0].includes("Coffee A"), "A sees only own coffee", JSON.stringify(aCoffees));
  ok(bCoffees.length === 1 && bCoffees[0].includes("Coffee B"), "B sees only own coffee", JSON.stringify(bCoffees));
  ok(!aCoffees.some((n) => n.includes("Coffee B")), "A cannot see B's coffee");

  const aBags = (await A.client.from("coffee_bags").select("id")).data ?? [];
  const bBags = (await B.client.from("coffee_bags").select("id")).data ?? [];
  ok(aBags.length === 1, "A sees own bag");
  ok(bBags.length === 0, "B sees no bags (none created)");

  const adminCoffees = (await admin.from("coffees").select("name").ilike("name", `%${ts}%`)).data ?? [];
  ok(adminCoffees.length === 2, "service_role sees both coffees", String(adminCoffees.length));

  // constraint: recipe_steps requires exactly one parent
  const rec = await A.client.from("recipes").insert({ name: `Rec A ${ts}`, recipe_type: "brewed_coffee" }).select().single();
  ok(!rec.error, "A insert recipe", rec.error?.message ?? "");
  const stepGood = await A.client.from("recipe_steps").insert({ recipe_id: rec.data.id, position: 1, description: "bloom" });
  ok(!stepGood.error, "recipe_steps with one parent OK", stepGood.error?.message ?? "");
  const stepBad = await A.client.from("recipe_steps").insert({ position: 1, description: "orphan" });
  ok(!!stepBad.error, "recipe_steps with no parent REJECTED");

  // constraint: deleting a bag that has a session is blocked (RESTRICT)
  const sess = await A.client.from("sessions").insert({ recipe_type: "brewed_coffee", coffee_bag_id: bag.data.id }).select().single();
  ok(!sess.error, "A insert session on bag", sess.error?.message ?? "");
  const delBag = await A.client.from("coffee_bags").delete().eq("id", bag.data.id);
  ok(!!delBag.error, "delete bag with session BLOCKED (RESTRICT)", delBag.error?.message ?? "");

  // CHECK: bad rating rejected
  const tasting = await A.client.from("tastings").insert({ session_id: sess.data.id }).select().single();
  const badRating = await A.client.from("tasting_entries").insert({
    tasting_id: tasting.data.id,
    category_id: (await admin.from("tasting_categories").select("id").eq("slug", "aroma").single()).data.id,
    rating: 9,
  });
  ok(!!badRating.error, "tasting_entries rating>5 REJECTED");
} finally {
  await admin.auth.admin.deleteUser(A.id);
  await admin.auth.admin.deleteUser(B.id);
  const leftover = (await admin.from("coffees").select("id").ilike("name", `%${ts}%`)).data ?? [];
  ok(leftover.length === 0, "cleanup: user delete cascaded all rows", String(leftover.length));
  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
