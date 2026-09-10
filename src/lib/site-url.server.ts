// Server-only. Source unique de vérité pour l'URL publique du produit.
//
// Objectif : ne plus avoir de domaine en dur dispersé dans le code (c'était le
// cas avant : `app.netodash.com` dans les magic links, `netodash.com` dans les
// allowlists de paiement, des URLs `*.lovable.app` un peu partout). Changer de
// domaine ne doit plus demander de toucher au code.
//
// Variable d'environnement à définir : PUBLIC_SITE_URL
//   Production  → https://netodash.com
//   Preview     → https://<branche>.<projet>.workers.dev
//
// IMPORTANT : c'est l'URL RACINE du domaine. `app.netodash.com` reste servi en
// alias (voir ALLOWED_ORIGINS) pour ne pas casser l'extension Chrome 1.5.2 déjà
// publiée, dont le `host_permissions` et le endpoint de tracking pointent dessus.

/** URL canonique du site, sans slash final. */
export const SITE_URL: string = (
  process.env.PUBLIC_SITE_URL ?? "https://netodash.com"
).replace(/\/+$/, "");

/**
 * Origines autorisées comme cible de redirection après paiement
 * (Stripe `return_url`, callbacks Unitech).
 *
 * Sert à empêcher un open-redirect : sans cette liste, un attaquant pourrait
 * faire rebondir un utilisateur vers un domaine tiers depuis notre propre
 * endpoint de paiement.
 */
const PRODUCTION_ORIGINS: readonly string[] = [
  SITE_URL,
  "https://netodash.com",
  "https://www.netodash.com",
  // Conservé volontairement : extension Chrome v1.5.2 déjà distribuée,
  // anciens e-mails transactionnels et liens partagés.
  "https://app.netodash.com",
];

/** Uniquement utile en développement local. */
const DEV_ORIGINS: readonly string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
];

export const ALLOWED_ORIGINS: ReadonlySet<string> = new Set<string>([
  ...PRODUCTION_ORIGINS,
  ...DEV_ORIGINS,
]);

/**
 * Normalise une origine fournie par le client et la valide contre l'allowlist.
 * Toute valeur absente, malformée ou non autorisée retombe sur SITE_URL.
 */
export function safeOrigin(input: string | undefined | null): string {
  if (!input) return SITE_URL;
  try {
    const u = new URL(input);
    const normalized = `${u.protocol}//${u.host}`;
    return ALLOWED_ORIGINS.has(normalized) ? normalized : SITE_URL;
  } catch {
    return SITE_URL;
  }
}

/**
 * Idem mais strict : lève une erreur au lieu de retomber sur SITE_URL.
 * À utiliser pour les `return_url` où un repli silencieux masquerait un bug
 * de configuration plutôt que de le signaler.
 */
export function assertAllowedOrigin(input: string): string {
  const u = new URL(input);
  const origin = `${u.protocol}//${u.host}`;
  if (!ALLOWED_ORIGINS.has(origin)) {
    throw new Error("Disallowed origin");
  }
  return input;
}
