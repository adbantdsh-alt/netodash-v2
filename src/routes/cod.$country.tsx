import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { COD_COUNTRIES, getCodCountry } from "@/lib/cod-countries";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { BetaCtaButton } from "@/components/BetaCtaButton";

export const Route = createFileRoute("/cod/$country")({
  loader: ({ params }) => {
    const country = getCodCountry(params.country);
    if (!country) throw notFound();
    return { country };
  },
  head: ({ params, loaderData }) => {
    const c = loaderData?.country;
    if (!c) return { meta: [] };
    const url = `https://netodash.com/cod/${params.country}`;
    const title = `COD ${c.name} — Dropshipping Cash on Delivery ${c.capital} | NETODASH`;
    const desc = `Lancer du dropshipping COD au ${c.name} : zones de livraison, tarifs livreurs ${c.capital}, taux de livraison réel, moyens de paiement (cash, mobile money). Guide + outil de pilotage rentabilité.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:locale", content: "fr_FR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: title,
                description: desc,
                inLanguage: "fr-FR",
                mainEntityOfPage: url,
                author: { "@type": "Organization", name: "NETODASH" },
                publisher: {
                  "@type": "Organization",
                  name: "NETODASH",
                  logo: { "@type": "ImageObject", url: "https://netodash.com/netodash-logo.png" },
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Accueil", item: "https://netodash.com/" },
                  { "@type": "ListItem", position: 2, name: "COD", item: "https://netodash.com/cod" },
                  { "@type": "ListItem", position: 3, name: c.name, item: url },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: c.faq.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: CountryPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-black">Pays non trouvé</h1>
        <Link to="/cod" className="mt-6 inline-block brutal-border px-6 py-3 font-bold uppercase">
          ← Retour COD
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-3xl font-black">Erreur</h1>
        <p className="mt-2 text-sm font-mono">{error.message}</p>
        <button onClick={reset} className="mt-6 brutal-border px-6 py-3 font-bold uppercase">
          Réessayer
        </button>
      </div>
    </div>
  ),
});

function CountryPage() {
  const { country: c } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="cod" />

      {/* Breadcrumb visible */}
      <nav
        aria-label="Fil d'Ariane"
        className="max-w-[1400px] mx-auto px-4 md:px-6 pt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2"
      >
        <Link to="/" className="hover:text-accent">Accueil</Link>
        <span className="opacity-40">/</span>
        <Link to="/cod" className="hover:text-accent">COD</Link>
        <span className="opacity-40">/</span>
        <span className="text-foreground font-bold">{c.name}</span>
      </nav>

      <header className="brutal-grid">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="brutal-border-thin inline-block px-3 py-1 text-xs uppercase tracking-widest font-bold font-mono bg-accent text-accent-foreground border-accent mb-4">
            ▍ COD · {c.currency}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            <span className="block">DROPSHIPPING COD</span>
            <span className="block text-accent mt-2">
              {c.flag} {c.name.toUpperCase()}
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {c.intro}
          </p>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatBox label="Capitale" value={c.capital} />
            <StatBox label="Population" value={c.population} />
            <StatBox label="Devise" value={c.currency} />
            <StatBox label="Taux livraison" value={c.averageDeliveryRate} accent />
          </div>
        </div>
      </header>

      {/* Zones */}
      <section className="brutal-border-thin border-l-0 border-r-0 bg-foreground/[0.02]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            Zones de livraison & tarifs livreurs
          </h2>
          <p className="mt-3 text-sm text-muted-foreground font-mono uppercase tracking-widest">
            Coûts indicatifs à intégrer dans Netodash pour ton calcul de marge
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {c.zones.map((z) => (
              <div key={z.name} className="brutal-border bg-background p-5">
                <div className="font-black text-lg">{z.name}</div>
                <div className="mt-1 font-mono text-sm text-accent font-bold">{z.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moyens de paiement & transporteurs */}
      <section>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter">Moyens de paiement</h2>
            <ul className="mt-6 space-y-3">
              {c.paymentMethods.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="text-accent font-black mt-0.5">→</span>
                  <span className="font-bold">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter">Transporteurs / livreurs</h2>
            <ul className="mt-6 space-y-3">
              {c.carriers.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="text-accent font-black mt-0.5">→</span>
                  <span className="font-bold">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Niches */}
      <section className="brutal-border-thin border-l-0 border-r-0 bg-foreground/[0.02]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            Niches qui marchent au {c.name}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{c.marketSize}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {c.topNiches.map((n) => (
              <span
                key={n}
                className="brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-sm bg-background"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            Les 3 pièges du COD au {c.name}
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {c.challenges.map((ch, i) => (
              <div key={ch.title} className="brutal-border p-6 bg-background">
                <div className="text-accent font-black text-4xl tracking-tighter">0{i + 1}</div>
                <div className="mt-3 font-black text-lg">{ch.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ch.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Netodash */}
      <section className="brutal-border-thin border-l-0 border-r-0 bg-accent/10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            Comment Netodash gère le COD {c.name}
          </h2>
          <ul className="mt-8 space-y-4">
            {c.netodashAngle.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="text-accent font-black text-2xl mt-[-4px]">→</span>
                <span className="text-base md:text-lg font-bold">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <BetaCtaButton variant="hero" className="px-8 py-4" />
            <Link
              to="/calculateur-roas"
              className="brutal-border px-8 py-4 font-black uppercase tracking-wider"
            >
              Calculateur ROAS gratuit →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            FAQ COD {c.name}
          </h2>
          <div className="mt-8 space-y-4 max-w-3xl">
            {c.faq.map((f) => (
              <details key={f.q} className="brutal-border bg-background p-5 group">
                <summary className="font-black text-base md:text-lg cursor-pointer flex items-start justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-accent text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Autres pays */}
      <section className="brutal-border-thin border-l-0 border-r-0 bg-foreground/[0.02]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12">
          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">
            Autres pays COD
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {COD_COUNTRIES.filter((o) => o.slug !== c.slug).map((o) => (
              <Link
                key={o.slug}
                to="/cod/$country"
                params={{ country: o.slug }}
                className="brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-sm bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent flex items-center gap-2"
              >
                <span>{o.flag}</span> {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter tagline="COD piloté à la commande livrée." baseline="Pas à la commande Shopify." />
    </div>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`brutal-border-thin p-4 ${accent ? "bg-accent text-accent-foreground border-accent" : "bg-background"}`}>
      <div className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-70">{label}</div>
      <div className="mt-1 text-lg md:text-xl font-black tracking-tight">{value}</div>
    </div>
  );
}
