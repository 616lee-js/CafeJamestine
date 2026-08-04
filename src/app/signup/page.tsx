"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithInvite, type SignUpState } from "./actions";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState<SignUpState, FormData>(
    signUpWithInvite,
    null,
  );

  return (
    <AuthShell
      title="Create account"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium">
            Sign in
          </Link>
        </>
      }
    >
      {state?.success ? (
        <div className="rounded-lg border border-[var(--mint-400)] bg-success-soft p-4 text-sm text-success">
          {state.success}{" "}
          <Link href="/login" className="font-medium">
            Go to sign in
          </Link>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="code">Invite code</Label>
            <Input id="code" name="code" type="text" autoCapitalize="off" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" size="touch" disabled={pending} className="w-full rounded-full">
            {pending ? "Creating…" : "Create account"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
