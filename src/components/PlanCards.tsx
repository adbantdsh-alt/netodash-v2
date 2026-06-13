import { Link } from "@tanstack/react-router";

type Variant = "default" | "compact";
export type BillingCycle = "monthly" | "yearly";

type PlanKey = "basic" | "starter" | "pro";

type Props = {
  highlightPro?: boolean;
  showCurrentBadge?: PlanKey | null;
  variant?: Variant;
  cycle?: BillingCycle;
  onSelectPlan?: (plan: PlanKey) => void;
};

// Tarifs $ par plan (mensuel + annuel −20%)
export const PLAN_PRICING: Record<
  PlanKey,
  { monthly: number; yearly: number; monthlyEquivalent: string }
> = {
  basic: { monthly: 12, yearly: 115, monthlyEquivalent: "9,58" },
  starter: { monthly: 29, yearly: 278, monthlyEquivalent: "23,17" },
  pro: { monthly: 79, yearly: 756, monthlyEquivalent: "63,00" },
};

/**
 * Cartes des 3 plans payants — Starter / Pro / Scale.
 * Toggle mensuel / annuel (-20%) géré par le parent via `cycle`.
 */
export function PlanCards({
  highlightPro = true,
  showCurrentBadge = null,
  variant = "default",
  cycle = "monthly",
  onSelectPlan,
}: Props) {
  return (
    <div
      className={`grid md:grid-cols-3 gap-6 ${variant === "compact" ? "" : "max-w-6xl"}`}
    >
      <PlanCard
        name="Starter"
        planKey="basic"
        cycle={cycle}
        tagline="Démarrer ton premier produit en Drop OU COD"
        features={[
          "3 produits actifs",
          "Dropshipping OU COD (choix au signup)",
          "ROAS net Meta / TikTok / Google",
          "Dashboard rentabilité complet",
          "Saisies cumulées multi-jours",
          "1 zone de livraison COD",
          "Historique 60 jours glissants",
        ]}
        notIncluded={[
          "Drop ET COD en parallèle",
          "Upsells",
          "Multi-zones COD",
          "Export CSV",
          "Analytics Pro",
        ]}
        cta="Choisir Starter"
        onSelectPlan={onSelectPlan}
        current={showCurrentBadge === "basic"}
      />
      <PlanCard
        name="Pro"
        planKey="starter"
        cycle={cycle}
        tagline="Valider 1 à 3 winners en Drop + COD"
        features={[
          "10 produits actifs",
          "Dropshipping ET COD en parallèle",
          "Upsells (ventes additionnelles)",
          "Multi-zones COD avec tarifs",
          "ROAS net Meta / TikTok / Google",
          "Capture mobile colorée par mode",
          "Historique illimité · Export CSV",
          "Support email + WhatsApp",
        ]}
        notIncluded={["Produits illimités", "Analytics Pro avancée"]}
        cta="Choisir Pro"
        onSelectPlan={onSelectPlan}
        highlight={highlightPro}
        current={showCurrentBadge === "starter"}
      />
      <PlanCard
        name="Scale"
        planKey="pro"
        cycle={cycle}
        tagline="Scaler en volume avec une lecture experte"
        features={[
          "Produits illimités",
          "Upsells illimités",
          "Tout ce qui est inclus dans Pro",
          "Analytics Pro EXCLUSIF",
          "Scoring 0-100 winners/losers",
          "Waterfall du bénéfice net",
          "Break-even & simulateur scénarios",
          "Insights & alertes automatiques",
          "Support prioritaire WhatsApp",
        ]}
        notIncluded={[]}
        cta="Choisir Scale"
        onSelectPlan={onSelectPlan}
        current={showCurrentBadge === "pro"}
      />
    </div>
  );
}

function PlanCard({
  name,
  planKey,
  cycle,
  tagline,
  features,
  notIncluded,
  cta,
  onSelectPlan,
  highlight = false,
  current = false,
}: {
  name: string;
  planKey: PlanKey;
  cycle: BillingCycle;
  tagline: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  onSelectPlan?: (plan: PlanKey) => void;
  highlight?: boolean;
  current?: boolean;
}) {
  const pricing = PLAN_PRICING[planKey];
  const accent = highlight
    ? "brutal-border border-accent bg-accent/5"
    : "brutal-border";

  const mainPrice = cycle === "yearly" ? `$${pricing.yearly}` : `$${pricing.monthly}`;
  const mainPeriod = cycle === "yearly" ? "/an" : "/mois";
  const secondary =
    cycle === "yearly"
      ? `≈ $${pricing.monthlyEquivalent}/mois — économise 20 %`
      : `ou $${pricing.yearly}/an (−20 %)`;

  return (
    <div className={`${accent} p-7 flex flex-col`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            PLAN
          </div>
          <div className="text-3xl font-black tracking-tight mt-1">{name}</div>
        </div>
        {current && (
          <span className="brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-foreground text-background">
            Actuel
          </span>
        )}
        {highlight && !current && (
          <span className="brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-accent text-accent-foreground border-accent">
            Recommandé
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-5xl font-black tracking-tighter">{mainPrice}</span>
        <span className="font-mono text-sm text-muted-foreground">{mainPeriod}</span>
      </div>
      <div className="font-mono text-xs text-accent mb-2 font-bold">{secondary}</div>
      <p className="font-mono text-xs text-muted-foreground mb-5">{tagline}</p>

      <ul className="space-y-2 mb-5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className="text-accent font-black mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
        {notIncluded.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground line-through">
            <span className="font-black mt-0.5">✗</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {onSelectPlan ? (
        <button
          onClick={() => onSelectPlan(planKey)}
          className={`block w-full text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider ${
            highlight
              ? "bg-accent text-accent-foreground border-accent hover:opacity-90"
              : "bg-foreground text-background hover:bg-accent hover:border-accent"
          }`}
        >
          {current ? "Renouveler" : cta}
        </button>
      ) : (
        <Link
          to="/plan"
          className={`block text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider ${
            highlight
              ? "bg-accent text-accent-foreground border-accent hover:opacity-90"
              : "bg-foreground text-background hover:bg-accent hover:border-accent"
          }`}
        >
          {current ? "Gérer mon plan" : cta}
        </Link>
      )}
    </div>
  );
}

/**
 * Toggle Mensuel / Annuel (-20%) — switch premium identique au Drop/COD.
 */
export function BillingCycleToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        role="tablist"
        aria-label="Cadence de facturation"
        data-active={cycle}
        data-size="md"
        className="premium-switch"
      >
        <span className="premium-switch__track" aria-hidden="true" />
        <span className="premium-switch__knob" aria-hidden="true">
          <span className="premium-switch__knob-light" />
        </span>
        <button
          type="button"
          role="tab"
          aria-selected={cycle === "monthly"}
          data-active={cycle === "monthly"}
          onClick={() => onChange("monthly")}
          className="premium-switch__btn"
        >
          Mensuel
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={cycle === "yearly"}
          data-active={cycle === "yearly"}
          onClick={() => onChange("yearly")}
          className="premium-switch__btn"
        >
          Annuel
        </button>
      </div>
      <span
        className={`font-mono text-[10px] font-black uppercase tracking-widest px-2 py-0.5 brutal-border-thin ${
          cycle === "yearly"
            ? "bg-[#16a34a] text-white border-[#16a34a]"
            : "bg-accent/10 text-accent border-accent"
        }`}
      >
        Annuel −20 % · 2 mois offerts
      </span>
    </div>
  );
}

