import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl">Confirmation link invalid or expired</h1>
      <p className="max-w-md text-muted-foreground">
        That email confirmation link could not be used. Try signing in, or
        request a new confirmation.
      </p>
      <Link href="/login" className="font-medium underline">
        Back to sign in
      </Link>
    </main>
  );
}
