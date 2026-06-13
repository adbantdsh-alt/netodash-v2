import { createFileRoute, Link } from "@tanstack/react-router";
import { COD_PLAN } from "@/components/PlanCards";

const PRICING_URL = "https://netodash.com/pricing";
const PRICING_TITLE = "Tarifs — NETODASH | Dashboard rentabilité Dropshipping & COD";
const PRICING_DESC =
  "14 jours d'essai gratuit, sans carte. Plan COD $10, Starter $12, Pro $29, Scale $79 / mois. Paiement par carte Stripe.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: PRICING_TITLE },
      { name: "description", content: PRICING_DESC },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: PRICING_TITLE },
      { property: "og:description", content: PRICING_DESC },
      { property: "og:url", content: PRICING_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PRICING_TITLE },
      { name: "twitter:description", content: PRICING_DESC },
    ],
    links: [{ rel: "canonical", href: PRICING_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://netodash.com/" },
            { "@type": "ListItem", position: 2, name: "Tarifs", item: PRICING_URL },
          ],
        }),
      },
    ],
  }),
  component: PricingPage,
});

type PaidPlan = {
  name: "Starter" | "Pro" | "Scale";
  monthly: number;
  tagline: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

const DROPSHIP_PLANS: PaidPlan[] = [
  {
    name: "Starter",
    monthly: 12,
    tagline: "Démarrer en Drop avec le COD inclus",
    features: [
      "3 produits Dropshipping max",
      "Mode COD inclus (dashboard basique)",
      "Produits COD illimités",
      "ROAS net multi-plateformes",
      "Historique Drop 60 jours",
      "1 zone de livraison COD",
    ],
    cta: "Choisir Starter",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: 29,
    tagline: "Valider plusieurs winners Drop + COD avancé",
    features: [
      "10 produits Dropshipping max",
      "Drop ET COD en parallèle",
      "Upsells · Multi-zones COD · Export CSV",
      "Capture mobile · Historique illimité",
      "Support email + WhatsApp",
    ],
    cta: "Choisir Pro",
    highlight: true,
  },
  {
    name: "Scale",
    monthly: 79,
    tagline: "Scaler avec Analytics Pro & Decision Engine",
    features: [
      "Produits Dropshipping illimités",
      "Tout Pro + Analytics Pro EXCLUSIF",
      "Decision Engine · Scoring · Waterfall",
      "Break-even · Simulateur · Insights auto",
      "Support WhatsApp prioritaire",
    ],
    cta: "Choisir Scale",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="brutal-border-thin border-t-0 border-l-0 border-r-0">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/netodash-logo.png" alt="NETODASH" className="h-9 w-auto object-contain" />
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/auth" className="px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent">
              Connexion
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="brutal-border bg-foreground text-background px-5 py-2.5 font-bold uppercase tracking-wider text-sm hover:bg-accent hover:border-accent"
            >
              Commencer
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          TARIFS
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mt-2 max-w-3xl">
          UN PRIX <span className="text-accent">JUSTE.</span>
          <br />
          PAS DE PIÈGE.
        </h1>
        <p className="font-mono text-sm md:text-base text-muted-foreground mt-6 max-w-2xl">
          14 jours d'essai gratuit avec accès complet (plan Pro débloqué), sans carte bancaire.
          Puis COD $10, Starter $12, Pro $29 ou Scale $79 — facturation mensuelle par carte Stripe.
        </p>

        {/* Essai */}
        <div className="mt-10 max-w-xl">
          <div className="p-7 flex flex-col brutal-border">
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">PLAN</div>
            <div className="text-3xl font-black tracking-tight mt-1">Essai gratuit</div>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-5xl font-black tracking-tighter">0 $</span>
              <span className="font-mono text-sm text-muted-foreground">/ 14 jours</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-5">
              Accès complet 14 jours — peu importe le mode choisi au signup
            </p>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="block text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:border-accent"
            >
              Démarrer l'essai
            </Link>
          </div>
        </div>

        {/* COD uniquement */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">
            JE FAIS DU COD UNIQUEMENT
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-6 max-w-2xl">
            Piloter ton call center sans Dropshipping — produits COD illimités, dashboard 7j / 30j.
          </p>
          <div className="brutal-border p-7 flex flex-col max-w-xl">
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">PLAN</div>
            <div className="text-3xl font-black tracking-tight mt-1">{COD_PLAN.name}</div>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-5xl font-black tracking-tighter">${COD_PLAN.price}</span>
              <span className="font-mono text-sm text-muted-foreground">/mois</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-5">{COD_PLAN.tagline}</p>
            <ul className="space-y-2 mb-5 flex-1">
              {COD_PLAN.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-accent font-black mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="block text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider bg-foreground text-background hover:bg-accent hover:border-accent"
            >
              Choisir COD
            </Link>
          </div>
        </div>

        {/* Dropshipping */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">
            JE FAIS DU DROPSHIPPING
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-6 max-w-2xl">
            Starter, Pro ou Scale — le mode COD est inclus dans chaque plan Drop.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {DROPSHIP_PLANS.map((p) => (
              <div
                key={p.name}
                className={`p-7 flex flex-col ${
                  p.highlight ? "brutal-border border-accent bg-accent/5" : "brutal-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">PLAN</div>
                    <div className="text-3xl font-black tracking-tight mt-1">{p.name}</div>
                  </div>
                  {p.highlight && (
                    <span className="brutal-border-thin text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-accent text-accent-foreground border-accent">
                      Recommandé
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-black tracking-tighter">${p.monthly}</span>
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
                </ul>
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className={`block text-center brutal-border px-5 py-3 font-bold uppercase tracking-wider ${
                    p.highlight
                      ? "bg-accent text-accent-foreground border-accent hover:opacity-90"
                      : "bg-foreground text-background hover:bg-accent hover:border-accent"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">
            QUESTIONS FRÉQUENTES
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Comment fonctionne l'essai gratuit ?",
                a: "14 jours complets, sans carte bancaire, avec accès complet (Pro débloqué) — quel que soit le mode choisi au signup. À la fin, tu choisis COD ($10), Starter, Pro ou Scale.",
              },
              {
                q: "Quelle différence entre COD, Starter, Pro et Scale ?",
                a: "COD ($10) = mode COD uniquement, produits illimités, dashboard basique. Starter ($12) = 3 produits Drop + COD inclus. Pro ($29) = 10 produits Drop, upsells, multi-zones, export CSV. Scale ($79) = Drop illimité + Analytics Pro & Decision Engine.",
              },
              {
                q: "Puis-je changer de plan ou annuler ?",
                a: "Oui, à tout moment depuis Mon plan. Paiement par carte via Stripe. Tu passes de COD à Drop (ou inversement), ou tu annules en un clic — ton accès reste actif jusqu'à la fin de la période payée.",
              },
            ].map((item) => (
              <div key={item.q} className="brutal-border-thin p-6">
                <h3 className="font-black text-lg mb-2">{item.q}</h3>
                <p className="font-mono text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <footer className="border-t border-foreground">
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} NETODASH · BUILT FOR DROPSHIPPERS
          </div>
          <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">
            ← Retour
          </Link>
        </div>
      </footer>
    </div>
  );
}
