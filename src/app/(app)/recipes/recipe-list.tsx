"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { RecipeType } from "@/lib/db-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type RecipeListItem = {
  id: string;
  name: string | null;
  recipe_type: RecipeType;
  is_standard: boolean;
  is_favorite: boolean;
  coffee_id: string | null;
  coffees: { name: string | null } | null;
  brew_methods: { name: string } | null;
};

type TypeFilter = "all" | RecipeType;
type ScopeFilter = "all" | "standard" | "coffee" | "favorite";

export function RecipeList({ recipes }: { recipes: RecipeListItem[] }) {
  const [type, setType] = useState<TypeFilter>("all");
  const [scope, setScope] = useState<ScopeFilter>("all");

  const filtered = recipes.filter((r) => {
    if (type !== "all" && r.recipe_type !== type) return false;
    if (scope === "standard" && !r.is_standard) return false;
    if (scope === "coffee" && r.coffee_id == null) return false;
    if (scope === "favorite" && !r.is_favorite) return false;
    return true;
  });

  const typeOpts: { v: TypeFilter; label: string }[] = [
    { v: "all", label: "All types" },
    { v: "brewed_coffee", label: "Brewed" },
    { v: "specialty_drink", label: "Specialty" },
  ];
  const scopeOpts: { v: ScopeFilter; label: string }[] = [
    { v: "all", label: "All" },
    { v: "standard", label: "Standards" },
    { v: "coffee", label: "Coffee-specific" },
    { v: "favorite", label: "Favorites" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {typeOpts.map((o) => (
          <Button
            key={o.v}
            size="sm"
            variant={type === o.v ? "default" : "outline"}
            onClick={() => setType(o.v)}
          >
            {o.label}
          </Button>
        ))}
        <span className="mx-1 w-px bg-border" />
        {scopeOpts.map((o) => (
          <Button
            key={o.v}
            size="sm"
            variant={scope === o.v ? "default" : "outline"}
            onClick={() => setScope(o.v)}
          >
            {o.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recipes match.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((r) => (
            <li key={r.id}>
              <Link
                href={`/recipes/${r.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 hover:bg-accent"
              >
                <span className="flex items-center gap-2">
                  {r.is_favorite && (
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                  )}
                  <span className="font-medium">{r.name || "Untitled recipe"}</span>
                  <span className="text-sm text-muted-foreground">
                    {[
                      r.brew_methods?.name,
                      r.is_standard ? "standard" : r.coffees?.name,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <Badge variant="secondary">
                  {r.recipe_type === "brewed_coffee" ? "Brewed" : "Specialty"}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
