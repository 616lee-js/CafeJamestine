"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { secondsToMMSS, mmssToSeconds, roundMoney } from "@/lib/format";

// Labeled, self-contained auto-save fields. Text commits on blur; toggles/dates on change.
// onCommit receives the normalized value (null when empty).

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// Read-only labeled value for VIEW state. Renders nothing when empty (description page
// shows only filled fields).
export function ViewRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 py-1.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="whitespace-pre-wrap text-sm">{value}</span>
    </div>
  );
}

export function TextField({
  label,
  defaultValue,
  onCommit,
  placeholder,
  type = "text",
}: {
  label: string;
  defaultValue: string | null;
  onCommit: (v: string | null) => void;
  placeholder?: string;
  type?: string;
}) {
  const [v, setV] = useState(defaultValue ?? "");
  return (
    <Field label={label}>
      <Input
        type={type}
        value={v}
        placeholder={placeholder}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => onCommit(v.trim() === "" ? null : v.trim())}
        className="h-11"
      />
    </Field>
  );
}

export function NumberField({
  label,
  defaultValue,
  onCommit,
  placeholder,
  hint,
}: {
  label: string;
  defaultValue: number | null;
  onCommit: (v: number | null) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [v, setV] = useState(defaultValue == null ? "" : String(defaultValue));
  return (
    <Field label={label} hint={hint}>
      <Input
        inputMode="decimal"
        value={v}
        placeholder={placeholder}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          if (v.trim() === "") return onCommit(null);
          const n = Number(v);
          // Measurements: max 1 decimal.
          onCommit(Number.isFinite(n) ? Math.round(n * 10) / 10 : null);
        }}
        className="h-11"
      />
    </Field>
  );
}

// Money: "$" prefix, exactly 2 decimals on commit (exempt from the 1-decimal rule).
export function MoneyField({
  label,
  defaultValue,
  onCommit,
  hint,
}: {
  label: string;
  defaultValue: number | null;
  onCommit: (v: number | null) => void;
  hint?: string;
}) {
  const [v, setV] = useState(defaultValue == null ? "" : String(defaultValue));
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          inputMode="decimal"
          value={v}
          placeholder="0.00"
          onChange={(e) => setV(e.target.value)}
          onBlur={() => {
            if (v.trim() === "") return onCommit(null);
            const n = Number(v);
            onCommit(Number.isFinite(n) ? roundMoney(n) : null);
          }}
          className="h-11 pl-7"
        />
      </div>
    </Field>
  );
}

// Rating: 1–10 in 0.5 steps (coffee override + overall enjoyment).
export function RatingField({
  label,
  defaultValue,
  onCommit,
  hint,
}: {
  label: string;
  defaultValue: number | null;
  onCommit: (v: number | null) => void;
  hint?: string;
}) {
  const [v, setV] = useState(defaultValue == null ? "" : String(defaultValue));
  return (
    <Field label={label} hint={hint ?? "1–10, 0.5 steps"}>
      <Input
        inputMode="decimal"
        value={v}
        placeholder="e.g. 8.5"
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          if (v.trim() === "") {
            setV("");
            return onCommit(null);
          }
          const n = Number(v);
          if (!Number.isFinite(n)) {
            setV("");
            return onCommit(null);
          }
          const clamped = Math.min(10, Math.max(1, Math.round(n * 2) / 2));
          setV(String(clamped));
          onCommit(clamped);
        }}
        className="h-11 w-28"
      />
    </Field>
  );
}

// Time as M:SS via a masked numeric input (iPad keypad friendly — no typed colon).
// Stores/commits seconds; digits format from the right (345 → 3:45).
export function MmssField({
  label,
  defaultSeconds,
  onCommit,
  hint,
}: {
  label: string;
  defaultSeconds: number | null;
  onCommit: (seconds: number | null) => void;
  hint?: string;
}) {
  const [display, setDisplay] = useState(secondsToMMSS(defaultSeconds));
  return (
    <Field label={label} hint={hint ?? "m:ss"}>
      <Input
        inputMode="numeric"
        value={display}
        placeholder="0:00"
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
          if (digits === "") return setDisplay("");
          const secs = digits.slice(-2).padStart(2, "0");
          const mins = digits.slice(0, -2);
          setDisplay(`${mins === "" ? "0" : String(parseInt(mins, 10))}:${secs}`);
        }}
        onBlur={() => onCommit(display.trim() === "" ? null : mmssToSeconds(display))}
        className="h-11 w-28"
      />
    </Field>
  );
}

export function TextareaField({
  label,
  defaultValue,
  onCommit,
  placeholder,
}: {
  label: string;
  defaultValue: string | null;
  onCommit: (v: string | null) => void;
  placeholder?: string;
}) {
  const [v, setV] = useState(defaultValue ?? "");
  return (
    <Field label={label}>
      <Textarea
        value={v}
        placeholder={placeholder}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => onCommit(v.trim() === "" ? null : v)}
        className="min-h-20"
      />
    </Field>
  );
}

export function DateField({
  label,
  defaultValue,
  onCommit,
}: {
  label: string;
  defaultValue: string | null;
  onCommit: (v: string | null) => void;
}) {
  const [v, setV] = useState(defaultValue ?? "");
  return (
    <Field label={label}>
      <Input
        type="date"
        value={v}
        onChange={(e) => {
          setV(e.target.value);
          onCommit(e.target.value === "" ? null : e.target.value);
        }}
        className="h-11"
      />
    </Field>
  );
}

export function SwitchField({
  label,
  defaultChecked,
  onCommit,
}: {
  label: string;
  defaultChecked: boolean;
  onCommit: (v: boolean) => void;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <Label className="text-sm">{label}</Label>
      <Switch
        checked={checked}
        onCheckedChange={(c) => {
          setChecked(c);
          onCommit(c);
        }}
      />
    </div>
  );
}
