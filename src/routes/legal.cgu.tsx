import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./legal.mentions";

export const Route = createFileRoute("/legal/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions Générales d'Utilisation — NETODASH" },
      { name: "description", content: "CGU de NETODASH — règles d'utilisation du service SaaS de rentabilité Dropshipping & COD." },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://netodash.com/legal/cgu" },
    ],
    links: [{ rel: "canonical", href: "https://netodash.com/legal/cgu" }],
  }),
  component: CguPage,
});

function CguPage() {
  return (
    <LegalShell title="Conditions Générales d'Utilisation">
      <p>
        En utilisant NETODASH, vous acceptez les présentes Conditions Générales
        d'Utilisation (CGU).
      </p>

      <h2>Objet</h2>
      <p>
        NETODASH est un service SaaS d'analyse de rentabilité destiné aux
        e-commerçants opérant en COD (Cash On Delivery).
      </p>

      <h2>Compte utilisateur</h2>
      <p>
        L'inscription nécessite une adresse email valide. L'utilisateur est
        responsable de la confidentialité de ses identifiants et de toute
        activité réalisée depuis son compte.
      </p>

      <h2>Utilisation du service</h2>
      <p>
        L'utilisateur s'engage à ne pas détourner le service, ne pas tenter
        d'accéder aux données d'autres utilisateurs, et à respecter les lois en
        vigueur.
      </p>

      <h2>Disponibilité</h2>
      <p>
        NETODASH s'efforce de maintenir une disponibilité maximale mais ne
        garantit aucun engagement de service (SLA) sauf indication contraire.
      </p>

      <h2>Résiliation</h2>
      <p>
        L'utilisateur peut supprimer son compte à tout moment. NETODASH se
        réserve le droit de suspendre un compte en cas de manquement aux CGU.
      </p>

      <h2>Modification</h2>
      <p>
        Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs
        seront informés de toute modification substantielle.
      </p>
    </LegalShell>
  );
}
