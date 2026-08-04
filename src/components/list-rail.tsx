import Link from "next/link";
import { cn } from "@/lib/utils";

// The persistent list column. Sunken fill and its own scroll, so it reads as furniture
// beside the detail pane rather than as more content.
export function ListRail({
  title,
  action,
  filters,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-border bg-surface-rail p-4 min-[60rem]:sticky min-[60rem]:top-6 min-[60rem]:max-h-[calc(100vh-var(--topbar-height)-var(--space-12))] min-[60rem]:overflow-y-auto">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-display text-lg font-semibold tracking-snug text-heading">
          {title}
        </h1>
        {action}
      </div>
      {filters && <div className="flex flex-wrap gap-1.5">{filters}</div>}
      {children}
    </aside>
  );
}

export function RailGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-1.5">
      <h2 className="eyebrow">{label}</h2>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </section>
  );
}

export function RailItem({
  href,
  name,
  meta,
  trailing,
  selected,
}: {
  href: string;
  name: string;
  meta?: string | null;
  /** Status pill, star, or similar. Right-aligned. */
  trailing?: React.ReactNode;
  selected?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex items-center justify-between gap-2 rounded-md px-3 py-2 transition-colors",
          selected ? "bg-surface-selected" : "hover:bg-muted"
        )}
      >
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              "truncate text-sm",
              selected ? "font-semibold text-heading" : "font-medium text-body"
            )}
          >
            {name}
          </span>
          {meta && (
            <span className="truncate text-xs text-muted-foreground">{meta}</span>
          )}
        </span>
        {trailing && <span className="shrink-0">{trailing}</span>}
      </Link>
    </li>
  );
}
