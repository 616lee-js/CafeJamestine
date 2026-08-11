"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Coffees · Sessions · Recipes carry the app; Equipment and Reference are low-frequency and
// sit in a quiet trailing group so they never compete for the same billing.
const PRIMARY = [
  { href: "/coffees", label: "Coffees" },
  { href: "/sessions", label: "Sessions" },
  { href: "/recipes", label: "Recipes" },
];

const SECONDARY: { href: string; label: string }[] = [
  { href: "/equipment", label: "Equipment" },
  { href: "/reference", label: "Reference" },
  { href: "/feedback", label: "Feedback" },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function PrimaryNav() {
  const isActive = useIsActive();
  return (
    <nav className="flex shrink-0 items-center gap-1">
      {PRIMARY.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-base transition-colors",
              active
                ? "bg-surface-selected font-semibold text-link-hover"
                : "font-medium text-muted-foreground hover:bg-muted hover:text-heading"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Menu and Orders only render for admins — non-admins would hit a redirect, and RLS would
// refuse the data anyway.
const ADMIN = [
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/orders", label: "Orders" },
];

export function SecondaryNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const isActive = useIsActive();
  const items = isAdmin ? [...ADMIN, ...SECONDARY] : SECONDARY;
  return (
    <nav className="flex shrink-0 items-center gap-1">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm transition-colors",
              active
                ? "bg-surface-selected font-semibold text-link-hover"
                : "font-medium text-muted-foreground hover:bg-muted hover:text-heading"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
