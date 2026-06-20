import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">Café Jamestine</h1>
        <p className="max-w-md text-lg text-zinc-600">
          Personal specialty-coffee tracking.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="flex h-12 w-48 items-center justify-center rounded-full bg-foreground px-5 font-medium text-background transition-colors hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="flex h-12 w-48 items-center justify-center rounded-full border border-black/10 px-5 font-medium transition-colors hover:bg-black/5"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
