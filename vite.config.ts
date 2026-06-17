// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * tslib est importé comme side-effect (`import "tslib"`) par @supabase/auth-js
 * compilé avec importHelpers:true. Sur Vercel Lambda il n'y a pas de node_modules,
 * donc le bare specifier échoue avec ERR_MODULE_NOT_FOUND.
 * Les helpers TS sont déjà inlinés par le compilateur — on remplace tslib par un
 * module virtuel vide, ce qui est équivalent au _libs/tslib.mjs vide généré par Nitro.
 */
const tslibShimPlugin: Plugin = {
  name: "tslib-virtual-shim",
  enforce: "pre",
  resolveId(id) {
    if (id === "tslib") return "\0tslib-shim";
  },
  load(id) {
    if (id === "\0tslib-shim") {
      return "// tslib shim — helpers already inlined by TypeScript\nexport {};";
    }
  },
};

export default defineConfig({
  // Requis pour Vercel : le preset Lovable (cloudflare-module) est ignoré hors sandbox.
  nitro: {
    preset: "vercel",
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
    plugins: [tslibShimPlugin],
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
