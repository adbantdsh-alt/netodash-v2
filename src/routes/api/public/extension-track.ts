import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_EVENTS = new Set(["open", "capture", "cta_click", "recalc"]);

export const Route = createFileRoute("/api/public/extension-track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cors = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        };

        let body: Record<string, unknown>;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ ok: false, reason: "invalid_json" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }

        const clientId = String(body.clientId ?? body.client_id ?? "").trim();
        const eventType = String(body.event ?? body.event_type ?? "").trim().toLowerCase();
        const version = String(body.version ?? body.extension_version ?? "").trim() || null;

        if (clientId.length < 8 || clientId.length > 128 || !ALLOWED_EVENTS.has(eventType)) {
          return new Response(JSON.stringify({ ok: false, reason: "invalid_payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }

        try {
          // Import dynamique pour éviter tout problème d'initialisation de module
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.rpc("track_extension_event" as never, {
            p_client_id: clientId,
            p_event_type: eventType,
            p_extension_version: version,
            p_meta: {},
          } as never);

          if (error) {
            console.error("[extension-track]", error.message);
            return new Response(JSON.stringify({ ok: false }), {
              status: 200,
              headers: { "Content-Type": "application/json", ...cors },
            });
          }

          return new Response(JSON.stringify(data ?? { ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...cors },
          });
        } catch (err) {
          console.error("[extension-track] unexpected error", err);
          return new Response(JSON.stringify({ ok: false }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
      },
    },
  },
});
