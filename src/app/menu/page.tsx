import { createClient } from "@/lib/supabase/server";
import type { PublicMenuItem } from "@/lib/db-types";
import { Logo } from "@/components/logo";
import { MenuBoard } from "./menu-board";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menu · Café Jamestine",
  description: "Today's menu.",
};

// PUBLIC — no auth, outside the (app) group so it gets no app chrome.
//
// Everything here comes from two SECURITY DEFINER functions. The anon role has no grant and no
// policy on menu_items / home_cafe_sessions / orders, so this page physically cannot read a
// coffee, a recipe, an order, or anything admin-only.
export default async function PublicMenuPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: open }] = await Promise.all([
    supabase.rpc("public_menu"),
    supabase.rpc("ordering_open"),
  ]);

  const menu = (items ?? []) as PublicMenuItem[];
  const orderingOpen = open === true;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 pt-12 pb-20">
      <header className="flex flex-col items-center gap-3 text-center">
        <Logo size={56} />
        <h1 className="text-4xl leading-[1.05] tracking-tight">Café Jamestine</h1>
        <p className="text-base text-muted-foreground">
          {orderingOpen
            ? "Pick something and we'll get it going."
            : "Not currently taking orders."}
        </p>
      </header>

      {menu.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--slate-300)] bg-surface-sunken p-8 text-center text-sm text-muted-foreground">
          Nothing on the menu just yet.
        </p>
      ) : (
        <MenuBoard items={menu} orderingOpen={orderingOpen} />
      )}
    </main>
  );
}
