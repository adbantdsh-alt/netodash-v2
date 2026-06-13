import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { PublicRoasCalculator } from "@/components/PublicRoasCalculator";

const URL = "https://netodash.com/calculateur-roas";

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur ROAS Gratuit — Netodash",
      url: URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Calculateur ROAS gratuit pour dropshipping, COD et e-commerce. Calcule ton Break-Even ROAS, ton ROAS actuel, ton Target ROAS et ton CPA max en quelques secondes.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Qu'est-ce que le Break-Even ROAS ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le Break-Even ROAS est le ROAS minimum à atteindre pour ne ni gagner ni perdre d'argent. Formule : prix de vente ÷ (prix de vente − coût produit). En dessous, tu perds. Au-dessus, tu gagnes.",
          },
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que le Target ROAS ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le Target ROAS est le ROAS à viser pour atteindre une marge nette précise (ex : 10% du chiffre d'affaires). Il est toujours supérieur au Break-Even ROAS.",
          },
        },
        {
          "@type": "Question",
          name: "Comment se calcule le ROAS ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ROAS = Chiffre d'affaires généré ÷ Dépense publicitaire. Un ROAS de 2x signifie que tu gagnes 2€ pour chaque 1€ dépensé en pub.",
          },
        },
      ],
    },
  ],
};

export const Route = createFileRoute("/calculateur-roas")({
  head: () => ({
    meta: [
      {
        title:
          "Calculateur ROAS Gratuit — Break-Even & Target ROAS | Netodash",
      },
      {
        name: "description",
        content:
          "Calcule gratuitement ton Break-Even ROAS, ton ROAS actuel et ton CPA max. Outil simple pour dropshipping, COD, Shopify, Meta Ads, TikTok Ads.",
      },
      {
        name: "keywords",
        content:
          "calculateur ROAS, break even ROAS, target ROAS, calcul ROAS gratuit, ROAS dropshipping, ROAS COD, CPA max, calculateur publicité Meta",
      },
      { property: "og:title", content: "Calculateur ROAS Gratuit — Netodash" },
      {
        property: "og:description",
        content:
          "Trouve ton Break-Even ROAS, ton ROAS actuel et ton CPA max. Gratuit, sans inscription.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(JSONLD),
      },
    ],
  }),
  component: CalculateurRoasPage,
});

function CalculateurRoasPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="dropshipping" />

      <main>
        {/* Hero */}
        <section className="border-b border-foreground/15">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-16">
            <div className="inline-block brutal-border-thin px-3 py-1 text-[10px] uppercase tracking-widest font-mono bg-accent text-accent-foreground border-accent mb-4">
              100 % gratuit · Sans inscription
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
              Calculateur ROAS
              <br />
              <span className="text-accent">Break-Even & Target</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Avant de lancer une campagne Meta, TikTok ou Google Ads, sache à
              partir de quel ROAS tu commences à gagner de l'argent. Utilise
              les trois calculateurs gratuits : Break-Even ROAS, ROAS actuel et CPA max.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-10 md:py-14">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <PublicRoasCalculator compact />
          </div>
        </section>

        {/* Explanations */}
        <section className="border-t border-foreground/15 py-12 md:py-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-6 md:gap-10">
            <div className="brutal-border-thin p-6">
              <div className="text-xs uppercase tracking-widest font-bold text-accent">
                01 / Définition
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2">
                Qu'est-ce que le Break-Even ROAS ?
              </h2>
              <p className="mt-3 text-sm md:text-base font-mono leading-relaxed text-muted-foreground">
                Le <strong className="text-foreground">Break-Even ROAS</strong>{" "}
                (ou ROAS de rentabilité) est le seuil minimum à atteindre pour
                que ta campagne publicitaire ne te fasse pas perdre d'argent.
                Formule :
              </p>
              <div className="mt-3 brutal-border-thin p-4 bg-foreground/[0.02] font-mono text-sm">
                BE ROAS = Prix de vente ÷ (Prix de vente − Coût produit)
              </div>
              <p className="mt-3 text-sm font-mono leading-relaxed text-muted-foreground">
                Exemple : produit vendu 45 $, coût 13 $ → BE
                ROAS ={" "}
                <strong className="text-foreground">
                  {(45 / (45 - 13)).toFixed(2)}x
                </strong>
                .
              </p>
            </div>

            <div className="brutal-border-thin p-6">
              <div className="text-xs uppercase tracking-widest font-bold text-accent">
                02 / Définition
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2">
                Qu'est-ce que le Target ROAS ?
              </h2>
              <p className="mt-3 text-sm md:text-base font-mono leading-relaxed text-muted-foreground">
                Le <strong className="text-foreground">Target ROAS</strong> est
                le ROAS à viser pour atteindre une{" "}
                <strong className="text-foreground">marge nette</strong> précise
                (souvent 10 à 25%). Il est toujours supérieur au Break-Even.
                Formule :
              </p>
              <div className="mt-3 brutal-border-thin p-4 bg-foreground/[0.02] font-mono text-sm">
                Target ROAS = Prix ÷ (Prix − Coût − Marge visée)
              </div>
              <p className="mt-3 text-sm font-mono leading-relaxed text-muted-foreground">
                Utilise-le comme objectif de scaling. En dessous : audit. Bien
                au-dessus : scale x2.
              </p>
            </div>
          </div>
        </section>

        {/* CTA vers app */}
        <section className="border-t border-foreground bg-foreground text-background">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-14 md:py-20 text-center">
            <div className="inline-block brutal-border-thin border-accent px-3 py-1 text-[10px] uppercase tracking-widest font-mono bg-accent text-accent-foreground mb-5">
              Tu veux aller plus loin ?
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
              Suis ton ROAS <span className="text-accent">en temps réel</span>{" "}
              dans Netodash
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-background/70 font-mono leading-relaxed">
              Ce calculateur fait des projections. Pour suivre ton ROAS, ta
              marge nette et ton CPA <strong>jour par jour</strong> sur tous
              tes produits, crée un compte Netodash en 30 secondes.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="brutal-border bg-accent text-accent-foreground border-accent px-6 py-3 font-black uppercase tracking-wider text-sm hover:opacity-90"
              >
                Créer un compte gratuit →
              </Link>
              <Link
                to="/dropshipping"
                className="brutal-border-thin border-background px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-background hover:text-foreground"
              >
                Découvrir Netodash
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="max-w-[900px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-8">
              Questions fréquentes
            </h2>
            <div className="grid gap-4">
              <Faq q="Le calculateur est-il vraiment gratuit ?">
                Oui, 100% gratuit et sans inscription. Tu peux l'utiliser
                autant de fois que tu veux. Si tu veux suivre tes calculs et
                ton ROAS au quotidien, crée un compte Netodash.
              </Faq>
              <Faq q="Sur quels coûts se base le calcul ?">
                Le calcul utilise uniquement le prix de vente et le coût
                produit (achat + livraison vers le client). Pour intégrer
                frais Shopify, SAV, retours, etc., utilise la version avancée
                dans l'app Netodash.
              </Faq>
              <Faq q="Ça marche pour le COD en Afrique ?">
                Oui. Sélectionne FCFA comme devise et entre tes valeurs. Le
                calcul est identique : sale_price ÷ (sale_price − coût) =
                ROAS de rentabilité.
              </Faq>
              <Faq q="Pourquoi mon Target ROAS dit 'Impossible' ?">
                Parce que ta marge nette visée dépasse ta marge brute. Baisse
                ton coût produit, augmente ton prix de vente, ou réduis la
                marge cible.
              </Faq>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        tagline="Le seul outil de suivi rentabilité pensé pour le dropshipping et le COD."
        baseline="ROAS, marge nette et CPA en temps réel."
      />
    </div>
  );
}

function Faq({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="brutal-border-thin p-4 group">
      <summary className="cursor-pointer font-black uppercase tracking-wide text-sm flex items-center justify-between">
        <span>{q}</span>
        <span className="text-accent text-xl group-open:rotate-45 transition-transform">
          +
        </span>
      </summary>
      <div className="mt-3 font-mono text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </details>
  );
}
