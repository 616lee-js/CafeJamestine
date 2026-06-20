// Applies supabase/migrations/*.sql in filename order, tracked in public.schema_migrations.
// Run: node --env-file=.env.local scripts/migrate.mjs
// Needs SUPABASE_DB_URL (Postgres connection string) in the env.
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, "..", "supabase", "migrations");

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error("Missing SUPABASE_DB_URL in env (.env.local).");
  process.exit(1);
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  await client.query(`
    create table if not exists public.schema_migrations (
      version text primary key,
      applied_at timestamptz not null default now()
    )`);
  // Tracking table is infra: RLS on, no client grants (service_role/postgres only).
  await client.query("alter table public.schema_migrations enable row level security");

  // Live-DB bootstrap: 0001/0002 were applied by hand in Phase 0 (before tracking existed).
  // If invite_codes already exists, mark them applied so we don't try to re-run them.
  const live = await client.query(
    "select to_regclass('public.invite_codes') is not null as exists",
  );
  if (live.rows[0].exists) {
    await client.query(
      `insert into public.schema_migrations (version) values
         ('0001_invite_codes'), ('0002_test_items')
       on conflict do nothing`,
    );
  }

  const applied = new Set(
    (await client.query("select version from public.schema_migrations")).rows.map(
      (r) => r.version,
    ),
  );

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let ran = 0;
  for (const file of files) {
    const version = file.replace(/\.sql$/, "");
    if (applied.has(version)) {
      console.log(`skip  ${version}`);
      continue;
    }
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query(
        "insert into public.schema_migrations (version) values ($1)",
        [version],
      );
      await client.query("commit");
      console.log(`APPLY ${version}`);
      ran++;
    } catch (e) {
      await client.query("rollback");
      console.error(`FAIL  ${version}: ${e.message}`);
      throw e;
    }
  }
  console.log(`\nDone. ${ran} migration(s) applied.`);
} finally {
  await client.end();
}
