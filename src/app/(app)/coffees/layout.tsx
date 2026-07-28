import { createClient } from "@/lib/supabase/server";
import type { BagStatus } from "@/lib/db-types";
import { CoffeeListRail } from "./coffee-list-rail";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string | null;
  coffee_bags: { status: BagStatus; roast_date: string | null }[] | null;
};

// List-left + read-right: the rail lives in the layout so it stays put (never unmounts) while the
// selected coffee changes in the main pane. Stacks to a single column on narrow screens.
export default async function CoffeesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coffees")
    .select("id, name, coffee_bags(status, roast_date)")
    .order("created_at", { ascending: false });
  const coffees = ((data ?? []) as unknown as Row[]).map((c) => ({
    id: c.id,
    name: c.name,
    bags: c.coffee_bags ?? [],
  }));

  return (
    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      <CoffeeListRail coffees={coffees} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
