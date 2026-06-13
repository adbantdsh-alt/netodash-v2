import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin, ensureRole, logAdminAction } from "./admin-auth.middleware";

const SETTING_KEYS = [
  "branding.app_name",
  "branding.support_email",
  "branding.tagline",
  "pricing.basic_xof",
  "pricing.starter_xof",
  "pricing.pro_xof",
  "trial.default_days",
  "flags.signup_enabled",
  "flags.affiliate_enabled",
  "flags.maintenance_mode",
  "flags.maintenance_message",
] as const;

const DEFAULTS: Record<(typeof SETTING_KEYS)[number], string> = {
  "branding.app_name": "Netodash",
  "branding.support_email": "support@netodash.com",
  "branding.tagline": "Pilote ton e-commerce sans te ruiner.",
  "pricing.basic_xof": "5000",
  "pricing.starter_xof": "15000",
  "pricing.pro_xof": "30000",
  "trial.default_days": "7",
  "flags.signup_enabled": "true",
  "flags.affiliate_enabled": "true",
  "flags.maintenance_mode": "false",
  "flags.maintenance_message": "",
};

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { admin } = context;
    const { data, error } = await admin
      .from("app_settings")
      .select("key, value, updated_at")
      .in("key", SETTING_KEYS as unknown as string[]);
    if (error) throw new Error(error.message);

    const merged: Record<string, string> = { ...DEFAULTS };
    let latestUpdate: string | null = null;
    for (const row of data ?? []) {
      const key = String(row.key);
      if (key in merged) merged[key] = String(row.value ?? "");
      if (!latestUpdate || (row.updated_at as string) > latestUpdate) {
        latestUpdate = row.updated_at as string;
      }
    }
    return { settings: merged, latestUpdate };
  });

export const updateAdminSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      patch: z.record(z.string(), z.string()),
    }),
  )
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin"]);

    const validKeys = new Set<string>(SETTING_KEYS as unknown as string[]);
    const rows = Object.entries(data.patch)
      .filter(([k]) => validKeys.has(k))
      .map(([key, value]) => ({ key, value }));

    if (rows.length === 0) return { ok: true, updated: 0 };

    const { error } = await admin
      .from("app_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin, adminId, adminEmail,
      action: "settings.update", category: "settings",
      details: { keys: rows.map((r) => r.key) },
    });

    return { ok: true, updated: rows.length };
  });
