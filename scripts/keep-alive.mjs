// Supabase free-tier keep-alive. Calls the public.keep_alive_ping() RPC, which performs a
// real Postgres WRITE (bumps keep_alive.last_ping_at) so the project is never auto-paused.
// Dependency-free: uses Node's global fetch (Node 18+). Anon key only — nothing privileged.
// Run locally: node --env-file=.env.local scripts/keep-alive.mjs
// In CI: env SUPABASE_URL + SUPABASE_ANON_KEY (see .github/workflows/keep-alive.yml).

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error("keep-alive FAILED: missing SUPABASE_URL and/or SUPABASE_ANON_KEY in env.");
  process.exit(1);
}

const endpoint = `${url.replace(/\/$/, "")}/rest/v1/rpc/keep_alive_ping`;

try {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`keep-alive FAILED: HTTP ${res.status} ${res.statusText} — ${body}`);
    process.exit(1);
  }
  // body is the returned timestamptz (JSON string), proving the write executed.
  console.log("keep-alive ok:", body.trim());
} catch (e) {
  console.error(`keep-alive FAILED: ${e?.message ?? e}`);
  process.exit(1);
}
