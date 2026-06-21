"use server";

import { createClient } from "@/lib/supabase/server";
import type { ReferenceTable } from "@/lib/db-types";

const TABLES: ReferenceTable[] = [
  "roasters", "countries", "regions", "producers", "processes", "varietals", "units",
];

type Result = { data?: { id: string; name: string }; error?: string };

// Create-or-select: insert a reference row; on unique-violation return the existing row.
export async function createReference(
  table: ReferenceTable,
  name: string,
  countryId?: string,
): Promise<Result> {
  if (!TABLES.includes(table)) return { error: "Invalid table" };
  const trimmed = name.trim();
  if (!trimmed) return { error: "Name required" };

  const supabase = await createClient();
  const payload: Record<string, unknown> = { name: trimmed };
  if (table === "regions") {
    if (!countryId) return { error: "Country required for region" };
    payload.country_id = countryId;
  }

  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select("id, name")
    .single();

  if (error) {
    if (error.code === "23505") {
      let q = supabase.from(table).select("id, name").eq("name", trimmed);
      if (table === "regions" && countryId) q = q.eq("country_id", countryId);
      const existing = await q.maybeSingle();
      if (existing.data) return { data: existing.data };
    }
    return { error: error.message };
  }
  return { data };
}
