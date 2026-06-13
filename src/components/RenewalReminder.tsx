import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";

/**
 * Notification subtile en bas à gauche qui pousse l'utilisateur à payer
 * AVANT la fin de son trial ou la fin de sa période payée. S'affiche :
 *   - 2 jours avant la fin du trial (et tant que c'est < 2 jours)
 *   - 2 jours avant la fin du mois (period_end) pour les abonnés payants
 *   - Tout de suite si le trial est déjà expiré (needsPayment)
 *
 * Dismissible mais réapparaît à la prochaine session (sessionStorage).
 */
export function RenewalReminder() {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const [dismissed, setDismissed] = useState(false);

  // Calcule jours restants (trial OU période payée).
  const now = new Date();
  let daysLeft: number | null = null;
  let kind: "trial-ending" | "trial-expired" | "renewal" | null = null;

  if (sub.plan === "trial" && sub.trialEndsAt) {
    const ms = sub.trialEndsAt.getTime() - now.getTime();
    const d = Math.ceil(ms / 86_400_000);
    if (d <= 2 && d > 0) {
      daysLeft = d;
      kind = "trial-ending";
    }
  } else if (sub.plan === "free") {
    kind = "trial-expired";
  } else if (
    (sub.plan === "basic" || sub.plan === "starter" || sub.plan === "pro") &&
    sub.raw?.current_period_end
  ) {
    const end = new Date(sub.raw.current_period_end);
    const ms = end.getTime() - now.getTime();
    const d = Math.ceil(ms / 86_400_000);
    if (d <= 2 && d > 0) {
      daysLeft = d;
      kind = "renewal";
    }
  }

  // sessionStorage : la notif réapparaît au prochain refresh / login.
  useEffect(() => {
    if (!kind) return;
    const key = `renewal-dismissed-${kind}-${daysLeft ?? "x"}`;
    if (sessionStorage.getItem(key) === "1") setDismissed(true);
  }, [kind, daysLeft]);

  if (!user || sub.loading || !kind || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    const key = `renewal-dismissed-${kind}-${daysLeft ?? "x"}`;
    sessionStorage.setItem(key, "1");
  };

  let title = "";
  let body = "";
  let cta = "Payer maintenant";

  if (kind === "trial-ending") {
    title = `Ton essai se termine dans ${daysLeft} jour${daysLeft! > 1 ? "s" : ""}`;
    body = "Active ton plan dès maintenant pour ne pas perdre ton accès.";
    cta = "Choisir mon plan";
  } else if (kind === "trial-expired") {
    title = "Tu es en plan Free";
    body = "Choisis Basic ($5), Pro ($17) ou Premium ($27) pour réactiver ton dashboard.";
    cta = "Voir les plans";
  } else if (kind === "renewal") {
    title = `Ton abonnement se renouvelle dans ${daysLeft} jour${daysLeft! > 1 ? "s" : ""}`;
    body = "Vérifie que ton paiement est bien à jour pour ne pas être interrompu.";
    cta = "Voir mon plan";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="brutal-border bg-background shadow-lg p-4 relative">
        <button
          onClick={handleDismiss}
          aria-label="Masquer"
          className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground text-base leading-none w-6 h-6 flex items-center justify-center"
        >
          ×
        </button>
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full animate-pulse ${
              kind === "trial-expired" ? "bg-accent" : "bg-amber-500"
            }`}
          />
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            {kind === "trial-expired" ? "Plan Free" : "Rappel"}
          </span>
        </div>
        <h4 className="text-sm font-black leading-tight pr-4 mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground leading-snug mb-3">{body}</p>
        <Link
          to="/plan"
          onClick={handleDismiss}
          className="block text-center brutal-border-thin bg-foreground text-background px-3 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
