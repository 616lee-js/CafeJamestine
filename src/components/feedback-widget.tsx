"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, Send, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { FEEDBACK_KINDS, type FeedbackKind } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<FeedbackKind, string> = {
  bug: "Bug",
  request: "Request",
};

// Mounted from the root layout so it is present on every page — including brew mode and the
// signed-out auth screens. Anonymous submissions are allowed; user_id fills itself from the
// column's auth.uid() default, so one code path covers signed-in and signed-out.
export function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<FeedbackKind>("bug");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Brew mode has a sticky full-width "Done brewing" footer along the bottom edge; sit above it
  // rather than on top of it.
  const inBrewMode = pathname.startsWith("/brew/");

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Esc closes, matching the dialog convention.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function reset() {
    setBody("");
    setKind("bug");
    setSent(false);
  }

  async function submit() {
    const trimmed = body.trim();
    if (trimmed === "") return;
    setBusy(true);
    const supabase = createClient();
    // No .select() here: anon holds INSERT but deliberately not SELECT, and PostgREST needs
    // SELECT to return the inserted row.
    const { error } = await supabase.from("feedback").insert({
      kind,
      body: trimmed,
      // Read at submit time so the query string comes along without a useSearchParams
      // Suspense boundary.
      page_path: `${window.location.pathname}${window.location.search}`,
    });
    setBusy(false);
    if (error) return toast.error(`Submit failed: ${error.message}`);

    // Toasts are failure-only in this app, so success is acknowledged inline.
    setSent(true);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      reset();
    }, 1400);
  }

  return (
    <div
      className={cn(
        "fixed right-6 z-40 print:hidden",
        inBrewMode ? "bottom-24" : "bottom-6",
      )}
    >
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Send feedback"
          className="flex w-[22rem] max-w-[calc(100vw-3rem)] flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-lg"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold tracking-snug text-heading">
              Send feedback
            </h2>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              aria-label="Close feedback"
            >
              <X />
            </Button>
          </div>

          {sent ? (
            <p className="py-4 text-sm text-muted-foreground">Thanks — filed.</p>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>Type</Label>
                <div className="flex gap-1.5">
                  {FEEDBACK_KINDS.map((k) => (
                    <Button
                      key={k}
                      type="button"
                      size="sm"
                      variant={kind === k ? "default" : "outline"}
                      aria-pressed={kind === k}
                      onClick={() => setKind(k)}
                    >
                      {KIND_LABELS[k]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="feedback-body">What happened?</Label>
                <Textarea
                  id="feedback-body"
                  value={body}
                  maxLength={4000}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={
                    kind === "bug"
                      ? "What went wrong, and what did you expect?"
                      : "What would you like it to do?"
                  }
                  className="min-h-24"
                />
                <p className="text-xs text-muted-foreground">
                  Filed against <span className="font-mono">{pathname}</span>
                </p>
              </div>

              <Button
                size="touch"
                className="w-full"
                disabled={busy || body.trim() === ""}
                onClick={submit}
              >
                <Send />
                {busy ? "Sending…" : "Submit"}
              </Button>
            </>
          )}
        </div>
      ) : (
        // Not a filled indigo button on purpose: the design system allows exactly one filled
        // indigo action per view, and this one is on every screen in the app.
        <Button
          variant="outline"
          size="touch"
          className="bg-card shadow-lg"
          onClick={() => setOpen(true)}
        >
          <MessageSquarePlus />
          Feedback
        </Button>
      )}
    </div>
  );
}
