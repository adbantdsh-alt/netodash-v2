import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { LANDING_COPY } from "@/lib/landing-copy";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { CodFunnel } from "@/components/landing/CodFunnel";
import { CodZones } from "@/components/landing/CodZones";
import { CodProfitCalculator } from "@/components/landing/CodProfitCalculator";
import {
  TrustStats,
  Pillars,
  BeforeAfter,
  ProductRanking,
  DecisionEngine,
  Testimonials,
  TrustSecurity,
  Pricing,
  FinalCta,
} from "@/components/landing/SharedSections";

const COPY = LANDING_COPY.cod;
const URL = "https://netodash.com/cod";

const COUNTRIES = [
  { flag: "🇸🇳", name: "Sénégal" },
  { flag: "🇨🇮", name: "Côte d'Ivoire" },
  { flag: "🇲🇱", name: "Mali" },
  { flag: "🇧🇯", name: "Bénin" },
  { flag: "🇧🇫", name: "Burkina" },
  { flag: "🇹🇬", name: "Togo" },
  { flag: "🇬🇳", name: "Guinée" },
];

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Netodash — COD Afrique",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: URL,
      description: COPY.seoDescription,
      offers: {
        "@type": "Offer",
        price: "5",
        priceCurrency: "USD",
        category: "subscription",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "84",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: COPY.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export const Route = createFileRoute("/cod/")({
  head: () => ({
    meta: [
      { title: COPY.seoTitle },
      { name: "description", content: COPY.seoDescription },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: COPY.seoTitle },
      { property: "og:description", content: COPY.seoDescription },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: COPY.seoTitle },
      { name: "twitter:description", content: COPY.seoDescription },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(JSONLD) },
    ],
  }),
  component: CodLanding,
});

function CodLanding() {
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", "cod");
    try {
      localStorage.setItem("netodash:landing-pref", "cod");
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="cod" />

      {/* Hero — visuel téléphone + carnet livreur, pas un laptop */}
      <section id="top" className="brutal-grid scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-3">
              <div className="brutal-border-thin inline-block px-3 py-1 text-[10px] md:text-xs uppercase tracking-widest font-bold font-mono bg-accent text-accent-foreground border-accent mb-6">
                {COPY.heroBadge}
              </div>
              <h1 className="font-black tracking-tighter leading-[0.95] text-balance">
                <span className="block text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl">
                  {COPY.heroH1Line1}
                </span>
                <span className="block text-accent text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl">
                  {COPY.heroH1Line2}
                </span>
              </h1>
              <p className="mt-5 md:mt-6 text-base sm:text-lg md:text-xl max-w-2xl text-muted-foreground leading-relaxed">
                {COPY.heroSubtitle}{" "}
                <span className="text-foreground font-bold">{COPY.heroSubtitleBold}</span>
              </p>

              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className="brutal-border bg-accent text-accent-foreground border-accent px-6 md:px-10 py-3 md:py-4 font-black uppercase tracking-wider text-sm md:text-base text-center hover:bg-foreground hover:text-background hover:border-foreground"
                >
                  {COPY.heroCtaPrimary}
                </Link>
                <a
                  href="#pricing"
                  className="brutal-border px-6 md:px-10 py-3 md:py-4 font-black uppercase tracking-wider text-sm md:text-base text-center hover:bg-foreground hover:text-background"
                >
                  {COPY.heroCtaSecondary}
                </a>
              </div>
              <p className="mt-4 font-mono text-[11px] md:text-xs text-muted-foreground">
                {COPY.heroSmallprint}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {COUNTRIES.map((c) => (
                  <span
                    key={c.name}
                    className="brutal-border-thin px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-background flex items-center gap-1.5"
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Funnel COD (unique) */}
      <CodFunnel />

      {/* Trust stats COD */}
      <TrustStats stats={COPY.trustStats} />

      {/* Zones de livraison (unique) */}
      <CodZones />

      {/* Calculateur profit COD (unique) */}
      <CodProfitCalculator />

      
      <Pillars pillars={COPY.pillars} />
      <BeforeAfter copy={COPY} />
      <ProductRanking copy={COPY} mode="cod" />
      <DecisionEngine copy={COPY} />
      <Testimonials copy={COPY} />
      <TrustSecurity />
      <Pricing copy={COPY} fcfaEquivalent />
      <FinalCta copy={COPY} />
      <SiteFooter tagline={COPY.footerTagline} baseline={COPY.footerBaseline} />
    </div>
  );
}

/* Téléphone mockup brutaliste avec un mini-dashboard COD à l'intérieur. */
function PhoneMockup() {
  return (
    <div className="relative">
      <div className="brutal-border bg-foreground p-2 rounded-[36px] w-[280px] md:w-[320px] shadow-[12px_12px_0_0_hsl(var(--accent))]">
        <div className="bg-background rounded-[28px] overflow-hidden">
          <div className="h-6 bg-foreground/5 flex items-center justify-center">
            <div className="w-20 h-1.5 bg-foreground rounded-full" />
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                AUJOURD'HUI · DAKAR
              </div>
              <div className="text-3xl font-black tracking-tighter mt-1">
                +<span className="tabular">186 000</span>
                <span className="text-base text-muted-foreground font-mono"> F</span>
              </div>
              <div className="text-[10px] text-accent font-bold uppercase tracking-widest">
                Profit net
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Stat n="42" l="Reçues" />
              <Stat n="28" l="Confirmées" />
              <Stat n="19" l="Livrées" accent />
              <Stat n="68 %" l="Livraison" accent />
            </div>

            <div className="brutal-border-thin p-2">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                Top produit
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-black text-xs truncate">Montre Pro</span>
                <span className="text-[10px] font-mono bg-accent text-accent-foreground px-1.5 py-0.5">
                  SCALE
                </span>
              </div>
            </div>

            <div className="text-center text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              ▍ NETODASH MOBILE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l, accent = false }: { n: string; l: string; accent?: boolean }) {
  return (
    <div className={`brutal-border-thin p-2 ${accent ? "bg-accent/10 border-accent" : ""}`}>
      <div className={`text-xl font-black tracking-tight tabular ${accent ? "text-accent" : ""}`}>
        {n}
      </div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
        {l}
      </div>
    </div>
  );
}
