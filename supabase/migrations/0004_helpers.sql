-- Phase 1 helpers: shared updated_at trigger fn + per-table RLS/grant/index setup fns.
-- These remove repetition across the schema migrations and keep policies uniform.

create extension if not exists pgcrypto;

-- Maintains updated_at on every row update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Standard setup for a USER-OWNED table (must have user_id + updated_at columns):
-- enable RLS, owner-scoped CRUD policies, grants, updated_at trigger, user_id index.
create or replace function public._setup_user_table(p_table text)
returns void
language plpgsql
as $$
begin
  execute format('alter table public.%I enable row level security', p_table);
  execute format('grant select, insert, update, delete on public.%I to authenticated, service_role', p_table);
  execute format('create policy %I on public.%I for select using (auth.uid() = user_id)',
                 p_table || '_select_own', p_table);
  execute format('create policy %I on public.%I for insert with check (auth.uid() = user_id)',
                 p_table || '_insert_own', p_table);
  execute format('create policy %I on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)',
                 p_table || '_update_own', p_table);
  execute format('create policy %I on public.%I for delete using (auth.uid() = user_id)',
                 p_table || '_delete_own', p_table);
  execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
                 p_table || '_set_updated_at', p_table);
  execute format('create index %I on public.%I (user_id)',
                 'idx_' || p_table || '_user_id', p_table);
end;
$$;

-- Standard setup for a GLOBAL SEED/LOOKUP table (no user_id): RLS on, read-all for
-- authenticated, full access for service_role (seeding/maintenance).
create or replace function public._setup_seed_table(p_table text)
returns void
language plpgsql
as $$
begin
  execute format('alter table public.%I enable row level security', p_table);
  execute format('grant select on public.%I to authenticated', p_table);
  execute format('grant select, insert, update, delete on public.%I to service_role', p_table);
  execute format('create policy %I on public.%I for select using (true)',
                 p_table || '_select_all', p_table);
end;
$$;
