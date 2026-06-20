"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { RecipeType } from "@/lib/db-types";

// recipe_type is write-once — it's set here at creation and never editable afterward.
export async function createRecipe(recipeType: RecipeType) {
  if (recipeType !== "brewed_coffee" && recipeType !== "specialty_drink") {
    throw new Error("Invalid recipe type");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("recipes")
    .insert({ recipe_type: recipeType })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "create failed");
  redirect(`/recipes/${data.id}`);
}

export async function deleteRecipe(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("recipes").delete().eq("id", id);
  revalidatePath("/recipes");
  redirect("/recipes");
}
