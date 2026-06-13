import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Preset = "today" | "yesterday" | "7d" | "30d" | "month" | "all" | "custom";

export type CustomRange = { from: string; to: string } | null;

function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

export function PeriodPicker({
  value,
  onChange,
  customRange,
  onCustomChange,
}: {
  value: Preset;
  onChange: (p: Preset) => void;
  customRange?: CustomRange;
  onCustomChange?: (r: CustomRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);

  const items: { v: Preset; label: string }[] = [
    { v: "today", label: "AUJOURD'HUI" },
    { v: "yesterday", label: "HIER" },
    { v: "7d", label: "7 J" },
    { v: "30d", label: "30 J" },
    { v: "month", label: "MOIS" },
    { v: "all", label: "TOUT" },
  ];

  const selected: DateRange | undefined =
    customRange && customRange.from
      ? {
          from: fromISO(customRange.from),
          to: customRange.to ? fromISO(customRange.to) : undefined,
        }
      : undefined;

  const calendarLabel =
    value === "custom" && customRange
      ? customRange.from === customRange.to
        ? formatShort(fromISO(customRange.from))
        : `${formatShort(fromISO(customRange.from))} → ${formatShort(fromISO(customRange.to))}`
      : "DATE";

  return (
    <div className="brutal-border-thin inline-flex flex-nowrap max-w-full overflow-x-auto">
      {items.map((it, i) => (
        <button
          key={it.v}
          onClick={() => onChange(it.v)}
          className={cn(
            "px-4 py-2 text-xs uppercase tracking-widest font-bold",
            i > 0 && "border-l border-foreground",
            value === it.v
              ? "bg-foreground text-background"
              : "hover:bg-foreground/10",
          )}
        >
          {it.label}
        </button>
      ))}
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) setDraft(selected);
        }}
      >
        <PopoverTrigger asChild>
          <button
            className={cn(
              "px-4 py-2 text-xs uppercase tracking-widest font-bold border-l border-foreground inline-flex items-center gap-2",
              value === "custom"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-foreground/10",
            )}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            {calendarLabel}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 brutal-border bg-background" align="end">
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={draft}
            onSelect={(range) => setDraft(range)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="border-t border-foreground p-2 flex justify-between gap-2">
            <button
              onClick={() => {
                setDraft(undefined);
                onCustomChange?.(null);
                onChange("today");
                setOpen(false);
              }}
              className="text-xs uppercase tracking-widest font-bold px-3 py-1 hover:bg-foreground/10"
            >
              Effacer
            </button>
            <button
              onClick={() => {
                if (draft?.from) {
                  const from = toLocalISODate(draft.from);
                  const to = draft.to ? toLocalISODate(draft.to) : from;
                  onCustomChange?.({ from, to });
                  onChange("custom");
                }
                setOpen(false);
              }}
              className="text-xs uppercase tracking-widest font-bold px-3 py-1 bg-foreground text-background"
            >
              Valider
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
