import { createClient } from "@/lib/supabase/server";
import type { Feedback } from "@/lib/db-types";
import { FeedbackList } from "./feedback-list";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Feedback[];

  return (
    <div className="flex max-w-[var(--detail-measure)] flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl">Feedback</h1>
        <p className="text-sm text-muted-foreground">
          Bugs and requests filed from the widget, with the page each came from.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing filed yet. Use the Feedback button in the bottom-right corner.
        </p>
      ) : (
        <FeedbackList
          open={rows.filter((f) => f.status === "new")}
          completed={rows.filter((f) => f.status === "complete")}
        />
      )}
    </div>
  );
}
