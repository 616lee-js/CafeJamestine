"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Advances to the next stepper phase (Post-brew for brewed coffee, Tasting for specialty).
// Does NOT freeze — the session stays active/editable; only Mark complete changes status.
export function CompleteButton({
  sessionId,
  recipeType,
}: {
  sessionId: string;
  recipeType: "brewed_coffee" | "specialty_drink";
}) {
  const router = useRouter();
  const nextPhase = recipeType === "brewed_coffee" ? "postbrew" : "tasting";
  return (
    <Button
      size="hero"
      className="w-full"
      onClick={() => router.push(`/sessions/${sessionId}?phase=${nextPhase}`)}
    >
      <Check className="size-[22px]" />
      Done brewing
    </Button>
  );
}
