export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: "Dropshipping" | "COD" | "ROAS" | "Stratégie";
  readMin: number;
  publishedAt: string; // ISO
  tags: string[];
  // HTML content (controlled, sanitized by us — no user input)
  html: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "calculer-roas-dropshipping",
    title: "Comment calculer ton ROAS réel en dropshipping (et arrêter de te mentir)",
    description:
      "Guide complet pour calculer ton ROAS net en dropshipping : break-even ROAS, ROAS cible, CPA max, formules et exemples chiffrés.",
    excerpt:
      "La majorité des dropshippers regardent le ROAS brut Meta. C'est l'erreur n°1 : il ne dit rien sur ta rentabilité. Voici comment calculer ton ROAS RÉEL.",
    category: "ROAS",
    readMin: 8,
    publishedAt: "2026-06-05",
    tags: ["roas", "dropshipping", "meta ads"],
    html: `
<h2>Le ROAS brut Meta est un mensonge</h2>
<p>Quand Meta t'affiche un ROAS de 3.5, ça veut dire : 1 € dépensé en ads = 3,50 € de chiffre d'affaires <strong>attribué</strong>. Ça ne veut PAS dire que tu gagnes 2,50 €. Voici ce qui manque :</p>
<ul>
<li>Le <strong>coût produit</strong> (achat + frais fournisseur)</li>
<li>Les <strong>frais de paiement</strong> Stripe / PayPal (2,9 % + 0,25 € en moyenne)</li>
<li>Les <strong>remboursements et litiges</strong> (5 à 15 % du CA en moyenne)</li>
<li>Les <strong>taxes pub Meta</strong> (jusqu'à 20 % en France)</li>
<li>Le <strong>delta d'attribution</strong> entre Meta et Shopify (Meta surestime de 20 à 40 %)</li>
</ul>

<h2>Les 3 ROAS à connaître</h2>

<h3>1. Break-Even ROAS (point mort)</h3>
<p>Le ROAS minimum pour ne PAS perdre d'argent. La formule :</p>
<pre><code>Break-Even ROAS = Prix de vente / Marge brute par commande</code></pre>
<p><strong>Exemple :</strong> tu vends une montre à 49 €. Coût produit + livraison + Stripe = 18 €. Marge brute = 31 €. Break-Even ROAS = 49 / 31 = <strong>1.58</strong>.</p>
<p>En dessous de 1.58 de ROAS, tu perds de l'argent.</p>

<h3>2. ROAS actuel (réel)</h3>
<pre><code>ROAS réel = (CA livré - remboursements) / (Dépense ads + taxes pub)</code></pre>
<p>C'est ce que Netodash calcule par défaut. Pas le ROAS Meta — le ROAS basé sur les commandes <strong>réellement payées et livrées</strong>.</p>

<h3>3. Target ROAS (objectif marge)</h3>
<p>Pour gagner X € de marge nette sur chaque vente :</p>
<pre><code>Target ROAS = Prix de vente / (Marge brute - X)</code></pre>
<p>Pour la montre à 49 €, viser 15 € de marge nette par commande : Target ROAS = 49 / (31 - 15) = <strong>3.06</strong>.</p>

<h2>Le CPA max — la métrique qui change tout</h2>
<p>Ton CPA max (coût par acquisition maximum) est la dépense ads MAX par commande pour rester rentable :</p>
<pre><code>CPA max = Marge brute par commande</code></pre>
<p>Sur la montre à 31 € de marge brute, ton CPA max théorique = 31 €. Au-dessus, tu perds. En réglant ton enchère Meta sur "Coût par achat = 31 €", tu protèges ta marge automatiquement.</p>

<h2>Exemple chiffré complet</h2>
<table>
<thead><tr><th>Métrique</th><th>Valeur</th></tr></thead>
<tbody>
<tr><td>Prix de vente</td><td>49 €</td></tr>
<tr><td>Coût produit + livraison</td><td>15 €</td></tr>
<tr><td>Frais Stripe (2.9 % + 0.25)</td><td>1,67 €</td></tr>
<tr><td>Marge brute par commande</td><td>32,33 €</td></tr>
<tr><td>Dépense ads (1 commande)</td><td>22 €</td></tr>
<tr><td>Taxe pub Meta (20 %)</td><td>4,40 €</td></tr>
<tr><td><strong>Marge nette réelle</strong></td><td><strong>5,93 €</strong></td></tr>
<tr><td>ROAS Meta affiché</td><td>2.23</td></tr>
<tr><td>ROAS réel Netodash</td><td>1.85</td></tr>
</tbody>
</table>
<p>Le ROAS Meta dit 2.23, mais ta vraie rentabilité est 1.85. Si tu pilotes ton budget sur le ROAS Meta, tu scales un produit qui ne te laisse que 5,93 € — soit 12 % de marge nette.</p>

<h2>Conclusion</h2>
<p>Tant que tu ne calcules pas ton ROAS réel, tu ne pilotes rien. Netodash le fait automatiquement : tu rentres tes coûts une fois, et chaque jour ton vrai ROAS s'affiche, par produit, par campagne.</p>
`,
  },
  {
    slug: "taux-livraison-cod-afrique",
    title: "Taux de livraison COD en Afrique : la métrique n°1 qui décide de ta rentabilité",
    description:
      "Pourquoi le taux de livraison COD est plus important que le ROAS en Afrique. Benchmarks par pays (Sénégal, Côte d'Ivoire, Mali) et leviers pour l'améliorer.",
    excerpt:
      "En COD, une commande confirmée n'est PAS une commande livrée. Si ton taux de livraison réel est sous 60 %, ta marge est déjà morte. Voici pourquoi.",
    category: "COD",
    readMin: 7,
    publishedAt: "2026-06-05",
    tags: ["cod", "afrique", "logistique"],
    html: `
<h2>La différence entre confirmé et livré</h2>
<p>En COD (Cash on Delivery), le client paie au livreur. Ton parcours commande type :</p>
<ol>
<li>Commande web reçue (100 %)</li>
<li>Confirmée au téléphone (50 – 70 %)</li>
<li>Expédiée au livreur (90 % des confirmées)</li>
<li><strong>Réellement livrée et payée</strong> (55 – 75 % des confirmées)</li>
</ol>
<p>Le taux que tu dois piloter, c'est <strong>livrées ÷ confirmées</strong>. Pas livrées ÷ commandes web.</p>

<h2>Benchmarks par pays</h2>
<table>
<thead><tr><th>Pays</th><th>Capitale</th><th>Taux livraison moyen</th></tr></thead>
<tbody>
<tr><td>🇸🇳 Sénégal</td><td>Dakar</td><td>55 – 70 %</td></tr>
<tr><td>🇨🇮 Côte d'Ivoire</td><td>Abidjan</td><td>60 – 75 %</td></tr>
<tr><td>🇹🇬 Togo</td><td>Lomé</td><td>60 – 72 %</td></tr>
<tr><td>🇧🇯 Bénin</td><td>Cotonou</td><td>55 – 70 %</td></tr>
<tr><td>🇲🇱 Mali</td><td>Bamako</td><td>50 – 65 %</td></tr>
<tr><td>🇧🇫 Burkina Faso</td><td>Ouaga</td><td>50 – 65 %</td></tr>
<tr><td>🇬🇳 Guinée</td><td>Conakry</td><td>50 – 65 %</td></tr>
</tbody>
</table>
<p>Hors capitale, retire 10 à 15 points.</p>

<h2>Pourquoi le taux de livraison décide tout</h2>
<p>Exemple : tu vends une montre à 15 000 FCFA. Coût produit 3 500, livraison aller 2 000, retour 2 000 (si non livrée). Marge brute "théorique" : 9 500.</p>
<table>
<thead><tr><th>Taux livraison</th><th>Marge nette / 100 confirmées</th></tr></thead>
<tbody>
<tr><td>75 %</td><td><strong>+462 500 FCFA</strong></td></tr>
<tr><td>65 %</td><td>+277 500 FCFA</td></tr>
<tr><td>55 %</td><td>+92 500 FCFA</td></tr>
<tr><td>50 %</td><td><strong>0 FCFA (point mort)</strong></td></tr>
<tr><td>45 %</td><td><strong>-92 500 FCFA</strong></td></tr>
</tbody>
</table>
<p>Sous 50 %, chaque commande te coûte de l'argent. Beaucoup de drop-shippers africains scalent un produit qui PERD parce qu'ils ne calculent pas leur livré réel.</p>

<h2>Les 5 leviers pour augmenter ton taux de livraison</h2>
<ol>
<li><strong>Confirmation sous 1 h.</strong> Au-delà de 24 h, le taux chute de 15 points. Un call center ou un script WhatsApp obligatoire.</li>
<li><strong>Audio explicatif au moment de la commande.</strong> Le client comprend qu'il devra avoir l'argent à la livraison.</li>
<li><strong>Géolocalisation précise.</strong> Demande systématiquement le quartier + un point de repère. Évite "à côté de la mosquée".</li>
<li><strong>Photo produit dans la confirmation.</strong> Le client visualise, réduit les refus à la livraison.</li>
<li><strong>Choisir tes zones.</strong> Désactive les zones où ton taux passe sous 50 %. Mieux vaut 60 commandes rentables que 100 qui te brûlent.</li>
</ol>

<h2>Comment Netodash le pilote</h2>
<p>Tu rentres confirmées et livrées chaque jour. Netodash calcule automatiquement ton taux de livraison par produit et par zone — et te montre quel produit est rentable, quel produit te coule.</p>

<p><a href="/cod">→ Voir Netodash COD</a></p>
`,
  },
  {
    slug: "marge-nette-dropshipping",
    title: "Marge nette en dropshipping : la vraie formule (et pourquoi 90 % se trompent)",
    description:
      "Calcul détaillé de la marge nette en dropshipping : produit, livraison, ads, taxes, remboursements. Exemple chiffré et erreurs courantes.",
    excerpt:
      "Tu fais 30 000 € de CA et tu te demandes pourquoi ton compte bancaire ne suit pas ? Tu confonds chiffre d'affaires et marge nette. Voici la vraie formule.",
    category: "Dropshipping",
    readMin: 6,
    publishedAt: "2026-06-05",
    tags: ["dropshipping", "marge", "rentabilité"],
    html: `
<h2>La vraie formule de la marge nette</h2>
<pre><code>Marge nette = CA livré
  - Coût produit total
  - Frais paiement (Stripe / PayPal)
  - Remboursements
  - Dépense ads + taxes pub
  - Frais Shopify + apps
  - Frais bancaires
</code></pre>

<h2>Les 6 coûts que tu sous-estimes</h2>
<ol>
<li><strong>Frais Stripe / PayPal :</strong> 2,9 % + 0,25 € par transaction. Sur 1 000 commandes à 50 €, c'est 1 700 € rien que là.</li>
<li><strong>Remboursements :</strong> compte 5 à 15 % du CA. Beaucoup oublient.</li>
<li><strong>Taxe pub Meta :</strong> jusqu'à 20 % en France selon ton statut.</li>
<li><strong>Apps Shopify :</strong> Klaviyo, DSers, ReConvert, etc. — vite 200 à 500 € / mois.</li>
<li><strong>Frais bancaires & change :</strong> 1 à 3 % sur les paiements internationaux.</li>
<li><strong>Sponsoring créa :</strong> UGC, vidéos. 200 – 1 000 € / mois pour scaler.</li>
</ol>

<h2>Exemple : 30 000 € de CA — combien tu touches vraiment ?</h2>
<table>
<thead><tr><th>Poste</th><th>Montant</th></tr></thead>
<tbody>
<tr><td>CA brut Shopify</td><td>30 000 €</td></tr>
<tr><td>Remboursements (10 %)</td><td>-3 000 €</td></tr>
<tr><td>CA livré</td><td>27 000 €</td></tr>
<tr><td>Coût produit (30 %)</td><td>-8 100 €</td></tr>
<tr><td>Stripe (3 %)</td><td>-810 €</td></tr>
<tr><td>Dépense ads</td><td>-12 000 €</td></tr>
<tr><td>Taxe pub (20 %)</td><td>-2 400 €</td></tr>
<tr><td>Shopify + apps</td><td>-400 €</td></tr>
<tr><td>UGC + créa</td><td>-500 €</td></tr>
<tr><td><strong>Marge nette</strong></td><td><strong>2 790 €</strong></td></tr>
</tbody>
</table>
<p>30 000 € de CA = 2 790 € de marge nette. Soit <strong>9,3 %</strong>. Beaucoup de drop-shippers se croient à 30 % parce qu'ils ne soustraient que le coût produit.</p>

<h2>Comment scaler intelligemment</h2>
<p>Au lieu de scaler le CA, scale la <strong>marge nette par produit</strong>. Le tableau Netodash classe tes produits en :</p>
<ul>
<li><strong>SCALE</strong> — marge nette &gt; 20 %</li>
<li><strong>STABLE</strong> — marge nette 10 – 20 %</li>
<li><strong>BREAK EVEN</strong> — marge nette 0 – 10 %</li>
<li><strong>KILL</strong> — marge nette &lt; 0</li>
</ul>
<p>Tu coupes les KILL, tu scales les SCALE. Simple.</p>
`,
  },
  {
    slug: "cash-on-delivery-vs-prepayment-afrique",
    title: "COD vs prépaiement en Afrique : lequel choisir pour ton e-commerce ?",
    description:
      "Comparaison Cash on Delivery vs prépaiement en Afrique francophone : taux de conversion, marge, risques. Quel mode adopter selon ton produit.",
    excerpt:
      "Beaucoup veulent passer au prépaiement pour fuir le COD. Mauvaise idée dans 80 % des cas. Voici quand le COD reste imbattable — et quand il faut basculer.",
    category: "Stratégie",
    readMin: 6,
    publishedAt: "2026-06-05",
    tags: ["cod", "stratégie", "paiement"],
    html: `
<h2>Pourquoi le COD domine en Afrique francophone</h2>
<p>Trois raisons structurelles :</p>
<ol>
<li><strong>Faible bancarisation.</strong> Moins de 30 % des adultes au Sénégal ou en Côte d'Ivoire ont une carte bancaire utilisable en ligne.</li>
<li><strong>Méfiance vis-à-vis du paiement en ligne.</strong> Arnaques fréquentes = le client veut voir avant de payer.</li>
<li><strong>Habitude culturelle du cash.</strong> Même pour ceux qui ont une carte, payer cash reste rassurant.</li>
</ol>

<h2>Taux de conversion : COD vs prépaiement</h2>
<table>
<thead><tr><th>Mode</th><th>Conversion moyenne</th></tr></thead>
<tbody>
<tr><td>COD pur</td><td>2 – 5 % (visiteurs → commandes web)</td></tr>
<tr><td>Wave / Orange Money obligatoire</td><td>0,5 – 1,5 %</td></tr>
<tr><td>CB obligatoire</td><td>0,1 – 0,5 %</td></tr>
</tbody>
</table>
<p>Imposer le prépaiement divise ta conversion par 5 à 20. Sauf cas particuliers (voir plus bas).</p>

<h2>Quand passer au prépaiement (ou hybride)</h2>
<ul>
<li>Produit &gt; 30 000 FCFA — la perte sèche d'un retour devient critique.</li>
<li>Produit personnalisé ou périssable — pas de revente possible.</li>
<li>Acheteur déjà client (rebuy) — il te fait confiance.</li>
<li>Pré-vente ou crowdfunding — le client paie à l'avance accepté.</li>
</ul>

<h2>Le mode hybride qui scale</h2>
<p>L'option la plus rentable en 2026 : <strong>COD + acompte mobile money</strong>.</p>
<ul>
<li>Le client paie 2 000 – 5 000 FCFA via Wave ou Orange Money à la confirmation.</li>
<li>Le solde en cash à la livraison.</li>
<li>Résultat : taux de livraison qui passe de 60 % à 80 %+ (le client a "engagé" de l'argent, il refuse moins).</li>
</ul>

<h2>Comment piloter ça avec Netodash</h2>
<p>Tu paramètres ton flux paiement (COD pur, hybride, prépaiement) — Netodash calcule la marge nette adaptée à chaque mode et te montre lequel est le plus rentable PAR PRODUIT.</p>
<p><a href="/cod">→ Voir Netodash COD</a></p>
`,
  },
  {
    slug: "cpm-meta-2026-dropshipping",
    title: "CPM Meta en 2026 : comment garder un dropshipping rentable malgré la hausse",
    description:
      "Le CPM Meta a doublé en 3 ans. Stratégies concrètes pour rester rentable : créa UGC, scaling vertical, audience BOFU, ROAS net.",
    excerpt:
      "CPM Meta à 25 €, audience saturée, concurrence agressive. Le dropshipping de 2020 est mort. Voici ce qui fonctionne en 2026 — et pourquoi le ROAS net est ton seul KPI.",
    category: "Dropshipping",
    readMin: 7,
    publishedAt: "2026-06-05",
    tags: ["meta ads", "dropshipping", "scaling"],
    html: `
<h2>Le constat : CPM x2 en 3 ans</h2>
<p>En 2023, un CPM Meta France tournait à 12 €. En 2026, on est régulièrement à 25 – 35 € sur les audiences premium. Les raisons :</p>
<ul>
<li>Saturation publicitaire (iOS 17, Meta IA).</li>
<li>Hausse des enchères (concurrence des grandes marques).</li>
<li>Audience iOS opaque depuis ATT.</li>
</ul>

<h2>Les 4 leviers qui marchent encore</h2>

<h3>1. UGC + créa native</h3>
<p>Les créa "studio" sont mortes. Le format vertical, brut, "filmé au téléphone par un vrai client" double le CTR. Compter 200 – 500 € / créa, en produire 3 nouvelles par semaine.</p>

<h3>2. Scaling vertical, pas horizontal</h3>
<p>Au lieu de dupliquer 20 ad sets, mets tout le budget sur 1 – 2 audiences qui convertissent et monte le budget par paliers de +20 % tous les 3 jours. Stop le CBO multi-adsets.</p>

<h3>3. Audience BOFU (retargeting)</h3>
<p>Le ROAS BOFU est 3 à 5x supérieur au cold. Recible :</p>
<ul>
<li>Visiteurs site 7 jours sans achat</li>
<li>Vues vidéo &gt; 50 %</li>
<li>Add-to-cart sans achat</li>
</ul>
<p>Budget BOFU = 20 – 30 % du total ads.</p>

<h3>4. Pilotage au ROAS net, pas au ROAS Meta</h3>
<p>Meta surestime de 20 à 40 %. Si tu scales sur le ROAS Meta, tu scales sur du vent. Le seul KPI fiable : <strong>ROAS net</strong> = (CA livré - remboursements) / (ads + taxes pub).</p>

<h2>Le bon ROAS cible en 2026</h2>
<table>
<thead><tr><th>Produit</th><th>ROAS net cible</th></tr></thead>
<tbody>
<tr><td>Marge brute &gt; 70 %</td><td>2.0 – 2.5</td></tr>
<tr><td>Marge brute 50 – 70 %</td><td>2.5 – 3.0</td></tr>
<tr><td>Marge brute 30 – 50 %</td><td>3.5 – 4.5</td></tr>
<tr><td>Marge brute &lt; 30 %</td><td>5.0+ (ou kill)</td></tr>
</tbody>
</table>

<h2>Conclusion</h2>
<p>Le dropshipping reste viable en 2026 — mais il ne pardonne plus l'amateurisme. Pas de pilotage du ROAS net = pas de rentabilité. Netodash te calcule ce ROAS net chaque jour, par produit, sans Excel.</p>
<p><a href="/dropshipping">→ Voir Netodash Dropshipping</a></p>
`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
