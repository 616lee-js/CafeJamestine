import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Lockup } from "@/components/logo";
import { PrimaryNav, SecondaryNav } from "@/components/main-nav";
import { signOut } from "./actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* Global bar. Translucent + blurred so it stays visually distinct from any opaque
          in-section sub-bar that sticks beneath it (the session phase stepper). */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/88 backdrop-blur-[10px]">
        <div className="mx-auto flex h-[var(--topbar-height)] w-full max-w-[var(--shell-max)] items-center gap-6 px-[var(--shell-gutter)]">
          {/* Brand routes to the launchpad, never to a section. */}
          <Link href="/" className="shrink-0">
            <Lockup size={22} />
          </Link>
          <PrimaryNav />
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block">
              <SecondaryNav />
            </div>
            <span aria-hidden className="hidden h-5 w-px bg-border sm:block" />
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[var(--shell-max)] flex-1 px-[var(--shell-gutter)] pt-8 pb-16">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
