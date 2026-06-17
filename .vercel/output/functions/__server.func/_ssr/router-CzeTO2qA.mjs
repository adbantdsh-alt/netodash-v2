import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRouteWithContext, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useLocation } from "../_libs/tanstack__react-router.mjs";
import { S as redirect, T as notFound } from "../_libs/tanstack__router-core.mjs";
import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-IbqXIlEo.mjs";
import { createClient } from "../_libs/supabase__supabase-js.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
import { n as normalizeShopDomain, s as signState, b as buildAuthorizeUrl, v as verifyShopifyHmac, a as verifyState, e as exchangeCodeForToken, p as persistConnection, r as runShopifySyncForUser } from "./shopify-sync.server-B3mu1MxO.mjs";
import { v as verifyWebhook } from "./stripe.server-D419Yq3N.mjs";
import { o as objectType, a as arrayType, b as booleanType, n as numberType, e as enumType, s as stringType, c as coerce } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/stripe.mjs";
import "events";
import "http";
import "https";
import "os";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
async function claimBetaTesterIfEligible(user) {
  if (!user?.id) return;
  const flag = user.user_metadata?.beta_tester;
  if (flag !== "1" && flag !== 1 && flag !== true) return;
  try {
    await supabase.rpc("claim_my_beta_tester");
  } catch {
  }
}
const AuthContext = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
      if (newSession?.user) {
        void claimBetaTesterIfEligible(newSession.user);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) {
        void claimBetaTesterIfEligible(data.session.user);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthContext.Provider,
    {
      value: {
        session,
        user: session?.user ?? null,
        loading,
        signOut: async () => {
          await supabase.auth.signOut();
        }
      },
      children
    }
  );
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
function WhatsAppSupport() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const [number, setNumber] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user) return;
    let mounted = true;
    supabase.from("app_settings").select("value").eq("key", "support_whatsapp").maybeSingle().then(({ data }) => {
      if (mounted && data?.value) setNumber(data.value);
    });
    return () => {
      mounted = false;
    };
  }, [user]);
  const allowed = pathname.startsWith("/plan") || pathname.startsWith("/settings");
  if (loading || !user || !number || !allowed) return null;
  const clean = number.replace(/[^0-9]/g, "");
  const href = `https://wa.me/${clean}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "Assistance WhatsApp",
      className: "fixed bottom-20 left-3 md:bottom-4 md:left-4 z-50 flex items-center gap-2 bg-[#25D366] text-white font-bold p-2.5 md:px-4 md:py-3 rounded-full shadow-lg hover:scale-105 transition-transform brutal-border-thin border-foreground opacity-80 hover:opacity-100",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", className: "w-5 h-5 fill-current", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26L3.673 19.5l3.981-1.307zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-sm", children: "Assistance" })
      ]
    }
  );
}
const appCss = "/assets/styles-Df2YgerK.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[10rem] leading-none font-black text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm uppercase tracking-widest text-muted-foreground", children: "Cette page n'existe pas." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "brutal-border bg-foreground text-background px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent",
        children: "Retour"
      }
    ) })
  ] }) });
}
const Route$N = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NETODASH — Rentabilité réelle Dropshipping & COD" },
      {
        name: "description",
        content: "Le dashboard de rentabilité 360° pour Dropshipping & COD : ROAS net, marge réelle, CPA max, taux de livraison. Shopify, Meta Ads, TikTok Ads, FCFA."
      },
      { name: "author", content: "NETODASH" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:site_name", content: "NETODASH" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "NETODASH — Rentabilité réelle Dropshipping & COD" },
      {
        property: "og:description",
        content: "Calcule ta marge réelle basée sur les commandes livrées — pas sur les commandes Shopify. ROAS net, CPA max, taux de livraison."
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NETODASH — Rentabilité réelle Dropshipping & COD" },
      {
        name: "twitter:description",
        content: "Dashboard rentabilité 360° pour Dropshipping & COD : ROAS net, marge réelle, CPA max, taux de livraison."
      },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/mV7h6YTkYxXxdYgCHLJxrtztuOF3/social-images/social-1780681419061-yrjregbh-yh.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/mV7h6YTkYxXxdYgCHLJxrtztuOF3/social-images/social-1780681419061-yrjregbh-yh.webp" },
      { name: "description", content: "NETODASH is a business intelligence SaaS app for African e-commerce merchants to calculate profitability and manage product data." },
      { property: "og:description", content: "NETODASH is a business intelligence SaaS app for African e-commerce merchants to calculate profitability and manage product data." },
      { name: "twitter:description", content: "NETODASH is a business intelligence SaaS app for African e-commerce merchants to calculate profitability and manage product data." }
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "NETODASH",
              url: "https://netodash.com",
              logo: "https://netodash.com/netodash-logo.png",
              sameAs: ["https://netodash.com"]
            },
            {
              "@type": "WebSite",
              name: "NETODASH",
              url: "https://netodash.com",
              inLanguage: "fr-FR",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://netodash.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          ]
        })
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon-netodash.png" },
      { rel: "shortcut icon", type: "image/png", href: "/favicon-netodash.png" },
      { rel: "apple-touch-icon", href: "/favicon-netodash.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "fr", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "bg-background text-foreground", children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$N.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppSupport, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Toaster,
      {
        theme: "dark",
        position: "top-right",
        toastOptions: {
          style: {
            background: "#000",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: 0,
            fontWeight: 600
          }
        }
      }
    )
  ] }) });
}
const COD_COUNTRIES = [
  {
    slug: "senegal",
    name: "Sénégal",
    flag: "🇸🇳",
    capital: "Dakar",
    currency: "FCFA (XOF)",
    population: "17,7 millions",
    zones: [
      { name: "Dakar", price: "1 500 – 2 000 FCFA" },
      { name: "Banlieue Dakar (Pikine, Guédiawaye, Rufisque)", price: "2 000 – 2 500 FCFA" },
      { name: "Thiès / Mbour", price: "2 500 – 3 500 FCFA" },
      { name: "Saint-Louis / Touba / Diourbel", price: "3 000 – 5 000 FCFA" },
      { name: "Régions éloignées (Tamba, Ziguinchor, Kédougou)", price: "5 000 – 8 000 FCFA" }
    ],
    carriers: ["Yobante Express", "Speedaf", "Jumia Logistics", "Livreurs indépendants"],
    paymentMethods: ["Cash à la livraison", "Wave (mobile money)", "Orange Money"],
    marketSize: "Le e-commerce sénégalais pèse plus de 200 millions USD/an, en croissance à 2 chiffres. Dakar concentre 60 % du pouvoir d'achat.",
    averageDeliveryRate: "55 – 70 %",
    topNiches: ["Cosmétique & beauté", "Mode féminine", "Gadgets tech", "Santé / minceur", "Accessoires automobile"],
    intro: "Le COD (Cash on Delivery) est le mode de paiement dominant au Sénégal : la confiance dans le paiement en ligne reste limitée, et les clients préfèrent payer le livreur en cash ou via Wave. Lancer du dropshipping COD à Dakar et en régions demande de piloter trois métriques critiques : taux de confirmation, taux de livraison réel, et coût livraison par zone.",
    challenges: [
      { title: "Faux numéros & abandons", text: "20 à 35 % des commandes web ne sont jamais confirmées par téléphone. Sans call center structuré, la marge fond." },
      { title: "Coût livraison hétérogène", text: "Une commande Dakar à 1 500 FCFA n'a rien à voir avec Tambacounda à 6 000 FCFA. Sans ventilation par zone, tu pilotes à l'aveugle." },
      { title: "Retours non livrés = perte sèche", text: "Le produit voyage 2 fois, tu paies l'aller + le retour, sans encaisser. C'est LA fuite n°1 du COD." }
    ],
    netodashAngle: [
      "Saisie cumulée multi-jours pour ne rien rater de tes commandes Wave & cash",
      "Zones de livraison Dakar / Banlieue / Régions avec coût unique par zone",
      "Taux de livraison RÉEL (livrées ÷ confirmées), pas le taux marketing",
      "Profit net en FCFA après produit + livraison + ads, par produit et par jour"
    ],
    faq: [
      {
        q: "Quel est le taux de livraison moyen au Sénégal en COD ?",
        a: "Entre 55 % et 70 % selon la zone et la qualité du call center. Dakar centre dépasse souvent 70 %. Les régions éloignées descendent à 45 – 55 %."
      },
      {
        q: "Combien coûte une livraison COD à Dakar ?",
        a: "1 500 à 2 500 FCFA dans Dakar et sa banlieue. Compte 3 000 à 5 000 FCFA pour Thiès, Mbour, Saint-Louis et 5 000+ pour les régions éloignées."
      },
      {
        q: "Quels moyens de paiement utiliser au Sénégal pour le COD ?",
        a: "Cash à la livraison reste majoritaire. Wave est devenu incontournable (gratuit, instantané), Orange Money en complément. Évite la CB en pré-paiement — taux de conversion faible."
      }
    ]
  },
  {
    slug: "cote-divoire",
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    capital: "Abidjan",
    currency: "FCFA (XOF)",
    population: "28,9 millions",
    zones: [
      { name: "Abidjan (Plateau, Cocody, Yopougon, Marcory)", price: "1 500 – 2 500 FCFA" },
      { name: "Banlieue Abidjan (Bingerville, Anyama)", price: "2 500 – 3 500 FCFA" },
      { name: "Bouaké / Yamoussoukro", price: "3 500 – 5 000 FCFA" },
      { name: "San Pedro / Korhogo / Daloa", price: "4 000 – 6 000 FCFA" },
      { name: "Régions Nord / Ouest", price: "5 000 – 9 000 FCFA" }
    ],
    carriers: ["Chronopost CI", "DHL", "Jumia Logistics", "Glovo", "Coursiers indépendants"],
    paymentMethods: ["Cash à la livraison", "Wave CI", "Orange Money", "MTN Mobile Money", "Moov Money"],
    marketSize: "1er marché e-commerce francophone d'Afrique de l'Ouest. Abidjan concentre la majorité du volume avec un panier moyen supérieur au Sénégal.",
    averageDeliveryRate: "60 – 75 %",
    topNiches: ["Mode & sneakers", "Cosmétique afro", "Électronique", "Santé bien-être", "Maison & déco"],
    intro: "Abidjan est le hub n°1 du COD en Afrique francophone. Marché mature, ads Meta efficaces, livreurs nombreux — mais la concurrence est rude et les CPM montent. Sans pilotage précis du coût livraison par zone et du taux de livraison, tu perds 30 % de marge en silence.",
    challenges: [
      { title: "CPM Meta en hausse", text: "Le coût d'acquisition Abidjan a doublé en 2 ans. Sans ROAS net (après frais Meta + retours), tu confonds CA et profit." },
      { title: "Zones tarifaires éclatées", text: "Cocody, Yopougon, Marcory n'ont pas le même tarif livreur. Calculer une marge moyenne sans ventiler = piloter dans le flou." },
      { title: "Mix Mobile Money complexe", text: "Wave, Orange Money, MTN, Moov — chaque flux a ses frais. Le COD reste roi mais le mix compte." }
    ],
    netodashAngle: [
      "Zones Abidjan / intérieur paramétrables avec coût par zone",
      "ROAS net Meta / TikTok après retours et taux de livraison",
      "Multi-produits jusqu'à illimité — pour les drop-shippers qui scalent plusieurs winners",
      "Marge nette en FCFA par jour, par zone, par produit"
    ],
    faq: [
      {
        q: "Quel est le taux de livraison moyen en Côte d'Ivoire en COD ?",
        a: "60 à 75 % à Abidjan avec un bon call center. 50 – 60 % en région. Le facteur n°1 : qualité de la confirmation téléphonique sous 2 h."
      },
      {
        q: "Combien coûte une livraison à Abidjan ?",
        a: "1 500 à 2 500 FCFA selon la commune. 2 500 – 3 500 pour la banlieue, jusqu'à 9 000 FCFA pour les régions éloignées."
      },
      {
        q: "Faut-il prendre un call center pour scaler en Côte d'Ivoire ?",
        a: "Au-delà de 30 commandes/jour, oui. Avant ça, tu peux confirmer toi-même via WhatsApp + appel. Netodash te montre le seuil de rentabilité call center."
      }
    ]
  },
  {
    slug: "mali",
    name: "Mali",
    flag: "🇲🇱",
    capital: "Bamako",
    currency: "FCFA (XOF)",
    population: "22,6 millions",
    zones: [
      { name: "Bamako (Hamdallaye, Hippodrome, ACI 2000)", price: "1 500 – 2 500 FCFA" },
      { name: "Banlieue Bamako (Kati, Kalaban)", price: "2 500 – 3 500 FCFA" },
      { name: "Sikasso / Ségou / Koutiala", price: "4 000 – 6 000 FCFA" },
      { name: "Mopti / Kayes / Gao", price: "6 000 – 10 000 FCFA" }
    ],
    carriers: ["Orange Money Express", "DHL Mali", "Coursiers indépendants Bamako"],
    paymentMethods: ["Cash à la livraison", "Orange Money", "Moov Money", "Wave (en expansion)"],
    marketSize: "Marché en pleine structuration. Bamako concentre l'essentiel du e-commerce francophone du pays.",
    averageDeliveryRate: "50 – 65 %",
    topNiches: ["Mode islamique", "Cosmétique naturelle", "Smartphones / accessoires", "Produits maison"],
    intro: "Le COD au Mali se construit. Bamako reste la zone rentable, les régions demandent des partenariats logistiques solides. Le mobile money (Orange Money en tête) facilite la collecte mais le cash reste dominant. Piloter le taux de livraison par zone est vital ici.",
    challenges: [
      { title: "Logistique régionale", text: "Au-delà de Bamako, peu de transporteurs structurés. Coûts élevés, délais longs, taux de livraison plus faible." },
      { title: "Pouvoir d'achat hétérogène", text: "Le panier moyen varie fortement entre Bamako et régions. Adapter le pricing par zone est crucial." }
    ],
    netodashAngle: [
      "Pilotage Bamako vs régions avec coûts livraison séparés",
      "Marge en FCFA après tous les frais cachés (Orange Money, retours)",
      "Dashboard mobile-first — utilisable sur connexion 3G"
    ],
    faq: [
      {
        q: "Le COD fonctionne-t-il bien au Mali ?",
        a: "Oui à Bamako, avec un taux de livraison de 55 – 65 %. Les régions sont plus difficiles : coûts logistiques élevés et taux plus faible."
      },
      {
        q: "Combien coûte une livraison à Bamako ?",
        a: "1 500 à 2 500 FCFA dans Bamako, 2 500 – 3 500 banlieue. Compter 4 000 – 6 000 FCFA pour Sikasso ou Ségou."
      }
    ]
  },
  {
    slug: "benin",
    name: "Bénin",
    flag: "🇧🇯",
    capital: "Cotonou",
    currency: "FCFA (XOF)",
    population: "13,7 millions",
    zones: [
      { name: "Cotonou", price: "1 500 – 2 500 FCFA" },
      { name: "Porto-Novo / Calavi", price: "2 000 – 3 000 FCFA" },
      { name: "Parakou / Bohicon", price: "4 000 – 6 000 FCFA" },
      { name: "Nord (Natitingou, Kandi)", price: "6 000 – 9 000 FCFA" }
    ],
    carriers: ["DHL Bénin", "Jumia Logistics", "Coursiers Cotonou"],
    paymentMethods: ["Cash à la livraison", "MTN Mobile Money", "Moov Money", "Celtiis Cash"],
    marketSize: "Marché compact mais dynamique, fortement urbanisé autour de Cotonou.",
    averageDeliveryRate: "55 – 70 %",
    topNiches: ["Mode féminine", "Cosmétique", "Gadgets", "Santé"],
    intro: "Cotonou est un mini-Abidjan : marché concentré, livreurs disponibles, COD dominant. MTN et Moov Money facilitent la collecte. La clé reste le taux de confirmation téléphonique et le pilotage du coût livraison réel.",
    challenges: [
      { title: "Étroitesse du marché", text: "Audience Meta vite saturée. Diversifier sur TikTok devient critique pour scaler." },
      { title: "Logistique Nord", text: "Les régions Nord (Parakou et au-delà) ont des coûts livraison qui mangent la marge si mal calibrés." }
    ],
    netodashAngle: [
      "Zones Cotonou / Sud / Nord avec tarifs distincts",
      "ROAS net Meta + TikTok cumulés",
      "Suivi du seuil de rentabilité par produit"
    ],
    faq: [
      {
        q: "Quel taux de livraison espérer au Bénin ?",
        a: "55 – 70 % à Cotonou avec une bonne confirmation. 45 – 60 % en région."
      },
      {
        q: "Combien coûte une livraison à Cotonou ?",
        a: "1 500 à 2 500 FCFA. Compter 6 000 – 9 000 FCFA pour le Nord."
      }
    ]
  },
  {
    slug: "burkina-faso",
    name: "Burkina Faso",
    flag: "🇧🇫",
    capital: "Ouagadougou",
    currency: "FCFA (XOF)",
    population: "23,3 millions",
    zones: [
      { name: "Ouagadougou", price: "1 500 – 2 500 FCFA" },
      { name: "Bobo-Dioulasso", price: "3 500 – 5 000 FCFA" },
      { name: "Koudougou / Banfora / Ouahigouya", price: "4 500 – 7 000 FCFA" }
    ],
    carriers: ["Orange Money Express BF", "DHL", "Coursiers Ouaga"],
    paymentMethods: ["Cash à la livraison", "Orange Money", "Moov Money"],
    marketSize: "Marché émergent. Ouaga + Bobo concentrent l'essentiel du COD structuré.",
    averageDeliveryRate: "50 – 65 %",
    topNiches: ["Cosmétique", "Vêtements", "Tech low-cost", "Produits ménagers"],
    intro: "Le COD au Burkina se développe autour de Ouagadougou et Bobo-Dioulasso. Le mobile money est très répandu (Orange Money domine). Les distances entre villes imposent un pilotage logistique strict.",
    challenges: [
      { title: "Distances inter-villes", text: "Ouaga – Bobo = 350 km. Les livraisons inter-villes prennent 2 – 4 jours et coûtent cher." },
      { title: "Saisonnalité", text: "Le pouvoir d'achat fluctue avec les récoltes. Adapter les ads selon les saisons est rentable." }
    ],
    netodashAngle: [
      "Ouaga vs Bobo avec coûts livraison séparés",
      "Suivi mois par mois pour repérer la saisonnalité",
      "Profit net après frais Orange Money"
    ],
    faq: [
      {
        q: "Quel taux de livraison au Burkina Faso ?",
        a: "55 – 65 % à Ouagadougou et Bobo. Plus faible hors de ces deux villes."
      }
    ]
  },
  {
    slug: "togo",
    name: "Togo",
    flag: "🇹🇬",
    capital: "Lomé",
    currency: "FCFA (XOF)",
    population: "9,1 millions",
    zones: [
      { name: "Lomé", price: "1 500 – 2 500 FCFA" },
      { name: "Banlieue Lomé (Baguida, Adidogomé)", price: "2 000 – 3 000 FCFA" },
      { name: "Kpalimé / Atakpamé", price: "3 500 – 5 000 FCFA" },
      { name: "Sokodé / Kara / Dapaong", price: "5 000 – 8 000 FCFA" }
    ],
    carriers: ["DHL Togo", "Coursiers Lomé", "Jumia"],
    paymentMethods: ["Cash à la livraison", "T-Money (Togocom)", "Flooz (Moov)", "Mixx by Yas"],
    marketSize: "Marché compact centré sur Lomé. Croissance régulière, audience facile à toucher.",
    averageDeliveryRate: "60 – 72 %",
    topNiches: ["Mode féminine", "Cosmétique", "Gadgets", "Bijoux"],
    intro: "Lomé est l'une des villes COD les plus rentables d'Afrique de l'Ouest : concentration urbaine, livreurs disponibles, taux de livraison élevé. T-Money et Flooz couvrent la collecte mobile.",
    challenges: [
      { title: "Marché vite saturé", text: "Une audience Meta peut être épuisée en 2 mois. Renouveler les angles créa est vital." },
      { title: "Confirmation prioritaire", text: "Lomé répond très bien si tu rappelles sous 1 h. Au-delà, le taux chute." }
    ],
    netodashAngle: [
      "Pilotage Lomé / régions avec coûts distincts",
      "Suivi confirmation sous 1h vs 24h",
      "ROAS net Meta"
    ],
    faq: [
      {
        q: "Quel taux de livraison à Lomé ?",
        a: "60 – 72 % avec une confirmation rapide. C'est l'une des meilleures villes COD de la sous-région."
      }
    ]
  },
  {
    slug: "guinee",
    name: "Guinée",
    flag: "🇬🇳",
    capital: "Conakry",
    currency: "Franc guinéen (GNF)",
    population: "14 millions",
    zones: [
      { name: "Conakry (Kaloum, Dixinn, Ratoma, Matam, Matoto)", price: "20 000 – 35 000 GNF" },
      { name: "Banlieue Conakry (Coyah, Dubréka)", price: "30 000 – 50 000 GNF" },
      { name: "Kindia / Boké / Mamou", price: "60 000 – 100 000 GNF" },
      { name: "Régions intérieures (Labé, Kankan, N'zérékoré)", price: "80 000 – 150 000 GNF" }
    ],
    carriers: ["DHL Conakry", "Coursiers locaux", "Orange Money Express"],
    paymentMethods: ["Cash à la livraison", "Orange Money", "MTN Mobile Money"],
    marketSize: "Marché en structuration, fortement concentré à Conakry. Forte croissance du mobile money.",
    averageDeliveryRate: "50 – 65 %",
    topNiches: ["Cosmétique", "Mode féminine", "Tech low-cost", "Santé"],
    intro: "La Guinée fonctionne en GNF (et non FCFA) — pense à paramétrer ta devise. Conakry concentre le volume. Le COD est dominant mais la logistique régionale reste coûteuse.",
    challenges: [
      { title: "Devise spécifique", text: "GNF, pas FCFA. Beaucoup d'outils ne le gèrent pas correctement." },
      { title: "Logistique fragmentée", text: "Peu de transporteurs nationaux structurés. Réseau de coursiers à monter." }
    ],
    netodashAngle: [
      "Multi-devise FCFA / GNF",
      "Zones Conakry vs régions avec coûts en GNF",
      "Profit net adapté à ton mix mobile money"
    ],
    faq: [
      {
        q: "Quel taux de livraison à Conakry ?",
        a: "55 – 65 % avec une confirmation rapide. Plus faible en région intérieure."
      }
    ]
  }
];
function getCodCountry(slug) {
  return COD_COUNTRIES.find((c) => c.slug === slug);
}
const BLOG_POSTS = [
  {
    slug: "calculer-roas-dropshipping",
    title: "Comment calculer ton ROAS réel en dropshipping (et arrêter de te mentir)",
    description: "Guide complet pour calculer ton ROAS net en dropshipping : break-even ROAS, ROAS cible, CPA max, formules et exemples chiffrés.",
    excerpt: "La majorité des dropshippers regardent le ROAS brut Meta. C'est l'erreur n°1 : il ne dit rien sur ta rentabilité. Voici comment calculer ton ROAS RÉEL.",
    category: "ROAS",
    readMin: 8,
    publishedAt: "2026-06-05",
    tags: ["roas", "dropshipping", "meta ads"],
    html: `
