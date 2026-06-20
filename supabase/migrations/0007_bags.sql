-- Phase 1: coffee_bags (physical purchase, child of coffee) + status event log.

create table public.coffee_bags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  coffee_id uuid not null references public.coffees (id) on delete cascade,
  roast_date date,
  price numeric,
  status text not null default 'resting' check (status in ('frozen', 'resting', 'active', 'finished')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('coffee_bags');
create index idx_coffee_bags_coffee_id on public.coffee_bags (coffee_id);

create table public.coffee_bag_status_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  coffee_bag_id uuid not null references public.coffee_bags (id) on delete cascade,
  status text not null check (status in ('frozen', 'resting', 'active', 'finished')),
  changed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('coffee_bag_status_events');
create index idx_coffee_bag_status_events_coffee_bag_id on public.coffee_bag_status_events (coffee_bag_id);
