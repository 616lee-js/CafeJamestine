-- Phase 1: recipes (durable catalog), sessions (instantiated trial; embeds its instance),
-- and recipe_steps (ordered steps owned by exactly one of a recipe or a session).

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text,
  recipe_type text not null check (recipe_type in ('brewed_coffee', 'specialty_drink')),  -- write-once (app)
  is_standard boolean not null default false,
  is_favorite boolean not null default false,
  coffee_id uuid references public.coffees (id) on delete set null,
  brew_method_id uuid references public.brew_methods (id) on delete set null,
  brewer_device_id uuid references public.equipment (id) on delete set null,
  grinder_id uuid references public.equipment (id) on delete set null,
  grind_setting text,
  dose_grams numeric,
  water_grams numeric,
  water_anchor text check (water_anchor in ('input', 'output')),
  water_temp_celsius numeric,
  bloom_grams numeric,
  bloom_seconds numeric,
  is_iced boolean not null default false,
  ice_grams numeric,
  country_id uuid references public.countries (id) on delete set null,
  process_id uuid references public.processes (id) on delete set null,
  roaster_id uuid references public.roasters (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('recipes');
create index idx_recipes_coffee_id on public.recipes (coffee_id);
create index idx_recipes_brew_method_id on public.recipes (brew_method_id);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- required for brewed_coffee, null for specialty_drink (enforced in app); RESTRICT protects history
  coffee_bag_id uuid references public.coffee_bags (id) on delete restrict,
  recipe_breadcrumb_id uuid references public.recipes (id) on delete set null,  -- template descended from
  recipe_type text not null check (recipe_type in ('brewed_coffee', 'specialty_drink')),  -- write-once (app)
  status text not null default 'active' check (status in ('active', 'complete')),
  brewed_at timestamptz,
  days_rested_snapshot integer,
  -- embedded recipe-instance columns (copied as-used, frozen on complete)
  brew_method_id uuid references public.brew_methods (id) on delete set null,
  brewer_device_id uuid references public.equipment (id) on delete set null,
  grinder_id uuid references public.equipment (id) on delete set null,
  grind_setting text,
  dose_grams numeric,
  water_grams numeric,
  water_anchor text check (water_anchor in ('input', 'output')),
  water_temp_celsius numeric,
  bloom_grams numeric,
  bloom_seconds numeric,
  is_iced boolean not null default false,
  ice_grams numeric,
  -- post-session feedback
  post_brew_total_time numeric,
  post_brew_notes text,
  next_time_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public._setup_user_table('sessions');
create index idx_sessions_coffee_bag_id on public.sessions (coffee_bag_id);
create index idx_sessions_recipe_breadcrumb_id on public.sessions (recipe_breadcrumb_id);

create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  recipe_id uuid references public.recipes (id) on delete cascade,
  session_id uuid references public.sessions (id) on delete cascade,
  position integer,
  timestamp_seconds numeric,
  target_weight_grams numeric,
  flow_rate_ml_s numeric,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recipe_steps_exactly_one_parent check (num_nonnulls(recipe_id, session_id) = 1)
);
select public._setup_user_table('recipe_steps');
create index idx_recipe_steps_recipe_id on public.recipe_steps (recipe_id);
create index idx_recipe_steps_session_id on public.recipe_steps (session_id);
