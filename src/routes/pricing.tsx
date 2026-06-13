import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BillingCycleToggle, type BillingCycle } from "@/components/PlanCards";

const PRICING_URL = "https://netodash.com/pricing";
const PRICING_TITLE = "Tarifs — NETODASH | Dashboard rentabilité Dropshipping & COD";
const PRICING_DESC =
  "14 jours d'essai gratuit, sans carte. Starter $7, Pro $19, Scale $39 — ou −20 % en annuel. Drop + COD, Analytics Pro.";

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
  yearly: number;
  monthlyEquivalent: string;
  tagline: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

const PAID_PLANS: PaidPlan[] = [
  {
    name: "Starter",
    monthly: 7,
    yearly: 67,
    monthlyEquivalent: "5,58",
    tagline: "Démarrer un premier produit",
    features: [
      "3 produits actifs",
      "Dropshipping OU COD (au choix)",
      "ROAS net multi-plateformes",
      "Dashboard rentabilité complet",
      "1 zone de livraison COD",
      "Historique 60 jours glissants",
    ],
    cta: "Choisir Starter",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: 19,
    yearly: 182,
    monthlyEquivalent: "15,17",
    tagline: "Valider 1 à 3 winners",
    features: [
      "10 produits actifs",
      "Dropshipping ET COD en parallèle",
      "Upsells (ventes additionnelles)",
      "Multi-zones COD avec tarifs",
      "ROAS net Meta / TikTok / Google",
      "Capture mobile colorée par mode",
      "Historique illimité · Export CSV",
      "Support email + WhatsApp",
    ],
    cta: "Choisir Pro",
    highlight: true,
  },
  {
    name: "Scale",
    monthly: 39,
    yearly: 374,
    monthlyEquivalent: "31,17",
    tagline: "Scaler en volume avec Analytics Pro",
    features: [
      "Produits illimités",
      "Upsells illimités",
      "Tout ce qui est inclus dans Pro",
      "Analytics Pro EXCLUSIF",
      "Scoring 0-100 winners/losers",
      "Waterfall du bénéfice net",
      "Break-even & simulateur scénarios",
      "Insights & alertes automatiques",
      "Support prioritaire WhatsApp",
    ],
    cta: "Choisir Scale",
    highlight: false,
  },
];

function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

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
          UN PRIX <span className="text-accent">JUSTE.</span><br />
          PAS DE PIÈGE.
        </h1>
        <p className="font-mono text-sm md:text-base text-muted-foreground mt-6 max-w-2xl">
          14 jours d'essai gratuit avec le plan Pro débloqué, sans carte bancaire.
          Puis Starter $7, Pro $19 ou Scale $39 — facture mensuelle ou annuelle (−20 %).
          Aucun engagement, annule en un clic.
        </p>

        <div className="mt-8 flex justify-center md:justify-start">
          <BillingCycleToggle cycle={cycle} onChange={setCycle} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {/* Carte Essai */}
          <div className="p-7 flex flex-col brutal-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">PLAN</div>
                <div className="text-3xl font-black tracking-tight mt-1">Essai gratuit</div>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-black tracking-tighter">0 $</span>
              <span className="font-mono text-sm text-muted-foreground">/ 14 jours</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-5">Pro débloqué, sans carte bancaire</p>
            <ul className="space-y-2 mb-5 flex-1">
              {[
                "Jusqu'à 10 produits suivis",
                "Dropshipping ET COD en parallèle",
                "Dashboard rentabilité complet",
                "Analytics Pro débloqué pendant l'essai",
                "Saisies cumulées multi-jours",
                "Aucun engagement",
              ].map((f) => (
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
              Démarrer l'essai
            </Link>
          </div>

          {PAID_PLANS.map((p) => {
            const mainPrice = cycle === "yearly" ? `$${p.yearly}` : `$${p.monthly}`;
            const period = cycle === "yearly" ? "/an" : "/mois";
            const secondary =
              cycle === "yearly"
                ? `≈ $${p.monthlyEquivalent}/mois — économise 20 %`
                : `ou $${p.yearly}/an (−20 %)`;
            return (
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
                  <span className="text-5xl font-black tracking-tighter">{mainPrice}</span>
                  <span className="font-mono text-sm text-muted-foreground">{period}</span>
                </div>
                <div className="font-mono text-xs text-accent mb-2 font-bold">{secondary}</div>
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
            );
          })}
        </div>

        <section className="mt-24">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">
            QUESTIONS FRÉQUENTES
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Comment fonctionne l'essai gratuit ?",
                a: "14 jours complets, sans carte bancaire. Tu démarres directement avec le plan Pro débloqué (10 produits, Drop + COD, Analytics Pro). À la fin, tu choisis Starter, Pro ou Scale — ou tu arrêtes simplement, sans frais.",
              },
              {
                q: "C'est quoi la facturation annuelle ?",
                a: "Tu paies une fois par an et tu économises 20 % : Starter à $67/an (≈ $5,58/mois), Pro à $182/an (≈ $15,17/mois), Scale à $374/an (≈ $31,17/mois). Tu peux annuler à tout moment — pas de remboursement au prorata sauf obligation légale.",
              },
              {
                q: "Quelle différence entre Starter, Pro et Scale ?",
                a: "Starter ($7) = 3 produits, Drop OU COD, historique 60 jours. Pro ($19) = 10 produits, Drop ET COD en parallèle, upsells, multi-zones COD, historique illimité, export CSV. Scale ($39) = produits illimités + Analytics Pro EXCLUSIF (scoring 0-100, waterfall du bénéfice, break-even, simulateur, insights auto) + support WhatsApp prioritaire.",
              },
              {
                q: "Puis-je changer de plan ou annuler ?",
                a: "Oui, à tout moment depuis Mon plan. Tu passes de Starter à Pro/Scale (ou inversement), ou tu annules en un clic — ton accès reste actif jusqu'à la fin de la période payée.",
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
