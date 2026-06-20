-- Phase 1: equipment, coffees (parent product), and coffee↔process / coffee↔varietal joins.

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text,
  category_id uuid references public.equipment_categories (id) on delete set null,
  is_workflow_relevant boolean not null default false,
  manufacturer text,
  type text,
  brew_method_family text check (brew_method_family in ('filter', 'espresso', 'hybrid')),
  price numeric,
  acquired_on date,
  image_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('equipment');
create index idx_equipment_category_id on public.equipment (category_id);

create table public.coffees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text,
  roaster_id uuid references public.roasters (id) on delete set null,
  country_id uuid references public.countries (id) on delete set null,
  region_id uuid references public.regions (id) on delete set null,
  producer_id uuid references public.producers (id) on delete set null,
  roast_level_id uuid references public.roast_levels (id) on delete set null,
  roaster_notes text,
  recommended_rest text,
  website_url text,
  image_path text,
  notes text,
  rating_override numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('coffees');
create index idx_coffees_roaster_id on public.coffees (roaster_id);
create index idx_coffees_country_id on public.coffees (country_id);
create index idx_coffees_region_id on public.coffees (region_id);
create index idx_coffees_producer_id on public.coffees (producer_id);
create index idx_coffees_roast_level_id on public.coffees (roast_level_id);

create table public.coffee_processes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  coffee_id uuid not null references public.coffees (id) on delete cascade,
  process_id uuid not null references public.processes (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (coffee_id, process_id)
);
select public._setup_user_table('coffee_processes');
create index idx_coffee_processes_coffee_id on public.coffee_processes (coffee_id);
create index idx_coffee_processes_process_id on public.coffee_processes (process_id);

create table public.coffee_varietals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  coffee_id uuid not null references public.coffees (id) on delete cascade,
  varietal_id uuid not null references public.varietals (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (coffee_id, varietal_id)
);
select public._setup_user_table('coffee_varietals');
create index idx_coffee_varietals_coffee_id on public.coffee_varietals (coffee_id);
create index idx_coffee_varietals_varietal_id on public.coffee_varietals (varietal_id);
