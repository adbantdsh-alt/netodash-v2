import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { f as useSearch, L as Link } from "./_libs/tanstack__react-router.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { u as useAuth } from "./_ssr/router-CzeTO2qA.mjs";
import { u as useSubscription, P as PLAN_LABELS } from "./_ssr/use-subscription-BHAI1fRK.mjs";
import { a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { s as supabase } from "./_ssr/client-IbqXIlEo.mjs";
import { a as CodPlanCard, D as DropshippingPlanCards, C as COD_PLAN } from "./_ssr/PlanCards-BVPvVBqx.mjs";
import { E as EmbeddedCheckoutProvider, a as EmbeddedCheckout } from "./_libs/stripe__react-stripe-js.mjs";
import { l as loadStripe } from "./_libs/stripe__stripe-js.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireSupabaseAuth } from "./_ssr/auth-middleware-DkI0uzqn.mjs";
import "./_libs/stripe.mjs";
import "./_libs/seroval.mjs";
import { o as objectType, e as enumType, s as stringType } from "./_libs/zod.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/client.server-CcppqNZQ.mjs";
import "./_ssr/shopify-sync.server-B3mu1MxO.mjs";
import "./_ssr/stripe.server-D419Yq3N.mjs";
import "events";
import "http";
import "https";
import "os";
import "./_libs/prop-types.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
function useBetaBenefits(userId) {
  return useQuery({
    queryKey: ["beta-benefits", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("beta_testers").select("free_until, lifetime_discount_percent, status").eq("user_id", userId).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const freeUntil = data.free_until ? new Date(data.free_until) : null;
      const now = Date.now();
      const isFreePeriodActive = !!freeUntil && freeUntil.getTime() > now;
      const freeDaysLeft = isFreePeriodActive ? Math.max(0, Math.ceil((freeUntil.getTime() - now) / 864e5)) : null;
      return {
        freeUntil,
        lifetimeDiscountPercent: Number(data.lifetime_discount_percent ?? 50),
        isBetaTester: data.status === "active",
        isFreePeriodActive,
        freeDaysLeft
      };
    },
    staleTime: 6e4
  });
}
const clientToken$1 = "pk_live_51TTcbOAHcepQgY2oSRpBQJs9qL9tnXkMz2WMoEFZ404NA00xsRU3Xp2ml6STbWTwZYOFKRWySSf92rs6CM8LvoeU00tQwq8zpj";
const environment = clientToken$1?.startsWith("pk_test_") ? "sandbox" : "live";
let stripePromise = null;
function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(clientToken$1);
  }
  return stripePromise;
}
function getStripeEnvironment() {
  return environment;
}
const Input$1 = objectType({
  priceId: stringType().regex(/^[a-zA-Z0-9_-]+$/),
  returnUrl: stringType().url(),
  environment: enumType(["sandbox", "live"])
});
const createStripeCheckoutSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => Input$1.parse(input)).handler(createSsrRpc("b87f3a8181bf6b66b6427b856356060877f64b22f9b6b9e29466a3456840001b"));
function StripeEmbeddedCheckoutForm({ priceId, returnUrl }) {
  const fetchClientSecret = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Vous devez être connecté pour payer.");
    }
    const secret = await createStripeCheckoutSession({
      data: {
        priceId,
        returnUrl: returnUrl || `${window.location.origin}/plan?payment=success`,
        environment: getStripeEnvironment()
      },
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    if (!secret) throw new Error("Stripe did not return a client secret");
    return secret;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "checkout", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmbeddedCheckoutProvider, { stripe: getStripe(), options: { fetchClientSecret }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmbeddedCheckout, {}) }) });
}
const clientToken = "pk_live_51TTcbOAHcepQgY2oSRpBQJs9qL9tnXkMz2WMoEFZ404NA00xsRU3Xp2ml6STbWTwZYOFKRWySSf92rs6CM8LvoeU00tQwq8zpj";
function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800", children: [
    "Tous les paiements en preview sont en mode test.",
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "https://docs.lovable.dev/features/payments#test-and-live-environments",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "underline font-medium",
        children: "En savoir plus"
      }
    )
  ] });
}
const Input = objectType({
  action: enumType(["downgrade_to_pro", "downgrade_to_basic", "cancel_to_free"]),
  environment: enumType(["sandbox", "live"])
});
const changeSubscription = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => Input.parse(input)).handler(createSsrRpc("56fe9073deac704664aa021f8e503cf985b8d95241d697a039bd60682ebbf2c4"));
const DROPSHIP_META = {
  basic: {
    label: "Starter",
    priceMonthly: 12,
    priceIdMonthly: "basic_monthly_v4",
    bullets: ["Dropshipping complet + COD inclus", "3 produits Dropshipping max", "Produits COD illimités", "Dashboard basique COD (7j / 30j)", "Historique Drop 60 jours"]
  },
  starter: {
    label: "Pro",
    priceMonthly: 29,
    priceIdMonthly: "pro_monthly_v4",
    bullets: ["10 produits Dropshipping max", "COD inclus · Upsells · Multi-zones · Export CSV", "Capture mobile · Historique illimité", "Support email + WhatsApp"]
  },
  pro: {
    label: "Scale",
    priceMonthly: 79,
    priceIdMonthly: "scale_monthly_v4",
    bullets: ["Produits Dropshipping illimités", "Analytics Pro & Decision Engine (Drop)", "COD inclus · Tout Pro", "Support WhatsApp prioritaire"]
  }
};
const COD_META = {
  label: "COD",
  priceMonthly: COD_PLAN.price,
  priceIdMonthly: COD_PLAN.priceId,
  bullets: COD_PLAN.features
};
function metaFor(plan) {
  return plan === "cod" ? COD_META : DROPSHIP_META[plan];
}
function PlanPage() {
  const {
    user
  } = useAuth();
  const sub = useSubscription(user?.id);
  const betaQ = useBetaBenefits(user?.id);
  const beta = betaQ.data;
  const search = useSearch({
    from: "/_app/plan"
  });
  const [stripePlan, setStripePlan] = reactExports.useState(null);
  const [confirmAction, setConfirmAction] = reactExports.useState(null);
  const [loadingChange, setLoadingChange] = reactExports.useState(false);
  async function handleChange(action) {
    setLoadingChange(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Non connecté");
      await changeSubscription({
        data: {
          action,
          environment: getStripeEnvironment()
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      const msg = action === "cancel_to_free" ? "Annulation programmée. Tu gardes l'accès jusqu'à la fin de la période payée, puis tu retombes sur Free." : action === "downgrade_to_pro" ? "Tu es repassé sur Pro. La différence est créditée sur ta prochaine facture." : "Tu es repassé sur Starter. La différence est créditée sur ta prochaine facture.";
      toast.success(msg);
      setConfirmAction(null);
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      toast.error(e?.message ?? "Erreur lors du changement de plan.");
    } finally {
      setLoadingChange(false);
    }
  }
  reactExports.useEffect(() => {
    if (search.payment === "success") {
      toast.success("Paiement reçu ! Ton abonnement s'activera dès la confirmation (quelques secondes).");
    } else if (search.payment === "cancel") {
      toast.error("Paiement annulé.");
    }
  }, [search.payment]);
  if (sub.loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto px-6 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Chargement…" }) });
  }
  const planLabel = PLAN_LABELS[sub.plan];
  const isTrial = sub.isTrialing;
  const trialPct = sub.trialDaysLeft != null ? Math.max(0, Math.min(100, sub.trialDaysLeft / 14 * 100)) : 0;
  const periodEnd = sub.raw?.current_period_end ? new Date(sub.raw.current_period_end) : null;
  const daysToRenew = periodEnd ? Math.ceil((periodEnd.getTime() - Date.now()) / 864e5) : null;
  const renewalSoon = daysToRenew != null && daysToRenew <= 3 && daysToRenew >= 0;
  const isPaid = sub.plan === "cod" || sub.plan === "basic" || sub.plan === "starter" || sub.plan === "pro";
  const dropshipBadge = sub.plan === "basic" || sub.plan === "starter" || sub.plan === "pro" ? sub.plan : null;
  const openStripe = (plan) => setStripePlan(plan);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 md:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "ABONNEMENT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "MON PLAN" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border p-5 md:p-8 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1", children: "PLAN ACTUEL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-black tracking-tighter", children: planLabel }),
            sub.plan === "trial" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brutal-border-thin border-accent text-accent text-[10px] font-bold uppercase tracking-widest px-2 py-1", children: "Essai" }),
            sub.plan === "free" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brutal-border-thin border-accent text-accent text-[10px] font-bold uppercase tracking-widest px-2 py-1", children: "Free" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1", children: "STATUT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm font-bold", children: sub.status ?? "—" })
        ] })
      ] }),
      isTrial && sub.trialEndsAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            sub.trialDaysLeft,
            " jour",
            sub.trialDaysLeft > 1 ? "s" : "",
            " restant",
            sub.trialDaysLeft > 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Fin : ",
            sub.trialEndsAt.toLocaleDateString("fr-FR")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin h-2 bg-background overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-accent transition-all", style: {
          width: `${trialPct}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-2", children: "Essai 14 jours — accès complet Drop + COD. Choisis ton plan ci-dessous avant la fin." })
      ] }),
      sub.plan === "free" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin border-accent p-4 mt-4 bg-accent/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-accent", children: "Tu es en plan Free. Choisis le plan COD ($10) ou un plan Dropshipping (Starter $12, Pro $29, Scale $79)." }) }),
      isPaid && periodEnd && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground mt-2", children: [
        "Accès valide jusqu'au :",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: renewalSoon ? "text-accent" : "", children: periodEnd.toLocaleDateString("fr-FR") }),
        daysToRenew != null && daysToRenew >= 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " (",
          daysToRenew,
          " jour",
          daysToRenew > 1 ? "s" : "",
          " restant",
          daysToRenew > 1 ? "s" : "",
          ")"
        ] })
      ] }),
      renewalSoon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin border-accent p-3 mt-3 bg-accent/5 text-sm", children: "⚠ Ton abonnement expire bientôt. Renouvelle ci-dessous pour ne pas perdre l'accès." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentTestModeBanner, {}),
    beta?.isBetaTester && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border border-accent bg-accent/5 p-5 md:p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-black text-accent mb-2", children: "Programme bêta-testeur" }),
      beta.isFreePeriodActive && beta.freeUntil ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm leading-relaxed", children: [
        "Plan ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Scale" }),
        " actif gratuitement encore",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
          beta.freeDaysLeft,
          " jour",
          beta.freeDaysLeft !== 1 ? "s" : ""
        ] }),
        " ",
        "(jusqu'au ",
        beta.freeUntil.toLocaleDateString("fr-FR"),
        ")."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm leading-relaxed", children: [
        "Ta période Scale gratuite est terminée. Tu conserves",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
          "-",
          beta.lifetimeDiscountPercent,
          " % à vie"
        ] }),
        " ",
        "sur tous les plans au checkout Stripe."
      ] }),
      !beta.isFreePeriodActive && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-2", children: "La remise s'applique automatiquement lors du paiement." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tighter", children: "JE FAIS DU COD UNIQUEMENT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-2 mb-6 max-w-2xl", children: "$10/mois · 14 jours gratuits · Dashboard basique (7j / 30j) · Zéro Dropshipping" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CodPlanCard, { showCurrent: sub.plan === "cod", onSelectPlan: () => openStripe("cod") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tighter", children: "JE FAIS DU DROPSHIPPING" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-2 mb-6 max-w-2xl", children: "Starter / Pro / Scale · Le mode COD est inclus sur tous ces plans" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropshippingPlanCards, { highlightPro: true, showCurrentBadge: dropshipBadge, cycle: "monthly", onSelectPlan: openStripe })
    ] }),
    isPaid && sub.plan !== "cod" && !sub.raw?.cancel_at_period_end && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border-thin p-5 md:p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-black uppercase tracking-widest mb-2", children: "Rétrograder ou annuler" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mb-4", children: "Tu peux rétrograder à tout moment. Tu gardes tes données — seules les limites changent." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
        sub.plan === "pro" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmAction("downgrade_to_pro"), className: "brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground hover:border-accent", children: "↓ Rétrograder vers Pro ($29)" }),
        (sub.plan === "pro" || sub.plan === "starter") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmAction("downgrade_to_basic"), className: "brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground hover:border-accent", children: "↓ Rétrograder vers Starter ($12)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmAction("cancel_to_free"), className: "brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive", children: "↓ Annuler & passer en Free" })
      ] })
    ] }),
    sub.raw?.cancel_at_period_end && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-accent p-4 mb-6 bg-accent/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: "Ton abonnement est programmé pour s'arrêter à la fin de la période. Tu peux relancer un abonnement à tout moment ci-dessus." }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border p-5 md:p-6 mb-6 bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-black uppercase tracking-widest mb-2", children: "💡 COMMENT ÇA MARCHE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-1 font-mono text-xs text-muted-foreground list-decimal list-inside", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Choisis COD seul ou un plan Dropshipping (COD inclus)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Paie par carte bancaire (Visa, Mastercard, Amex) via Stripe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Ton accès s'active automatiquement (renouvellement mensuel)" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent", children: "← Retour aux paramètres du compte" }),
    stripePlan && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 bg-background z-50 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStripePlan(null), className: "absolute top-4 right-4 md:top-6 md:right-6 z-10 brutal-border-thin px-3 py-2 text-xs uppercase tracking-widest font-bold bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent", children: "✕ Fermer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-foreground text-background p-8 md:p-12 lg:p-16 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-block text-2xl font-black tracking-tighter hover:text-accent", children: "NETODASH" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 md:mt-20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold opacity-60 mb-2", children: "Tu vas t'abonner à" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl md:text-4xl font-black tracking-tighter", children: [
                "Plan ",
                metaFor(stripePlan).label
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-5xl md:text-6xl font-black tracking-tighter", children: [
                  "$",
                  metaFor(stripePlan).priceMonthly
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm opacity-60", children: "/ mois" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 brutal-border-thin border-background/30 p-4 space-y-2 font-mono text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "Sous-total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "$",
                    metaFor(stripePlan).priceMonthly,
                    ",00"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "Récurrence" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mensuel" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-background/30 pt-2 flex justify-between font-black text-base", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total dû aujourd'hui" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "$",
                    metaFor(stripePlan).priceMonthly,
                    ",00"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-8 space-y-2 text-sm", children: metaFor(stripePlan).bullets.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-black mt-0.5", children: "✓" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-90", children: f })
              ] }, f)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 font-mono text-xs opacity-50", children: [
            "Paiement sécurisé propulsé par Stripe.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Annulable à tout moment depuis tes paramètres."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "p-6 md:p-12 lg:p-16 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2", children: "Paiement par carte" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tighter mb-6", children: "Tes informations de paiement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StripeEmbeddedCheckoutForm, { priceId: metaFor(stripePlan).priceIdMonthly, returnUrl: `${window.location.origin}/plan?payment=success` })
        ] }) })
      ] })
    ] }),
    confirmAction && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 z-50", onClick: () => !loadingChange && setConfirmAction(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), className: "brutal-border bg-background p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1", children: "Confirmation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black tracking-tighter mb-3", children: confirmAction === "downgrade_to_pro" ? "Rétrograder en Pro ?" : confirmAction === "downgrade_to_basic" ? "Rétrograder en Starter ?" : "Annuler l'abonnement ?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mb-5", children: confirmAction === "downgrade_to_pro" ? "Tu passes immédiatement sur Pro ($29/mois). Tu perds Analytics Pro (Scale) et la limite passe à 10 produits Drop." : confirmAction === "downgrade_to_basic" ? "Tu passes immédiatement sur Starter ($12/mois). 3 produits Drop, COD basique inclus, plus d'upsells ni d'export CSV." : "Ton abonnement reste actif jusqu'à la fin de la période payée, puis tu retombes sur Free." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loadingChange, onClick: () => handleChange(confirmAction), className: "flex-1 brutal-border bg-foreground text-background px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50", children: loadingChange ? "Traitement…" : "Confirmer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loadingChange, onClick: () => setConfirmAction(null), className: "brutal-border-thin px-4 py-3 text-xs font-bold uppercase tracking-widest", children: "Annuler" })
      ] })
    ] }) })
  ] });
}
export {
  PlanPage as component
};
