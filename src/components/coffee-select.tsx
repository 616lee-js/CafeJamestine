"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Option = { id: string; name: string | null };

// Pick an existing coffee (no inline create — coffees are created on the Coffees page).
export function CoffeeSelect({
  value,
  valueName,
  onChange,
  placeholder = "Select coffee…",
}: {
  value: string | null;
  valueName?: string | null;
  onChange: (id: string | null, name: string | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(valueName ?? null);

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    supabase
      .from("coffees")
      .select("id, name")
      .order("name")
      .then(({ data }) => setOptions((data as Option[]) ?? []));
  }, [open]);

  function select(id: string | null, name: string | null) {
    setSelectedName(name);
    onChange(id, name);
    setOpen(false);
  }

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="h-11 w-full justify-between font-normal"
          >
            <span className={cn(!value && "text-muted-foreground")}>
              {value ? selectedName ?? "…" : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command>
            <CommandInput placeholder="Search coffees…" />
            <CommandList>
              <CommandEmpty className="p-2 text-sm text-muted-foreground">
                No coffees.
              </CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.id}
                    value={o.name ?? o.id}
                    onSelect={() => select(o.id, o.name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === o.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {o.name || "Untitled coffee"}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 text-muted-foreground"
          onClick={() => select(null, null)}
          aria-label="Clear"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
