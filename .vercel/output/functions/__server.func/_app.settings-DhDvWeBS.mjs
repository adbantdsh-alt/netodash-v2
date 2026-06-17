import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { u as useQueryClient } from "./_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { s as supabase } from "./_ssr/client-IbqXIlEo.mjs";
import { u as useAuth } from "./_ssr/router-CzeTO2qA.mjs";
import { c as useProfile } from "./_ssr/queries-BVXaOG3h.mjs";
import { n as normalizeDropshippingCurrency, r as readDropshippingUsdRate } from "./_ssr/dropshipping-fx-BpQqYaq9.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { u as useOnboarding } from "./_ssr/use-onboarding-3AAwMKL2.mjs";
import "./_libs/stripe.mjs";
import "./_libs/seroval.mjs";
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
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
const deleteAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input || typeof input !== "object" || !("token" in input)) {
    throw new Error("Token requis.");
  }
  const token = input.token;
  if (typeof token !== "string" || token.length < 10) {
    throw new Error("Token invalide.");
  }
  return {
    token
  };
}).handler(createSsrRpc("605045233debcf4fbca7c93f06a21eab51d31e90e5fab3208ca6233b08e8f1d1"));
const CURRENCIES = [{
  code: "EUR",
  label: "EUR — Euro (€)"
}, {
  code: "USD",
  label: "USD — Dollar ($)"
}, {
  code: "GBP",
  label: "GBP — Livre sterling (£)"
}];
function SettingsPage() {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const profileQ = useProfile(user?.id);
  const deleteAccountFn = useServerFn(deleteAccount);
  const [displayName, setDisplayName] = reactExports.useState("");
  const [currency, setCurrency] = reactExports.useState("EUR");
  const [usdRate, setUsdRate] = reactExports.useState("1");
  const [metaTax, setMetaTax] = reactExports.useState("18");
  const [autoSync, setAutoSync] = reactExports.useState(false);
  const [busyProfile, setBusyProfile] = reactExports.useState(false);
  const [newEmail, setNewEmail] = reactExports.useState("");
  const [busyEmail, setBusyEmail] = reactExports.useState(false);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [busyPassword, setBusyPassword] = reactExports.useState(false);
  const [showDelete, setShowDelete] = reactExports.useState(false);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState("");
  const [busyDelete, setBusyDelete] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (profileQ.data) {
      setDisplayName(profileQ.data.display_name ?? "");
      setCurrency(normalizeDropshippingCurrency(profileQ.data.dropshipping_currency ?? profileQ.data.currency));
      const fxRate = readDropshippingUsdRate(profileQ.data);
      setUsdRate(String(fxRate ?? (normalizeDropshippingCurrency(profileQ.data.dropshipping_currency ?? profileQ.data.currency) === "USD" ? 1 : 0.92)));
      setMetaTax(String(profileQ.data.meta_tax_pct ?? 18));
      setAutoSync(!!profileQ.data.auto_sync_enabled);
    }
  }, [profileQ.data]);
  async function saveProfile(e) {
    e.preventDefault();
    const rate = Number(usdRate);
    if (!Number.isFinite(rate) || rate <= 0) {
      return toast.error("Taux USD invalide.");
    }
    const tax = Number(metaTax);
    if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
      return toast.error("Taxe Meta : entre 0 et 100 %.");
    }
    setBusyProfile(true);
    const {
      error
    } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      display_name: displayName,
      currency,
      dropshipping_currency: currency,
      cod_currency: "XOF",
      dropshipping_usd_fx: rate,
      meta_tax_pct: tax,
      auto_sync_enabled: autoSync
    }, {
      onConflict: "id"
    });
    setBusyProfile(false);
    if (error) return toast.error(error.message);
    toast.success("Profil enregistré.");
    qc.invalidateQueries({
      queryKey: ["profile"]
    });
  }
  async function changeEmail(e) {
    e.preventDefault();
    if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
      return toast.error("Email invalide.");
    }
    setBusyEmail(true);
    const {
      error
    } = await supabase.auth.updateUser({
      email: newEmail
    });
    setBusyEmail(false);
    if (error) return toast.error(error.message);
    toast.success("Email de confirmation envoyé à la nouvelle adresse. Clique sur le lien pour valider.");
    setNewEmail("");
  }
  async function changePassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Mot de passe : 8 caractères minimum.");
    if (newPassword !== confirmPassword) return toast.error("Les mots de passe ne correspondent pas.");
    setBusyPassword(true);
    const {
      error
    } = await supabase.auth.updateUser({
      password: newPassword
    });
    setBusyPassword(false);
    if (error) return toast.error(error.message);
    toast.success("Mot de passe modifié.");
    setNewPassword("");
    setConfirmPassword("");
  }
  async function exportAll() {
    const [{
      data: products
    }, {
      data: entries
    }, {
      data: creatives
    }, {
      data: perf
    }] = await Promise.all([supabase.from("products").select("*"), supabase.from("daily_entries").select("*"), supabase.from("creatives").select("*"), supabase.from("creative_performance").select("*")]);
    const blob = new Blob([JSON.stringify({
      exported_at: (/* @__PURE__ */ new Date()).toISOString(),
      products,
      entries,
      creatives,
      perf
    }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profitcod_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export téléchargé.");
  }
  async function handleDelete() {
    if (deleteConfirm !== "SUPPRIMER") {
      return toast.error('Tape exactement "SUPPRIMER" pour confirmer.');
    }
    setBusyDelete(true);
    try {
      const {
        data: sess
      } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Session expirée. Reconnecte-toi.");
      await deleteAccountFn({
        data: {
          token
        }
      });
      toast.success("Compte supprimé.");
      await signOut();
      navigate({
        to: "/"
      });
    } catch (err) {
      toast.error(err?.message ?? "Erreur lors de la suppression.");
    } finally {
      setBusyDelete(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 md:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "MON COMPTE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "COMPTE" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border p-5 md:p-8 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black mb-5", children: "PROFIL" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: saveProfile, className: "grid gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: "Nom affiché" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: displayName, onChange: (e) => setDisplayName(e.target.value), maxLength: 100, className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block scroll-mt-24", id: "currency", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: "Devise dropshipping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: currency, onChange: (e) => setCurrency(e.target.value), className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none", children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.code, children: c.label }, c.code)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-mono", children: "S'applique uniquement au dropshipping. Le COD reste verrouillé en FCFA (XOF)." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: [
            "Taux de change USD → ",
            currency
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", value: usdRate, onChange: (e) => setUsdRate(e.target.value), className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 font-mono", children: [
            "Utilisé pour convertir le budget pub saisi en USD vers ta devise. Mets ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "1" }),
            " si tu opères en USD."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: "Taxe Meta Ads (%) — appliquée sur le budget pub" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", step: "0.01", value: metaTax, onChange: (e) => setMetaTax(e.target.value), className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-mono", children: "Charge fantôme automatiquement déduite de ta marge nette dans tous les calculs (TVA Sénégal = 18 % par défaut)." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block brutal-border-thin p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold", children: "Synchronisation automatique Shopify" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-mono max-w-md", children: 'Désactivée par défaut. Quand activée, NetoDash écrit automatiquement les commandes Shopify dans tes saisies toutes les heures (sans ton budget pub). Recommandé : laisser OFF et utiliser le bouton "Synchroniser" sur la page Saisies pour valider chaque entrée à la main.' })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: autoSync, onChange: (e) => setAutoSync(e.target.checked), className: "w-5 h-5 accent-foreground" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busyProfile, className: "brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent w-fit disabled:opacity-50", children: busyProfile ? "…" : "ENREGISTRER" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border p-8 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black mb-2", children: "EMAIL" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-1 text-muted-foreground", children: "Email actuel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm mb-5", children: user?.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: changeEmail, className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: "Nouvel email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: newEmail, onChange: (e) => setNewEmail(e.target.value), placeholder: "nouveau@email.com", className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busyEmail || !newEmail, className: "brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent w-fit disabled:opacity-50", children: busyEmail ? "…" : "MODIFIER L'EMAIL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Un lien de confirmation sera envoyé à la nouvelle adresse." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border p-8 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black mb-5", children: "MOT DE PASSE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: changePassword, className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: "Nouveau mot de passe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), minLength: 8, placeholder: "8 caractères minimum", className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: "Confirmer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), minLength: 8, className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busyPassword || !newPassword, className: "brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent w-fit disabled:opacity-50", children: busyPassword ? "…" : "CHANGER LE MOT DE PASSE" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border p-8 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black mb-2", children: "EXPORTER MES DONNÉES" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Télécharge un fichier JSON contenant tous tes produits, saisies, campagnes et performances." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: exportAll, className: "brutal-border-thin px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background", children: "Télécharger l'export" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border p-5 md:p-8 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black mb-5", children: "LÉGAL" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "grid gap-3 font-mono text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/legal/mentions", className: "flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mentions légales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "→" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/legal/cgu", className: "flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Conditions d'utilisation (CGU)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "→" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/legal/cgv", className: "flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Conditions de vente (CGV)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "→" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/legal/privacy", className: "flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Politique de confidentialité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "→" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/legal/cookies", className: "flex items-center justify-between brutal-border-thin px-4 py-3 hover:bg-foreground hover:text-background transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Politique des cookies" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "→" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border border-accent p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black mb-2 text-accent", children: "ZONE DANGER" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mb-5", children: [
        "La suppression est ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "définitive" }),
        " : produits, saisies, campagnes, performances et compte sont effacés. Pas de retour possible."
      ] }),
      !showDelete ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowDelete(true), className: "brutal-border border-accent text-accent px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:text-accent-foreground", children: "Supprimer mon compte" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2 text-accent", children: "Pour confirmer, tape exactement : SUPPRIMER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: deleteConfirm, onChange: (e) => setDeleteConfirm(e.target.value), placeholder: "SUPPRIMER", className: "w-full bg-background brutal-border-thin border-accent px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleDelete, disabled: busyDelete || deleteConfirm !== "SUPPRIMER", className: "brutal-border bg-accent text-accent-foreground border-accent px-6 py-3 font-bold uppercase tracking-wider disabled:opacity-50", children: busyDelete ? "Suppression…" : "Confirmer la suppression" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setShowDelete(false);
            setDeleteConfirm("");
          }, className: "brutal-border-thin px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background", children: "Annuler" })
        ] })
      ] })
    ] })
  ] });
}
function OnboardingSection() {
  const ob = useOnboarding();
  const nav = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brutal-border p-8 mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black mb-2", children: "GUIDE DE DÉMARRAGE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mb-4", children: [
      "Statut actuel : ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: ob.status }),
      ob.isActive ? ` (étape ${ob.step}/4)` : ""
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      ob.restart();
      nav({
        to: "/products"
      });
    }, className: "brutal-border-thin px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background", children: "Relancer le guide d'introduction" })
  ] });
}
export {
  SettingsPage as component
};
