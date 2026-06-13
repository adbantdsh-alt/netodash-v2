import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Info, CheckCircle2, AlertTriangle, X } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "success" | "warning" | "critical";
  audience: string;
  cta_label: string | null;
  cta_url: string | null;
};

const DISMISSED_KEY = "netodash:dismissed-announcements";

function getDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]"); }
  catch { return []; }
}
function dismiss(id: string) {
  const cur = getDismissed();
  if (!cur.includes(id)) {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...cur, id]));
  }
}

const STYLES: Record<Announcement["severity"], { bg: string; fg: string; Icon: typeof Info }> = {
  info: { bg: "#0f172a", fg: "#fff", Icon: Info },
  success: { bg: "#065f46", fg: "#fff", Icon: CheckCircle2 },
  warning: { bg: "#fef3c7", fg: "#7c2d12", Icon: AlertTriangle },
  critical: { bg: "#E05C1A", fg: "#fff", Icon: AlertTriangle },
};

export function AnnouncementsBanner({ userPlan }: { userPlan: string | null }) {
  const [items, setItems] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>(getDismissed);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const nowIso = new Date().toISOString();
      const { data } = await supabase
        .from("announcements" as never)
        .select("id, title, body, severity, audience, cta_label, cta_url")
        .eq("active", true)
        .lte("starts_at", nowIso)
        .or(`ends_at.is.null,ends_at.gt.${nowIso}`)
        .order("created_at", { ascending: false })
        .limit(5);
      if (!cancelled) setItems((data ?? []) as unknown as Announcement[]);
    })();
    return () => { cancelled = true; };
  }, []);

  const isVisibleForUser = (a: Announcement) => {
    if (a.audience === "all") return true;
    const plan = (userPlan ?? "free").toLowerCase();
    if (a.audience === "paying") return ["basic", "starter", "pro"].includes(plan);
    return a.audience === plan;
  };

  const visible = items.filter((a) => isVisibleForUser(a) && !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="w-full">
      {visible.map((a) => {
        const s = STYLES[a.severity];
        const Icon = s.Icon;
        return (
          <div key={a.id} style={{ background: s.bg, color: s.fg }} className="w-full">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
              <Icon size={16} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-bold">{a.title}</span>
                <span className="opacity-90"> — {a.body}</span>
              </div>
              {a.cta_url && a.cta_label && (
                <a href={a.cta_url} target="_blank" rel="noreferrer"
                  className="underline font-bold whitespace-nowrap hidden sm:inline">
                  {a.cta_label}
                </a>
              )}
              <button
                onClick={() => { dismiss(a.id); setDismissed([...dismissed, a.id]); }}
                className="opacity-70 hover:opacity-100"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
