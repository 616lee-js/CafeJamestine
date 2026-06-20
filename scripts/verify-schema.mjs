// Structural verification of the Phase 1 schema against the registry.
// Run: node --env-file=.env.local scripts/verify-schema.mjs
import pg from "pg";

const USER_TABLES = [
  "roasters", "countries", "regions", "producers", "processes", "varietals",
  "equipment", "coffees", "coffee_processes", "coffee_varietals",
  "coffee_bags", "coffee_bag_status_events",
  "recipes", "sessions", "recipe_steps", "tastings", "tasting_entries",
  "user_quotas", "claude_usage_events",
];
const SEED_TABLES = ["brew_methods", "tasting_categories", "roast_levels", "equipment_categories"];
const SEED_COUNTS = { brew_methods: 8, tasting_categories: 9, roast_levels: 5, equipment_categories: 11 };

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

let pass = 0, fail = 0;
const ok = (cond, label, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`);
  cond ? pass++ : fail++;
};

try {
  // 1. all expected tables exist
  const tables = new Set(
    (await client.query(
      "select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE'",
    )).rows.map((r) => r.table_name),
  );
  for (const t of [...USER_TABLES, ...SEED_TABLES, "invite_codes"]) ok(tables.has(t), `table exists: ${t}`);
  ok(!tables.has("test_items"), "test_items dropped");

  // 2. RLS enabled everywhere
  const rls = new Map(
    (await client.query(
      "select relname, relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relkind='r'",
    )).rows.map((r) => [r.relname, r.relrowsecurity]),
  );
  for (const t of [...USER_TABLES, ...SEED_TABLES, "invite_codes"]) ok(rls.get(t) === true, `RLS on: ${t}`);

  // 3. policy counts: user tables = 4, seed = 1, invite_codes = 0
  const pol = new Map();
  for (const r of (await client.query("select tablename, count(*)::int n from pg_policies where schemaname='public' group by tablename")).rows)
    pol.set(r.tablename, r.n);
  for (const t of USER_TABLES) ok((pol.get(t) ?? 0) === 4, `4 policies: ${t}`, `(${pol.get(t) ?? 0})`);
  for (const t of SEED_TABLES) ok((pol.get(t) ?? 0) === 1, `1 policy: ${t}`);
  ok((pol.get("invite_codes") ?? 0) === 0, "invite_codes has no policies");

  // 4. every user table has user_id column
  const cols = (await client.query(
    "select table_name, column_name from information_schema.columns where table_schema='public'",
  )).rows;
  const colsByTable = new Map();
  for (const c of cols) {
    if (!colsByTable.has(c.table_name)) colsByTable.set(c.table_name, new Set());
    colsByTable.get(c.table_name).add(c.column_name);
  }
  for (const t of USER_TABLES) ok(colsByTable.get(t)?.has("user_id"), `user_id col: ${t}`);

  // 5. key column-name checks (registry-locked names)
  ok(colsByTable.get("coffees")?.has("roast_level_id"), "coffees.roast_level_id");
  ok(colsByTable.get("equipment")?.has("category_id"), "equipment.category_id");
  ok(colsByTable.get("sessions")?.has("recipe_breadcrumb_id"), "sessions.recipe_breadcrumb_id");
  ok(colsByTable.get("sessions")?.has("days_rested_snapshot"), "sessions.days_rested_snapshot");
  ok(colsByTable.get("recipes")?.has("water_temp_celsius"), "recipes.water_temp_celsius");
  ok(colsByTable.get("recipe_steps")?.has("flow_rate_ml_s"), "recipe_steps.flow_rate_ml_s");

  // 6. seed counts
  for (const t of SEED_TABLES) {
    const n = (await client.query(`select count(*)::int n from public.${t}`)).rows[0].n;
    ok(n === SEED_COUNTS[t], `seed count ${t} = ${SEED_COUNTS[t]}`, `(${n})`);
  }
  const fam = (await client.query(
    "select count(*)::int n from public.brew_methods where (slug in ('pour_over','immersion','hybrid','cupping') and behavior_family='filter' and default_water_anchor='input') or (slug in ('espresso','ristretto','allonge','turbo') and behavior_family='espresso' and default_water_anchor='output')",
  )).rows[0].n;
  ok(fam === 8, "brew_methods families/anchors correct");

  // 7. FK delete behaviors (confdeltype: r=restrict, c=cascade, n=set null)
  const fks = (await client.query(`
    select c.conname, t.relname as tbl, c.confdeltype,
           (select string_agg(a.attname, ',') from unnest(c.conkey) k join pg_attribute a on a.attrelid=c.conrelid and a.attnum=k) as col
    from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace
    where c.contype='f' and n.nspname='public'`)).rows;
  const fkOf = (tbl, col) => fks.find((f) => f.tbl === tbl && f.col === col);
  ok(fkOf("sessions", "coffee_bag_id")?.confdeltype === "r", "sessions.coffee_bag_id ON DELETE RESTRICT");
  ok(fkOf("coffee_bags", "coffee_id")?.confdeltype === "c", "coffee_bags.coffee_id ON DELETE CASCADE");
  ok(fkOf("coffees", "roaster_id")?.confdeltype === "n", "coffees.roaster_id ON DELETE SET NULL");

  // 8. recipe_steps exactly-one-parent CHECK
  const chk = (await client.query(
    "select pg_get_constraintdef(oid) d from pg_constraint where conname='recipe_steps_exactly_one_parent'",
  )).rows[0]?.d ?? "";
  ok(/num_nonnulls/.test(chk), "recipe_steps exactly-one-parent CHECK present");

  // 9. grants: authenticated CAN access coffees, CANNOT access invite_codes
  const g = (await client.query(`
    select has_table_privilege('authenticated','public.coffees','select') as coffees_sel,
           has_table_privilege('authenticated','public.invite_codes','select') as invite_sel,
           has_table_privilege('authenticated','public.brew_methods','select') as bm_sel,
           has_table_privilege('authenticated','public.brew_methods','insert') as bm_ins`)).rows[0];
  ok(g.coffees_sel === true, "authenticated CAN select coffees");
  ok(g.invite_sel === false, "authenticated CANNOT select invite_codes");
  ok(g.bm_sel === true && g.bm_ins === false, "authenticated read-only on brew_methods");

  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
} finally {
  await client.end();
}
