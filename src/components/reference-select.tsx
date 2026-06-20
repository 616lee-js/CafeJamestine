"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createReference } from "@/app/(app)/reference/actions";
import type { ReferenceTable } from "@/lib/db-types";
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

type Option = { id: string; name: string };

export function ReferenceSelect({
  table,
  value,
  valueName,
  onChange,
  countryId,
  placeholder = "Select…",
  disabled,
}: {
  table: ReferenceTable;
  value: string | null;
  valueName?: string | null;
  onChange: (id: string | null, name: string | null) => void;
  countryId?: string | null;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(valueName ?? null);

  async function load() {
    const supabase = createClient();
    let q = supabase.from(table).select("id, name").order("name");
    if (table === "regions") q = q.eq("country_id", countryId ?? "");
    const { data } = await q;
    setOptions((data as Option[]) ?? []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, countryId]);

  function select(id: string | null, name: string | null) {
    setSelectedName(name);
    onChange(id, name);
    setOpen(false);
    setQuery("");
  }

  async function create() {
    const name = query.trim();
    if (!name) return;
    setBusy(true);
    const res = await createReference(table, name, countryId ?? undefined);
    setBusy(false);
    if (res.data) {
      setOptions((prev) =>
        prev.some((o) => o.id === res.data!.id) ? prev : [...prev, res.data!],
      );
      select(res.data.id, res.data.name);
    }
  }

  const hasExact = options.some(
    (o) => o.name.toLowerCase() === query.trim().toLowerCase(),
  );

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="h-11 w-full justify-between font-normal"
          >
            <span className={cn(!value && "text-muted-foreground")}>
              {value ? selectedName ?? "…" : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command shouldFilter>
            <CommandInput
              placeholder="Search or type to add…"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty className="p-2 text-sm text-muted-foreground">
                {query.trim() ? "Press add below." : "No matches."}
              </CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.id}
                    value={o.name}
                    onSelect={() => select(o.id, o.name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === o.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {o.name}
                  </CommandItem>
                ))}
                {query.trim() && !hasExact && (
                  <CommandItem value={`__create_${query}`} onSelect={create} disabled={busy}>
                    <Plus className="mr-2 size-4" />
                    Add “{query.trim()}”
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && !disabled && (
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
