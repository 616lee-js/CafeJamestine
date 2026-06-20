"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCoffee() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("coffees")
    .insert({})
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "create failed");
  redirect(`/coffees/${data.id}`);
}

export async function deleteCoffee(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Guaranteed deletion: remove storage objects under <uid>/coffees/<id>/ first.
  const prefix = `${user.id}/coffees/${id}`;
  const { data: files } = await supabase.storage.from("images").list(prefix);
  if (files && files.length) {
    await supabase.storage
      .from("images")
      .remove(files.map((f) => `${prefix}/${f.name}`));
  }
  await supabase.from("coffees").delete().eq("id", id);
  revalidatePath("/coffees");
  redirect("/coffees");
}
