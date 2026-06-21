"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Trash2 } from "lucide-react";
import type { BrewMethod, Session, WaterAnchor } from "@/lib/db-types";
import { GRINDER_CATEGORIES, BREWER_CATEGORIES } from "@/lib/equipment";
import { useAutosave } from "@/lib/use-autosave";
import { Field, TextField, NumberField, SwitchField } from "@/components/fields";
import { StepsEditor } from "@/components/steps-editor";
import { IngredientsEditor } from "@/components/ingredients-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteSession } from "../actions";

const NONE = "__none__";
type EquipOpt = { id: string; name: string | null; category: string | null };

export function SessionDetail({
  session,
  coffeeName,
  roastDate,
  brewMethods,
  equipment,
}: {
  session: Session;
  coffeeName: string | null;
  roastDate: string | null;
  brewMethods: BrewMethod[];
  equipment: EquipOpt[];
}) {
  const save = useAutosave("sessions", session.id);
  const brewed = session.recipe_type === "brewed_coffee";
  const [methodId, setMethodId] = useState(session.brew_method_id);
  const [anchor, setAnchor] = useState<WaterAnchor | null>(session.water_anchor);
  const [iced, setIced] = useState(session.is_iced);

  const grinders = equipment.filter((e) => e.category && GRINDER_CATEGORIES.includes(e.category));
  const brewers = equipment.filter((e) => e.category && BREWER_CATEGORIES.includes(e.category));
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
          <Badge variant={session.status === "active" ? "default" : "secondary"}>{session.status}</Badge>
          <form action={deleteSession.bind(null, session.id)}>
            <Button type="submit" variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="size-4" />
              Discard
            </Button>
          </form>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {brewed ? coffeeName || "Coffee" : "Specialty drink"}
        </h1>
        {brewed && roastDate && (
          <p className="text-sm text-muted-foreground">roasted {roastDate}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          Review and adjust, then confirm to brew. Edits save as you go.
        </p>
      </div>

      {brewed && (
        <section className="grid gap-5 sm:grid-cols-2">
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
        </section>
      )}

      {!brewed && (
        <IngredientsEditor parentField="session_id" parentId={session.id} />
      )}
      <StepsEditor parentField="session_id" parentId={session.id} mode={session.recipe_type} />

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button asChild size="lg">
          <Link href={`/brew/${session.id}`}>
            <Play className="size-4" />
            Confirm &amp; brew
          </Link>
        </Button>
      </div>

      <section className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        Feedback &amp; tasting — coming in Phase 5. Completing a brew will land here; the session
        stays editable until you finish feedback.
      </section>
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
