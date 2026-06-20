// Phase 3 verification: recipe CRUD, recipe_type immutability, steps reorder, flags, RLS.
// Run: node --env-file=.env.local scripts/verify-phase3.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, secret, { auth: { persistSession: false } });
const ts = Date.now();
let pass = 0, fail = 0;
const ok = (c, label, extra = "") => { console.log(`${c ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`); if (c) pass++; else fail++; };

const mkUser = async (tag) => {
  const email = `p3-${tag}-${ts}@example.com`;
  const password = "passw0rd-test";
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const client = createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } });
  const si = await client.auth.signInWithPassword({ email, password });
  if (si.error) throw si.error;
  return { id: data.user.id, client };
};

const A = await mkUser("a");
const B = await mkUser("b");

try {
  // create both recipe types
  const brewed = await A.client.from("recipes").insert({ recipe_type: "brewed_coffee", name: `Brew ${ts}` }).select().single();
  ok(!brewed.error, "create brewed_coffee recipe", brewed.error?.message ?? "");
  const specialty = await A.client.from("recipes").insert({ recipe_type: "specialty_drink", name: `Drink ${ts}` }).select().single();
  ok(!specialty.error, "create specialty_drink recipe", specialty.error?.message ?? "");

  // recipe_type immutable (DB trigger)
  const mut = await A.client.from("recipes").update({ recipe_type: "specialty_drink" }).eq("id", brewed.data.id);
  ok(!!mut.error && /immutable/i.test(mut.error.message), "recipe_type change REJECTED (immutable)", mut.error?.message ?? "");

  // other fields still editable
  const edit = await A.client.from("recipes").update({ name: `Brew ${ts} v2`, dose_grams: 18 }).eq("id", brewed.data.id);
  ok(!edit.error, "other recipe fields editable", edit.error?.message ?? "");

  // flag matrix: standard
  await A.client.from("recipes").update({ is_standard: true, coffee_id: null, is_favorite: true }).eq("id", brewed.data.id);
  const std = (await A.client.from("recipes").select("is_standard, coffee_id, is_favorite").eq("id", brewed.data.id).single()).data;
  ok(std.is_standard === true && std.coffee_id === null, "flag: favorited standard");

  // flag matrix: coffee-specific favorite
  const coffee = await A.client.from("coffees").insert({ name: `C ${ts}` }).select().single();
  await A.client.from("recipes").update({ is_standard: false, coffee_id: coffee.data.id, is_favorite: true }).eq("id", specialty.data.id);
  const cs = (await A.client.from("recipes").select("is_standard, coffee_id, is_favorite").eq("id", specialty.data.id).single()).data;
  ok(cs.is_standard === false && cs.coffee_id === coffee.data.id && cs.is_favorite === true, "flag: coffee-specific favorite");

  // steps: add 2, reorder (swap), delete 1
  const s1 = await A.client.from("recipe_steps").insert({ recipe_id: brewed.data.id, position: 1, description: "bloom" }).select().single();
  const s2 = await A.client.from("recipe_steps").insert({ recipe_id: brewed.data.id, position: 2, description: "pour" }).select().single();
  ok(!s1.error && !s2.error, "add 2 steps");
  // swap positions
  await A.client.from("recipe_steps").update({ position: 2 }).eq("id", s1.data.id);
  await A.client.from("recipe_steps").update({ position: 1 }).eq("id", s2.data.id);
  const ordered = (await A.client.from("recipe_steps").select("description, position").eq("recipe_id", brewed.data.id).order("position")).data;
  ok(ordered[0].description === "pour" && ordered[1].description === "bloom", "reorder by position", JSON.stringify(ordered.map(o => o.description)));
  await A.client.from("recipe_steps").delete().eq("id", s1.data.id);
  const remaining = (await A.client.from("recipe_steps").select("id").eq("recipe_id", brewed.data.id)).data;
  ok(remaining.length === 1, "delete step");

  // one-parent CHECK (no parent rejected)
  const orphan = await A.client.from("recipe_steps").insert({ description: "orphan" });
  ok(!!orphan.error, "recipe_steps requires a parent (CHECK)");

  // RLS isolation
  const bSees = (await B.client.from("recipes").select("id").ilike("name", `%${ts}%`)).data ?? [];
  ok(bSees.length === 0, "B cannot see A's recipes (RLS)");
} finally {
  await admin.auth.admin.deleteUser(A.id);
  await admin.auth.admin.deleteUser(B.id);
  console.log(`\n${pass} passed, ${fail} failed.`);
  process.exit(fail ? 1 : 0);
}
