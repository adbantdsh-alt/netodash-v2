import { useEffect, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useSubscription, PLAN_LABELS } from "@/lib/use-subscription";
import {
  CodPlanCard,
  DropshippingPlanCards,
  COD_PLAN,
  type DropshipPlanKey,
} from "@/components/PlanCards";
import { StripeEmbeddedCheckoutForm } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { changeSubscription, type ChangeSubscriptionAction } from "@/lib/subscription-change.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

type CheckoutPlan = DropshipPlanKey | "cod";

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
  priceIdMonthly: string;
  bullets: string[];
};

const DROPSHIP_META: Record<DropshipPlanKey, PlanMeta> = {
  basic: {
    label: "Starter",
    priceMonthly: 12,
    priceIdMonthly: "basic_monthly_v4",
    bullets: [
      "Dropshipping complet + COD inclus",
      "3 produits Dropshipping max",
      "Produits COD illimités",
      "Dashboard basique COD (7j / 30j)",
      "Historique Drop 60 jours",
    ],
  },
  starter: {
    label: "Pro",
    priceMonthly: 29,
    priceIdMonthly: "pro_monthly_v4",
    bullets: [
      "10 produits Dropshipping max",
      "COD inclus · Upsells · Multi-zones · Export CSV",
      "Capture mobile · Historique illimité",
      "Support email + WhatsApp",
    ],
  },
  pro: {
    label: "Scale",
    priceMonthly: 79,
    priceIdMonthly: "scale_monthly_v4",
    bullets: [
      "Produits Dropshipping illimités",
      "Analytics Pro & Decision Engine (Drop)",
      "COD inclus · Tout Pro",
      "Support WhatsApp prioritaire",
    ],
  },
};

const COD_META: PlanMeta = {
  label: "COD",
  priceMonthly: COD_PLAN.price,
  priceIdMonthly: COD_PLAN.priceId,
  bullets: COD_PLAN.features,
};

function metaFor(plan: CheckoutPlan): PlanMeta {
  return plan === "cod" ? COD_META : DROPSHIP_META[plan];
}

function PlanPage() {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const search = useSearch({ from: "/_app/plan" }) as SearchParams;
  const [stripePlan, setStripePlan] = useState<CheckoutPlan | null>(null);
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
            : "Tu es repassé sur Starter. La différence est créditée sur ta prochaine facture.";
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
  const isPaid =
    sub.plan === "cod" ||
    sub.plan === "basic" ||
    sub.plan === "starter" ||
    sub.plan === "pro";
  const dropshipBadge: DropshipPlanKey | null =
    sub.plan === "basic" || sub.plan === "starter" || sub.plan === "pro"
      ? sub.plan
      : null;

  const openStripe = (plan: CheckoutPlan) => setStripePlan(plan);

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
              Essai 14 jours — accès complet Drop + COD. Choisis ton plan ci-dessous avant la fin.
            </p>
          </div>
        )}

        {sub.plan === "free" && (
          <div className="brutal-border-thin border-accent p-4 mt-4 bg-accent/5">
            <div className="text-sm font-bold text-accent">
              Tu es en plan Free. Choisis le plan COD ($10) ou un plan Dropshipping (Starter $12, Pro $29, Scale $79).
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

      <PaymentTestModeBanner />

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter">
          JE FAIS DU COD UNIQUEMENT
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-2 mb-6 max-w-2xl">
          $10/mois · 14 jours gratuits · Dashboard basique (7j / 30j) · Zéro Dropshipping
        </p>
        <CodPlanCard
          showCurrent={sub.plan === "cod"}
          onSelectPlan={() => openStripe("cod")}
        />
      </section>

      <section className="mb-6">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter">
          JE FAIS DU DROPSHIPPING
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-2 mb-6 max-w-2xl">
          Starter / Pro / Scale · Le mode COD est inclus sur tous ces plans
        </p>
        <DropshippingPlanCards
          highlightPro
          showCurrentBadge={dropshipBadge}
          cycle="monthly"
          onSelectPlan={openStripe}
        />
      </section>

      {isPaid && sub.plan !== "cod" && !sub.raw?.cancel_at_period_end && (
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
                ↓ Rétrograder vers Pro ($29)
              </button>
            )}
            {(sub.plan === "pro" || sub.plan === "starter") && (
              <button
                onClick={() => setConfirmAction("downgrade_to_basic")}
                className="brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground hover:border-accent"
              >
                ↓ Rétrograder vers Starter ($12)
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
            Ton abonnement est programmé pour s'arrêter à la fin de la période. Tu peux relancer un
            abonnement à tout moment ci-dessus.
          </div>
        </section>
      )}

      <section className="brutal-border p-5 md:p-6 mb-6 bg-muted/30">
        <h3 className="text-sm font-black uppercase tracking-widest mb-2">
          💡 COMMENT ÇA MARCHE
        </h3>
        <ol className="space-y-1 font-mono text-xs text-muted-foreground list-decimal list-inside">
          <li>Choisis COD seul ou un plan Dropshipping (COD inclus)</li>
          <li>Paie par carte bancaire (Visa, Mastercard, Amex) via Stripe</li>
          <li>Ton accès s'active automatiquement (renouvellement mensuel)</li>
        </ol>
      </section>

      <Link
        to="/settings"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
      >
        ← Retour aux paramètres du compte
      </Link>

      {stripePlan && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <button
            onClick={() => setStripePlan(null)}
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
                    Plan {metaFor(stripePlan).label}
                  </div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-5xl md:text-6xl font-black tracking-tighter">
                      ${metaFor(stripePlan).priceMonthly}
                    </span>
                    <span className="font-mono text-sm opacity-60">/ mois</span>
                  </div>

                  <div className="mt-8 brutal-border-thin border-background/30 p-4 space-y-2 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-60">Sous-total</span>
                      <span>${metaFor(stripePlan).priceMonthly},00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Récurrence</span>
                      <span>Mensuel</span>
                    </div>
                    <div className="border-t border-background/30 pt-2 flex justify-between font-black text-base">
                      <span>Total dû aujourd'hui</span>
                      <span>${metaFor(stripePlan).priceMonthly},00</span>
                    </div>
                  </div>

                  <ul className="mt-8 space-y-2 text-sm">
                    {metaFor(stripePlan).bullets.map((f) => (
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
                  priceId={metaFor(stripePlan).priceIdMonthly}
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
                ? "Tu passes immédiatement sur Pro ($29/mois). Tu perds Analytics Pro (Scale) et la limite passe à 10 produits Drop."
                : confirmAction === "downgrade_to_basic"
                  ? "Tu passes immédiatement sur Starter ($12/mois). 3 produits Drop, COD basique inclus, plus d'upsells ni d'export CSV."
                  : "Ton abonnement reste actif jusqu'à la fin de la période payée, puis tu retombes sur Free."}
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
