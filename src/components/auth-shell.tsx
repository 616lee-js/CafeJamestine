import { Logo, Lockup } from "@/components/logo";

// Two panes: a full-bleed brand panel that only earns its keep on wide screens, and the
// form column at --form-measure. Shared by sign-in and sign-up so they stay identical.
export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-full flex-1">
      <div className="hidden flex-1 items-center justify-center bg-surface-brand min-[64rem]:flex">
        <Logo size={220} reversed />
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[var(--form-measure)] flex-col gap-6">
          <Lockup size={34} textClassName="text-xl" />
          <h1 className="text-3xl">{title}</h1>
          {children}
          <p className="text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>
    </main>
  );
}
