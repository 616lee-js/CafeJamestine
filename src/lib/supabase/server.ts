import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client — used in Server Components, Server Actions, Route Handlers.
// Reads/writes the session via cookies. Scoped to the authenticated user (RLS applies).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — ignore; middleware refreshes the session.
          }
        },
      },
    },
  );
}
