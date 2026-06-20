import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addItem, signOut } from "./actions";

export const dynamic = "force-dynamic";

type TestItem = { id: string; label: string; created_at: string };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: items } = await supabase
    .from("test_items")
    .select("id, label, created_at")
    .order("created_at", { ascending: false });

  const list = (items ?? []) as TestItem[];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-600">{user.email}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="h-10 rounded-full border border-black/15 px-4 text-sm font-medium transition-colors hover:bg-black/5"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          RLS test items (only yours)
        </h2>
        <form action={addItem} className="flex gap-2">
          <input
            name="label"
            type="text"
            placeholder="Add a test item…"
            required
            className="h-12 flex-1 rounded-lg border border-black/15 px-3 text-base outline-none focus:border-black/40"
          />
          <button
            type="submit"
            className="h-12 rounded-lg bg-foreground px-5 font-medium text-background transition-opacity hover:opacity-90"
          >
            Add
          </button>
        </form>

        {list.length === 0 ? (
          <p className="text-sm text-zinc-500">No items yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {list.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-black/10 px-4 py-3 text-sm"
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
