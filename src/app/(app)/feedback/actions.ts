"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackStatus } from "@/lib/db-types";

export async function setFeedbackStatus(id: string, status: FeedbackStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("feedback").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/feedback");
}

export async function deleteFeedback(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("feedback").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/feedback");
}
