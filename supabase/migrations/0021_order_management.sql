-- Order management: home-café sessions, the persistent public menu, and visitor orders.
--
-- THE ANONYMOUS-ACCESS BOUNDARY. This is the first feature exposed to non-logged-in visitors.
-- anon gets ZERO direct table access here — no grants, no policies on any of the three tables.
-- All three public capabilities go through SECURITY DEFINER functions that return only what the
-- public page needs, so user_id / coffee_id / recipe_id never cross the boundary and the order's
-- session cannot be supplied by the client at all.

-- ---------------------------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------------------------

create table public.home_cafe_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text,
  is_active boolean not null default false,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- "Never more than one active" enforced structurally, not by application logic: a partial
-- unique index permits many false rows but only a single true one.
create unique index uniq_home_cafe_session_active
  on public.home_cafe_sessions (is_active) where is_active;

create trigger home_cafe_sessions_set_updated_at
  before update on public.home_cafe_sessions
  for each row execute function public.set_updated_at();

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('coffee', 'specialty')),
  -- A coffee item points at the COFFEE (its recipe resolves live to that coffee's favorite);
  -- a specialty item points at the specialty-drink RECIPE directly.
  coffee_id uuid references public.coffees (id) on delete restrict,
  recipe_id uuid references public.recipes (id) on delete restrict,
  public_name text not null check (length(btrim(public_name)) between 1 and 200),
  public_description text check (length(public_description) <= 2000),
  position integer,
  -- Presence on the menu IS availability; there is no separate sold-out state.
  is_on_menu boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Exactly one source, matching the type. Makes "never cross-type" a database guarantee, so a
  -- relink bug cannot produce a coffee item pointing at a recipe.
  constraint menu_items_source_matches_type check (
    (item_type = 'coffee'    and coffee_id is not null and recipe_id is null) or
    (item_type = 'specialty' and recipe_id is not null and coffee_id is null)
  )
);

create trigger menu_items_set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  -- No user_id, unlike every other table: orders are created by anonymous visitors. Ownership
  -- runs through home_cafe_session_id -> home_cafe_sessions.user_id. Intentional exception to
  -- the registry's "user_id everywhere" rule.
  home_cafe_session_id uuid not null references public.home_cafe_sessions (id) on delete restrict,
  menu_item_id uuid not null references public.menu_items (id) on delete restrict,
  visitor_name text check (length(visitor_name) <= 120),
  visitor_note text check (length(visitor_note) <= 2000),
  received_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_session_received on public.orders (home_cafe_session_id, received_at);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------------------------
-- Table-level access: admin only. No anon grants, no anon policies, anywhere below.
-- ---------------------------------------------------------------------------------------------

grant select, insert, update, delete on public.home_cafe_sessions to authenticated, service_role;
grant select, insert, update, delete on public.menu_items          to authenticated, service_role;
grant select, insert, update, delete on public.orders              to authenticated, service_role;

alter table public.home_cafe_sessions enable row level security;
alter table public.menu_items         enable row level security;
alter table public.orders             enable row level security;

create policy home_cafe_sessions_admin_all on public.home_cafe_sessions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy menu_items_admin_all on public.menu_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy orders_admin_all on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- Public capability 1: is ordering open? A bare boolean — no id, name, timestamps or user_id.
-- ---------------------------------------------------------------------------------------------

create function public.ordering_open()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $$
  select exists (select 1 from public.home_cafe_sessions where is_active);
$$;

revoke execute on function public.ordering_open() from public;
grant execute on function public.ordering_open() to anon, authenticated;

-- ---------------------------------------------------------------------------------------------
-- Public capability 2: the menu. Customer-facing columns only — no user_id, coffee_id or
-- recipe_id, so no inventory or recipe identifiers leak to visitors.
-- ---------------------------------------------------------------------------------------------

-- "position" must be quoted in a RETURNS TABLE list: unquoted it parses as the SQL
-- position(x in y) function. It is fine unquoted as a plain column (see recipe_steps.position).
create function public.public_menu()
  returns table (
    id uuid,
    item_type text,
    public_name text,
    public_description text,
    "position" integer
  )
  language sql
  stable
  security definer
  set search_path = public
as $$
  select m.id, m.item_type, m.public_name, m.public_description, m."position"
  from public.menu_items m
  where m.is_on_menu
  order by m."position" nulls last, m.created_at;
$$;

revoke execute on function public.public_menu() from public;
grant execute on function public.public_menu() to anon, authenticated;

-- ---------------------------------------------------------------------------------------------
-- Public capability 3: place an order. The session is resolved SERVER-SIDE — the visitor never
-- supplies it and cannot tamper with it. Rejects when ordering is closed or the item is not on
-- the menu. Returns void: the visitor never gets a row back.
-- ---------------------------------------------------------------------------------------------

create function public.place_order(
  p_menu_item_id uuid,
  p_visitor_name text default null,
  p_visitor_note text default null
)
  returns void
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  v_session_id uuid;
begin
  select id into v_session_id from public.home_cafe_sessions where is_active limit 1;
  if v_session_id is null then
    raise exception 'ordering is closed' using errcode = '22023';
  end if;

  if not exists (select 1 from public.menu_items where id = p_menu_item_id and is_on_menu) then
    raise exception 'item is not on the menu' using errcode = '22023';
  end if;

  insert into public.orders (home_cafe_session_id, menu_item_id, visitor_name, visitor_note)
  values (
    v_session_id,
    p_menu_item_id,
    nullif(btrim(p_visitor_name), ''),
    nullif(btrim(p_visitor_note), '')
  );
end;
$$;

revoke execute on function public.place_order(uuid, text, text) from public;
grant execute on function public.place_order(uuid, text, text) to anon, authenticated;
