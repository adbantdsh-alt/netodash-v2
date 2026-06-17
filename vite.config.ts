// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Requis pour Vercel : le preset Lovable (cloudflare-module) est ignoré hors sandbox.
  nitro: {
    preset: "vercel",
    externals: {
      inline: ["tslib"],
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
    ssr: {
      // Forcer tslib à être bundlé inline dans les chunks SSR
      // au lieu d'être gardé comme import bare non résolvable sur Vercel Lambda
      noExternal: ["tslib"],
    },
    optimizeDeps: {
      include: [
        "@tanstack/react-router",
        "@tanstack/router-core",
        "@tanstack/react-query",
        "@supabase/supabase-js",
        "tslib",
      ],
    },
  },
});
