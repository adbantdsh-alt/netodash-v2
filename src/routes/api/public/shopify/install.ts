import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildAuthorizeUrl, normalizeShopDomain, signState } from "@/lib/shopify.server";

export const Route = createFileRoute("/api/public/shopify/install")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const shopRaw = url.searchParams.get("shop") ?? "";
        const userId = url.searchParams.get("user_id") ?? "";
        const shop = normalizeShopDomain(shopRaw);
        if (!shop) return new Response("Domaine boutique invalide", { status: 400 });
        if (!/^[0-9a-f-]{36}$/i.test(userId)) return new Response("user_id invalide", { status: 400 });

        const redirectUri = `${url.origin}/api/public/shopify/callback`;
        const state = signState(userId);
        const authorizeUrl = buildAuthorizeUrl(shop, state, redirectUri);

        return new Response(null, {
          status: 302,
          headers: { Location: authorizeUrl },
        });
      },
    },
  },
});
