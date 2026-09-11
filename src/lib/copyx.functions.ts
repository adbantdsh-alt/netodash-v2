import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { copyxCheckAccount, isCopyxConfigured } from "./copyx.server";

// La table copyx_connections n'existe pas encore dans src/integrations/supabase/types.ts
// (fichier genere depuis le schema). Un seul cast, a retirer une fois la
// migration appliquee et les types regenerees.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export type CopyxConnection = {
  account: string | null;
  status: string;
  lastSyncAt: string | null;
  lastSyncMessage: string | null;
  configured: boolean;
};

/** État de la connexion CopyX de l'utilisateur courant. */
export const getCopyxConnection = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CopyxConnection> => {
    const userId = context.userId as string;
    // `as any` : la table copyx_connections n'est pas encore dans les types
    // générés (src/integrations/supabase/types.ts) tant qu'elle n'existe pas en
    // base. À retirer après avoir appliqué la migration + regénéré les types.
    const res = (await (db as any)
      .from("copyx_connections")
      .select("account, status, last_sync_at, last_sync_message")
      .eq("user_id", userId)
      .maybeSingle()) as {
      data: {
        account: string | null;
        status: string | null;
        last_sync_at: string | null;
        last_sync_message: string | null;
      } | null;
    };

    return {
      account: res.data?.account ?? null,
      status: res.data?.status ?? "disconnected",
      lastSyncAt: res.data?.last_sync_at ?? null,
      lastSyncMessage: res.data?.last_sync_message ?? null,
      configured: isCopyxConfigured(),
    };
  });

const ConnectInput = z.object({
  account: z.string().trim().min(2).max(120),
  token: z.string().trim().min(8).max(500),
});

/** Enregistre (ou remplace) la connexion CopyX de l'utilisateur. */
export const connectCopyx = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ConnectInput.parse(input))
  .handler(async ({ data, context }) => {
    const userId = context.userId as string;

    const check = await copyxCheckAccount(data.token);
    if (!check.ok) throw new Error(check.message ?? "Connexion CopyX refusée.");

    const row = {
      user_id: userId,
      account: data.account,
      api_token: data.token,
      status: "connected",
      last_sync_at: null,
      last_sync_message: null,
    };

    const { error } = await db
      .from("copyx_connections")
      .upsert(row, { onConflict: "user_id" });
    if (error) throw new Error("Enregistrement impossible : " + error.message);

    return { ok: true as const, label: check.label ?? data.account };
  });

/** Supprime la connexion (et le jeton stocké). */
export const disconnectCopyx = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId as string;
    await (db as any).from("copyx_connections").delete().eq("user_id", userId);
    return { ok: true as const };
  });

/** Lance une synchronisation. L'intégration API est à finaliser (copyx.server.ts). */
export const syncCopyxNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId as string;

    const res = (await (db as any)
      .from("copyx_connections")
      .select("api_token, account")
      .eq("user_id", userId)
      .maybeSingle()) as { data: { api_token: string | null } | null };

    const conn = res.data;
    if (!conn?.api_token) throw new Error("Aucun compte CopyX connecté.");

    const stamp = new Date().toISOString();
    const message =
      "Synchronisation non implémentée : renseigne les endpoints de l'API CopyX dans src/lib/copyx.server.ts.";

    await db
      .from("copyx_connections")
      .update({ last_sync_at: stamp, last_sync_status: "pending", last_sync_message: message })
      .eq("user_id", userId);

    return { ok: false as const, message, at: stamp };
  });
