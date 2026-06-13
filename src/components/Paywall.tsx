import { CodPlanCard, DropshippingPlanCards } from "./PlanCards";

type Props = {
  variant: "analytics" | "trial-expired";
  trialDaysLeft?: number | null;
};

/**
 * Full-section paywall shown when the user lacks the required plan.
 * - "analytics": user n'a pas le plan Scale → upsell vers Scale ($79)
 * - "trial-expired": global block when trial ended without payment
 */
export function Paywall({ variant, trialDaysLeft }: Props) {
  if (variant === "trial-expired") {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full">
          <div className="brutal-border border-accent p-6 mb-6 bg-accent/5">
            <div className="text-xs uppercase tracking-widest font-bold text-accent mb-1">
              ESSAI TERMINÉ
            </div>
            <div className="text-2xl font-black tracking-tight">
              Choisis un plan pour continuer à utiliser NETODASH
            </div>
          </div>
          <div className="space-y-10">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">
                Je fais du COD uniquement
              </div>
              <CodPlanCard />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">
                Je fais du Dropshipping
              </div>
              <DropshippingPlanCards highlightPro />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // variant === "analytics"
  return (
    <div className="space-y-8">
      {/* BANDEAU ACCÈS BLOQUÉ */}
      <div className="brutal-border border-accent p-6 md:p-8 bg-accent/[0.06] relative overflow-hidden">
        <div className="absolute top-0 right-0 px-3 py-1 bg-accent text-accent-foreground text-[10px] uppercase tracking-widest font-mono font-bold">
          🔒 Accès bloqué
        </div>
        <div className="text-xs uppercase tracking-widest font-bold text-accent mb-2 mt-2">
          ANALYTICS PRO · EXCLUSIF AU PLAN SCALE ($79)
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-3">
          TON PLAN ACTUEL N'A PAS ACCÈS<br/>À ANALYTICS PRO
        </h2>
        <p className="font-mono text-sm text-muted-foreground max-w-2xl">
          Tu vois les chiffres bruts, mais pas <strong className="text-foreground">la lecture qui transforme un test en winner</strong>.
          Passe au plan <strong className="text-foreground">Scale</strong> pour débloquer le hub de rentabilité avancée.
        </p>
        {trialDaysLeft != null && trialDaysLeft <= 2 && (
          <div className="font-mono text-xs text-accent mt-4 font-bold">
            ⚠ Ton essai gratuit se termine dans {trialDaysLeft} jour{trialDaysLeft > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* TABLEAU CE QUE TU LOUPES */}
      <div className="brutal-border bg-card">
        <div className="px-5 py-4 border-b border-foreground/20 bg-foreground/5">
          <div className="text-[10px] uppercase tracking-widest font-mono font-bold text-muted-foreground">
            CE QUE TU LOUPES SANS ANALYTICS PRO
          </div>
          <h3 className="text-xl md:text-2xl font-black tracking-tighter mt-1">
            6 perspectives qui font passer du chiffre à la décision
          </h3>
        </div>
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
          {[
            {
              icon: "🏆",
              title: "Score de rentabilité",
              desc: "Chaque produit noté 0-100 selon marge nette, ROAS vs break-even, € profit / € pub et taux de remboursement. Winners et losers identifiés en un coup d'œil.",
            },
            {
              icon: "💰",
              title: "Waterfall du bénéfice",
              desc: "Visualise où part chaque euro : CA → COGS → pub → frais → bénéfice net. Tu sais EXACTEMENT quel coût tue ta rentabilité.",
            },
            {
              icon: "📈",
              title: "Tendances & cohortes",
              desc: "Comparaison période vs précédente, heatmap des jours profitables, streaks. Détecte les patterns invisibles dans le chiffre brut.",
            },
            {
              icon: "🎯",
              title: "Break-even par produit",
              desc: "ROAS minimum et CPA max calculés produit par produit. Tu sais à partir de quel chiffre tu deviens rentable, ou tu coules.",
            },
            {
              icon: "🧪",
              title: "Simulateur de scénarios",
              desc: "« Si je passe le budget de 50 à 200 € avec un CPA de 12 € → bénéfice net projeté = X ». Décide avant de cramer le budget.",
            },
            {
              icon: "🚨",
              title: "Insights & alertes auto",
              desc: "« Ton ROAS chute de 30 % sur 7j », « Produit Y est scaling-ready », « 60 % du budget va sur le pire produit ». Le raisonnement est déjà fait pour toi.",
            },
          ].map((f) => (
            <div key={f.title} className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{f.icon}</span>
                <div className="text-sm font-black tracking-tight uppercase">{f.title}</div>
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROOF / RAISONS DE PASSER AU NIVEAU SUPÉRIEUR */}
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { kpi: "+38%", label: "de marge nette en moyenne pour les users qui suivent les Insights" },
          { kpi: "−2h/j", label: "de temps perdu à reconstruire les calculs dans un tableur" },
          { kpi: "0 €", label: "cramé sur un produit que le score avait flaggé loser" },
        ].map((p) => (
          <div key={p.label} className="brutal-border-thin p-4 bg-card">
            <div className="text-3xl font-black tracking-tighter text-accent">{p.kpi}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">{p.label}</div>
          </div>
        ))}
      </div>

      {/* CHOISIR UN PLAN */}
      <div>
        <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3">
          → Choisis ton plan pour débloquer
        </div>
        <DropshippingPlanCards highlightPro />
      </div>

      <div className="brutal-border-thin p-5 text-xs font-mono text-muted-foreground">
        💡 Les plans <strong>Starter</strong> et <strong>Pro</strong> restent pleins d'outils utiles : Dashboard,
        Produits, Saisies, ROAS net, Calculateur. Analytics Pro vise ceux qui scalent
        plusieurs produits en parallèle et veulent une lecture experte de leurs chiffres.
      </div>
    </div>
  );
}

