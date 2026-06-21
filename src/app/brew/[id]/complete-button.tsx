"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Advances to feedback (Phase 5). Does NOT freeze — the session stays active/editable.
export function CompleteButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  return (
    <Button size="lg" className="w-full" onClick={() => router.push(`/sessions/${sessionId}`)}>
      <Check className="size-5" />
      Complete
    </Button>
  );
}
