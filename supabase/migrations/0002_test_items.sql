-- Phase 0: throwaway table to PROVE per-user RLS isolation. Removed before Phase 1.
-- Each row is owned by the inserting user; policies scope every operation to auth.uid().

create table if not exists public.test_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  label      text not null,
  created_at timestamptz not null default now()
);

alter table public.test_items enable row level security;

create policy "test_items_select_own" on public.test_items
  for select using (auth.uid() = user_id);

create policy "test_items_insert_own" on public.test_items
  for insert with check (auth.uid() = user_id);

create policy "test_items_update_own" on public.test_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "test_items_delete_own" on public.test_items
  for delete using (auth.uid() = user_id);
