import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Coffee, SeedRow } from "@/lib/db-types";
import { CoffeeEditor } from "./coffee-editor";
import { BagsSection } from "./bags-section";

export const dynamic = "force-dynamic";

type Named = { name: string } | null;
type CoffeeWithNames = Coffee & {
  roasters: Named;
  countries: Named;
  regions: Named;
  producers: Named;
  roast_levels: Named;
};

export default async function CoffeeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("coffees")
    .select(
      "*, roasters(name), countries(name), regions(name), producers(name), roast_levels(name)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const coffee = data as unknown as CoffeeWithNames;

  const { data: roastLevels } = await supabase
    .from("roast_levels")
    .select("id, name, sort_order")
    .order("sort_order");

  let imageUrl: string | null = null;
  if (coffee.image_path) {
    const { data: signed } = await supabase.storage
      .from("images")
      .createSignedUrl(coffee.image_path, 3600);
    imageUrl = signed?.signedUrl ?? null;
  }

  return (
    <div className="flex flex-col gap-8">
      <CoffeeEditor
        coffee={coffee}
        names={{
          roaster: coffee.roasters?.name ?? null,
          country: coffee.countries?.name ?? null,
          region: coffee.regions?.name ?? null,
          producer: coffee.producers?.name ?? null,
        }}
        roastLevels={(roastLevels ?? []) as SeedRow[]}
        userId={user.id}
        imageUrl={imageUrl}
      />
      <BagsSection coffeeId={coffee.id} />
    </div>
  );
}
