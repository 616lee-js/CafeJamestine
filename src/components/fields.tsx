"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
          onCommit(Number.isFinite(n) ? n : null);
        }}
        className="h-11"
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
