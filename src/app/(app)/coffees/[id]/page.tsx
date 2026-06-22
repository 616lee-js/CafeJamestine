import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Coffee, SeedRow } from "@/lib/db-types";
import { coffeeRating } from "@/lib/compute";
import { CoffeeDetail } from "./coffee-detail";

export const dynamic = "force-dynamic";

type Named = { name: string } | null;
type CoffeeWithNames = Coffee & {
  roasters: Named;
  countries: Named;
  regions: Named;
  producers: Named;
};

export default async function CoffeePage({
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

  const { data } = await supabase
    .from("coffees")
    .select(
      "*, roasters(name), countries(name), regions(name), producers(name)",
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

  // Computed aggregate rating: avg of completed sessions' overalls (manual override wins).
  const { data: sessRows } = await supabase
    .from("sessions")
    .select("id, coffee_bags!inner(coffee_id), tastings(overall_rating)")
    .eq("status", "complete")
    .eq("coffee_bags.coffee_id", id);
  const overalls = ((sessRows ?? []) as unknown as Array<{
    tastings: { overall_rating: number | null }[] | null;
  }>).map((s) => s.tastings?.[0]?.overall_rating ?? null);
  const ratingCount = overalls.filter((o) => o != null).length;
  const rating = coffeeRating(overalls, coffee.rating_override);

  return (
    <CoffeeDetail
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
      isNew={isNewParam === "1"}
      rating={rating}
      ratingCount={ratingCount}
    />
  );
}
