-- Phase 1: minimal per-user Claude API quota + usage logging stubs (used from the voice phase).
-- User reads own rows; quota/usage writes happen via the server (service_role) later.

create table public.user_quotas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  monthly_token_limit integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('user_quotas');

create table public.claude_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text,
  model text,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('claude_usage_events');
create index idx_claude_usage_events_user_created on public.claude_usage_events (user_id, created_at);
