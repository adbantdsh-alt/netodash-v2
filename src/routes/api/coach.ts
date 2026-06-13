// Version patchée post-Lovable-Cloud du coach IA streaming.
// Différences avec l'original :
//   - Remplace l'appel à `ai.gateway.lovable.dev` par un appel DIRECT à
//     l'API OpenAI (compatible SSE token-par-token).
//   - Supprime la dépendance à LOVABLE_API_KEY.
//   - Le reste (auth, rate limit, plan check, logging coach_usage,
//     system prompt, validation Zod) est strictement identique.
//
// ⚠ Avant de déployer :
//   1. Crée une clé API OpenAI : https://platform.openai.com/api-keys
//   2. Ajoute-la dans tes secrets serveur :
//        OPENAI_API_KEY=sk-proj-...
//   3. Le modèle par défaut est `gpt-4o-mini` (équivalent qualité/prix
//      à Gemini 2.5 Flash). Tu peux le surcharger via :
//        COACH_MODEL=gpt-4o     (plus cher, meilleur)
//        COACH_MODEL=gpt-4.1-mini
//
// Variante Anthropic Claude : voir la note en bas de fichier.

import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const RATE_LIMITS = {
  pro: { perDay: 200, perMinute: 10 },
} as const;

async function verifyAuth(request: Request): Promise<string | null> {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getClaims(token);
  if (error || !data?.claims?.sub) return null;
  return data.claims.sub as string;
}

async function getCoachTier(userId: string): Promise<"pro" | null> {
  const { data, error } = await supabaseAdmin.rpc("get_user_plan", { _uid: userId });
  if (error) {
    console.error("get_user_plan RPC failed", error);
    return null;
  }
  return (data as string | null) === "pro" ? "pro" : null;
}

async function countUsageSince(userId: string, since: Date): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("coach_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since.toISOString());
  if (error) {
    console.error("coach_usage count failed", error);
    return 0;
  }
  return count ?? 0;
}

const dailySchema = z.object({
  date: z.string(),
  revenue: z.number(),
  adSpend: z.number(),
  netProfit: z.number(),
  roas: z.number(),
  shopifyOrders: z.number(),
  refundedOrders: z.number().optional(),
  refundedAmount: z.number().optional(),
  notes: z.string().nullable().optional(),
});

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
  context: z.object({
    productName: z.string().nullable().optional(),
    currency: z.string().min(1).max(10),
    period: z.string().min(1).max(40),
    userLevel: z.enum(["débutant", "opérateur"]).optional(),
    kpis: z.object({
      revenue: z.number(),
      adSpend: z.number(),
      netProfit: z.number(),
      roas: z.number(),
      shopifyOrders: z.number(),
      refundedOrders: z.number().optional(),
      refundedAmount: z.number().optional(),
      costPerOrder: z.number().optional(),
    }),
    testing: z
      .object({
        dayIndex: z.number(),
        totalDays: z.number(),
        isComplete: z.boolean(),
      })
      .nullable()
      .optional(),
    dailySeries: z.array(dailySchema).max(60).optional(),
  }),
});

function buildSystemPrompt(ctx: z.infer<typeof bodySchema>["context"]): string {
  const series = ctx.dailySeries ?? [];
  const seriesBlock =
    series.length > 0
      ? series
          .map((s, i) => {
            const note = s.notes ? ` · NOTE: ${s.notes.replace(/\s+/g, " ").slice(0, 200)}` : "";
            return `J${i + 1} (${s.date}) : pub ${Math.round(s.adSpend)} · CA ${Math.round(s.revenue)} · profit ${Math.round(s.netProfit)} · ROAS ${s.roas.toFixed(2)} · cmd ${s.shopifyOrders}${note}`;
          })
          .join("\n")
      : "(aucune série journalière)";

  const testingBlock = ctx.testing
    ? `Phase de testing : JOUR ${ctx.testing.dayIndex} / ${ctx.testing.totalDays}${ctx.testing.isComplete ? " (TERMINÉE)" : " (EN COURS)"}`
    : "Pas de fenêtre de testing active (vue agrégée tous produits).";

  const levelBlock =
    ctx.userLevel === "débutant"
      ? "L'utilisateur est DÉBUTANT — explique le pourquoi, sois pédagogique, tutoie."
      : "L'utilisateur est OPÉRATEUR — va droit au but, sans pédagogie superflue.";

  return `Tu es un COACH EXPERT META ADS spécialisé en DROPSHIPPING e-commerce.
Tu réponds en FRANÇAIS, direct, sans bla-bla, avec des chiffres et des actions concrètes.

CONTEXTE DE L'UTILISATEUR :
- Produit analysé : ${ctx.productName ?? "Tous produits confondus"}
- Devise : ${ctx.currency} · Période : ${ctx.period}
- ${testingBlock}
- ${levelBlock}

CHIFFRES AGRÉGÉS DE LA PÉRIODE :
- Marge nette : ${Math.round(ctx.kpis.netProfit)} ${ctx.currency}
- CA encaissé : ${Math.round(ctx.kpis.revenue)} ${ctx.currency}
- Pub : ${Math.round(ctx.kpis.adSpend)} ${ctx.currency}
- ROAS : ${ctx.kpis.roas.toFixed(2)}
- Commandes Shopify : ${ctx.kpis.shopifyOrders}${ctx.kpis.refundedOrders ? ` · Remboursées : ${ctx.kpis.refundedOrders} (${Math.round(ctx.kpis.refundedAmount ?? 0)} ${ctx.currency})` : ""}
${ctx.kpis.costPerOrder ? `- Coût/commande : ${Math.round(ctx.kpis.costPerOrder)} ${ctx.currency}` : ""}

DÉTAIL JOUR PAR JOUR :
${seriesBlock}

RÈGLES DE COACHING (CRITIQUES) :
- JAMAIS conseiller de couper sur J1 — un jour ne dit rien.
- Pour scaler : +20-30%/jour, JAMAIS doubler avant J7 (Meta replonge en apprentissage).
- Si une NOTE journalière est présente (stock retard, créa changée, promo, panne fournisseur…), TIENS-EN COMPTE explicitement dans ton analyse au lieu de traiter le jour comme un signal pur.
- ROAS > 3 stable sur 3 jours → feu vert pour scaler.
- ROAS 1.8–3 → optimiser AVANT de scaler (créa, audience, page produit).
- ROAS < 1.8 sur fin de fenêtre → couper ou pivoter angle.
- Taux de remboursement > 5% → audit qualité produit / SAV / fournisseur.

FORMAT :
- Réponds en MARKDOWN (titres, gras, listes).
- Si la question est large ("que faire ?") : 3-4 actions claires en bullets, chacune commençant par un verbe à l'impératif en MAJUSCULES.
- Si la question est précise : réponse précise et chiffrée, pas de bullets forcés.
- Cite TOUJOURS les vrais chiffres de l'utilisateur quand pertinent (pas des chiffres génériques).
- Si la question sort du dropshipping/Meta Ads/e-commerce, recadre poliment en une phrase.
- Pas d'intro ("Bonjour", "Bien sûr"), pas de conclusion ("J'espère que…"). Va droit au but.`;
}

