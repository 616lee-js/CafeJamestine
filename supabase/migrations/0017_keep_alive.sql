-- Infra: free-tier keep-alive. A scheduled job (GitHub Actions) calls the RPC below
-- ~3x/week to generate real DB write activity so Supabase never auto-pauses the project.
-- Not user-scoped: a single-row infra table like public.schema_migrations (RLS on, no
-- policies/grants) — only postgres/service_role and the SECURITY DEFINER function touch it.

create table public.keep_alive (
  id smallint primary key,
  last_ping_at timestamptz not null default now()
);
insert into public.keep_alive (id) values (1) on conflict do nothing;

alter table public.keep_alive enable row level security; -- locked: no policies, no grants.

-- SECURITY DEFINER so the anon caller performs a real WRITE despite RLS. The function is
-- owned by the migration runner (postgres, which bypasses RLS); search_path is pinned to
-- prevent hijacking. It only bumps one fixed row's timestamp and returns it — no data
-- exposure, no parameters, nothing user-scoped to reach.
create function public.keep_alive_ping()
  returns timestamptz
  language sql
  security definer
  set search_path = public
as $$
  update public.keep_alive set last_ping_at = now() where id = 1
  returning last_ping_at;
$$;

revoke execute on function public.keep_alive_ping() from public;
grant execute on function public.keep_alive_ping() to anon, authenticated;
