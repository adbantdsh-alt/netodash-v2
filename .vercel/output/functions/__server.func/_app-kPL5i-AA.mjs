import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, d as useLocation, L as Link, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { u as useAuth, W as WhatsAppSupport } from "./_ssr/router-CzeTO2qA.mjs";
import { u as useIsAdmin } from "./_ssr/use-is-admin--DQ0ykgS.mjs";
import { u as useSubscription } from "./_ssr/use-subscription-BHAI1fRK.mjs";
import { u as useOnboarding, S as STEP_ROUTES, T as TOTAL_STEPS } from "./_ssr/use-onboarding-3AAwMKL2.mjs";
import { a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { s as supabase } from "./_ssr/client-IbqXIlEo.mjs";
import { g as getCountry, C as COUNTRIES } from "./_ssr/countries-CQCxvze2.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { u as useActiveMode, a as useProducts, b as useEntries } from "./_ssr/queries-BVXaOG3h.mjs";
import { c as canAccessDropshipping, a as canUseDualMode } from "./_ssr/plan-limits-BrKNWLKd.mjs";
import { s as stopImpersonation } from "./_ssr/users.functions-Bbf2rWkf.mjs";
import { _ as _e } from "./_libs/cmdk.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { D as Dialog, a as DialogContent } from "./_ssr/dialog-DAFZrS93.mjs";
import { d as dateRangeForPreset } from "./_ssr/calc-DHAnOS6I.mjs";
import "./_libs/stripe.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import { T as TriangleAlert, e as CircleCheck, I as Info, X, f as Search } from "./_libs/lucide-react.mjs";
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
import "./_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./_ssr/dropshipping-fx-BpQqYaq9.mjs";
import "./_ssr/createSsrRpc-DbtoQF38.mjs";
import "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
function RenewalReminder() {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const [dismissed, setDismissed] = reactExports.useState(false);
  const now = /* @__PURE__ */ new Date();
  let daysLeft = null;
  let kind = null;
  if (sub.plan === "trial" && sub.trialEndsAt) {
    const ms = sub.trialEndsAt.getTime() - now.getTime();
    const d = Math.ceil(ms / 864e5);
    if (d <= 2 && d > 0) {
      daysLeft = d;
      kind = "trial-ending";
    }
  } else if (sub.plan === "free") {
    kind = "trial-expired";
  } else if ((sub.plan === "basic" || sub.plan === "starter" || sub.plan === "pro") && sub.raw?.current_period_end) {
    const end = new Date(sub.raw.current_period_end);
    const ms = end.getTime() - now.getTime();
    const d = Math.ceil(ms / 864e5);
    if (d <= 2 && d > 0) {
      daysLeft = d;
      kind = "renewal";
    }
  }
  reactExports.useEffect(() => {
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
    title = `Ton essai se termine dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`;
    body = "Active ton plan dès maintenant pour ne pas perdre ton accès.";
    cta = "Choisir mon plan";
  } else if (kind === "trial-expired") {
    title = "Tu es en plan Free";
    body = "Choisis Basic ($5), Pro ($17) ou Premium ($27) pour réactiver ton dashboard.";
    cta = "Voir les plans";
  } else if (kind === "renewal") {
    title = `Ton abonnement se renouvelle dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`;
    body = "Vérifie que ton paiement est bien à jour pour ne pas être interrompu.";
    cta = "Voir mon plan";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: "fixed bottom-4 left-4 z-50 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border bg-background shadow-lg p-4 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleDismiss,
            "aria-label": "Masquer",
            className: "absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground text-base leading-none w-6 h-6 flex items-center justify-center",
            children: "×"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-block w-2 h-2 rounded-full animate-pulse ${kind === "trial-expired" ? "bg-accent" : "bg-amber-500"}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground", children: kind === "trial-expired" ? "Plan Free" : "Rappel" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-black leading-tight pr-4 mb-1", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-snug mb-3", children: body }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/plan",
            onClick: handleDismiss,
            className: "block text-center brutal-border-thin bg-foreground text-background px-3 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90",
            children: cta
          }
        )
      ] })
    }
  );
}
function OnboardingWelcome() {
  const ob = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  if (ob.loading || !ob.isPending) return null;
  if (!location.pathname.startsWith("/dashboard")) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border bg-background max-w-lg w-full p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-accent font-bold", children: "Bienvenue" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black uppercase tracking-tight mt-1", children: "Bienvenue sur NETODASH" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground leading-relaxed", children: [
      "On te guide en ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "4 étapes rapides" }),
      " ",
      "(~2 min) pour démarrer du bon pied :"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "mt-4 space-y-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-accent", children: "1." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Créer ton premier produit" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-accent", children: "2." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Faire ta première saisie quotidienne" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-accent", children: "3." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Lire tes KPIs (ROAS réel, marge nette…)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-accent", children: "4." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Lire tes KPIs avancés sur le Dashboard" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            ob.start();
            navigate({ to: "/products" });
          },
          className: "flex-1 brutal-border bg-foreground text-background px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent",
          children: "Commencer le tour"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => ob.later(),
          className: "brutal-border-thin px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-muted",
          children: "Plus tard"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => ob.skip(),
          className: "text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground px-2",
          children: "Passer"
        }
      )
    ] })
  ] }) });
}
const STEP_CONTENT = {
  1: {
    title: "Étape 1 — Crée ton premier produit",
    body: "Renseigne le nom, le prix de vente, le coût et les frais. C'est la base : tous tes calculs de rentabilité s'appuient là-dessus.",
    tour: "new-product-btn",
    cta: "J'ai créé mon produit"
  },
  2: {
    title: "Étape 2 — Fais ta première saisie",
    body: "Chaque jour, entre tes commandes Shopify, tes commandes livrées et ton budget pub. Plus tu saisis, plus les données sont précises.",
    tour: "entries-form",
    cta: "J'ai fait ma saisie"
  },
  3: {
    title: "Étape 3 — Lis tes KPIs",
    body: "ROAS réel = revenus livrés / dépenses pub. Marge nette = ce qui te reste vraiment. Taux de livraison = % de commandes livrées.",
    tour: "dashboard-kpis",
    cta: "Compris"
  },
  4: {
    title: "Étape 4 — Lis tes KPIs avancés",
    body: "Marge totale, bénéfice upsell, break-even ROAS : tout est sur ton Dashboard. Le Coach IA (plan Premium) peut t'aider à décider quoi scaler.",
    tour: "dashboard-kpis",
    cta: "Terminer 🎉"
  }
};
function OnboardingTour() {
  const ob = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [rect, setRect] = reactExports.useState(null);
  const productsQ = useQuery({
    queryKey: ["onboarding-products", user?.id],
    enabled: !!user && ob.isActive,
    queryFn: async () => {
      const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      return count ?? 0;
    },
    refetchInterval: 5e3
  });
  const entriesQ = useQuery({
    queryKey: ["onboarding-entries", user?.id],
    enabled: !!user && ob.isActive,
    queryFn: async () => {
      const { count } = await supabase.from("daily_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      return count ?? 0;
    },
    refetchInterval: 5e3
  });
  const step = ob.step;
  const content = STEP_CONTENT[step];
  const targetRoute = STEP_ROUTES[step]?.path;
  const onTargetRoute = targetRoute && location.pathname.startsWith(targetRoute);
  reactExports.useEffect(() => {
    if (!ob.isActive || !onTargetRoute || !content) {
      setRect(null);
      return;
    }
    let raf = 0;
    const update = () => {
      const el = document.querySelector(`[data-tour="${content.tour}"]`);
      if (el) {
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [ob.isActive, onTargetRoute, content, location.pathname]);
  if (!ob.isActive || !content) return null;
  const canAdvance = step === 1 && (productsQ.data ?? 0) >= 1 || step === 2 && (entriesQ.data ?? 0) >= 1 || step === 3 || step === 4;
  if (!onTargetRoute) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-4 left-4 z-50 brutal-border bg-background p-4 max-w-xs shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest text-accent font-bold", children: [
        "Guide · ",
        step,
        "/",
        TOTAL_STEPS
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-black text-sm mt-1", children: [
        "Prochaine étape : ",
        STEP_ROUTES[step].label
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate({ to: targetRoute }),
            className: "flex-1 brutal-border-thin bg-foreground text-background px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent",
            children: "Y aller"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => ob.skip(),
            className: "text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground",
            children: "Passer"
          }
        )
      ] })
    ] });
  }
  const bubbleStyle = rect ? {
    position: "fixed",
    top: Math.min(rect.bottom + 12, window.innerHeight - 280),
    left: Math.max(12, Math.min(rect.left, window.innerWidth - 380)),
    zIndex: 51
  } : { position: "fixed", bottom: 16, left: 16, zIndex: 51 };
  const ringStyle = rect ? {
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
    transition: "all 120ms"
  } : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    ringStyle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: ringStyle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: bubbleStyle,
        className: "brutal-border bg-background p-4 max-w-sm shadow-2xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest text-accent font-bold", children: [
              "Guide · ",
              step,
              "/",
              TOTAL_STEPS
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `w-1.5 h-1.5 rounded-full ${i <= step ? "bg-foreground" : "bg-muted-foreground/30"}`
              },
              i
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-base mt-1 leading-tight", children: content.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 leading-relaxed", children: content.body }),
          !canAdvance && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-accent font-bold mt-3", children: "⏳ En attente de l'action…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
            step > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => ob.prev(),
                className: "brutal-border-thin px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-muted",
                children: "← Préc."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  if (step >= TOTAL_STEPS) {
                    ob.finish();
                  } else {
                    ob.next();
                    const nextRoute = STEP_ROUTES[step + 1]?.path;
                    if (nextRoute) navigate({ to: nextRoute });
                  }
                },
                disabled: !canAdvance,
                className: "flex-1 brutal-border-thin bg-foreground text-background px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50",
                children: content.cta
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => ob.skip(),
                className: "text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground",
                children: "Passer"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const DISMISS_KEY = "profile-completion-dismissed-at";
