import { createClient } from "@/lib/supabase/server";
import type { BagStatus } from "@/lib/db-types";
import { SplitPane } from "@/components/split-pane";
import { CoffeeListRail } from "./coffee-list-rail";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string | null;
  roasters: { name: string | null } | null;
  coffee_bags: { status: BagStatus; roast_date: string | null }[] | null;
};

// List-left + read-right: the rail lives in the layout so it stays put (never unmounts) while the
// selected coffee changes in the main pane. Stacks to a single column on narrow screens.
export default async function CoffeesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coffees")
    .select("id, name, roasters(name), coffee_bags(status, roast_date)")
    .order("created_at", { ascending: false });
  const coffees = ((data ?? []) as unknown as Row[]).map((c) => ({
    id: c.id,
    name: c.name,
    roaster: c.roasters?.name ?? null,
    bags: c.coffee_bags ?? [],
  }));

  return (
    <SplitPane basePath="/coffees" rail={<CoffeeListRail coffees={coffees} />}>
      {children}
    </SplitPane>
  );
}
