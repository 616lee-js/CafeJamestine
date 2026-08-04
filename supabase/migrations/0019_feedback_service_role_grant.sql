-- 0018 granted anon/authenticated but omitted service_role, so admin + maintenance paths
-- (scripts, the service-role client) hit "permission denied for table feedback". Every other
-- user table gets service_role via public._setup_user_table; match that.
--
-- anon still gets INSERT only, deliberately: no SELECT grant means the table stays write-only
-- to the public. Consequence for callers — an anonymous insert must NOT use .select(), because
-- PostgREST needs SELECT to return the inserted row.

grant select, insert, update, delete on public.feedback to service_role;
