export const dynamic = "force-dynamic";

// Main pane placeholder — the coffee list lives in the persistent rail (layout.tsx).
export default function CoffeesIndexPage() {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border">
      <p className="text-sm text-muted-foreground">Select a coffee, or add a new one.</p>
    </div>
  );
}
