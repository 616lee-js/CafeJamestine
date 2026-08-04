import type { BagStatus, SessionStatus } from "@/lib/db-types";
import { Badge } from "@/components/ui/badge";

// One pill treatment for both status vocabularies, so "what condition is this in?" always
// looks the same. A dot marks the live states — a bag being drunk, a session in progress.
export function BagStatusBadge({
  status,
  className,
}: {
  status: BagStatus;
  className?: string;
}) {
  return (
    <Badge tone={`bag-${status}`} dot={status === "active"} className={className}>
      {status}
    </Badge>
  );
}

export function SessionStatusBadge({
  status,
  className,
}: {
  status: SessionStatus;
  className?: string;
}) {
  return (
    <Badge
      tone={`session-${status}`}
      dot={status === "active"}
      className={className}
    >
      {status}
    </Badge>
  );
}
