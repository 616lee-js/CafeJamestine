"use client";

import { useState } from "react";
import { Coffee, GlassWater, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createRecipe } from "./actions";

export function NewRecipeButton() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New recipe</DialogTitle>
          <DialogDescription>
            Choose a type. This is permanent — it can&apos;t be changed later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <form action={createRecipe.bind(null, "brewed_coffee")}>
            <Button type="submit" variant="outline" className="h-auto w-full flex-col gap-2 py-5">
              <Coffee className="size-6" />
              <span className="font-medium">Brewed coffee</span>
              <span className="text-xs font-normal text-muted-foreground">
                Method, dose, water, timed steps
              </span>
            </Button>
          </form>
          <form action={createRecipe.bind(null, "specialty_drink")}>
            <Button type="submit" variant="outline" className="h-auto w-full flex-col gap-2 py-5">
              <GlassWater className="size-6" />
              <span className="font-medium">Specialty drink</span>
              <span className="text-xs font-normal text-muted-foreground">
                Ingredients + prose steps
              </span>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
