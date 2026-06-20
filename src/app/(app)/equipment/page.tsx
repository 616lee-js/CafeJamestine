import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createEquipment } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string | null;
  is_workflow_relevant: boolean;
  equipment_categories: { name: string } | null;
};

export default async function EquipmentPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("equipment")
    .select("id, name, is_workflow_relevant, equipment_categories(name)")
    .order("created_at", { ascending: false });
  const items = (data ?? []) as unknown as Row[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Equipment</h1>
        <form action={createEquipment}>
          <Button type="submit" size="sm">
            <Plus className="size-4" />
            New
          </Button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No equipment yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/equipment/${item.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 hover:bg-accent"
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium">
                    {item.name || "Untitled"}
                  </span>
                  {item.equipment_categories && (
                    <span className="text-sm text-muted-foreground">
                      {item.equipment_categories.name}
                    </span>
                  )}
                </span>
                {item.is_workflow_relevant && (
                  <Badge variant="secondary">In brewing</Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
