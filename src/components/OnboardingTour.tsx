import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useOnboarding, STEP_ROUTES, TOTAL_STEPS } from "@/lib/use-onboarding";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

const STEP_CONTENT: Record<
  number,
  { title: string; body: string; tour: string; cta: string }
> = {
  1: {
    title: "Étape 1 — Crée ton premier produit",
    body: "Renseigne le nom, le prix de vente, le coût et les frais. C'est la base : tous tes calculs de rentabilité s'appuient là-dessus.",
    tour: "new-product-btn",
    cta: "J'ai créé mon produit",
  },
  2: {
    title: "Étape 2 — Fais ta première saisie",
    body: "Chaque jour, entre tes commandes Shopify, tes commandes livrées et ton budget pub. Plus tu saisis, plus les données sont précises.",
    tour: "entries-form",
    cta: "J'ai fait ma saisie",
  },
  3: {
    title: "Étape 3 — Lis tes KPIs",
    body: "ROAS réel = revenus livrés / dépenses pub. Marge nette = ce qui te reste vraiment. Taux de livraison = % de commandes livrées.",
    tour: "dashboard-kpis",
    cta: "Compris",
  },
  4: {
    title: "Étape 4 — Lis tes KPIs avancés",
    body: "Marge totale, bénéfice upsell, break-even ROAS : tout est sur ton Dashboard. Le Coach IA (plan Premium) peut t'aider à décider quoi scaler.",
    tour: "dashboard-kpis",
    cta: "Terminer 🎉",
  },
};

export function OnboardingTour() {
  const ob = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Auto-validation: count products & entries
  const productsQ = useQuery({
    queryKey: ["onboarding-products", user?.id],
    enabled: !!user && ob.isActive,
    queryFn: async () => {
      const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
    refetchInterval: 5000,
  });

  const entriesQ = useQuery({
    queryKey: ["onboarding-entries", user?.id],
    enabled: !!user && ob.isActive,
    queryFn: async () => {
      const { count } = await supabase
        .from("daily_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
    refetchInterval: 5000,
  });

  const step = ob.step;
  const content = STEP_CONTENT[step];
  const targetRoute = STEP_ROUTES[step]?.path;
  const onTargetRoute = targetRoute && location.pathname.startsWith(targetRoute);

  // Track target element position
  useEffect(() => {
    if (!ob.isActive || !onTargetRoute || !content) {
      setRect(null);
      return;
    }
    let raf = 0;
    const update = () => {
      const el = document.querySelector(`[data-tour="${content.tour}"]`);
      if (el) {
        setRect((el as HTMLElement).getBoundingClientRect());
      } else {
        setRect(null);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [ob.isActive, onTargetRoute, content, location.pathname]);

  if (!ob.isActive || !content) return null;

  // Auto-advance when condition is met
  const canAdvance =
    (step === 1 && (productsQ.data ?? 0) >= 1) ||
    (step === 2 && (entriesQ.data ?? 0) >= 1) ||
    step === 3 ||
    step === 4;

  // Off-route: show floating mini card prompting navigation
  if (!onTargetRoute) {
    return (
      <div className="fixed bottom-4 left-4 z-50 brutal-border bg-background p-4 max-w-xs shadow-lg">
        <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
          Guide · {step}/{TOTAL_STEPS}
        </div>
        <div className="font-black text-sm mt-1">
          Prochaine étape : {STEP_ROUTES[step].label}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => navigate({ to: targetRoute! as never })}
            className="flex-1 brutal-border-thin bg-foreground text-background px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent"
          >
            Y aller
          </button>
          <button
            onClick={() => ob.skip()}
            className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Passer
          </button>
        </div>
      </div>
    );
  }

  // On target route: highlight + bubble
  const bubbleStyle: React.CSSProperties = rect
    ? {
        position: "fixed",
        top: Math.min(rect.bottom + 12, window.innerHeight - 280),
        left: Math.max(12, Math.min(rect.left, window.innerWidth - 380)),
        zIndex: 51,
      }
    : { position: "fixed", bottom: 16, left: 16, zIndex: 51 };

  const ringStyle: React.CSSProperties | undefined = rect
    ? {
        position: "fixed",
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
        border: "3px solid hsl(var(--accent, 0 0% 0%))",
        borderRadius: 4,
        boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
        pointerEvents: "none",
        zIndex: 50,
        transition: "all 120ms",
      }
    : undefined;

  return (
    <>
      {ringStyle && <div style={ringStyle} />}
      <div
        style={bubbleStyle}
        className="brutal-border bg-background p-4 max-w-sm shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
            Guide · {step}/{TOTAL_STEPS}
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i <= step ? "bg-foreground" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
        <h3 className="font-black text-base mt-1 leading-tight">{content.title}</h3>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          {content.body}
        </p>
        {!canAdvance && (
          <p className="text-[10px] uppercase tracking-widest text-accent font-bold mt-3">
            ⏳ En attente de l'action…
          </p>
        )}
        <div className="mt-4 flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={() => ob.prev()}
              className="brutal-border-thin px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-muted"
            >
              ← Préc.
            </button>
          )}
          <button
            onClick={() => {
              if (step >= TOTAL_STEPS) {
                ob.finish();
              } else {
                ob.next();
                const nextRoute = STEP_ROUTES[step + 1]?.path;
                if (nextRoute) navigate({ to: nextRoute as never });
              }
            }}
            disabled={!canAdvance}
            className="flex-1 brutal-border-thin bg-foreground text-background px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50"
          >
            {content.cta}
          </button>
          <button
            onClick={() => ob.skip()}
            className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Passer
          </button>
        </div>
      </div>
    </>
  );
}
