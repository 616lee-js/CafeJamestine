"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// List-beside-detail: the shape that means "browsing a collection" (Coffees, Sessions,
// Recipes). The rail keeps its own scroll and stays put while the detail pane swaps.
//
// Below ~60rem there is not room for both, so the rail becomes a full-width index and
// selecting an entry pushes to the detail — the classic mobile reflow of this pattern.
export function SplitPane({
  basePath,
  rail,
  children,
}: {
  /** Section root, e.g. "/coffees". Anything deeper counts as a selected detail. */
  basePath: string;
  rail: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const detailSelected = pathname !== basePath && pathname.startsWith(`${basePath}/`);

  return (
    <div className="flex flex-col gap-6 min-[60rem]:flex-row min-[60rem]:items-start min-[60rem]:gap-8">
      <div
        className={cn(
          "w-full shrink-0 min-[60rem]:w-[var(--list-pane)]",
          detailSelected && "hidden min-[60rem]:block"
        )}
      >
        {rail}
      </div>
      <div
        className={cn(
          "min-w-0 flex-1",
          !detailSelected && "hidden min-[60rem]:block"
        )}
      >
        <div className="max-w-[var(--detail-measure)]">{children}</div>
      </div>
    </div>
  );
}
