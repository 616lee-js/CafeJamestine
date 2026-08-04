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
  sub_category: string | null;
  is_workflow_relevant: boolean;
  equipment_categories: { name: string } | null;
};

export default async function EquipmentPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("equipment")
    .select("id, name, sub_category, is_workflow_relevant, equipment_categories(name)")
    .order("created_at", { ascending: false });
  const items = (data ?? []) as unknown as Row[];

  // Workflow-relevant kit first: it is what a session actually picks from.
  const groups = [
    { label: "In brewing", items: items.filter((i) => i.is_workflow_relevant) },
    { label: "Everything else", items: items.filter((i) => !i.is_workflow_relevant) },
  ];

  return (
    <div className="flex max-w-[var(--detail-measure)] flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl">Equipment</h1>
        <form action={createEquipment}>
          <Button type="submit" size="sm">
            <Plus />
            New
          </Button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No equipment yet.</p>
      ) : (
        groups.map((g) =>
          g.items.length === 0 ? null : (
            <section key={g.label} className="flex flex-col gap-2">
              <h2 className="eyebrow">{g.label}</h2>
              <ul className="flex flex-col gap-2">
                {g.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/equipment/${item.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-surface-selected"
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-medium text-heading">
                          {item.name || "Untitled"}
                        </span>
                        {(item.equipment_categories || item.sub_category) && (
                          <span className="text-sm text-muted-foreground">
                            {[item.equipment_categories?.name, item.sub_category]
                              .filter(Boolean)
                              .join(" · ")}
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
            </section>
          ),
        )
      )}
    </div>
  );
}
