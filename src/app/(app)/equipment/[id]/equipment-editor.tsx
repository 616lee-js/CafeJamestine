"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Equipment, SeedRow } from "@/lib/db-types";
import { subCategoryMeta } from "@/lib/equipment";
import { formatMoney } from "@/lib/format";
import {
  Field,
  TextField,
  MoneyField,
  TextareaField,
  DateField,
  SwitchField,
  ViewRow,
} from "@/components/fields";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteEquipment } from "../actions";
import { ActionButton } from "@/components/action-button";

const NONE = "__none__";
const FAMILIES = ["filter", "espresso", "hybrid"];

export function EquipmentEditor({
  equipment,
  categories,
  userId,
  imageUrl,
  isNew,
}: {
  equipment: Equipment;
  categories: SeedRow[];
  userId: string;
  imageUrl: string | null;
  isNew: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit">(isNew ? "edit" : "view");
  const [row, setRow] = useState<Equipment>(equipment);
  const [draft, setDraft] = useState<Equipment>(equipment);
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<Equipment>) => setDraft((d) => ({ ...d, ...patch }));

  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? null;
  const draftCatName = catName(draft.category_id);
  const subCat = subCategoryMeta(draftCatName);
  const isBrewer = draftCatName === "brewer";

  function startEdit() {
    setDraft(row);
    setMode("edit");
  }
  async function save() {
    setBusy(true);
    const supabase = createClient();
    const patch = {
      name: draft.name,
      category_id: draft.category_id,
      is_workflow_relevant: draft.is_workflow_relevant,
      manufacturer: draft.manufacturer,
      sub_category: draft.sub_category,
      brew_method_family: draft.brew_method_family,
      price: draft.price,
      acquired_on: draft.acquired_on,
      image_path: draft.image_path,
      notes: draft.notes,
    };
    const { error } = await supabase.from("equipment").update(patch).eq("id", row.id);
    setBusy(false);
    if (error) return toast.error(`Save failed: ${error.message}`);
    setRow({ ...row, ...patch });
    setMode("view");
    router.refresh();
  }
  async function cancel() {
    if (isNew) {
      await deleteEquipment(row.id);
      return;
    }
    setDraft(row);
    setMode("view");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/equipment" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Equipment
        </Link>
        {mode === "view" ? (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={startEdit}>
              <Pencil className="size-4" />
              Edit
            </Button>
            <ActionButton
              variant="ghost"
              size="sm"
              className="text-destructive"
              confirm={{ title: `Delete equipment “${row.name || "Untitled"}”?`, confirmLabel: "Delete" }}
              onAction={() => deleteEquipment(row.id)}
            >
              <Trash2 className="size-4" />
              Delete
            </ActionButton>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={cancel} disabled={busy}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={busy}>Save</Button>
          </div>
        )}
      </div>

      {mode === "view" ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="size-24 shrink-0 rounded-lg border border-border object-cover" />
            )}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{row.name || "Untitled"}</h1>
              {row.is_workflow_relevant && <Badge variant="secondary">In brewing</Badge>}
            </div>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <ViewRow label="Category" value={catName(row.category_id)} />
            <ViewRow label="Manufacturer" value={row.manufacturer} />
            <ViewRow label={subCategoryMeta(catName(row.category_id)).label} value={row.sub_category} />
            {catName(row.category_id) === "brewer" && (
              <ViewRow label="Method family" value={row.brew_method_family} />
            )}
            <ViewRow label="Price" value={row.price != null ? formatMoney(row.price) : undefined} />
            <ViewRow label="Acquired" value={row.acquired_on} />
          </div>
          <ViewRow label="Notes" value={row.notes} />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextField label="Name" defaultValue={draft.name} placeholder="e.g. Hario V60 Switch" onCommit={(v) => set({ name: v })} />
          </div>

          <Field label="Category">
            <Select
              value={draft.category_id ?? NONE}
              onValueChange={(v) => {
                const id = v === NONE ? null : v;
                set(id && catName(id) === "brewer" ? { category_id: id } : { category_id: id, brew_method_family: null });
              }}
            >
              <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>— None —</SelectItem>
                {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </Field>

          {isBrewer && (
            <Field label="Method family">
              <Select
                value={draft.brew_method_family ?? NONE}
                onValueChange={(v) => set({ brew_method_family: v === NONE ? null : (v as Equipment["brew_method_family"]) })}
              >
                <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>— None —</SelectItem>
                  {FAMILIES.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <TextField label="Manufacturer" defaultValue={draft.manufacturer} onCommit={(v) => set({ manufacturer: v })} />
          <TextField label={subCat.label} defaultValue={draft.sub_category} placeholder={subCat.eg} onCommit={(v) => set({ sub_category: v })} />
          <MoneyField label="Price" defaultValue={draft.price} onCommit={(v) => set({ price: v })} />
          <DateField label="Acquired" defaultValue={draft.acquired_on} onCommit={(v) => set({ acquired_on: v })} />

          <div className="sm:col-span-2">
            <SwitchField
              label="Used in brewing (appears in recipe/session selection)"
              defaultChecked={draft.is_workflow_relevant}
              onCommit={(v) => set({ is_workflow_relevant: v })}
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUpload
              pathPrefix={`${userId}/equipment/${row.id}`}
              currentPath={row.image_path}
              currentUrl={imageUrl}
              onChange={(path) => set({ image_path: path })}
            />
          </div>
          <div className="sm:col-span-2">
            <TextareaField label="Notes" defaultValue={draft.notes} onCommit={(v) => set({ notes: v })} />
          </div>
        </div>
      )}
    </div>
  );
}
