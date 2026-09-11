import { createFileRoute, Link } from "@tanstack/react-router";
import { SignupCtaButton } from "@/components/SignupCtaButton";

const PRICING_URL = "https://netodash.com/pricing";
const PRICING_TITLE = "Tarifs — NETODASH | Marge nette de ta boutique CopyX";
const PRICING_DESC =
  "7 jours d'essai gratuit, sans carte. Ensuite $20/mois, tout illimité : ventes CopyX, acomptes, paiements mobile money, Analytics Pro.";

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
  name: "Netodash";
  monthly: number;
  tagline: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

const DROPSHIP_PLANS: PaidPlan[] = [
  {
    name: "Netodash",
    monthly: 20,
    tagline: "Tout illimité, tout inclus",
    features: [
      "Ventes CopyX illimitées",
      "Suivi acomptes + paiements mobile money",
      "Analytics Pro (scoring, waterfall, break-even, simulateur)",
      "Decision Engine · Insights automatiques",
      "Upsells · Export CSV",
      "Historique illimité",
      "Support WhatsApp",
    ],
    cta: "Choisir Netodash",
    highlight: true,
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
            <SignupCtaButton variant="header" />
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
          7 jours d'essai gratuit avec accès complet, sans carte bancaire.
          Puis $20/mois — tout illimité, pour piloter la marge nette de ta
          boutique CopyX (acomptes, mobile money, pub, COGS, livraison).
        </p>

        {/* Essai */}
        <div className="mt-10 max-w-xl">
          <div className="p-7 flex flex-col brutal-border">
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">PLAN</div>
            <div className="text-3xl font-black tracking-tight mt-1">Essai gratuit</div>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-5xl font-black tracking-tighter">0 $</span>
              <span className="font-mono text-sm text-muted-foreground">/ 7 jours</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-5">
              Accès complet 7 jours, sans carte bancaire
            </p>
            <SignupCtaButton variant="card" />
          </div>
        </div>
        {/* Les plans */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">
            LES PLANS
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-6 max-w-2xl">
            Un seul plan, tout illimité — facturation mensuelle, sans engagement.
          </p>
          <div className="grid md:grid-cols-1 gap-6 max-w-2xl">
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
                <SignupCtaButton variant={p.highlight ? "cardHighlight" : "card"} />
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
                a: "7 jours complets, sans carte bancaire, avec accès complet. À la fin, tu passes à $20/mois tout illimité — ou tu arrêtes, sans frais.",
              },
              {
                q: "Y a-t-il plusieurs plans ?",
                a: "Non, un seul plan : $20/mois, tout illimité. Produits illimités, Analytics Pro, Decision Engine, upsells, export CSV et support WhatsApp. Aucun palier à choisir, aucune fonctionnalité bridée.",
              },
              {
                q: "Puis-je changer de plan ou annuler ?",
                a: "Oui, à tout moment depuis Mon plan. Paiement par carte via Stripe. Tu annules en un clic — ton accès reste actif jusqu'à la fin de la période payée.",
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
            © {new Date().getFullYear()} NETODASH · POUR LES BOUTIQUES COPYX
          </div>
          <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent">
            ← Retour
          </Link>
        </div>
      </footer>
    </div>
  );
}
