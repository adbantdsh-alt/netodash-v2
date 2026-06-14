import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AdminRole } from "./admin-auth.types";
import { ensureRole, logAdminAction, requireAdmin } from "./admin-auth.middleware.server";

export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(10).max(200).default(50),
      category: z.string().optional(),
      adminEmail: z.string().optional(),
      search: z.string().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { admin } = context;
    const { data: rows, error } = (await admin.rpc("admin_list_audit_logs" as never, {
      _page: data.page,
      _page_size: data.pageSize,
      _category: data.category ?? null,
      _admin_email: data.adminEmail ?? null,
      _search: data.search ?? null,
    } as never)) as unknown as {
      data:
        | Array<{
            id: number;
            admin_id: string | null;
            admin_email: string;
            action: string;
            category: string;
            target_user_id: string | null;
            target_email: string | null;
            details: Record<string, any>;
            created_at: string;
            total_count: number;
          }>
        | null;
      error: { message: string } | null;
    };

    if (error) throw new Error(error.message);
    const list = rows ?? [];
    const total = list.length > 0 ? Number(list[0].total_count) : 0;
    return {
      rows: list.map(({ total_count: _t, ...r }) => r),
      total,
      page: data.page,
      pageSize: data.pageSize,
    };
  });

export const listAdminAccounts = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { admin } = context;
    const { data, error } = (await admin.rpc("admin_list_accounts" as never)) as unknown as {
      data:
        | Array<{
            id: string;
            email: string;
            display_name: string | null;
            role: AdminRole;
            status: string;
            last_login_at: string | null;
            created_at: string;
          }>
        | null;
      error: { message: string } | null;
    };
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const inviteAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      email: z.string().email(),
      role: z.enum(["super_admin", "support", "finance"]),
      display_name: z.string().max(120).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin"]);

    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) throw new Error(listErr.message);
    const target = list.users.find((u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase());
    if (!target) {
      throw new Error("Cet email n'a pas de compte Netodash. L'utilisateur doit d'abord s'inscrire.");
    }

    const { error } = (await admin.rpc("admin_upsert_account" as never, {
      _id: target.id,
      _email: target.email,
      _display_name: data.display_name ?? null,
      _role: data.role,
      _invited_by: adminId,
    } as never)) as unknown as { error: { message: string } | null };
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "admin.account.invite",
      category: "security",
      targetUserId: target.id,
      targetEmail: target.email,
      details: { role: data.role },
    });

    return { ok: true };
  });

export const updateAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      role: z.enum(["super_admin", "support", "finance"]).optional(),
      status: z.enum(["active", "suspended", "revoked"]).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin"]);

    if (data.id === adminId && (data.status === "revoked" || data.status === "suspended")) {
      throw new Error("Vous ne pouvez pas vous suspendre ou révoquer vous-même.");
    }

    const { data: email, error } = (await admin.rpc("admin_update_account" as never, {
      _id: data.id,
      _role: data.role ?? null,
      _status: data.status ?? null,
    } as never)) as unknown as { data: string | null; error: { message: string } | null };
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "admin.account.update",
      category: "security",
      targetUserId: data.id,
      targetEmail: email ?? null,
      details: { role: data.role, status: data.status },
    });

    return { ok: true };
  });

export const removeAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { admin, adminId, adminEmail, adminRole } = context;
    ensureRole(adminRole, ["super_admin"]);
    if (data.id === adminId) throw new Error("Vous ne pouvez pas vous retirer vous-même.");

    const { data: email, error } = (await admin.rpc("admin_delete_account" as never, {
      _id: data.id,
    } as never)) as unknown as { data: string | null; error: { message: string } | null };
    if (error) throw new Error(error.message);

    await logAdminAction({
      admin,
      adminId,
      adminEmail,
      action: "admin.account.remove",
      category: "security",
      targetUserId: data.id,
      targetEmail: email ?? null,
    });

    return { ok: true };
  });
