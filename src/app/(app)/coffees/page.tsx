import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { createCoffee } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string | null;
  roasters: { name: string } | null;
  roast_levels: { name: string } | null;
};

export default async function CoffeesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coffees")
    .select("id, name, roasters(name), roast_levels(name)")
    .order("created_at", { ascending: false });
  const items = (data ?? []) as unknown as Row[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Coffees</h1>
        <form action={createCoffee}>
          <Button type="submit" size="sm">
            <Plus className="size-4" />
            New
          </Button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No coffees yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/coffees/${item.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 hover:bg-accent"
              >
                <span className="font-medium">{item.name || "Untitled coffee"}</span>
                <span className="text-sm text-muted-foreground">
                  {[item.roasters?.name, item.roast_levels?.name]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
