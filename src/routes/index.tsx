import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";


const SEO_TITLE = "Calculateur ROAS Gratuit — Netodash";
const SEO_DESC =
  "Calcule ton Break-Even ROAS, ton ROAS actuel et ton CPA max gratuitement. Outil dropshipping, COD, Shopify, Meta Ads et TikTok Ads.";
const URL = "https://netodash.com/";

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculateur ROAS Gratuit — Netodash",
      url: URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: SEO_DESC,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    },
    {
      "@type": "Organization",
      name: "Netodash",
      url: URL,
      logo: "https://netodash.com/netodash-logo.png",
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESC },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESC },
      { property: "og:url", content: URL },
      {
        name: "keywords",
        content:
          "calculateur ROAS, ROAS calculator, break even ROAS, calcul ROAS gratuit, CPA max, ROAS dropshipping, ROAS COD",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(JSONLD) },
    ],
  }),
  component: LandingChooser,
});

function LandingChooser() {
  // Plus de redirection auto : la home doit s'afficher pour permettre le choix.
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", "cod");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar minimal */}
      <header className="brutal-border-thin border-t-0 border-l-0 border-r-0">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Logo mode="cod" priority className="h-8 md:h-10 w-auto object-contain shrink-0" />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/calculateur-roas"
              className="hidden sm:inline-block brutal-border-thin px-3 py-2 font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-accent-foreground hover:border-accent"
            >
              Calc. ROAS gratuit
            </Link>
            <Link
              to="/auth"
              className="hidden sm:inline-block px-3 py-2 font-bold uppercase tracking-wider text-xs hover:text-accent"
            >
              Connexion
            </Link>
            <Link
              to="/contact"
              className="brutal-border-thin px-3 py-2 font-bold uppercase tracking-wider text-xs"
            >
              Contact
            </Link>
          </div>
        </div>
      </header>

      {/* Chooser */}
      <main className="flex-1 brutal-grid">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-muted-foreground font-bold mb-4">
              ▍ BIENVENUE SUR NETODASH
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
              L'OUTIL DE <span className="text-accent">RENTABILITÉ 360°</span><br />
              POUR DROPSHIPPING & COD
            </h1>
            <p className="mt-6 font-mono text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              ROAS net, marge réelle, CPA max, taux de livraison COD — toute ta rentabilité dans un seul dashboard.
              Choisis ton mode pour commencer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            <ChoiceCard
              to="/dropshipping"
              pref="dropshipping"
              kicker="INTERNATIONAL · USD · €"
              title="DROPSHIPPING"
              tagline="Shopify · Meta · TikTok · Google Ads"
              points={[
                "ROAS net après taxes pub Meta",
                "Marge réelle après Stripe + refunds",
                "Product Ranking : Rentable / Break Even / Pas rentable",
                "Analytics Pro avancée (plan Scale)",
              ]}
              cta="Voir Netodash Dropshipping →"
              colorClass="dropshipping"
            />
            <ChoiceCard
              to="/cod"
              pref="cod"
              kicker="AFRIQUE DE L'OUEST · FCFA"
              title="COD"
              tagline="Cash on Delivery · Call center · Livreurs"
              points={[
                "Taux confirmation & livraison par produit",
                "Coût livraison ventilé par zone",
                "Profit net en FCFA, par jour, par zone",
                "Sénégal · CI · Mali · Bénin · Burkina · Togo",
              ]}
              cta="Voir Netodash COD →"
              colorClass="cod"
            />
          </div>

          <p className="text-center font-mono text-xs text-muted-foreground mt-12">
            Tu fais les deux ? <Link to="/auth" search={{ mode: "signup" }} className="underline text-foreground font-bold">Crée ton compte</Link> — le plan Pro débloque les 2 modes en parallèle.
          </p>

          <section className="mt-12 md:mt-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-4" aria-label="SEO calculateur ROAS">
            <SeoCard title="Break-Even ROAS" text="Le ROAS minimum à atteindre pour ne pas perdre d'argent sur une vente." />
            <SeoCard title="ROAS actuel" text="Le ratio entre ton chiffre d'affaires et ta dépense publicitaire réelle." />
            <SeoCard title="CPA max" text="La dépense publicitaire maximale par commande pour rester rentable." />
          </section>
        </div>
      </main>

      <footer className="border-t border-foreground bg-background">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} NETODASH · BUILT FOR DROPSHIPPING & COD
          </div>
          <div className="flex gap-4 font-mono text-xs uppercase tracking-widest">
            <Link to="/pricing" className="text-muted-foreground hover:text-accent">Tarifs</Link>
            <Link to="/legal/mentions" className="text-muted-foreground hover:text-accent">Mentions</Link>
            <Link to="/legal/privacy" className="text-muted-foreground hover:text-accent">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChoiceCard({
  to,
  pref,
  kicker,
  title,
  tagline,
  points,
  cta,
  colorClass,
}: {
  to: "/dropshipping" | "/cod";
  pref: "dropshipping" | "cod";
  kicker: string;
  title: string;
  tagline: string;
  points: string[];
  cta: string;
  colorClass: "dropshipping" | "cod";
}) {
  const remember = () => {
    try {
      localStorage.setItem("netodash:landing-pref", pref);
    } catch {}
  };

  // Bleu pour drop, orange pour cod via une div racine qui force data-mode local
  // (l'autre carte garde l'accent global = orange par défaut).
  return (
    <Link
      to={to}
      onClick={remember}
      data-mode={colorClass}
      className="group block brutal-border bg-background p-7 md:p-9 transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_hsl(var(--accent))]"
    >
      <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest font-bold text-accent mb-3">
        {kicker}
      </div>
      <div className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
        {title}
      </div>
      <div className="mt-2 font-mono text-xs md:text-sm text-muted-foreground">
        {tagline}
      </div>

      <ul className="mt-6 space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm">
            <span className="text-accent font-black mt-0.5">→</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 brutal-border bg-accent text-accent-foreground border-accent px-5 py-3 font-black uppercase tracking-wider text-sm text-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
        {cta}
      </div>
    </Link>
  );
}

function SeoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="brutal-border-thin bg-background p-5">
      <h2 className="text-lg font-black tracking-tight">{title}</h2>
      <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
        {text}
      </p>
    </article>
  );
}
