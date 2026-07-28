"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Copy, Pencil, Play, Trash2 } from "lucide-react";
import type {
  BrewMethod,
  CoffeeBagStatusEvent,
  Session,
  TastingCategory,
  WaterAnchor,
} from "@/lib/db-types";
import { GRINDER_CATEGORIES, BREWER_CATEGORIES } from "@/lib/equipment";
import { daysRested } from "@/lib/compute";
import { secondsToMMSS } from "@/lib/format";
import { useAutosave } from "@/lib/use-autosave";
import {
  Field,
  TextField,
  NumberField,
  MmssField,
  DateField,
  SwitchField,
  TextareaField,
  ViewRow,
} from "@/components/fields";
import { StepsEditor } from "@/components/steps-editor";
import { IngredientsEditor } from "@/components/ingredients-editor";
import { TastingEditor } from "@/components/tasting-editor";
import { ActionButton } from "@/components/action-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteSession, completeSession, cloneSession } from "../actions";

const NONE = "__none__";
type EquipOpt = { id: string; name: string | null; category: string | null };
// Rendered phases (Brew is a separate full-screen route, not a rendered phase).
type Phase = "confirm" | "postbrew" | "make" | "tasting";

export function SessionDetail({
  session,
  coffeeName,
  roastDate,
  bagEvents,
  brewMethods,
  equipment,
  categories,
  initialPhase,
  backHref,
}: {
  session: Session;
  coffeeName: string | null;
  roastDate: string | null;
  bagEvents: Pick<CoffeeBagStatusEvent, "status" | "changed_at">[];
  brewMethods: BrewMethod[];
  equipment: EquipOpt[];
  categories: TastingCategory[];
  initialPhase: Phase;
  backHref: string;
}) {
  const save = useAutosave("sessions", session.id);
  const brewed = session.recipe_type === "brewed_coffee";
  const complete = session.status === "complete";

  const phases: Phase[] = brewed ? ["confirm", "postbrew", "tasting"] : ["confirm", "make", "tasting"];
  const [phase, setPhase] = useState<Phase>(phases.includes(initialPhase) ? initialPhase : "confirm");

  const [reopened, setReopened] = useState(false);
  const canEdit = !complete || reopened; // Option B: completed sessions editable via reopen
  const [editingInstance, setEditingInstance] = useState(false);
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

  const restedNow = complete
    ? session.days_rested_snapshot
    : daysRested(roastDate, bagEvents);

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

  // Sub-bar: phase tabs (client-switched) with the Brew full-screen route linked inline for brewed.
  const tabLabel: Record<Phase, string> = {
    confirm: "Confirm",
    postbrew: "Post-brew",
    make: "Make",
    tasting: "Tasting",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href={backHref} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{brewed ? "Brewed coffee" : "Specialty drink"}</Badge>
          <Badge variant={complete ? "secondary" : "default"}>{session.status}</Badge>
          {complete &&
            (reopened ? (
              <Button size="sm" variant="ghost" onClick={() => { setReopened(false); setEditingInstance(false); }}>
                Done
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setReopened(true)}>
                <Pencil className="size-4" />
                Edit session
              </Button>
            ))}
          <ActionButton variant="ghost" size="sm" onAction={() => cloneSession(session.id)}>
            <Copy className="size-4" />
            Clone
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="sm"
            className="text-destructive"
            confirm={{ title: "Delete this session?", confirmLabel: "Delete" }}
            onAction={() => deleteSession(session.id)}
          >
            <Trash2 className="size-4" />
            Delete
          </ActionButton>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {brewed ? coffeeName || "Coffee" : "Specialty drink"}
        </h1>
        {brewed && roastDate && <p className="text-sm text-muted-foreground">roasted {roastDate}</p>}
        {restedNow != null && (
          <p className="text-sm text-muted-foreground">Total days rested: {restedNow}</p>
        )}
        {complete && session.brewed_at && (
          <p className="text-sm text-muted-foreground">
            Completed {new Date(session.brewed_at).toLocaleDateString()}
            {!reopened && " · editable via Edit session"}
          </p>
        )}
      </div>

      {/* ---- Phase sub-bar ---- */}
      <nav className="flex items-center gap-1 border-b border-border">
        <PhaseTab label={tabLabel.confirm} active={phase === "confirm"} onClick={() => setPhase("confirm")} />
        {brewed && (
          <Link
            href={`/brew/${session.id}`}
            className="flex items-center gap-1 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Play className="size-3.5" />
            Brew
          </Link>
        )}
        {brewed && <PhaseTab label={tabLabel.postbrew} active={phase === "postbrew"} onClick={() => setPhase("postbrew")} />}
        {!brewed && <PhaseTab label={tabLabel.make} active={phase === "make"} onClick={() => setPhase("make")} />}
        <PhaseTab label={tabLabel.tasting} active={phase === "tasting"} onClick={() => setPhase("tasting")} />
      </nav>

      {/* ---- Confirm: recipe read-first + explicit Edit (review-confirm gate) ---- */}
      {phase === "confirm" && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recipe</h2>
            {canEdit &&
              (editingInstance ? (
                <Button size="sm" variant="outline" onClick={() => setEditingInstance(false)}>Done editing</Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditingInstance(true)}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
              ))}
          </div>

          {canEdit && editingInstance ? (
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
                  <NumberField label={`${bloomLabel} water (g)`} defaultValue={session.bloom_grams} onCommit={(v) => save({ bloom_grams: v })} />
                  <MmssField label={`${bloomLabel} time (m:ss)`} defaultSeconds={session.bloom_seconds} onCommit={(v) => save({ bloom_seconds: v })} />
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
                  <ViewRow label="Bloom water (g)" value={session.bloom_grams ?? undefined} />
                  <ViewRow label="Bloom time (m:ss)" value={session.bloom_seconds != null ? secondsToMMSS(session.bloom_seconds) : undefined} />
                  {session.is_iced && <ViewRow label="Ice (g)" value={session.ice_grams ?? "iced"} />}
                </div>
              )}
              {!brewed && <IngredientsEditor parentField="session_id" parentId={session.id} readOnly />}
              <StepsEditor parentField="session_id" parentId={session.id} mode={session.recipe_type} readOnly />
            </div>
          )}

          {/* Completion metadata, editable when a completed session is reopened. */}
          {complete && reopened && (
            <div className="grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
              <DateField
                label="Brewed date"
                defaultValue={session.brewed_at ? session.brewed_at.slice(0, 10) : null}
                onCommit={(v) => save({ brewed_at: v ? new Date(`${v}T00:00:00`).toISOString() : null })}
              />
              <NumberField
                label="Total days rested"
                defaultValue={session.days_rested_snapshot}
                onCommit={(v) => save({ days_rested_snapshot: v == null ? null : Math.round(v) })}
              />
            </div>
          )}

          {/* Forward motion out of Confirm (navigation, not a state change). */}
          {!complete && !editingInstance && (
            <div>
              {brewed ? (
                <Button asChild size="lg">
                  <Link href={`/brew/${session.id}`}>
                    <Play className="size-4" />
                    Confirm &amp; brew
                  </Link>
                </Button>
              ) : (
                <Button size="lg" onClick={() => setPhase("make")}>
                  Continue to Make
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          )}
        </section>
      )}

      {/* ---- Post-brew (brewed only): total time + notes ---- */}
      {phase === "postbrew" && brewed && (
        <section className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold">Post-brew</h2>
          {canEdit ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <MmssField label="Total brew time (m:ss)" defaultSeconds={session.post_brew_total_time} onCommit={(v) => save({ post_brew_total_time: v })} />
              <div className="sm:col-span-2">
                <TextareaField label="Post-brew notes" defaultValue={session.post_brew_notes} onCommit={(v) => save({ post_brew_notes: v })} />
              </div>
            </div>
          ) : (
            <div className="grid gap-x-8 sm:grid-cols-2">
              <ViewRow label="Total brew time" value={session.post_brew_total_time != null ? secondsToMMSS(session.post_brew_total_time) : undefined} />
              <ViewRow label="Post-brew notes" value={session.post_brew_notes} />
            </div>
          )}
          {!complete && (
            <div>
              <Button size="lg" onClick={() => setPhase("tasting")}>
                Continue to Tasting
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </section>
      )}

      {/* ---- Make (specialty only): the read-first doing view + multiplier ---- */}
      {phase === "make" && !brewed && (
        <section className="flex flex-col gap-6">
          <IngredientsEditor parentField="session_id" parentId={session.id} readOnly showMultiplier />
          <StepsEditor parentField="session_id" parentId={session.id} mode={session.recipe_type} readOnly />
          {!complete && (
            <div>
              <Button size="lg" onClick={() => setPhase("tasting")}>
                Continue to Tasting
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </section>
      )}

      {/* ---- Tasting: enjoyment + prominence + next-time, then Mark complete ---- */}
      {phase === "tasting" && (
        <section className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold">Tasting</h2>
          <TastingEditor sessionId={session.id} categories={categories} readOnly={!canEdit} />
          {canEdit ? (
            <TextareaField label="Next-time adjustments" defaultValue={session.next_time_notes} onCommit={(v) => save({ next_time_notes: v })} />
          ) : (
            <ViewRow label="Next-time adjustments" value={session.next_time_notes} />
          )}

          {!complete && (
            <div className="border-t border-border pt-6">
              {confirming ? (
                <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
                  <p className="text-sm">
                    Mark complete? This snapshots days-rested + brew date and marks the workflow
                    done. You can still edit it afterward.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
                    <form action={completeSession.bind(null, session.id)}>
                      <Button type="submit">
                        <Check className="size-4" />
                        Mark complete
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <Button size="lg" onClick={() => setConfirming(true)}>
                  <Check className="size-4" />
                  Mark complete
                </Button>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function PhaseTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "-mb-px border-b-2 px-3 py-2 text-sm font-medium " +
        (active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground")
      }
    >
      {label}
    </button>
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
