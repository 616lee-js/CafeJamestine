import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// The proxy/middleware only proves you are signed in. Admin capability is a second, separate
// check — every /admin page and every admin server action must call one of these.
//
// The source of truth is the DB: RLS on menu_items / home_cafe_sessions / orders is written
// against public.is_admin(), so even if a UI guard were missed the data layer still refuses.
// These helpers exist to give a clean redirect instead of an empty screen.

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}

/** Redirects to /login when signed out, or to / when signed in without admin. */
export async function requireAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) redirect("/");
}
