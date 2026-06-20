"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpWithInvite, type SignUpState } from "./actions";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState<SignUpState, FormData>(
    signUpWithInvite,
    null,
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Create account
        </h1>
        {state?.success ? (
          <div className="rounded-lg border border-green-600/30 bg-green-50 p-4 text-sm text-green-800">
            {state.success}{" "}
            <Link href="/login" className="font-medium underline">
              Go to sign in
            </Link>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Invite code
              <input
                name="code"
                type="text"
                required
                autoCapitalize="off"
                className="h-12 rounded-lg border border-black/15 px-3 text-base outline-none focus:border-black/40"
              />
            </label>
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
                autoComplete="new-password"
                required
                minLength={8}
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
              {pending ? "Creating…" : "Create account"}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
