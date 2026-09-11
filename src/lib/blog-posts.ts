export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: "Rentabilité" | "COD" | "ROAS" | "Stratégie";
  readMin: number;
  publishedAt: string; // ISO
  tags: string[];
  // HTML content (controlled, sanitized by us — no user input)
  html: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "calculer-roas-dropshipping",
    title: "Comment calculer ton ROAS réel (et arrêter de te mentir)",
    description:
      "Guide complet pour calculer ton ROAS net : break-even ROAS, ROAS cible, CPA max, formules et exemples chiffrés.",
    excerpt:
      "La majorité des e-commerçants regardent le ROAS brut Meta. C'est l'erreur n°1 : il ne dit rien sur ta rentabilité réelle. Voici comment calculer ton vrai ROAS.",
    category: "ROAS",
    readMin: 8,
    publishedAt: "2026-06-05",
    tags: ["roas", "meta ads", "rentabilité"],
    html: `
<h2>Le ROAS brut Meta est un mensonge</h2>
<p>Quand Meta t'affiche un ROAS de 3.5, ça veut dire : 1 000 FCFA dépensé en ads = 3 500 FCFA de chiffre d'affaires <strong>attribué</strong>. Ça ne veut PAS dire que tu gagnes 2 500 FCFA. Voici ce qui manque :</p>
<ul>
<li>Le <strong>coût produit</strong> (achat + frais fournisseur)</li>
<li>Les <strong>frais de paiement</strong> XaalipSay (5 % du montant réellement encaissé, retrait gratuit, aucun frais fixe par transaction)</li>
<li>Les <strong>remboursements et litiges</strong> (5 à 15 % du CA en moyenne)</li>
<li>Les <strong>taxes pub Meta</strong> (jusqu'à 20 % au Sénégal, 0 % dans certains pays)</li>
<li>Le <strong>delta d'attribution</strong> entre Meta et ta boutique (Meta surestime de 20 à 40 %)</li>
</ul>

<h2>Les 3 ROAS à connaître</h2>

<h3>1. Break-Even ROAS (point mort)</h3>
<p>Le ROAS minimum pour ne PAS perdre d'argent. La formule :</p>
<pre><code>Break-Even ROAS = Prix de vente / Marge brute par commande</code></pre>
<p><strong>Exemple :</strong> tu vends une montre à 32 000 FCFA. Coût produit + livraison = 10 400 FCFA, frais XaalipSay = 1 600 FCFA (5 % de l'encaissement), soit 12 000 FCFA de coûts variables. Marge brute = 20 000 FCFA. Break-Even ROAS = 32 000 / 20 000 = <strong>1.60</strong>.</p>
<p>En dessous de 1.60 de ROAS, tu perds de l'argent.</p>

<h3>2. ROAS actuel (réel)</h3>
<pre><code>ROAS réel = (CA livré - remboursements) / (Dépense ads + taxes pub)</code></pre>
<p>C'est ce que Netodash calcule par défaut. Pas le ROAS Meta — le ROAS basé sur les commandes <strong>réellement payées et livrées</strong>. Sur CopyX, une partie de tes clients ne règle qu'un <strong>acompte</strong> à la commande : les frais XaalipSay (5 %) ne s'appliquent donc qu'à ce qui est réellement encaissé, jamais à ton CA théorique.</p>

<h3>3. Target ROAS (objectif marge)</h3>
<p>Pour gagner X FCFA de marge nette sur chaque vente :</p>
<pre><code>Target ROAS = Prix de vente / (Marge brute - X)</code></pre>
<p>Pour la montre à 32 000 FCFA, viser 10 000 FCFA de marge nette par commande : Target ROAS = 32 000 / (20 000 - 10 000) = <strong>3.20</strong>.</p>

<h2>Le CPA max — la métrique qui change tout</h2>
<p>Ton CPA max (coût par acquisition maximum) est la dépense ads MAX par commande pour rester rentable :</p>
<pre><code>CPA max = Marge brute par commande</code></pre>
<p>Sur la montre à 20 000 FCFA de marge brute, ton CPA max théorique = 20 000 FCFA. Au-dessus, tu perds. En réglant ton enchère Meta sur "Coût par achat = 20 000 FCFA", tu protèges ta marge automatiquement.</p>

<h2>Exemple chiffré complet</h2>
<table>
<thead><tr><th>Métrique</th><th>Valeur</th></tr></thead>
<tbody>
<tr><td>Prix de vente</td><td>32 000 FCFA</td></tr>
<tr><td>Coût produit + livraison</td><td>10 400 FCFA</td></tr>
<tr><td>Frais XaalipSay (5 % du montant encaissé, retrait gratuit)</td><td>1 600 FCFA</td></tr>
<tr><td>Marge brute par commande</td><td>20 000 FCFA</td></tr>
<tr><td>Dépense ads (1 commande)</td><td>14 400 FCFA</td></tr>
<tr><td>Taxe pub Meta (20 %)</td><td>2 880 FCFA</td></tr>
<tr><td><strong>Marge nette réelle</strong></td><td><strong>2 720 FCFA</strong></td></tr>
<tr><td>ROAS Meta affiché</td><td>2.22</td></tr>
<tr><td>ROAS réel Netodash</td><td>1.85</td></tr>
</tbody>
</table>
<p>Le ROAS Meta dit 2.22, mais ta vraie rentabilité est 1.85. Si tu pilotes ton budget sur le ROAS Meta, tu scales un produit qui ne te laisse que 2 720 FCFA — soit 8,5 % de marge nette.</p>

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
    title: "Marge nette : la vraie formule (et pourquoi 90 % se trompent)",
    description:
      "Calcul détaillé de la marge nette : produit, livraison, ads, taxes, remboursements. Exemple chiffré et erreurs courantes.",
    excerpt:
      "Tu fais 20 000 000 FCFA de CA et tu te demandes pourquoi ton compte bancaire ne suit pas ? Tu confonds chiffre d'affaires et marge nette. Voici la vraie formule.",
    category: "Rentabilité",
    readMin: 6,
    publishedAt: "2026-06-05",
    tags: ["marge", "rentabilité"],
    html: `
