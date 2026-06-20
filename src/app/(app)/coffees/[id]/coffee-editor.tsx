"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { Coffee, SeedRow } from "@/lib/db-types";
import { useAutosave } from "@/lib/use-autosave";
import {
  Field,
  TextField,
  NumberField,
  TextareaField,
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

const NONE = "__none__";

export function CoffeeEditor({
  coffee,
  names,
  roastLevels,
  userId,
  imageUrl,
}: {
  coffee: Coffee;
  names: {
    roaster: string | null;
    country: string | null;
    region: string | null;
    producer: string | null;
  };
  roastLevels: SeedRow[];
  userId: string;
  imageUrl: string | null;
}) {
  const save = useAutosave("coffees", coffee.id);

  const [roaster, setRoaster] = useState({ id: coffee.roaster_id, name: names.roaster });
  const [country, setCountry] = useState({ id: coffee.country_id, name: names.country });
  const [region, setRegion] = useState({ id: coffee.region_id, name: names.region });
  const [producer, setProducer] = useState({ id: coffee.producer_id, name: names.producer });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link
          href="/coffees"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Coffees
        </Link>
        <form action={deleteCoffee.bind(null, coffee.id)}>
          <Button type="submit" variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="size-4" />
            Delete
          </Button>
        </form>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField
            label="Name"
            defaultValue={coffee.name}
            placeholder="e.g. Finca …"
            onCommit={(v) => save({ name: v })}
          />
        </div>

        <Field label="Roaster">
          <ReferenceSelect
            table="roasters"
            value={roaster.id}
            valueName={roaster.name}
            onChange={(id, name) => {
              setRoaster({ id, name });
              save({ roaster_id: id });
            }}
          />
        </Field>

        <Field label="Producer">
          <ReferenceSelect
            table="producers"
            value={producer.id}
            valueName={producer.name}
            onChange={(id, name) => {
              setProducer({ id, name });
              save({ producer_id: id });
            }}
          />
        </Field>

        <Field label="Country">
          <ReferenceSelect
            table="countries"
            value={country.id}
            valueName={country.name}
            onChange={(id, name) => {
              setCountry({ id, name });
              save({ country_id: id });
              // region is nested under country — clear it when country changes
              if (region.id) {
                setRegion({ id: null, name: null });
                save({ region_id: null });
              }
            }}
          />
        </Field>

        <Field label="Region" hint={!country.id ? "Pick a country first" : undefined}>
          <ReferenceSelect
            table="regions"
            value={region.id}
            valueName={region.name}
            countryId={country.id}
            disabled={!country.id}
            onChange={(id, name) => {
              setRegion({ id, name });
              save({ region_id: id });
            }}
          />
        </Field>

        <Field label="Roast level">
          <Select
            defaultValue={coffee.roast_level_id ?? NONE}
            onValueChange={(v) => save({ roast_level_id: v === NONE ? null : v })}
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
          defaultValue={coffee.recommended_rest}
          placeholder="e.g. 2–3 weeks from roast"
          onCommit={(v) => save({ recommended_rest: v })}
        />

        <Field label="Processes">
          <MultiReferenceSelect
            table="processes"
            joinTable="coffee_processes"
            refColumn="process_id"
            coffeeId={coffee.id}
            placeholder="Add process…"
          />
        </Field>

        <Field label="Varietals">
          <MultiReferenceSelect
            table="varietals"
            joinTable="coffee_varietals"
            refColumn="varietal_id"
            coffeeId={coffee.id}
            placeholder="Add varietal…"
          />
        </Field>

        <TextField
          label="Website"
          defaultValue={coffee.website_url}
          type="url"
          placeholder="https://…"
          onCommit={(v) => save({ website_url: v })}
        />
        <NumberField
          label="Rating override (1–10)"
          defaultValue={coffee.rating_override}
          hint="Optional; overrides computed aggregate"
          onCommit={(v) => save({ rating_override: v })}
        />

        <div className="sm:col-span-2">
          <TextareaField
            label="Roaster's notes"
            defaultValue={coffee.roaster_notes}
            onCommit={(v) => save({ roaster_notes: v })}
          />
        </div>

        <div className="sm:col-span-2">
          <ImageUpload
            pathPrefix={`${userId}/coffees/${coffee.id}`}
            currentPath={coffee.image_path}
            currentUrl={imageUrl}
            onChange={(path) => save({ image_path: path })}
          />
        </div>

        <div className="sm:col-span-2">
          <TextareaField
            label="Notes"
            defaultValue={coffee.notes}
            onCommit={(v) => save({ notes: v })}
          />
        </div>
      </div>
    </div>
  );
}
