import { ReferenceManager } from "./reference-manager";

export const dynamic = "force-dynamic";

export default function ReferencePage() {
  return (
    <div className="flex max-w-[var(--detail-measure)] flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl">Reference</h1>
        <p className="text-sm text-muted-foreground">
          Your own lists. Anything you add here becomes selectable everywhere else.
          Renaming fixes spelling wherever it&apos;s used; deleting is blocked while an item
          is in use.
        </p>
      </div>
      <ReferenceManager />
    </div>
  );
}
