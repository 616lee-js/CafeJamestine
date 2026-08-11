"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import type { MenuItemType, OrderStatus } from "@/lib/db-types";

// Every action re-checks admin. RLS would refuse anyway (policies are written against
// public.is_admin()), but this turns a silent no-op into a clean redirect.

// ---- Menu ------------------------------------------------------------------------------------

export async function createMenuItem(
  itemType: MenuItemType,
  sourceId: string,
  publicName: string,
) {
  await requireAdmin();
  const supabase = await createClient();

  // Append to the end of the current ordering.
  const { data: last } = await supabase
    .from("menu_items")
    .select("position")
    .order("position", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? 0) + 1;

  const { error } = await supabase.from("menu_items").insert({
    item_type: itemType,
    coffee_id: itemType === "coffee" ? sourceId : null,
    recipe_id: itemType === "specialty" ? sourceId : null,
    public_name: publicName,
    position,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
}

export async function updateMenuItem(
  id: string,
  patch: {
    public_name?: string;
    public_description?: string | null;
    is_on_menu?: boolean;
    coffee_id?: string | null;
    recipe_id?: string | null;
  },
) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

export async function deleteMenuItem(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

/** Swaps `position` with the neighbour above/below — same approach as steps-editor. */
export async function moveMenuItem(id: string, direction: -1 | 1) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("menu_items")
    .select("id, position")
    .order("position", { ascending: true, nullsFirst: false });
  const list = rows ?? [];
  const i = list.findIndex((r) => r.id === id);
  const j = i + direction;
  if (i === -1 || j < 0 || j >= list.length) return;

  const a = list[i];
  const b = list[j];
  await supabase.from("menu_items").update({ position: b.position ?? j + 1 }).eq("id", a.id);
  await supabase.from("menu_items").update({ position: a.position ?? i + 1 }).eq("id", b.id);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

// ---- Home-café session -----------------------------------------------------------------------

export async function createHomeCafeSession(name: string | null) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_cafe_sessions")
    .insert({ name: name && name.trim() !== "" ? name.trim() : null });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

export async function setSessionActive(id: string, active: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  if (active) {
    // Deactivate first: a partial unique index allows only one is_active = true row, so
    // activating before clearing the incumbent would collide.
    const { error: clearErr } = await supabase
      .from("home_cafe_sessions")
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq("is_active", true);
    if (clearErr) throw new Error(clearErr.message);
  }

  const { error } = await supabase
    .from("home_cafe_sessions")
    .update(
      active
        ? { is_active: true, started_at: new Date().toISOString(), ended_at: null }
        : { is_active: false, ended_at: new Date().toISOString() },
    )
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath("/menu");
}

// ---- Orders ----------------------------------------------------------------------------------

export async function setOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

export async function deleteOrder(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}
