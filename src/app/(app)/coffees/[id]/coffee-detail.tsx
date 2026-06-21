"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Coffee, SeedRow } from "@/lib/db-types";
import {
  Field,
  TextField,
  NumberField,
  TextareaField,
  ViewRow,
} from "@/components/fields";
import { ReferenceSelect } from "@/components/reference-select";
import { MultiReferenceSelect } from "@/components/multi-reference-select";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteCoffee } from "../actions";
import { BagsSection } from "./bags-section";

const NONE = "__none__";
type Names = {
  roaster: string | null;
  country: string | null;
  region: string | null;
  producer: string | null;
};

export function CoffeeDetail({
  coffee,
  names: initialNames,
  roastLevels,
  userId,
  imageUrl,
  isNew,
}: {
  coffee: Coffee;
  names: Names;
  roastLevels: SeedRow[];
  userId: string;
  imageUrl: string | null;
  isNew: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit">(isNew ? "edit" : "view");
  const [row, setRow] = useState<Coffee>(coffee);
  const [names, setNames] = useState<Names>(initialNames);
  const [draft, setDraft] = useState<Coffee>(coffee);
  const [draftNames, setDraftNames] = useState<Names>(initialNames);
  const [busy, setBusy] = useState(false);

  const roastName = (id: string | null) =>
    roastLevels.find((r) => r.id === id)?.name ?? null;
  const set = (patch: Partial<Coffee>) => setDraft((d) => ({ ...d, ...patch }));

  function startEdit() {
    setDraft(row);
    setDraftNames(names);
    setMode("edit");
  }

  async function save() {
    setBusy(true);
    const supabase = createClient();
    const patch = {
      name: draft.name,
      roaster_id: draft.roaster_id,
      country_id: draft.country_id,
      region_id: draft.region_id,
      producer_id: draft.producer_id,
      roast_level_id: draft.roast_level_id,
      flavor_notes: draft.flavor_notes,
      recommended_rest: draft.recommended_rest,
      website_url: draft.website_url,
      notes: draft.notes,
      elevation: draft.elevation,
      salinity: draft.salinity,
      humidity: draft.humidity,
      rating_override: draft.rating_override,
      image_path: draft.image_path,
    };
    const { error } = await supabase.from("coffees").update(patch).eq("id", row.id);
    setBusy(false);
    if (error) return toast.error(`Save failed: ${error.message}`);
    setRow({ ...row, ...patch });
    setNames(draftNames);
    setMode("view");
    router.refresh();
  }

  async function cancel() {
    if (isNew) {
      await deleteCoffee(row.id); // deletes empty draft + redirects to /coffees
      return;
    }
    setDraft(row);
    setDraftNames(names);
    setMode("view");
  }

  const tier3 = [row.elevation, row.salinity, row.humidity].some(Boolean);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link
          href="/coffees"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Coffees
        </Link>
        {mode === "view" ? (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={startEdit}>
              <Pencil className="size-4" />
              Edit
            </Button>
            <form action={deleteCoffee.bind(null, row.id)}>
              <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="size-4" />
                Delete
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={cancel} disabled={busy}>
              Cancel
            </Button>
            <Button size="sm" onClick={save} disabled={busy}>
              Save
            </Button>
          </div>
        )}
      </div>

      {mode === "view" ? (
        /* ---------- VIEW ---------- */
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="size-24 shrink-0 rounded-lg border border-border object-cover"
              />
            )}
            <h1 className="text-2xl font-semibold tracking-tight">
              {row.name || "Untitled coffee"}
            </h1>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <ViewRow label="Roaster" value={names.roaster} />
            <ViewRow label="Country" value={names.country} />
            <ViewRow label="Region" value={names.region} />
            <ViewRow label="Producer" value={names.producer} />
            <ViewRow label="Roast level" value={roastName(row.roast_level_id)} />
            <ViewRow label="Recommended rest" value={row.recommended_rest} />
            <ViewRow
              label="Rating (manual)"
              value={row.rating_override ?? undefined}
            />
            <ViewRow
              label="Website"
              value={
                row.website_url ? (
                  <a href={row.website_url} className="underline" target="_blank" rel="noreferrer">
                    {row.website_url}
                  </a>
                ) : undefined
              }
            />
          </div>
          <ViewRow label="Flavor notes" value={row.flavor_notes} />
          <ViewRow label="Other notes / description" value={row.notes} />
          <div className="flex flex-col gap-1 py-1.5">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Processes
            </span>
            <MultiReferenceSelect
              table="processes"
              joinTable="coffee_processes"
              refColumn="process_id"
              coffeeId={row.id}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1 py-1.5">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Varietals
            </span>
            <MultiReferenceSelect
              table="varietals"
              joinTable="coffee_varietals"
              refColumn="varietal_id"
              coffeeId={row.id}
              readOnly
            />
          </div>
          {tier3 && (
            <details className="rounded-lg border border-border p-3">
              <summary className="cursor-pointer text-sm font-medium">More details</summary>
              <div className="grid gap-x-8 pt-2 sm:grid-cols-2">
                <ViewRow label="Elevation" value={row.elevation} />
                <ViewRow label="Salinity" value={row.salinity} />
                <ViewRow label="Humidity" value={row.humidity} />
              </div>
            </details>
          )}
        </div>
      ) : (
        /* ---------- EDIT ---------- */
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextField
              label="Name"
              defaultValue={draft.name}
              placeholder="e.g. Finca …"
              onCommit={(v) => set({ name: v })}
            />
          </div>

          <Field label="Roaster">
            <ReferenceSelect
              table="roasters"
              value={draft.roaster_id}
              valueName={draftNames.roaster}
              onChange={(id, name) => {
                set({ roaster_id: id });
                setDraftNames((n) => ({ ...n, roaster: name }));
              }}
            />
          </Field>
          <Field label="Producer">
            <ReferenceSelect
              table="producers"
              value={draft.producer_id}
              valueName={draftNames.producer}
              onChange={(id, name) => {
                set({ producer_id: id });
                setDraftNames((n) => ({ ...n, producer: name }));
              }}
            />
          </Field>
          <Field label="Country">
            <ReferenceSelect
              table="countries"
              value={draft.country_id}
              valueName={draftNames.country}
              onChange={(id, name) => {
                set({ country_id: id, region_id: draft.region_id });
                setDraftNames((n) => ({ ...n, country: name }));
                if (draft.region_id) {
                  set({ country_id: id, region_id: null });
                  setDraftNames((n) => ({ ...n, country: name, region: null }));
                }
              }}
            />
          </Field>
          <Field label="Region" hint={!draft.country_id ? "Pick a country first" : undefined}>
            <ReferenceSelect
              table="regions"
              value={draft.region_id}
              valueName={draftNames.region}
              countryId={draft.country_id}
              disabled={!draft.country_id}
              onChange={(id, name) => {
                set({ region_id: id });
                setDraftNames((n) => ({ ...n, region: name }));
              }}
            />
          </Field>

          <Field label="Roast level">
            <Select
              value={draft.roast_level_id ?? NONE}
              onValueChange={(v) => set({ roast_level_id: v === NONE ? null : v })}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— None —</SelectItem>
                {roastLevels.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <TextField
            label="Recommended rest"
            defaultValue={draft.recommended_rest}
            placeholder="e.g. 2–3 weeks from roast"
            onCommit={(v) => set({ recommended_rest: v })}
          />

          <Field label="Processes">
            <MultiReferenceSelect
              table="processes"
              joinTable="coffee_processes"
              refColumn="process_id"
              coffeeId={row.id}
              placeholder="Add process…"
            />
          </Field>
          <Field label="Varietals">
            <MultiReferenceSelect
              table="varietals"
              joinTable="coffee_varietals"
              refColumn="varietal_id"
              coffeeId={row.id}
              placeholder="Add varietal…"
            />
          </Field>

          <TextField
            label="Website"
            type="url"
            defaultValue={draft.website_url}
            placeholder="https://…"
            onCommit={(v) => set({ website_url: v })}
          />
          <NumberField
            label="Rating override (1–10)"
            defaultValue={draft.rating_override}
            hint="Optional; overrides computed aggregate"
            onCommit={(v) => set({ rating_override: v })}
          />

          <div className="sm:col-span-2">
            <TextareaField
              label="Flavor notes"
              defaultValue={draft.flavor_notes}
              onCommit={(v) => set({ flavor_notes: v })}
            />
          </div>
          <div className="sm:col-span-2">
            <TextareaField
              label="Other notes / description"
              defaultValue={draft.notes}
              onCommit={(v) => set({ notes: v })}
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUpload
              pathPrefix={`${userId}/coffees/${row.id}`}
              currentPath={row.image_path}
              currentUrl={imageUrl}
              onChange={(path) => set({ image_path: path })}
            />
          </div>

          <div className="sm:col-span-2">
            <details className="rounded-lg border border-border p-3" open={tier3}>
              <summary className="cursor-pointer text-sm font-medium">
                More details (rare)
              </summary>
              <div className="grid gap-5 pt-3 sm:grid-cols-2">
                <TextField
                  label="Elevation"
                  defaultValue={draft.elevation}
                  placeholder="e.g. 1900 masl"
                  onCommit={(v) => set({ elevation: v })}
                />
                <TextField
                  label="Salinity"
                  defaultValue={draft.salinity}
                  onCommit={(v) => set({ salinity: v })}
                />
                <TextField
                  label="Humidity"
                  defaultValue={draft.humidity}
                  onCommit={(v) => set({ humidity: v })}
                />
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Bags managed independently of the coffee form */}
      <BagsSection coffeeId={row.id} />
    </div>
  );
}
