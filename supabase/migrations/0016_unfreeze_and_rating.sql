-- Phase 2–5 fixes: Option B (completed sessions editable) + rename tasting overall.

-- Option B: drop the Phase-5 freeze guards so completed sessions + their children are
-- editable/cloneable/deletable again. (recipe_type immutability from 0012 stays.)
drop trigger if exists sessions_frozen_guard on public.sessions;
drop trigger if exists recipe_steps_frozen_guard on public.recipe_steps;
drop trigger if exists recipe_ingredients_frozen_guard on public.recipe_ingredients;
drop trigger if exists tastings_frozen_guard on public.tastings;
drop trigger if exists tasting_entries_frozen_guard on public.tasting_entries;
drop function if exists public.guard_frozen_session();
drop function if exists public.guard_frozen_child();
drop function if exists public.guard_frozen_tasting_entry();

-- Overall is now a standalone enjoyment rating set directly (not a computed override).
alter table public.tastings rename column overall_override to overall_rating;
