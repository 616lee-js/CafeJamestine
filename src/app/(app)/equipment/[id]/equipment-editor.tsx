"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { Equipment, SeedRow } from "@/lib/db-types";
import { useAutosave } from "@/lib/use-autosave";
import {
  Field,
  TextField,
  NumberField,
  TextareaField,
  DateField,
  SwitchField,
} from "@/components/fields";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteEquipment } from "../actions";

const NONE = "__none__";
const FAMILIES = ["filter", "espresso", "hybrid"];

export function EquipmentEditor({
  equipment,
  categories,
  userId,
  imageUrl,
}: {
  equipment: Equipment;
  categories: SeedRow[];
  userId: string;
  imageUrl: string | null;
}) {
  const save = useAutosave("equipment", equipment.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link
          href="/equipment"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Equipment
        </Link>
        <form action={deleteEquipment.bind(null, equipment.id)}>
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
            defaultValue={equipment.name}
            placeholder="e.g. Hario V60 Switch"
            onCommit={(v) => save({ name: v })}
          />
        </div>

        <Field label="Category">
          <Select
            defaultValue={equipment.category_id ?? NONE}
            onValueChange={(v) => save({ category_id: v === NONE ? null : v })}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>— None —</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Method family (brewers)">
          <Select
            defaultValue={equipment.brew_method_family ?? NONE}
            onValueChange={(v) =>
              save({ brew_method_family: v === NONE ? null : v })
            }
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>— None —</SelectItem>
              {FAMILIES.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <TextField
          label="Manufacturer"
          defaultValue={equipment.manufacturer}
          onCommit={(v) => save({ manufacturer: v })}
        />
        <TextField
          label="Type"
          defaultValue={equipment.type}
          placeholder="e.g. conical / flat"
          onCommit={(v) => save({ type: v })}
        />
        <NumberField
          label="Price"
          defaultValue={equipment.price}
          onCommit={(v) => save({ price: v })}
        />
        <DateField
          label="Acquired"
          defaultValue={equipment.acquired_on}
          onCommit={(v) => save({ acquired_on: v })}
        />

        <div className="sm:col-span-2">
          <SwitchField
            label="Used in brewing (appears in recipe/session selection)"
            defaultChecked={equipment.is_workflow_relevant}
            onCommit={(v) => save({ is_workflow_relevant: v })}
          />
        </div>

        <div className="sm:col-span-2">
          <ImageUpload
            pathPrefix={`${userId}/equipment/${equipment.id}`}
            currentPath={equipment.image_path}
            currentUrl={imageUrl}
            onChange={(path) => save({ image_path: path })}
          />
        </div>

        <div className="sm:col-span-2">
          <TextareaField
            label="Notes"
            defaultValue={equipment.notes}
            onCommit={(v) => save({ notes: v })}
          />
        </div>
      </div>
    </div>
  );
}
