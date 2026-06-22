import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Equipment, SeedRow } from "@/lib/db-types";
import { EquipmentEditor } from "./equipment-editor";

export const dynamic = "force-dynamic";

export default async function EquipmentDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { id } = await params;
  const { new: isNewParam } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: equipment } = await supabase
    .from("equipment")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!equipment) notFound();

  const { data: categories } = await supabase
    .from("equipment_categories")
    .select("id, name, sort_order")
    .order("sort_order");

  let imageUrl: string | null = null;
  if (equipment.image_path) {
    const { data } = await supabase.storage
      .from("images")
      .createSignedUrl(equipment.image_path, 3600);
    imageUrl = data?.signedUrl ?? null;
  }

  return (
    <EquipmentEditor
      equipment={equipment as Equipment}
      categories={(categories ?? []) as SeedRow[]}
      userId={user.id}
      imageUrl={imageUrl}
      isNew={isNewParam === "1"}
    />
  );
}
