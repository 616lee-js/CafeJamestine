"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Coffee, GlassWater, Pencil, Plus, Trash2 } from "lucide-react";
import type { MenuItem, MenuItemType } from "@/lib/db-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActionButton } from "@/components/action-button";
import {
  createMenuItem,
  deleteMenuItem,
  moveMenuItem,
  updateMenuItem,
} from "../actions";

export type SourceOption = { id: string; label: string; meta: string | null };

// One persistent menu, edited over time. Follows the app's view/edit model: rows read flat on
// paper, editing is an explicit lavender panel.
export function MenuBuilder({
  items,
  coffees,
  specialties,
  sourceLabels,
}: {
  items: MenuItem[];
  coffees: SourceOption[];
  specialties: SourceOption[];
  sourceLabels: Record<string, string>;
}) {
  const [adding, setAdding] = useState<MenuItemType | null>(null);
  const [sourceId, setSourceId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const options = adding === "coffee" ? coffees : specialties;

  return (
    <div className="flex max-w-[var(--detail-measure)] flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl">Menu</h1>
          <p className="text-sm text-muted-foreground">
            What visitors see at <span className="font-mono">/menu</span>. Presence on the menu
            is availability — remove an item to take it off.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={adding === "coffee" ? "default" : "outline"}
            onClick={() => {
              setAdding(adding === "coffee" ? null : "coffee");
              setSourceId("");
            }}
          >
            <Coffee />
            Add coffee
          </Button>
          <Button
            size="sm"
            variant={adding === "specialty" ? "default" : "outline"}
            onClick={() => {
              setAdding(adding === "specialty" ? null : "specialty");
              setSourceId("");
            }}
          >
            <GlassWater />
            Add specialty
          </Button>
        </div>
      </div>

      {adding && (
        <AddPanel
          itemType={adding}
          options={options}
          sourceId={sourceId}
          setSourceId={setSourceId}
          onDone={() => {
            setAdding(null);
            setSourceId("");
          }}
        />
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--slate-300)] bg-surface-sunken p-8 text-center text-sm text-muted-foreground">
          Nothing on the menu yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, i) => (
            <li key={item.id}>
              {editingId === item.id ? (
                <EditPanel
                  item={item}
                  options={item.item_type === "coffee" ? coffees : specialties}
                  onDone={() => setEditingId(null)}
                />
              ) : (
                <ReadRow
                  item={item}
                  sourceLabel={sourceLabels[item.id]}
                  isFirst={i === 0}
                  isLast={i === items.length - 1}
                  onEdit={() => setEditingId(item.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AddPanel({
  itemType,
  options,
  sourceId,
  setSourceId,
  onDone,
}: {
  itemType: MenuItemType;
  options: SourceOption[];
  sourceId: string;
  setSourceId: (v: string) => void;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const picked = options.find((o) => o.id === sourceId);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-edit-border bg-edit-surface p-6">
      <div className="flex flex-col gap-1.5">
        <Label>{itemType === "coffee" ? "Coffee (active only)" : "Specialty drink recipe"}</Label>
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {itemType === "coffee"
              ? "No coffees have an active bag. Set a bag to active first."
              : "No specialty-drink recipes yet."}
          </p>
        ) : (
          <Select
            value={sourceId}
            onValueChange={(v) => {
              setSourceId(v);
              if (name.trim() === "") setName(options.find((o) => o.id === v)?.label ?? "");
            }}
          >
            <SelectTrigger size="touch" className="w-full">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                  {o.meta ? ` · ${o.meta}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {picked && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="add-public-name">Menu name</Label>
          <Input
            id="add-public-name"
            value={name}
            maxLength={200}
            onChange={(e) => setName(e.target.value)}
            placeholder="What visitors see"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onDone} disabled={busy}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={busy || !sourceId || name.trim() === ""}
          onClick={async () => {
            setBusy(true);
            await createMenuItem(itemType, sourceId, name.trim());
            setBusy(false);
            setName("");
            onDone();
          }}
        >
          <Plus />
          Add to menu
        </Button>
      </div>
    </div>
  );
}

function ReadRow({
  item,
  sourceLabel,
  isFirst,
  isLast,
  onEdit,
}: {
  item: MenuItem;
  sourceLabel: string;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-heading">{item.public_name}</span>
          <Badge variant="secondary">
            {item.item_type === "coffee" ? "Coffee" : "Specialty"}
          </Badge>
          {!item.is_on_menu && <Badge tone="bag-finished">Off menu</Badge>}
        </div>
        {item.public_description && (
          <p className="text-sm text-muted-foreground">{item.public_description}</p>
        )}
        <p className="text-xs text-muted-foreground">Links to {sourceLabel}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isFirst}
          aria-label="Move up"
          onClick={() => moveMenuItem(item.id, -1)}
        >
          <ArrowUp />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isLast}
          aria-label="Move down"
          onClick={() => moveMenuItem(item.id, 1)}
        >
          <ArrowDown />
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil />
          Edit
        </Button>
        <ActionButton
          variant="ghost"
          size="icon-sm"
          className="text-destructive"
          confirm={{
            title: `Remove “${item.public_name}” from the menu?`,
            description: "Visitors will no longer see it. This cannot be undone.",
            confirmLabel: "Remove",
          }}
          onAction={() => deleteMenuItem(item.id)}
        >
          <Trash2 />
        </ActionButton>
      </div>
    </div>
  );
}

function EditPanel({
  item,
  options,
  onDone,
}: {
  item: MenuItem;
  options: SourceOption[];
  onDone: () => void;
}) {
  const [name, setName] = useState(item.public_name);
  const [description, setDescription] = useState(item.public_description ?? "");
  const [onMenu, setOnMenu] = useState(item.is_on_menu);
  const [source, setSource] = useState(
    item.item_type === "coffee" ? (item.coffee_id ?? "") : (item.recipe_id ?? ""),
  );
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-edit-border bg-edit-surface p-6">
      <div className="flex items-center gap-3">
        <Badge tone="bag-resting">Editing</Badge>
        <span className="text-sm text-muted-foreground">
          Changes save when you press Save.
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`name-${item.id}`}>Menu name</Label>
        <Input
          id={`name-${item.id}`}
          value={name}
          maxLength={200}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`desc-${item.id}`}>Menu description</Label>
        <Textarea
          id={`desc-${item.id}`}
          value={description}
          maxLength={2000}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Customer-facing — separate from your inventory notes."
          className="min-h-20"
        />
      </div>

      {/* Relink is constrained to the same item_type; the DB CHECK enforces it too. */}
      <div className="flex flex-col gap-1.5">
        <Label>Linked {item.item_type === "coffee" ? "coffee" : "specialty recipe"}</Label>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger size="touch" className="w-full">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.label}
                {o.meta ? ` · ${o.meta}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-border bg-card px-3 py-2">
        <Label>On the menu</Label>
        <Button
          type="button"
          size="sm"
          variant={onMenu ? "default" : "outline"}
          aria-pressed={onMenu}
          onClick={() => setOnMenu((v) => !v)}
        >
          {onMenu ? "Showing" : "Hidden"}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onDone} disabled={busy}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={busy || name.trim() === ""}
          onClick={async () => {
            setBusy(true);
            await updateMenuItem(item.id, {
              public_name: name.trim(),
              public_description: description.trim() === "" ? null : description.trim(),
              is_on_menu: onMenu,
              ...(item.item_type === "coffee"
                ? { coffee_id: source, recipe_id: null }
                : { recipe_id: source, coffee_id: null }),
            });
            setBusy(false);
            onDone();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
