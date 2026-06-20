"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function addItem(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // user_id defaults to auth.uid(); RLS insert policy enforces auth.uid() = user_id.
  await supabase.from("test_items").insert({ label });
  revalidatePath("/dashboard");
}
