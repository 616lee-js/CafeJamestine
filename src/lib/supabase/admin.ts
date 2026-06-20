import { createClient } from "@supabase/supabase-js";

// Service-role client — SERVER ONLY. Bypasses RLS. Never import into Client Components.
// Used only for the invite-code redemption path (reads/writes invite_codes).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
