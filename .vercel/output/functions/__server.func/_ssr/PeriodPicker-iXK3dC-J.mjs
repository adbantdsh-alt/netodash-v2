import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, C as Calendar$1 } from "./popover-Dkn3wT7t.mjs";
import { w as Calendar } from "../_libs/lucide-react.mjs";
function toLocalISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatShort(d) {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}
function PeriodPicker({
  value,
  onChange,
  customRange,
  onCustomChange
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState(void 0);
  const items = [
    { v: "today", label: "AUJOURD'HUI" },
    { v: "yesterday", label: "HIER" },
    { v: "7d", label: "7 J" },
    { v: "30d", label: "30 J" },
    { v: "month", label: "MOIS" },
    { v: "all", label: "TOUT" }
  ];
  const selected = customRange && customRange.from ? {
    from: fromISO(customRange.from),
    to: customRange.to ? fromISO(customRange.to) : void 0
  } : void 0;
  const calendarLabel = value === "custom" && customRange ? customRange.from === customRange.to ? formatShort(fromISO(customRange.from)) : `${formatShort(fromISO(customRange.from))} → ${formatShort(fromISO(customRange.to))}` : "DATE";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin inline-flex flex-nowrap max-w-full overflow-x-auto", children: [
    items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onChange(it.v),
        className: cn(
          "px-4 py-2 text-xs uppercase tracking-widest font-bold",
          i > 0 && "border-l border-foreground",
          value === it.v ? "bg-foreground text-background" : "hover:bg-foreground/10"
        ),
        children: it.label
      },
      it.v
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Popover,
      {
        open,
        onOpenChange: (o) => {
          setOpen(o);
          if (o) setDraft(selected);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: cn(
                "px-4 py-2 text-xs uppercase tracking-widest font-bold border-l border-foreground inline-flex items-center gap-2",
                value === "custom" ? "bg-accent text-accent-foreground" : "hover:bg-foreground/10"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
                calendarLabel
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { className: "w-auto p-0 brutal-border bg-background", align: "end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Calendar$1,
              {
                mode: "range",
                numberOfMonths: 1,
                selected: draft,
                onSelect: (range) => setDraft(range),
                initialFocus: true,
                className: cn("p-3 pointer-events-auto")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-foreground p-2 flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setDraft(void 0);
                    onCustomChange?.(null);
                    onChange("today");
                    setOpen(false);
                  },
                  className: "text-xs uppercase tracking-widest font-bold px-3 py-1 hover:bg-foreground/10",
                  children: "Effacer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    if (draft?.from) {
                      const from = toLocalISODate(draft.from);
                      const to = draft.to ? toLocalISODate(draft.to) : from;
                      onCustomChange?.({ from, to });
                      onChange("custom");
                    }
                    setOpen(false);
                  },
                  className: "text-xs uppercase tracking-widest font-bold px-3 py-1 bg-foreground text-background",
                  children: "Valider"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  PeriodPicker as P
};
