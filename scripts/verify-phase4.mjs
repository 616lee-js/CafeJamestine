// Phase 4 verification: session creation from 3 sources (clone recipe / clone session /
// build new), breadcrumb-carry-forward rule, active status, edit persistence, RLS.
// Mirrors createSession's copy logic (the action itself is server/cookie-bound).
// Run: node --env-file=.env.local scripts/verify-phase4.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ts = Date.now();
let pass = 0, fail = 0;
const ok = (c, label, extra = "") => { console.log(`${c ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`); if (c) pass++; else fail++; };

const INSTANCE = ["brew_method_id","brewer_device_id","grinder_id","grind_setting","dose_grams","water_grams","water_anchor","water_temp_celsius","bloom_grams","bloom_seconds","is_iced","ice_grams"];
const STEPC = ["position","timestamp_seconds","target_weight_grams","flow_rate_ml_s","description"];

const mkUser = async (tag) => {
  const email = `p4-${tag}-${ts}@example.com`;
  const password = "passw0rd-test";
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const client = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
  await client.signInWithPassword?.({ email, password });
  const si = await client.auth.signInWithPassword({ email, password });
  if (si.error) throw si.error;
  return { id: data.user.id, client };
};

// Replicate createSession's clone copy as the signed-in user.
async function cloneInto(c, { recipeType, coffeeBagId, source, sourceId }) {
  const base = { recipe_type: recipeType, status: "active", coffee_bag_id: coffeeBagId };
  if (source === "recipe") {
    const { data: r } = await c.from("recipes").select(INSTANCE.join(",")).eq("id", sourceId).single();
    for (const k of INSTANCE) base[k] = r[k];
    base.recipe_breadcrumb_id = sourceId;
  } else if (source === "session") {
    const { data: s } = await c.from("sessions").select([...INSTANCE, "recipe_breadcrumb_id"].join(",")).eq("id", sourceId).single();
    for (const k of INSTANCE) base[k] = s[k];
    base.recipe_breadcrumb_id = s.recipe_breadcrumb_id ?? null;
  }
  const { data: created, error } = await c.from("sessions").insert(base).select("id").single();
  if (error) throw error;
  if (source !== "new") {
    const pf = source === "recipe" ? "recipe_id" : "session_id";
    const { data: steps } = await c.from("recipe_steps").select(STEPC.join(",")).eq(pf, sourceId);
    if (steps?.length) await c.from("recipe_steps").insert(steps.map((s) => { const r = { session_id: created.id }; for (const k of STEPC) r[k] = s[k]; return r; }));
  }
  return created.id;
}

const A = await mkUser("a");
const B = await mkUser("b");

try {
  // seed: coffee + active bag + standard recipe (2 steps) + a prior session (breadcrumb=recipe, 2 steps)
  const coffee = (await A.client.from("coffees").insert({ name: `C-${ts}` }).select().single()).data;
  const bag = (await A.client.from("coffee_bags").insert({ coffee_id: coffee.id, status: "active" }).select().single()).data;
  const recipe = (await A.client.from("recipes").insert({ recipe_type: "brewed_coffee", name: `R-${ts}`, is_standard: true, dose_grams: 18, water_grams: 300 }).select().single()).data;
  await A.client.from("recipe_steps").insert([
    { recipe_id: recipe.id, position: 1, timestamp_seconds: 0, description: "bloom" },
    { recipe_id: recipe.id, position: 2, timestamp_seconds: 45, description: "pour" },
  ]);
  const prior = (await A.client.from("sessions").insert({ recipe_type: "brewed_coffee", status: "active", coffee_bag_id: bag.id, recipe_breadcrumb_id: recipe.id, dose_grams: 17 }).select().single()).data;
  await A.client.from("recipe_steps").insert([
    { session_id: prior.id, position: 1, description: "s1" },
    { session_id: prior.id, position: 2, description: "s2" },
  ]);

  // clone recipe
  const sFromRecipe = await cloneInto(A.client, { recipeType: "brewed_coffee", coffeeBagId: bag.id, source: "recipe", sourceId: recipe.id });
  const r1 = (await A.client.from("sessions").select("dose_grams, recipe_breadcrumb_id, coffee_bag_id, status").eq("id", sFromRecipe).single()).data;
  const r1steps = (await A.client.from("recipe_steps").select("id").eq("session_id", sFromRecipe)).data ?? [];
  ok(Number(r1.dose_grams) === 18, "clone recipe: params copied (dose 18)", String(r1.dose_grams));
  ok(r1.recipe_breadcrumb_id === recipe.id, "clone recipe: breadcrumb = recipe");
  ok(r1steps.length === 2, "clone recipe: steps copied", String(r1steps.length));
  ok(r1.status === "active", "clone recipe: status active");

  // clone session — breadcrumb must carry the TEMPLATE forward (= recipe), NOT the prior session id
  const sFromSession = await cloneInto(A.client, { recipeType: "brewed_coffee", coffeeBagId: bag.id, source: "session", sourceId: prior.id });
  const r2 = (await A.client.from("sessions").select("dose_grams, recipe_breadcrumb_id").eq("id", sFromSession).single()).data;
  const r2steps = (await A.client.from("recipe_steps").select("id").eq("session_id", sFromSession)).data ?? [];
  ok(Number(r2.dose_grams) === 17, "clone session: params copied (dose 17)", String(r2.dose_grams));
  ok(r2.recipe_breadcrumb_id === recipe.id, "clone session: breadcrumb = template (recipe), not prior session");
  ok(r2.recipe_breadcrumb_id !== prior.id, "clone session: breadcrumb is NOT the prior session id");
  ok(r2steps.length === 2, "clone session: steps copied", String(r2steps.length));

  // build new
  const sNew = await cloneInto(A.client, { recipeType: "brewed_coffee", coffeeBagId: bag.id, source: "new" });
  const r3 = (await A.client.from("sessions").select("dose_grams, recipe_breadcrumb_id").eq("id", sNew).single()).data;
  ok(r3.dose_grams == null && r3.recipe_breadcrumb_id == null, "build new: empty instance + null breadcrumb");

  // specialty build new — no coffee bag
  const sSpec = await cloneInto(A.client, { recipeType: "specialty_drink", coffeeBagId: null, source: "new" });
  const r4 = (await A.client.from("sessions").select("coffee_bag_id, recipe_type").eq("id", sSpec).single()).data;
  ok(r4.coffee_bag_id == null && r4.recipe_type === "specialty_drink", "specialty: coffee_bag_id null");

  // edit persists
  await A.client.from("sessions").update({ dose_grams: 20 }).eq("id", sFromRecipe);
  const edited = (await A.client.from("sessions").select("dose_grams").eq("id", sFromRecipe).single()).data;
  ok(Number(edited.dose_grams) === 20, "session edit persists");

  // RLS
  const bSees = (await B.client.from("sessions").select("id").eq("coffee_bag_id", bag.id)).data ?? [];
  ok(bSees.length === 0, "B cannot see A's sessions (RLS)");
} finally {
  await admin.auth.admin.deleteUser(A.id);
  await admin.auth.admin.deleteUser(B.id);
  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
