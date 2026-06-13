import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import heroDropshipping from "@/assets/hero-dropshipping.jpg";

import { LANDING_COPY } from "@/lib/landing-copy";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { RoasCalculator } from "@/components/landing/RoasCalculator";
import { BetaCtaButton } from "@/components/BetaCtaButton";
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
  CompetitorComparison,
} from "@/components/landing/SharedSections";

const COPY = LANDING_COPY.dropshipping;
const URL = "https://netodash.com/dropshipping";
const OG = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d66852f5-8da1-4b8f-9896-dae638808602/id-preview-45aaf504--c8da90f6-5654-47cb-a390-4f9faf5e58ee.lovable.app-1777284800740.png";

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Netodash — Dropshipping",
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
        ratingValue: "4.9",
        ratingCount: "127",
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

export const Route = createFileRoute("/dropshipping")({
  head: () => ({
    meta: [
      { title: COPY.seoTitle },
      { name: "description", content: COPY.seoDescription },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: COPY.seoTitle },
      { property: "og:description", content: COPY.seoDescription },
      { property: "og:url", content: URL },
      { property: "og:image", content: OG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: COPY.seoTitle },
      { name: "twitter:description", content: COPY.seoDescription },
      { name: "twitter:image", content: OG },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(JSONLD) },
    ],
  }),
  component: DropshippingLanding,
});

function DropshippingLanding() {
  // Pousse l'accent BLEU sur toute la page (data-mode="dropshipping" déjà géré par styles.css)
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", "dropshipping");
    try {
      localStorage.setItem("netodash:landing-pref", "dropshipping");
    } catch {}
    return () => {
      document.documentElement.setAttribute("data-mode", "cod");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="dropshipping" />

      {/* Hero */}
      <section id="top" className="brutal-grid scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="brutal-border-thin inline-block px-3 py-1 text-[10px] md:text-xs uppercase tracking-widest font-bold font-mono bg-accent text-accent-foreground border-accent mb-6">
              {COPY.heroBadge}
            </div>
            <h1 className="font-black tracking-tighter leading-[0.95] text-balance">
              <span className="block text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {COPY.heroH1Line1}
              </span>
              <span className="block text-accent text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {COPY.heroH1Line2}
              </span>
            </h1>
            <p className="mt-5 md:mt-6 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground leading-relaxed">
              {COPY.heroSubtitle}{" "}
              <span className="text-foreground font-bold">{COPY.heroSubtitleBold}</span>
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center">
              <BetaCtaButton variant="hero" />
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
          </div>
        </div>
      </section>

      {/* ROAS Calculator (NEW · unique to Drop) */}
      <RoasCalculator />

      {/* Showcase visuel : illustration générée du dashboard Netodash */}
      <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background brutal-grid relative overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-5 gap-10 md:gap-12 items-center">
          <div className="order-2 md:order-1 md:col-span-3 flex justify-center md:justify-start animate-fade-in">
            <div className="relative w-full max-w-[820px]">
              <div className="absolute -inset-3 bg-accent/10 -z-10 brutal-border-thin border-accent" />
              <img
                src={heroDropshipping}
                alt="Aperçu du dashboard Netodash — ROAS net, profit et ranking produits Shopify"
                width={1408}
                height={1024}
                loading="lazy"
                decoding="async"
                className="w-full h-auto brutal-border bg-background shadow-[12px_12px_0_0_hsl(var(--accent))]"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 md:col-span-2 animate-fade-in">
            <div className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
              {COPY.showcaseEyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-[0.95] tracking-tight mb-5">
              {COPY.showcaseTitleHtml.before}
              <span className="text-accent">{COPY.showcaseTitleHtml.accent}</span>
              {COPY.showcaseTitleHtml.after}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              {COPY.showcaseLead}
            </p>
            <ul className="space-y-2 text-sm md:text-base font-bold">
              {COPY.showcaseList.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-accent">→</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <TrustStats stats={COPY.trustStats} />
      <CompetitorComparison />
      <Pillars pillars={COPY.pillars} />

      <BeforeAfter copy={COPY} />
      <ProductRanking copy={COPY} mode="dropshipping" />
      <DecisionEngine copy={COPY} />
      <Testimonials copy={COPY} />
      <TrustSecurity />
      <Pricing copy={COPY} />
      <FinalCta copy={COPY} />
      <SiteFooter tagline={COPY.footerTagline} baseline={COPY.footerBaseline} />
    </div>
  );
}
