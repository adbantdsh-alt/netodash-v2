export type CodCountry = {
  slug: string;
  name: string;
  flag: string;
  capital: string;
  currency: string;
  population: string;
  zones: { name: string; price: string }[];
  carriers: string[];
  paymentMethods: string[];
  marketSize: string;
  averageDeliveryRate: string;
  topNiches: string[];
  intro: string;
  challenges: { title: string; text: string }[];
  netodashAngle: string[];
  faq: { q: string; a: string }[];
};

export const COD_COUNTRIES: CodCountry[] = [
  {
    slug: "senegal",
    name: "Sénégal",
    flag: "🇸🇳",
    capital: "Dakar",
    currency: "FCFA (XOF)",
    population: "17,7 millions",
    zones: [
      { name: "Dakar", price: "1 500 – 2 000 FCFA" },
      { name: "Banlieue Dakar (Pikine, Guédiawaye, Rufisque)", price: "2 000 – 2 500 FCFA" },
      { name: "Thiès / Mbour", price: "2 500 – 3 500 FCFA" },
      { name: "Saint-Louis / Touba / Diourbel", price: "3 000 – 5 000 FCFA" },
      { name: "Régions éloignées (Tamba, Ziguinchor, Kédougou)", price: "5 000 – 8 000 FCFA" },
    ],
    carriers: ["Yobante Express", "Speedaf", "Jumia Logistics", "Livreurs indépendants"],
    paymentMethods: ["Cash à la livraison", "Wave (mobile money)", "Orange Money"],
    marketSize: "Le e-commerce sénégalais pèse plus de 200 millions USD/an, en croissance à 2 chiffres. Dakar concentre 60 % du pouvoir d'achat.",
    averageDeliveryRate: "55 – 70 %",
    topNiches: ["Cosmétique & beauté", "Mode féminine", "Gadgets tech", "Santé / minceur", "Accessoires automobile"],
    intro:
      "Le COD (Cash on Delivery) est le mode de paiement dominant au Sénégal : la confiance dans le paiement en ligne reste limitée, et les clients préfèrent payer le livreur en cash ou via Wave. Lancer du dropshipping COD à Dakar et en régions demande de piloter trois métriques critiques : taux de confirmation, taux de livraison réel, et coût livraison par zone.",
    challenges: [
      { title: "Faux numéros & abandons", text: "20 à 35 % des commandes web ne sont jamais confirmées par téléphone. Sans call center structuré, la marge fond." },
      { title: "Coût livraison hétérogène", text: "Une commande Dakar à 1 500 FCFA n'a rien à voir avec Tambacounda à 6 000 FCFA. Sans ventilation par zone, tu pilotes à l'aveugle." },
      { title: "Retours non livrés = perte sèche", text: "Le produit voyage 2 fois, tu paies l'aller + le retour, sans encaisser. C'est LA fuite n°1 du COD." },
    ],
    netodashAngle: [
      "Saisie cumulée multi-jours pour ne rien rater de tes commandes Wave & cash",
      "Zones de livraison Dakar / Banlieue / Régions avec coût unique par zone",
      "Taux de livraison RÉEL (livrées ÷ confirmées), pas le taux marketing",
      "Profit net en FCFA après produit + livraison + ads, par produit et par jour",
    ],
    faq: [
      {
        q: "Quel est le taux de livraison moyen au Sénégal en COD ?",
        a: "Entre 55 % et 70 % selon la zone et la qualité du call center. Dakar centre dépasse souvent 70 %. Les régions éloignées descendent à 45 – 55 %.",
      },
      {
        q: "Combien coûte une livraison COD à Dakar ?",
        a: "1 500 à 2 500 FCFA dans Dakar et sa banlieue. Compte 3 000 à 5 000 FCFA pour Thiès, Mbour, Saint-Louis et 5 000+ pour les régions éloignées.",
      },
      {
        q: "Quels moyens de paiement utiliser au Sénégal pour le COD ?",
        a: "Cash à la livraison reste majoritaire. Wave est devenu incontournable (gratuit, instantané), Orange Money en complément. Évite la CB en pré-paiement — taux de conversion faible.",
      },
    ],
  },
  {
    slug: "cote-divoire",
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    capital: "Abidjan",
    currency: "FCFA (XOF)",
    population: "28,9 millions",
    zones: [
      { name: "Abidjan (Plateau, Cocody, Yopougon, Marcory)", price: "1 500 – 2 500 FCFA" },
      { name: "Banlieue Abidjan (Bingerville, Anyama)", price: "2 500 – 3 500 FCFA" },
      { name: "Bouaké / Yamoussoukro", price: "3 500 – 5 000 FCFA" },
      { name: "San Pedro / Korhogo / Daloa", price: "4 000 – 6 000 FCFA" },
      { name: "Régions Nord / Ouest", price: "5 000 – 9 000 FCFA" },
    ],
    carriers: ["Chronopost CI", "DHL", "Jumia Logistics", "Glovo", "Coursiers indépendants"],
    paymentMethods: ["Cash à la livraison", "Wave CI", "Orange Money", "MTN Mobile Money", "Moov Money"],
    marketSize: "1er marché e-commerce francophone d'Afrique de l'Ouest. Abidjan concentre la majorité du volume avec un panier moyen supérieur au Sénégal.",
    averageDeliveryRate: "60 – 75 %",
    topNiches: ["Mode & sneakers", "Cosmétique afro", "Électronique", "Santé bien-être", "Maison & déco"],
    intro:
      "Abidjan est le hub n°1 du COD en Afrique francophone. Marché mature, ads Meta efficaces, livreurs nombreux — mais la concurrence est rude et les CPM montent. Sans pilotage précis du coût livraison par zone et du taux de livraison, tu perds 30 % de marge en silence.",
    challenges: [
      { title: "CPM Meta en hausse", text: "Le coût d'acquisition Abidjan a doublé en 2 ans. Sans ROAS net (après frais Meta + retours), tu confonds CA et profit." },
      { title: "Zones tarifaires éclatées", text: "Cocody, Yopougon, Marcory n'ont pas le même tarif livreur. Calculer une marge moyenne sans ventiler = piloter dans le flou." },
      { title: "Mix Mobile Money complexe", text: "Wave, Orange Money, MTN, Moov — chaque flux a ses frais. Le COD reste roi mais le mix compte." },
    ],
    netodashAngle: [
      "Zones Abidjan / intérieur paramétrables avec coût par zone",
      "ROAS net Meta / TikTok après retours et taux de livraison",
      "Multi-produits jusqu'à illimité — pour les drop-shippers qui scalent plusieurs winners",
      "Marge nette en FCFA par jour, par zone, par produit",
    ],
    faq: [
      {
        q: "Quel est le taux de livraison moyen en Côte d'Ivoire en COD ?",
        a: "60 à 75 % à Abidjan avec un bon call center. 50 – 60 % en région. Le facteur n°1 : qualité de la confirmation téléphonique sous 2 h.",
      },
      {
        q: "Combien coûte une livraison à Abidjan ?",
        a: "1 500 à 2 500 FCFA selon la commune. 2 500 – 3 500 pour la banlieue, jusqu'à 9 000 FCFA pour les régions éloignées.",
      },
      {
        q: "Faut-il prendre un call center pour scaler en Côte d'Ivoire ?",
        a: "Au-delà de 30 commandes/jour, oui. Avant ça, tu peux confirmer toi-même via WhatsApp + appel. Netodash te montre le seuil de rentabilité call center.",
      },
    ],
  },
  {
    slug: "mali",
    name: "Mali",
    flag: "🇲🇱",
    capital: "Bamako",
    currency: "FCFA (XOF)",
    population: "22,6 millions",
    zones: [
      { name: "Bamako (Hamdallaye, Hippodrome, ACI 2000)", price: "1 500 – 2 500 FCFA" },
      { name: "Banlieue Bamako (Kati, Kalaban)", price: "2 500 – 3 500 FCFA" },
      { name: "Sikasso / Ségou / Koutiala", price: "4 000 – 6 000 FCFA" },
      { name: "Mopti / Kayes / Gao", price: "6 000 – 10 000 FCFA" },
    ],
    carriers: ["Orange Money Express", "DHL Mali", "Coursiers indépendants Bamako"],
    paymentMethods: ["Cash à la livraison", "Orange Money", "Moov Money", "Wave (en expansion)"],
    marketSize: "Marché en pleine structuration. Bamako concentre l'essentiel du e-commerce francophone du pays.",
    averageDeliveryRate: "50 – 65 %",
    topNiches: ["Mode islamique", "Cosmétique naturelle", "Smartphones / accessoires", "Produits maison"],
    intro:
      "Le COD au Mali se construit. Bamako reste la zone rentable, les régions demandent des partenariats logistiques solides. Le mobile money (Orange Money en tête) facilite la collecte mais le cash reste dominant. Piloter le taux de livraison par zone est vital ici.",
    challenges: [
      { title: "Logistique régionale", text: "Au-delà de Bamako, peu de transporteurs structurés. Coûts élevés, délais longs, taux de livraison plus faible." },
      { title: "Pouvoir d'achat hétérogène", text: "Le panier moyen varie fortement entre Bamako et régions. Adapter le pricing par zone est crucial." },
    ],
    netodashAngle: [
      "Pilotage Bamako vs régions avec coûts livraison séparés",
      "Marge en FCFA après tous les frais cachés (Orange Money, retours)",
      "Dashboard mobile-first — utilisable sur connexion 3G",
    ],
    faq: [
      {
        q: "Le COD fonctionne-t-il bien au Mali ?",
        a: "Oui à Bamako, avec un taux de livraison de 55 – 65 %. Les régions sont plus difficiles : coûts logistiques élevés et taux plus faible.",
      },
      {
        q: "Combien coûte une livraison à Bamako ?",
        a: "1 500 à 2 500 FCFA dans Bamako, 2 500 – 3 500 banlieue. Compter 4 000 – 6 000 FCFA pour Sikasso ou Ségou.",
      },
    ],
  },
  {
    slug: "benin",
    name: "Bénin",
    flag: "🇧🇯",
    capital: "Cotonou",
    currency: "FCFA (XOF)",
    population: "13,7 millions",
    zones: [
      { name: "Cotonou", price: "1 500 – 2 500 FCFA" },
      { name: "Porto-Novo / Calavi", price: "2 000 – 3 000 FCFA" },
      { name: "Parakou / Bohicon", price: "4 000 – 6 000 FCFA" },
      { name: "Nord (Natitingou, Kandi)", price: "6 000 – 9 000 FCFA" },
    ],
    carriers: ["DHL Bénin", "Jumia Logistics", "Coursiers Cotonou"],
    paymentMethods: ["Cash à la livraison", "MTN Mobile Money", "Moov Money", "Celtiis Cash"],
    marketSize: "Marché compact mais dynamique, fortement urbanisé autour de Cotonou.",
    averageDeliveryRate: "55 – 70 %",
    topNiches: ["Mode féminine", "Cosmétique", "Gadgets", "Santé"],
    intro:
      "Cotonou est un mini-Abidjan : marché concentré, livreurs disponibles, COD dominant. MTN et Moov Money facilitent la collecte. La clé reste le taux de confirmation téléphonique et le pilotage du coût livraison réel.",
    challenges: [
      { title: "Étroitesse du marché", text: "Audience Meta vite saturée. Diversifier sur TikTok devient critique pour scaler." },
      { title: "Logistique Nord", text: "Les régions Nord (Parakou et au-delà) ont des coûts livraison qui mangent la marge si mal calibrés." },
    ],
    netodashAngle: [
      "Zones Cotonou / Sud / Nord avec tarifs distincts",
      "ROAS net Meta + TikTok cumulés",
      "Suivi du seuil de rentabilité par produit",
    ],
    faq: [
      {
        q: "Quel taux de livraison espérer au Bénin ?",
        a: "55 – 70 % à Cotonou avec une bonne confirmation. 45 – 60 % en région.",
      },
      {
        q: "Combien coûte une livraison à Cotonou ?",
        a: "1 500 à 2 500 FCFA. Compter 6 000 – 9 000 FCFA pour le Nord.",
      },
    ],
  },
  {
    slug: "burkina-faso",
    name: "Burkina Faso",
    flag: "🇧🇫",
    capital: "Ouagadougou",
    currency: "FCFA (XOF)",
    population: "23,3 millions",
    zones: [
      { name: "Ouagadougou", price: "1 500 – 2 500 FCFA" },
      { name: "Bobo-Dioulasso", price: "3 500 – 5 000 FCFA" },
      { name: "Koudougou / Banfora / Ouahigouya", price: "4 500 – 7 000 FCFA" },
    ],
    carriers: ["Orange Money Express BF", "DHL", "Coursiers Ouaga"],
    paymentMethods: ["Cash à la livraison", "Orange Money", "Moov Money"],
    marketSize: "Marché émergent. Ouaga + Bobo concentrent l'essentiel du COD structuré.",
    averageDeliveryRate: "50 – 65 %",
    topNiches: ["Cosmétique", "Vêtements", "Tech low-cost", "Produits ménagers"],
    intro:
      "Le COD au Burkina se développe autour de Ouagadougou et Bobo-Dioulasso. Le mobile money est très répandu (Orange Money domine). Les distances entre villes imposent un pilotage logistique strict.",
    challenges: [
      { title: "Distances inter-villes", text: "Ouaga – Bobo = 350 km. Les livraisons inter-villes prennent 2 – 4 jours et coûtent cher." },
      { title: "Saisonnalité", text: "Le pouvoir d'achat fluctue avec les récoltes. Adapter les ads selon les saisons est rentable." },
    ],
    netodashAngle: [
      "Ouaga vs Bobo avec coûts livraison séparés",
      "Suivi mois par mois pour repérer la saisonnalité",
      "Profit net après frais Orange Money",
    ],
    faq: [
      {
        q: "Quel taux de livraison au Burkina Faso ?",
        a: "55 – 65 % à Ouagadougou et Bobo. Plus faible hors de ces deux villes.",
      },
    ],
  },
  {
    slug: "togo",
    name: "Togo",
    flag: "🇹🇬",
    capital: "Lomé",
    currency: "FCFA (XOF)",
    population: "9,1 millions",
    zones: [
      { name: "Lomé", price: "1 500 – 2 500 FCFA" },
      { name: "Banlieue Lomé (Baguida, Adidogomé)", price: "2 000 – 3 000 FCFA" },
      { name: "Kpalimé / Atakpamé", price: "3 500 – 5 000 FCFA" },
      { name: "Sokodé / Kara / Dapaong", price: "5 000 – 8 000 FCFA" },
    ],
    carriers: ["DHL Togo", "Coursiers Lomé", "Jumia"],
    paymentMethods: ["Cash à la livraison", "T-Money (Togocom)", "Flooz (Moov)", "Mixx by Yas"],
    marketSize: "Marché compact centré sur Lomé. Croissance régulière, audience facile à toucher.",
    averageDeliveryRate: "60 – 72 %",
    topNiches: ["Mode féminine", "Cosmétique", "Gadgets", "Bijoux"],
    intro:
      "Lomé est l'une des villes COD les plus rentables d'Afrique de l'Ouest : concentration urbaine, livreurs disponibles, taux de livraison élevé. T-Money et Flooz couvrent la collecte mobile.",
    challenges: [
      { title: "Marché vite saturé", text: "Une audience Meta peut être épuisée en 2 mois. Renouveler les angles créa est vital." },
      { title: "Confirmation prioritaire", text: "Lomé répond très bien si tu rappelles sous 1 h. Au-delà, le taux chute." },
    ],
    netodashAngle: [
      "Pilotage Lomé / régions avec coûts distincts",
      "Suivi confirmation sous 1h vs 24h",
      "ROAS net Meta",
    ],
    faq: [
      {
        q: "Quel taux de livraison à Lomé ?",
        a: "60 – 72 % avec une confirmation rapide. C'est l'une des meilleures villes COD de la sous-région.",
      },
    ],
  },
  {
    slug: "guinee",
    name: "Guinée",
    flag: "🇬🇳",
    capital: "Conakry",
    currency: "Franc guinéen (GNF)",
    population: "14 millions",
    zones: [
      { name: "Conakry (Kaloum, Dixinn, Ratoma, Matam, Matoto)", price: "20 000 – 35 000 GNF" },
      { name: "Banlieue Conakry (Coyah, Dubréka)", price: "30 000 – 50 000 GNF" },
      { name: "Kindia / Boké / Mamou", price: "60 000 – 100 000 GNF" },
      { name: "Régions intérieures (Labé, Kankan, N'zérékoré)", price: "80 000 – 150 000 GNF" },
    ],
    carriers: ["DHL Conakry", "Coursiers locaux", "Orange Money Express"],
    paymentMethods: ["Cash à la livraison", "Orange Money", "MTN Mobile Money"],
    marketSize: "Marché en structuration, fortement concentré à Conakry. Forte croissance du mobile money.",
    averageDeliveryRate: "50 – 65 %",
    topNiches: ["Cosmétique", "Mode féminine", "Tech low-cost", "Santé"],
    intro:
      "La Guinée fonctionne en GNF (et non FCFA) — pense à paramétrer ta devise. Conakry concentre le volume. Le COD est dominant mais la logistique régionale reste coûteuse.",
    challenges: [
      { title: "Devise spécifique", text: "GNF, pas FCFA. Beaucoup d'outils ne le gèrent pas correctement." },
      { title: "Logistique fragmentée", text: "Peu de transporteurs nationaux structurés. Réseau de coursiers à monter." },
    ],
    netodashAngle: [
      "Multi-devise FCFA / GNF",
      "Zones Conakry vs régions avec coûts en GNF",
      "Profit net adapté à ton mix mobile money",
    ],
    faq: [
      {
        q: "Quel taux de livraison à Conakry ?",
        a: "55 – 65 % avec une confirmation rapide. Plus faible en région intérieure.",
      },
    ],
  },
];

export function getCodCountry(slug: string): CodCountry | undefined {
  return COD_COUNTRIES.find((c) => c.slug === slug);
}
