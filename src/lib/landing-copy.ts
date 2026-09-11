import lucasPhoto from "@/assets/testimonials/lucas.jpg";
import claraPhoto from "@/assets/testimonials/clara.jpg";
import awaPhoto from "@/assets/testimonials/awa.jpg";
import kouassiPhoto from "@/assets/testimonials/kouassi.jpg";

export type Plan = {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: readonly string[];
  cta: string;
  highlight: boolean;
};

export type FaqItem = { q: string; a: string };

export type TestimonialItem = {
  photo: string;
  name: string;
  city: string;
  niche: string;
  before: { label: string; v: string };
  after: { label: string; v: string };
  note: string;
};

export type ProductRankRow = {
  name: string;
  rev: number;
  ads: number;
  profit: number;
  margin: number;
  status: "RENTABLE" | "BREAK EVEN" | "PAS RENTABLE";
};

export type LandingCopy = {
  // SEO
  seoTitle: string;
  seoDescription: string;
  // Hero
  heroBadge: string;
  heroH1Line1: string;
  heroH1Line2: string;
  heroSubtitle: string;
  heroSubtitleBold: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroSmallprint: string;
  // Trust bar
  trustStats: ReadonlyArray<{ v: string; l: string }>;
  // Logos
  platformsHeading: string;
  platforms: ReadonlyArray<{ src: string; alt: string }>;
  // 3 piliers
  pillarsHeading?: string;
  pillars: ReadonlyArray<{ n: string; t: string; d: string }>;
  // Showcase laptop
  showcaseEyebrow: string;
  showcaseTitleHtml: { before: string; accent: string; after: string };
  showcaseLead: string;
  showcaseList: readonly string[];
  // Avant/Après
  beforeAfterEyebrow: string;
  beforeAfterTitle: string;
  beforeAfterAccent: string;
  beforeAfterBeforeBadge: string;
  beforeAfterAfterBadge: string;
  beforeAfterBeforeRows: ReadonlyArray<{ k: string; v: string; mode?: "muted" | "accent" }>;
  beforeAfterAfterRows: ReadonlyArray<{ k: string; v: string; mode?: "muted" | "accent" }>;
  beforeAfterBeforeFooter: { plain: string; bold: string };
  beforeAfterAfterFooter: { plain: string; bold: string };
  beforeAfterTagline: { plain: string; bold: string };
  // Product ranking
  rankingEyebrow: string;
  rankingTitle: string;
  rankingTitleAccent: string;
  rankingLead: string;
  rankingCols: readonly [string, string, string, string, string, string];
  rankingRows: ReadonlyArray<ProductRankRow>;
  rankingCurrencyPrefix: string;
  rankingFooter: string;
  // Decision engine
  decisionEyebrow: string;
  decisionTitle: { a: string; b: string; c: string };
  decisionLead: string;
  decisionRules: readonly [
    { name: string; ruleA: string; ruleConn: string; ruleB: string; copy: string },
    { name: string; ruleA: string; ruleConn: string; ruleB: string; copy: string },
    { name: string; ruleA: string; ruleConn: string; ruleB: string; copy: string },
  ];
  // Testimonials
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonialsTitleAccent: string;
  testimonialsLead: string;
  testimonials: ReadonlyArray<TestimonialItem>;
  // Pricing
  pricingEyebrow: string;
  pricingTitle: string;
  pricingTitleAccent: string;
  pricingLead: string;
  plans: ReadonlyArray<Plan>;
  // FAQ
  faq: ReadonlyArray<FaqItem>;
  // CTA
  ctaTitle: string;
  ctaTitleAccent: string;
  ctaLead: string;
  ctaButton: string;
  // Footer
  footerTagline: string;
  footerBaseline: string;
};