export const Route = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await verifyAuth(request);
        if (!userId) {
          return new Response(
            JSON.stringify({ error: "Authentification requise." }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const tier = await getCoachTier(userId);
        if (!tier) {
          return new Response(
            JSON.stringify({
              error: "Le coach IA est réservé au plan Pro. Passe à Pro depuis ta page Mon plan.",
            }),
            { status: 403, headers: { "Content-Type": "application/json" } },
          );
        }

        const limits = RATE_LIMITS[tier];
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const minuteAgo = new Date(now.getTime() - 60 * 1000);

        const [dayCount, minuteCount] = await Promise.all([
          countUsageSince(userId, dayAgo),
          countUsageSince(userId, minuteAgo),
        ]);

        if (dayCount >= limits.perDay) {
          return new Response(
            JSON.stringify({
              error: `Limite quotidienne atteinte (${limits.perDay} questions/jour). Réessaie demain.`,
            }),
            { status: 429, headers: { "Content-Type": "application/json" } },
          );
        }
        if (minuteCount >= limits.perMinute) {
          return new Response(
            JSON.stringify({
              error: `Trop de questions en peu de temps (${limits.perMinute}/min). Patiente quelques secondes.`,
            }),
            { status: 429, headers: { "Content-Type": "application/json" } },
          );
        }

        await supabaseAdmin
          .from("coach_usage")
          .insert({ user_id: userId })
          .then(({ error }) => {
            if (error) console.error("coach_usage insert failed", error);
          });

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "Service IA non configuré (OPENAI_API_KEY manquant)." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
        const model = process.env.COACH_MODEL || "gpt-4o-mini";

        let parsed: z.infer<typeof bodySchema>;
        try {
          const json = await request.json();
          parsed = bodySchema.parse(json);
        } catch {
          return new Response(
            JSON.stringify({ error: "Requête invalide." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const systemPrompt = buildSystemPrompt(parsed.context);

        let upstream: Response;
        try {
          upstream = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              stream: true,
              messages: [
                { role: "system", content: systemPrompt },
                ...parsed.messages,
              ],
            }),
          });
        } catch (e) {
          console.error("Coach upstream fetch failed", e);
          return new Response(
            JSON.stringify({ error: "Le coach IA est injoignable." }),
            { status: 502, headers: { "Content-Type": "application/json" } },
          );
        }

        if (upstream.status === 429) {
          return new Response(
            JSON.stringify({
              error: "Trop de questions au coach en peu de temps. Réessaie dans 1 minute.",
            }),
            { status: 429, headers: { "Content-Type": "application/json" } },
          );
        }
        if (upstream.status === 401 || upstream.status === 403) {
          return new Response(
            JSON.stringify({ error: "Clé OpenAI invalide ou crédits épuisés." }),
            { status: 402, headers: { "Content-Type": "application/json" } },
          );
        }
        if (!upstream.ok || !upstream.body) {
          const t = await upstream.text().catch(() => "");
          console.error("Coach upstream error", upstream.status, t);
          return new Response(
            JSON.stringify({ error: "Le coach IA n'a pas répondu." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        // OpenAI renvoie déjà du SSE compatible avec le format attendu côté client
        // (data: {"choices":[{"delta":{"content":"..."}}]}). Aucun transcodage.
        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});

// =============================================================================
// VARIANTE ANTHROPIC CLAUDE (si tu préfères Claude à GPT)
// =============================================================================
// Anthropic utilise un format SSE différent (`event: content_block_delta` au lieu
// de `data: {...choices...}`). Le client Netodash est codé pour le format OpenAI,
// donc il faudrait :
//   - soit adapter le parser côté client (src/components/CoachChat.tsx)
//   - soit transcoder le stream côté serveur
//
// Le plus simple : utilise un proxy comme `openrouter.ai` qui accepte le format
// OpenAI et donne accès à Claude/Gemini/GPT en switchant juste le `model`:
//
//   apiUrl = "https://openrouter.ai/api/v1/chat/completions"
//   model = "anthropic/claude-3.5-sonnet"  // ou "google/gemini-2.5-flash"
//
// → garde le code OpenAI ci-dessus, remplace juste l'URL et le model. Une seule
//   clé `OPENROUTER_API_KEY` te donne accès à tout l'écosystème.
