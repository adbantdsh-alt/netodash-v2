import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./legal.mentions";

export const Route = createFileRoute("/legal/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions Générales de Vente — NETODASH" },
      { name: "description", content: "CGV de NETODASH — tarifs, paiement, essai gratuit, résiliation." },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://netodash.com/legal/cgv" },
    ],
    links: [{ rel: "canonical", href: "https://netodash.com/legal/cgv" }],
  }),
  component: CgvPage,
});

function CgvPage() {
  return (
    <LegalShell title="Conditions Générales de Vente">
      <h2>Offres et tarifs</h2>
      <p>
        NETODASH propose un essai gratuit de 7 jours (accès complet, 3 produits
        maximum, sans carte bancaire), puis deux forfaits mensuels :
        Basic à $10/mois (produits illimités, sans Analytics) et
        Pro à $15/mois (Basic + accès Analytics).
        Les prix sont affichés en dollar américain, hors taxes locales applicables.
      </p>

      <h2>Paiement</h2>
      <p>
        Le paiement s'effectue par carte bancaire via Stripe, notre prestataire de paiement sécurisé.
        La facturation est récurrente et automatique, mensuelle, jusqu'à résiliation.
      </p>

      <h2>Essai gratuit</h2>
      <p>
        L'essai gratuit de 7 jours est sans carte bancaire et offre un accès complet
        limité à 3 produits. À la fin de l'essai, un abonnement Basic ($10/mois) ou
        Pro ($15/mois) est nécessaire pour continuer à utiliser NETODASH.
      </p>

      <h2>Résiliation et remboursement</h2>
      <p>
        L'abonnement peut être résilié à tout moment depuis l'espace « Mon
        plan ». La résiliation prend effet à la fin de la période en cours, sans
        remboursement au prorata, sauf obligation légale contraire.
      </p>

      <h2>Droit de rétractation</h2>
      <p>
        Conformément à la législation en vigueur, le droit de rétractation peut
        ne pas s'appliquer aux services numériques dont l'exécution a commencé
        avec l'accord exprès du consommateur.
      </p>

      <h2>Service client</h2>
      <p>Pour toute question : support@netodash.com</p>
    </LegalShell>
  );
}