// ───────────── COPYX ─────────────
// Netodash est calibré à 100 % pour les boutiques CopyX : les clients paient
// Les clients paient soit un acompte, soit la totalité, encaissés via XaalipSay
// (5 % de frais à l'encaissement, retrait gratuit) directement sur le site.
// Plus aucune notion de COD ni de Shopify dans cette landing.
const COPYX: LandingCopy = {
  seoTitle:
    "Netodash — La rentabilité réelle de ta boutique CopyX (marge nette en FCFA)",
  seoDescription:
    "Netodash lit tes ventes CopyX — acomptes et encaissements XaalipSay — et calcule ta vraie marge : pub, taxe Meta, COGS, livraison, frais XaalipSay (5 % à l'encaissement) et remboursements. Décision par produit, en FCFA.",

  heroBadge: "100 % calibré pour CopyX",
  heroH1Line1: "TA BOUTIQUE COPYX ENCAISSE.",
  heroH1Line2: "COMBIEN AS-TU GARDÉ ?",
  heroSubtitle:
    "Acomptes, encaissements XaalipSay, colis à livrer : Netodash transforme tes ventes CopyX en un seul chiffre qui compte —",
  heroSubtitleBold: "ta marge nette réelle, produit par produit.",
  heroCtaPrimary: "Essayer gratuitement 7 jours →",
  heroCtaSecondary: "Voir les tarifs",
  heroSmallprint: "Aucune carte bancaire requise · Accès complet · Annule à tout moment",

  trustStats: [
    { v: "+800", l: "Marchands CopyX" },
    { v: "2,5 Md FCFA", l: "Encaissements pilotés / mois" },
    { v: "32 %", l: "De marge nette gagnée en moyenne" },
    { v: "4,9 / 5", l: "Note utilisateurs" },
  ],

  platformsHeading: "Encaissements XaalipSay · 5 % à l'encaissement · retrait gratuit",
  platforms: [],

  pillars: [
    {
      n: "01",
      t: "ENCAISSÉ ≠ VENDU",
      d: "Netodash sépare les acomptes déjà encaissés, les paiements intégraux et le reste à encaisser à la livraison. Tu sais ce qui est réellement dans ta poche.",
    },
    {
      n: "02",
      t: "MARGE NETTE RÉELLE",
      d: "Pub, taxe Meta, COGS, livraison, frais XaalipSay (5 % à l'encaissement) et remboursements : tout est déduit. Il ne reste que ton vrai profit, en FCFA.",
    },
    {
      n: "03",
      t: "DÉCISION PAR PRODUIT",
      d: "Quel produit te rapporte, lequel te coule, lequel mérite d'être scalé. Une réponse par produit, pas un débat.",
    },
  ],

  showcaseEyebrow: "▍ L'OPERATOR CONSOLE",
  showcaseTitleHtml: {
    before: "Pilote ta rentabilité ",
    accent: "comme un trader",
    after: " pilote son book.",
  },
  showcaseLead:
    "Saisis tes ventes CopyX du jour — ou synchronise ton compte depuis l'onglet Synchro. Netodash classe tes produits par profit net et te dit quoi scaler, surveiller ou couper.",
  showcaseList: [
    "Ventes CopyX consolidées : acomptes + encaissements XaalipSay",
    "Ranking des produits par profit net",
    "Décision Scale / Watch / Kill chaque matin",
  ],

  beforeAfterEyebrow: "ÇA TE PARLE ?",
  beforeAfterTitle: "7 500 000 FCFA DE VENTES COPYX.",
  beforeAfterAccent: "EST-CE QUE TU GAGNES VRAIMENT DE L'ARGENT ?",
  beforeAfterBeforeBadge: "😵 Sans NETODASH",
  beforeAfterAfterBadge: "✅ Avec NETODASH",
  beforeAfterBeforeRows: [
    { k: "Ventes CopyX (30j)", v: "7 500 000 F" },
    { k: "Encaissé vs reste à encaisser ?", v: "≈ ?", mode: "accent" },
    { k: "Budget pub (Meta / TikTok)", v: "3 120 000 F" },
    { k: "ROAS affiché Meta", v: "2,4 ✨", mode: "accent" },
    { k: "Frais XaalipSay (5 %) ?", v: "≈ ?", mode: "accent" },
    { k: "Marge nette réelle", v: "AUCUNE IDÉE.", mode: "accent" },
  ],
  beforeAfterAfterRows: [
    { k: "Encaissé via XaalipSay", v: "5 400 000 F" },
    { k: "Reste à encaisser (livraison)", v: "2 100 000 F" },
    { k: "− COGS + livraison", v: "− 2 400 000 F" },
    { k: "− Pub + taxe 18 %", v: "− 3 681 600 F" },
    { k: "− Frais XaalipSay (5 %)", v: "− 270 000 F" },
    { k: "Marge nette si tout est livré", v: "1 148 400 F", mode: "accent" },
    { k: "ROAS net sur encaissé", v: "1,47", mode: "accent" },
  ],
  beforeAfterBeforeFooter: {
    plain:
      "Tu scales sur le ROAS Meta. Mais entre les acomptes, les colis non livrés et les 5 % de frais à l'encaissement, la vraie question reste : ",
    bold: "« Combien j'ai gardé ? »",
  },
  beforeAfterAfterFooter: {
    plain: "Tu sais ",
    bold:
      "ce qui est encaissé, ce qui reste à encaisser, et ce que chaque produit te rapporte vraiment.",
  },
  beforeAfterTagline: {
    plain: "9 marchands sur 10 pilotent au ROAS Meta gonflé. ",
    bold: "NETODASH te donne la marge nette de ta boutique CopyX en 2 minutes par jour.",
  },

  rankingEyebrow: "▍ PRODUCT PROFIT RANKING",
  rankingTitle: "QUELS PRODUITS TE FONT",
  rankingTitleAccent: "VRAIMENT GAGNER DE L'ARGENT",
  rankingLead:
    "Netodash classe tes produits CopyX par profit net — après pub, taxe Meta, COGS, livraison et frais XaalipSay (5 % à l'encaissement). Chaque ligne te dit, en un mot, quoi faire aujourd'hui.",
  rankingCols: ["Produit", "Ventes (FCFA)", "Pub (FCFA)", "Profit net (FCFA)", "Marge", "Statut"],
  rankingRows: [
    { name: "Sérum éclat 30ml", rev: 11_052_000, ads: 3_120_000, profit: 3_888_000, margin: 35.2, status: "RENTABLE" },
    { name: "Montre minimaliste", rev: 7_428_000, ads: 2_460_000, profit: 1_524_000, margin: 20.5, status: "BREAK EVEN" },
    { name: "Correcteur de posture", rev: 5_892_000, ads: 2_340_000, profit: 588_000, margin: 10.0, status: "PAS RENTABLE" },
    { name: "Diffuseur d'ambiance", rev: 4_290_000, ads: 1_092_000, profit: 1_428_000, margin: 33.3, status: "RENTABLE" },
  ],
  rankingCurrencyPrefix: "",
  rankingFooter:
    "→ Tu vois immédiatement où mettre ton budget pub, et où arrêter de saigner.",

  decisionEyebrow: "▍ DECISION ENGINE",
  decisionTitle: { a: "RENTABLE.", b: "BREAK EVEN.", c: "PAS RENTABLE." },
  decisionLead:
    "Trois statuts. Une logique hybride marge + ROAS net sur l'encaissé. Pas de débat, pas de feeling — juste la décision.",
  decisionRules: [
    {
      name: "🚀 RENTABLE",
      ruleA: "Marge > 30%",
      ruleConn: "ET",
      ruleB: "ROAS net > 2.5",
      copy: "Pousse le budget. Le produit tient la route en volume.",
    },
    {
      name: "⚖ BREAK EVEN",
      ruleA: "Marge 15–30%",
      ruleConn: "OU",
      ruleB: "ROAS 1.8–2.5",
      copy: "Optimise créa, prix ou COGS avant de scaler.",
    },
    {
      name: "🛑 PAS RENTABLE",
      ruleA: "Marge < 15%",
      ruleConn: "OU",
      ruleB: "ROAS < 1.8",
      copy: "Coupe ou pivote. Tu perds de l'argent à chaque vente.",
    },
  ],

  testimonialsEyebrow: "▍ RÉSULTATS RÉELS · MARCHANDS COPYX",
  testimonialsTitle: "AVANT NETODASH.",
  testimonialsTitleAccent: "APRÈS NETODASH.",
  testimonialsLead:
    "Pas de quotes vagues. Des chiffres avant / après, sur des boutiques CopyX.",
  testimonials: [
    {
      photo: claraPhoto,
      name: "Clara M.",
      city: "Cotonou 🇧🇯",
      niche: "Beauté / skincare",
      before: { label: "ROAS net", v: "1.4" },
      after: { label: "ROAS net", v: "2.2" },
      note: "+57 % de ROAS net en 6 semaines après avoir coupé 2 produits qui maquillaient les chiffres.",
    },
    {
      photo: lucasPhoto,
      name: "Lucas D.",
      city: "Bamako 🇲🇱",
      niche: "Accessoires tech",
      before: { label: "Profit / mois", v: "1 260 000 F" },
      after: { label: "Profit / mois", v: "3 180 000 F" },
      note: "Le ranking m'a montré qu'un seul produit faisait 70 % de mon profit. J'ai scalé que lui.",
    },
    {
      photo: awaPhoto,
      name: "Awa T.",
      city: "Dakar 🇸🇳",
      niche: "Bijoux fantaisie",
      before: { label: "Acomptes suivis", v: "Aucun" },
      after: { label: "Acomptes suivis", v: "100 %" },
      note: "Je ne savais pas combien de clients avaient payé un acompte et combien restaient à encaisser. Maintenant je le vois chaque matin.",
    },
    {
      photo: kouassiPhoto,
      name: "Kouassi R.",
      city: "Abidjan 🇨🇮",
      niche: "Gadgets maison",
      before: { label: "Décisions / sem.", v: "Au feeling" },
      after: { label: "Décisions / sem.", v: "Scale / Kill" },
      note: "2 min/jour. Je sais exactement où mettre 60 000 F de plus, ou couper.",
    },
  ],

  pricingEyebrow: "▍ PRICING",
  pricingTitle: "PENSÉ POUR LES",
  pricingTitleAccent: "MARCHANDS COPYX.",
  pricingLead:
    "7 jours d'essai gratuit avec accès complet, sans carte bancaire. Ensuite : $20/mois, tout illimité — ventes CopyX, acomptes, Analytics Pro, Decision Engine, export CSV.",
  plans: [
    {
      name: "Essai gratuit",
      price: "0 $",
      period: "/ 7 jours",
      tagline: "Accès complet 7 jours, sans carte bancaire",
      features: [
        "Tout débloqué pendant l'essai",
        "Saisies cumulées multi-jours",
        "Aucun engagement",
        "Aucune carte bancaire",
      ],
      cta: "Démarrer l'essai",
      highlight: false,
    },
    {
      name: "Netodash",
      price: "$20",
      period: "/mois",
      tagline: "Tout illimité, tout inclus",
      features: [
        "Ventes CopyX illimitées",
        "Suivi acomptes + encaissements XaalipSay",
        "Analytics Pro (scoring, waterfall, break-even, simulateur)",
        "Decision Engine · Insights automatiques",
        "Upsells · Export CSV",
        "Historique illimité",
        "Support WhatsApp",
      ],
      cta: "Choisir Netodash",
      highlight: true,
    },
  ],

  faq: [
    {
      q: "Est-ce que ça marche avec ma boutique CopyX ?",
      a: "Oui, c'est exactement notre base : Netodash est calibré à 100 % pour les ventes de ta boutique CopyX. Tu saisis tes ventes du jour (1 minute), ou tu connectes ton compte CopyX depuis l'onglet Synchro, et Netodash calcule ta marge nette réelle.",
    },
    {
      q: "Comment sont gérés les acomptes ?",
      a: "Chaque vente CopyX est suivie : acompte encaissé via XaalipSay, paiement intégral, et reste à encaisser à la livraison. Tu vois ce qui est réellement dans ta poche — pas seulement ce que ta boutique affiche.",
    },
    {
      q: "Quels frais sont déduits de ma marge ?",
      a: "Pub + taxe Meta, COGS, livraison, frais XaalipSay (5 % à l'encaissement, retrait gratuit) et remboursements. Tout est paramétrable sur ton profil.",
    },
    {
      q: "Comment fonctionne l'essai gratuit ?",
      a: "7 jours complets, sans carte bancaire, accès complet. À la fin, tu passes à $20/mois tout illimité — ou tu arrêtes, sans frais.",
    },
    {
      q: "Puis-je changer de plan ou annuler ?",
      a: "Oui, à tout moment depuis Mon plan. Tu annules en un clic — ton accès reste actif jusqu'à la fin de la période payée.",
    },
  ],

  ctaTitle: "ARRÊTE DE DEVINER.",
  ctaTitleAccent: "MESURE.",
  ctaLead:
    "7 jours d'essai gratuit. Aucune carte requise. Saisis tes ventes CopyX, Netodash te dit ce qu'il te reste.",
  ctaButton: "Créer mon compte →",

  footerTagline: "Le cockpit de rentabilité des marchands CopyX.",
  footerBaseline: "POUR LES BOUTIQUES COPYX",
};

export const LANDING_COPY: LandingCopy = COPYX;
