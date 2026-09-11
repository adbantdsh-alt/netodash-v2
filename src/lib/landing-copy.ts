import type { BusinessMode } from "@/lib/use-active-mode";
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
  // Avant/AprÃ¨s
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ DROPSHIPPING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DROPSHIPPING: LandingCopy = {
  seoTitle:
    "Netodash â€” Dashboard de rentabilitÃ© (ROAS net, marge rÃ©elle Meta Ads)",
  seoDescription:
    "Netodash : le dashboard de rentabilitÃ© rÃ©elle pour les marchands. Calcule ton ROAS net aprÃ¨s coÃ»t produit, livraison, frais de paiement et taxes pub Meta / TikTok / Google.",

  heroBadge: "Pilotage de rentabilitÃ©",
  heroH1Line1: "TA BOUTIQUE DIT 6M.",
  heroH1Line2: "COMBIEN AS-TU GARDÃ‰ ?",
  heroSubtitle:
    "Netodash te montre le vrai profit derriÃ¨re chaque produit, chaque pub et chaque vente â€”",
  heroSubtitleBold:
    "pour savoir exactement quoi scaler, surveiller ou couper.",
  heroCtaPrimary: "Essayer gratuitement 7 jours â†’",
  heroCtaSecondary: "Voir les tarifs",
  heroSmallprint: "Aucune carte bancaire requise Â· Plan Pro dÃ©bloquÃ© Â· Annule Ã  tout moment",

  trustStats: [
    { v: "+800", l: "Marchands actifs" },
    { v: "$4.2M", l: "CA pilotÃ© chaque mois" },
    { v: "32 %", l: "De marge nette gagnÃ©e en moyenne" },
    { v: "4,9 / 5", l: "Note utilisateurs" },
  ],

  platformsHeading: "Compatible avec ton stack",
  platforms: [
    { src: wooLogo, alt: "WooCommerce" },
    { src: youcanLogo, alt: "YouCan" },
  ],

  pillars: [
    {
      n: "01",
      t: "MARGE NETTE RÃ‰ELLE",
      d: "CA moins pub, COGS, livraison, frais de paiement et remboursements. Le seul chiffre qui paie ton loyer.",
    },
    {
      n: "02",
      t: "ROAS NET",
      d: "Pas le ROAS gonflÃ© de Meta. Le ratio entre ce que tu encaisses vraiment et ce que tu dÃ©penses, toutes plateformes confondues.",
    },
    {
      n: "03",
      t: "DÃ‰CISION PAR PRODUIT",
      d: "Sache exactement quel produit te rapporte, lequel te coule, et lequel mÃ©rite d'Ãªtre scalÃ© sans hÃ©siter.",
    },
  ],

  showcaseEyebrow: "â– L'OPERATOR CONSOLE",
  showcaseTitleHtml: {
    before: "Pilote ta rentabilitÃ© ",
    accent: "comme un trader",
    after: " pilote son book.",
  },
  showcaseLead:
    "Saisis tes chiffres. Netodash classe tes produits par profit net et te dit, en un mot, lequel scaler, lequel surveiller, lequel couper.",
  showcaseList: [
    "Product Profit Ranking quotidien",
    "Winners / Losers en un coup d'Å“il",
    "DÃ©cision Scale / Watch / Kill par produit",
  ],

  beforeAfterEyebrow: "Ã‡A TE PARLE ?",
  beforeAfterTitle: "$12 480 DE CA.",
  beforeAfterAccent: "EST-CE QUE TU GAGNES VRAIMENT DE L'ARGENT ?",
  beforeAfterBeforeBadge: "ðŸ˜µâ€ðŸ’« Sans NETODASH",
  beforeAfterAfterBadge: "âœ… Avec NETODASH",
  beforeAfterBeforeRows: [
    { k: "CA (30j)", v: "$12 480" },
    { k: "Budget Meta Ads", v: "$5 200" },
    { k: "ROAS affichÃ© Meta", v: "2,4 âœ¨", mode: "accent" },
    { k: "COGS / fulfillment ?", v: "Â¯\\_(ãƒ„)_/Â¯", mode: "accent" },
    { k: "Frais Stripe + refunds ?", v: "â‰ˆ ?", mode: "accent" },
    { k: "Marge nette rÃ©elle", v: "AUCUNE IDÃ‰E.", mode: "accent" },
  ],
  beforeAfterAfterRows: [
    { k: "CA encaissÃ© net", v: "$11 856" },
    { k: "âˆ’ COGS + fulfillment", v: "âˆ’ $3 940" },
    { k: "âˆ’ Meta Ads + taxe 18%", v: "âˆ’ $6 136" },
    { k: "âˆ’ Stripe + refunds", v: "âˆ’ $612" },
    { k: "Marge nette", v: "$1 168", mode: "accent" },
    { k: "ROAS net rÃ©el", v: "1,9", mode: "accent" },
  ],
  beforeAfterBeforeFooter: {
    plain:
      "Tu scales sur le ROAS Meta. Mais Ã  la fin du mois tu regardes ton Stripe et tu te demandes : ",
    bold: "Â« Pourquoi je n'ai presque rien gardÃ© ? Â»",
  },
  beforeAfterAfterFooter: {
    plain: "Tu sais ",
    bold: "exactement ce que tu gardes, sur quel produit, et quelle crÃ©a scaler la semaine prochaine.",
  },
  beforeAfterTagline: {
    plain: "9 marchands sur 10 scalent sur le ROAS Meta gonflÃ©. ",
    bold: "NETODASH te montre la vraie marge en 2 minutes par jour.",
  },

  rankingEyebrow: "â– PRODUCT PROFIT RANKING",
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
    "â†’ Tu vois immÃ©diatement oÃ¹ mettre ton budget pub, et oÃ¹ arrÃªter de saigner.",

  decisionEyebrow: "â– DECISION ENGINE",
  decisionTitle: { a: "RENTABLE.", b: "BREAK EVEN.", c: "PAS RENTABLE." },
  decisionLead:
    "Trois statuts. Une logique hybride marge + ROAS net. Pas de dÃ©bat, pas de feeling â€” juste la dÃ©cision.",
  decisionRules: [
    {
      name: "ðŸš€ RENTABLE",
      ruleA: "Marge > 30%",
      ruleConn: "ET",
      ruleB: "ROAS net > 2.5",
      copy: "Pousse le budget. Le produit tient la route en volume.",
    },
    {
      name: "âš– BREAK EVEN",
      ruleA: "Marge 15â€“30%",
      ruleConn: "OU",
      ruleB: "ROAS 1.8â€“2.5",
      copy: "Optimise crÃ©a, prix ou COGS avant de scaler.",
    },
    {
      name: "ðŸ›‘ PAS RENTABLE",
      ruleA: "Marge < 15%",
      ruleConn: "OU",
      ruleB: "ROAS < 1.8",
      copy: "Coupe ou pivote. Tu perds de l'argent Ã  chaque vente.",
    },
  ],

  testimonialsEyebrow: "â– RÃ‰SULTATS RÃ‰ELS",
  testimonialsTitle: "AVANT NETODASH.",
  testimonialsTitleAccent: "APRÃˆS NETODASH.",
  testimonialsLead:
    "Pas de quotes vagues. Juste des chiffres avant / aprÃ¨s â€” sur les mÃªmes boutiques.",
  testimonials: [
    {
      photo: claraPhoto,
      name: "Clara M.",
      city: "Paris ðŸ‡«ðŸ‡·",
      niche: "BeautÃ© / skincare",
      before: { label: "ROAS net", v: "1.4" },
      after: { label: "ROAS net", v: "2.2" },
      note: "+57% en 6 semaines aprÃ¨s avoir killÃ© 2 produits qui maquillaient les chiffres.",
    },
    {
      photo: lucasPhoto,
      name: "Lucas D.",
      city: "Lyon ðŸ‡«ðŸ‡·",
      niche: "Accessoires tech",
      before: { label: "Profit / mois", v: "$2 100" },
      after: { label: "Profit / mois", v: "$5 300" },
      note: "Le ranking m'a montrÃ© que 1 produit faisait 70% de mon profit. J'ai scalÃ© que lui.",
    },
    {
      photo: awaPhoto,
      name: "Awa T.",
      city: "Dakar ðŸ‡¸ðŸ‡³",
      niche: "Bijoux fantaisie",
      before: { label: "Marge nette", v: "8%" },
      after: { label: "Marge nette", v: "27%" },
      note: "Le COGS et les refunds me bouffaient tout. Maintenant je sais quoi corriger.",
    },
    {
      photo: kouassiPhoto,
      name: "Kouassi R.",
      city: "Abidjan ðŸ‡¨ðŸ‡®",
      niche: "Gadgets maison",
      before: { label: "DÃ©cisions / sem.", v: "Au feeling" },
      after: { label: "DÃ©cisions / sem.", v: "Scale / Kill" },
      note: "2 min/jour. Je sais exactement oÃ¹ mettre $100 de plus, ou couper.",
    },
  ],

  pricingEyebrow: "â– PRICING",
  pricingTitle: "PENSÃ‰ POUR LES",
  pricingTitleAccent: "OPÃ‰RATEURS SÃ‰RIEUX.",
  pricingLead:
    "7 jours d'essai gratuit avec accÃ¨s complet, sans carte bancaire. Ensuite : $20/mois, tout illimitÃ© â€” produits, Analytics Pro, Decision Engine, upsells, export CSV.",
  plans: [
    {
      name: "Essai gratuit",
      price: "0 $",
      period: "/ 7 jours",
      tagline: "AccÃ¨s complet 7 jours, sans carte bancaire",
      features: [
        "Tout dÃ©bloquÃ© pendant l'essai",
        "Saisies cumulÃ©es multi-jours",
        "Aucun engagement",
        "Aucune carte bancaire",
      ],
      cta: "DÃ©marrer l'essai",
      highlight: false,
    },
    {
      name: "Netodash",
      price: "$20",
      period: "/mois",
      tagline: "Tout illimitÃ©, tout inclus",
      features: [
        "Produits illimitÃ©s",
        "Analytics Pro (scoring, waterfall, break-even, simulateur)",
        "Decision Engine Â· Insights automatiques",
        "Upsells Â· Export CSV",
        "Historique illimitÃ©",
        "Support WhatsApp",
      ],
      cta: "Choisir Netodash",
      highlight: true,
    },
  ],

  faq: [
    {
      q: "Comment fonctionne l'essai gratuit ?",
      a: "7 jours complets, sans carte bancaire, accÃ¨s complet. Ã€ la fin, tu passes Ã  $20/mois tout illimitÃ© â€” ou tu arrÃªtes, sans frais.",
    },
    {
      q: "C'est pour quel type d'e-commerce ?",
      a: "NETODASH pilote ta rentabilitÃ© rÃ©elle : ROAS net, marge aprÃ¨s coÃ»ts produits, livraison, frais de paiement et taxes publicitaires. Compatible Meta, TikTok et Google Ads.",
    },
    {
      q: "Quel plan choisir ?",
      a: "Un seul plan : $20/mois, tout illimitÃ©. Produits illimitÃ©s, Analytics Pro (scoring, waterfall, break-even, simulateur, insights), Decision Engine, upsells, export CSV et support WhatsApp. Pas de palier Ã  choisir.",
    },
    {
      q: "Puis-je changer de plan ou annuler ?",
      a: "Oui, Ã  tout moment depuis Mon plan. Tu annules en un clic â€” ton accÃ¨s reste actif jusqu'Ã  la fin de la pÃ©riode payÃ©e.",
    },
  ],

  ctaTitle: "ARRÃŠTE DE DEVINER.",
  ctaTitleAccent: "MESURE.",
  ctaLead: "7 jours d'essai gratuit. Aucune carte requise. Sors enfin de l'aveugle.",
  ctaButton: "CrÃ©er mon compte â†’",

  footerTagline:
    "Le dashboard de rentabilitÃ© rÃ©elle pour les marchands.",
  footerBaseline: "BUILT FOR MERCHANTS",
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ COD AFRIQUE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const COD: LandingCopy = {
  seoTitle:
    "Netodash COD â€” Dashboard rentabilitÃ© Cash on Delivery (SÃ©nÃ©gal, CÃ´te d'Ivoire, FCFA)",
  seoDescription:
    "Le dashboard de rentabilitÃ© pour le COD en Afrique de l'Ouest. Suis taux de confirmation, taux de livraison, coÃ»t par zone et profit net en FCFA. ConÃ§u pour le call center et la logistique terrain.",

  heroBadge: "ConÃ§u pour le COD en Afrique de l'Ouest",
  heroH1Line1: "TU FAIS 100 COMMANDES/JOUR.",
  heroH1Line2: "COMBIEN SONT VRAIMENT PAYÃ‰ES ?",
  heroSubtitle:
    "Netodash mesure ce qui compte vraiment en COD : confirmation, livraison, coÃ»t par zone et pub â€”",
  heroSubtitleBold:
    "pour savoir exactement ce que ta boutique te rapporte en FCFA chaque jour.",
  heroCtaPrimary: "Tester gratuitement 14 jours â†’",
  heroCtaSecondary: "Voir les tarifs",
  heroSmallprint: "Sans carte bancaire Â· Plan Pro dÃ©bloquÃ© Â· Annule Ã  tout moment",

  trustStats: [
    { v: "+400", l: "Vendeurs COD actifs" },
    { v: "65 %", l: "Taux de livraison moyen suivi" },
    { v: "âˆ’28 %", l: "De pertes logistiques Ã©vitÃ©es" },
    { v: "4,8 / 5", l: "Note utilisateurs Afrique" },
  ],

  platformsHeading: "Compatible avec ton stack COD (SÃ©nÃ©gal Â· CI Â· Mali Â· BÃ©nin)",
  platforms: [
    { src: youcanLogo, alt: "YouCan" },
    { src: wooLogo, alt: "WooCommerce" },
  ],

  pillars: [
    {
      n: "01",
      t: "TAUX DE CONFIRMATION",
      d: "Mesure combien de commandes reÃ§ues passent vraiment au closing. RepÃ¨re tes meilleures sources de leads et les agents qui convertissent le mieux.",
    },
    {
      n: "02",
      t: "TAUX DE LIVRAISON",
      d: "Suis le ratio confirmÃ©es â†’ livrÃ©es. C'est lÃ  que ton cash se gagne ou se perd. Tableau de bord clair en FCFA.",
    },
    {
      n: "03",
      t: "COÃ›T LIVRAISON PAR ZONE",
      d: "DÃ©finis tes zones (Dakar, rÃ©gions, hors-pays). Chaque livraison est imputÃ©e Ã  sa zone : tu connais ton vrai coÃ»t logistique.",
    },
  ],

  showcaseEyebrow: "â– L'OPERATOR CONSOLE COD",
  showcaseTitleHtml: {
    before: "Pilote ton COD ",
    accent: "comme un directeur d'agence",
    after: " pilote son call center.",
  },
  showcaseLead:
    "Saisis tes commandes reÃ§ues, confirmÃ©es, livrÃ©es par zone. Netodash calcule ton profit net en FCFA, par jour, par produit, et te dit quel canal pousser.",
  showcaseList: [
    "Taux confirmation / livraison quotidien",
    "CoÃ»t livraison ventilÃ© par zone",
    "Profit net en FCFA, par produit",
  ],

  beforeAfterEyebrow: "Ã‡A TE PARLE ?",
  beforeAfterTitle: "300 COMMANDES REÃ‡UES.",
  beforeAfterAccent: "COMBIEN SONT VRAIMENT PAYÃ‰ES Ã€ LA FIN DU MOIS ?",
  beforeAfterBeforeBadge: "ðŸ˜µâ€ðŸ’« Sans NETODASH",
  beforeAfterAfterBadge: "âœ… Avec NETODASH",
  beforeAfterBeforeRows: [
    { k: "Commandes reÃ§ues (30j)", v: "300" },
    { k: "ConfirmÃ©es (closing)", v: "180" },
    { k: "Taux de livraison ?", v: "â‰ˆ 60 % ?", mode: "accent" },
    { k: "CoÃ»t livraison par zone ?", v: "Â¯\\_(ãƒ„)_/Â¯", mode: "accent" },
    { k: "Retours non payÃ©s ?", v: "â‰ˆ ?", mode: "accent" },
    { k: "Profit net rÃ©el", v: "AUCUNE IDÃ‰E.", mode: "accent" },
  ],
  beforeAfterAfterRows: [
    { k: "LivrÃ©es payÃ©es net", v: "168 cmd" },
    { k: "âˆ’ CoÃ»t produit (livrÃ©es)", v: "âˆ’ 1 260 000 F" },
    { k: "âˆ’ Livraison ventilÃ©e par zone", v: "âˆ’ 420 000 F" },
    { k: "âˆ’ Budget pub (Meta/TikTok)", v: "âˆ’ 850 000 F" },
    { k: "Profit net (FCFA)", v: "+ 720 000 F", mode: "accent" },
    { k: "Marge nette", v: "21 %", mode: "accent" },
  ],
  beforeAfterBeforeFooter: {
    plain:
      "Tu paies des livraisons que tu ne rÃ©cupÃ¨res pas, ton call center pousse fort mais ton cash en fin de mois te dit : ",
    bold: "Â« OÃ¹ est passÃ© l'argent ? Â»",
  },
  beforeAfterAfterFooter: {
    plain: "Tu sais ",
    bold: "exactement quelle zone te coÃ»te trop cher, quel produit livre vraiment, et quel agent ferme le mieux.",
  },
  beforeAfterTagline: {
    plain:
      "9 vendeurs COD sur 10 ne mesurent pas leur vrai profit par zone. ",
    bold: "NETODASH te le montre en FCFA, en 2 minutes par jour.",
  },

  rankingEyebrow: "â– PROFIT RANKING PAR PRODUIT",
  rankingTitle: "QUELS PRODUITS LIVRENT",
  rankingTitleAccent: "ET QUELS PRODUITS TE COÃ›TENT",
  rankingLead:
    "Netodash classe tes produits par profit net en FCFA, aprÃ¨s livraison ventilÃ©e par zone. Chaque ligne te dit, en un mot, quoi faire aujourd'hui.",
  rankingCols: ["Produit", "ReÃ§ues", "LivrÃ©es", "Profit net (F)", "Marge", "Status"],
  rankingRows: [
    { name: "Montre ConnectÃ©e Pro", rev: 180, ads: 105, profit: 1_240_000, margin: 28.5, status: "RENTABLE" },
    { name: "Lampe LED DÃ©corative", rev: 120, ads: 72, profit: 540_000, margin: 18.0, status: "BREAK EVEN" },
    { name: "Casque Bluetooth X3", rev: 95, ads: 38, profit: 120_000, margin: 6.5, status: "PAS RENTABLE" },
    { name: "Diffuseur Parfum Auto", rev: 70, ads: 48, profit: 680_000, margin: 31.2, status: "RENTABLE" },
  ],
  rankingCurrencyPrefix: "",
  rankingFooter:
    "â†’ Tu vois immÃ©diatement quelle zone arrÃªter de livrer, et quel produit pousser cette semaine.",

  decisionEyebrow: "â– DECISION ENGINE COD",
  decisionTitle: { a: "RENTABLE.", b: "BREAK EVEN.", c: "PAS RENTABLE." },
  decisionLead:
    "Trois statuts. Logique hybride taux de livraison + marge nette FCFA. Pas de feeling â€” juste la dÃ©cision.",
  decisionRules: [
    {
      name: "ðŸš€ RENTABLE",
      ruleA: "Livraison > 60 %",
      ruleConn: "ET",
      ruleB: "Marge > 25 %",
      copy: "Pousse le budget pub. Renforce le stock et les agents closers.",
    },
    {
      name: "âš– BREAK EVEN",
      ruleA: "Livraison 45â€“60 %",
      ruleConn: "OU",
      ruleB: "Marge 10â€“25 %",
      copy: "Optimise le closing, change de transporteur, renÃ©gocie le COGS.",
    },
    {
      name: "ðŸ›‘ PAS RENTABLE",
      ruleA: "Livraison < 45 %",
      ruleConn: "OU",
      ruleB: "Marge < 10 %",
      copy: "Coupe le produit ou la zone. Tu finances de la logistique perdue.",
    },
  ],

  testimonialsEyebrow: "â– RÃ‰SULTATS RÃ‰ELS Â· AFRIQUE DE L'OUEST",
  testimonialsTitle: "AVANT NETODASH.",
  testimonialsTitleAccent: "APRÃˆS NETODASH.",
  testimonialsLead:
    "Pas de quotes vagues. Juste des chiffres avant / aprÃ¨s â€” sur les mÃªmes boutiques COD.",
  testimonials: [
    {
      photo: yaoPhoto,
      name: "Mamadou S.",
      city: "Dakar ðŸ‡¸ðŸ‡³",
      niche: "Gadgets & accessoires",
      before: { label: "Taux livraison", v: "48 %" },
      after: { label: "Taux livraison", v: "67 %" },
      note: "J'ai vu que la zone rÃ©gions me coÃ»tait 3Ã— plus cher. J'ai recadrÃ© le transporteur et tout a changÃ©.",
    },
    {
      photo: awaPhoto,
      name: "AÃ¯ssatou D.",
      city: "Abidjan ðŸ‡¨ðŸ‡®",
      niche: "BeautÃ© & cosmÃ©tique",
      before: { label: "Profit / mois", v: "320 000 F" },
      after: { label: "Profit / mois", v: "1 150 000 F" },
      note: "Je voyais 200 commandes/mois et je pensais cartonner. Le dashboard m'a montrÃ© 38 % de livraison. J'ai killÃ© 1 produit, scalÃ© l'autre.",
    },
    {
      photo: fatouPhoto,
      name: "Fatou K.",
      city: "Bamako ðŸ‡²ðŸ‡±",
      niche: "Maison & dÃ©co",
      before: { label: "Marge nette", v: "6 %" },
      after: { label: "Marge nette", v: "24 %" },
      note: "Le coÃ»t par zone, c'est ce qui m'a sauvÃ©. Je savais pas que la zone hors-Bamako me bouffait toute ma marge.",
    },
    {
      photo: kouassiPhoto,
      name: "Ousmane B.",
      city: "Dakar ðŸ‡¸ðŸ‡³",
      niche: "Tech & santÃ©",
      before: { label: "DÃ©cisions / sem.", v: "Au feeling" },
      after: { label: "DÃ©cisions / sem.", v: "Scale / Kill" },
      note: "Mes 3 agents closers ont chacun leur stat de confirmation. Je sais qui pousser, qui former. Game changer.",
    },
  ],

  pricingEyebrow: "â– PRICING",
  pricingTitle: "PENSÃ‰ POUR LES",
  pricingTitleAccent: "VENDEURS COD QUI VEULENT SCALER PROPRE.",
  pricingLead:
    "14 jours d'essai gratuit avec accÃ¨s complet. Ensuite, Plan COD Ã  $10/mois (COD uniquement, produits illimitÃ©s), Starter Ã  $12/mois (Drop + COD), Pro Ã  $29/mois (upsells, multi-zones), Scale Ã  $79/mois (Analytics Pro).",
  plans: [
    {
      name: "Essai gratuit",
      price: "0 F",
      period: "/ 14 jours",
      tagline: "AccÃ¨s complet 14j, sans carte bancaire",
      features: [
        "Jusqu'Ã  10 produits",
        "Mode COD ET Dropshipping en parallÃ¨le",
        "Dashboard COD complet (zones, profit FCFA)",
        "Analytics Pro dÃ©bloquÃ© pendant l'essai",
        "Saisies cumulÃ©es multi-jours",
      ],
      cta: "DÃ©marrer l'essai",
      highlight: false,
    },
    {
      name: "Starter",
      price: "$12",
      period: "/mois",
      tagline: "DÃ©marrer en Drop avec le COD inclus",
      features: [
        "3 produits Dropshipping max",
        "Mode COD inclus (dashboard basique)",
        "Produits COD illimitÃ©s",
        "Dashboard COD complet (zones, profit FCFA)",
        "1 zone de livraison",
        "Historique 60 jours",
      ],
      cta: "Choisir Starter",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mois",
      tagline: "Piloter ton call center & 2â€“3 winners",
      features: [
        "10 produits actifs",
        "COD ET Dropshipping en parallÃ¨le",
        "Upsells (ventes additionnelles)",
        "Zones de livraison multi-tarifs illimitÃ©es",
        "ROAS net Meta / TikTok / Google",
        "Profit net FCFA par produit",
        "Historique illimitÃ© Â· Export CSV",
        "Support email + WhatsApp",
      ],
      cta: "Choisir Pro",
      highlight: true,
    },
    {
      name: "Scale",
      price: "$79",
      period: "/mois",
      tagline: "Scaler avec Analytics Pro",
      features: [
        "Produits illimitÃ©s",
        "Upsells illimitÃ©s",
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
      a: "14 jours complets, sans carte bancaire, accÃ¨s complet quel que soit le mode au signup. Ã€ la fin, tu choisis Plan COD ($10), Starter, Pro ou Scale â€” ou tu arrÃªtes, sans frais.",
    },
    {
      q: "Ã‡a marche pour le COD en Afrique de l'Ouest ?",
      a: "Oui. NETODASH est conÃ§u pour le COD au SÃ©nÃ©gal, CÃ´te d'Ivoire, Mali, BÃ©nin, Burkina, Togo, GuinÃ©e. Devise FCFA gÃ©rÃ©e nativement, zones de livraison personnalisables par pays.",
    },
    {
      q: "Comment je dÃ©finis mes zones de livraison ?",
      a: "Depuis tes produits, tu dÃ©finis tes zones (Dakar, rÃ©gions, ThiÃ¨sâ€¦). Multi-zones dÃ¨s le plan Pro Drop ($29). Le plan COD $10 inclut 1 zone.",
    },
    {
      q: "Faut-il connecter Shopify ?",
      a: "Pas obligatoire. Tu peux fonctionner en saisie manuelle quotidienne (idÃ©al pour les boutiques YouCan ou formulaire). Connexion Shopify dispo en OAuth read-only si tu en as une.",
    },
  ],

  ctaTitle: "ARRÃŠTE DE PAYER",
  ctaTitleAccent: "DES LIVRAISONS PERDUES.",
  ctaLead:
    "14 jours d'essai gratuit. Sans carte. Pilote enfin ton COD avec des chiffres exacts en FCFA.",
  ctaButton: "CrÃ©er mon compte â†’",

  footerTagline:
    "Le dashboard de rentabilitÃ© rÃ©elle pour le COD en Afrique de l'Ouest.",
  footerBaseline: "CONÃ‡U POUR LE COD EN AFRIQUE DE L'OUEST Â· FCFA",
};

export const LANDING_COPY: Record<BusinessMode, LandingCopy> = {
  dropshipping: DROPSHIPPING,
  cod: COD,
};
