-- Product feedback: an in-app widget files a bug or a request together with the page it was
-- submitted from, and a review screen triages them.
--
-- Deliberately NOT public._setup_user_table: that helper hard-codes owner-scoped policies and
-- a NOT NULL user_id. Neither fits here — the widget is on every page including the signed-out
-- ones, so submissions can be anonymous, and any signed-in user triages the whole list.

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  -- Nullable + defaulted: auth.uid() resolves to null for an anonymous submission.
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  kind text not null check (kind in ('bug', 'request')),
  -- Bounded because anon can insert: keeps a spam row cheap.
  body text not null check (length(btrim(body)) between 1 and 4000),
  page_path text check (length(page_path) <= 512),
  status text not null default 'new' check (status in ('new', 'complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_feedback_status_created on public.feedback (status, created_at desc);

create trigger feedback_set_updated_at
  before update on public.feedback
  for each row execute function public.set_updated_at();

alter table public.feedback enable row level security;

-- Secure-by-default project: grants are never implicit, every new table needs them spelled out.
grant insert on public.feedback to anon, authenticated;
grant select, update, delete on public.feedback to authenticated;

-- Anyone may file. Only signed-in users may read or triage — anon has no SELECT grant and no
-- select policy, so to the public this table is write-only.
create policy feedback_insert_any on public.feedback
  for insert to anon, authenticated with check (true);
create policy feedback_select_auth on public.feedback
  for select to authenticated using (true);
create policy feedback_update_auth on public.feedback
  for update to authenticated using (true) with check (true);
create policy feedback_delete_auth on public.feedback
  for delete to authenticated using (true);
