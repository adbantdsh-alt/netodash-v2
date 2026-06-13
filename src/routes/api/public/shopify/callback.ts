import { createFileRoute } from "@tanstack/react-router";
import {
  exchangeCodeForToken,
  normalizeShopDomain,
  verifyShopifyHmac,
  verifyState,
} from "@/lib/shopify.server";
import { persistConnection } from "@/lib/shopify-sync.server";

export const Route = createFileRoute("/api/public/shopify/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams;

        if (!verifyShopifyHmac(query)) {
          return new Response("Signature HMAC invalide", { status: 401 });
        }

        const shop = normalizeShopDomain(query.get("shop") ?? "");
        const code = query.get("code");
        const state = query.get("state");
        if (!shop || !code || !state) return new Response("Paramètres manquants", { status: 400 });

        const verified = verifyState(state);
        if (!verified) return new Response("State invalide ou expiré", { status: 401 });

        const tok = await exchangeCodeForToken(shop, code);
        await persistConnection({
          userId: verified.userId,
          shop,
          accessToken: tok.access_token,
          scope: tok.scope,
        });

        return new Response(null, {
          status: 302,
          headers: { Location: "/products?shopify=connected" },
        });
      },
    },
  },
});
