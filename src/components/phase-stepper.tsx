"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// The session's phase ramp, drawn from the owner's espresso cups — coloured on the
// lifecycle of coffee (green growth → red cherries → yellow dried → brown roast).
// This ramp belongs to the stepper and its phase badges. Nothing else uses it.
export type PhaseKey = "plan" | "brew" | "postbrew" | "make" | "tasting";

const RAMP: Record<PhaseKey, { label: string; color: string; soft: string }> = {
  plan: { label: "Plan", color: "var(--phase-plan)", soft: "var(--phase-plan-soft)" },
  brew: { label: "Brew", color: "var(--phase-brew)", soft: "var(--phase-brew-soft)" },
  // Specialty drinks make rather than brew, so Make sits at the same ramp stage as Brew.
  make: { label: "Make", color: "var(--phase-brew)", soft: "var(--phase-brew-soft)" },
  postbrew: { label: "Post-brew", color: "var(--phase-post)", soft: "var(--phase-post-soft)" },
  tasting: { label: "Tasting", color: "var(--phase-taste)", soft: "var(--phase-taste-soft)" },
};

export type PhaseStep = {
  key: PhaseKey;
  /** Brew is its own full-screen route, so that step navigates instead of switching tabs. */
  href?: string;
  onSelect?: () => void;
};

// A sub-bar stepper means "moving through a sequence". It sticks beneath the global bar and
// is opaque, so the two navigation levels stay visually distinct.
export function PhaseStepper({
  steps,
  current,
  done,
}: {
  steps: PhaseStep[];
  current: PhaseKey;
  done: PhaseKey[];
}) {
  return (
    <div className="sticky top-[var(--topbar-height)] z-[15] -mx-[var(--shell-gutter)] border-b border-border bg-surface-page px-[var(--shell-gutter)]">
      <nav
        aria-label="Session phases"
        className="flex min-h-[var(--subbar-height)] items-stretch gap-1 overflow-x-auto"
      >
        {steps.map((step, i) => {
          const ramp = RAMP[step.key];
          const active = step.key === current;
          const committed = done.includes(step.key) && !active;
          const content = (
            <>
              <span
                aria-hidden
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                  committed && "text-white"
                )}
                style={{
                  borderColor: ramp.color,
                  backgroundColor: committed ? ramp.color : "transparent",
                }}
              >
                {committed && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-base",
                  active ? "font-semibold text-heading" : "font-medium text-muted-foreground"
                )}
              >
                {ramp.label}
              </span>
            </>
          );

          const className =
            "flex items-center gap-2 border-b-[3px] border-transparent px-2 py-2 transition-colors";
          const style = { borderBottomColor: active ? ramp.color : "transparent" };

          return (
            <div key={step.key} className="flex items-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className="mx-1 h-0.5 w-8 shrink-0 opacity-55"
                  style={{
                    background: `linear-gradient(to right, ${RAMP[steps[i - 1].key].color}, ${ramp.color})`,
                  }}
                />
              )}
              {step.href ? (
                <Link href={step.href} className={className} style={style}>
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={step.onSelect}
                  aria-current={active ? "step" : undefined}
                  className={className}
                  style={style}
                >
                  {content}
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function phaseLabel(key: PhaseKey) {
  return RAMP[key].label;
}

export function phaseColor(key: PhaseKey) {
  return RAMP[key].color;
}
