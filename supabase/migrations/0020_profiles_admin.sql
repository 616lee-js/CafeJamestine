-- Admin concept. Until now every table was owner-scoped and there were no roles at all; the
-- order-management feature needs a privileged actor who controls the menu, the home-café
-- session and the order queue.
--
-- SECURITY: the flag must not be self-settable. public._setup_user_table grants owner-scoped
-- UPDATE, which would let any signed-in user PATCH their own row to is_admin = true. So this
-- table is written by hand: authenticated gets SELECT on its own row and nothing else. The flag
-- is set only through service_role or direct SQL.

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Deliberately no INSERT/UPDATE/DELETE grant for authenticated: privilege escalation would
-- otherwise be a single request away.
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

create policy profiles_select_own on public.profiles
  for select to authenticated using (user_id = auth.uid());

-- Policies on the order-management tables call this instead of sub-selecting profiles: a plain
-- subquery would itself be evaluated under profiles' RLS. SECURITY DEFINER bypasses that, and
-- search_path is pinned to prevent hijacking (same pattern as keep_alive_ping in 0017).
create function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.user_id = auth.uid()), false);
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Elevate an account (run manually, not part of this migration):
--   insert into public.profiles (user_id, is_admin)
--   select id, true from auth.users where email = 'you@example.com'
--   on conflict (user_id) do update set is_admin = true;
