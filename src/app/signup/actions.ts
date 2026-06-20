"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type SignUpState = { error?: string; success?: string } | null;

export async function signUpWithInvite(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const code = String(formData.get("code") ?? "").trim();

  if (!email || !password || !code)
    return { error: "Email, password, and invite code are required." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  // Validate the invite code via the service-role path (clients can't read this table).
  const admin = createAdminClient();
  const { data: invite, error: inviteErr } = await admin
    .from("invite_codes")
    .select("id")
    .eq("code", code)
    .is("used_by", null)
    .maybeSingle();
  if (inviteErr) return { error: "Could not verify invite code. Try again." };
  if (!invite) return { error: "Invalid or already-used invite code." };

  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) return { error: error.message };

  // Consume the code. Best-effort check-then-write; an atomic RPC is a later hardening.
  await admin
    .from("invite_codes")
    .update({ used_by: data.user?.id ?? null, used_at: new Date().toISOString() })
    .eq("id", invite.id);

  return {
    success: "Account created. Check your email to confirm, then sign in.",
  };
}
