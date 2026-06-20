-- Phase 1: reference entities (user-owned) + global seed/lookup tables + seed data.

-- ---- Reference entities (user-owned; name is identity, create-or-select deduped) ----
create table public.roasters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);
select public._setup_user_table('roasters');

create table public.countries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);
select public._setup_user_table('countries');

-- regions nest under a country
create table public.regions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  country_id uuid not null references public.countries (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, country_id, name)
);
select public._setup_user_table('regions');
create index idx_regions_country_id on public.regions (country_id);

create table public.producers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);
select public._setup_user_table('producers');

create table public.processes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);
select public._setup_user_table('processes');

create table public.varietals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);
select public._setup_user_table('varietals');

-- ---- Global seed / lookup tables (no user_id) ----
create table public.brew_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  behavior_family text not null check (behavior_family in ('filter', 'espresso')),       -- write-once (app)
  default_water_anchor text not null check (default_water_anchor in ('input', 'output'))
);
select public._setup_seed_table('brew_methods');

create table public.tasting_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display text not null,
  guidance text not null,
  sort_order smallint
);
select public._setup_seed_table('tasting_categories');

create table public.roast_levels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order smallint
);
select public._setup_seed_table('roast_levels');

create table public.equipment_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order smallint
);
select public._setup_seed_table('equipment_categories');

-- ---- Seed data ----
insert into public.brew_methods (name, slug, behavior_family, default_water_anchor) values
  ('Pour Over', 'pour_over', 'filter', 'input'),
  ('Immersion', 'immersion', 'filter', 'input'),
  ('Hybrid',    'hybrid',    'filter', 'input'),
  ('Cupping',   'cupping',   'filter', 'input'),
  ('Espresso',  'espresso',  'espresso', 'output'),
  ('Ristretto', 'ristretto', 'espresso', 'output'),
  ('Allongé',   'allonge',   'espresso', 'output'),
  ('Turbo',     'turbo',     'espresso', 'output')
on conflict (slug) do nothing;

insert into public.tasting_categories (slug, display, guidance, sort_order) values
  ('aroma',      'Aroma',                'Smell as dry grounds and brewed; intensity, pleasantness, nameable notes, dry-vs-wet difference.', 1),
  ('flavor',     'Flavor',               'Combined taste-and-smell while sipping; specific notes, layers, evolution from first sip to swallow.', 2),
  ('acidity',    'Acidity',              'Bright/tangy/tart quality and kind (citric/malic/phosphoric/lactic); vibrant vs. harsh.', 3),
  ('sweetness',  'Sweetness',            'Perceived sweetness (not added); cane/caramel/honey/fruit; balance vs. acidity/bitterness.', 4),
  ('body',       'Body / Mouthfeel',     'Physical weight and texture; thin–syrupy; coating; drying/astringency.', 5),
  ('aftertaste', 'Aftertaste / Finish',  'What lingers; length; pleasant vs. bitter/astringent; flavors emerging in the finish.', 6),
  ('clarity',    'Clarity',              'Clean and distinct vs. muddled; ability to pick out each note.', 7),
  ('balance',    'Balance',              'Integration and proportion of elements vs. one dominating.', 8),
  ('complexity', 'Complexity',           'Number of distinct characteristics/layers; interesting vs. one-dimensional.', 9)
on conflict (slug) do nothing;

insert into public.roast_levels (name, sort_order) values
  ('light', 1), ('medium_light', 2), ('medium', 3), ('medium_dark', 4), ('dark', 5)
on conflict (name) do nothing;

insert into public.equipment_categories (name, sort_order) values
  ('brewer', 1), ('grinder', 2), ('filter', 3), ('basket', 4), ('tool', 5), ('machine', 6),
  ('scale', 7), ('kettle', 8), ('storage', 9), ('cleaning', 10), ('misc', 11)
on conflict (name) do nothing;
