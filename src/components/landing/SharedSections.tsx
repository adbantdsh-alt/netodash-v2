import { Link } from "@tanstack/react-router";
import { ShieldCheck, Lock, XCircle, BadgeCheck, Server } from "lucide-react";
import stripeLogo from "@/assets/stripe-logo.png";
import type { LandingCopy } from "@/lib/landing-copy";

/* ────────────────────────────────────────────────────────────────────────── *
 * Sections réutilisées par les deux landings (Drop & COD)                    *
 * On en a séparé l'orchestration (route file) du rendu (ces composants)     *
 * ────────────────────────────────────────────────────────────────────────── */

export function TrustStats({ stats }: { stats: LandingCopy["trustStats"] }) {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-2xl md:text-4xl font-black tracking-tighter text-accent">
              {s.v}
            </div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-70">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PlatformsMarquee({
  heading,
  platforms,
}: {
  heading: string;
  platforms: LandingCopy["platforms"];
}) {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold text-center mb-6">
          {heading}
        </div>
        <div className="marquee-container overflow-hidden relative">
          <div className="flex gap-16 md:gap-24 animate-marquee w-max items-center">
            {[...platforms, ...platforms, ...platforms].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={56}
                loading="lazy"
                decoding="async"
                className="h-10 md:h-14 w-auto object-contain opacity-90 hover:opacity-100 transition"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pillars({ pillars }: { pillars: LandingCopy["pillars"] }) {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20 grid md:grid-cols-3">
        {pillars.map((item, i) => (
          <div
            key={item.n}
            className={`p-10 ${i < 2 ? "md:border-r border-foreground" : ""} ${i > 0 ? "border-t md:border-t-0 border-foreground" : ""}`}
          >
            <div className="text-accent font-mono font-bold mb-4">{item.n}</div>
            <h3 className="text-2xl font-black mb-3">{item.t}</h3>
            <p className="text-muted-foreground">{item.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BeforeAfter({ copy }: { copy: LandingCopy }) {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          {copy.beforeAfterEyebrow}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-2 max-w-4xl">
          {copy.beforeAfterTitle} <br />
          <span className="text-accent">{copy.beforeAfterAccent}</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="brutal-border p-8 bg-background">
            <div className="brutal-border-thin px-3 py-1 inline-block text-[10px] uppercase tracking-widest font-bold mb-5">
              {copy.beforeAfterBeforeBadge}
            </div>
            <ul className="space-y-4 font-mono text-sm">
              {copy.beforeAfterBeforeRows.map((r, i) => {
                const isLast = i === copy.beforeAfterBeforeRows.length - 1;
                const valueClass = r.mode === "accent" ? "text-accent" : "text-foreground";
                return (
                  <li
                    key={r.k}
                    className={`flex justify-between gap-4 ${isLast ? "" : "border-b border-foreground/20 pb-3"}`}
                  >
                    <span className="text-muted-foreground">{r.k}</span>
                    <span className={`font-black ${valueClass}`}>{r.v}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              {copy.beforeAfterBeforeFooter.plain}
              <span className="text-foreground font-bold">{copy.beforeAfterBeforeFooter.bold}</span>
            </p>
          </div>

          <div className="brutal-border border-accent p-8 bg-background">
            <div className="brutal-border-thin border-accent bg-accent text-accent-foreground px-3 py-1 inline-block text-[10px] uppercase tracking-widest font-bold mb-5">
              {copy.beforeAfterAfterBadge}
            </div>
            <ul className="space-y-4 font-mono text-sm">
              {copy.beforeAfterAfterRows.map((r, i) => {
                const isLast = i === copy.beforeAfterAfterRows.length - 1;
                const valueClass = r.mode === "accent" ? "text-accent" : "text-foreground";
                return (
                  <li
                    key={r.k}
                    className={`flex justify-between gap-4 ${isLast ? "" : "border-b border-foreground/20 pb-3"}`}
                  >
                    <span className="text-muted-foreground">{r.k}</span>
                    <span className={`font-black ${valueClass}`}>{r.v}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              {copy.beforeAfterAfterFooter.plain}
              <span className="text-foreground font-bold">{copy.beforeAfterAfterFooter.bold}</span>
            </p>
          </div>
        </div>

        <p className="mt-10 max-w-3xl font-mono text-sm md:text-base text-muted-foreground">
          {copy.beforeAfterTagline.plain}
          <span className="text-foreground font-bold">{copy.beforeAfterTagline.bold}</span>
        </p>
      </div>
    </section>
  );
}

export function ProductRanking({
  copy,
  mode,
}: {
  copy: LandingCopy;
  mode: "dropshipping" | "cod";
}) {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
          {copy.rankingEyebrow}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl">
          {copy.rankingTitle} <br className="hidden md:block" />
          <span className="text-accent">{copy.rankingTitleAccent}</span> ?
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">
          {copy.rankingLead}
        </p>

        <div className="brutal-border mt-10 overflow-x-auto bg-background">
          <table className="w-full font-mono text-sm min-w-[720px]">
            <thead className="bg-foreground text-background">
              <tr className="text-xs uppercase tracking-widest">
                {copy.rankingCols.map((c, i) => (
                  <th
                    key={c}
                    className={
                      i === 0
                        ? "text-left p-4"
                        : i === copy.rankingCols.length - 1
                          ? "text-center p-4"
                          : "text-right p-4"
                    }
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.rankingRows.map((row) => {
                const statusClass =
                  row.status === "RENTABLE"
                    ? "bg-foreground text-background border-foreground"
                    : row.status === "BREAK EVEN"
                      ? "bg-background text-foreground border-foreground"
                      : "bg-accent text-accent-foreground border-accent";
                const profitGood = mode === "cod" ? row.profit >= 500_000 : row.profit >= 2000;
                return (
                  <tr key={row.name} className="border-t border-foreground/20">
                    <td className="p-4 font-black text-foreground tracking-tight text-base">{row.name}</td>
                    <td className="p-4 text-right tabular">{copy.rankingCurrencyPrefix}{row.rev.toLocaleString("fr-FR")}</td>
                    <td className="p-4 text-right tabular text-muted-foreground">{copy.rankingCurrencyPrefix}{row.ads.toLocaleString("fr-FR")}</td>
                    <td className={`p-4 text-right tabular font-black ${profitGood ? "text-foreground" : "text-accent"}`}>
                      {copy.rankingCurrencyPrefix}{row.profit.toLocaleString("fr-FR")}
                    </td>
                    <td className="p-4 text-right tabular">{row.margin.toFixed(1)}%</td>
                    <td className="p-4 text-center">
                      <span className={`brutal-border-thin inline-block px-3 py-1 text-[10px] font-black tracking-widest ${statusClass}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 font-mono text-xs md:text-sm text-muted-foreground max-w-2xl">
          {copy.rankingFooter}
        </p>
      </div>
    </section>
  );
}

export function DecisionEngine({ copy }: { copy: LandingCopy }) {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24">
        <div className="text-xs uppercase tracking-widest opacity-70 font-bold mb-3">
          {copy.decisionEyebrow}
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
          {copy.decisionTitle.a}{" "}
          <span className="text-accent">{copy.decisionTitle.b}</span>{" "}
          {copy.decisionTitle.c}
        </h2>
        <p className="mt-5 text-base md:text-lg opacity-80 max-w-2xl">{copy.decisionLead}</p>

        <div className="grid md:grid-cols-3 gap-0 mt-12 brutal-border border-background">
          {copy.decisionRules.map((rule, i) => {
            const isKill = i === 2;
            return (
              <div
                key={rule.name}
                className={`p-8 md:p-10 ${
                  i < 2
                    ? "border-b md:border-b-0 md:border-r border-background bg-background text-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                <div
                  className={`${
                    i === 0
                      ? "bg-foreground text-background brutal-border-thin"
                      : isKill
                        ? "bg-accent-foreground text-accent brutal-border-thin border-accent-foreground"
                        : "brutal-border-thin"
                  } px-3 py-1 inline-block text-[10px] font-black tracking-widest mb-5`}
                >
                  {rule.name}
                </div>
                <div className="font-mono text-xl md:text-2xl font-black leading-tight">
                  {rule.ruleA}
                  <br />
                  <span className={isKill ? "opacity-70" : "text-muted-foreground"}>{rule.ruleConn}</span>{" "}
                  {rule.ruleB}
                </div>
                <p className={`mt-5 text-sm ${isKill ? "opacity-90" : "text-muted-foreground"}`}>
                  {rule.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ copy }: { copy: LandingCopy }) {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          {copy.testimonialsEyebrow}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mt-2 max-w-3xl">
          {copy.testimonialsTitle} <br />
          <span className="text-accent">{copy.testimonialsTitleAccent}</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">{copy.testimonialsLead}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {copy.testimonials.map((t) => (
            <div key={t.name} className="brutal-border-thin p-5 bg-background flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.photo}
                  alt={t.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-12 h-12 brutal-border-thin shrink-0 bg-muted object-cover"
                />
                <div className="min-w-0">
                  <div className="font-black text-sm leading-tight">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{t.city} · {t.niche}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0 brutal-border-thin">
                <div className="p-3 border-r border-foreground/30 bg-muted/40">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Avant</div>
                  <div className="text-lg font-black tracking-tight mt-0.5 line-through opacity-60">{t.before.v}</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{t.before.label}</div>
                </div>
                <div className="p-3 bg-accent text-accent-foreground">
                  <div className="text-[9px] uppercase tracking-widest opacity-80 font-bold">Après</div>
                  <div className="text-lg font-black tracking-tight mt-0.5">{t.after.v}</div>
                  <div className="text-[9px] uppercase tracking-widest opacity-80">{t.after.label}</div>
                </div>
              </div>

              <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground flex-1">
                « {t.note} »
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSecurity() {
  const items = [
    { Icon: ShieldCheck, t: "Tes données t'appartiennent", d: "Isolation stricte par compte (RLS Postgres). Personne ne lit tes chiffres. Jamais.", tag: "RLS · AES-256" },
    { Icon: Lock, t: "Shopify en lecture seule", d: "Sync OAuth read-only sur les commandes. Déconnexion en 1 clic. Aucune écriture sur ta boutique.", tag: "OAuth read-only" },
    { Icon: XCircle, t: "Annulation en 1 clic", d: "Sans engagement, sans hotline. L'accès reste actif jusqu'à la fin de la période payée.", tag: "Sans friction" },
  ];

  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
          Sécurité & confiance
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-12 max-w-3xl">
          POURQUOI <span className="text-accent">NOUS FAIRE CONFIANCE</span> ?
        </h2>
        <div className="grid md:grid-cols-3 gap-0 brutal-border">
          {items.map((c, idx) => (
            <div
              key={c.t}
              className={`p-7 md:p-8 bg-background ${idx < 2 ? "md:border-r md:border-foreground" : ""} ${idx === 1 ? "border-y md:border-y-0 border-foreground" : ""}`}
            >
              <div className="w-14 h-14 brutal-border-thin bg-foreground text-background flex items-center justify-center mb-5">
                <c.Icon className="w-7 h-7" strokeWidth={2.25} />
              </div>
              <div className="font-black text-lg md:text-xl tracking-tight mb-1">{c.t}</div>
              <div className="w-10 h-[3px] bg-accent mb-4" />
              <p className="font-mono text-xs md:text-sm text-muted-foreground leading-relaxed">{c.d}</p>
              <div className="mt-5 inline-block text-[10px] uppercase tracking-widest font-bold text-accent">{c.tag}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 brutal-border-thin px-5 md:px-7 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/30">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 shrink-0 text-accent" strokeWidth={2.5} />
            <div className="font-mono text-[11px] md:text-xs uppercase tracking-widest font-bold">
              Paiements Stripe · Certifié PCI-DSS niveau 1
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 shrink-0 text-accent" strokeWidth={2.5} />
            <div className="font-mono text-[11px] md:text-xs uppercase tracking-widest font-bold">
              Hébergement Cloudflare · Edge mondial · DDoS protégé
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pricing({
  copy,
  fcfaEquivalent = false,
}: {
  copy: LandingCopy;
  fcfaEquivalent?: boolean;
}) {
  const fcfaMap: Record<string, string> = {
    "$12": "≈ 7 200 F",
    "$29": "≈ 17 400 F",
    "$79": "≈ 47 400 F",
  };

  return (
    <section id="pricing" className="brutal-border-thin border-l-0 border-r-0 border-b-0 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          {copy.pricingEyebrow}
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mt-2 max-w-4xl">
          {copy.pricingTitle} <br />
          <span className="text-accent">{copy.pricingTitleAccent}</span>
        </h2>
        <p className="font-mono text-sm md:text-base text-muted-foreground mt-6 max-w-2xl">
          {copy.pricingLead}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14 items-stretch">
          {copy.plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col relative ${
                p.highlight
                  ? "brutal-border border-accent bg-background md:scale-[1.04] md:-my-2 shadow-[8px_8px_0_0_hsl(var(--accent))] p-8"
                  : "brutal-border-thin bg-muted/20 p-7 opacity-95"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground brutal-border-thin border-accent px-4 py-1.5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  ★ LE CHOIX DES OPÉRATEURS SÉRIEUX
                </div>
              )}
              <div className="mb-3">
                <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">PLAN</div>
                <div className={`font-black tracking-tight mt-1 ${p.highlight ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
                  {p.name}
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`font-black tracking-tighter ${p.highlight ? "text-6xl md:text-7xl text-accent" : "text-4xl md:text-5xl"}`}>
                  {p.price}
                </span>
                <span className="font-mono text-sm text-muted-foreground">{p.period}</span>
              </div>
              {fcfaEquivalent && fcfaMap[p.price] && (
                <div className="font-mono text-xs text-accent font-bold mb-1">
                  {fcfaMap[p.price]} / mois
                </div>
              )}
              <p className="font-mono text-xs text-muted-foreground mb-5">{p.tagline}</p>
              <ul className="space-y-2 mb-6 flex-1">
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
                className={`block text-center brutal-border px-5 py-3 font-black uppercase tracking-wider ${
                  p.highlight
                    ? "bg-accent text-accent-foreground border-accent text-base hover:bg-foreground hover:text-background hover:border-foreground"
                    : "bg-background text-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 brutal-border-thin p-6 md:p-8 bg-muted/40 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
          <div className="shrink-0 flex items-center justify-center bg-background brutal-border-thin px-5 py-3">
            <img src={stripeLogo} alt="Stripe" className="h-8 md:h-10 w-auto object-contain" loading="lazy" />
          </div>
          <div className="flex-1">
            <div className="font-black text-lg md:text-xl tracking-tight mb-1">
              PAIEMENT 100 % SÉCURISÉ
            </div>
            <p className="font-mono text-xs md:text-sm text-muted-foreground leading-relaxed">
              Carte bancaire traitée par <span className="text-foreground font-bold">Stripe</span>.
              {fcfaEquivalent && (
                <> Pour l'Afrique : <span className="text-foreground font-bold">Wave, Orange Money, Free Money</span> via Mobile Money lors du checkout.</>
              )}
              {" "}Aucun engagement, annulation à tout moment.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {(fcfaEquivalent ? ["VISA", "WAVE", "OM", "SSL"] : ["VISA", "MASTERCARD", "SSL"]).map((b) => (
              <span key={b} className="brutal-border-thin px-2.5 py-1 text-[10px] font-black tracking-widest font-mono">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-8">
            QUESTIONS FRÉQUENTES
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {copy.faq.map((item) => (
              <div key={item.q} className="brutal-border-thin p-6">
                <h4 className="font-black text-lg mb-2">{item.q}</h4>
                <p className="font-mono text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ copy }: { copy: LandingCopy }) {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter">
          {copy.ctaTitle} <br />
          <span className="text-accent">{copy.ctaTitleAccent}</span>
        </h2>
        <p className="font-mono text-sm md:text-base mt-6 text-background/70 max-w-xl mx-auto">
          {copy.ctaLead}
        </p>
        <Link
          to="/auth"
          search={{ mode: "signup" }}
          className="inline-block mt-10 brutal-border border-background bg-background text-foreground px-10 py-5 font-black uppercase tracking-wider text-lg hover:bg-accent hover:text-accent-foreground hover:border-accent"
        >
          {copy.ctaButton}
        </Link>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── *
 * CompetitorComparison — Netodash vs TripleWhale / BeProfit / Lifetimely    *
 * ────────────────────────────────────────────────────────────────────────── */

type CompCell = string | boolean;
type CompRow = { label: string; netodash: CompCell; triple: CompCell; beprofit: CompCell; lifetimely: CompCell; highlight?: boolean };

const COMP_ROWS: CompRow[] = [
  { label: "Prix d'entrée / mois", netodash: "$12", triple: "$129", beprofit: "$25", lifetimely: "$19", highlight: true },
  { label: "Plan illimité produits", netodash: "$79", triple: "$299+", beprofit: "$99", lifetimely: "$149" },
  { label: "Essai gratuit 14 jours", netodash: true, triple: false, beprofit: true, lifetimely: true },
  { label: "Sans carte bancaire", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "ROAS net (après COGS + frais)", netodash: true, triple: true, beprofit: true, lifetimely: true },
  { label: "Profit / commande en temps réel", netodash: true, triple: true, beprofit: true, lifetimely: true },
  { label: "Ranking produits winners / losers", netodash: true, triple: "Limité", beprofit: false, lifetimely: "Limité" },
  { label: "Décomposition coûts détaillée", netodash: true, triple: true, beprofit: true, lifetimely: true },
  { label: "Break-even & simulateur de scaling", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "Insights automatiques (alertes)", netodash: true, triple: true, beprofit: false, lifetimely: false },
  { label: "Mode COD (cash on delivery)", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "Multi-devises (USD, EUR, FCFA…)", netodash: true, triple: "USD only", beprofit: "USD only", lifetimely: "USD only" },
  { label: "Saisie manuelle + import", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "Interface FR native", netodash: true, triple: false, beprofit: false, lifetimely: false },
  { label: "Setup en moins de 60s", netodash: true, triple: false, beprofit: false, lifetimely: false },
];

function CompCellRender({ v, accent }: { v: CompCell; accent?: boolean }) {
  if (typeof v === "boolean") {
    return v ? (
      <span className={accent ? "text-accent font-black text-lg" : "text-foreground/80 font-bold"}>✓</span>
    ) : (
      <span className="text-muted-foreground/60 font-mono text-sm">—</span>
    );
  }
  return (
    <span className={accent ? "text-accent font-black" : "font-mono text-xs md:text-sm text-foreground/80"}>
      {v}
    </span>
  );
}

export function CompetitorComparison() {
  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background brutal-grid">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
            Netodash vs la concurrence
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-4">
            Pourquoi payer <span className="line-through text-muted-foreground">$129/mois</span>{" "}
            quand <span className="text-accent">$12</span> suffisent ?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Comparaison honnête face à TripleWhale, BeProfit et Lifetimely.
            Mêmes métriques essentielles, fraction du prix, pensé pour les dropshippers qui scalent à partir de zéro.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block brutal-border bg-background overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="brutal-border-thin border-l-0 border-r-0 border-t-0 bg-foreground text-background">
                <th className="text-left px-4 py-4 font-black uppercase tracking-wider text-xs">Fonctionnalité</th>
                <th className="px-4 py-4 bg-accent text-accent-foreground font-black uppercase tracking-wider text-xs">
                  Netodash
                </th>
                <th className="px-4 py-4 font-black uppercase tracking-wider text-xs">TripleWhale</th>
                <th className="px-4 py-4 font-black uppercase tracking-wider text-xs">BeProfit</th>
                <th className="px-4 py-4 font-black uppercase tracking-wider text-xs">Lifetimely</th>
              </tr>
            </thead>
            <tbody>
              {COMP_ROWS.map((r, i) => (
                <tr
                  key={r.label}
                  className={`brutal-border-thin border-l-0 border-r-0 border-t-0 ${
                    i === COMP_ROWS.length - 1 ? "border-b-0" : ""
                  } ${r.highlight ? "bg-accent/5" : ""}`}
                >
                  <td className="px-4 py-3 text-sm font-bold">{r.label}</td>
                  <td className="px-4 py-3 text-center bg-accent/10">
                    <CompCellRender v={r.netodash} accent />
                  </td>
                  <td className="px-4 py-3 text-center"><CompCellRender v={r.triple} /></td>
                  <td className="px-4 py-3 text-center"><CompCellRender v={r.beprofit} /></td>
                  <td className="px-4 py-3 text-center"><CompCellRender v={r.lifetimely} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile — stacked cards per competitor */}
        <div className="md:hidden space-y-6">
          {(["triple", "beprofit", "lifetimely"] as const).map((comp) => {
            const label = comp === "triple" ? "TripleWhale" : comp === "beprofit" ? "BeProfit" : "Lifetimely";
            return (
              <div key={comp} className="brutal-border bg-background">
                <div className="bg-foreground text-background px-4 py-3 font-black uppercase tracking-wider text-xs flex justify-between">
                  <span>Netodash</span>
                  <span>vs</span>
                  <span>{label}</span>
                </div>
                <div>
                  {COMP_ROWS.map((r, i) => (
                    <div
                      key={r.label}
                      className={`px-4 py-3 grid grid-cols-[1fr_auto_auto] gap-3 items-center text-xs ${
                        i !== COMP_ROWS.length - 1 ? "border-b border-foreground/10" : ""
                      } ${r.highlight ? "bg-accent/5" : ""}`}
                    >
                      <div className="font-bold">{r.label}</div>
                      <div className="text-center min-w-[40px]"><CompCellRender v={r.netodash} accent /></div>
                      <div className="text-center min-w-[40px] opacity-70"><CompCellRender v={r[comp]} /></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing trio rappel */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: "Starter", price: "$12", desc: "3 produits · 1 mode · 60j d'historique" },
            { name: "Pro", price: "$29", desc: "10 produits · Drop + COD · upsells · multi-zones", featured: true },
            { name: "Scale", price: "$79", desc: "Illimité · Analytics Pro · WhatsApp prio" },
          ].map((p) => (
            <div
              key={p.name}
              className={`brutal-border p-5 md:p-6 ${
                p.featured ? "bg-accent text-accent-foreground border-accent" : "bg-background"
              }`}
            >
              <div className="text-xs font-mono uppercase tracking-widest opacity-70">{p.name}</div>
              <div className="text-4xl md:text-5xl font-black tracking-tighter mt-1">
                {p.price}<span className="text-base font-bold opacity-70">/mois</span>
              </div>
              <div className="text-sm mt-3 opacity-80">{p.desc}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-block brutal-border bg-accent text-accent-foreground border-accent px-8 md:px-10 py-3 md:py-4 font-black uppercase tracking-wider text-sm md:text-base hover:bg-foreground hover:text-background hover:border-foreground"
          >
            Essayer Netodash gratuitement · 14 jours
          </Link>
          <p className="mt-3 text-[11px] font-mono text-muted-foreground">
            Sans CB · Annulation en 1 clic · Tarifs comparés au 06/2026, susceptibles d'évolution chez les concurrents
          </p>
        </div>
      </div>
    </section>
  );
}
