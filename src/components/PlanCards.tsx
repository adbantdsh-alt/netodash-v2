import { Link } from "@tanstack/react-router";

type Variant = "default" | "compact";
export type BillingCycle = "monthly" | "yearly";

/** Réactiver quand la facturation annuelle sera disponible. */
export const YEARLY_BILLING_ENABLED = false;

export type DropshipPlanKey = "basic" | "starter" | "pro";
export type CodPlanKey = "cod";
export type PlanKey = DropshipPlanKey | CodPlanKey;

export const COD_PLAN = {
  name: "COD",
  planKey: "cod" as const,
  price: 10,
  priceId: "cod_monthly_v1",
  tagline: "Piloter ton call center sans Dropshipping",
  features: [
    "Mode COD uniquement",
    "Produits COD illimités",
    "Saisie quotidienne & dashboard basique",
    "Suivi 7 jours / 30 jours",
    "Zones de livraison (1 zone)",
  ],
  notIncluded: [
    "Dropshipping",
    "Analytics Pro & Decision Engine",
    "Upsells · Export CSV · Multi-zones",
  ],
};

export const DROPSHIP_PLAN_PRICING: Record<
  DropshipPlanKey,
  { monthly: number; yearly: number; monthlyEquivalent: string }
> = {
  basic: { monthly: 12, yearly: 115, monthlyEquivalent: "9,58" },
  starter: { monthly: 29, yearly: 278, monthlyEquivalent: "23,17" },
  pro: { monthly: 79, yearly: 756, monthlyEquivalent: "63,00" },
};

type DropshipCardsProps = {
  highlightPro?: boolean;
  showCurrentBadge?: DropshipPlanKey | null;
  variant?: Variant;
  cycle?: BillingCycle;
  onSelectPlan?: (plan: DropshipPlanKey) => void;
};

/** Cartes Starter / Pro / Scale — plans Dropshipping (COD inclus). */
export function DropshippingPlanCards({
  highlightPro = true,
  showCurrentBadge = null,
  variant = "default",
  cycle = "monthly",
  onSelectPlan,
}: DropshipCardsProps) {
  return (
    <div
      className={`grid md:grid-cols-3 gap-6 ${variant === "compact" ? "" : "max-w-6xl"}`}
    >
      <DropshipPlanCard
        name="Starter"
        planKey="basic"
        cycle={cycle}
        tagline="Démarrer en Drop avec le COD inclus"
        features={[
          "Dropshipping complet",
          "Mode COD inclus (dashboard basique)",
          "3 produits Dropshipping max",
          "Produits COD illimités",
          "ROAS net · Dashboard rentabilité",
          "Historique Drop 60 jours",
        ]}
        notIncluded={[
          "Upsells · Export CSV · Multi-zones",
          "Analytics Pro · Decision Engine",
        ]}
        cta="Choisir Starter"
        onSelectPlan={onSelectPlan}
        current={showCurrentBadge === "basic"}
      />
      <DropshipPlanCard
        name="Pro"
        planKey="starter"
        cycle={cycle}
        tagline="Valider plusieurs winners Drop + COD avancé"
        features={[
          "Dropshipping complet",
          "Mode COD inclus",
          "10 produits Dropshipping max",
          "Produits COD illimités",
          "Upsells · Multi-zones COD · Export CSV",
          "Capture mobile · Historique illimité",
          "Support email + WhatsApp",
        ]}
        notIncluded={["Analytics Pro · Decision Engine"]}
        cta="Choisir Pro"
        onSelectPlan={onSelectPlan}
        highlight={highlightPro}
        current={showCurrentBadge === "starter"}
      />
      <DropshipPlanCard
        name="Scale"
        planKey="pro"
        cycle={cycle}
        tagline="Scaler avec Analytics Pro & Decision Engine"
        features={[
          "Dropshipping complet + Analytics Pro",
          "Mode COD inclus",
          "Produits Dropshipping illimités",
          "Produits COD illimités",
          "Decision Engine · Scoring · Waterfall",
          "Break-even · Simulateur · Insights auto",
          "Tout Pro + support WhatsApp prioritaire",
        ]}
        notIncluded={[]}
        cta="Choisir Scale"
        onSelectPlan={onSelectPlan}
        current={showCurrentBadge === "pro"}
      />
    </div>
  );
}

/** @deprecated Utiliser DropshippingPlanCards */
export function PlanCards(props: DropshipCardsProps) {
  return <DropshippingPlanCards {...props} />;
};

type CodCardProps = {
  showCurrent?: boolean;
  onSelectPlan?: () => void;
};

export function CodPlanCard({ showCurrent = false, onSelectPlan }: CodCardProps) {
  const p = COD_PLAN;
  return (
    <div className="brutal-border p-7 flex flex-col max-w-xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            PLAN
          </div>
          <div className="text-3xl font-black tracking-tight mt-1">{p.name}</div>
        </div>
        {showCurrent && (
          <span className="brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-foreground text-background">
            Actuel
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-5xl font-black tracking-tighter">${p.price}</span>
        <span className="font-mono text-sm text-muted-foreground">/mois</span>
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-5">{p.tagline}</p>
      <ul className="space-y-2 mb-5 flex-1">
        {p.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className="text-accent font-black mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
        {p.notIncluded.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground line-through">
            <span className="font-black mt-0.5">✗</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {onSelectPlan ? (
        <button
          onClick={onSelectPlan}
          className="block w-full text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:border-accent"
        >
          {showCurrent ? "Renouveler" : "Choisir COD"}
        </button>
      ) : (
        <Link
          to="/plan"
          className="block text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:border-accent"
        >
          Choisir COD
        </Link>
      )}
    </div>
  );
}

function DropshipPlanCard({
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
  planKey: DropshipPlanKey;
  cycle: BillingCycle;
  tagline: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  onSelectPlan?: (plan: DropshipPlanKey) => void;
  highlight?: boolean;
  current?: boolean;
}) {
  const pricing = DROPSHIP_PLAN_PRICING[planKey];
  const accent = highlight
    ? "brutal-border border-accent bg-accent/5"
    : "brutal-border";

  const mainPrice =
    YEARLY_BILLING_ENABLED && cycle === "yearly"
      ? `$${pricing.yearly}`
      : `$${pricing.monthly}`;
  const mainPeriod =
    YEARLY_BILLING_ENABLED && cycle === "yearly" ? "/an" : "/mois";
  const secondary = YEARLY_BILLING_ENABLED
    ? cycle === "yearly"
      ? `≈ $${pricing.monthlyEquivalent}/mois — économise 20 %`
      : `ou $${pricing.yearly}/an (−20 %)`
    : null;

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
      {secondary && (
        <div className="font-mono text-xs text-accent mb-2 font-bold">{secondary}</div>
      )}
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

export function BillingCycleToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
}) {
  if (!YEARLY_BILLING_ENABLED) return null;

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

export const PLAN_PRICING = DROPSHIP_PLAN_PRICING;
