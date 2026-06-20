"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Live auto-save for a single row (browser client, RLS-scoped). Patches one or more columns.
export function useAutosave(table: string, id: string) {
  const save = useCallback(
    async (patch: Record<string, unknown>) => {
      const supabase = createClient();
      const { error } = await supabase.from(table).update(patch).eq("id", id);
      if (error) toast.error(`Save failed: ${error.message}`);
    },
    [table, id],
  );
  return save;
}
