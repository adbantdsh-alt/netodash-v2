import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./legal.mentions";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — NETODASH" },
      { name: "description", content: "Politique de confidentialité de NETODASH — données collectées, finalités, droits RGPD." },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://netodash.com/legal/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://netodash.com/legal/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalShell title="Politique de confidentialité">
      <p>
        NETODASH respecte la vie privée de ses utilisateurs et s'engage à
        protéger leurs données personnelles conformément au RGPD.
      </p>

      <h2>Données collectées</h2>
      <p>
        Email, mot de passe (haché), données business saisies dans
        l'application (produits, commandes, dépenses), informations de
        facturation gérées par le prestataire de paiement.
      </p>

      <h2>Finalités</h2>
      <p>
        Fournir le service, gérer les abonnements, assurer le support client,
        améliorer le produit, respecter nos obligations légales.
      </p>

      <h2>Sous-traitants</h2>
      <p>
        Hébergement et base de données : fournisseurs de cloud (Cloudflare,
        Supabase). Paiement : Stripe (à venir). IA : Lovable AI Gateway.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données sont conservées tant que le compte est actif, puis
        supprimées dans les 30 jours suivant la suppression du compte.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de
        portabilité et d'opposition. Pour exercer ces droits : support@netodash.com
      </p>

      <h2>Sécurité</h2>
      <p>
        Toutes les données sont chiffrées en transit (HTTPS) et au repos. Les
        accès sont protégés par authentification forte et politiques RLS.
      </p>
    </LegalShell>
  );
}
