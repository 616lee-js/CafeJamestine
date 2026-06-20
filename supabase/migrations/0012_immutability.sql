-- Phase 3: enforce the write-once immutables at the DB level (defense-in-depth; the UI
-- also never offers to change them). Covers recipe_type (recipes + sessions) and
-- behavior_family (brew_methods).

create or replace function public.prevent_column_change()
returns trigger
language plpgsql
as $$
declare
  col text := tg_argv[0];
begin
  if (to_jsonb(new) ->> col) is distinct from (to_jsonb(old) ->> col) then
    raise exception '% is immutable and cannot be changed', col;
  end if;
  return new;
end;
$$;

drop trigger if exists recipes_recipe_type_immutable on public.recipes;
create trigger recipes_recipe_type_immutable
  before update on public.recipes
  for each row execute function public.prevent_column_change('recipe_type');

drop trigger if exists sessions_recipe_type_immutable on public.sessions;
create trigger sessions_recipe_type_immutable
  before update on public.sessions
  for each row execute function public.prevent_column_change('recipe_type');

drop trigger if exists brew_methods_behavior_family_immutable on public.brew_methods;
create trigger brew_methods_behavior_family_immutable
  before update on public.brew_methods
  for each row execute function public.prevent_column_change('behavior_family');
