// Tâche planifiée Nitro, exécutée par un Cron Trigger Cloudflare.
//
// Remplace l'ancien endpoint HTTP `/api/public/hooks/shopify-sync`, qui était
// accessible SANS AUCUNE AUTHENTIFICATION : n'importe qui pouvait déclencher la
// synchronisation Shopify de tous les utilisateurs opt-in (abus de ressources,
// rate-limit Shopify, écritures massives en base).
//
// Désormais la synchronisation n'est plus joignable en HTTP du tout : seul le
// planificateur Cloudflare peut la lancer, via le handler `scheduled` du Worker.
//
// Le cron est déclaré dans vite.config.ts (`nitro.scheduledTasks`), qui génère
// automatiquement les `crons` de la config wrangler.
import { defineTask } from "nitro/task";
import { supabaseAdmin } from "../../src/integrations/supabase/client.server";
import { runShopifySyncForUser } from "../../src/lib/shopify-sync.server";

export default defineTask({
  meta: {
    name: "shopify-sync",
    description: "Synchronise les boutiques Shopify des utilisateurs ayant activé l'auto-sync.",
  },
  async run() {
    const { data: optedIn, error: optInError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("auto_sync_enabled", true);

    if (optInError) {
      console.error("[task:shopify-sync] lecture des profils opt-in impossible", optInError);
      return { result: { ok: false, reason: "profiles_query_failed" } };
    }

    const enabledIds = new Set((optedIn ?? []).map((p) => p.id));

    const { data: connections, error: connError } = await supabaseAdmin
      .from("shopify_connections")
      .select("user_id")
      .eq("active", true);

    if (connError) {
      console.error("[task:shopify-sync] lecture des connexions impossible", connError);
      return { result: { ok: false, reason: "connections_query_failed" } };
    }

    const targets = (connections ?? []).filter((c) => enabledIds.has(c.user_id));
    const results: Array<{ userId: string; ok: boolean; error?: string }> = [];

    // Lots de 5 en parallèle : on reste courtois avec l'API Shopify et on
    // n'épuise pas le CPU time du Worker (limite : 30 s par Cron Trigger).
    const batchSize = 5;
    for (let i = 0; i < targets.length; i += batchSize) {
      const batch = targets.slice(i, i + batchSize);
      const settled = await Promise.allSettled(batch.map((c) => runShopifySyncForUser(c.user_id, 2)));
      settled.forEach((r, idx) => {
        const userId = batch[idx].user_id as string;
        if (r.status === "fulfilled") {
          results.push({ userId, ok: true });
        } else {
          results.push({
            userId,
            ok: false,
            error: String((r.reason as { message?: string } | undefined)?.message ?? r.reason),
          });
        }
      });
    }

    const failed = results.filter((r) => !r.ok).length;
    console.log(`[task:shopify-sync] ${results.length} traités, ${failed} en échec`);

    return {
      result: {
        ok: failed === 0,
        processed: results.length,
        failed,
        // On ne renvoie pas les userId dans le résultat pour ne pas les faire
        // remonter dans les logs d'exécution du cron.
      },
    };
  },
});
