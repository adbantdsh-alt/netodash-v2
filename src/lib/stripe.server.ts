// Version patchée post-Lovable-Cloud.
// Différences avec l'original :
//   - Supprime le proxy `connector-gateway.lovable.dev` (Stripe en direct)
//   - Supprime la dépendance à LOVABLE_API_KEY
//   - Utilise STRIPE_SANDBOX_API_KEY / STRIPE_LIVE_API_KEY comme VRAIES
//     clés secrètes Stripe (sk_test_... / sk_live_...), pas comme
//     identifiants de gateway.
//
// ⚠ Avant de déployer ce fichier :
//   1. Récupère tes vraies clés secrètes Stripe :
//        - Test mode  → Dashboard Stripe → Developers → API keys → sk_test_...
//        - Live mode  → Dashboard Stripe → Developers → API keys → sk_live_...
//   2. Place-les dans tes secrets serveur (Cloudflare/Vercel/etc) :
//        STRIPE_SANDBOX_API_KEY=sk_test_xxx
//        STRIPE_LIVE_API_KEY=sk_live_xxx
//   3. Récupère les webhook signing secrets dans Developers → Webhooks
//      pour CHAQUE endpoint (sandbox + live) :
//        PAYMENTS_SANDBOX_WEBHOOK_SECRET=whsec_xxx
//        PAYMENTS_LIVE_WEBHOOK_SECRET=whsec_xxx
//   4. Coupon bêta-testeurs -50 % à vie (Products → Coupons, duration: forever) :
//        STRIPE_BETA_50_COUPON_SANDBOX=coupon_id_test
//        STRIPE_BETA_50_COUPON_LIVE=coupon_id_live

import Stripe from "stripe";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

/** Clés secrètes Stripe acceptées par l'API : sk_* / rk_* (pas mk_* Lovable). */
function assertStripeSecretKey(key: string, envKey: string): string {
  const trimmed = key.trim();
  if (!trimmed) throw new Error(`${envKey} is not configured`);
  if (trimmed.startsWith("mk_")) {
    throw new Error(
      `${envKey} contient une clé Lovable (mk_...), pas une clé secrète Stripe. ` +
        "Remplace-la par sk_live_... ou rk_live_... depuis Stripe Dashboard → Developers → API keys.",
    );
  }
  return trimmed;
}

export type StripeEnv = "sandbox" | "live";

export function getStripeSecretKey(env: StripeEnv): string {
  const envKey = env === "sandbox" ? "STRIPE_SANDBOX_API_KEY" : "STRIPE_LIVE_API_KEY";
  return assertStripeSecretKey(getEnv(envKey), envKey);
}

export function createStripeClient(env: StripeEnv): Stripe {
  return new Stripe(getStripeSecretKey(env), {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function verifyWebhook(
  req: Request,
  env: StripeEnv,
): Promise<{ type: string; data: { object: any } }> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret =
    env === "sandbox"
      ? getEnv("PAYMENTS_SANDBOX_WEBHOOK_SECRET")
      : getEnv("PAYMENTS_LIVE_WEBHOOK_SECRET");

  if (!signature || !body) throw new Error("Missing signature or body");

  let timestamp: string | undefined;
  const v1Signatures: string[] = [];
  for (const part of signature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = value;
    if (key === "v1") v1Signatures.push(value);
  }
  if (!timestamp || v1Signatures.length === 0) throw new Error("Invalid signature format");

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) throw new Error("Webhook timestamp too old");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  const expected = Buffer.from(new Uint8Array(signed)).toString("hex");
  if (!v1Signatures.includes(expected)) throw new Error("Invalid webhook signature");

  return JSON.parse(body);
}
