"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { BrewMethod, Recipe, WaterAnchor } from "@/lib/db-types";
import { GRINDER_CATEGORIES, BREWER_CATEGORIES } from "@/lib/equipment";
import {
  Field,
  TextField,
  NumberField,
  TextareaField,
  SwitchField,
  ViewRow,
} from "@/components/fields";
import { ReferenceSelect } from "@/components/reference-select";
import { CoffeeSelect } from "@/components/coffee-select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteRecipe } from "../actions";
import { StepsEditor } from "@/components/steps-editor";
import { IngredientsEditor } from "@/components/ingredients-editor";

const NONE = "__none__";
type EquipOpt = { id: string; name: string | null; category: string | null };
type Names = {
  coffee: string | null;
  roaster: string | null;
  country: string | null;
  process: string | null;
};

export function RecipeDetail({
  recipe,
  names: initialNames,
  brewMethods,
  equipment,
  isNew,
}: {
  recipe: Recipe;
  names: Names;
  brewMethods: BrewMethod[];
  equipment: EquipOpt[];
  isNew: boolean;
}) {
  const router = useRouter();
  const brewed = recipe.recipe_type === "brewed_coffee";
  const [mode, setMode] = useState<"view" | "edit">(isNew ? "edit" : "view");
  const [row, setRow] = useState<Recipe>(recipe);
  const [names, setNames] = useState<Names>(initialNames);
  const [draft, setDraft] = useState<Recipe>(recipe);
  const [draftNames, setDraftNames] = useState<Names>(initialNames);
  const [busy, setBusy] = useState(false);

  const grinders = equipment.filter((e) => e.category && GRINDER_CATEGORIES.includes(e.category));
  const brewers = equipment.filter((e) => e.category && BREWER_CATEGORIES.includes(e.category));
  const methodName = (id: string | null) => brewMethods.find((m) => m.id === id)?.name ?? null;
  const equipName = (id: string | null) => equipment.find((e) => e.id === id)?.name ?? null;
  const familyOf = (id: string | null) => brewMethods.find((m) => m.id === id)?.behavior_family;
  const set = (patch: Partial<Recipe>) => setDraft((d) => ({ ...d, ...patch }));

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
      is_standard: draft.is_standard,
      is_favorite: draft.is_favorite,
      coffee_id: draft.coffee_id,
      brew_method_id: draft.brew_method_id,
      brewer_device_id: draft.brewer_device_id,
      grinder_id: draft.grinder_id,
      grind_setting: draft.grind_setting,
      dose_grams: draft.dose_grams,
      water_grams: draft.water_grams,
      water_anchor: draft.water_anchor,
      water_temp_celsius: draft.water_temp_celsius,
      bloom_grams: draft.bloom_grams,
      bloom_seconds: draft.bloom_seconds,
      is_iced: draft.is_iced,
      ice_grams: draft.ice_grams,
      country_id: draft.country_id,
      process_id: draft.process_id,
      roaster_id: draft.roaster_id,
      notes: draft.notes,
    };
    const { error } = await supabase.from("recipes").update(patch).eq("id", row.id);
    setBusy(false);
    if (error) return toast.error(`Save failed: ${error.message}`);
    setRow({ ...row, ...patch });
    setNames(draftNames);
    setMode("view");
    router.refresh();
  }

  async function cancel() {
    if (isNew) {
      await deleteRecipe(row.id);
      return;
    }
    setDraft(row);
    setDraftNames(names);
    setMode("view");
  }

  function pickMethod(v: string) {
    const id = v === NONE ? null : v;
    const patch: Partial<Recipe> = { brew_method_id: id };
    if (id && !draft.water_anchor) {
      const def = brewMethods.find((m) => m.id === id)?.default_water_anchor ?? null;
      if (def) patch.water_anchor = def;
    }
    set(patch);
  }

  const bloomLabel = (() => {
    const f = familyOf(draft.brew_method_id);
    return f === "espresso" ? "Preinfusion" : f === "filter" ? "Bloom" : "Bloom / Preinfusion";
  })();
  const favoriteVisible = draft.is_standard || draft.coffee_id != null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link href="/recipes" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Recipes
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{brewed ? "Brewed coffee" : "Specialty drink"}</Badge>
          {mode === "view" ? (
            <>
              <Button size="sm" variant="outline" onClick={startEdit}>
                <Pencil className="size-4" />
                Edit
              </Button>
              <form action={deleteRecipe.bind(null, row.id)}>
                <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={cancel} disabled={busy}>
                Cancel
              </Button>
              <Button size="sm" onClick={save} disabled={busy}>
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {mode === "view" ? (
        /* ---------- VIEW ---------- */
        <div className="flex flex-col gap-4">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            {row.is_favorite && <Star className="size-5 fill-amber-400 text-amber-400" />}
            {row.name || "Untitled recipe"}
          </h1>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <ViewRow
              label="Scope"
              value={row.is_standard ? "Standard (generalist)" : names.coffee ? `For ${names.coffee}` : "Unfiled"}
            />
            {brewed && <ViewRow label="Method" value={methodName(row.brew_method_id)} />}
            {brewed && <ViewRow label="Brewer" value={equipName(row.brewer_device_id)} />}
            {brewed && <ViewRow label="Grinder" value={equipName(row.grinder_id)} />}
            {brewed && <ViewRow label="Grind" value={row.grind_setting} />}
            {brewed && <ViewRow label="Dose (g)" value={row.dose_grams ?? undefined} />}
            {brewed && <ViewRow label="Water (g)" value={row.water_grams ?? undefined} />}
            {brewed && <ViewRow label="Measured by" value={row.water_anchor} />}
            {brewed && <ViewRow label="Temperature (°C)" value={row.water_temp_celsius ?? undefined} />}
            {brewed && <ViewRow label="Bloom/Preinfusion (g)" value={row.bloom_grams ?? undefined} />}
            {brewed && <ViewRow label="Bloom/Preinfusion (s)" value={row.bloom_seconds ?? undefined} />}
            {brewed && row.is_iced && <ViewRow label="Ice (g)" value={row.ice_grams ?? "iced"} />}
            {brewed && row.is_standard && <ViewRow label="For roaster" value={names.roaster} />}
            {brewed && row.is_standard && <ViewRow label="For country" value={names.country} />}
            {brewed && row.is_standard && <ViewRow label="For process" value={names.process} />}
          </div>
          {!brewed && (
            <IngredientsEditor parentField="recipe_id" parentId={row.id} readOnly />
          )}
          <StepsEditor parentField="recipe_id" parentId={row.id} mode={row.recipe_type} readOnly />
          <ViewRow label="Notes" value={row.notes} />
        </div>
      ) : (
        /* ---------- EDIT ---------- */
        <div className="flex flex-col gap-8">
          <TextField
            label="Name"
            defaultValue={draft.name}
            placeholder={brewed ? "e.g. Base: Hario V60" : "e.g. Iced cortado"}
            onCommit={(v) => set({ name: v })}
          />

          {/* Classification (flag matrix, conditional) */}
          <section className="flex flex-col gap-4 rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Classification
            </h2>
            <SwitchField
              label="Standard (generalist) recipe"
              defaultChecked={draft.is_standard}
              onCommit={(v) =>
                set(v ? { is_standard: true, coffee_id: null } : { is_standard: false })
              }
            />
            {brewed && !draft.is_standard && (
              <Field label="Coffee" hint="Makes this a coffee-specific recipe">
                <CoffeeSelect
                  value={draft.coffee_id}
                  valueName={draftNames.coffee}
                  onChange={(id, name) => {
                    set(id ? { coffee_id: id } : { coffee_id: null, is_favorite: false });
                    setDraftNames((n) => ({ ...n, coffee: name }));
                  }}
                />
              </Field>
            )}
            {favoriteVisible && (
              <SwitchField
                label={draft.is_standard ? "Favorite" : "Favorite for this coffee"}
                defaultChecked={draft.is_favorite}
                onCommit={(v) => set({ is_favorite: v })}
              />
            )}
          </section>

          {/* Brew params — brewed only */}
          {brewed && (
            <section className="grid gap-5 sm:grid-cols-2">
              <Field label="Method">
                <Select defaultValue={draft.brew_method_id ?? NONE} onValueChange={pickMethod}>
                  <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>— None —</SelectItem>
                    {brewMethods.map((m) => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Measured by">
                <Select
                  value={draft.water_anchor ?? NONE}
                  onValueChange={(v) => set({ water_anchor: v === NONE ? null : (v as WaterAnchor) })}
                >
                  <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>— None —</SelectItem>
                    <SelectItem value="input">input (brew water)</SelectItem>
                    <SelectItem value="output">output (in cup)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <EquipSelect label="Brewer / brew device" options={brewers} value={draft.brewer_device_id} onPick={(id) => set({ brewer_device_id: id })} />
              <EquipSelect label="Grinder" options={grinders} value={draft.grinder_id} onPick={(id) => set({ grinder_id: id })} />

              <TextField label="Grind setting" defaultValue={draft.grind_setting} onCommit={(v) => set({ grind_setting: v })} />
              <NumberField label="Dose (g)" defaultValue={draft.dose_grams} onCommit={(v) => set({ dose_grams: v })} />
              <NumberField label="Water (g)" defaultValue={draft.water_grams} onCommit={(v) => set({ water_grams: v })} />
              <NumberField label="Temperature (°C)" defaultValue={draft.water_temp_celsius} onCommit={(v) => set({ water_temp_celsius: v })} />
              <NumberField label={`${bloomLabel} (g)`} defaultValue={draft.bloom_grams} onCommit={(v) => set({ bloom_grams: v })} />
              <NumberField label={`${bloomLabel} (s)`} defaultValue={draft.bloom_seconds} onCommit={(v) => set({ bloom_seconds: v })} />

              <div className="sm:col-span-2">
                <SwitchField label="Iced" defaultChecked={draft.is_iced} onCommit={(v) => set({ is_iced: v })} />
              </div>
              {draft.is_iced && (
                <NumberField label="Ice (g)" defaultValue={draft.ice_grams} onCommit={(v) => set({ ice_grams: v })} />
              )}
            </section>
          )}

          {/* Generalist associations — brewed standards only */}
          {brewed && draft.is_standard && (
            <section className="grid gap-5 sm:grid-cols-3">
              <Field label="For roaster">
                <ReferenceSelect table="roasters" value={draft.roaster_id} valueName={draftNames.roaster}
                  onChange={(id, name) => { set({ roaster_id: id }); setDraftNames((n) => ({ ...n, roaster: name })); }} />
              </Field>
              <Field label="For country">
                <ReferenceSelect table="countries" value={draft.country_id} valueName={draftNames.country}
                  onChange={(id, name) => { set({ country_id: id }); setDraftNames((n) => ({ ...n, country: name })); }} />
              </Field>
              <Field label="For process">
                <ReferenceSelect table="processes" value={draft.process_id} valueName={draftNames.process}
                  onChange={(id, name) => { set({ process_id: id }); setDraftNames((n) => ({ ...n, process: name })); }} />
              </Field>
            </section>
          )}

          {!brewed && (
            <IngredientsEditor parentField="recipe_id" parentId={row.id} />
          )}
          <StepsEditor parentField="recipe_id" parentId={row.id} mode={row.recipe_type} />

          <TextareaField label="Notes" defaultValue={draft.notes} onCommit={(v) => set({ notes: v })} />
        </div>
      )}
    </div>
  );
}

function EquipSelect({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: EquipOpt[];
  value: string | null;
  onPick: (id: string | null) => void;
}) {
  return (
    <Field label={label}>
      <Select value={value ?? NONE} onValueChange={(v) => onPick(v === NONE ? null : v)}>
        <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>— None —</SelectItem>
          {options.length === 0 && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              No matching equipment (mark items “Used in brewing”).
            </div>
          )}
          {options.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name || "Untitled"}</SelectItem>))}
        </SelectContent>
      </Select>
    </Field>
  );
}
