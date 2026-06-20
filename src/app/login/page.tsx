"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null,
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Sign in</h1>
        <form action={formAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-12 rounded-lg border border-black/15 px-3 text-base outline-none focus:border-black/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-12 rounded-lg border border-black/15 px-3 text-base outline-none focus:border-black/40"
            />
          </label>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-12 rounded-full bg-foreground font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-600">
          No account?{" "}
          <Link href="/signup" className="font-medium underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
