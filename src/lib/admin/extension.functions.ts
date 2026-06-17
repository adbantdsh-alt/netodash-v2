import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ensureRole, logAdminAction, requireAdmin } from "./admin-auth.middleware.server";

export type ExtensionEventRow = {
  id: string;
  clientId: string;
  eventType: string;
  extensionVersion: string | null;
  createdAt: string;
};

export type ExtensionDailyOpen = {
  day: string;
  opens: number;
};

export type ExtensionVersionStat = {
  version: string;
  cnt: number;
};

export type AdminExtensionOverview = {
  cwsUrl: string;
  cwsInstalls: number;
  publishedVersion: string;
  extensionId: string;
  trackedUsersTotal: number;
  trackedUsers7d: number;
  trackedUsers30d: number;
  eventsTotal: number;
  opensToday: number;
  opens7d: number;
  captures7d: number;
  ctaClicks7d: number;
  recalc7d: number;
  siteSignupsExtension: number;
  byVersion: ExtensionVersionStat[];
  dailyOpens: ExtensionDailyOpen[];
  recentEvents: ExtensionEventRow[];
};

function readSettings(raw: Record<string, unknown> | undefined) {
  const s = raw ?? {};
  return {
    cwsUrl: String(s["extension.cws_url"] ?? ""),
    cwsInstalls: Number(s["extension.cws_installs"] ?? 0) || 0,
    publishedVersion: String(s["extension.published_version"] ?? "—"),
    extensionId: String(s["extension.extension_id"] ?? ""),
  };
}

export const adminGetExtensionOverview = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    ensureRole(context.adminRole, ["super_admin", "support", "finance"]);
    const { admin } = context;

    const { data, error } = await admin.rpc("get_extension_admin_stats" as never);
    if (error) {
      const msg = error.message ?? "";
      if (/extension_events|get_extension_admin_stats|schema cache|PGRST205/i.test(msg)) {
        throw new Error(
          "Tables extension absentes en base. Applique la migration 20260616120000_extension_analytics.sql puis recharge.",
        );
      }
      throw new Error(msg);
    }

    const raw = (data ?? {}) as Record<string, unknown>;
    const settings = readSettings(raw.settings as Record<string, unknown> | undefined);

    return {
      ...settings,
      trackedUsersTotal: Number(raw.tracked_users_total ?? 0),
      trackedUsers7d: Number(raw.tracked_users_7d ?? 0),
      trackedUsers30d: Number(raw.tracked_users_30d ?? 0),
      eventsTotal: Number(raw.events_total ?? 0),
      opensToday: Number(raw.opens_today ?? 0),
      opens7d: Number(raw.opens_7d ?? 0),
      captures7d: Number(raw.captures_7d ?? 0),
      ctaClicks7d: Number(raw.cta_clicks_7d ?? 0),
      recalc7d: Number(raw.recalc_7d ?? 0),
      siteSignupsExtension: Number(raw.site_signups_extension ?? 0),
      byVersion: ((raw.by_version ?? []) as ExtensionVersionStat[]).map((v) => ({
        version: String(v.version),
        cnt: Number(v.cnt ?? 0),
      })),
      dailyOpens: ((raw.daily_opens ?? []) as ExtensionDailyOpen[]).map((d) => ({
        day: String(d.day),
        opens: Number(d.opens ?? 0),
      })),
      recentEvents: ((raw.recent_events ?? []) as Record<string, unknown>[]).map(
        (e): ExtensionEventRow => ({
          id: String(e.id),
          clientId: String(e.client_id),
          eventType: String(e.event_type),
          extensionVersion: (e.extension_version as string | null) ?? null,
          createdAt: String(e.created_at),
        }),
      ),
    } satisfies AdminExtensionOverview;
  });

export const adminUpdateExtensionSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      cwsInstalls: z.number().int().min(0).max(10_000_000).optional(),
      cwsUrl: z.string().url().max(500).optional(),
      publishedVersion: z.string().min(1).max(32).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    ensureRole(context.adminRole, ["super_admin", "support"]);
    const { admin, adminId, adminEmail } = context;

    const rows: { key: string; value: string }[] = [];
    if (data.cwsInstalls !== undefined) {
      rows.push({ key: "extension.cws_installs", value: String(data.cwsInstalls) });
    }
    if (data.cwsUrl !== undefined) {
      rows.push({ key: "extension.cws_url", value: data.cwsUrl });
    }
    if (data.publishedVersion !== undefined) {
      rows.push({ key: "extension.published_version", value: data.publishedVersion });
    }

    if (rows.length === 0) return { ok: true, updated: 0 };

    const { error } = await admin.from("app_settings").upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "extension.settings.update",
      category: "extension",
      details: { keys: rows.map((r) => r.key) },
    });

    return { ok: true, updated: rows.length };
  });
