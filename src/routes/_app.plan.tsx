import { useEffect, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useSubscription, PLAN_LABELS } from "@/lib/use-subscription";
import { PlanCards, BillingCycleToggle, type BillingCycle } from "@/components/PlanCards";
import { MobileMoneyCheckout } from "@/components/MobileMoneyCheckout";
import { StripeEmbeddedCheckoutForm } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { changeSubscription, type ChangeSubscriptionAction } from "@/lib/subscription-change.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

type PlanKey = "basic" | "starter" | "pro";

type SearchParams = { payment?: "success" | "cancel"; ref?: string };

export const Route = createFileRoute("/_app/plan")({
  head: () => ({ meta: [{ title: "Mon plan — NETODASH" }] }),
  validateSearch: (search): SearchParams => ({
    payment: search.payment === "success" || search.payment === "cancel" ? search.payment : undefined,
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  component: PlanPage,
});

type PlanMeta = {
  label: string;
  priceMonthly: number;
  priceYearly: number;
  monthlyEquivalent: string;
  priceIdMonthly: string;
  priceIdYearly: string;
  bullets: string[];
};

const PLAN_META: Record<PlanKey, PlanMeta> = {
  basic: {
    label: "Starter",
    priceMonthly: 7,
    priceYearly: 67,
    monthlyEquivalent: "5,58",
    priceIdMonthly: "basic_monthly_v4",
    priceIdYearly: "basic_yearly_v4",
    bullets: [
      "3 produits actifs",
      "Dropshipping OU COD au choix",
      "Dashboard rentabilité complet",
      "1 zone de livraison COD",
      "Historique 60 jours glissants",
    ],
  },
  starter: {
    label: "Pro",
    priceMonthly: 19,
    priceYearly: 182,
    monthlyEquivalent: "15,17",
    priceIdMonthly: "pro_monthly_v4",
    priceIdYearly: "pro_yearly_v4",
    bullets: [
      "Jusqu'à 10 produits actifs",
      "Dropshipping ET COD en parallèle",
      "Upsells, multi-zones COD, capture mobile",
      "Historique illimité · Export CSV",
      "Support email + WhatsApp",
    ],
  },
  pro: {
    label: "Scale",
    priceMonthly: 39,
    priceYearly: 374,
    monthlyEquivalent: "31,17",
    priceIdMonthly: "scale_monthly_v4",
    priceIdYearly: "scale_yearly_v4",
    bullets: [
      "Produits illimités",
      "Analytics Pro EXCLUSIF (scoring, waterfall, break-even, simulateur, insights)",
      "Tout ce qui est inclus dans Pro",
      "Support prioritaire WhatsApp",
    ],
  },
};

function PlanPage() {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const search = useSearch({ from: "/_app/plan" }) as SearchParams;
  const [openCheckout, setOpenCheckout] = useState<PlanKey | null>(null);
  const [method, setMethod] = useState<"stripe" | "momo" | null>(null);
  const [stripePlan, setStripePlan] = useState<PlanKey | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [confirmAction, setConfirmAction] = useState<ChangeSubscriptionAction | null>(null);
  const [loadingChange, setLoadingChange] = useState(false);

  async function handleChange(action: ChangeSubscriptionAction) {
    setLoadingChange(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Non connecté");
      await changeSubscription({
        data: { action, environment: getStripeEnvironment() },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const msg =
        action === "cancel_to_free"
          ? "Annulation programmée. Tu gardes l'accès jusqu'à la fin de la période payée, puis tu retombes sur Free."
          : action === "downgrade_to_pro"
            ? "Tu es repassé sur Pro. La différence est créditée sur ta prochaine facture."
            : "Tu es repassé sur Basic. La différence est créditée sur ta prochaine facture.";
      toast.success(msg);
      setConfirmAction(null);
      setTimeout(() => window.location.reload(), 800);
    } catch (e: any) {
      toast.error(e?.message ?? "Erreur lors du changement de plan.");
    } finally {
      setLoadingChange(false);
    }
  }

  useEffect(() => {
    if (search.payment === "success") {
      toast.success(
        "Paiement reçu ! Ton abonnement s'activera dès la confirmation (quelques secondes).",
      );
    } else if (search.payment === "cancel") {
      toast.error("Paiement annulé.");
    }
  }, [search.payment]);

  if (sub.loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Chargement…
        </div>
      </div>
    );
  }

  const planLabel = PLAN_LABELS[sub.plan];
  const isTrial = sub.isTrialing;
  const trialPct =
    sub.trialDaysLeft != null ? Math.max(0, Math.min(100, (sub.trialDaysLeft / 14) * 100)) : 0;

  const periodEnd = sub.raw?.current_period_end ? new Date(sub.raw.current_period_end) : null;
  const daysToRenew = periodEnd
    ? Math.ceil((periodEnd.getTime() - Date.now()) / 86_400_000)
    : null;
  const renewalSoon = daysToRenew != null && daysToRenew <= 3 && daysToRenew >= 0;
  const isPaid = sub.plan === "basic" || sub.plan === "starter" || sub.plan === "pro";
  const currentBadge: PlanKey | null = isPaid ? (sub.plan as PlanKey) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          ABONNEMENT
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">
          MON PLAN
        </h1>
      </div>

      <section className="brutal-border p-5 md:p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
              PLAN ACTUEL
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tighter">{planLabel}</span>
              {sub.plan === "trial" && (
                <span className="brutal-border-thin border-accent text-accent text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                  Essai
                </span>
              )}
              {sub.plan === "free" && (
                <span className="brutal-border-thin border-accent text-accent text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                  Free
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
              STATUT
            </div>
            <div className="font-mono text-sm font-bold">{sub.status ?? "—"}</div>
          </div>
        </div>

        {isTrial && sub.trialEndsAt && (
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span>
                {sub.trialDaysLeft} jour{sub.trialDaysLeft! > 1 ? "s" : ""} restant
                {sub.trialDaysLeft! > 1 ? "s" : ""}
              </span>
              <span className="text-muted-foreground">
                Fin : {sub.trialEndsAt.toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="brutal-border-thin h-2 bg-background overflow-hidden">
              <div className="h-full bg-accent transition-all" style={{ width: `${trialPct}%` }} />
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              À la fin de ton essai, choisis Starter, Pro ou Scale ci-dessous pour ne pas perdre l'accès.
            </p>
          </div>
        )}

        {sub.plan === "free" && (
          <div className="brutal-border-thin border-accent p-4 mt-4 bg-accent/5">
            <div className="text-sm font-bold text-accent">
              Tu es en plan Free. Choisis Starter ($7), Pro ($19) ou Scale ($39) pour réactiver ton dashboard.
            </div>
          </div>
        )}

        {isPaid && periodEnd && (
          <div className="font-mono text-xs text-muted-foreground mt-2">
            Accès valide jusqu'au :{" "}
            <strong className={renewalSoon ? "text-accent" : ""}>
              {periodEnd.toLocaleDateString("fr-FR")}
            </strong>
            {daysToRenew != null && daysToRenew >= 0 && (
              <> ({daysToRenew} jour{daysToRenew > 1 ? "s" : ""} restant{daysToRenew > 1 ? "s" : ""})</>
            )}
          </div>
        )}

        {renewalSoon && (
          <div className="brutal-border-thin border-accent p-3 mt-3 bg-accent/5 text-sm">
            ⚠ Ton abonnement expire bientôt. Renouvelle ci-dessous pour ne pas perdre l'accès.
          </div>
        )}
      </section>

      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-black">
            {isPaid ? "RENOUVELLE OU CHANGE" : "CHOISIS TON PLAN"}
          </h2>
          <BillingCycleToggle cycle={cycle} onChange={setCycle} />
        </div>
        <PaymentTestModeBanner />
        <PlanCards
          highlightPro
          showCurrentBadge={currentBadge}
          cycle={cycle}
          onSelectPlan={(p) => {
            setOpenCheckout(p);
            setStripePlan(p);
            setMethod("stripe");
          }}
        />
      </section>

      {isPaid && !sub.raw?.cancel_at_period_end && (
        <section className="brutal-border-thin p-5 md:p-6 mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest mb-2">
            Rétrograder ou annuler
          </h3>
          <p className="font-mono text-xs text-muted-foreground mb-4">
            Tu peux rétrograder à tout moment. Tu gardes tes données — seules les limites changent.
          </p>
          <div className="flex flex-wrap gap-3">
            {sub.plan === "pro" && (
              <button
                onClick={() => setConfirmAction("downgrade_to_pro")}
                className="brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground hover:border-accent"
              >
                ↓ Rétrograder vers Pro ($19)
              </button>
            )}
            {(sub.plan === "pro" || sub.plan === "starter") && (
              <button
                onClick={() => setConfirmAction("downgrade_to_basic")}
                className="brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground hover:border-accent"
              >
                ↓ Rétrograder vers Starter ($7)
              </button>
            )}
            <button
              onClick={() => setConfirmAction("cancel_to_free")}
              className="brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            >
              ↓ Annuler & passer en Free
            </button>
          </div>
        </section>
      )}

      {sub.raw?.cancel_at_period_end && (
        <section className="brutal-border-thin border-accent p-4 mb-6 bg-accent/5">
          <div className="text-sm font-bold">
            Ton abonnement est programmé pour s'arrêter à la fin de la période. Tu retomberas
            automatiquement sur le plan Free. Tu peux relancer un abonnement Starter, Pro ou Scale
            à tout moment ci-dessus.
          </div>
        </section>
      )}

      <section className="brutal-border p-5 md:p-6 mb-6 bg-muted/30">
        <h3 className="text-sm font-black uppercase tracking-widest mb-2">
          💡 COMMENT ÇA MARCHE
        </h3>
        <ol className="space-y-1 font-mono text-xs text-muted-foreground list-decimal list-inside">
          <li>Choisis ta cadence (mensuelle ou annuelle −20 %) et ton plan ci-dessus</li>
          <li>Paie par carte bancaire (Visa, Mastercard, Amex) via Stripe — ou Mobile Money</li>
          <li>Ton accès s'active automatiquement pour la période choisie (renouvellement auto)</li>
        </ol>
      </section>

      <Link
        to="/settings"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
      >
        ← Retour aux paramètres du compte
      </Link>

      {openCheckout && method === null && (
        <div
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setOpenCheckout(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="brutal-border bg-background p-6 max-w-md w-full">
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
              MÉTHODE DE PAIEMENT
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-4">
              Plan {PLAN_META[openCheckout].label}
            </h3>
            <div className="grid gap-3">
              <button
                onClick={() => {
                  setStripePlan(openCheckout);
                  setMethod("stripe");
                }}
                className="brutal-border p-4 text-left hover:bg-accent/5"
              >
                <div className="font-black uppercase tracking-wider">Carte bancaire</div>
                <div className="text-xs text-muted-foreground mt-1">Visa, Mastercard, Amex — via Stripe</div>
              </button>
              <button
                onClick={() => setMethod("momo")}
                className="brutal-border p-4 text-left hover:bg-accent/5"
              >
                <div className="font-black uppercase tracking-wider">Mobile Money</div>
                <div className="text-xs text-muted-foreground mt-1">Wave, Orange Money, Max it</div>
              </button>
            </div>
            <button
              onClick={() => setOpenCheckout(null)}
              className="mt-4 text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {openCheckout && method === "momo" && (
        <div
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            setOpenCheckout(null);
            setMethod(null);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MobileMoneyCheckout
              plan={openCheckout}
              onClose={() => {
                setOpenCheckout(null);
                setMethod(null);
              }}
            />
          </div>
        </div>
      )}

      {method === "stripe" && stripePlan && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <button
            onClick={() => {
              setOpenCheckout(null);
              setMethod(null);
              setStripePlan(null);
            }}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 brutal-border-thin px-3 py-2 text-xs uppercase tracking-widest font-bold bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent"
          >
            ✕ Fermer
          </button>

          <div className="min-h-screen grid md:grid-cols-2">
            <aside className="bg-foreground text-background p-8 md:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <Link to="/" className="inline-block text-2xl font-black tracking-tighter hover:text-accent">
                  NETODASH
                </Link>

                <div className="mt-12 md:mt-20">
                  <div className="text-xs uppercase tracking-widest font-bold opacity-60 mb-2">
                    Tu vas t'abonner à
                  </div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter">
                    Plan {PLAN_META[stripePlan].label}
                  </div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-5xl md:text-6xl font-black tracking-tighter">
                      ${cycle === "yearly" ? PLAN_META[stripePlan].priceYearly : PLAN_META[stripePlan].priceMonthly}
                    </span>
                    <span className="font-mono text-sm opacity-60">/ {cycle === "yearly" ? "an" : "mois"}</span>
                  </div>
                  {cycle === "yearly" && (
                    <div className="font-mono text-xs text-accent mt-1 font-bold">
                      ≈ ${PLAN_META[stripePlan].monthlyEquivalent}/mois — économise 20 %
                    </div>
                  )}

                  <div className="mt-8 brutal-border-thin border-background/30 p-4 space-y-2 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-60">Sous-total</span>
                      <span>${cycle === "yearly" ? PLAN_META[stripePlan].priceYearly : PLAN_META[stripePlan].priceMonthly},00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Récurrence</span>
                      <span>{cycle === "yearly" ? "Annuel (−20 %)" : "Mensuel"}</span>
                    </div>
                    <div className="border-t border-background/30 pt-2 flex justify-between font-black text-base">
                      <span>Total dû aujourd'hui</span>
                      <span>${cycle === "yearly" ? PLAN_META[stripePlan].priceYearly : PLAN_META[stripePlan].priceMonthly},00</span>
                    </div>
                  </div>

                  <ul className="mt-8 space-y-2 text-sm">
                    {PLAN_META[stripePlan].bullets.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="text-accent font-black mt-0.5">✓</span>
                        <span className="opacity-90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 font-mono text-xs opacity-50">
                Paiement sécurisé propulsé par Stripe.
                <br />
                Annulable à tout moment depuis tes paramètres.
              </div>
            </aside>

            <section className="p-6 md:p-12 lg:p-16 bg-background">
              <div className="max-w-md mx-auto">
                <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">
                  Paiement par carte
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-6">
                  Tes informations de paiement
                </h2>
                <StripeEmbeddedCheckoutForm
                  priceId={cycle === "yearly" ? PLAN_META[stripePlan].priceIdYearly : PLAN_META[stripePlan].priceIdMonthly}
                  returnUrl={`${window.location.origin}/plan?payment=success`}
                />
              </div>
            </section>
          </div>
        </div>
      )}

      {confirmAction && (
        <div
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => !loadingChange && setConfirmAction(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="brutal-border bg-background p-6 max-w-md w-full">
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">
              Confirmation
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-3">
              {confirmAction === "downgrade_to_pro"
                ? "Rétrograder en Pro ?"
                : confirmAction === "downgrade_to_basic"
                  ? "Rétrograder en Starter ?"
                  : "Annuler l'abonnement ?"}
            </h3>
            <p className="font-mono text-xs text-muted-foreground mb-5">
              {confirmAction === "downgrade_to_pro"
                ? "Tu passes immédiatement sur Pro ($19/mois). Stripe crédite la différence sur ta prochaine facture. Tu perds l'accès Analytics Pro (réservé à Scale) et la limite passe à 10 produits."
                : confirmAction === "downgrade_to_basic"
                  ? "Tu passes immédiatement sur Starter ($7/mois). 3 produits, un seul mode (Dropshipping OU COD), historique limité à 60 jours, plus d'upsells ni de multi-zones COD. La différence est créditée."
                  : "Ton abonnement reste actif jusqu'à la fin de la période payée, puis tu retombes sur Free. Tes données sont conservées."}
            </p>
            <div className="flex gap-3">
              <button
                disabled={loadingChange}
                onClick={() => handleChange(confirmAction)}
                className="flex-1 brutal-border bg-foreground text-background px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50"
              >
                {loadingChange ? "Traitement…" : "Confirmer"}
              </button>
              <button
                disabled={loadingChange}
                onClick={() => setConfirmAction(null)}
                className="brutal-border-thin px-4 py-3 text-xs font-bold uppercase tracking-widest"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
