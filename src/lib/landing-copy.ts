import type { BusinessMode } from "@/lib/use-active-mode";
import shopifyLogo from "@/assets/platforms/shopify.webp";
import wooLogo from "@/assets/platforms/woocommerce.webp";
import youcanLogo from "@/assets/platforms/youcan.webp";
import lucasPhoto from "@/assets/testimonials/lucas.jpg";
import claraPhoto from "@/assets/testimonials/clara.jpg";
import marcoPhoto from "@/assets/testimonials/marco.jpg";
import juliaPhoto from "@/assets/testimonials/julia.jpg";
import awaPhoto from "@/assets/testimonials/awa.jpg";
import fatouPhoto from "@/assets/testimonials/fatou.jpg";
import kouassiPhoto from "@/assets/testimonials/kouassi.jpg";
import yaoPhoto from "@/assets/testimonials/yao.jpg";

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

// ───────────── DROPSHIPPING ─────────────
const DROPSHIPPING: LandingCopy = {
  seoTitle:
    "Netodash — Dashboard rentabilité dropshipping Shopify (ROAS net, marge réelle Meta Ads)",
  seoDescription:
    "Netodash : le dashboard de rentabilité réelle pour les dropshippers Shopify. Calcule ton ROAS net après coût produit, fulfillment, frais Stripe et taxes pub Meta / TikTok / Google.",

  heroBadge: "Built for Shopify Dropshippers",
  heroH1Line1: "TON SHOPIFY DIT $10K.",
  heroH1Line2: "COMBIEN AS-TU GARDÉ ?",
  heroSubtitle:
    "Netodash te montre le vrai profit derrière chaque produit, chaque pub et chaque vente —",
  heroSubtitleBold:
    "pour savoir exactement quoi scaler, surveiller ou couper.",
  heroCtaPrimary: "Essayer gratuitement 14 jours →",
  heroCtaSecondary: "Voir les tarifs",
  heroSmallprint: "Aucune carte bancaire requise · Plan Pro débloqué · Annule à tout moment",

  trustStats: [
    { v: "+800", l: "Dropshippers actifs" },
    { v: "$4.2M", l: "CA piloté chaque mois" },
    { v: "32 %", l: "De marge nette gagnée en moyenne" },
    { v: "4,9 / 5", l: "Note utilisateurs" },
  ],

  platformsHeading: "Compatible avec ton stack dropshipping",
  platforms: [
    { src: shopifyLogo, alt: "Shopify" },
    { src: wooLogo, alt: "WooCommerce" },
    { src: youcanLogo, alt: "YouCan" },
  ],

  pillars: [
    {
      n: "01",
      t: "MARGE NETTE RÉELLE",
      d: "CA Shopify moins pub, COGS, fulfillment, frais Stripe et refunds. Le seul chiffre qui paie ton loyer.",
    },
    {
      n: "02",
      t: "ROAS NET",
      d: "Pas le ROAS gonflé de Meta. Le ratio entre ce que tu encaisses vraiment et ce que tu dépenses, toutes plateformes confondues.",
    },
    {
      n: "03",
      t: "DÉCISION PAR PRODUIT",
      d: "Sache exactement quel produit te rapporte, lequel te coule, et lequel mérite d'être scalé sans hésiter.",
    },
  ],

  showcaseEyebrow: "▍ L'OPERATOR CONSOLE",
  showcaseTitleHtml: {
    before: "Pilote ton Shopify ",
    accent: "comme un trader",
    after: " pilote son book.",
  },
  showcaseLead:
    "Connecte Shopify ou saisis tes chiffres. Netodash classe tes produits par profit net et te dit, en un mot, lequel scaler, lequel surveiller, lequel couper.",
  showcaseList: [
    "Product Profit Ranking quotidien",
    "Winners / Losers en un coup d'œil",
    "Décision Scale / Watch / Kill par produit",
  ],

  beforeAfterEyebrow: "ÇA TE PARLE ?",
  beforeAfterTitle: "$12 480 DE CA SHOPIFY.",
  beforeAfterAccent: "EST-CE QUE TU GAGNES VRAIMENT DE L'ARGENT ?",
  beforeAfterBeforeBadge: "😵‍💫 Sans NETODASH",
  beforeAfterAfterBadge: "✅ Avec NETODASH",
  beforeAfterBeforeRows: [
    { k: "CA Shopify (30j)", v: "$12 480" },
    { k: "Budget Meta Ads", v: "$5 200" },
    { k: "ROAS affiché Meta", v: "2,4 ✨", mode: "accent" },
    { k: "COGS / fulfillment ?", v: "¯\\_(ツ)_/¯", mode: "accent" },
    { k: "Frais Stripe + refunds ?", v: "≈ ?", mode: "accent" },
    { k: "Marge nette réelle", v: "AUCUNE IDÉE.", mode: "accent" },
  ],
  beforeAfterAfterRows: [
    { k: "CA encaissé net", v: "$11 856" },
    { k: "− COGS + fulfillment", v: "− $3 940" },
    { k: "− Meta Ads + taxe 18%", v: "− $6 136" },
    { k: "− Stripe + refunds", v: "− $612" },
    { k: "Marge nette", v: "$1 168", mode: "accent" },
    { k: "ROAS net réel", v: "1,9", mode: "accent" },
  ],
  beforeAfterBeforeFooter: {
    plain:
      "Tu scales sur le ROAS Meta. Mais à la fin du mois tu regardes ton Stripe et tu te demandes : ",
    bold: "« Pourquoi je n'ai presque rien gardé ? »",
  },
  beforeAfterAfterFooter: {
    plain: "Tu sais ",
    bold: "exactement ce que tu gardes, sur quel produit, et quelle créa scaler la semaine prochaine.",
  },
  beforeAfterTagline: {
    plain: "9 dropshippers sur 10 scalent sur le ROAS Meta gonflé. ",
    bold: "NETODASH te montre la vraie marge en 2 minutes par jour.",
  },

  rankingEyebrow: "▍ PRODUCT PROFIT RANKING",
  rankingTitle: "QUELS PRODUITS TE FONT",
  rankingTitleAccent: "VRAIMENT GAGNER DE L'ARGENT",
  rankingLead:
    "Netodash classe tes produits par profit net. Chaque ligne te dit, en un mot, quoi faire aujourd'hui.",
  rankingCols: ["Produit", "Revenue", "Ad Spend", "Profit net", "Marge", "Status"],
  rankingRows: [
    { name: "Massage Gun Pro", rev: 18420, ads: 5200, profit: 6480, margin: 35.2, status: "RENTABLE" },
    { name: "Sleek LED Mirror", rev: 12380, ads: 4100, profit: 2540, margin: 20.5, status: "BREAK EVEN" },
    { name: "Posture Corrector V2", rev: 9820, ads: 3900, profit: 980, margin: 10.0, status: "PAS RENTABLE" },
    { name: "Aura Diffuser", rev: 7150, ads: 1820, profit: 2380, margin: 33.3, status: "RENTABLE" },
  ],
  rankingCurrencyPrefix: "$",
  rankingFooter:
    "→ Tu vois immédiatement où mettre ton budget pub, et où arrêter de saigner.",

  decisionEyebrow: "▍ DECISION ENGINE",
  decisionTitle: { a: "RENTABLE.", b: "BREAK EVEN.", c: "PAS RENTABLE." },
  decisionLead:
    "Trois statuts. Une logique hybride marge + ROAS net. Pas de débat, pas de feeling — juste la décision.",
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

  testimonialsEyebrow: "▍ RÉSULTATS RÉELS",
  testimonialsTitle: "AVANT NETODASH.",
  testimonialsTitleAccent: "APRÈS NETODASH.",
  testimonialsLead:
    "Pas de quotes vagues. Juste des chiffres avant / après — sur les mêmes boutiques.",
  testimonials: [
    {
      photo: claraPhoto,
      name: "Clara M.",
      city: "Paris 🇫🇷",
      niche: "Beauté / skincare",
      before: { label: "ROAS net", v: "1.4" },
      after: { label: "ROAS net", v: "2.2" },
      note: "+57% en 6 semaines après avoir killé 2 produits qui maquillaient les chiffres.",
    },
    {
      photo: lucasPhoto,
      name: "Lucas D.",
      city: "Lyon 🇫🇷",
      niche: "Accessoires tech",
      before: { label: "Profit / mois", v: "$2 100" },
      after: { label: "Profit / mois", v: "$5 300" },
      note: "Le ranking m'a montré que 1 produit faisait 70% de mon profit. J'ai scalé que lui.",
    },
    {
      photo: awaPhoto,
      name: "Awa T.",
      city: "Dakar 🇸🇳",
      niche: "Bijoux fantaisie",
      before: { label: "Marge nette", v: "8%" },
      after: { label: "Marge nette", v: "27%" },
      note: "Le COGS et les refunds me bouffaient tout. Maintenant je sais quoi corriger.",
    },
    {
      photo: kouassiPhoto,
      name: "Kouassi R.",
      city: "Abidjan 🇨🇮",
      niche: "Gadgets maison",
      before: { label: "Décisions / sem.", v: "Au feeling" },
      after: { label: "Décisions / sem.", v: "Scale / Kill" },
      note: "2 min/jour. Je sais exactement où mettre $100 de plus, ou couper.",
    },
  ],

  pricingEyebrow: "▍ PRICING",
  pricingTitle: "PENSÉ POUR LES",
  pricingTitleAccent: "OPÉRATEURS SHOPIFY SÉRIEUX.",
  pricingLead:
    "14 jours d'essai gratuit avec le plan Pro débloqué. Ensuite, Starter à $12/mois (3 produits), Pro à $29/mois (10 produits, Drop + COD, upsells), Scale à $79/mois (illimité + Analytics Pro). Économise 20 % en facturation annuelle.",
  plans: [
    {
      name: "Essai gratuit",
      price: "0 $",
      period: "/ 14 jours",
      tagline: "Plan Pro débloqué, sans carte bancaire",
      features: [
        "Jusqu'à 10 produits suivis",
        "Drop ET COD en parallèle",
        "Dashboard rentabilité + Analytics Pro",
        "Saisies cumulées multi-jours",
        "Aucun engagement",
      ],
      cta: "Démarrer l'essai",
      highlight: false,
    },
    {
      name: "Starter",
      price: "$12",
      period: "/mois",
      tagline: "Démarrer un premier produit · $115/an (−20 %)",
      features: [
        "3 produits actifs",
        "Dropshipping OU COD (au choix)",
        "Dashboard rentabilité complet",
        "1 zone de livraison COD",
        "Historique 60 jours glissants",
      ],
      cta: "Choisir Starter",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mois",
      tagline: "Valider 1 à 3 winners · $278/an (−20 %)",
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
      price: "$79",
      period: "/mois",
      tagline: "Scaler avec Analytics Pro · $756/an (−20 %)",
      features: [
        "Produits illimités",
        "Upsells illimités",
        "Tout ce qui est inclus dans Pro",
        "Analytics Pro EXCLUSIF (scoring, waterfall, break-even, simulateur, insights)",
        "Support prioritaire WhatsApp",
      ],
      cta: "Choisir Scale",
      highlight: false,
    },
  ],

  faq: [
    {
      q: "Comment fonctionne l'essai gratuit ?",
      a: "14 jours complets, sans carte bancaire, avec le plan Pro débloqué (10 produits, Drop + COD, Analytics Pro). À la fin, tu choisis Starter, Pro ou Scale — ou tu arrêtes, sans frais.",
    },
    {
      q: "C'est pour quel type d'e-commerce ?",
      a: "NETODASH gère le Dropshipping (Shopify + Meta/TikTok/Google Ads) ET le COD (Cash on Delivery, vente par appel avec zones de livraison). Tu peux utiliser les deux modes en parallèle dès le plan Pro.",
    },
    {
      q: "Starter, Pro ou Scale ?",
      a: "Starter ($12) = 3 produits, Drop OU COD, historique 60j. Pro ($29) = 10 produits, Drop ET COD en parallèle, upsells, multi-zones COD, historique illimité, export CSV. Scale ($79) = produits illimités + Analytics Pro EXCLUSIF (scoring, waterfall, break-even, simulateur, insights) + WhatsApp prioritaire.",
    },
    {
      q: "Mensuel ou annuel ?",
      a: "Annuel = −20 % à l'année : Starter $115/an, Pro $278/an, Scale $756/an. Tu peux changer ou annuler à tout moment.",
    },
    {
      q: "Puis-je changer de plan ou annuler ?",
      a: "Oui, à tout moment depuis Mon plan. Tu passes de Starter à Pro/Scale (ou inversement), ou tu annules en un clic — ton accès reste actif jusqu'à la fin de la période payée.",
    },
  ],

  ctaTitle: "ARRÊTE DE DEVINER.",
  ctaTitleAccent: "MESURE.",
  ctaLead: "14 jours d'essai gratuit. Aucune carte requise. Sors enfin de l'aveugle.",
  ctaButton: "Créer mon compte →",

  footerTagline:
    "Le dashboard de rentabilité réelle pour les dropshippers Shopify.",
  footerBaseline: "BUILT FOR SHOPIFY DROPSHIPPERS",
};

