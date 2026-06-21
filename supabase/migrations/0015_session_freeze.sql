-- Phase 5: the single freeze point. Once a session is complete it (and its embedded steps,
-- ingredients, and tasting) is immutable. Enforced at the DB as defense-in-depth; the UI also
-- shows completed sessions read-only.

-- Block any update to a session that is already complete (the active→complete update itself
-- passes because OLD.status is still 'active').
create or replace function public.guard_frozen_session()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'complete' then
    raise exception 'session is complete and frozen; it cannot be modified';
  end if;
  return new;
end;
$$;

drop trigger if exists sessions_frozen_guard on public.sessions;
create trigger sessions_frozen_guard
  before update on public.sessions
  for each row execute function public.guard_frozen_session();

-- Block writes to child rows (recipe_steps, recipe_ingredients, tastings) that belong to a
-- complete session. Rows owned by a recipe (session_id null) are unaffected — recipes stay
-- editable.
create or replace function public.guard_frozen_child()
returns trigger
language plpgsql
as $$
declare
  sid uuid;
begin
  sid := case when tg_op = 'DELETE' then old.session_id else new.session_id end;
  if sid is not null
     and exists (select 1 from public.sessions s where s.id = sid and s.status = 'complete') then
    raise exception '% on a frozen (complete) session is not allowed', tg_op;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists recipe_steps_frozen_guard on public.recipe_steps;
create trigger recipe_steps_frozen_guard
  before insert or update or delete on public.recipe_steps
  for each row execute function public.guard_frozen_child();

drop trigger if exists recipe_ingredients_frozen_guard on public.recipe_ingredients;
create trigger recipe_ingredients_frozen_guard
  before insert or update or delete on public.recipe_ingredients
  for each row execute function public.guard_frozen_child();

drop trigger if exists tastings_frozen_guard on public.tastings;
create trigger tastings_frozen_guard
  before insert or update or delete on public.tastings
  for each row execute function public.guard_frozen_child();

-- tasting_entries reach the session via their tasting.
create or replace function public.guard_frozen_tasting_entry()
returns trigger
language plpgsql
as $$
declare
  sid uuid;
begin
  select t.session_id into sid
  from public.tastings t
  where t.id = case when tg_op = 'DELETE' then old.tasting_id else new.tasting_id end;
  if sid is not null
     and exists (select 1 from public.sessions s where s.id = sid and s.status = 'complete') then
    raise exception '% on a frozen tasting is not allowed', tg_op;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists tasting_entries_frozen_guard on public.tasting_entries;
create trigger tasting_entries_frozen_guard
  before insert or update or delete on public.tasting_entries
  for each row execute function public.guard_frozen_tasting_entry();
