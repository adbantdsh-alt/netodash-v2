import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin, ensureRole, logAdminAction } from "./admin-auth.middleware";

const audienceEnum = z.enum(["all", "free", "trial", "paying", "cod", "basic", "starter", "pro"]);
const severityEnum = z.enum(["info", "success", "warning", "critical"]);

export const listAnnouncements = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { admin } = context;
    const { data, error } = await admin
      .from("announcements" as never)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return {
      rows: (data ?? []) as unknown as Array<{
        id: string;
        title: string;
        body: string;
        severity: "info" | "success" | "warning" | "critical";
        audience: "all" | "free" | "trial" | "paying" | "cod" | "basic" | "starter" | "pro";
        cta_label: string | null;
        cta_url: string | null;
        active: boolean;
        starts_at: string;
        ends_at: string | null;
        created_at: string;
      }>,
    };
  });

export const upsertAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(2).max(200),
      body: z.string().min(2).max(2000),
      severity: severityEnum.default("info"),
      audience: audienceEnum.default("all"),
      cta_label: z.string().max(80).nullable().optional(),
      cta_url: z.string().url().nullable().optional(),
      active: z.boolean().default(true),
      starts_at: z.string(),
      ends_at: z.string().nullable().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin", "support"]);

    const payload = {
      title: data.title,
      body: data.body,
      severity: data.severity,
      audience: data.audience,
      cta_label: data.cta_label ?? null,
      cta_url: data.cta_url ?? null,
      active: data.active,
      starts_at: data.starts_at,
      ends_at: data.ends_at ?? null,
      created_by: adminId,
    };

    if (data.id) {
      const { error } = await admin
        .from("announcements" as never)
        .update(payload as never)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      await logAdminAction({
        admin, adminId, adminEmail,
        action: "announcement.update", category: "communication",
        details: { id: data.id, title: data.title, audience: data.audience },
      });
      return { ok: true, id: data.id };
    } else {
      const { data: created, error } = await admin
        .from("announcements" as never)
        .insert(payload as never)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      const id = (created as unknown as { id: string }).id;
      await logAdminAction({
        admin, adminId, adminEmail,
        action: "announcement.create", category: "communication",
        details: { id, title: data.title, audience: data.audience },
      });
      return { ok: true, id };
    }
  });

export const toggleAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ id: z.string().uuid(), active: z.boolean() }))
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin", "support"]);
    const { error } = await admin
      .from("announcements" as never)
      .update({ active: data.active } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAdminAction({
      admin, adminId, adminEmail,
      action: data.active ? "announcement.activate" : "announcement.deactivate",
      category: "communication",
      details: { id: data.id },
    });
    return { ok: true };
  });

export const deleteAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin"]);
    const { error } = await admin
      .from("announcements" as never)
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAdminAction({
      admin, adminId, adminEmail,
      action: "announcement.delete", category: "communication",
      details: { id: data.id },
    });
    return { ok: true };
  });