// ───────────── COD AFRIQUE ─────────────
const COD: LandingCopy = {
  seoTitle:
    "Netodash COD — Dashboard rentabilité Cash on Delivery (Sénégal, Côte d'Ivoire, FCFA)",
  seoDescription:
    "Le dashboard de rentabilité pour le COD en Afrique de l'Ouest. Suis taux de confirmation, taux de livraison, coût par zone et profit net en FCFA. Conçu pour le call center et la logistique terrain.",

  heroBadge: "Conçu pour le COD en Afrique de l'Ouest",
  heroH1Line1: "TU FAIS 100 COMMANDES/JOUR.",
  heroH1Line2: "COMBIEN SONT VRAIMENT PAYÉES ?",
  heroSubtitle:
    "Netodash mesure ce qui compte vraiment en COD : confirmation, livraison, coût par zone et pub —",
  heroSubtitleBold:
    "pour savoir exactement ce que ta boutique te rapporte en FCFA chaque jour.",
  heroCtaPrimary: "Tester gratuitement 14 jours →",
  heroCtaSecondary: "Voir les tarifs",
  heroSmallprint: "Sans carte bancaire · Plan Pro débloqué · Annule à tout moment",

  trustStats: [
    { v: "+400", l: "Vendeurs COD actifs" },
    { v: "65 %", l: "Taux de livraison moyen suivi" },
    { v: "−28 %", l: "De pertes logistiques évitées" },
    { v: "4,8 / 5", l: "Note utilisateurs Afrique" },
  ],

  platformsHeading: "Compatible avec ton stack COD (Sénégal · CI · Mali · Bénin)",
  platforms: [
    { src: shopifyLogo, alt: "Shopify" },
    { src: youcanLogo, alt: "YouCan" },
    { src: wooLogo, alt: "WooCommerce" },
  ],

  pillars: [
    {
      n: "01",
      t: "TAUX DE CONFIRMATION",
      d: "Mesure combien de commandes reçues passent vraiment au closing. Repère tes meilleures sources de leads et les agents qui convertissent le mieux.",
    },
    {
      n: "02",
      t: "TAUX DE LIVRAISON",
      d: "Suis le ratio confirmées → livrées. C'est là que ton cash se gagne ou se perd. Tableau de bord clair en FCFA.",
    },
    {
      n: "03",
      t: "COÛT LIVRAISON PAR ZONE",
      d: "Définis tes zones (Dakar, régions, hors-pays). Chaque livraison est imputée à sa zone : tu connais ton vrai coût logistique.",
    },
  ],

  showcaseEyebrow: "▍ L'OPERATOR CONSOLE COD",
  showcaseTitleHtml: {
    before: "Pilote ton COD ",
    accent: "comme un directeur d'agence",
    after: " pilote son call center.",
  },
  showcaseLead:
    "Saisis tes commandes reçues, confirmées, livrées par zone. Netodash calcule ton profit net en FCFA, par jour, par produit, et te dit quel canal pousser.",
  showcaseList: [
    "Taux confirmation / livraison quotidien",
    "Coût livraison ventilé par zone",
    "Profit net en FCFA, par produit",
  ],

  beforeAfterEyebrow: "ÇA TE PARLE ?",
  beforeAfterTitle: "300 COMMANDES REÇUES.",
  beforeAfterAccent: "COMBIEN SONT VRAIMENT PAYÉES À LA FIN DU MOIS ?",
  beforeAfterBeforeBadge: "😵‍💫 Sans NETODASH",
  beforeAfterAfterBadge: "✅ Avec NETODASH",
  beforeAfterBeforeRows: [
    { k: "Commandes reçues (30j)", v: "300" },
    { k: "Confirmées (closing)", v: "180" },
    { k: "Taux de livraison ?", v: "≈ 60 % ?", mode: "accent" },
    { k: "Coût livraison par zone ?", v: "¯\\_(ツ)_/¯", mode: "accent" },
    { k: "Retours non payés ?", v: "≈ ?", mode: "accent" },
    { k: "Profit net réel", v: "AUCUNE IDÉE.", mode: "accent" },
  ],
  beforeAfterAfterRows: [
    { k: "Livrées payées net", v: "168 cmd" },
    { k: "− Coût produit (livrées)", v: "− 1 260 000 F" },
    { k: "− Livraison ventilée par zone", v: "− 420 000 F" },
    { k: "− Budget pub (Meta/TikTok)", v: "− 850 000 F" },
    { k: "Profit net (FCFA)", v: "+ 720 000 F", mode: "accent" },
    { k: "Marge nette", v: "21 %", mode: "accent" },
  ],
  beforeAfterBeforeFooter: {
    plain:
      "Tu paies des livraisons que tu ne récupères pas, ton call center pousse fort mais ton cash en fin de mois te dit : ",
    bold: "« Où est passé l'argent ? »",
  },
  beforeAfterAfterFooter: {
    plain: "Tu sais ",
    bold: "exactement quelle zone te coûte trop cher, quel produit livre vraiment, et quel agent ferme le mieux.",
  },
  beforeAfterTagline: {
    plain:
      "9 vendeurs COD sur 10 ne mesurent pas leur vrai profit par zone. ",
    bold: "NETODASH te le montre en FCFA, en 2 minutes par jour.",
  },

  rankingEyebrow: "▍ PROFIT RANKING PAR PRODUIT",
  rankingTitle: "QUELS PRODUITS LIVRENT",
  rankingTitleAccent: "ET QUELS PRODUITS TE COÛTENT",
  rankingLead:
    "Netodash classe tes produits par profit net en FCFA, après livraison ventilée par zone. Chaque ligne te dit, en un mot, quoi faire aujourd'hui.",
  rankingCols: ["Produit", "Reçues", "Livrées", "Profit net (F)", "Marge", "Status"],
  rankingRows: [
    { name: "Montre Connectée Pro", rev: 180, ads: 105, profit: 1_240_000, margin: 28.5, status: "RENTABLE" },
    { name: "Lampe LED Décorative", rev: 120, ads: 72, profit: 540_000, margin: 18.0, status: "BREAK EVEN" },
    { name: "Casque Bluetooth X3", rev: 95, ads: 38, profit: 120_000, margin: 6.5, status: "PAS RENTABLE" },
    { name: "Diffuseur Parfum Auto", rev: 70, ads: 48, profit: 680_000, margin: 31.2, status: "RENTABLE" },
  ],
  rankingCurrencyPrefix: "",
  rankingFooter:
    "→ Tu vois immédiatement quelle zone arrêter de livrer, et quel produit pousser cette semaine.",

  decisionEyebrow: "▍ DECISION ENGINE COD",
  decisionTitle: { a: "RENTABLE.", b: "BREAK EVEN.", c: "PAS RENTABLE." },
  decisionLead:
    "Trois statuts. Logique hybride taux de livraison + marge nette FCFA. Pas de feeling — juste la décision.",
  decisionRules: [
    {
      name: "🚀 RENTABLE",
      ruleA: "Livraison > 60 %",
      ruleConn: "ET",
      ruleB: "Marge > 25 %",
      copy: "Pousse le budget pub. Renforce le stock et les agents closers.",
    },
    {
      name: "⚖ BREAK EVEN",
      ruleA: "Livraison 45–60 %",
      ruleConn: "OU",
      ruleB: "Marge 10–25 %",
      copy: "Optimise le closing, change de transporteur, renégocie le COGS.",
    },
    {
      name: "🛑 PAS RENTABLE",
      ruleA: "Livraison < 45 %",
      ruleConn: "OU",
      ruleB: "Marge < 10 %",
      copy: "Coupe le produit ou la zone. Tu finances de la logistique perdue.",
    },
  ],

  testimonialsEyebrow: "▍ RÉSULTATS RÉELS · AFRIQUE DE L'OUEST",
  testimonialsTitle: "AVANT NETODASH.",
  testimonialsTitleAccent: "APRÈS NETODASH.",
  testimonialsLead:
    "Pas de quotes vagues. Juste des chiffres avant / après — sur les mêmes boutiques COD.",
  testimonials: [
    {
      photo: yaoPhoto,
      name: "Mamadou S.",
      city: "Dakar 🇸🇳",
      niche: "Gadgets & accessoires",
      before: { label: "Taux livraison", v: "48 %" },
      after: { label: "Taux livraison", v: "67 %" },
      note: "J'ai vu que la zone régions me coûtait 3× plus cher. J'ai recadré le transporteur et tout a changé.",
    },
    {
      photo: awaPhoto,
      name: "Aïssatou D.",
      city: "Abidjan 🇨🇮",
      niche: "Beauté & cosmétique",
      before: { label: "Profit / mois", v: "320 000 F" },
      after: { label: "Profit / mois", v: "1 150 000 F" },
      note: "Je voyais 200 commandes/mois et je pensais cartonner. Le dashboard m'a montré 38 % de livraison. J'ai killé 1 produit, scalé l'autre.",
    },
    {
      photo: fatouPhoto,
      name: "Fatou K.",
      city: "Bamako 🇲🇱",
      niche: "Maison & déco",
      before: { label: "Marge nette", v: "6 %" },
      after: { label: "Marge nette", v: "24 %" },
      note: "Le coût par zone, c'est ce qui m'a sauvé. Je savais pas que la zone hors-Bamako me bouffait toute ma marge.",
    },
    {
      photo: kouassiPhoto,
      name: "Ousmane B.",
      city: "Dakar 🇸🇳",
      niche: "Tech & santé",
      before: { label: "Décisions / sem.", v: "Au feeling" },
      after: { label: "Décisions / sem.", v: "Scale / Kill" },
      note: "Mes 3 agents closers ont chacun leur stat de confirmation. Je sais qui pousser, qui former. Game changer.",
    },
  ],

  pricingEyebrow: "▍ PRICING",
  pricingTitle: "PENSÉ POUR LES",
  pricingTitleAccent: "VENDEURS COD QUI VEULENT SCALER PROPRE.",
  pricingLead:
    "14 jours d'essai gratuit avec le plan Pro débloqué. Ensuite, Starter à $12/mois (3 produits), Pro à $29/mois (10 produits, COD + Drop, upsells, multi-zones), Scale à $79/mois (illimité + Analytics Pro). Économise 20 % en facturation annuelle.",
  plans: [
    {
      name: "Essai gratuit",
      price: "0 F",
      period: "/ 14 jours",
      tagline: "Plan Pro débloqué, sans carte bancaire",
      features: [
        "Jusqu'à 10 produits",
        "Mode COD ET Dropshipping en parallèle",
        "Dashboard COD complet (zones, profit FCFA)",
        "Analytics Pro débloqué pendant l'essai",
        "Saisies cumulées multi-jours",
      ],
      cta: "Démarrer l'essai",
      highlight: false,
    },
    {
      name: "Starter",
      price: "$12",
      period: "/mois",
      tagline: "Démarrer un premier produit COD · $115/an (−20 %)",
      features: [
        "3 produits actifs",
        "Mode COD OU Dropshipping (au choix)",
        "Dashboard COD complet (zones, profit FCFA)",
        "1 zone de livraison",
        "Historique 60 jours glissants",
      ],
      cta: "Choisir Starter",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mois",
      tagline: "Piloter ton call center & 2–3 winners · $278/an (−20 %)",
      features: [
        "10 produits actifs",
        "COD ET Dropshipping en parallèle",
        "Upsells (ventes additionnelles)",
        "Zones de livraison multi-tarifs illimitées",
        "ROAS net Meta / TikTok / Google",
        "Profit net FCFA par produit",
        "Historique illimité · Export CSV",
        "Support email + WhatsApp",
      ],
      cta: "Choisir Pro",
      highlight: true,
    },
    {
      name: "Scale",
      price: "$79",
      period: "/mois",
      tagline: "Scaler avec Analytics Pro · $756/an (−20 %)",
      features: [
        "Produits illimités",
        "Upsells illimités",
        "Tout ce qui est inclus dans Pro",
        "Analytics Pro EXCLUSIF (scoring, waterfall, break-even, simulateur, insights)",
        "Support prioritaire WhatsApp",
      ],
      cta: "Choisir Scale",
      highlight: false,
    },
  ],

  faq: [
    {
      q: "Comment fonctionne l'essai gratuit ?",
      a: "14 jours complets, sans carte bancaire, avec le plan Pro débloqué (10 produits, COD + Drop en parallèle, multi-zones, Analytics Pro). À la fin, tu choisis Starter, Pro ou Scale — ou tu arrêtes, sans frais.",
    },
    {
      q: "Ça marche pour le COD en Afrique de l'Ouest ?",
      a: "Oui. NETODASH est conçu pour le COD au Sénégal, Côte d'Ivoire, Mali, Bénin, Burkina, Togo, Guinée. Devise FCFA gérée nativement, zones de livraison personnalisables par pays.",
    },
    {
      q: "Mensuel ou annuel ?",
      a: "Annuel = −20 % : Starter $115/an, Pro $278/an, Scale $756/an. Tu peux changer ou annuler à tout moment.",
    },
    {
      q: "Comment je définis mes zones de livraison ?",
      a: "Depuis tes produits, tu crées autant de zones que tu veux (Dakar, régions, Thiès, Saint-Louis…). Tu sélectionnes les régions concernées et le coût par livraison. Chaque commande est ensuite imputée à sa zone. Multi-zones dès le plan Pro.",
    },
    {
      q: "Faut-il connecter Shopify ?",
      a: "Pas obligatoire. Tu peux fonctionner en saisie manuelle quotidienne (idéal pour les boutiques YouCan ou formulaire). Connexion Shopify dispo en OAuth read-only si tu en as une.",
    },
  ],

  ctaTitle: "ARRÊTE DE PAYER",
  ctaTitleAccent: "DES LIVRAISONS PERDUES.",
  ctaLead:
    "14 jours d'essai gratuit. Sans carte. Pilote enfin ton COD avec des chiffres exacts en FCFA.",
  ctaButton: "Créer mon compte →",

  footerTagline:
    "Le dashboard de rentabilité réelle pour le COD en Afrique de l'Ouest.",
  footerBaseline: "CONÇU POUR LE COD EN AFRIQUE DE L'OUEST · FCFA",
};

export const LANDING_COPY: Record<BusinessMode, LandingCopy> = {
  dropshipping: DROPSHIPPING,
  cod: COD,
};
