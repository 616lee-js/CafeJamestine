export const dynamic = "force-dynamic";

// Main pane placeholder — the coffee list lives in the persistent rail (layout.tsx).
export default function CoffeesIndexPage() {
  return (
    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-[var(--slate-300)] bg-surface-sunken">
      <p className="text-sm text-muted-foreground">Select a coffee, or add a new one.</p>
    </div>
  );
}
