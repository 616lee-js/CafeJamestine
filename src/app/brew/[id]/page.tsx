import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/db-types";
import { StepsEditor } from "@/components/steps-editor";
import { IngredientsEditor } from "@/components/ingredients-editor";
import { CompleteButton } from "./complete-button";

export const dynamic = "force-dynamic";

type Joined = Session & {
  coffee_bags: { coffees: { name: string | null } | null } | null;
  recipes: { name: string | null } | null;
};

// Full-screen, static brew reference. No timer; the user's own equipment owns timing.
export default async function BrewPage({
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
    .from("sessions")
    .select("*, coffee_bags(coffees(name)), recipes(name)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const session = data as unknown as Joined;

  const coffeeName = session.coffee_bags?.coffees?.name ?? null;
  const title =
    coffeeName ??
    session.recipes?.name ??
    (session.recipe_type === "specialty_drink" ? "Specialty drink" : "Session");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <Link href={`/sessions/${id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Edit
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {session.recipes?.name && coffeeName && (
          <p className="mt-1 text-muted-foreground">{session.recipes.name}</p>
        )}
        <div className="mt-8 flex flex-col gap-8">
          {session.recipe_type === "specialty_drink" && (
            <IngredientsEditor parentField="session_id" parentId={id} readOnly showMultiplier />
          )}
          <StepsEditor parentField="session_id" parentId={id} mode={session.recipe_type} readOnly />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto w-full max-w-2xl">
          <CompleteButton sessionId={id} />
        </div>
      </footer>
    </div>
  );
}
