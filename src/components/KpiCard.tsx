import { roasVerdict } from "@/lib/calc";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sublabel,
  emphasis = "default",
  className,
}: {
  label: string;
  value: string;
  sublabel?: string;
  emphasis?: "default" | "accent";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "brutal-border-thin p-4 md:p-6 flex flex-col justify-between min-h-[120px] md:min-h-[160px] bg-background",
        emphasis === "accent" && "bg-accent text-accent-foreground border-accent",
        className,
      )}
    >
      <div
        className={cn(
          "text-[10px] md:text-xs uppercase tracking-widest font-bold",
          emphasis === "accent" ? "text-accent-foreground/80" : "text-muted-foreground",
        )}
      >
        {label}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl md:text-5xl font-black tabular tracking-tighter break-words">{value}</div>
        {sublabel && (
          <div
            className={cn(
              "mt-2 text-xs font-mono uppercase tracking-wider",
              emphasis === "accent" ? "text-accent-foreground/80" : "text-muted-foreground",
            )}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

export function RoasBadge({ roas, hasSpend }: { roas: number; hasSpend: boolean }) {
  const v = roasVerdict(roas, hasSpend);
  return (
    <div className={cn("inline-flex items-center gap-2 px-4 py-2 font-black uppercase tracking-wider", v.className)}>
      <span>{v.emoji}</span>
      <span>{v.label}</span>
    </div>
  );
}