<h2>Le ROAS brut Meta est un mensonge</h2>
<p>Quand Meta t'affiche un ROAS de 3.5, ça veut dire : 1 € dépensé en ads = 3,50 € de chiffre d'affaires <strong>attribué</strong>. Ça ne veut PAS dire que tu gagnes 2,50 €. Voici ce qui manque :</p>
<ul>
<li>Le <strong>coût produit</strong> (achat + frais fournisseur)</li>
<li>Les <strong>frais de paiement</strong> Stripe / PayPal (2,9 % + 0,25 € en moyenne)</li>
<li>Les <strong>remboursements et litiges</strong> (5 à 15 % du CA en moyenne)</li>
<li>Les <strong>taxes pub Meta</strong> (jusqu'à 20 % en France)</li>
<li>Le <strong>delta d'attribution</strong> entre Meta et Shopify (Meta surestime de 20 à 40 %)</li>
</ul>

<h2>Les 3 ROAS à connaître</h2>

<h3>1. Break-Even ROAS (point mort)</h3>
<p>Le ROAS minimum pour ne PAS perdre d'argent. La formule :</p>
<pre><code>Break-Even ROAS = Prix de vente / Marge brute par commande</code></pre>
<p><strong>Exemple :</strong> tu vends une montre à 49 €. Coût produit + livraison + Stripe = 18 €. Marge brute = 31 €. Break-Even ROAS = 49 / 31 = <strong>1.58</strong>.</p>
<p>En dessous de 1.58 de ROAS, tu perds de l'argent.</p>

<h3>2. ROAS actuel (réel)</h3>
<pre><code>ROAS réel = (CA livré - remboursements) / (Dépense ads + taxes pub)</code></pre>
<p>C'est ce que Netodash calcule par défaut. Pas le ROAS Meta — le ROAS basé sur les commandes <strong>réellement payées et livrées</strong>.</p>

<h3>3. Target ROAS (objectif marge)</h3>
<p>Pour gagner X € de marge nette sur chaque vente :</p>
<pre><code>Target ROAS = Prix de vente / (Marge brute - X)</code></pre>
<p>Pour la montre à 49 €, viser 15 € de marge nette par commande : Target ROAS = 49 / (31 - 15) = <strong>3.06</strong>.</p>

<h2>Le CPA max — la métrique qui change tout</h2>
<p>Ton CPA max (coût par acquisition maximum) est la dépense ads MAX par commande pour rester rentable :</p>
<pre><code>CPA max = Marge brute par commande</code></pre>
<p>Sur la montre à 31 € de marge brute, ton CPA max théorique = 31 €. Au-dessus, tu perds. En réglant ton enchère Meta sur "Coût par achat = 31 €", tu protèges ta marge automatiquement.</p>

<h2>Exemple chiffré complet</h2>
<table>
<thead><tr><th>Métrique</th><th>Valeur</th></tr></thead>
<tbody>
<tr><td>Prix de vente</td><td>49 €</td></tr>
<tr><td>Coût produit + livraison</td><td>15 €</td></tr>
<tr><td>Frais Stripe (2.9 % + 0.25)</td><td>1,67 €</td></tr>
<tr><td>Marge brute par commande</td><td>32,33 €</td></tr>
<tr><td>Dépense ads (1 commande)</td><td>22 €</td></tr>
<tr><td>Taxe pub Meta (20 %)</td><td>4,40 €</td></tr>
<tr><td><strong>Marge nette réelle</strong></td><td><strong>5,93 €</strong></td></tr>
<tr><td>ROAS Meta affiché</td><td>2.23</td></tr>
<tr><td>ROAS réel Netodash</td><td>1.85</td></tr>
</tbody>
</table>
<p>Le ROAS Meta dit 2.23, mais ta vraie rentabilité est 1.85. Si tu pilotes ton budget sur le ROAS Meta, tu scales un produit qui ne te laisse que 5,93 € — soit 12 % de marge nette.</p>

<h2>Conclusion</h2>
<p>Tant que tu ne calcules pas ton ROAS réel, tu ne pilotes rien. Netodash le fait automatiquement : tu rentres tes coûts une fois, et chaque jour ton vrai ROAS s'affiche, par produit, par campagne.</p>
`
  },
  {
    slug: "taux-livraison-cod-afrique",
    title: "Taux de livraison COD en Afrique : la métrique n°1 qui décide de ta rentabilité",
    description: "Pourquoi le taux de livraison COD est plus important que le ROAS en Afrique. Benchmarks par pays (Sénégal, Côte d'Ivoire, Mali) et leviers pour l'améliorer.",
    excerpt: "En COD, une commande confirmée n'est PAS une commande livrée. Si ton taux de livraison réel est sous 60 %, ta marge est déjà morte. Voici pourquoi.",
    category: "COD",
    readMin: 7,
    publishedAt: "2026-06-05",
    tags: ["cod", "afrique", "logistique"],
    html: `
<h2>La différence entre confirmé et livré</h2>
<p>En COD (Cash on Delivery), le client paie au livreur. Ton parcours commande type :</p>
<ol>
<li>Commande web reçue (100 %)</li>
<li>Confirmée au téléphone (50 – 70 %)</li>
<li>Expédiée au livreur (90 % des confirmées)</li>
<li><strong>Réellement livrée et payée</strong> (55 – 75 % des confirmées)</li>
</ol>
<p>Le taux que tu dois piloter, c'est <strong>livrées ÷ confirmées</strong>. Pas livrées ÷ commandes web.</p>

<h2>Benchmarks par pays</h2>
<table>
<thead><tr><th>Pays</th><th>Capitale</th><th>Taux livraison moyen</th></tr></thead>
<tbody>
<tr><td>🇸🇳 Sénégal</td><td>Dakar</td><td>55 – 70 %</td></tr>
<tr><td>🇨🇮 Côte d'Ivoire</td><td>Abidjan</td><td>60 – 75 %</td></tr>
<tr><td>🇹🇬 Togo</td><td>Lomé</td><td>60 – 72 %</td></tr>
<tr><td>🇧🇯 Bénin</td><td>Cotonou</td><td>55 – 70 %</td></tr>
<tr><td>🇲🇱 Mali</td><td>Bamako</td><td>50 – 65 %</td></tr>
<tr><td>🇧🇫 Burkina Faso</td><td>Ouaga</td><td>50 – 65 %</td></tr>
<tr><td>🇬🇳 Guinée</td><td>Conakry</td><td>50 – 65 %</td></tr>
</tbody>
</table>
<p>Hors capitale, retire 10 à 15 points.</p>

<h2>Pourquoi le taux de livraison décide tout</h2>
<p>Exemple : tu vends une montre à 15 000 FCFA. Coût produit 3 500, livraison aller 2 000, retour 2 000 (si non livrée). Marge brute "théorique" : 9 500.</p>
<table>
<thead><tr><th>Taux livraison</th><th>Marge nette / 100 confirmées</th></tr></thead>
<tbody>
<tr><td>75 %</td><td><strong>+462 500 FCFA</strong></td></tr>
<tr><td>65 %</td><td>+277 500 FCFA</td></tr>
<tr><td>55 %</td><td>+92 500 FCFA</td></tr>
<tr><td>50 %</td><td><strong>0 FCFA (point mort)</strong></td></tr>
<tr><td>45 %</td><td><strong>-92 500 FCFA</strong></td></tr>
</tbody>
</table>
<p>Sous 50 %, chaque commande te coûte de l'argent. Beaucoup de drop-shippers africains scalent un produit qui PERD parce qu'ils ne calculent pas leur livré réel.</p>

<h2>Les 5 leviers pour augmenter ton taux de livraison</h2>
<ol>
<li><strong>Confirmation sous 1 h.</strong> Au-delà de 24 h, le taux chute de 15 points. Un call center ou un script WhatsApp obligatoire.</li>
<li><strong>Audio explicatif au moment de la commande.</strong> Le client comprend qu'il devra avoir l'argent à la livraison.</li>
<li><strong>Géolocalisation précise.</strong> Demande systématiquement le quartier + un point de repère. Évite "à côté de la mosquée".</li>
<li><strong>Photo produit dans la confirmation.</strong> Le client visualise, réduit les refus à la livraison.</li>
<li><strong>Choisir tes zones.</strong> Désactive les zones où ton taux passe sous 50 %. Mieux vaut 60 commandes rentables que 100 qui te brûlent.</li>
</ol>

<h2>Comment Netodash le pilote</h2>
<p>Tu rentres confirmées et livrées chaque jour. Netodash calcule automatiquement ton taux de livraison par produit et par zone — et te montre quel produit est rentable, quel produit te coule.</p>

<p><a href="/cod">→ Voir Netodash COD</a></p>
`
  },
  {
    slug: "marge-nette-dropshipping",
    title: "Marge nette en dropshipping : la vraie formule (et pourquoi 90 % se trompent)",
    description: "Calcul détaillé de la marge nette en dropshipping : produit, livraison, ads, taxes, remboursements. Exemple chiffré et erreurs courantes.",
    excerpt: "Tu fais 30 000 € de CA et tu te demandes pourquoi ton compte bancaire ne suit pas ? Tu confonds chiffre d'affaires et marge nette. Voici la vraie formule.",
    category: "Dropshipping",
    readMin: 6,
    publishedAt: "2026-06-05",
    tags: ["dropshipping", "marge", "rentabilité"],
    html: `
<h2>La vraie formule de la marge nette</h2>
<pre><code>Marge nette = CA livré
  - Coût produit total
  - Frais paiement (Stripe / PayPal)
  - Remboursements
  - Dépense ads + taxes pub
  - Frais Shopify + apps
  - Frais bancaires
</code></pre>

<h2>Les 6 coûts que tu sous-estimes</h2>
<ol>
<li><strong>Frais Stripe / PayPal :</strong> 2,9 % + 0,25 € par transaction. Sur 1 000 commandes à 50 €, c'est 1 700 € rien que là.</li>
<li><strong>Remboursements :</strong> compte 5 à 15 % du CA. Beaucoup oublient.</li>
<li><strong>Taxe pub Meta :</strong> jusqu'à 20 % en France selon ton statut.</li>
<li><strong>Apps Shopify :</strong> Klaviyo, DSers, ReConvert, etc. — vite 200 à 500 € / mois.</li>
<li><strong>Frais bancaires & change :</strong> 1 à 3 % sur les paiements internationaux.</li>
<li><strong>Sponsoring créa :</strong> UGC, vidéos. 200 – 1 000 € / mois pour scaler.</li>
</ol>

<h2>Exemple : 30 000 € de CA — combien tu touches vraiment ?</h2>
<table>
<thead><tr><th>Poste</th><th>Montant</th></tr></thead>
<tbody>
<tr><td>CA brut Shopify</td><td>30 000 €</td></tr>
<tr><td>Remboursements (10 %)</td><td>-3 000 €</td></tr>
<tr><td>CA livré</td><td>27 000 €</td></tr>
<tr><td>Coût produit (30 %)</td><td>-8 100 €</td></tr>
<tr><td>Stripe (3 %)</td><td>-810 €</td></tr>
<tr><td>Dépense ads</td><td>-12 000 €</td></tr>
<tr><td>Taxe pub (20 %)</td><td>-2 400 €</td></tr>
<tr><td>Shopify + apps</td><td>-400 €</td></tr>
<tr><td>UGC + créa</td><td>-500 €</td></tr>
<tr><td><strong>Marge nette</strong></td><td><strong>2 790 €</strong></td></tr>
</tbody>
</table>
<p>30 000 € de CA = 2 790 € de marge nette. Soit <strong>9,3 %</strong>. Beaucoup de drop-shippers se croient à 30 % parce qu'ils ne soustraient que le coût produit.</p>

<h2>Comment scaler intelligemment</h2>
<p>Au lieu de scaler le CA, scale la <strong>marge nette par produit</strong>. Le tableau Netodash classe tes produits en :</p>
<ul>
<li><strong>SCALE</strong> — marge nette &gt; 20 %</li>
<li><strong>STABLE</strong> — marge nette 10 – 20 %</li>
<li><strong>BREAK EVEN</strong> — marge nette 0 – 10 %</li>
<li><strong>KILL</strong> — marge nette &lt; 0</li>
</ul>
<p>Tu coupes les KILL, tu scales les SCALE. Simple.</p>
`
  },
  {
    slug: "cash-on-delivery-vs-prepayment-afrique",
    title: "COD vs prépaiement en Afrique : lequel choisir pour ton e-commerce ?",
    description: "Comparaison Cash on Delivery vs prépaiement en Afrique francophone : taux de conversion, marge, risques. Quel mode adopter selon ton produit.",
    excerpt: "Beaucoup veulent passer au prépaiement pour fuir le COD. Mauvaise idée dans 80 % des cas. Voici quand le COD reste imbattable — et quand il faut basculer.",
    category: "Stratégie",
    readMin: 6,
    publishedAt: "2026-06-05",
    tags: ["cod", "stratégie", "paiement"],
    html: `
<h2>Pourquoi le COD domine en Afrique francophone</h2>
<p>Trois raisons structurelles :</p>
<ol>
<li><strong>Faible bancarisation.</strong> Moins de 30 % des adultes au Sénégal ou en Côte d'Ivoire ont une carte bancaire utilisable en ligne.</li>
<li><strong>Méfiance vis-à-vis du paiement en ligne.</strong> Arnaques fréquentes = le client veut voir avant de payer.</li>
<li><strong>Habitude culturelle du cash.</strong> Même pour ceux qui ont une carte, payer cash reste rassurant.</li>
</ol>

<h2>Taux de conversion : COD vs prépaiement</h2>
<table>
<thead><tr><th>Mode</th><th>Conversion moyenne</th></tr></thead>
<tbody>
<tr><td>COD pur</td><td>2 – 5 % (visiteurs → commandes web)</td></tr>
<tr><td>Wave / Orange Money obligatoire</td><td>0,5 – 1,5 %</td></tr>
<tr><td>CB obligatoire</td><td>0,1 – 0,5 %</td></tr>
</tbody>
</table>
<p>Imposer le prépaiement divise ta conversion par 5 à 20. Sauf cas particuliers (voir plus bas).</p>

<h2>Quand passer au prépaiement (ou hybride)</h2>
<ul>
<li>Produit &gt; 30 000 FCFA — la perte sèche d'un retour devient critique.</li>
<li>Produit personnalisé ou périssable — pas de revente possible.</li>
<li>Acheteur déjà client (rebuy) — il te fait confiance.</li>
<li>Pré-vente ou crowdfunding — le client paie à l'avance accepté.</li>
</ul>

<h2>Le mode hybride qui scale</h2>
<p>L'option la plus rentable en 2026 : <strong>COD + acompte mobile money</strong>.</p>
<ul>
<li>Le client paie 2 000 – 5 000 FCFA via Wave ou Orange Money à la confirmation.</li>
<li>Le solde en cash à la livraison.</li>
<li>Résultat : taux de livraison qui passe de 60 % à 80 %+ (le client a "engagé" de l'argent, il refuse moins).</li>
</ul>

<h2>Comment piloter ça avec Netodash</h2>
<p>Tu paramètres ton flux paiement (COD pur, hybride, prépaiement) — Netodash calcule la marge nette adaptée à chaque mode et te montre lequel est le plus rentable PAR PRODUIT.</p>
<p><a href="/cod">→ Voir Netodash COD</a></p>
`
  },
  {
    slug: "cpm-meta-2026-dropshipping",
    title: "CPM Meta en 2026 : comment garder un dropshipping rentable malgré la hausse",
    description: "Le CPM Meta a doublé en 3 ans. Stratégies concrètes pour rester rentable : créa UGC, scaling vertical, audience BOFU, ROAS net.",
    excerpt: "CPM Meta à 25 €, audience saturée, concurrence agressive. Le dropshipping de 2020 est mort. Voici ce qui fonctionne en 2026 — et pourquoi le ROAS net est ton seul KPI.",
    category: "Dropshipping",
    readMin: 7,
    publishedAt: "2026-06-05",
    tags: ["meta ads", "dropshipping", "scaling"],
    html: `
<h2>Le constat : CPM x2 en 3 ans</h2>
<p>En 2023, un CPM Meta France tournait à 12 €. En 2026, on est régulièrement à 25 – 35 € sur les audiences premium. Les raisons :</p>
<ul>
<li>Saturation publicitaire (iOS 17, Meta IA).</li>
<li>Hausse des enchères (concurrence des grandes marques).</li>
<li>Audience iOS opaque depuis ATT.</li>
</ul>

<h2>Les 4 leviers qui marchent encore</h2>

<h3>1. UGC + créa native</h3>
<p>Les créa "studio" sont mortes. Le format vertical, brut, "filmé au téléphone par un vrai client" double le CTR. Compter 200 – 500 € / créa, en produire 3 nouvelles par semaine.</p>

<h3>2. Scaling vertical, pas horizontal</h3>
<p>Au lieu de dupliquer 20 ad sets, mets tout le budget sur 1 – 2 audiences qui convertissent et monte le budget par paliers de +20 % tous les 3 jours. Stop le CBO multi-adsets.</p>

<h3>3. Audience BOFU (retargeting)</h3>
<p>Le ROAS BOFU est 3 à 5x supérieur au cold. Recible :</p>
<ul>
<li>Visiteurs site 7 jours sans achat</li>
<li>Vues vidéo &gt; 50 %</li>
<li>Add-to-cart sans achat</li>
</ul>
<p>Budget BOFU = 20 – 30 % du total ads.</p>

<h3>4. Pilotage au ROAS net, pas au ROAS Meta</h3>
<p>Meta surestime de 20 à 40 %. Si tu scales sur le ROAS Meta, tu scales sur du vent. Le seul KPI fiable : <strong>ROAS net</strong> = (CA livré - remboursements) / (ads + taxes pub).</p>

<h2>Le bon ROAS cible en 2026</h2>
<table>
<thead><tr><th>Produit</th><th>ROAS net cible</th></tr></thead>
<tbody>
<tr><td>Marge brute &gt; 70 %</td><td>2.0 – 2.5</td></tr>
<tr><td>Marge brute 50 – 70 %</td><td>2.5 – 3.0</td></tr>
<tr><td>Marge brute 30 – 50 %</td><td>3.5 – 4.5</td></tr>
<tr><td>Marge brute &lt; 30 %</td><td>5.0+ (ou kill)</td></tr>
</tbody>
</table>

<h2>Conclusion</h2>
<p>Le dropshipping reste viable en 2026 — mais il ne pardonne plus l'amateurisme. Pas de pilotage du ROAS net = pas de rentabilité. Netodash te calcule ce ROAS net chaque jour, par produit, sans Excel.</p>
<p><a href="/dropshipping">→ Voir Netodash Dropshipping</a></p>
`
  }
];
function getBlogPost(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
const BASE_URL = "https://netodash.com";
const ENTRIES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/dropshipping", changefreq: "weekly", priority: "0.95" },
  { path: "/cod", changefreq: "weekly", priority: "0.95" },
  ...COD_COUNTRIES.map((c) => ({
    path: `/cod/${c.slug}`,
    changefreq: "monthly",
    priority: "0.85"
  })),
  { path: "/calculateur-roas", changefreq: "monthly", priority: "0.9" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.85" },
  ...BLOG_POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly",
    priority: "0.8"
  })),
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/legal/mentions", changefreq: "yearly", priority: "0.2" },
  { path: "/legal/cgu", changefreq: "yearly", priority: "0.2" },
  { path: "/legal/cgv", changefreq: "yearly", priority: "0.2" },
  { path: "/legal/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/legal/cookies", changefreq: "yearly", priority: "0.2" }
];
const Route$M = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const urls = ENTRIES.map(
          (e) => `  <url>
    <loc>${BASE_URL}${e.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$E = () => import("./reset-password-CUnZHBJW.mjs");
const Route$L = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{
      title: "Réinitialiser le mot de passe — NETODASH"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const $$splitComponentImporter$D = () => import("./pricing-CMTYdxxI.mjs");
const PRICING_URL = "https://netodash.com/pricing";
const PRICING_TITLE = "Tarifs — NETODASH | Dashboard rentabilité Dropshipping & COD";
const PRICING_DESC = "14 jours d'essai gratuit, sans carte. Plan COD $10, Starter $12, Pro $29, Scale $79 / mois. Paiement par carte Stripe.";
const Route$K = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: PRICING_TITLE
    }, {
      name: "description",
      content: PRICING_DESC
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large"
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:title",
      content: PRICING_TITLE
    }, {
      property: "og:description",
      content: PRICING_DESC
    }, {
      property: "og:url",
      content: PRICING_URL
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: PRICING_TITLE
    }, {
      name: "twitter:description",
      content: PRICING_DESC
    }],
    links: [{
      rel: "canonical",
      href: PRICING_URL
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: "https://netodash.com/"
        }, {
          "@type": "ListItem",
          position: 2,
          name: "Tarifs",
          item: PRICING_URL
        }]
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const shopifyLogo = "/assets/shopify-DBu3VYZb.webp";
const wooLogo = "/assets/woocommerce-D4P8YivQ.webp";
const youcanLogo = "data:image/webp;base64,UklGRsoHAABXRUJQVlA4IL4HAAAwMACdASotAakAPmEwlkekIyIhJldoKIAMCWVu4XaxEZxdiBzfxvNx8mQV3YXIv/H/rnWA+0b3Bf1Y6d3mA84X/Oeq/0C/6X1FvoH+W57Nv7hYRf/jO2P/RV5G+DKnuVf1vil0jUzHyB/T/sIdJH0eRlBtp+4AOd420/cAHO8bafuADneNtP3ABzvG2n7gA53jbT9wAc05lvciPRwhfdgwPnLp7E16UVZNbRs29v40YfsprcEG9j5jsJlicPUpN0evpfnnRxPNvACNVHkTPZgtZ3herTdX4AjHpBXWNNBQ970CvlsriF/YHHFCD9RHhX+c2K7QwKrXTESIHJ3mqT2ISRXPagk4f9CVv716IGlU5bDkvAE22XQw9cEWMo/o+IZ3jIWkE3onYeJYubdEDHzfrr+2YtEq03oLXjhCwVmSOAkfIbPs8e18ATOAYFCvmX4iCoW6DJba9GVGLE0muE48KanQCSbc8c3AQnX2r5GbafuADneNtP3ABzvG2n7gA53jbT9wAc7xtmAAAP7/3DgAAABE4AOje8vC9VtWNZLpL/OOClSTlVs/OPH90/0Qzi1+1jm9D3rAkC1mkDJlHlcseszMemOl7pEaF7Ae2/+vCj1FjY9nPbvGi9fzRZhwXfrxECeYSIFVym9NEF1I/lx6QGyhgvAhanjwcM52z98sIhk81MBGnZE8c+EZU6e5KVuvDN/RYu6Ash5Mm8mMeMrQh0ETKuL/4kumRmHgHcVsCi4T+fM/Gp6IwbODP8uqnm/MDSjYC7d50FcGDRz5jA+4ATQwKNM4ZvmRq+hfKjWMxmQDV7eJw1VvVRNn/382EZu0kE1rALlS2W+sH/TQh+dyn3y6/ZtB2aAgF1agujJgZ/wGZybOl8se2cH+s3WtT1RNLqDlpwTI8IbCJHkE8PgYaeK1bhwushgtKBCWELXb1Qa3Eyl6W/iJ4KxDDQu2laM9WzHZIwicUm5B/fe9wPsUbyJwPdYOomkDur0ah0l666+VnJxyUVdJEVcD/GO7JjH32eK3j+FwMv5yD1o/mR/DFrmV5rSOrWYQHg2ewXINhNdkzn31BJoXToNvuJdNFeE+sgHxjKyNiP3+/615CNrNmreaMD6/JgOY/u5BZMFW3LoFwfFQ1EA80IxHmd3H43cd6cq5Z0MxD4PWV2IdQpgUJG3doOt0pn4zVeY5pSqZwf8pIc1rNK46JpRpMy/ImELm9Pe7vULcX/U8ALuF1M6e3WRCQrYkj+1nhgcHs2jjLN1eLLyRx2Evx4LtKa1L3wkcvrz3v9Rxv+DQu3Pv1haQ3GBu5jukPP+8+9oWLZ4BMN0r+bvNGEZ9ls4mu5a9HnKbIBfrF+er3K7ttKZcZYCxur8bt9hl4oP7Xz/UZnmSFd9Ro5QiSy7F2lg6MeVSxkEOy2+KTUyIhq9K2wGEH325o8ZcuwdPYJBFMkp7Rw9dD5Q0qztVctMI4BD4AWjs/7BwdbZf7MONs/xI7b545YCOtjoSjcGGS2WRTmFKm/SHrKNVJ7RuCrL9/NhXlIP9H1X6pPjH5GdwbGDXeuUCmNSbBXphDnKQuGyXzY+rQuPtDHIOUJ2k36QF6g4DcolflO7Uh+02oSpWuAJPvJFGr34g8t2oU8I62cTypTvGVwhrgOMLMryY4fkD0LJatTQSIORVsFZG3uJID4PvMaxze/V1PpKjBXdUmByZHZBNTx9ACeiUZtPfSoWrHkZ0mpa8olJxJhQ+ng0bxdrSD7rn/NtpJQinsJU9iKEeFSdHo8a+yT76enCSLnfc0JyArLqHYvN0FIlYeDj/6ApuwayoUB6tSz0VHm2vVTXb+hcjtM5C8k3rLpeK6lBG6Ni+pFqxQq+LurQMwESavDHp354I/rjPCfOul0C/AhhqZRLLqv8htr/oyMCg6Jn/PbgJ+btEMh/AoTXWI0hwfagVc+8lF5NG2f/ysiBUogBkKvU99eUMqboipql+X/5D4tBA96m/q7UbObBskKpfcypk/7WxA7/KZXaTfC+X7vMSU8DAZlZGvnEQ5ot5eiFnBElwIR3D3eCb3ZHGzCwsGdhI5014/yRBUy8r6PQxUOkEfMoeyOpkxOCiLUETUbYd4Vi5CCJfmlAJco6fdfpvV41PQU8Gbh+1afBHOaBci5t4BUAvCIiUJRH3J1V4z5Jxy1/YQpnpWvkNJa+PSHlgVHva1EZv3VN5GWR6NHbZtgUmdAg9De9RRkBHF0vb+Yz6ykAq6qh57RMGPDjZHeVYW2wvL/YgZxwTEvEmAfBXmKBd29WuXtMoGOKL/es71kwo/NlPdFI3EVAOZDQb51vQEtEDHMeAOXp4xW3u4jexQwFNKqgz0NV+kg2e3ezBT4sMnbr0Y6O7pb+WALoFy0ZlK9nnotQ9vblFLB6unXp0agqBKQfJFuwwUJQf0QgvQWRtbPuN4ZadSyjl0x1T4k4YExw89rdpOoQyUWuDJnG6GV7y/tXoyqN3c05uIbJ9nCEDZI53mTWKGq6N6dnMSfqJfvIhf1v+A3cQyr109ctb5oD/7VKDSiqNStV3+78NvPiWW4t0wuF2AjQR8uvbT8n5NmTmJ17nG9qIgjluQH567XOB9myv/iYTQiE9mtip30YqzlICQDy+5IJqAWVLAAAAAAAAAAAAAA==";
const lucasPhoto = "/assets/lucas-DsHRuKn2.jpg";
const claraPhoto = "/assets/clara-BWDJNtH7.jpg";
const awaPhoto = "/assets/awa-Bv3XBWtX.jpg";
const fatouPhoto = "/assets/fatou-BSenBNgI.jpg";
const kouassiPhoto = "/assets/kouassi-BxG_v85j.jpg";
const yaoPhoto = "/assets/yao-Bdq3eK68.jpg";
const DROPSHIPPING = {
  seoTitle: "Netodash — Dashboard rentabilité dropshipping Shopify (ROAS net, marge réelle Meta Ads)",
  seoDescription: "Netodash : le dashboard de rentabilité réelle pour les dropshippers Shopify. Calcule ton ROAS net après coût produit, fulfillment, frais Stripe et taxes pub Meta / TikTok / Google.",
  heroBadge: "Built for Shopify Dropshippers",
  heroH1Line1: "TON SHOPIFY DIT $10K.",
  heroH1Line2: "COMBIEN AS-TU GARDÉ ?",
  heroSubtitle: "Netodash te montre le vrai profit derrière chaque produit, chaque pub et chaque vente —",
  heroSubtitleBold: "pour savoir exactement quoi scaler, surveiller ou couper.",
  heroCtaPrimary: "Essayer gratuitement 14 jours →",
  heroCtaSecondary: "Voir les tarifs",
  heroSmallprint: "Aucune carte bancaire requise · Plan Pro débloqué · Annule à tout moment",
  trustStats: [
    { v: "+800", l: "Dropshippers actifs" },
    { v: "$4.2M", l: "CA piloté chaque mois" },
    { v: "32 %", l: "De marge nette gagnée en moyenne" },
    { v: "4,9 / 5", l: "Note utilisateurs" }
  ],
  platformsHeading: "Compatible avec ton stack dropshipping",
  platforms: [
    { src: shopifyLogo, alt: "Shopify" },
    { src: wooLogo, alt: "WooCommerce" },
    { src: youcanLogo, alt: "YouCan" }
  ],
  pillars: [
    {
      n: "01",
      t: "MARGE NETTE RÉELLE",
      d: "CA Shopify moins pub, COGS, fulfillment, frais Stripe et refunds. Le seul chiffre qui paie ton loyer."
    },
    {
      n: "02",
      t: "ROAS NET",
      d: "Pas le ROAS gonflé de Meta. Le ratio entre ce que tu encaisses vraiment et ce que tu dépenses, toutes plateformes confondues."
    },
    {
      n: "03",
      t: "DÉCISION PAR PRODUIT",
      d: "Sache exactement quel produit te rapporte, lequel te coule, et lequel mérite d'être scalé sans hésiter."
    }
  ],
  showcaseEyebrow: "▍ L'OPERATOR CONSOLE",
  showcaseTitleHtml: {
    before: "Pilote ton Shopify ",
    accent: "comme un trader",
    after: " pilote son book."
  },
  showcaseLead: "Connecte Shopify ou saisis tes chiffres. Netodash classe tes produits par profit net et te dit, en un mot, lequel scaler, lequel surveiller, lequel couper.",
  showcaseList: [
    "Product Profit Ranking quotidien",
    "Winners / Losers en un coup d'œil",
    "Décision Scale / Watch / Kill par produit"
  ],
  beforeAfterEyebrow: "ÇA TE PARLE ?",
  beforeAfterTitle: "$12 480 DE CA SHOPIFY.",
  beforeAfterAccent: "EST-CE QUE TU GAGNES VRAIMENT DE L'ARGENT ?",
  beforeAfterBeforeBadge: "😵‍💫 Sans NETODASH",
  beforeAfterAfterBadge: "✅ Avec NETODASH",
  beforeAfterBeforeRows: [
    { k: "CA Shopify (30j)", v: "$12 480" },
    { k: "Budget Meta Ads", v: "$5 200" },
    { k: "ROAS affiché Meta", v: "2,4 ✨", mode: "accent" },
    { k: "COGS / fulfillment ?", v: "¯\\_(ツ)_/¯", mode: "accent" },
    { k: "Frais Stripe + refunds ?", v: "≈ ?", mode: "accent" },
    { k: "Marge nette réelle", v: "AUCUNE IDÉE.", mode: "accent" }
  ],
  beforeAfterAfterRows: [
    { k: "CA encaissé net", v: "$11 856" },
    { k: "− COGS + fulfillment", v: "− $3 940" },
    { k: "− Meta Ads + taxe 18%", v: "− $6 136" },
    { k: "− Stripe + refunds", v: "− $612" },
    { k: "Marge nette", v: "$1 168", mode: "accent" },
    { k: "ROAS net réel", v: "1,9", mode: "accent" }
  ],
  beforeAfterBeforeFooter: {
    plain: "Tu scales sur le ROAS Meta. Mais à la fin du mois tu regardes ton Stripe et tu te demandes : ",
    bold: "« Pourquoi je n'ai presque rien gardé ? »"
  },
  beforeAfterAfterFooter: {
    plain: "Tu sais ",
    bold: "exactement ce que tu gardes, sur quel produit, et quelle créa scaler la semaine prochaine."
  },
  beforeAfterTagline: {
    plain: "9 dropshippers sur 10 scalent sur le ROAS Meta gonflé. ",
    bold: "NETODASH te montre la vraie marge en 2 minutes par jour."
  },
  rankingEyebrow: "▍ PRODUCT PROFIT RANKING",
  rankingTitle: "QUELS PRODUITS TE FONT",
  rankingTitleAccent: "VRAIMENT GAGNER DE L'ARGENT",
  rankingLead: "Netodash classe tes produits par profit net. Chaque ligne te dit, en un mot, quoi faire aujourd'hui.",
  rankingCols: ["Produit", "Revenue", "Ad Spend", "Profit net", "Marge", "Status"],
  rankingRows: [
    { name: "Massage Gun Pro", rev: 18420, ads: 5200, profit: 6480, margin: 35.2, status: "RENTABLE" },
    { name: "Sleek LED Mirror", rev: 12380, ads: 4100, profit: 2540, margin: 20.5, status: "BREAK EVEN" },
    { name: "Posture Corrector V2", rev: 9820, ads: 3900, profit: 980, margin: 10, status: "PAS RENTABLE" },
    { name: "Aura Diffuser", rev: 7150, ads: 1820, profit: 2380, margin: 33.3, status: "RENTABLE" }
  ],
  rankingCurrencyPrefix: "$",
  rankingFooter: "→ Tu vois immédiatement où mettre ton budget pub, et où arrêter de saigner.",
  decisionEyebrow: "▍ DECISION ENGINE",
  decisionTitle: { a: "RENTABLE.", b: "BREAK EVEN.", c: "PAS RENTABLE." },
  decisionLead: "Trois statuts. Une logique hybride marge + ROAS net. Pas de débat, pas de feeling — juste la décision.",
  decisionRules: [
    {
      name: "🚀 RENTABLE",
      ruleA: "Marge > 30%",
      ruleConn: "ET",
      ruleB: "ROAS net > 2.5",
      copy: "Pousse le budget. Le produit tient la route en volume."
    },
    {
      name: "⚖ BREAK EVEN",
      ruleA: "Marge 15–30%",
      ruleConn: "OU",
      ruleB: "ROAS 1.8–2.5",
      copy: "Optimise créa, prix ou COGS avant de scaler."
    },
    {
      name: "🛑 PAS RENTABLE",
      ruleA: "Marge < 15%",
      ruleConn: "OU",
      ruleB: "ROAS < 1.8",
      copy: "Coupe ou pivote. Tu perds de l'argent à chaque vente."
    }
  ],
  testimonialsEyebrow: "▍ RÉSULTATS RÉELS",
  testimonialsTitle: "AVANT NETODASH.",
  testimonialsTitleAccent: "APRÈS NETODASH.",
  testimonialsLead: "Pas de quotes vagues. Juste des chiffres avant / après — sur les mêmes boutiques.",
  testimonials: [
    {
      photo: claraPhoto,
      name: "Clara M.",
      city: "Paris 🇫🇷",
      niche: "Beauté / skincare",
      before: { label: "ROAS net", v: "1.4" },
      after: { label: "ROAS net", v: "2.2" },
      note: "+57% en 6 semaines après avoir killé 2 produits qui maquillaient les chiffres."
    },
    {
      photo: lucasPhoto,
      name: "Lucas D.",
      city: "Lyon 🇫🇷",
      niche: "Accessoires tech",
      before: { label: "Profit / mois", v: "$2 100" },
      after: { label: "Profit / mois", v: "$5 300" },
      note: "Le ranking m'a montré que 1 produit faisait 70% de mon profit. J'ai scalé que lui."
    },
    {
      photo: awaPhoto,
      name: "Awa T.",
      city: "Dakar 🇸🇳",
      niche: "Bijoux fantaisie",
      before: { label: "Marge nette", v: "8%" },
      after: { label: "Marge nette", v: "27%" },
      note: "Le COGS et les refunds me bouffaient tout. Maintenant je sais quoi corriger."
    },
    {
      photo: kouassiPhoto,
      name: "Kouassi R.",
      city: "Abidjan 🇨🇮",
      niche: "Gadgets maison",
      before: { label: "Décisions / sem.", v: "Au feeling" },
      after: { label: "Décisions / sem.", v: "Scale / Kill" },
      note: "2 min/jour. Je sais exactement où mettre $100 de plus, ou couper."
    }
  ],
  pricingEyebrow: "▍ PRICING",
  pricingTitle: "PENSÉ POUR LES",
  pricingTitleAccent: "OPÉRATEURS SHOPIFY SÉRIEUX.",
  pricingLead: "14 jours d'essai gratuit avec accès complet. Ensuite, COD à $10/mois (COD uniquement), Starter à $12/mois (3 produits Drop + COD), Pro à $29/mois (10 produits, upsells, multi-zones), Scale à $79/mois (illimité + Analytics Pro).",
  plans: [
    {
      name: "Essai gratuit",
      price: "0 $",
      period: "/ 14 jours",
      tagline: "Accès complet 14j, sans carte bancaire",
      features: [
        "Jusqu'à 10 produits suivis",
        "Drop ET COD en parallèle",
        "Dashboard rentabilité + Analytics Pro",
        "Saisies cumulées multi-jours",
        "Aucun engagement"
      ],
      cta: "Démarrer l'essai",
      highlight: false
    },
    {
      name: "Starter",
      price: "$12",
      period: "/mois",
      tagline: "Démarrer en Drop avec le COD inclus",
      features: [
        "3 produits Dropshipping max",
        "Mode COD inclus (dashboard basique)",
        "Produits COD illimités",
        "Dashboard rentabilité complet",
        "1 zone de livraison COD",
        "Historique Drop 60 jours"
      ],
      cta: "Choisir Starter",
      highlight: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mois",
      tagline: "Valider 1 à 3 winners",
      features: [
        "10 produits actifs",
        "Dropshipping ET COD en parallèle",
        "Upsells (ventes additionnelles)",
        "Multi-zones COD avec tarifs",
        "ROAS net Meta / TikTok / Google",
        "Capture mobile colorée par mode",
        "Historique illimité · Export CSV",
        "Support email + WhatsApp"
      ],
      cta: "Choisir Pro",
      highlight: true
    },
    {
      name: "Scale",
      price: "$79",
      period: "/mois",
      tagline: "Scaler avec Analytics Pro",
      features: [
        "Produits illimités",
        "Upsells illimités",
        "Tout ce qui est inclus dans Pro",
        "Analytics Pro EXCLUSIF (scoring, waterfall, break-even, simulateur, insights)",
        "Support prioritaire WhatsApp"
      ],
      cta: "Choisir Scale",
      highlight: false
    }
  ],
  faq: [
    {
      q: "Comment fonctionne l'essai gratuit ?",
      a: "14 jours complets, sans carte bancaire, accès complet quel que soit le mode au signup. À la fin, tu choisis COD ($10), Starter, Pro ou Scale — ou tu arrêtes, sans frais."
    },
    {
      q: "C'est pour quel type d'e-commerce ?",
      a: "NETODASH gère le Dropshipping (Shopify + Meta/TikTok/Google Ads) ET le COD (Cash on Delivery). Plan COD $10 pour le COD seul, ou plans Drop (Starter/Pro/Scale) avec le COD inclus."
    },
    {
      q: "COD, Starter, Pro ou Scale ?",
      a: "COD ($10) = mode COD uniquement, produits illimités. Starter ($12) = 3 produits Drop + COD basique. Pro ($29) = 10 produits Drop, upsells, multi-zones, export CSV. Scale ($79) = Drop illimité + Analytics Pro EXCLUSIF."
    },
    {
      q: "Puis-je changer de plan ou annuler ?",
      a: "Oui, à tout moment depuis Mon plan. Tu passes de Starter à Pro/Scale (ou inversement), ou tu annules en un clic — ton accès reste actif jusqu'à la fin de la période payée."
    }
  ],
  ctaTitle: "ARRÊTE DE DEVINER.",
  ctaTitleAccent: "MESURE.",
  ctaLead: "14 jours d'essai gratuit. Aucune carte requise. Sors enfin de l'aveugle.",
  ctaButton: "Créer mon compte →",
  footerTagline: "Le dashboard de rentabilité réelle pour les dropshippers Shopify.",
  footerBaseline: "BUILT FOR SHOPIFY DROPSHIPPERS"
};
const COD = {
  seoTitle: "Netodash COD — Dashboard rentabilité Cash on Delivery (Sénégal, Côte d'Ivoire, FCFA)",
  seoDescription: "Le dashboard de rentabilité pour le COD en Afrique de l'Ouest. Suis taux de confirmation, taux de livraison, coût par zone et profit net en FCFA. Conçu pour le call center et la logistique terrain.",
  heroBadge: "Conçu pour le COD en Afrique de l'Ouest",
  heroH1Line1: "TU FAIS 100 COMMANDES/JOUR.",
  heroH1Line2: "COMBIEN SONT VRAIMENT PAYÉES ?",
  heroSubtitle: "Netodash mesure ce qui compte vraiment en COD : confirmation, livraison, coût par zone et pub —",
  heroSubtitleBold: "pour savoir exactement ce que ta boutique te rapporte en FCFA chaque jour.",
  heroCtaPrimary: "Tester gratuitement 14 jours →",
  heroCtaSecondary: "Voir les tarifs",
  heroSmallprint: "Sans carte bancaire · Plan Pro débloqué · Annule à tout moment",
  trustStats: [
    { v: "+400", l: "Vendeurs COD actifs" },
    { v: "65 %", l: "Taux de livraison moyen suivi" },
    { v: "−28 %", l: "De pertes logistiques évitées" },
    { v: "4,8 / 5", l: "Note utilisateurs Afrique" }
  ],
  platformsHeading: "Compatible avec ton stack COD (Sénégal · CI · Mali · Bénin)",
  platforms: [
    { src: shopifyLogo, alt: "Shopify" },
    { src: youcanLogo, alt: "YouCan" },
    { src: wooLogo, alt: "WooCommerce" }
  ],
  pillars: [
    {
      n: "01",
      t: "TAUX DE CONFIRMATION",
      d: "Mesure combien de commandes reçues passent vraiment au closing. Repère tes meilleures sources de leads et les agents qui convertissent le mieux."
    },
    {
      n: "02",
      t: "TAUX DE LIVRAISON",
      d: "Suis le ratio confirmées → livrées. C'est là que ton cash se gagne ou se perd. Tableau de bord clair en FCFA."
    },
    {
      n: "03",
      t: "COÛT LIVRAISON PAR ZONE",
      d: "Définis tes zones (Dakar, régions, hors-pays). Chaque livraison est imputée à sa zone : tu connais ton vrai coût logistique."
    }
  ],
  showcaseEyebrow: "▍ L'OPERATOR CONSOLE COD",
  showcaseTitleHtml: {
    before: "Pilote ton COD ",
    accent: "comme un directeur d'agence",
    after: " pilote son call center."
  },
  showcaseLead: "Saisis tes commandes reçues, confirmées, livrées par zone. Netodash calcule ton profit net en FCFA, par jour, par produit, et te dit quel canal pousser.",
  showcaseList: [
    "Taux confirmation / livraison quotidien",
    "Coût livraison ventilé par zone",
    "Profit net en FCFA, par produit"
  ],
  beforeAfterEyebrow: "ÇA TE PARLE ?",
  beforeAfterTitle: "300 COMMANDES REÇUES.",
  beforeAfterAccent: "COMBIEN SONT VRAIMENT PAYÉES À LA FIN DU MOIS ?",
  beforeAfterBeforeBadge: "😵‍💫 Sans NETODASH",
  beforeAfterAfterBadge: "✅ Avec NETODASH",
  beforeAfterBeforeRows: [
    { k: "Commandes reçues (30j)", v: "300" },
    { k: "Confirmées (closing)", v: "180" },
    { k: "Taux de livraison ?", v: "≈ 60 % ?", mode: "accent" },
    { k: "Coût livraison par zone ?", v: "¯\\_(ツ)_/¯", mode: "accent" },
    { k: "Retours non payés ?", v: "≈ ?", mode: "accent" },
    { k: "Profit net réel", v: "AUCUNE IDÉE.", mode: "accent" }
  ],
  beforeAfterAfterRows: [
    { k: "Livrées payées net", v: "168 cmd" },
    { k: "− Coût produit (livrées)", v: "− 1 260 000 F" },
    { k: "− Livraison ventilée par zone", v: "− 420 000 F" },
    { k: "− Budget pub (Meta/TikTok)", v: "− 850 000 F" },
    { k: "Profit net (FCFA)", v: "+ 720 000 F", mode: "accent" },
    { k: "Marge nette", v: "21 %", mode: "accent" }
  ],
  beforeAfterBeforeFooter: {
    plain: "Tu paies des livraisons que tu ne récupères pas, ton call center pousse fort mais ton cash en fin de mois te dit : ",
    bold: "« Où est passé l'argent ? »"
  },
  beforeAfterAfterFooter: {
    plain: "Tu sais ",
    bold: "exactement quelle zone te coûte trop cher, quel produit livre vraiment, et quel agent ferme le mieux."
  },
  beforeAfterTagline: {
    plain: "9 vendeurs COD sur 10 ne mesurent pas leur vrai profit par zone. ",
    bold: "NETODASH te le montre en FCFA, en 2 minutes par jour."
  },
  rankingEyebrow: "▍ PROFIT RANKING PAR PRODUIT",
  rankingTitle: "QUELS PRODUITS LIVRENT",
  rankingTitleAccent: "ET QUELS PRODUITS TE COÛTENT",
  rankingLead: "Netodash classe tes produits par profit net en FCFA, après livraison ventilée par zone. Chaque ligne te dit, en un mot, quoi faire aujourd'hui.",
  rankingCols: ["Produit", "Reçues", "Livrées", "Profit net (F)", "Marge", "Status"],
  rankingRows: [
    { name: "Montre Connectée Pro", rev: 180, ads: 105, profit: 124e4, margin: 28.5, status: "RENTABLE" },
    { name: "Lampe LED Décorative", rev: 120, ads: 72, profit: 54e4, margin: 18, status: "BREAK EVEN" },
    { name: "Casque Bluetooth X3", rev: 95, ads: 38, profit: 12e4, margin: 6.5, status: "PAS RENTABLE" },
    { name: "Diffuseur Parfum Auto", rev: 70, ads: 48, profit: 68e4, margin: 31.2, status: "RENTABLE" }
  ],
  rankingCurrencyPrefix: "",
  rankingFooter: "→ Tu vois immédiatement quelle zone arrêter de livrer, et quel produit pousser cette semaine.",
  decisionEyebrow: "▍ DECISION ENGINE COD",
  decisionTitle: { a: "RENTABLE.", b: "BREAK EVEN.", c: "PAS RENTABLE." },
  decisionLead: "Trois statuts. Logique hybride taux de livraison + marge nette FCFA. Pas de feeling — juste la décision.",
  decisionRules: [
    {
      name: "🚀 RENTABLE",
      ruleA: "Livraison > 60 %",
      ruleConn: "ET",
      ruleB: "Marge > 25 %",
      copy: "Pousse le budget pub. Renforce le stock et les agents closers."
    },
    {
      name: "⚖ BREAK EVEN",
      ruleA: "Livraison 45–60 %",
      ruleConn: "OU",
      ruleB: "Marge 10–25 %",
      copy: "Optimise le closing, change de transporteur, renégocie le COGS."
    },
    {
      name: "🛑 PAS RENTABLE",
      ruleA: "Livraison < 45 %",
      ruleConn: "OU",
      ruleB: "Marge < 10 %",
      copy: "Coupe le produit ou la zone. Tu finances de la logistique perdue."
    }
  ],
  testimonialsEyebrow: "▍ RÉSULTATS RÉELS · AFRIQUE DE L'OUEST",
  testimonialsTitle: "AVANT NETODASH.",
  testimonialsTitleAccent: "APRÈS NETODASH.",
  testimonialsLead: "Pas de quotes vagues. Juste des chiffres avant / après — sur les mêmes boutiques COD.",
  testimonials: [
    {
      photo: yaoPhoto,
      name: "Mamadou S.",
      city: "Dakar 🇸🇳",
      niche: "Gadgets & accessoires",
      before: { label: "Taux livraison", v: "48 %" },
      after: { label: "Taux livraison", v: "67 %" },
      note: "J'ai vu que la zone régions me coûtait 3× plus cher. J'ai recadré le transporteur et tout a changé."
    },
    {
      photo: awaPhoto,
      name: "Aïssatou D.",
      city: "Abidjan 🇨🇮",
      niche: "Beauté & cosmétique",
      before: { label: "Profit / mois", v: "320 000 F" },
      after: { label: "Profit / mois", v: "1 150 000 F" },
      note: "Je voyais 200 commandes/mois et je pensais cartonner. Le dashboard m'a montré 38 % de livraison. J'ai killé 1 produit, scalé l'autre."
    },
    {
      photo: fatouPhoto,
      name: "Fatou K.",
      city: "Bamako 🇲🇱",
      niche: "Maison & déco",
      before: { label: "Marge nette", v: "6 %" },
      after: { label: "Marge nette", v: "24 %" },
      note: "Le coût par zone, c'est ce qui m'a sauvé. Je savais pas que la zone hors-Bamako me bouffait toute ma marge."
    },
    {
      photo: kouassiPhoto,
      name: "Ousmane B.",
      city: "Dakar 🇸🇳",
      niche: "Tech & santé",
      before: { label: "Décisions / sem.", v: "Au feeling" },
      after: { label: "Décisions / sem.", v: "Scale / Kill" },
      note: "Mes 3 agents closers ont chacun leur stat de confirmation. Je sais qui pousser, qui former. Game changer."
    }
  ],
  pricingEyebrow: "▍ PRICING",
  pricingTitle: "PENSÉ POUR LES",
  pricingTitleAccent: "VENDEURS COD QUI VEULENT SCALER PROPRE.",
  pricingLead: "14 jours d'essai gratuit avec accès complet. Ensuite, Plan COD à $10/mois (COD uniquement, produits illimités), Starter à $12/mois (Drop + COD), Pro à $29/mois (upsells, multi-zones), Scale à $79/mois (Analytics Pro).",
  plans: [
    {
      name: "Essai gratuit",
      price: "0 F",
      period: "/ 14 jours",
      tagline: "Accès complet 14j, sans carte bancaire",
      features: [
        "Jusqu'à 10 produits",
        "Mode COD ET Dropshipping en parallèle",
        "Dashboard COD complet (zones, profit FCFA)",
        "Analytics Pro débloqué pendant l'essai",
        "Saisies cumulées multi-jours"
      ],
      cta: "Démarrer l'essai",
      highlight: false
    },
    {
      name: "Starter",
      price: "$12",
      period: "/mois",
      tagline: "Démarrer en Drop avec le COD inclus",
      features: [
        "3 produits Dropshipping max",
        "Mode COD inclus (dashboard basique)",
        "Produits COD illimités",
        "Dashboard COD complet (zones, profit FCFA)",
        "1 zone de livraison",
        "Historique 60 jours"
      ],
      cta: "Choisir Starter",
      highlight: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mois",
      tagline: "Piloter ton call center & 2–3 winners",
      features: [
        "10 produits actifs",
        "COD ET Dropshipping en parallèle",
        "Upsells (ventes additionnelles)",
        "Zones de livraison multi-tarifs illimitées",
        "ROAS net Meta / TikTok / Google",
        "Profit net FCFA par produit",
        "Historique illimité · Export CSV",
        "Support email + WhatsApp"
      ],
      cta: "Choisir Pro",
      highlight: true
    },
    {
      name: "Scale",
      price: "$79",
      period: "/mois",
      tagline: "Scaler avec Analytics Pro",
      features: [
        "Produits illimités",
        "Upsells illimités",
        "Tout ce qui est inclus dans Pro",
        "Analytics Pro EXCLUSIF (scoring, waterfall, break-even, simulateur, insights)",
        "Support prioritaire WhatsApp"
      ],
      cta: "Choisir Scale",
      highlight: false
    }
  ],
  faq: [
    {
      q: "Comment fonctionne l'essai gratuit ?",
      a: "14 jours complets, sans carte bancaire, accès complet quel que soit le mode au signup. À la fin, tu choisis Plan COD ($10), Starter, Pro ou Scale — ou tu arrêtes, sans frais."
    },
    {
      q: "Ça marche pour le COD en Afrique de l'Ouest ?",
      a: "Oui. NETODASH est conçu pour le COD au Sénégal, Côte d'Ivoire, Mali, Bénin, Burkina, Togo, Guinée. Devise FCFA gérée nativement, zones de livraison personnalisables par pays."
    },
    {
      q: "Comment je définis mes zones de livraison ?",
      a: "Depuis tes produits, tu définis tes zones (Dakar, régions, Thiès…). Multi-zones dès le plan Pro Drop ($29). Le plan COD $10 inclut 1 zone."
    },
    {
      q: "Faut-il connecter Shopify ?",
      a: "Pas obligatoire. Tu peux fonctionner en saisie manuelle quotidienne (idéal pour les boutiques YouCan ou formulaire). Connexion Shopify dispo en OAuth read-only si tu en as une."
    }
  ],
  ctaTitle: "ARRÊTE DE PAYER",
  ctaTitleAccent: "DES LIVRAISONS PERDUES.",
  ctaLead: "14 jours d'essai gratuit. Sans carte. Pilote enfin ton COD avec des chiffres exacts en FCFA.",
  ctaButton: "Créer mon compte →",
  footerTagline: "Le dashboard de rentabilité réelle pour le COD en Afrique de l'Ouest.",
  footerBaseline: "CONÇU POUR LE COD EN AFRIQUE DE L'OUEST · FCFA"
};
const LANDING_COPY = {
  dropshipping: DROPSHIPPING,
  cod: COD
};
const COPY$1 = LANDING_COPY.dropshipping;
const $$splitComponentImporter$C = () => import("./dropshipping-DDgtmzdr.mjs");
const URL$5 = "https://netodash.com/dropshipping";
const OG = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d66852f5-8da1-4b8f-9896-dae638808602/id-preview-45aaf504--c8da90f6-5654-47cb-a390-4f9faf5e58ee.lovable.app-1777284800740.png";
const JSONLD$3 = {
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "SoftwareApplication",
    name: "Netodash — Dropshipping",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: URL$5,
    description: COPY$1.seoDescription,
    offers: {
      "@type": "Offer",
      price: "5",
      priceCurrency: "USD",
      category: "subscription"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "127"
    }
  }, {
    "@type": "FAQPage",
    mainEntity: COPY$1.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a
      }
    }))
  }]
};
const Route$J = createFileRoute("/dropshipping")({
  head: () => ({
    meta: [{
      title: COPY$1.seoTitle
    }, {
      name: "description",
      content: COPY$1.seoDescription
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large"
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:title",
      content: COPY$1.seoTitle
    }, {
      property: "og:description",
      content: COPY$1.seoDescription
    }, {
      property: "og:url",
      content: URL$5
    }, {
      property: "og:image",
      content: OG
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: COPY$1.seoTitle
    }, {
      name: "twitter:description",
      content: COPY$1.seoDescription
    }, {
      name: "twitter:image",
      content: OG
    }],
    links: [{
      rel: "canonical",
      href: URL$5
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(JSONLD$3)
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./contact-COsRnd2Q.mjs");
const CONTACT_URL = "https://netodash.com/contact";
const CONTACT_TITLE = "Contact — NETODASH | Support Dropshipping & COD";
const CONTACT_DESC = "Une question, un retour, un partenariat ? Contacte l'équipe NETODASH par email, WhatsApp ou via le formulaire.";
const Route$I = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: CONTACT_TITLE
    }, {
      name: "description",
      content: CONTACT_DESC
    }, {
      name: "robots",
      content: "index, follow"
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:title",
      content: CONTACT_TITLE
    }, {
      property: "og:description",
      content: CONTACT_DESC
    }, {
      property: "og:url",
      content: CONTACT_URL
    }, {
      name: "twitter:card",
      content: "summary"
    }, {
      name: "twitter:title",
      content: CONTACT_TITLE
    }, {
      name: "twitter:description",
      content: CONTACT_DESC
    }],
    links: [{
      rel: "canonical",
      href: CONTACT_URL
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("./cod-BFsOu0JM.mjs");
const Route$H = createFileRoute("/cod")({
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./calculateur-roas-CPDfKiso.mjs");
const URL$4 = "https://netodash.com/calculateur-roas";
const JSONLD$2 = {
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "WebApplication",
    name: "Calculateur ROAS Gratuit — Netodash",
    url: URL$4,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Calculateur ROAS gratuit pour dropshipping, COD et e-commerce. Calcule ton Break-Even ROAS, ton ROAS actuel, ton Target ROAS et ton CPA max en quelques secondes.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR"
    }
  }, {
    "@type": "FAQPage",
    mainEntity: [{
      "@type": "Question",
      name: "Qu'est-ce que le Break-Even ROAS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le Break-Even ROAS est le ROAS minimum à atteindre pour ne ni gagner ni perdre d'argent. Formule : prix de vente ÷ (prix de vente − coût produit). En dessous, tu perds. Au-dessus, tu gagnes."
      }
    }, {
      "@type": "Question",
      name: "Qu'est-ce que le Target ROAS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le Target ROAS est le ROAS à viser pour atteindre une marge nette précise (ex : 10% du chiffre d'affaires). Il est toujours supérieur au Break-Even ROAS."
      }
    }, {
      "@type": "Question",
      name: "Comment se calcule le ROAS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ROAS = Chiffre d'affaires généré ÷ Dépense publicitaire. Un ROAS de 2x signifie que tu gagnes 2€ pour chaque 1€ dépensé en pub."
      }
    }]
  }]
};
const Route$G = createFileRoute("/calculateur-roas")({
  head: () => ({
    meta: [{
      title: "Calculateur ROAS Gratuit — Break-Even & Target ROAS | Netodash"
    }, {
      name: "description",
      content: "Calcule gratuitement ton Break-Even ROAS, ton ROAS actuel et ton CPA max. Outil simple pour dropshipping, COD, Shopify, Meta Ads, TikTok Ads."
    }, {
      name: "keywords",
      content: "calculateur ROAS, break even ROAS, target ROAS, calcul ROAS gratuit, ROAS dropshipping, ROAS COD, CPA max, calculateur publicité Meta"
    }, {
      property: "og:title",
      content: "Calculateur ROAS Gratuit — Netodash"
    }, {
      property: "og:description",
      content: "Trouve ton Break-Even ROAS, ton ROAS actuel et ton CPA max. Gratuit, sans inscription."
    }, {
      property: "og:url",
      content: URL$4
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }],
    links: [{
      rel: "canonical",
      href: URL$4
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(JSONLD$2)
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./blog-BFsOu0JM.mjs");
const Route$F = createFileRoute("/blog")({
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./auth-B90iAG69.mjs");
const searchSchema = objectType({
  mode: enumType(["login", "signup"]).optional().default("login"),
  ref: stringType().trim().toLowerCase().max(60).optional(),
  email: stringType().trim().email().max(255).optional(),
  firstName: stringType().trim().max(100).optional(),
  lastName: stringType().trim().max(100).optional(),
  beta: enumType(["1"]).optional()
});
const Route$E = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{
      title: "Connexion — NETODASH"
    }, {
      name: "description",
      content: "Connecte-toi à ton dashboard NETODASH."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitNotFoundComponentImporter$2 = () => import("../_app-BlbJccYe.mjs");
const $$splitErrorComponentImporter$2 = () => import("../_app-Dyfx7iSH.mjs");
const $$splitComponentImporter$w = () => import("../_app-kPL5i-AA.mjs");
const Route$D = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$w, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent")
});
const $$splitComponentImporter$v = () => import("../_admin-CcYHMUUT.mjs");
const Route$C = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data
    } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({
        to: "/admin/login"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./index-28-3EiRf.mjs");
const SEO_TITLE = "Calculateur ROAS Gratuit — Netodash";
const SEO_DESC = "Calcule ton Break-Even ROAS, ton ROAS actuel et ton CPA max gratuitement. Outil dropshipping, COD, Shopify, Meta Ads et TikTok Ads.";
const URL$3 = "https://netodash.com/";
const JSONLD$1 = {
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "WebApplication",
    name: "Calculateur ROAS Gratuit — Netodash",
    url: URL$3,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: SEO_DESC,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR"
    }
  }, {
    "@type": "Organization",
    name: "Netodash",
    url: URL$3,
    logo: "https://netodash.com/netodash-logo.png"
  }]
};
const Route$B = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: SEO_TITLE
    }, {
      name: "description",
      content: SEO_DESC
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large"
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:title",
      content: SEO_TITLE
    }, {
      property: "og:description",
      content: SEO_DESC
    }, {
      property: "og:url",
      content: URL$3
    }, {
      name: "keywords",
      content: "calculateur ROAS, ROAS calculator, break even ROAS, calcul ROAS gratuit, CPA max, ROAS dropshipping, ROAS COD"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: SEO_TITLE
    }, {
      name: "twitter:description",
      content: SEO_DESC
    }],
    links: [{
      rel: "canonical",
      href: URL$3
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(JSONLD$1)
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const COPY = LANDING_COPY.cod;
const $$splitComponentImporter$t = () => import("./cod.index-QWtDuXa9.mjs");
const URL$2 = "https://netodash.com/cod";
const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "SoftwareApplication",
    name: "Netodash — COD Afrique",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: URL$2,
    description: COPY.seoDescription,
    offers: {
      "@type": "Offer",
      price: "5",
      priceCurrency: "USD",
      category: "subscription"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "84"
    }
  }, {
    "@type": "FAQPage",
    mainEntity: COPY.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a
      }
    }))
  }]
};
const Route$A = createFileRoute("/cod/")({
  head: () => ({
    meta: [{
      title: COPY.seoTitle
    }, {
      name: "description",
      content: COPY.seoDescription
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large"
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:title",
      content: COPY.seoTitle
    }, {
      property: "og:description",
      content: COPY.seoDescription
    }, {
      property: "og:url",
      content: URL$2
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: COPY.seoTitle
    }, {
      name: "twitter:description",
      content: COPY.seoDescription
    }],
    links: [{
      rel: "canonical",
      href: URL$2
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(JSONLD)
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./blog.index-7xO3IZr9.mjs");
const URL$1 = "https://netodash.com/blog";
const TITLE = "Blog NETODASH — Dropshipping, COD, ROAS, marge nette";
const DESC = "Guides actionnables sur le dropshipping, le Cash on Delivery en Afrique, le calcul du ROAS net et la rentabilité réelle e-commerce.";
const Route$z = createFileRoute("/blog/")({
  head: () => ({
    meta: [{
      title: TITLE
    }, {
      name: "description",
      content: DESC
    }, {
      name: "robots",
      content: "index, follow, max-image-preview:large"
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:title",
      content: TITLE
    }, {
      property: "og:description",
      content: DESC
    }, {
      property: "og:url",
      content: URL$1
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: TITLE
    }, {
      name: "twitter:description",
      content: DESC
    }],
    links: [{
      rel: "canonical",
      href: URL$1
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Blog NETODASH",
        url: URL$1,
        inLanguage: "fr-FR",
        publisher: {
          "@type": "Organization",
          name: "NETODASH",
          logo: {
            "@type": "ImageObject",
            url: "https://netodash.com/netodash-logo.png"
          }
        },
        blogPost: BLOG_POSTS.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          description: p.description,
          datePublished: p.publishedAt,
          url: `https://netodash.com/blog/${p.slug}`
        }))
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./legal.privacy-DWdbOXsm.mjs");
const Route$y = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [{
      title: "Politique de confidentialité — NETODASH"
    }, {
      name: "description",
      content: "Politique de confidentialité de NETODASH — données collectées, finalités, droits RGPD."
    }, {
      name: "robots",
      content: "index, follow"
    }, {
      property: "og:url",
      content: "https://netodash.com/legal/privacy"
    }],
    links: [{
      rel: "canonical",
      href: "https://netodash.com/legal/privacy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./legal.mentions-8D16fd3r.mjs");
const Route$x = createFileRoute("/legal/mentions")({
  head: () => ({
    meta: [{
      title: "Mentions légales — NETODASH"
    }, {
      name: "description",
      content: "Mentions légales de NETODASH — éditeur, hébergement, propriété intellectuelle."
    }, {
      name: "robots",
      content: "index, follow"
    }, {
      property: "og:url",
      content: "https://netodash.com/legal/mentions"
    }],
    links: [{
      rel: "canonical",
      href: "https://netodash.com/legal/mentions"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
function LegalShell({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "brutal-border-thin border-t-0 border-l-0 border-r-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/netodash-logo.png", alt: "NETODASH", className: "h-9 w-auto object-contain" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-mono text-xs uppercase tracking-widest hover:text-accent", children: "← Retour" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-3xl mx-auto px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-black tracking-tighter mb-10", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5 font-mono text-sm leading-relaxed text-muted-foreground [&>h2]:text-foreground [&>h2]:font-black [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:text-base [&>h2]:mt-8 [&>h2]:mb-2", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-foreground mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 py-6 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " NETODASH"
    ] }) })
  ] });
}
const $$splitComponentImporter$p = () => import("./legal.cookies-CT5_kEbS.mjs");
const Route$w = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [{
      title: "Politique cookies — NETODASH"
    }, {
      name: "description",
      content: "Politique d'utilisation des cookies de NETODASH — cookies essentiels uniquement."
    }, {
      name: "robots",
      content: "index, follow"
    }, {
      property: "og:url",
      content: "https://netodash.com/legal/cookies"
    }],
    links: [{
      rel: "canonical",
      href: "https://netodash.com/legal/cookies"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./legal.cgv-DLmvSNjP.mjs");
const Route$v = createFileRoute("/legal/cgv")({
  head: () => ({
    meta: [{
      title: "Conditions Générales de Vente — NETODASH"
    }, {
      name: "description",
      content: "CGV de NETODASH — tarifs, paiement, essai gratuit, résiliation."
    }, {
      name: "robots",
      content: "index, follow"
    }, {
      property: "og:url",
      content: "https://netodash.com/legal/cgv"
    }],
    links: [{
      rel: "canonical",
      href: "https://netodash.com/legal/cgv"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./legal.cgu-zU9WeHbr.mjs");
const Route$u = createFileRoute("/legal/cgu")({
  head: () => ({
    meta: [{
      title: "Conditions Générales d'Utilisation — NETODASH"
    }, {
      name: "description",
      content: "CGU de NETODASH — règles d'utilisation du service SaaS de rentabilité Dropshipping & COD."
    }, {
      name: "robots",
      content: "index, follow"
    }, {
      property: "og:url",
      content: "https://netodash.com/legal/cgu"
    }],
    links: [{
      rel: "canonical",
      href: "https://netodash.com/legal/cgu"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitErrorComponentImporter$1 = () => import("./cod._country-Cu1tr4Pr.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./cod._country-BqGYMZn8.mjs");
const $$splitComponentImporter$m = () => import("./cod._country-nDnUXRff.mjs");
const Route$t = createFileRoute("/cod/$country")({
  loader: ({
    params
  }) => {
    const country = getCodCountry(params.country);
    if (!country) throw notFound();
    return {
      country
    };
  },
  head: ({
    params,
    loaderData
  }) => {
    const c = loaderData?.country;
    if (!c) return {
      meta: []
    };
    const url = `https://netodash.com/cod/${params.country}`;
    const title = `COD ${c.name} — Dropshipping Cash on Delivery ${c.capital} | NETODASH`;
    const desc = `Lancer du dropshipping COD au ${c.name} : zones de livraison, tarifs livreurs ${c.capital}, taux de livraison réel, moyens de paiement (cash, mobile money). Guide + outil de pilotage rentabilité.`;
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: desc
      }, {
        name: "robots",
        content: "index, follow, max-image-preview:large"
      }, {
        property: "og:type",
        content: "article"
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: desc
      }, {
        property: "og:url",
        content: url
      }, {
        property: "og:locale",
        content: "fr_FR"
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }, {
        name: "twitter:title",
        content: title
      }, {
        name: "twitter:description",
        content: desc
      }],
      links: [{
        rel: "canonical",
        href: url
      }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [{
            "@type": "Article",
            headline: title,
            description: desc,
            inLanguage: "fr-FR",
            mainEntityOfPage: url,
            author: {
              "@type": "Organization",
              name: "NETODASH"
            },
            publisher: {
              "@type": "Organization",
              name: "NETODASH",
              logo: {
                "@type": "ImageObject",
                url: "https://netodash.com/netodash-logo.png"
              }
            }
          }, {
            "@type": "BreadcrumbList",
            itemListElement: [{
              "@type": "ListItem",
              position: 1,
              name: "Accueil",
              item: "https://netodash.com/"
            }, {
              "@type": "ListItem",
              position: 2,
              name: "COD",
              item: "https://netodash.com/cod"
            }, {
              "@type": "ListItem",
              position: 3,
              name: c.name,
              item: url
            }]
          }, {
            "@type": "FAQPage",
            mainEntity: c.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a
              }
            }))
          }]
        })
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$m, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
const $$splitErrorComponentImporter = () => import("./blog._slug-Cu1tr4Pr.mjs");
const $$splitNotFoundComponentImporter = () => import("./blog._slug-D7iylE0_.mjs");
const $$splitComponentImporter$l = () => import("./blog._slug-CNMSFyg1.mjs");
const Route$s = createFileRoute("/blog/$slug")({
  loader: ({
    params
  }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return {
      post
    };
  },
  head: ({
    params,
    loaderData
  }) => {
    const p = loaderData?.post;
    if (!p) return {
      meta: []
    };
    const url = `https://netodash.com/blog/${params.slug}`;
    return {
      meta: [{
        title: `${p.title} — NETODASH`
      }, {
        name: "description",
        content: p.description
      }, {
        name: "robots",
        content: "index, follow, max-image-preview:large"
      }, {
        name: "article:published_time",
        content: p.publishedAt
      }, {
        property: "og:type",
        content: "article"
      }, {
        property: "og:title",
        content: p.title
      }, {
        property: "og:description",
        content: p.description
      }, {
        property: "og:url",
        content: url
      }, {
        property: "og:locale",
        content: "fr_FR"
      }, {
        property: "article:published_time",
        content: p.publishedAt
      }, {
        property: "article:section",
        content: p.category
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }, {
        name: "twitter:title",
        content: p.title
      }, {
        name: "twitter:description",
        content: p.description
      }],
      links: [{
        rel: "canonical",
        href: url
      }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [{
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.publishedAt,
            inLanguage: "fr-FR",
            mainEntityOfPage: url,
            articleSection: p.category,
            keywords: p.tags.join(", "),
            author: {
              "@type": "Organization",
              name: "NETODASH"
            },
            publisher: {
              "@type": "Organization",
              name: "NETODASH",
              logo: {
                "@type": "ImageObject",
                url: "https://netodash.com/netodash-logo.png"
              }
            }
          }, {
            "@type": "BreadcrumbList",
            itemListElement: [{
              "@type": "ListItem",
              position: 1,
              name: "Accueil",
              item: "https://netodash.com/"
            }, {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: "https://netodash.com/blog"
            }, {
              "@type": "ListItem",
              position: 3,
              name: p.title,
              item: url
            }]
          }]
        })
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$l, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const RATE_LIMITS = {
  pro: { perDay: 200, perMinute: 10 }
};
async function verifyAuth(request) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;
  const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { storage: void 0, persistSession: false, autoRefreshToken: false }
  });
  const { data, error } = await client.auth.getClaims(token);
  if (error || !data?.claims?.sub) return null;
  return data.claims.sub;
}
async function getCoachTier(userId) {
  const { data, error } = await supabaseAdmin.rpc("get_user_plan", { _uid: userId });
  if (error) {
    console.error("get_user_plan RPC failed", error);
    return null;
  }
  return data === "pro" ? "pro" : null;
}
async function countUsageSince(userId, since) {
  const { count, error } = await supabaseAdmin.from("coach_usage").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", since.toISOString());
  if (error) {
    console.error("coach_usage count failed", error);
    return 0;
  }
  return count ?? 0;
}
const dailySchema = objectType({
  date: stringType(),
  revenue: numberType(),
  adSpend: numberType(),
  netProfit: numberType(),
  roas: numberType(),
  shopifyOrders: numberType(),
  refundedOrders: numberType().optional(),
  refundedAmount: numberType().optional(),
  notes: stringType().nullable().optional()
});
const messageSchema = objectType({
  role: enumType(["user", "assistant"]),
  content: stringType().min(1).max(4e3)
});
const bodySchema = objectType({
  messages: arrayType(messageSchema).min(1).max(40),
  context: objectType({
    productName: stringType().nullable().optional(),
    currency: stringType().min(1).max(10),
    period: stringType().min(1).max(40),
    userLevel: enumType(["débutant", "opérateur"]).optional(),
    kpis: objectType({
      revenue: numberType(),
      adSpend: numberType(),
      netProfit: numberType(),
      roas: numberType(),
      shopifyOrders: numberType(),
      refundedOrders: numberType().optional(),
      refundedAmount: numberType().optional(),
      costPerOrder: numberType().optional()
    }),
    testing: objectType({
      dayIndex: numberType(),
      totalDays: numberType(),
      isComplete: booleanType()
    }).nullable().optional(),
    dailySeries: arrayType(dailySchema).max(60).optional()
  })
});
function buildSystemPrompt(ctx) {
  const series = ctx.dailySeries ?? [];
  const seriesBlock = series.length > 0 ? series.map((s, i) => {
    const note = s.notes ? ` · NOTE: ${s.notes.replace(/\s+/g, " ").slice(0, 200)}` : "";
    return `J${i + 1} (${s.date}) : pub ${Math.round(s.adSpend)} · CA ${Math.round(s.revenue)} · profit ${Math.round(s.netProfit)} · ROAS ${s.roas.toFixed(2)} · cmd ${s.shopifyOrders}${note}`;
  }).join("\n") : "(aucune série journalière)";
  const testingBlock = ctx.testing ? `Phase de testing : JOUR ${ctx.testing.dayIndex} / ${ctx.testing.totalDays}${ctx.testing.isComplete ? " (TERMINÉE)" : " (EN COURS)"}` : "Pas de fenêtre de testing active (vue agrégée tous produits).";
  const levelBlock = ctx.userLevel === "débutant" ? "L'utilisateur est DÉBUTANT — explique le pourquoi, sois pédagogique, tutoie." : "L'utilisateur est OPÉRATEUR — va droit au but, sans pédagogie superflue.";
  return `Tu es un COACH EXPERT META ADS spécialisé en DROPSHIPPING e-commerce.
Tu réponds en FRANÇAIS, direct, sans bla-bla, avec des chiffres et des actions concrètes.

CONTEXTE DE L'UTILISATEUR :
- Produit analysé : ${ctx.productName ?? "Tous produits confondus"}
- Devise : ${ctx.currency} · Période : ${ctx.period}
- ${testingBlock}
- ${levelBlock}

CHIFFRES AGRÉGÉS DE LA PÉRIODE :
- Marge nette : ${Math.round(ctx.kpis.netProfit)} ${ctx.currency}
- CA encaissé : ${Math.round(ctx.kpis.revenue)} ${ctx.currency}
- Pub : ${Math.round(ctx.kpis.adSpend)} ${ctx.currency}
- ROAS : ${ctx.kpis.roas.toFixed(2)}
- Commandes Shopify : ${ctx.kpis.shopifyOrders}${ctx.kpis.refundedOrders ? ` · Remboursées : ${ctx.kpis.refundedOrders} (${Math.round(ctx.kpis.refundedAmount ?? 0)} ${ctx.currency})` : ""}
${ctx.kpis.costPerOrder ? `- Coût/commande : ${Math.round(ctx.kpis.costPerOrder)} ${ctx.currency}` : ""}

DÉTAIL JOUR PAR JOUR :
${seriesBlock}

RÈGLES DE COACHING (CRITIQUES) :
- JAMAIS conseiller de couper sur J1 — un jour ne dit rien.
- Pour scaler : +20-30%/jour, JAMAIS doubler avant J7 (Meta replonge en apprentissage).
- Si une NOTE journalière est présente (stock retard, créa changée, promo, panne fournisseur…), TIENS-EN COMPTE explicitement dans ton analyse au lieu de traiter le jour comme un signal pur.
- ROAS > 3 stable sur 3 jours → feu vert pour scaler.
- ROAS 1.8–3 → optimiser AVANT de scaler (créa, audience, page produit).
- ROAS < 1.8 sur fin de fenêtre → couper ou pivoter angle.
- Taux de remboursement > 5% → audit qualité produit / SAV / fournisseur.

FORMAT :
- Réponds en MARKDOWN (titres, gras, listes).
- Si la question est large ("que faire ?") : 3-4 actions claires en bullets, chacune commençant par un verbe à l'impératif en MAJUSCULES.
- Si la question est précise : réponse précise et chiffrée, pas de bullets forcés.
- Cite TOUJOURS les vrais chiffres de l'utilisateur quand pertinent (pas des chiffres génériques).
- Si la question sort du dropshipping/Meta Ads/e-commerce, recadre poliment en une phrase.
- Pas d'intro ("Bonjour", "Bien sûr"), pas de conclusion ("J'espère que…"). Va droit au but.`;
}
const Route$r = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await verifyAuth(request);
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "Authentification requise." }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          );
        }
        const tier = await getCoachTier(userId);
        if (!tier) {
          return new Response(
            JSON.stringify({
              error: "Le coach IA est réservé au plan Pro. Passe à Pro depuis ta page Mon plan."
            }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
        const limits = RATE_LIMITS[tier];
        const now = /* @__PURE__ */ new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
        const minuteAgo = new Date(now.getTime() - 60 * 1e3);
        const [dayCount, minuteCount] = await Promise.all([
          countUsageSince(userId, dayAgo),
          countUsageSince(userId, minuteAgo)
        ]);
        if (dayCount >= limits.perDay) {
          return new Response(
            JSON.stringify({
              error: `Limite quotidienne atteinte (${limits.perDay} questions/jour). Réessaie demain.`
            }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }
        if (minuteCount >= limits.perMinute) {
          return new Response(
            JSON.stringify({
              error: `Trop de questions en peu de temps (${limits.perMinute}/min). Patiente quelques secondes.`
            }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }
        await supabaseAdmin.from("coach_usage").insert({ user_id: userId }).then(({ error }) => {
          if (error) console.error("coach_usage insert failed", error);
        });
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "Service IA non configuré (OPENAI_API_KEY manquant)." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        const model = process.env.COACH_MODEL || "gpt-4o-mini";
        let parsed;
        try {
          const json = await request.json();
          parsed = bodySchema.parse(json);
        } catch {
          return new Response(
            JSON.stringify({ error: "Requête invalide." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        const systemPrompt = buildSystemPrompt(parsed.context);
        let upstream;
        try {
          upstream = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model,
              stream: true,
              messages: [
                { role: "system", content: systemPrompt },
                ...parsed.messages
              ]
            })
          });
        } catch (e) {
          console.error("Coach upstream fetch failed", e);
          return new Response(
            JSON.stringify({ error: "Le coach IA est injoignable." }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }
        if (upstream.status === 429) {
          return new Response(
            JSON.stringify({
              error: "Trop de questions au coach en peu de temps. Réessaie dans 1 minute."
            }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }
        if (upstream.status === 401 || upstream.status === 403) {
          return new Response(
            JSON.stringify({ error: "Clé OpenAI invalide ou crédits épuisés." }),
            { status: 402, headers: { "Content-Type": "application/json" } }
          );
        }
        if (!upstream.ok || !upstream.body) {
          const t = await upstream.text().catch(() => "");
          console.error("Coach upstream error", upstream.status, t);
          return new Response(
            JSON.stringify({ error: "Le coach IA n'a pas répondu." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$k = () => import("./affilie._code-BTU5dmpx.mjs");
const Route$q = createFileRoute("/affilie/$code")({
  beforeLoad: ({
    params
  }) => {
    throw redirect({
      to: "/auth",
      search: {
        mode: "signup",
        ref: params.code
      }
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./admin.login-CUxVc6yB.mjs");
const Route$p = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Admin · Netodash"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("../_app.settings-DhDvWeBS.mjs");
const Route$o = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [{
      title: "Compte — NETODASH"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("../_app.roas-calculator-DX8WP-96.mjs");
const Route$n = createFileRoute("/_app/roas-calculator")({
  head: () => ({
    meta: [{
      title: "ROAS Calculator — NETODASH"
    }, {
      name: "description",
      content: "Calcule ton ROAS, ta marge nette et ton point mort en quelques secondes. Outil pour e-commerçants et dropshippers."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("../_app.products-WEA_5lWd.mjs");
const Route$m = createFileRoute("/_app/products")({
  head: () => ({
    meta: [{
      title: "Produits — NETODASH"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("../_app.plan-CETH-Dei.mjs");
const Route$l = createFileRoute("/_app/plan")({
  head: () => ({
    meta: [{
      title: "Mon plan — NETODASH"
    }]
  }),
  validateSearch: (search) => ({
    payment: search.payment === "success" || search.payment === "cancel" ? search.payment : void 0,
    ref: typeof search.ref === "string" ? search.ref : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("../_app.netodsh-DrsYt8Zr.mjs");
const VALID_TABS = ["overview", "users", "payments", "affiliates", "settings"];
const Route$k = createFileRoute("/_app/netodsh")({
  head: () => ({
    meta: [{
      title: "Admin — NETODASH"
    }]
  }),
  validateSearch: (s) => ({
    tab: VALID_TABS.includes(s.tab) ? s.tab : "overview"
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("../_app.entries-cMGEY2KU.mjs");
const Route$j = createFileRoute("/_app/entries")({
  head: () => ({
    meta: [{
      title: "Saisies quotidiennes — NETODASH"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("../_app.dashboard-DyT1y4Ow.mjs");
const dashboardSearchSchema = objectType({
  from: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: stringType().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  product: stringType().uuid().optional(),
  highlight: coerce.number().optional()
});
const Route$i = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — NETODASH"
    }]
  }),
  validateSearch: dashboardSearchSchema,
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("../_app.analytics-C_GIWhNG.mjs");
const Route$h = createFileRoute("/_app/analytics")({
  head: () => ({
    meta: [{
      title: "Analytics Pro — NETODASH"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("../_admin.admin-CQo8BHmX.mjs");
const Route$g = createFileRoute("/_admin/admin")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const UNITECH_BASE_URL = "https://api.unitech.sn/api.php";
const PLAN_PRICING = {
  basic: { amountXof: 7200, amountUsd: 12, label: "Basic" },
  starter: { amountXof: 17400, amountUsd: 29, label: "Pro" },
  pro: { amountXof: 47400, amountUsd: 79, label: "Premium" }
};
function getApiKey() {
  const key = process.env.UNITECH_API_KEY;
  if (!key) throw new Error("UNITECH_API_KEY is not configured");
  return key;
}
async function unitechVerifyPayment(reference) {
  const res = await fetch(
    `${UNITECH_BASE_URL}?action=check_payment&reference=${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${getApiKey()}` }
    }
  );
  const json = await res.json().catch(() => ({}));
  return {
    success: !!json.success,
    status: json.data?.status,
    amount: json.data?.amount,
    raw: json
  };
}
const Route$f = createFileRoute("/api/public/unitech-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const reference = payload?.reference;
        const event = payload?.event;
        if (!reference) {
          return new Response("Missing reference", { status: 400 });
        }
        const { data: paymentRow, error: fetchError } = await supabaseAdmin.from("payments").select("id, user_id, plan, status, amount").eq("reference", reference).maybeSingle();
        if (fetchError || !paymentRow) {
          return new Response("Unknown reference", { status: 200 });
        }
        if (paymentRow.status === "completed") {
          return new Response("Already processed", { status: 200 });
        }
        const verification = await unitechVerifyPayment(reference);
        const isSuccess = event === "payment_success" && verification.success && (verification.status === "completed" || verification.status === "success");
        const isFailure = event === "payment_failed" || event === "payment_expired" || verification.success && verification.status && ["failed", "expired", "cancelled", "canceled"].includes(verification.status);
        if (isSuccess) {
          const plan = paymentRow.plan;
          const expected = PLAN_PRICING[plan]?.amountXof;
          if (expected && verification.amount && verification.amount < expected) {
            await supabaseAdmin.from("payments").update({
              status: "failed",
              raw_payload: { error: "amount_mismatch", payload, verification: verification.raw }
            }).eq("id", paymentRow.id);
            return new Response("Amount mismatch", { status: 200 });
          }
          const now = /* @__PURE__ */ new Date();
          const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
          const { error: subError } = await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: paymentRow.user_id,
              plan,
              status: "active",
              trial_ends_at: now.toISOString(),
              current_period_end: periodEnd.toISOString(),
              cancel_at_period_end: false
            },
            { onConflict: "user_id" }
          );
          if (subError) {
            console.error("subscription upsert failed", subError);
            return new Response("DB error", { status: 500 });
          }
          await supabaseAdmin.from("payments").update({
            status: "completed",
            paid_at: now.toISOString(),
            external_transaction_id: payload?.transaction_id ?? payload?.external_id ?? null,
            raw_payload: { payload, verification: verification.raw }
          }).eq("id", paymentRow.id);
          return new Response("ok", { status: 200 });
        }
        if (isFailure) {
          await supabaseAdmin.from("payments").update({
            status: "failed",
            raw_payload: { payload, verification: verification.raw }
          }).eq("id", paymentRow.id);
          return new Response("ok", { status: 200 });
        }
        return new Response("ignored", { status: 200 });
      }
    }
  }
});
const ALLOWED_EVENTS = /* @__PURE__ */ new Set(["open", "capture", "cta_click", "recalc"]);
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
const Route$e = createFileRoute("/api/public/extension-track")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders() }),
      POST: async ({ request }) => {
        let body;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ ok: false, reason: "invalid_json" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders() }
          });
        }
        const clientId = String(body.clientId ?? body.client_id ?? "").trim();
        const eventType = String(body.event ?? body.event_type ?? "").trim().toLowerCase();
        const version = String(body.version ?? body.extension_version ?? "").trim() || null;
        if (clientId.length < 8 || clientId.length > 128 || !ALLOWED_EVENTS.has(eventType)) {
          return new Response(JSON.stringify({ ok: false, reason: "invalid_payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders() }
          });
        }
        const { data, error } = await supabaseAdmin.rpc("track_extension_event", {
          p_client_id: clientId,
          p_event_type: eventType,
          p_extension_version: version,
          p_meta: {}
        });
        if (error) {
          console.error("[extension-track]", error.message);
          return new Response(JSON.stringify({ ok: false }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders() }
          });
        }
        return new Response(JSON.stringify(data ?? { ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
      }
    }
  }
});
const $$splitComponentImporter$9 = () => import("../_admin.admin.users-H6IaGrnn.mjs");
const Route$d = createFileRoute("/_admin/admin/users")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("../_admin.admin.settings-B71WzOuR.mjs");
const Route$c = createFileRoute("/_admin/admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("../_admin.admin.security-CyJ5_Fu6.mjs");
const Route$b = createFileRoute("/_admin/admin/security")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("../_admin.admin.revenue-ByYlVqkn.mjs");
const Route$a = createFileRoute("/_admin/admin/revenue")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("../_admin.admin.extension-CESAiGGi.mjs");
const Route$9 = createFileRoute("/_admin/admin/extension")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("../_admin.admin.export-CCy4PnzT.mjs");
const Route$8 = createFileRoute("/_admin/admin/export")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_admin.admin.communication-SWG-8iCk.mjs");
const Route$7 = createFileRoute("/_admin/admin/communication")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("../_admin.admin.beta-testers-D8kD3EXs.mjs");
const Route$6 = createFileRoute("/_admin/admin/beta-testers")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_admin.admin.affiliates-CK2vF2Cn.mjs");
const Route$5 = createFileRoute("/_admin/admin/affiliates")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const Route$4 = createFileRoute("/api/public/shopify/install")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const shopRaw = url.searchParams.get("shop") ?? "";
        const userId = url.searchParams.get("user_id") ?? "";
        const shop = normalizeShopDomain(shopRaw);
        if (!shop) return new Response("Domaine boutique invalide", { status: 400 });
        if (!/^[0-9a-f-]{36}$/i.test(userId)) return new Response("user_id invalide", { status: 400 });
        const redirectUri = `${url.origin}/api/public/shopify/callback`;
        const state = signState(userId);
        const authorizeUrl = buildAuthorizeUrl(shop, state, redirectUri);
        return new Response(null, {
          status: 302,
          headers: { Location: authorizeUrl }
        });
      }
    }
  }
});
const Route$3 = createFileRoute("/api/public/shopify/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams;
        if (!verifyShopifyHmac(query)) {
          return new Response("Signature HMAC invalide", { status: 401 });
        }
        const shop = normalizeShopDomain(query.get("shop") ?? "");
        const code = query.get("code");
        const state = query.get("state");
        if (!shop || !code || !state) return new Response("Paramètres manquants", { status: 400 });
        const verified = verifyState(state);
        if (!verified) return new Response("State invalide ou expiré", { status: 401 });
        const tok = await exchangeCodeForToken(shop, code);
        await persistConnection({
          userId: verified.userId,
          shop,
          accessToken: tok.access_token,
          scope: tok.scope
        });
        return new Response(null, {
          status: 302,
          headers: { Location: "/products?shopify=connected" }
        });
      }
    }
  }
});
let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return _supabase;
}
function planFromPriceId(priceId) {
  if (!priceId) return null;
  if (priceId === "cod_monthly_v1") return "cod";
  if (priceId === "scale_monthly_v4") return "pro";
  if (priceId === "pro_monthly_v4") return "starter";
  if (priceId === "basic_monthly_v4") return "basic";
  if (priceId === "scale_yearly_v4") return "pro";
  if (priceId === "pro_yearly_v4") return "starter";
  if (priceId === "basic_yearly_v4") return "basic";
  if (priceId === "premium_monthly_v3") return "pro";
  if (priceId === "pro_monthly_v3") return "starter";
  if (priceId === "basic_monthly_v3") return "basic";
  if (priceId === "pro_monthly" || priceId === "pro_monthly_v2") return "pro";
  if (priceId === "starter_monthly" || priceId === "starter_monthly_v2") return "starter";
  return null;
}
async function upsertSubscriptionFromStripe(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }
  const item = subscription.items?.data?.[0];
  const lovablePriceId = item?.price?.metadata?.lovable_external_id || subscription.metadata?.priceId || null;
  const plan = planFromPriceId(lovablePriceId);
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;
  const update = {
    status: subscription.status,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    cancel_at_period_end: subscription.cancel_at_period_end || false,
    current_period_end: periodEnd ? new Date(periodEnd * 1e3).toISOString() : null,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (plan) update.plan = plan;
  await getSupabase().from("subscriptions").update(update).eq("user_id", userId);
}
async function handleSubscriptionDeleted(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;
  await getSupabase().from("subscriptions").update({
    status: "canceled",
    cancel_at_period_end: false,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", userId);
}
async function handleCheckoutCompleted(session) {
  if (session.mode !== "subscription") return;
}
async function handleWebhook(req, env) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await upsertSubscriptionFromStripe(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}
const Route$2 = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      }
    }
  }
});
const Route$1 = createFileRoute("/api/public/hooks/shopify-sync")({
  server: {
    handlers: {
      POST: async () => {
        const { data: optedIn } = await supabaseAdmin.from("profiles").select("id").eq("auto_sync_enabled", true);
        const enabledIds = new Set((optedIn ?? []).map((p) => p.id));
        const { data: connections } = await supabaseAdmin.from("shopify_connections").select("user_id").eq("active", true);
        const list = (connections ?? []).filter((c) => enabledIds.has(c.user_id));
        const results = [];
        const batchSize = 5;
        for (let i = 0; i < list.length; i += batchSize) {
          const batch = list.slice(i, i + batchSize);
          const settled = await Promise.allSettled(
            batch.map((c) => runShopifySyncForUser(c.user_id, 2))
          );
          settled.forEach((r, idx) => {
            const userId = batch[idx].user_id;
            if (r.status === "fulfilled") results.push({ userId, ok: true });
            else results.push({ userId, ok: false, error: String(r.reason?.message ?? r.reason) });
          });
        }
        return Response.json({ processed: results.length, results });
      }
    }
  }
});
const $$splitComponentImporter = () => import("../_admin.admin.users._id-cSo6wce8.mjs");
const Route = createFileRoute("/_admin/admin/users/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SitemapDotxmlRoute = Route$M.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$N
});
const ResetPasswordRoute = Route$L.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$N
});
const PricingRoute = Route$K.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$N
});
const DropshippingRoute = Route$J.update({
  id: "/dropshipping",
  path: "/dropshipping",
  getParentRoute: () => Route$N
});
const ContactRoute = Route$I.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$N
});
const CodRoute = Route$H.update({
  id: "/cod",
  path: "/cod",
  getParentRoute: () => Route$N
});
const CalculateurRoasRoute = Route$G.update({
  id: "/calculateur-roas",
  path: "/calculateur-roas",
  getParentRoute: () => Route$N
});
const BlogRoute = Route$F.update({
  id: "/blog",
  path: "/blog",
  getParentRoute: () => Route$N
});
const AuthRoute = Route$E.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$N
});
const AppRoute = Route$D.update({
  id: "/_app",
  getParentRoute: () => Route$N
});
const AdminRoute = Route$C.update({
  id: "/_admin",
  getParentRoute: () => Route$N
});
const IndexRoute = Route$B.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$N
});
const CodIndexRoute = Route$A.update({
  id: "/",
  path: "/",
  getParentRoute: () => CodRoute
});
const BlogIndexRoute = Route$z.update({
  id: "/",
  path: "/",
  getParentRoute: () => BlogRoute
});
const LegalPrivacyRoute = Route$y.update({
  id: "/legal/privacy",
  path: "/legal/privacy",
  getParentRoute: () => Route$N
});
const LegalMentionsRoute = Route$x.update({
  id: "/legal/mentions",
  path: "/legal/mentions",
  getParentRoute: () => Route$N
});
const LegalCookiesRoute = Route$w.update({
  id: "/legal/cookies",
  path: "/legal/cookies",
  getParentRoute: () => Route$N
});
const LegalCgvRoute = Route$v.update({
  id: "/legal/cgv",
  path: "/legal/cgv",
  getParentRoute: () => Route$N
});
const LegalCguRoute = Route$u.update({
  id: "/legal/cgu",
  path: "/legal/cgu",
  getParentRoute: () => Route$N
});
const CodCountryRoute = Route$t.update({
  id: "/$country",
  path: "/$country",
  getParentRoute: () => CodRoute
});
const BlogSlugRoute = Route$s.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => BlogRoute
});
const ApiCoachRoute = Route$r.update({
  id: "/api/coach",
  path: "/api/coach",
  getParentRoute: () => Route$N
});
const AffilieCodeRoute = Route$q.update({
  id: "/affilie/$code",
  path: "/affilie/$code",
  getParentRoute: () => Route$N
});
const AdminLoginRoute = Route$p.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$N
});
const AppSettingsRoute = Route$o.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AppRoute
});
const AppRoasCalculatorRoute = Route$n.update({
  id: "/roas-calculator",
  path: "/roas-calculator",
  getParentRoute: () => AppRoute
});
const AppProductsRoute = Route$m.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => AppRoute
});
const AppPlanRoute = Route$l.update({
  id: "/plan",
  path: "/plan",
  getParentRoute: () => AppRoute
});
const AppNetodshRoute = Route$k.update({
  id: "/netodsh",
  path: "/netodsh",
  getParentRoute: () => AppRoute
});
const AppEntriesRoute = Route$j.update({
  id: "/entries",
  path: "/entries",
  getParentRoute: () => AppRoute
});
const AppDashboardRoute = Route$i.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AppRoute
});
const AppAnalyticsRoute = Route$h.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AppRoute
});
const AdminAdminRoute = Route$g.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AdminRoute
});
const ApiPublicUnitechWebhookRoute = Route$f.update({
  id: "/api/public/unitech-webhook",
  path: "/api/public/unitech-webhook",
  getParentRoute: () => Route$N
});
const ApiPublicExtensionTrackRoute = Route$e.update({
  id: "/api/public/extension-track",
  path: "/api/public/extension-track",
  getParentRoute: () => Route$N
});
const AdminAdminUsersRoute = Route$d.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminSettingsRoute = Route$c.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminSecurityRoute = Route$b.update({
  id: "/security",
  path: "/security",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminRevenueRoute = Route$a.update({
  id: "/revenue",
  path: "/revenue",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminExtensionRoute = Route$9.update({
  id: "/extension",
  path: "/extension",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminExportRoute = Route$8.update({
  id: "/export",
  path: "/export",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminCommunicationRoute = Route$7.update({
  id: "/communication",
  path: "/communication",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminBetaTestersRoute = Route$6.update({
  id: "/beta-testers",
  path: "/beta-testers",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminAffiliatesRoute = Route$5.update({
  id: "/affiliates",
  path: "/affiliates",
  getParentRoute: () => AdminAdminRoute
});
const ApiPublicShopifyInstallRoute = Route$4.update({
  id: "/api/public/shopify/install",
  path: "/api/public/shopify/install",
  getParentRoute: () => Route$N
});
const ApiPublicShopifyCallbackRoute = Route$3.update({
  id: "/api/public/shopify/callback",
  path: "/api/public/shopify/callback",
  getParentRoute: () => Route$N
});
const ApiPublicPaymentsWebhookRoute = Route$2.update({
  id: "/api/public/payments/webhook",
  path: "/api/public/payments/webhook",
  getParentRoute: () => Route$N
});
const ApiPublicHooksShopifySyncRoute = Route$1.update({
  id: "/api/public/hooks/shopify-sync",
  path: "/api/public/hooks/shopify-sync",
  getParentRoute: () => Route$N
});
const AdminAdminUsersIdRoute = Route.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AdminAdminUsersRoute
});
const AdminAdminUsersRouteChildren = {
  AdminAdminUsersIdRoute
};
const AdminAdminUsersRouteWithChildren = AdminAdminUsersRoute._addFileChildren(
  AdminAdminUsersRouteChildren
);
const AdminAdminRouteChildren = {
  AdminAdminAffiliatesRoute,
  AdminAdminBetaTestersRoute,
  AdminAdminCommunicationRoute,
  AdminAdminExportRoute,
  AdminAdminExtensionRoute,
  AdminAdminRevenueRoute,
  AdminAdminSecurityRoute,
  AdminAdminSettingsRoute,
  AdminAdminUsersRoute: AdminAdminUsersRouteWithChildren
};
const AdminAdminRouteWithChildren = AdminAdminRoute._addFileChildren(
  AdminAdminRouteChildren
);
const AdminRouteChildren = {
  AdminAdminRoute: AdminAdminRouteWithChildren
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const AppRouteChildren = {
  AppAnalyticsRoute,
  AppDashboardRoute,
  AppEntriesRoute,
  AppNetodshRoute,
  AppPlanRoute,
  AppProductsRoute,
  AppRoasCalculatorRoute,
  AppSettingsRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const BlogRouteChildren = {
  BlogSlugRoute,
  BlogIndexRoute
};
const BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
const CodRouteChildren = {
  CodCountryRoute,
  CodIndexRoute
};
const CodRouteWithChildren = CodRoute._addFileChildren(CodRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  AppRoute: AppRouteWithChildren,
  AuthRoute,
  BlogRoute: BlogRouteWithChildren,
  CalculateurRoasRoute,
  CodRoute: CodRouteWithChildren,
  ContactRoute,
  DropshippingRoute,
  PricingRoute,
  ResetPasswordRoute,
  SitemapDotxmlRoute,
  AdminLoginRoute,
  AffilieCodeRoute,
  ApiCoachRoute,
  LegalCguRoute,
  LegalCgvRoute,
  LegalCookiesRoute,
  LegalMentionsRoute,
  LegalPrivacyRoute,
  ApiPublicExtensionTrackRoute,
  ApiPublicUnitechWebhookRoute,
  ApiPublicHooksShopifySyncRoute,
  ApiPublicPaymentsWebhookRoute,
  ApiPublicShopifyCallbackRoute,
  ApiPublicShopifyInstallRoute
};
const routeTree = Route$N._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full brutal-border p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "ERREUR" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-tight", children: "Quelque chose s'est cassé." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "brutal-border bg-foreground text-background px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent",
          children: "Réessayer"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "brutal-border px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-background",
          children: "Accueil"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Cache "frais" 5 min : pas de refetch entre re-renders ni navigations
        // tant que la donnée a moins de 5 min. Au-delà, refetch en arrière-plan.
        staleTime: 5 * 6e4,
        // Garde la donnée 30 min en mémoire après démontage du dernier consommateur.
        gcTime: 30 * 6e4,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    // Laisse TanStack Query décider de la fraîcheur (sinon le cache Router court-circuite Query).
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  BLOG_POSTS as B,
  COPY$1 as C,
  LegalShell as L,
  Route$E as R,
  WhatsAppSupport as W,
  COPY as a,
  Route$t as b,
  COD_COUNTRIES as c,
  Route$s as d,
  Route$k as e,
  Route$i as f,
  Route as g,
  router as r,
  useAuth as u
};
