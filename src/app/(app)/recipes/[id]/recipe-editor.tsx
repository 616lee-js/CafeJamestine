"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import type {
  BrewMethod,
  EquipmentOption,
  Recipe,
  WaterAnchor,
} from "@/lib/db-types";
import { useAutosave } from "@/lib/use-autosave";
import {
  Field,
  TextField,
  NumberField,
  TextareaField,
  SwitchField,
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
import { RecipeStepsEditor } from "./recipe-steps-editor";

const NONE = "__none__";

export function RecipeEditor({
  recipe,
  names,
  brewMethods,
  equipment,
}: {
  recipe: Recipe;
  names: {
    coffee: string | null;
    roaster: string | null;
    country: string | null;
    process: string | null;
  };
  brewMethods: BrewMethod[];
  equipment: EquipmentOption[];
}) {
  const save = useAutosave("recipes", recipe.id);
  const brewed = recipe.recipe_type === "brewed_coffee";

  const [isStandard, setIsStandard] = useState(recipe.is_standard);
  const [coffee, setCoffee] = useState({ id: recipe.coffee_id, name: names.coffee });
  const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);

  const [methodId, setMethodId] = useState(recipe.brew_method_id);
  const [anchor, setAnchor] = useState<WaterAnchor | null>(recipe.water_anchor);
  const [iced, setIced] = useState(recipe.is_iced);

  const [roaster, setRoaster] = useState({ id: recipe.roaster_id, name: names.roaster });
  const [country, setCountry] = useState({ id: recipe.country_id, name: names.country });
  const [process, setProcess] = useState({ id: recipe.process_id, name: names.process });

  const family = brewMethods.find((m) => m.id === methodId)?.behavior_family;
  const bloomLabel =
    family === "espresso" ? "Preinfusion" : family === "filter" ? "Bloom" : "Bloom / Preinfusion";

  // Flag matrix transitions
  function toggleStandard(v: boolean) {
    setIsStandard(v);
    if (v) {
      // standard ⇒ no coffee
      setCoffee({ id: null, name: null });
      save({ is_standard: true, coffee_id: null });
    } else {
      save({ is_standard: false });
    }
  }
  function pickCoffee(id: string | null, name: string | null) {
    setCoffee({ id, name });
    if (id) {
      save({ coffee_id: id, is_standard: false });
      setIsStandard(false);
    } else {
      // not standard + no coffee ⇒ favorite not meaningful
      setIsFavorite(false);
      save({ coffee_id: null, is_favorite: false });
    }
  }
  function toggleFavorite(v: boolean) {
    setIsFavorite(v);
    save({ is_favorite: v });
  }

  function pickMethod(v: string) {
    const id = v === NONE ? null : v;
    setMethodId(id);
    const patch: Record<string, unknown> = { brew_method_id: id };
    // default the anchor by method family if not set yet
    if (id && !anchor) {
      const def = brewMethods.find((m) => m.id === id)?.default_water_anchor ?? null;
      if (def) {
        setAnchor(def);
        patch.water_anchor = def;
      }
    }
    save(patch);
  }

  const favoriteVisible = isStandard || coffee.id != null;
  const favoriteLabel = isStandard ? "Favorite" : "Favorite for this coffee";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link
          href="/recipes"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Recipes
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{brewed ? "Brewed coffee" : "Specialty drink"}</Badge>
          <form action={deleteRecipe.bind(null, recipe.id)}>
            <Button type="submit" variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="size-4" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      <TextField
        label="Name"
        defaultValue={recipe.name}
        placeholder={brewed ? "e.g. Base: Hario V60" : "e.g. Iced cortado"}
        onCommit={(v) => save({ name: v })}
      />

      {/* Classification (flag matrix) */}
      <section className="flex flex-col gap-4 rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Classification
        </h2>
        <SwitchField
          label="Standard (generalist) recipe"
          defaultChecked={isStandard}
          onCommit={toggleStandard}
        />
        {!isStandard && (
          <Field label="Coffee" hint="Makes this a coffee-specific recipe">
            <CoffeeSelect
              value={coffee.id}
              valueName={coffee.name}
              onChange={pickCoffee}
            />
          </Field>
        )}
        {favoriteVisible && (
          <SwitchField
            label={favoriteLabel}
            defaultChecked={isFavorite}
            onCommit={toggleFavorite}
          />
        )}
      </section>

      {/* Brew parameters — brewed_coffee only */}
      {brewed && (
        <section className="grid gap-5 sm:grid-cols-2">
          <Field label="Method">
            <Select defaultValue={methodId ?? NONE} onValueChange={pickMethod}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— None —</SelectItem>
                {brewMethods.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Measured by">
            <Select
              value={anchor ?? NONE}
              onValueChange={(v) => {
                const a = v === NONE ? null : (v as WaterAnchor);
                setAnchor(a);
                save({ water_anchor: a });
              }}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— None —</SelectItem>
                <SelectItem value="input">input (brew water)</SelectItem>
                <SelectItem value="output">output (in cup)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <EquipmentSelect
            label="Brewer / brew device"
            equipment={equipment}
            defaultValue={recipe.brewer_device_id}
            onPick={(id) => save({ brewer_device_id: id })}
          />
          <EquipmentSelect
            label="Grinder"
            equipment={equipment}
            defaultValue={recipe.grinder_id}
            onPick={(id) => save({ grinder_id: id })}
          />

          <TextField
            label="Grind setting"
            defaultValue={recipe.grind_setting}
            onCommit={(v) => save({ grind_setting: v })}
          />
          <NumberField
            label="Dose (g)"
            defaultValue={recipe.dose_grams}
            onCommit={(v) => save({ dose_grams: v })}
          />
          <NumberField
            label="Water (g)"
            defaultValue={recipe.water_grams}
            onCommit={(v) => save({ water_grams: v })}
          />
          <NumberField
            label="Temperature (°C)"
            defaultValue={recipe.water_temp_celsius}
            onCommit={(v) => save({ water_temp_celsius: v })}
          />
          <NumberField
            label={`${bloomLabel} (g)`}
            defaultValue={recipe.bloom_grams}
            onCommit={(v) => save({ bloom_grams: v })}
          />
          <NumberField
            label={`${bloomLabel} (s)`}
            defaultValue={recipe.bloom_seconds}
            onCommit={(v) => save({ bloom_seconds: v })}
          />

          <div className="sm:col-span-2">
            <SwitchField
              label="Iced"
              defaultChecked={iced}
              onCommit={(v) => {
                setIced(v);
                save({ is_iced: v });
              }}
            />
          </div>
          {iced && (
            <NumberField
              label="Ice (g)"
              defaultValue={recipe.ice_grams}
              onCommit={(v) => save({ ice_grams: v })}
            />
          )}
        </section>
      )}

      {/* Optional generalist associations */}
      <section className="grid gap-5 sm:grid-cols-3">
        <Field label="For roaster">
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
        <Field label="For country">
          <ReferenceSelect
            table="countries"
            value={country.id}
            valueName={country.name}
            onChange={(id, name) => {
              setCountry({ id, name });
              save({ country_id: id });
            }}
          />
        </Field>
        <Field label="For process">
          <ReferenceSelect
            table="processes"
            value={process.id}
            valueName={process.name}
            onChange={(id, name) => {
              setProcess({ id, name });
              save({ process_id: id });
            }}
          />
        </Field>
      </section>

      <RecipeStepsEditor recipeId={recipe.id} mode={recipe.recipe_type} />

      <TextareaField
        label="Notes"
        defaultValue={recipe.notes}
        onCommit={(v) => save({ notes: v })}
      />
    </div>
  );
}

function EquipmentSelect({
  label,
  equipment,
  defaultValue,
  onPick,
}: {
  label: string;
  equipment: EquipmentOption[];
  defaultValue: string | null;
  onPick: (id: string | null) => void;
}) {
  return (
    <Field label={label}>
      <Select
        defaultValue={defaultValue ?? NONE}
        onValueChange={(v) => onPick(v === NONE ? null : v)}
      >
        <SelectTrigger className="h-11 w-full">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>— None —</SelectItem>
          {equipment.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.name || "Untitled"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
