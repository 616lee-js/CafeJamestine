"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Coffee, SeedRow } from "@/lib/db-types";
import {
  Field,
  TextField,
  RatingField,
  TextareaField,
  ViewRow,
} from "@/components/fields";
import { ReferenceSelect } from "@/components/reference-select";
import { MultiReferenceSelect } from "@/components/multi-reference-select";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionStatusBadge } from "@/components/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteCoffee } from "../actions";
import { ActionButton } from "@/components/action-button";
import { BagsSection } from "./bags-section";

const NONE = "__none__";
type Names = {
  roaster: string | null;
  country: string | null;
  region: string | null;
  producer: string | null;
};

type UsedSession = { id: string; label: string; date: string | null; status: "active" | "complete" };

export function CoffeeDetail({
  coffee,
  names: initialNames,
  roastLevels,
  userId,
  imageUrl,
  isNew,
  rating,
  ratingCount,
  sessions,
}: {
  coffee: Coffee;
  names: Names;
  roastLevels: SeedRow[];
  userId: string;
  imageUrl: string | null;
  isNew: boolean;
  rating: number | null;
  ratingCount: number;
  sessions: UsedSession[];
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
  const subline = [names.roaster, names.country].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-8">
      {/* The rail is the navigation on wide screens; this back link is the mobile way out. */}
      <Link
        href="/coffees"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-heading min-[60rem]:hidden"
      >
        <ArrowLeft className="size-4" />
        Coffees
      </Link>

      {mode === "view" ? (
        /* ---------- VIEW ---------- */
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt=""
                  className="size-24 shrink-0 rounded-xl border border-border object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="flex size-24 shrink-0 items-center justify-center rounded-xl border border-border bg-muted"
                >
                  <ImagePlus className="size-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex min-w-0 flex-col gap-1">
                <h1 className="text-3xl">{row.name || "Untitled coffee"}</h1>
                {subline && <p className="text-base text-muted-foreground">{subline}</p>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="outline" onClick={startEdit}>
                <Pencil />
                Edit
              </Button>
              <ActionButton
                variant="ghost"
                size="sm"
                className="text-destructive"
                confirm={{ title: `Delete coffee “${row.name || "Untitled coffee"}”?`, confirmLabel: "Delete" }}
                onAction={() => deleteCoffee(row.id)}
              >
                <Trash2 />
                Delete
              </ActionButton>
            </div>
          </div>

          {/* Read grid — empty fields render nothing at all, no dashes or N/A. */}
          <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 min-[60rem]:grid-cols-3">
            <ViewRow label="Roaster" value={names.roaster} />
            <ViewRow label="Country" value={names.country} />
            <ViewRow label="Region" value={names.region} />
            <ViewRow label="Producer" value={names.producer} />
            <ViewRow label="Roast level" value={roastName(row.roast_level_id)} />
            <ViewRow label="Recommended rest" value={row.recommended_rest} />
            <ViewRow
              label="Rating"
              value={
                rating == null
                  ? undefined
                  : row.rating_override != null
                    ? `${rating} (manual)`
                    : `${rating} · ${ratingCount} session${ratingCount === 1 ? "" : "s"}`
              }
            />
            <ViewRow label="Elevation" value={row.elevation} />
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
            <div className="flex flex-col gap-1 py-1.5">
              <span className="eyebrow">Processes</span>
              <MultiReferenceSelect
                table="processes"
                joinTable="coffee_processes"
                refColumn="process_id"
                coffeeId={row.id}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1 py-1.5">
              <span className="eyebrow">Varietals</span>
              <MultiReferenceSelect
                table="varietals"
                joinTable="coffee_varietals"
                refColumn="varietal_id"
                coffeeId={row.id}
                readOnly
              />
            </div>
          </div>

          <ViewRow label="Flavor notes" value={row.flavor_notes} />
          <ViewRow label="Other notes / description" value={row.notes} />

          {(row.salinity || row.humidity) && (
            <details className="rounded-lg border border-border bg-card p-3">
              <summary className="cursor-pointer text-sm font-medium">More details</summary>
              <div className="grid gap-x-8 pt-2 sm:grid-cols-3">
                <ViewRow label="Salinity" value={row.salinity} />
                <ViewRow label="Humidity" value={row.humidity} />
              </div>
            </details>
          )}
        </div>
      ) : (
        /* ---------- EDIT ----------
           Lavender panel: you can tell you are editing without reading a label. */
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Badge tone="bag-resting">Editing</Badge>
              <span className="text-sm text-muted-foreground">
                Changes save when you press Save.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={cancel} disabled={busy}>
                Cancel
              </Button>
              <Button size="sm" onClick={save} disabled={busy}>
                Save
              </Button>
            </div>
          </div>

          <div className="grid gap-5 rounded-2xl border border-edit-border bg-edit-surface p-6 sm:grid-cols-2">
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
                <SelectTrigger size="touch" className="w-full">
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
            <RatingField
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

            {/* The rarely-needed many, tucked away rather than removed. */}
            <div className="sm:col-span-2">
              <details className="rounded-lg border border-edit-border bg-card p-3" open={tier3}>
                <summary className="cursor-pointer text-sm font-medium">
                  More details (rare)
                </summary>
                <div className="grid gap-5 pt-3 sm:grid-cols-3">
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
        </div>
      )}

      {/* Bags managed independently of the coffee form */}
      <BagsSection coffeeId={row.id} />

      {/* Sessions that used this coffee — the coffee → session direction (navigation only). */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold tracking-snug text-heading">
          Sessions brewed with this coffee
        </h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/sessions/${s.id}?from=/coffees/${row.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-surface-selected"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-heading">{s.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {s.date ? new Date(s.date).toLocaleDateString() : ""}
                    </span>
                  </span>
                  <SessionStatusBadge status={s.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
