"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null,
  );

  return (
    <AuthShell
      title="Sign in"
      footer={
        <>
          No account?{" "}
          <Link href="/signup" className="font-medium">
            Create one
          </Link>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
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
            autoComplete="current-password"
            required
          />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        {/* The one pill button in the app. */}
        <Button type="submit" size="touch" disabled={pending} className="w-full rounded-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
