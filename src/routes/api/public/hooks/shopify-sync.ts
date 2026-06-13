import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { runShopifySyncForUser } from "@/lib/shopify-sync.server";

export const Route = createFileRoute("/api/public/hooks/shopify-sync")({
  server: {
    handlers: {
      POST: async () => {
        // Auto-sync uniquement pour les utilisateurs qui l'ont activé dans Settings.
        const { data: optedIn } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("auto_sync_enabled", true);
        const enabledIds = new Set((optedIn ?? []).map((p) => p.id));
        const { data: connections } = await supabaseAdmin
          .from("shopify_connections")
          .select("user_id")
          .eq("active", true);
        const list = (connections ?? []).filter((c) => enabledIds.has(c.user_id));
        const results: Array<{ userId: string; ok: boolean; error?: string }> = [];

        // Batch of 5 in parallel to be gentle.
        const batchSize = 5;
        for (let i = 0; i < list.length; i += batchSize) {
          const batch = list.slice(i, i + batchSize);
          const settled = await Promise.allSettled(
            batch.map((c) => runShopifySyncForUser(c.user_id, 2)),
          );
          settled.forEach((r, idx) => {
            const userId = batch[idx].user_id;
            if (r.status === "fulfilled") results.push({ userId, ok: true });
            else results.push({ userId, ok: false, error: String(r.reason?.message ?? r.reason) });
          });
        }

        return Response.json({ processed: results.length, results });
      },
    },
  },
});
