import { useOnboarding } from "@/lib/use-onboarding";
import { useNavigate, useLocation } from "@tanstack/react-router";

export function OnboardingWelcome() {
  const ob = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show on dashboard, when status is pending
  if (ob.loading || !ob.isPending) return null;
  if (!location.pathname.startsWith("/dashboard")) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="brutal-border bg-background max-w-lg w-full p-6 md:p-8">
        <div className="text-xs uppercase tracking-widest text-accent font-bold">
          Bienvenue
        </div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mt-1">
          Bienvenue sur NETODASH
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          On te guide en <strong className="text-foreground">4 étapes rapides</strong>{" "}
          (~2 min) pour démarrer du bon pied :
        </p>
        <ol className="mt-4 space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="font-black text-accent">1.</span>
            <span>Créer ton premier produit</span>
          </li>
          <li className="flex gap-3">
            <span className="font-black text-accent">2.</span>
            <span>Faire ta première saisie quotidienne</span>
          </li>
          <li className="flex gap-3">
            <span className="font-black text-accent">3.</span>
            <span>Lire tes KPIs (ROAS réel, marge nette…)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-black text-accent">4.</span>
            <span>Lire tes KPIs avancés sur le Dashboard</span>
          </li>
        </ol>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              ob.start();
              navigate({ to: "/products" });
            }}
            className="flex-1 brutal-border bg-foreground text-background px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent"
          >
            Commencer le tour
          </button>
          <button
            onClick={() => ob.later()}
            className="brutal-border-thin px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-muted"
          >
            Plus tard
          </button>
          <button
            onClick={() => ob.skip()}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground px-2"
          >
            Passer
          </button>
        </div>
      </div>
    </div>
  );
}