<h2>La vraie formule de la marge nette</h2>
<pre><code>Marge nette = CA livré
  - Coût produit total
  - Frais paiement XaalipSay (5 % de l'encaissement, retrait gratuit)
  - Remboursements
  - Dépense ads + taxes pub
  - Frais boutique + apps
  - Frais bancaires
</code></pre>

<h2>Les 6 coûts que tu sous-estimes</h2>
<ol>
<li><strong>Frais XaalipSay :</strong> 5 % du montant réellement encaissé, retrait gratuit, aucun frais fixe par transaction. Sur 1 000 commandes à 32 000 FCFA, c'est 1 600 000 FCFA rien que là. Et comme sur CopyX une partie des clients ne paie qu'un <strong>acompte</strong>, ces 5 % ne portent que sur l'argent réellement encaissé — pas sur ton CA théorique.</li>
<li><strong>Remboursements :</strong> compte 5 à 15 % du CA. Beaucoup oublient.</li>
<li><strong>Taxe pub Meta :</strong> jusqu'à 20 % au Sénégal selon ton statut (0 % dans certains pays).</li>
<li><strong>Apps de ta boutique :</strong> Klaviyo, DSers, ReConvert, etc. — vite 130 000 à 330 000 FCFA / mois.</li>
<li><strong>Retraits et transferts :</strong> gratuits chez XaalipSay. Aucun frais bancaire caché, aucun frais fixe par transaction : seulement les 5 % prélevés à l'encaissement.</li>
<li><strong>Sponsoring créa :</strong> UGC, vidéos. 130 000 – 660 000 FCFA / mois pour scaler.</li>
</ol>

<h2>Exemple : 20 000 000 FCFA de CA — combien tu touches vraiment ?</h2>
<table>
<thead><tr><th>Poste</th><th>Montant</th></tr></thead>
<tbody>
<tr><td>CA brut boutique</td><td>20 000 000 FCFA</td></tr>
<tr><td>Remboursements (10 %)</td><td>-2 000 000 FCFA</td></tr>
<tr><td>CA livré</td><td>18 000 000 FCFA</td></tr>
<tr><td>Coût produit (30 %)</td><td>-5 400 000 FCFA</td></tr>
<tr><td>XaalipSay (5 % du montant encaissé)</td><td>-900 000 FCFA</td></tr>
<tr><td>Dépense ads</td><td>-8 000 000 FCFA</td></tr>
<tr><td>Taxe pub (20 %)</td><td>-1 600 000 FCFA</td></tr>
<tr><td>Boutique + apps</td><td>-260 000 FCFA</td></tr>
<tr><td>UGC + créa</td><td>-330 000 FCFA</td></tr>
<tr><td><strong>Marge nette</strong></td><td><strong>1 510 000 FCFA</strong></td></tr>
</tbody>
</table>
<p>20 000 000 FCFA de CA = 1 510 000 FCFA de marge nette. Soit <strong>7,6 %</strong>. Beaucoup de drop-shippers se croient à 30 % parce qu'ils ne soustraient que le coût produit.</p>

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
    title: "CPM Meta en 2026 : comment rester rentable malgré la hausse",
    description:
      "Le CPM Meta a doublé en 3 ans. Stratégies concrètes pour rester rentable : créa UGC, scaling vertical, audience BOFU, ROAS net.",
    excerpt:
      "CPM Meta à 16 000 FCFA, audience saturée, concurrence agressive. Les méthodes de 2020 sont mortes. Voici ce qui fonctionne en 2026 — et pourquoi le ROAS net est ton seul KPI.",
    category: "Rentabilité",
    readMin: 7,
    publishedAt: "2026-06-05",
    tags: ["meta ads", "scaling"],
    html: `
<h2>Le constat : CPM x2 en 3 ans</h2>
<p>En 2023, un CPM Meta en Afrique de l'Ouest tournait à 8 000 FCFA. En 2026, on est régulièrement à 16 000 – 23 000 FCFA sur les audiences premium. Les raisons :</p>
<ul>
<li>Saturation publicitaire (iOS 17, Meta IA).</li>
<li>Hausse des enchères (concurrence des grandes marques).</li>
<li>Audience iOS opaque depuis ATT.</li>
</ul>

<h2>Les 4 leviers qui marchent encore</h2>

<h3>1. UGC + créa native</h3>
<p>Les créa "studio" sont mortes. Le format vertical, brut, "filmé au téléphone par un vrai client" double le CTR. Compter 130 000 – 330 000 FCFA / créa, en produire 3 nouvelles par semaine.</p>

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
<p>Meta surestime de 20 à 40 %. Si tu scales sur le ROAS Meta, tu scales sur du vent. Le seul KPI fiable : <strong>ROAS net</strong> = (CA livré - remboursements) / (ads + taxes pub). Sur CopyX, pense aux frais XaalipSay (5 % du montant réellement encaissé, retrait gratuit) : comme une partie des clients ne règle qu'un <strong>acompte</strong> à la commande, ces 5 % ne s'appliquent jamais à ton CA théorique.</p>

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
<p><a href="/">→ Voir Netodash</a></p>
`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
