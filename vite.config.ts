// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { createRequire } from "module";
import type { Plugin } from "vite";

const _require = createRequire(import.meta.url);

/**
 * tslib est importé comme side-effect par @supabase/auth-js.
 * On le résout vers son fichier réel dans node_modules et on le marque sans
 * side-effects → Rollup l'inline au lieu d'émettre un `import "tslib"` nu.
 * Utile pour tout bundle serverless (Workers comme Lambda).
 */
const tslibResolvePlugin = {
  name: "resolve-tslib-inline",
  resolveId(id: string) {
    if (id === "tslib") {
      try {
        const resolved = _require.resolve("tslib");
        return { id: resolved, moduleSideEffects: false };
      } catch {
        // tslib not found — return virtual empty shim
        return "\0tslib-empty";
      }
    }
  },
  load(id: string) {
    if (id === "\0tslib-empty") {
      return "export {};";
    }
  },
} satisfies Plugin;

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 * Posés ici (et non dans un `_headers` statique) car les pages sont rendues
 * côté serveur : un fichier `_headers` Cloudflare ne couvre que les assets.
 */
const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
  "Cross-Origin-Opener-Policy": "same-origin",
};

/**
 * CSP volontairement en **Report-Only** : elle observe sans jamais bloquer.
 * À passer en `Content-Security-Policy` (enforce) une fois les rapports propres,
 * sinon risque d'écran blanc sur l'hydratation TanStack (scripts inline).
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  // TanStack Start injecte des scripts d'hydratation inline : 'unsafe-inline'
  // reste nécessaire tant qu'on n'a pas câblé de nonce.
  "script-src 'self' 'unsafe-inline' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "form-action 'self' https://checkout.stripe.com",
].join("; ");

export default defineConfig({
  // Cible de déploiement : Cloudflare Workers (module ES).
  //
  // Note : `cloudflare-module` est le preset PAR DÉFAUT du preset Lovable
  // (@lovable.dev/vite-tanstack-config) — c'est Vercel qui était la déviation.
  // Nom canonique du preset Nitro 3 : "cloudflare-module" (stdName: cloudflare_workers).
  nitro: {
    preset: "cloudflare-module",
    // Date de compatibilité VOLONTAIREMENT PINNÉE.
    // Sans ça Nitro met la date du jour, ce qui (a) rend le build non
    // reproductible et (b) casse `wrangler dev` si le workerd installé est plus
    // ancien que cette date, ou fait refuser le déploiement si l'horloge de la
    // machine est en avance sur Cloudflare.
    // 2026-06-18 = dernière date supportée par le workerd de wrangler 4.x ici.
    // À faire évoluer en même temps que la dépendance `wrangler`.
    compatibilityDate: { cloudflare: "2026-06-18" },
    // Nitro ne scanne AUCUN répertoire par défaut (scanDirs: []) : sans cette
    // ligne, `server/tasks/**` est ignoré et les Cron Triggers se déclenchent
    // dans le vide (`const tasks = {}` dans le Worker généré).
    serverDir: "./server",
    // Mêmes chemins de sortie que la config Lovable en sandbox, pour que
    // l'arborescence du build soit prévisible (dist/server + dist/client).
    output: { dir: "dist", serverDir: "dist/server", publicDir: "dist/client" },
    cloudflare: {
      // Injecte nodejs_compat dans la config wrangler générée.
      nodeCompat: true,
      // Laisse Nitro ÉCRIRE lui-même wrangler.jsonc (main, assets, crons…).
      // Les clés qu'on mettrait à la main dans wrangler.jsonc seraient ignorées
      // avec un avertissement : tout passe donc par `cloudflare.wrangler` ci-dessous.
      deployConfig: true,
      // Priorité juste sous les valeurs générées par Nitro (`main`, `assets`,
      // `triggers.crons`) : c'est ici qu'on met ce que Nitro ne calcule pas.
      //
      // @ts-expect-error — `wrangler` est bien lu par Nitro au runtime
      // (vérifié : ces valeurs apparaissent dans dist/server/wrangler.json),
      // mais le type public de @lovable.dev/vite-tanstack-config déclare
      // `cloudflare` de façon fermée avec seulement nodeCompat/deployConfig.
      // Si cette directive devient inutile, c'est que le type a été complété :
      // la retirer.
      wrangler: {
        // Doit correspondre au NOM DU PROJET Cloudflare (« netodash-v2 »,
        // visible dans Workers & Pages). En Workers Builds, c'est le nom du
        // projet qui gagne — mais un `wrangler deploy` manuel utiliserait
        // celui-ci et créerait un SECOND Worker si les deux diffèrent.
        name: "netodash-v2",
        // Logs/analytics d'exécution dans le dashboard Cloudflare.
        observability: { enabled: true },
        // On garde l'URL *.workers.dev le temps de valider le déploiement ;
        // le domaine netodash.com est rattaché ensuite (dashboard ou `routes`).
        workers_dev: true,
      },
    },
    // Le hook rollup:before s'exécute APRÈS que la config par défaut de Nitro est prête
    // (avec ses plugins inject+alias déjà en place). On peut donc ajouter notre plugin
    // sans être écrasé par le defu qui ignore rollupConfig.plugins si le default existe déjà.
    hooks: {
      "rollup:before": (_nitro: unknown, rollupConfig: Record<string, unknown>) => {
        const plugins: unknown[] = (rollupConfig.plugins as unknown[]) || [];
        rollupConfig.plugins = [tslibResolvePlugin, ...plugins];
      },
    },
    routeRules: {
      // En-têtes de sécurité sur tout le site.
      "/**": {
        headers: {
          ...SECURITY_HEADERS,
          "Content-Security-Policy-Report-Only": CSP_REPORT_ONLY,
        },
      },
      // Assets fingerprintés par Vite : immuables.
      "/assets/**": {
        headers: { "cache-control": "public, max-age=31536000, immutable" },
      },
      // Seul endpoint public réellement appelé depuis un navigateur
      // (l'extension Chrome). Les webhooks Stripe/Unitech sont server-to-server
      // et n'ont pas besoin de CORS — on ne l'ouvre donc plus à tout /api/public/**.
      "/api/public/extension-track": {
        cors: true,
      },

      // ── Redirections 301 (le COD est retiré du produit) ──────────────────
      // `/` sert désormais directement la landing. Ces anciennes URLs portaient
      // du référencement : un 301 le transfère vers `/` au lieu de le perdre.
      // Posées au niveau Nitro (donc avant la route) pour être de vrais 301
      // côté serveur, et pas des redirections côté navigateur.
      //
      // ATTENTION : le handler de Nitro lit `options.status`, PAS `statusCode`
      // (vérifié dans le Worker généré : `redirect$1(target, m.options?.status)`).
      // Si on ne met que `statusCode`, Nitro injecte son défaut `status: 307`
      // et la redirection devient TEMPORAIRE — ce qui ne transfère pas le SEO.
      "/dropshipping": { redirect: { to: "/", status: 301 } },
      "/cod": { redirect: { to: "/", status: 301 } },
      "/cod/**": { redirect: { to: "/", status: 301 } },
    },
  },
  vite: {
    // Appliquer aussi au build Vite (double protection)
    plugins: [{ ...tslibResolvePlugin, enforce: "pre" as const }],
    optimizeDeps: {
      include: [
        "@tanstack/react-router",
        "@tanstack/router-core",
        "@tanstack/react-query",
        "@supabase/supabase-js",
      ],
    },
  },
});
