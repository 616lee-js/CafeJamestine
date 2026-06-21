-- Phase 4 fixes: specialty drinks get a separate ingredients list with a managed units
-- reference. units is a user-owned reference entity (like roasters/processes); seeded with
-- starters for existing users (new users add inline / from References).

create table public.units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);
select public._setup_user_table('units');

-- Ingredient lines for specialty-drink recipes/sessions (name + numeric quantity + unit).
create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  recipe_id uuid references public.recipes (id) on delete cascade,
  session_id uuid references public.sessions (id) on delete cascade,
  name text,
  quantity numeric,
  unit_id uuid references public.units (id) on delete restrict,
  position integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recipe_ingredients_exactly_one_parent check (num_nonnulls(recipe_id, session_id) = 1)
);
select public._setup_user_table('recipe_ingredients');
create index idx_recipe_ingredients_recipe_id on public.recipe_ingredients (recipe_id);
create index idx_recipe_ingredients_session_id on public.recipe_ingredients (session_id);
create index idx_recipe_ingredients_unit_id on public.recipe_ingredients (unit_id);

-- Seed starter units for existing users (per-user; unique(user_id,name) guards re-runs).
insert into public.units (user_id, name)
select u.id, v.name
from auth.users u
cross join (values ('g'), ('mL'), ('count'), ('whole'), ('dash'), ('tsp'), ('tbsp')) v(name)
on conflict (user_id, name) do nothing;
