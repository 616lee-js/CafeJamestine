// Phase 4 fixes: recipe_ingredients + units schema, unit RESTRICT-in-use, one-parent CHECK,
// clone copies ingredients, RLS. Run: node --env-file=.env.local scripts/verify-phase4-fixes.mjs
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ts = Date.now();
let pass = 0, fail = 0;
const ok = (c, label, extra = "") => { console.log(`${c ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`); if (c) pass++; else fail++; };

// schema (pg)
const client = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
const cols = (await client.query("select column_name from information_schema.columns where table_schema='public' and table_name='recipe_ingredients'")).rows.map((r) => r.column_name);
ok(["name", "quantity", "unit_id", "position", "recipe_id", "session_id", "user_id"].every((c) => cols.includes(c)), "recipe_ingredients columns present");
const unitsExists = (await client.query("select to_regclass('public.units') is not null e")).rows[0].e;
ok(unitsExists, "units table exists");
const fk = (await client.query(`select c.confdeltype from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace where n.nspname='public' and t.relname='recipe_ingredients' and c.contype='f' and (select attname from pg_attribute where attrelid=c.conrelid and attnum=c.conkey[1])='unit_id'`)).rows[0];
ok(fk?.confdeltype === "r", "recipe_ingredients.unit_id ON DELETE RESTRICT");
const chk = (await client.query("select pg_get_constraintdef(oid) d from pg_constraint where conname='recipe_ingredients_exactly_one_parent'")).rows[0]?.d ?? "";
ok(/num_nonnulls/.test(chk), "recipe_ingredients one-parent CHECK present");
await client.end();

// behavior
const email = `p4f-${ts}@example.com`, password = "passw0rd-test";
const { data: u } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
const A = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
await A.auth.signInWithPassword({ email, password });
const B = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
const bEmail = `p4f-b-${ts}@example.com`;
const { data: ub } = await admin.auth.admin.createUser({ email: bEmail, password, email_confirm: true });
await B.auth.signInWithPassword({ email: bEmail, password });

try {
  const unit = (await A.from("units").insert({ name: `g-${ts}` }).select().single()).data;
  ok(!!unit, "create unit (reference)");
  const recipe = (await A.from("recipes").insert({ recipe_type: "specialty_drink", name: `D-${ts}` }).select().single()).data;
  const ing = await A.from("recipe_ingredients").insert({ recipe_id: recipe.id, name: "Milk", quantity: 120, unit_id: unit.id, position: 1 });
  ok(!ing.error, "add ingredient (name+qty+unit)", ing.error?.message ?? "");
  await A.from("recipe_steps").insert({ recipe_id: recipe.id, position: 1, description: "steam" });

  // unit RESTRICT in use
  const delU = await A.from("units").delete().eq("id", unit.id);
  ok(!!delU.error && delU.error.code === "23503", "delete in-use unit RESTRICTED", delU.error?.code ?? "");

  // one-parent CHECK
  const sess = (await A.from("sessions").insert({ recipe_type: "specialty_drink", status: "active" }).select().single()).data;
  const noParent = await A.from("recipe_ingredients").insert({ name: "orphan", position: 1 });
  ok(!!noParent.error, "ingredient with no parent REJECTED");
  const bothParent = await A.from("recipe_ingredients").insert({ recipe_id: recipe.id, session_id: sess.id, name: "both" });
  ok(!!bothParent.error, "ingredient with two parents REJECTED");

  // clone copies ingredients (replicate createSession copy for specialty)
  const ings = (await A.from("recipe_ingredients").select("name, quantity, unit_id, position").eq("recipe_id", recipe.id)).data ?? [];
  await A.from("recipe_ingredients").insert(ings.map((i) => ({ session_id: sess.id, ...i })));
  const sessIngs = (await A.from("recipe_ingredients").select("name, quantity").eq("session_id", sess.id)).data ?? [];
  ok(sessIngs.length === 1 && Number(sessIngs[0].quantity) === 120, "clone copies ingredients to session", JSON.stringify(sessIngs));

  // RLS
  const bSees = (await B.from("recipe_ingredients").select("id").eq("recipe_id", recipe.id)).data ?? [];
  ok(bSees.length === 0, "B cannot see A's ingredients (RLS)");
} finally {
  await admin.auth.admin.deleteUser(u.user.id);
  await admin.auth.admin.deleteUser(ub.user.id);
  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
