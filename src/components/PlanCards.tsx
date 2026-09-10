import { Link } from "@tanstack/react-router";

type Variant = "default" | "compact";
export type BillingCycle = "monthly" | "yearly";

/** Réactiver quand la facturation annuelle sera disponible. */
export const YEARLY_BILLING_ENABLED = false;

export type DropshipPlanKey = "basic" | "starter" | "pro";
export type PlanKey = DropshipPlanKey;


export const DROPSHIP_PLAN_PRICING: Record<
  DropshipPlanKey,
  { monthly: number; yearly: number; monthlyEquivalent: string }
> = {
  basic: { monthly: 12, yearly: 115, monthlyEquivalent: "9,58" },
  starter: { monthly: 29, yearly: 278, monthlyEquivalent: "23,17" },
  pro: { monthly: 20, yearly: 192, monthlyEquivalent: "16,00" },
};

type DropshipCardsProps = {
  highlightPro?: boolean;
  showCurrentBadge?: DropshipPlanKey | null;
  variant?: Variant;
  cycle?: BillingCycle;
  onSelectPlan?: (plan: DropshipPlanKey) => void;
};

/** Cartes Starter / Pro / Scale. */
export function DropshippingPlanCards({
  highlightPro = true,
  showCurrentBadge = null,
  variant = "default",
  cycle = "monthly",
  onSelectPlan,
}: DropshipCardsProps) {
  return (
    <div
      className={`grid md:grid-cols-1 gap-6 ${variant === "compact" ? "" : "max-w-xl"}`}
    >
      <DropshipPlanCard
        name="Netodash"
        planKey="pro"
        cycle={cycle}
        tagline="Tout illimité, tout inclus"
        features={[
          "Produits illimités",
          "Analytics Pro (scoring, waterfall, break-even, simulateur)",
          "Decision Engine · Insights automatiques",
          "Upsells · Export CSV",
          "Historique illimité",
          "Support WhatsApp",
        ]}
        notIncluded={[]}
        cta="Choisir Netodash"
        onSelectPlan={onSelectPlan}
        highlight={highlightPro}
        current={showCurrentBadge === "pro"}
      />
    </div>
  );
}

/** @deprecated Utiliser DropshippingPlanCards */
export function PlanCards(props: DropshipCardsProps) {
  return <DropshippingPlanCards {...props} />;
};


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
