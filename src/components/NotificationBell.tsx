import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";

const READ_STORAGE_KEY = "netodash:notif:read";
const DISMISS_STORAGE_KEY = "netodash:notif:dismissed";

function loadSet(key: string): Set<string> {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}
function saveSet(key: string, set: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore */
  }
}
import { useAuth } from "@/lib/auth-context";
import { useEntries, useProducts } from "@/lib/queries";
import { dateRangeForPreset } from "@/lib/calc";

type Notif = {
  id: string;
  icon: string;
  title: string;
  body: string;
  to?: string;
  tone: "info" | "warn" | "alert";
};

/**
 * Cloche d'insights : aucune table, tout est dérivé localement des
 * données déjà chargées (produits / saisies 30j). Surfait les signaux
 * qu'un opérateur veut voir tout de suite en arrivant.
 */
export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadSet(READ_STORAGE_KEY));
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => loadSet(DISMISS_STORAGE_KEY));
  const ref = useRef<HTMLDivElement>(null);
  const range = useMemo(() => dateRangeForPreset("30d"), []);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const notifs = useMemo<Notif[]>(() => {
    const list: Notif[] = [];
    const products = productsQ.data ?? [];
    const entries = entriesQ.data ?? [];

    // Pas de produit
    if (products.length === 0) {
      list.push({
        id: "no-product",
        icon: "📦",
        title: "Crée ton premier produit",
        body: "Ajoute un produit pour démarrer le suivi de rentabilité.",
        to: "/products",
        tone: "info",
      });
      return list;
    }

    // Dernière saisie
    if (entries.length === 0) {
      list.push({
        id: "no-entry",
        icon: "📝",
        title: "Aucune saisie sur 30 jours",
        body: "Saisis tes commandes / pub pour voir tes KPIs.",
        to: "/entries",
        tone: "warn",
      });
    } else {
      const lastDate = entries[0].entry_date;
      const today = new Date();
      const last = new Date(lastDate);
      const days = Math.floor((today.getTime() - last.getTime()) / 86400000);
      if (days >= 2) {
        list.push({
          id: "stale-entry",
          icon: "⏱",
          title: `Dernière saisie il y a ${days} jour${days > 1 ? "s" : ""}`,
          body: "Mets à jour tes chiffres pour garder un dashboard fiable.",
          to: "/entries",
          tone: "warn",
        });
      }
    }

    // Produits sans données récentes (7j)
    const recent = entries.filter((e) => {
      const d = new Date(e.entry_date);
      const diff = (Date.now() - d.getTime()) / 86400000;
      return diff <= 7;
    });
    const activeIds = new Set(recent.map((e) => e.product_id));
    const inactive = products.filter((p) => !activeIds.has(p.id));
    if (inactive.length > 0 && products.length > 1) {
      list.push({
        id: "inactive-products",
        icon: "💤",
        title: `${inactive.length} produit${inactive.length > 1 ? "s" : ""} sans données 7j`,
        body: inactive
          .slice(0, 3)
          .map((p) => p.name)
          .join(" · "),
        to: "/products",
        tone: "info",
      });
    }

    return list;
  }, [productsQ.data, entriesQ.data]);

  const visibleNotifs = useMemo(
    () => notifs.filter((n) => !dismissedIds.has(n.id)),
    [notifs, dismissedIds],
  );
  const unreadCount = useMemo(
    () => visibleNotifs.filter((n) => !readIds.has(n.id)).length,
    [visibleNotifs, readIds],
  );

  // Marquer comme lus à l'ouverture du panneau
  useEffect(() => {
    if (!open || visibleNotifs.length === 0) return;
    setReadIds((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const n of visibleNotifs) {
        if (!next.has(n.id)) {
          next.add(n.id);
          changed = true;
        }
      }
      if (changed) saveSet(READ_STORAGE_KEY, next);
      return changed ? next : prev;
    });
  }, [open, visibleNotifs]);

  // Nettoyage : retirer du storage les IDs qui ne sont plus pertinents
  useEffect(() => {
    const currentIds = new Set(notifs.map((n) => n.id));
    setReadIds((prev) => {
      const next = new Set(Array.from(prev).filter((id) => currentIds.has(id)));
      if (next.size !== prev.size) {
        saveSet(READ_STORAGE_KEY, next);
        return next;
      }
      return prev;
    });
    setDismissedIds((prev) => {
      const next = new Set(Array.from(prev).filter((id) => currentIds.has(id)));
      if (next.size !== prev.size) {
        saveSet(DISMISS_STORAGE_KEY, next);
        return next;
      }
      return prev;
    });
  }, [notifs]);

  const dismiss = useCallback((id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveSet(DISMISS_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      for (const n of notifs) next.add(n.id);
      saveSet(DISMISS_STORAGE_KEY, next);
      return next;
    });
  }, [notifs]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className={`relative px-2.5 py-2 brutal-border-thin ${
          open
            ? "bg-foreground text-background border-foreground"
            : "border-foreground/30 hover:border-foreground"
        }`}
        title="Insights & notifications"
      >
        <span className="text-base leading-none">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-accent text-accent-foreground text-[9px] font-black flex items-center justify-center brutal-border-thin border-foreground">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-80 brutal-border bg-background shadow-[6px_6px_0_0_hsl(var(--foreground))] z-50"
        >
          <div className="px-3 py-2 border-b border-foreground/20 flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Insights · {visibleNotifs.length}
            </span>
            {visibleNotifs.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Tout effacer
              </button>
            )}
          </div>
          {visibleNotifs.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
              ✓ Tout est à jour
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {visibleNotifs.map((n) => {
                const isRead = readIds.has(n.id);
                const tone =
                  n.tone === "alert"
                    ? "border-l-accent"
                    : n.tone === "warn"
                      ? "border-l-[#eab308]"
                      : "border-l-foreground/30";
                const inner = (
                  <div
                    className={`px-3 py-2.5 border-b border-foreground/10 border-l-4 ${tone} hover:bg-foreground/5 ${
                      isRead ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base shrink-0">{n.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                          {!isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          )}
                          <span>{n.title}</span>
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground mt-0.5 break-words">
                          {n.body}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dismiss(n.id);
                        }}
                        aria-label="Masquer cette notification"
                        title="Masquer"
                        className="shrink-0 text-muted-foreground hover:text-foreground text-sm leading-none px-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
                return n.to ? (
                  <li key={n.id}>
                    <Link to={n.to as any} onClick={() => setOpen(false)} className="block">
                      {inner}
                    </Link>
                  </li>
                ) : (
                  <li key={n.id}>{inner}</li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

