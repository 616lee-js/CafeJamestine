"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// NEXT_REDIRECT is Next.js's internal redirect control signal — not a real error.
export function isRedirectError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "digest" in e &&
    typeof (e as { digest?: unknown }).digest === "string" &&
    (e as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

type Variant = React.ComponentProps<typeof Button>["variant"];
type Size = React.ComponentProps<typeof Button>["size"];

// One button for destructive/async actions: optional naming-confirmation dialog, a pending
// lock (blocks repeat-taps), and redirect-safe error handling (swallows NEXT_REDIRECT, toasts
// only real errors). onAction may be a server-action call or a client handler.
export function ActionButton({
  onAction,
  confirm,
  children,
  variant,
  size,
  className,
  confirmVariant = "destructive",
}: {
  onAction: () => unknown | Promise<unknown>;
  confirm?: { title: string; description?: string; confirmLabel?: string };
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  confirmVariant?: Variant;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function run() {
    setPending(true);
    try {
      await onAction();
      setOpen(false);
      setPending(false);
    } catch (e) {
      if (isRedirectError(e)) return; // navigating away — keep disabled until unmount
      setPending(false);
      toast.error((e as Error)?.message ?? "Action failed");
    }
  }

  if (!confirm) {
    return (
      <Button variant={variant} size={size} className={className} disabled={pending} onClick={run}>
        {children}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <Dialog open={open} onOpenChange={(o) => !pending && setOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirm.title}</DialogTitle>
            {confirm.description && <DialogDescription>{confirm.description}</DialogDescription>}
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button variant={confirmVariant} onClick={run} disabled={pending}>
              {confirm.confirmLabel ?? "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
