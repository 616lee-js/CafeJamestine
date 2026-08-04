"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";
import type { RecipeType } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { ListRail, RailGroup, RailItem } from "@/components/list-rail";
import { NewRecipeButton } from "./new-recipe-button";

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

type ScopeFilter = "all" | "standard" | "coffee" | "favorite";

const SCOPES: { v: ScopeFilter; label: string }[] = [
  { v: "all", label: "All" },
  { v: "standard", label: "Standards" },
  { v: "coffee", label: "Coffee-specific" },
  { v: "favorite", label: "Favorites" },
];

export function RecipeList({ recipes }: { recipes: RecipeListItem[] }) {
  const pathname = usePathname();
  const selectedId = pathname.startsWith("/recipes/")
    ? pathname.slice("/recipes/".length)
    : null;
  const [scope, setScope] = useState<ScopeFilter>("all");

  const filtered = recipes.filter((r) => {
    if (scope === "standard" && !r.is_standard) return false;
    if (scope === "coffee" && r.coffee_id == null) return false;
    if (scope === "favorite" && !r.is_favorite) return false;
    return true;
  });

  const groups: { key: RecipeType; label: string }[] = [
    { key: "brewed_coffee", label: "Brewed" },
    { key: "specialty_drink", label: "Specialty" },
  ];

  return (
    <ListRail
      title="Recipes"
      action={<NewRecipeButton />}
      filters={SCOPES.map((o) => (
        <Button
          key={o.v}
          size="xs"
          variant={scope === o.v ? "default" : "outline"}
          aria-pressed={scope === o.v}
          onClick={() => setScope(o.v)}
        >
          {o.label}
        </Button>
      ))}
    >
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recipes match.</p>
      ) : (
        groups.map((g) => {
          const items = filtered.filter((r) => r.recipe_type === g.key);
          if (items.length === 0) return null;
          return (
            <RailGroup key={g.key} label={g.label}>
              {items.map((r) => (
                <RailItem
                  key={r.id}
                  href={`/recipes/${r.id}`}
                  name={r.name || "Untitled recipe"}
                  meta={[
                    r.brew_methods?.name,
                    r.is_standard ? "standard" : r.coffees?.name,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  selected={r.id === selectedId}
                  trailing={
                    r.is_favorite ? (
                      <Star
                        aria-label="Favorite"
                        className="size-[14px] fill-favorite text-favorite"
                      />
                    ) : undefined
                  }
                />
              ))}
            </RailGroup>
          );
        })
      )}
    </ListRail>
  );
}
