-- Phase 2 bug-fix batch: column renames, Tier-3 coffee fields, and RESTRICT on FKs that
-- point at in-use reference entities (so a referenced roaster/country/etc. can't be deleted).

-- 1. Renames
alter table public.coffees rename column roaster_notes to flavor_notes;
alter table public.equipment rename column type to sub_category;

-- 2. Tier-3 coffee fields (rare; UI shows them collapsed but present/editable)
alter table public.coffees
  add column if not exists elevation text,
  add column if not exists salinity text,
  add column if not exists humidity text;

-- 3. Reference-entity FKs → ON DELETE RESTRICT (deletion blocked while in use).
--    Drop the existing FK (whatever its name) on each (table, column), then re-add as RESTRICT.
do $$
declare
  r record;
begin
  for r in
    select rel.relname as tbl, con.conname,
           (select attname from pg_attribute where attrelid = con.conrelid and attnum = con.conkey[1]) as col
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace n on n.oid = rel.relnamespace
    where con.contype = 'f' and n.nspname = 'public' and array_length(con.conkey, 1) = 1
  loop
    if (r.tbl, r.col) in (
      ('coffees', 'roaster_id'), ('coffees', 'country_id'), ('coffees', 'region_id'),
      ('coffees', 'producer_id'),
      ('recipes', 'roaster_id'), ('recipes', 'country_id'), ('recipes', 'process_id'),
      ('regions', 'country_id'),
      ('coffee_processes', 'process_id'), ('coffee_varietals', 'varietal_id')
    ) then
      execute format('alter table public.%I drop constraint %I', r.tbl, r.conname);
    end if;
  end loop;
end $$;

alter table public.coffees
  add constraint coffees_roaster_id_fkey foreign key (roaster_id) references public.roasters (id) on delete restrict,
  add constraint coffees_country_id_fkey foreign key (country_id) references public.countries (id) on delete restrict,
  add constraint coffees_region_id_fkey foreign key (region_id) references public.regions (id) on delete restrict,
  add constraint coffees_producer_id_fkey foreign key (producer_id) references public.producers (id) on delete restrict;

alter table public.recipes
  add constraint recipes_roaster_id_fkey foreign key (roaster_id) references public.roasters (id) on delete restrict,
  add constraint recipes_country_id_fkey foreign key (country_id) references public.countries (id) on delete restrict,
  add constraint recipes_process_id_fkey foreign key (process_id) references public.processes (id) on delete restrict;

alter table public.regions
  add constraint regions_country_id_fkey foreign key (country_id) references public.countries (id) on delete restrict;

alter table public.coffee_processes
  add constraint coffee_processes_process_id_fkey foreign key (process_id) references public.processes (id) on delete restrict;

alter table public.coffee_varietals
  add constraint coffee_varietals_varietal_id_fkey foreign key (varietal_id) references public.varietals (id) on delete restrict;
