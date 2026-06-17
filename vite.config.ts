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
 * Sur Vercel Lambda (pas de node_modules), `import "tslib"` échoue.
 * Ce plugin Rollup résout "tslib" vers son fichier réel dans node_modules
 * et le marque sans side-effects → Rollup l'inline OU supprime l'import.
 * Ce plugin est ajouté aux deux builds : Vite ET Nitro (qui génère les _ssr/*.mjs).
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

export default defineConfig({
  // Requis pour Vercel : le preset Lovable (cloudflare-module) est ignoré hors sandbox.
  nitro: {
    preset: "vercel",
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
      "/api/public/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
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
