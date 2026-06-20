import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 "proxy" convention (formerly "middleware"): runs before matched routes.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all paths except Next internals, static assets, and the PWA/icon files.
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:png|svg|ico)$).*)",
  ],
};
