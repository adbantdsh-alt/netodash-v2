import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "./legal.mentions";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Politique cookies — NETODASH" },
      { name: "description", content: "Politique d'utilisation des cookies de NETODASH — cookies essentiels uniquement." },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://netodash.com/legal/cookies" },
    ],
    links: [{ rel: "canonical", href: "https://netodash.com/legal/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalShell title="Politique cookies">
      <p>
        NETODASH utilise un nombre limité de cookies, strictement nécessaires
        au fonctionnement du service.
      </p>

      <h2>Cookies essentiels</h2>
      <p>
        Cookies de session pour vous maintenir connecté, cookies de sécurité
        (CSRF). Ces cookies ne nécessitent pas votre consentement.
      </p>

      <h2>Cookies analytiques</h2>
      <p>
        Si activés, ils nous aident à comprendre l'usage du service de manière
        agrégée et anonyme. Vous pouvez les désactiver à tout moment.
      </p>

      <h2>Cookies tiers</h2>
      <p>
        Le prestataire de paiement (Stripe) peut déposer ses propres cookies
        sur les pages de paiement.
      </p>

      <h2>Gestion</h2>
      <p>
        Vous pouvez gérer ou supprimer les cookies via les paramètres de votre
        navigateur. Notez que désactiver les cookies essentiels rendra le
        service inutilisable.
      </p>
    </LegalShell>
  );
}