const DISMISS_DAYS = 3;
function ProfileCompletionBanner() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [dismissed, setDismissed] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  const [country, setCountry] = reactExports.useState("");
  const [phoneCode, setPhoneCode] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    let mounted = true;
    supabase.from("profiles").select("country, phone, phone_country_code").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!mounted || !data) return;
      setProfile(data);
      setCountry(data.country ?? "");
      setPhoneCode(data.phone_country_code ?? "");
      setPhone(data.phone ?? "");
    });
    try {
      const v = localStorage.getItem(DISMISS_KEY);
      if (v) {
        const t = parseInt(v, 10);
        if (Date.now() - t < DISMISS_DAYS * 864e5) setDismissed(true);
      }
    } catch {
    }
    return () => {
      mounted = false;
    };
  }, [user]);
  reactExports.useEffect(() => {
    if (!country) return;
    const c = getCountry(country);
    if (c?.dial && !phoneCode) setPhoneCode(c.dial);
  }, [country, phoneCode]);
  if (loading || !user || !profile) return null;
  const missingCountry = !profile.country;
  const missingPhone = !profile.phone;
  if (!missingCountry && !missingPhone) return null;
  if (dismissed && !open) return null;
  function dismiss2() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
    }
    setDismissed(true);
  }
  async function save() {
    if (!user) return;
    if (!country.trim() && !phone.trim()) {
      toast.error("Renseigne au moins ton pays ou ton téléphone.");
      return;
    }
    setSaving(true);
    const updates = {};
    if (country.trim()) updates.country = country.trim();
    if (phoneCode.trim()) updates.phone_country_code = phoneCode.trim();
    if (phone.trim()) updates.phone = phone.trim().replace(/[^\d\s]/g, "");
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profil mis à jour 👌");
    setProfile({
      country: updates.country ?? profile?.country ?? null,
      phone: updates.phone ?? profile?.phone ?? null,
      phone_country_code: updates.phone_country_code ?? profile?.phone_country_code ?? null
    });
    setOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin border-l-0 border-r-0 border-t-0 bg-accent/10 text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1600px] mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3 text-xs md:text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest text-accent text-[10px] md:text-xs shrink-0 hidden sm:inline", children: "Profil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 min-w-0", children: missingCountry && missingPhone ? "Ajoute ton pays et ton téléphone pour recevoir l'assistance WhatsApp." : missingCountry ? "Ajoute ton pays pour des conseils adaptés." : "Ajoute ton numéro WhatsApp pour recevoir l'assistance." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setOpen(true),
          className: "brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent shrink-0",
          children: "Compléter"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: dismiss2,
          "aria-label": "Fermer",
          className: "text-muted-foreground hover:text-foreground shrink-0",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4",
        onClick: () => !saving && setOpen(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "brutal-border bg-background max-w-md w-full p-6",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-accent font-bold", children: "Profil" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black uppercase tracking-tight mt-1", children: "Complète ton profil" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Pour qu'on puisse t'aider plus vite et adapter les conseils à ton marché." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1.5", children: "Pays" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: country,
                      onChange: (e) => {
                        setCountry(e.target.value);
                        const c = getCountry(e.target.value);
                        if (c?.dial) setPhoneCode(c.dial);
                      },
                      className: "w-full brutal-border-thin bg-background px-3 py-2 text-sm",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Choisir —" }),
                        COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.code, children: [
                          c.flag,
                          " ",
                          c.name
                        ] }, c.code))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-widest font-bold mb-1.5", children: "Téléphone WhatsApp" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        value: phoneCode,
                        onChange: (e) => setPhoneCode(e.target.value),
                        placeholder: "+221",
                        maxLength: 5,
                        className: "w-20 brutal-border-thin bg-background px-2 py-2 text-sm"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "tel",
                        inputMode: "numeric",
                        value: phone,
                        onChange: (e) => setPhone(e.target.value.replace(/[^\d\s]/g, "")),
                        placeholder: "77 123 45 67",
                        maxLength: 20,
                        className: "flex-1 brutal-border-thin bg-background px-3 py-2 text-sm"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: save,
                    disabled: saving,
                    className: "flex-1 brutal-border bg-foreground text-background px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50",
                    children: saving ? "Sauvegarde…" : "Enregistrer"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setOpen(false),
                    disabled: saving,
                    className: "brutal-border-thin px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-muted",
                    children: "Annuler"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
