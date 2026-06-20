-- Phase 1: tastings (post-session feedback block) + per-category entries.

create table public.tastings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  session_id uuid references public.sessions (id) on delete cascade,  -- nullable: v2 café-review path
  overall_override numeric check (overall_override >= 1 and overall_override <= 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('tastings');
create index idx_tastings_session_id on public.tastings (session_id);

create table public.tasting_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tasting_id uuid not null references public.tastings (id) on delete cascade,
  category_id uuid not null references public.tasting_categories (id),
  rating smallint check (rating >= 1 and rating <= 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('tasting_entries');
create index idx_tasting_entries_tasting_id on public.tasting_entries (tasting_id);
create index idx_tasting_entries_category_id on public.tasting_entries (category_id);
