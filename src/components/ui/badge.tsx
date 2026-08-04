import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// The three colour vocabularies, kept apart on purpose. `bag-*` and `session-*` answer
// "what condition is this thing in?"; `phase-*` answers "where am I in this session?" and
// belongs to the stepper alone. Never mix them.
const TONES = {
  "bag-frozen": "bg-bag-frozen-soft text-bag-frozen",
  "bag-resting": "bg-bag-resting-soft text-bag-resting",
  "bag-active": "bg-bag-active-soft text-bag-active",
  "bag-finished": "bg-bag-finished-soft text-bag-finished",
  "session-active": "bg-session-active-soft text-session-active",
  "session-complete": "bg-session-complete-soft text-session-complete",
  "phase-plan": "bg-phase-plan-soft text-phase-plan",
  "phase-brew": "bg-phase-brew-soft text-phase-brew",
  "phase-post": "bg-phase-post-soft text-phase-post",
  "phase-taste": "bg-phase-taste-soft text-phase-taste",
} as const

export type BadgeTone = keyof typeof TONES

function Badge({
  className,
  variant = "default",
  tone,
  dot = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    /** Status or phase colouring. Overrides `variant`'s own colours when set. */
    tone?: BadgeTone
    /** Leading 8px dot, for statuses that are currently live. */
    dot?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-tone={tone}
      className={cn(
        badgeVariants({ variant }),
        tone && TONES[tone],
        className
      )}
      {...props}
    >
      {/* Slot takes exactly one child, so asChild badges render the dot themselves. */}
      {dot && !asChild && (
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