function PremiumModeSwitch({
  mode,
  onChange,
  disabled,
  size = "md",
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "tablist",
      "aria-label": "Sélecteur de mode business",
      "data-active": mode,
      "data-size": size,
      className: `premium-switch ${className}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-switch__track", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-switch__knob", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "premium-switch__knob-light" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": mode === "dropshipping",
            "data-active": mode === "dropshipping",
            disabled,
            onClick: () => onChange("dropshipping"),
            className: "premium-switch__btn",
            children: "Dropship"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": mode === "cod",
            "data-active": mode === "cod",
            disabled,
            onClick: () => onChange("cod"),
            className: "premium-switch__btn",
            children: "COD"
          }
        )
      ]
    }
  );
}
function ModeSwitch({ variant = "desktop" }) {
  const { mode, setMode, isLoading } = useActiveMode();
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const legacyQ = useQuery({
    queryKey: ["profile-legacy-dual", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("legacy_dual_mode").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return Boolean(data?.legacy_dual_mode);
    }
  });
  const legacy = legacyQ.data ?? false;
  const dropAllowed = canAccessDropshipping(sub.plan, legacy);
  const dualAllowed = canUseDualMode(sub.plan, legacy);
  const lockedToCod = sub.plan === "cod";
  const handleChange = (m) => {
    if (m === "dropshipping" && !dropAllowed) {
      toast.error(
        "Ton plan COD n'inclut pas le Dropshipping. Passe à Starter ($12) ou plus."
      );
      return;
    }
    if (!dualAllowed && m !== mode) {
      toast.error("Mode verrouillé sur ton plan actuel.");
      return;
    }
    void setMode(m);
  };
  const switchDisabled = isLoading || lockedToCod || !dualAllowed;
  if (variant === "mobile") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 py-3 border-b border-foreground/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: "Mode actif" }),
        !dropAllowed && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/plan",
            className: "text-[10px] font-mono font-bold uppercase tracking-widest underline",
            children: "🔒 Upgrade"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PremiumModeSwitch,
        {
          mode,
          onChange: handleChange,
          disabled: switchDisabled,
          size: "md"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PremiumModeSwitch,
      {
        mode,
        onChange: handleChange,
        disabled: switchDisabled,
        size: "sm"
      }
    ),
    lockedToCod && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/plan",
        title: "Plan COD — Dropshipping via Starter ($12)+",
        className: "text-[10px] font-mono font-bold uppercase tracking-widest underline whitespace-nowrap",
        children: "🔒 COD"
      }
    ),
    !lockedToCod && !dualAllowed && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/plan",
        title: "Passe à un plan Drop pour activer les deux modes",
        className: "text-[10px] font-mono font-bold uppercase tracking-widest underline whitespace-nowrap",
        children: "🔒"
      }
    )
  ] });
}
function usePlanCodModeSync() {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const { mode, setMode, isLoading } = useActiveMode();
  const syncingRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    syncingRef.current = false;
  }, [user?.id]);
  reactExports.useEffect(() => {
    if (isLoading || sub.loading || !user?.id) return;
    if (sub.plan !== "cod") return;
    if (mode === "cod") return;
    if (syncingRef.current) return;
    syncingRef.current = true;
    void setMode("cod", { silent: true }).finally(() => {
      syncingRef.current = false;
    });
  }, [isLoading, sub.loading, sub.plan, mode, setMode, user?.id]);
}
function ImpersonationBanner() {
  const [info, setInfo] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const meta = data.user?.user_metadata ?? {};
      const admin = meta.impersonated_by;
      if (admin && data.user) setInfo({ admin, userId: data.user.id });
    });
    return () => {
      mounted = false;
    };
  }, []);
  const stop = async () => {
    if (!info) return;
    setBusy(true);
    try {
      await stopImpersonation({ data: { userId: info.userId } });
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } finally {
      setBusy(false);
    }
  };
  if (!info) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "#E05C1A",
        color: "#fff",
        padding: "10px 16px",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        position: "sticky",
        top: 0,
        zIndex: 60
      },
      children: [
        "Mode impersonation · ",
        info.admin,
        " agit sur ce compte ·",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            disabled: busy,
            onClick: stop,
            style: {
              marginLeft: 12,
              background: "#000",
              color: "#fff",
              padding: "4px 10px",
              textTransform: "uppercase",
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: "0.08em"
            },
            children: "Quitter"
          }
        )
      ]
    }
  );
}
const DISMISSED_KEY = "netodash:dismissed-announcements";
function getDismissed() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
  } catch {
    return [];
  }
}
function dismiss(id) {
  const cur = getDismissed();
  if (!cur.includes(id)) {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...cur, id]));
  }
}
const STYLES = {
  info: { bg: "#0f172a", fg: "#fff", Icon: Info },
  success: { bg: "#065f46", fg: "#fff", Icon: CircleCheck },
  warning: { bg: "#fef3c7", fg: "#7c2d12", Icon: TriangleAlert },
  critical: { bg: "#E05C1A", fg: "#fff", Icon: TriangleAlert }
};
function AnnouncementsBanner({ userPlan }) {
  const [items, setItems] = reactExports.useState([]);
  const [dismissed, setDismissed] = reactExports.useState(getDismissed);
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const { data } = await supabase.from("announcements").select("id, title, body, severity, audience, cta_label, cta_url").eq("active", true).lte("starts_at", nowIso).or(`ends_at.is.null,ends_at.gt.${nowIso}`).order("created_at", { ascending: false }).limit(5);
      if (!cancelled) setItems(data ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const isVisibleForUser = (a) => {
    if (a.audience === "all") return true;
    const plan = (userPlan ?? "free").toLowerCase();
    if (a.audience === "paying") return ["basic", "starter", "pro"].includes(plan);
    return a.audience === plan;
  };
  const visible = items.filter((a) => isVisibleForUser(a) && !dismissed.includes(a.id));
  if (visible.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: visible.map((a) => {
    const s = STYLES[a.severity];
    const Icon = s.Icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: s.bg, color: s.fg }, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: "shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: a.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-90", children: [
          " — ",
          a.body
        ] })
      ] }),
      a.cta_url && a.cta_label && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: a.cta_url,
          target: "_blank",
          rel: "noreferrer",
          className: "underline font-bold whitespace-nowrap hidden sm:inline",
          children: a.cta_label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            dismiss(a.id);
            setDismissed([...dismissed, a.id]);
          },
          className: "opacity-70 hover:opacity-100",
          "aria-label": "Fermer",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
        }
      )
    ] }) }, a.id);
  }) });
}
const Command = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = _e.displayName;
const CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children }) }) });
};
const CommandInput = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = _e.Input.displayName;
const CommandList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = _e.List.displayName;
const CommandEmpty = reactExports.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(_e.Empty, { ref, className: "py-6 text-center text-sm", ...props }));
CommandEmpty.displayName = _e.Empty.displayName;
const CommandGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = _e.Group.displayName;
const CommandSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = _e.Separator.displayName;
const CommandItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = _e.Item.displayName;
function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { mode, setMode } = useActiveMode();
  const products = useProducts(user?.id);
  const [query, setQuery] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  const productItems = reactExports.useMemo(() => (products.data ?? []).slice(0, 30), [products.data]);
  function go(path) {
    onOpenChange(false);
    navigate({ to: path });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandDialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CommandInput,
      {
        placeholder: "Rechercher une page, un produit, une action…",
        value: query,
        onValueChange: setQuery
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "Aucun résultat." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandGroup, { heading: "Actions rapides", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => go("/entries"),
            keywords: ["nouvelle", "saisie", "ajouter", "vente"],
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "＋" }),
              " Nouvelle saisie",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground font-mono", children: "N" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => go("/roas-calculator"),
            keywords: ["roas", "calculateur", "pub"],
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "⚖" }),
              " Calculateur ROAS"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            onSelect: () => {
              setMode(mode === "cod" ? "dropshipping" : "cod");
              onOpenChange(false);
            },
            keywords: ["mode", "cod", "drop", "basculer"],
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "⇄" }),
              " Basculer en mode ",
              mode === "cod" ? "Dropshipping" : "COD"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandGroup, { heading: "Navigation", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { onSelect: () => go("/dashboard"), keywords: ["dashboard", "accueil", "kpi"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "▤" }),
          " Dashboard",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground font-mono", children: "G D" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { onSelect: () => go("/products"), keywords: ["produit", "catalogue"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "◫" }),
          " Produits",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground font-mono", children: "G P" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { onSelect: () => go("/entries"), keywords: ["saisie", "ventes", "journal"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "≡" }),
          " Saisies",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground font-mono", children: "G S" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { onSelect: () => go("/analytics"), keywords: ["analytics", "stats"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "◴" }),
          " Analytics"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { onSelect: () => go("/plan"), keywords: ["plan", "abonnement", "facturation"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "💳" }),
          " Mon plan"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { onSelect: () => go("/settings"), keywords: ["paramètres", "compte", "profil"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "⚙" }),
          " Paramètres",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground font-mono", children: "G C" })
        ] })
      ] }),
      productItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommandSeparator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { heading: `Produits (${productItems.length})`, children: productItems.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CommandItem,
          {
            value: `prod-${p.id}-${p.name}`,
            onSelect: () => go("/products"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "◆" }),
              " ",
              p.name,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground uppercase", children: p.currency ?? "" })
            ]
          },
          p.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { heading: "Session", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        CommandItem,
        {
          onSelect: async () => {
            onOpenChange(false);
            await signOut();
            navigate({ to: "/" });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "→" }),
            " Déconnexion"
          ]
        }
      ) })
    ] })
  ] });
}
function MobileBottomNav({ onNewEntry }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useActiveMode();
  const path = location.pathname;
  const isActive = (p) => path === p || path.startsWith(p + "/");
  const items = [
    { to: "/dashboard", label: "Dashboard", icon: "▤" },
    { to: "/products", label: "Produits", icon: "◫" },
    { to: "/analytics", label: "Analytics", icon: "📊" },
    { to: "/settings", label: "Compte", icon: "⚙" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "nav",
    {
      "aria-label": "Navigation principale",
      className: "lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t-2 border-foreground pb-[env(safe-area-inset-bottom)]",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 items-end", children: [
        items.slice(0, 2).map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavBtn, { to: it.to, label: it.label, icon: it.icon, active: isActive(it.to) }, it.to)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center -mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              if (onNewEntry) onNewEntry();
              else navigate({ to: "/entries" });
            },
            "aria-label": "Nouvelle saisie",
            "data-mode-active": mode,
            className: "h-14 w-14 flex flex-col items-center justify-center brutal-border bg-accent text-accent-foreground font-black text-2xl shadow-[4px_4px_0_0_var(--color-foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "＋" })
          }
        ) }),
        items.slice(2).map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavBtn, { to: it.to, label: it.label, icon: it.icon, active: isActive(it.to) }, it.to))
      ] })
    }
  );
}
function NavBtn({
  to,
  label,
  icon,
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      className: `flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 text-[10px] uppercase tracking-widest font-bold ${active ? "text-foreground" : "text-muted-foreground"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-lg leading-none ${active ? "" : "opacity-60"}`, "aria-hidden": true, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: "block h-[2px] w-6 bg-accent" })
      ]
    }
  );
}
function QuickEntryFAB() {
  const navigate = useNavigate();
  const { mode } = useActiveMode();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => navigate({ to: "/entries" }),
      "aria-label": "Nouvelle saisie (raccourci : N)",
      title: "Nouvelle saisie · N",
      className: "hidden lg:flex fixed bottom-6 right-6 z-30 items-center gap-2 px-5 py-3.5 brutal-border font-black text-sm uppercase tracking-widest bg-accent text-accent-foreground shadow-[6px_6px_0_0_var(--color-foreground)] hover:shadow-[8px_8px_0_0_var(--color-foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-foreground)] transition-all",
      "data-mode-active": mode,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: "text-lg leading-none", children: "＋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Saisie" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "ml-1 px-1.5 py-0.5 text-[10px] font-mono brutal-border-thin bg-background/20 border-background/40", children: "N" })
      ]
    }
  );
}
const READ_STORAGE_KEY = "netodash:notif:read";
const DISMISS_STORAGE_KEY = "netodash:notif:dismissed";
function loadSet(key) {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (!raw) return /* @__PURE__ */ new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function saveSet(key, set) {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch {
  }
}
function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = reactExports.useState(false);
  const [readIds, setReadIds] = reactExports.useState(() => loadSet(READ_STORAGE_KEY));
  const [dismissedIds, setDismissedIds] = reactExports.useState(() => loadSet(DISMISS_STORAGE_KEY));
  const ref = reactExports.useRef(null);
  const range = reactExports.useMemo(() => dateRangeForPreset("30d"), []);
  const productsQ = useProducts(user?.id);
  const entriesQ = useEntries(user?.id, range);
  reactExports.useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);
  const notifs = reactExports.useMemo(() => {
    const list = [];
    const products = productsQ.data ?? [];
    const entries = entriesQ.data ?? [];
    if (products.length === 0) {
      list.push({
        id: "no-product",
        icon: "📦",
        title: "Crée ton premier produit",
        body: "Ajoute un produit pour démarrer le suivi de rentabilité.",
        to: "/products",
        tone: "info"
      });
      return list;
    }
    if (entries.length === 0) {
      list.push({
        id: "no-entry",
        icon: "📝",
        title: "Aucune saisie sur 30 jours",
        body: "Saisis tes commandes / pub pour voir tes KPIs.",
        to: "/entries",
        tone: "warn"
      });
    } else {
      const lastDate = entries[0].entry_date;
      const today = /* @__PURE__ */ new Date();
      const last = new Date(lastDate);
      const days = Math.floor((today.getTime() - last.getTime()) / 864e5);
      if (days >= 2) {
        list.push({
          id: "stale-entry",
          icon: "⏱",
          title: `Dernière saisie il y a ${days} jour${days > 1 ? "s" : ""}`,
          body: "Mets à jour tes chiffres pour garder un dashboard fiable.",
          to: "/entries",
          tone: "warn"
        });
      }
    }
    const recent = entries.filter((e) => {
      const d = new Date(e.entry_date);
      const diff = (Date.now() - d.getTime()) / 864e5;
      return diff <= 7;
    });
    const activeIds = new Set(recent.map((e) => e.product_id));
    const inactive = products.filter((p) => !activeIds.has(p.id));
    if (inactive.length > 0 && products.length > 1) {
      list.push({
        id: "inactive-products",
        icon: "💤",
        title: `${inactive.length} produit${inactive.length > 1 ? "s" : ""} sans données 7j`,
        body: inactive.slice(0, 3).map((p) => p.name).join(" · "),
        to: "/products",
        tone: "info"
      });
    }
    return list;
  }, [productsQ.data, entriesQ.data]);
  const visibleNotifs = reactExports.useMemo(
    () => notifs.filter((n) => !dismissedIds.has(n.id)),
    [notifs, dismissedIds]
  );
  const unreadCount = reactExports.useMemo(
    () => visibleNotifs.filter((n) => !readIds.has(n.id)).length,
    [visibleNotifs, readIds]
  );
  reactExports.useEffect(() => {
    if (!open || visibleNotifs.length === 0) return;
    setReadIds((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const n of visibleNotifs) {
        if (!next.has(n.id)) {
          next.add(n.id);
          changed = true;
        }
      }
      if (changed) saveSet(READ_STORAGE_KEY, next);
      return changed ? next : prev;
    });
  }, [open, visibleNotifs]);
  reactExports.useEffect(() => {
    const currentIds = new Set(notifs.map((n) => n.id));
    setReadIds((prev) => {
      const next = new Set(Array.from(prev).filter((id) => currentIds.has(id)));
      if (next.size !== prev.size) {
        saveSet(READ_STORAGE_KEY, next);
        return next;
      }
      return prev;
    });
    setDismissedIds((prev) => {
      const next = new Set(Array.from(prev).filter((id) => currentIds.has(id)));
      if (next.size !== prev.size) {
        saveSet(DISMISS_STORAGE_KEY, next);
        return next;
      }
      return prev;
    });
  }, [notifs]);
  const dismiss2 = reactExports.useCallback((id) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveSet(DISMISS_STORAGE_KEY, next);
      return next;
    });
  }, []);
  const clearAll = reactExports.useCallback(() => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      for (const n of notifs) next.add(n.id);
      saveSet(DISMISS_STORAGE_KEY, next);
      return next;
    });
  }, [notifs]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        "aria-label": "Notifications",
        "aria-expanded": open,
        className: `relative px-2.5 py-2 brutal-border-thin ${open ? "bg-foreground text-background border-foreground" : "border-foreground/30 hover:border-foreground"}`,
        title: "Insights & notifications",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: "🔔" }),
          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-accent text-accent-foreground text-[9px] font-black flex items-center justify-center brutal-border-thin border-foreground", children: unreadCount })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        role: "menu",
        className: "absolute right-0 top-full mt-1 w-80 brutal-border bg-background shadow-[6px_6px_0_0_hsl(var(--foreground))] z-50",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 border-b border-foreground/20 flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: [
              "Insights · ",
              visibleNotifs.length
            ] }),
            visibleNotifs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: clearAll,
                className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground",
                children: "Tout effacer"
              }
            )
          ] }),
          visibleNotifs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest", children: "✓ Tout est à jour" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-96 overflow-y-auto", children: visibleNotifs.map((n) => {
            const isRead = readIds.has(n.id);
            const tone = n.tone === "alert" ? "border-l-accent" : n.tone === "warn" ? "border-l-[#eab308]" : "border-l-foreground/30";
            const inner = /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `px-3 py-2.5 border-b border-foreground/10 border-l-4 ${tone} hover:bg-foreground/5 ${isRead ? "opacity-60" : ""}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0", children: n.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-black uppercase tracking-tight flex items-center gap-1.5", children: [
                      !isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: n.title })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-mono text-muted-foreground mt-0.5 break-words", children: n.body })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dismiss2(n.id);
                      },
                      "aria-label": "Masquer cette notification",
                      title: "Masquer",
                      className: "shrink-0 text-muted-foreground hover:text-foreground text-sm leading-none px-1",
                      children: "×"
                    }
                  )
                ] })
              }
            );
            return n.to ? /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: n.to, onClick: () => setOpen(false), className: "block", children: inner }) }, n.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: inner }, n.id);
          }) })
        ]
      }
    )
  ] });
}
const KEY = "netodash:theme";
function readStored() {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem(KEY);
  return v === "dark" ? "dark" : "light";
}
function apply(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}
function initTheme() {
  apply(readStored());
}
const listeners = /* @__PURE__ */ new Set();
function useTheme() {
  const [theme, setThemeState] = reactExports.useState(readStored());
  reactExports.useEffect(() => {
    const onChange = (t) => setThemeState(t);
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);
  function setTheme(next) {
    window.localStorage.setItem(KEY, next);
    apply(next);
    listeners.forEach((cb) => cb(next));
  }
  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }
  return { theme, setTheme, toggle };
}
function ThemeToggle({ compact = false }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  if (compact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: toggle,
        "aria-label": isDark ? "Activer le mode clair" : "Activer le mode sombre",
        title: isDark ? "Mode clair" : "Mode sombre",
        className: "px-2.5 py-2 brutal-border-thin border-foreground/30 hover:border-foreground text-base leading-none",
        children: isDark ? "☀" : "☾"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: toggle,
      className: "w-full text-left px-3 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background flex items-center justify-between",
      role: "menuitem",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isDark ? "☀ Mode clair" : "☾ Mode sombre" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono opacity-60", children: isDark ? "DARK" : "LIGHT" })
      ]
    }
  );
}
const LABELS = {
  dashboard: "Dashboard",
  products: "Produits",
  entries: "Saisies",
  analytics: "Analytics",
  plan: "Mon plan",
  settings: "Paramètres",
  "roas-calculator": "Calculateur ROAS",
  netodsh: "Admin"
};
function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1 && parts[0] === "dashboard") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      "aria-label": "Fil d'Ariane",
      className: "max-w-[1600px] mx-auto px-4 md:px-6 pt-3 text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 overflow-x-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "hover:text-foreground shrink-0", children: "⌂ Accueil" }),
        parts.map((part, i) => {
          const to = "/" + parts.slice(0, i + 1).join("/");
          const isLast = i === parts.length - 1;
          const label = LABELS[part] ?? decodeURIComponent(part);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "/" }),
            isLast ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: label }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, className: "hover:text-foreground", children: label })
          ] }, to);
        })
      ]
    }
  );
}
function isTypingTarget(el) {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (el.isContentEditable) return true;
  return false;
}
function useKeyboardShortcuts({ onOpenPalette, onNewEntry, onGoTo }) {
  const gPressedAt = reactExports.useRef(0);
  reactExports.useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenPalette?.();
        return;
      }
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === "/") {
        e.preventDefault();
        onOpenPalette?.();
        return;
      }
      if (key === "n") {
        e.preventDefault();
        onNewEntry?.();
        return;
      }
      const now = Date.now();
      if (key === "g") {
        gPressedAt.current = now;
        return;
      }
      if (now - gPressedAt.current < 1200 && gPressedAt.current > 0) {
        gPressedAt.current = 0;
        if (key === "d") onGoTo?.("/dashboard");
        else if (key === "p") onGoTo?.("/products");
        else if (key === "s") onGoTo?.("/entries");
        else if (key === "c") onGoTo?.("/settings");
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenPalette, onNewEntry, onGoTo]);
}
const STORAGE_KEY = "netodash:offline-queue:v1";
const runners = /* @__PURE__ */ new Map();
function readQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeQueue(jobs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    window.dispatchEvent(new CustomEvent("offline-queue:change"));
  } catch {
  }
}
function getQueueSize() {
  if (typeof window === "undefined") return 0;
  return readQueue().length;
}
function subscribeQueue(cb) {
  const handler = () => cb();
  window.addEventListener("offline-queue:change", handler);
  window.addEventListener("online", handler);
  window.addEventListener("offline", handler);
  return () => {
    window.removeEventListener("offline-queue:change", handler);
    window.removeEventListener("online", handler);
    window.removeEventListener("offline", handler);
  };
}
async function flushQueue() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { ok: 0, fail: 0 };
  }
  const jobs = readQueue();
  if (jobs.length === 0) return { ok: 0, fail: 0 };
  let ok = 0;
  let fail = 0;
  const remaining = [];
  for (const job of jobs) {
    const runner = runners.get(job.label);
    if (!runner) {
      remaining.push(job);
      continue;
    }
    try {
      await runner(job.payload);
      ok++;
    } catch {
      fail++;
      remaining.push(job);
    }
  }
  writeQueue(remaining);
  return { ok, fail };
}
let listenersInitialized = false;
function initOfflineQueue() {
  if (listenersInitialized || typeof window === "undefined") return;
  listenersInitialized = true;
  window.addEventListener("online", () => {
    flushQueue();
  });
  setTimeout(() => flushQueue(), 1500);
}
function AppLayout() {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const isAdminQ = useIsAdmin(user?.id);
  const isAdmin = !!isAdminQ.data;
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = reactExports.useState(false);
  const [accountOpen, setAccountOpen] = reactExports.useState(false);
  const [paletteOpen, setPaletteOpen] = reactExports.useState(false);
  const [queueSize, setQueueSize] = reactExports.useState(0);
  const accountRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    initTheme();
    initOfflineQueue();
    setQueueSize(getQueueSize());
    const unsub = subscribeQueue(() => setQueueSize(getQueueSize()));
    return unsub;
  }, []);
  useKeyboardShortcuts({
    onOpenPalette: () => setPaletteOpen(true),
    onNewEntry: () => navigate({
      to: "/entries"
    }),
    onGoTo: (path) => navigate({
      to: path
    })
  });
  reactExports.useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/auth"
      });
    }
  }, [user, loading, navigate]);
  reactExports.useEffect(() => {
    setMobileMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);
  reactExports.useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [accountOpen]);
  usePlanCodModeSync();
  const {
    mode: activeMode
  } = useActiveMode();
  reactExports.useEffect(() => {
    document.documentElement.setAttribute("data-mode", activeMode);
  }, [activeMode]);
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Chargement…" }) });
  }
  const navItems = [{
    to: "/dashboard",
    label: "Dashboard"
  }, {
    to: "/products",
    label: "Produits"
  }, {
    to: "/entries",
    label: "Saisies"
  }, {
    to: "/analytics",
    label: "Analytics",
    badge: "PRO"
  }, {
    to: "/plan",
    label: "Mon plan"
  }];
  const modeLabel = activeMode === "cod" ? "COD · FCFA" : "DROP · INTL";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImpersonationBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementsBanner, { userPlan: null }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "brutal-border-thin border-t-0 border-l-0 border-r-0 sticky top-0 bg-background z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1600px] mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 md:gap-4 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "flex items-center min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: activeMode === "dropshipping" ? "/netodash-logo-blue.png" : "/netodash-logo.png", alt: "NETODASH", width: 1650, height: 297, className: "h-7 md:h-9 w-auto object-contain shrink-0" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2 pl-3 md:pl-4 border-l border-foreground/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ModeSwitch, { variant: "desktop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xl:inline font-mono text-[10px] uppercase tracking-widest font-bold text-accent whitespace-nowrap", children: modeLabel })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-1 flex-1 justify-center", children: navItems.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const badge = "badge" in item ? item.badge : void 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, className: `px-3 py-2 text-xs uppercase tracking-widest font-bold whitespace-nowrap brutal-border-thin inline-flex items-center gap-1.5 ${active ? "bg-foreground text-background border-foreground" : "border-transparent hover:border-foreground"}`, children: [
            item.label,
            badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8px] px-1 py-px brutal-border-thin font-mono ${active ? "bg-background text-foreground border-background" : "bg-accent text-accent-foreground border-accent"}`, children: badge })
          ] }, item.to);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/roas-calculator", className: `px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin whitespace-nowrap ${location.pathname.startsWith("/roas-calculator") ? "bg-accent text-accent-foreground border-accent" : "border-foreground/30 hover:border-accent hover:text-accent"}`, title: "Calculateur ROAS", children: "⚖ ROAS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: accountRef, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAccountOpen((v) => !v), "aria-haspopup": "menu", "aria-expanded": accountOpen, className: `px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin flex items-center gap-1.5 ${accountOpen ? "bg-foreground text-background border-foreground" : "border-foreground/30 hover:border-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚙ Compte" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px]", children: "▾" })
            ] }),
            accountOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "menu", className: "absolute right-0 top-full mt-1 w-56 brutal-border bg-background shadow-[6px_6px_0_0_hsl(var(--foreground))] z-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 border-b border-foreground/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: "Connecté" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold truncate", children: user.email })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "block px-3 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background", role: "menuitem", children: "⚙ Paramètres" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: "block px-3 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background border-t border-foreground/10", role: "menuitem", children: "💳 Mon plan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-foreground/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}) }),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/netodsh", search: {
                tab: "overview"
              }, className: "block px-3 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background border-t border-foreground/10", role: "menuitem", children: "🛡 Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
                setAccountOpen(false);
                await signOut();
                navigate({
                  to: "/"
                });
              }, className: "block w-full text-left px-3 py-2.5 text-xs uppercase tracking-widest font-bold text-accent hover:bg-accent hover:text-accent-foreground border-t border-foreground/10", role: "menuitem", children: "→ Déconnexion" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMobileMenuOpen((v) => !v), "aria-label": "Menu", "aria-expanded": mobileMenuOpen, className: "lg:hidden brutal-border-thin px-3 py-2 font-black", children: mobileMenuOpen ? "✕" : "☰" })
      ] }),
      mobileMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "max-w-[1600px] mx-auto px-4 py-2 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ModeSwitch, { variant: "mobile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: `px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20 ${location.pathname.startsWith("/plan") ? "text-accent" : ""}`, children: "Mon plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/analytics", className: `px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20 flex items-center justify-between ${location.pathname.startsWith("/analytics") ? "text-accent" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📊 Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1.5 py-0.5 brutal-border-thin bg-accent text-accent-foreground border-accent font-mono", children: "PRO" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/roas-calculator", className: `px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20 ${location.pathname.startsWith("/roas-calculator") ? "text-accent" : ""}`, children: "⚖ Calculateur ROAS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20", children: "⚙ Paramètres" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-foreground/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}) }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/netodsh", search: {
          tab: "overview"
        }, className: "px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20", children: "🛡 Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          setMobileMenuOpen(false);
          await signOut();
          navigate({
            to: "/"
          });
        }, className: "px-2 py-3 text-left text-sm uppercase tracking-widest font-bold text-accent", children: "Déconnexion" })
      ] }) })
    ] }),
    !location.pathname.startsWith("/netodsh") && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileCompletionBanner, {}),
    !location.pathname.startsWith("/netodsh") && /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, {}),
    queueSize > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-foreground text-background px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-center", children: [
      "⏱ ",
      queueSize,
      " saisie",
      queueSize > 1 ? "s" : "",
      " en attente — synchro au retour du réseau"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pb-20 lg:pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RenewalReminder, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingWelcome, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppSupport, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingTour, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandPalette, { open: paletteOpen, onOpenChange: setPaletteOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuickEntryFAB, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileBottomNav, { onNewEntry: () => navigate({
      to: "/entries"
    }) })
  ] });
}
export {
  AppLayout as component
};
