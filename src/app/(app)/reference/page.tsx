import { ReferenceManager } from "./reference-manager";

export const dynamic = "force-dynamic";

export default function ReferencePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reference data</h1>
        <p className="text-sm text-muted-foreground">
          Rename to fix spelling everywhere it&apos;s used. Deleting is blocked while an item
          is in use.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <ReferenceManager table="roasters" label="Roasters" />
        <ReferenceManager table="countries" label="Countries" />
        <ReferenceManager table="regions" label="Regions" />
        <ReferenceManager table="producers" label="Producers" />
        <ReferenceManager table="processes" label="Processes" />
        <ReferenceManager table="varietals" label="Varietals" />
        <ReferenceManager table="units" label="Units (ingredients)" />
      </div>
    </div>
  );
}
