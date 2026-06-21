"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Lock, Pencil, Play, Trash2 } from "lucide-react";
import type { BrewMethod, Session, TastingCategory, WaterAnchor } from "@/lib/db-types";
import { GRINDER_CATEGORIES, BREWER_CATEGORIES } from "@/lib/equipment";
import { useAutosave } from "@/lib/use-autosave";
import {
  Field,
  TextField,
  NumberField,
  SwitchField,
  TextareaField,
  ViewRow,
} from "@/components/fields";
import { StepsEditor } from "@/components/steps-editor";
import { IngredientsEditor } from "@/components/ingredients-editor";
import { TastingEditor } from "@/components/tasting-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteSession, completeSession } from "../actions";

const NONE = "__none__";
type EquipOpt = { id: string; name: string | null; category: string | null };

export function SessionDetail({
  session,
  coffeeName,
  roastDate,
  brewMethods,
  equipment,
  categories,
  isNew,
}: {
  session: Session;
  coffeeName: string | null;
  roastDate: string | null;
  brewMethods: BrewMethod[];
  equipment: EquipOpt[];
  categories: TastingCategory[];
  isNew: boolean;
}) {
  const save = useAutosave("sessions", session.id);
  const brewed = session.recipe_type === "brewed_coffee";
  const frozen = session.status === "complete";

  const [editing, setEditing] = useState(isNew && !frozen);
  const [methodId, setMethodId] = useState(session.brew_method_id);
  const [anchor, setAnchor] = useState<WaterAnchor | null>(session.water_anchor);
  const [iced, setIced] = useState(session.is_iced);
  const [confirming, setConfirming] = useState(false);

  const grinders = equipment.filter((e) => e.category && GRINDER_CATEGORIES.includes(e.category));
  const brewers = equipment.filter((e) => e.category && BREWER_CATEGORIES.includes(e.category));
  const methodName = (id: string | null) => brewMethods.find((m) => m.id === id)?.name ?? null;
  const equipName = (id: string | null) => equipment.find((e) => e.id === id)?.name ?? null;
  const family = brewMethods.find((m) => m.id === methodId)?.behavior_family;
  const bloomLabel = family === "espresso" ? "Preinfusion" : family === "filter" ? "Bloom" : "Bloom / Preinfusion";

  function pickMethod(v: string) {
    const id = v === NONE ? null : v;
    setMethodId(id);
    const patch: Record<string, unknown> = { brew_method_id: id };
    if (id && !anchor) {
      const def = brewMethods.find((m) => m.id === id)?.default_water_anchor ?? null;
      if (def) { setAnchor(def); patch.water_anchor = def; }
    }
    save(patch);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link href="/sessions" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Sessions
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{brewed ? "Brewed coffee" : "Specialty drink"}</Badge>
          <Badge variant={frozen ? "secondary" : "default"}>{session.status}</Badge>
          {!frozen && (
            <form action={deleteSession.bind(null, session.id)}>
              <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="size-4" />
                Discard
              </Button>
            </form>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {brewed ? coffeeName || "Coffee" : "Specialty drink"}
        </h1>
        {brewed && roastDate && <p className="text-sm text-muted-foreground">roasted {roastDate}</p>}
        {frozen && (
          <p className="mt-2 flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            <Lock className="size-4" />
            Completed{session.brewed_at ? ` ${new Date(session.brewed_at).toLocaleString()}` : ""} — frozen and read-only.
            {session.days_rested_snapshot != null && ` Rested ${session.days_rested_snapshot}d at brew.`}
          </p>
        )}
      </div>

      {/* ---- Recipe instance ---- */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recipe</h2>
          {!frozen &&
            (editing ? (
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                Done editing
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="size-4" />
                Edit
              </Button>
            ))}
        </div>

        {editing && !frozen ? (
          <div className="flex flex-col gap-5">
            {brewed ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Method">
                  <Select defaultValue={methodId ?? NONE} onValueChange={pickMethod}>
                    <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>— None —</SelectItem>
                      {brewMethods.map((m) => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Measured by">
                  <Select value={anchor ?? NONE} onValueChange={(v) => { const a = v === NONE ? null : (v as WaterAnchor); setAnchor(a); save({ water_anchor: a }); }}>
                    <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>— None —</SelectItem>
                      <SelectItem value="input">input (brew water)</SelectItem>
                      <SelectItem value="output">output (in cup)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <EquipSelect label="Brewer / brew device" options={brewers} defaultValue={session.brewer_device_id} onPick={(id) => save({ brewer_device_id: id })} />
                <EquipSelect label="Grinder" options={grinders} defaultValue={session.grinder_id} onPick={(id) => save({ grinder_id: id })} />
                <TextField label="Grind setting" defaultValue={session.grind_setting} onCommit={(v) => save({ grind_setting: v })} />
                <NumberField label="Dose (g)" defaultValue={session.dose_grams} onCommit={(v) => save({ dose_grams: v })} />
                <NumberField label="Water (g)" defaultValue={session.water_grams} onCommit={(v) => save({ water_grams: v })} />
                <NumberField label="Temperature (°C)" defaultValue={session.water_temp_celsius} onCommit={(v) => save({ water_temp_celsius: v })} />
                <NumberField label={`${bloomLabel} (g)`} defaultValue={session.bloom_grams} onCommit={(v) => save({ bloom_grams: v })} />
                <NumberField label={`${bloomLabel} (s)`} defaultValue={session.bloom_seconds} onCommit={(v) => save({ bloom_seconds: v })} />
                <div className="sm:col-span-2">
                  <SwitchField label="Iced" defaultChecked={iced} onCommit={(v) => { setIced(v); save({ is_iced: v }); }} />
                </div>
                {iced && <NumberField label="Ice (g)" defaultValue={session.ice_grams} onCommit={(v) => save({ ice_grams: v })} />}
              </div>
            ) : (
              <IngredientsEditor parentField="session_id" parentId={session.id} />
            )}
            <StepsEditor parentField="session_id" parentId={session.id} mode={session.recipe_type} />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {brewed && (
              <div className="grid gap-x-8 sm:grid-cols-2">
                <ViewRow label="Method" value={methodName(session.brew_method_id)} />
                <ViewRow label="Brewer" value={equipName(session.brewer_device_id)} />
                <ViewRow label="Grinder" value={equipName(session.grinder_id)} />
                <ViewRow label="Grind" value={session.grind_setting} />
                <ViewRow label="Dose (g)" value={session.dose_grams ?? undefined} />
                <ViewRow label="Water (g)" value={session.water_grams ?? undefined} />
                <ViewRow label="Measured by" value={session.water_anchor} />
                <ViewRow label="Temperature (°C)" value={session.water_temp_celsius ?? undefined} />
                <ViewRow label="Bloom/Preinfusion (g)" value={session.bloom_grams ?? undefined} />
                <ViewRow label="Bloom/Preinfusion (s)" value={session.bloom_seconds ?? undefined} />
                {session.is_iced && <ViewRow label="Ice (g)" value={session.ice_grams ?? "iced"} />}
              </div>
            )}
            {!brewed && <IngredientsEditor parentField="session_id" parentId={session.id} readOnly />}
            <StepsEditor parentField="session_id" parentId={session.id} mode={session.recipe_type} readOnly />
          </div>
        )}

        {!frozen && !editing && (
          <div>
            <Button asChild size="lg">
              <Link href={`/brew/${session.id}`}>
                <Play className="size-4" />
                Confirm &amp; brew
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* ---- Feedback ---- */}
      <section className="flex flex-col gap-5 border-t border-border pt-6">
        <h2 className="text-lg font-semibold">Post-brew notes</h2>
        {frozen ? (
          <div className="grid gap-x-8 sm:grid-cols-2">
            <ViewRow label="Total brew time (s)" value={session.post_brew_total_time ?? undefined} />
            <ViewRow label="Post-brew notes" value={session.post_brew_notes} />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField label="Total brew time (s)" defaultValue={session.post_brew_total_time} onCommit={(v) => save({ post_brew_total_time: v })} />
            <div className="sm:col-span-2">
              <TextareaField label="Post-brew notes" defaultValue={session.post_brew_notes} onCommit={(v) => save({ post_brew_notes: v })} />
            </div>
          </div>
        )}

        <TastingEditor sessionId={session.id} categories={categories} readOnly={frozen} />

        {frozen ? (
          <ViewRow label="Next-time adjustments" value={session.next_time_notes} />
        ) : (
          <TextareaField label="Next-time adjustments" defaultValue={session.next_time_notes} onCommit={(v) => save({ next_time_notes: v })} />
        )}
      </section>

      {/* ---- Freeze ---- */}
      {!frozen && (
        <section className="border-t border-border pt-6">
          {confirming ? (
            <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
              <p className="text-sm">
                Mark complete? This <strong>freezes the session permanently</strong> — the
                recipe, steps, and tasting become read-only.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
                <form action={completeSession.bind(null, session.id)}>
                  <Button type="submit">
                    <Check className="size-4" />
                    Confirm freeze
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <Button size="lg" onClick={() => setConfirming(true)}>
              <Check className="size-4" />
              Mark complete &amp; freeze
            </Button>
          )}
        </section>
      )}
    </div>
  );
}

function EquipSelect({
  label,
  options,
  defaultValue,
  onPick,
}: {
  label: string;
  options: EquipOpt[];
  defaultValue: string | null;
  onPick: (id: string | null) => void;
}) {
  return (
    <Field label={label}>
      <Select defaultValue={defaultValue ?? NONE} onValueChange={(v) => onPick(v === NONE ? null : v)}>
        <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select…" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>— None —</SelectItem>
          {options.length === 0 && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">No matching equipment.</div>
          )}
          {options.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name || "Untitled"}</SelectItem>))}
        </SelectContent>
      </Select>
    </Field>
  );
}
