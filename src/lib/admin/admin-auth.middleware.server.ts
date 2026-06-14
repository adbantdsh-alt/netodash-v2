// Middleware admin : valide la session Supabase + vérifie que l'utilisateur
// est dans admin.accounts avec un statut actif. Charge le rôle dans le context.
import { createMiddleware } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { AdminRole } from "./admin-auth.types";

export type { AdminRole } from "./admin-auth.types";
export { ensureRole } from "./admin-auth.types";

const SUPER_ADMIN_EMAILS = new Set(
  (process.env.SUPER_ADMIN_EMAILS ?? "adbaxgoat@gmail.com,adbaecomx@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

async function resolveAdminAccount(userId: string, email: string) {
  const admin = supabaseAdmin;

  const queryAdmin = async () => {
    const [isAdminRes, roleRes] = (await Promise.all([
      admin.rpc("is_admin" as never, { _uid: userId } as never),
      admin.rpc("get_admin_role" as never, { _uid: userId } as never),
    ])) as unknown as [
      { data: boolean | null; error: { message: string } | null },
      { data: string | null; error: { message: string } | null },
    ];
    return { isAdminRes, roleRes };
  };

  let { isAdminRes, roleRes } = await queryAdmin();

  if (isAdminRes.error || roleRes.error) {
    console.error("[requireAdmin] rpc error", {
      isAdminErr: isAdminRes.error,
      roleErr: roleRes.error,
    });
    throw new Response(
      "Admin check failed: " + (isAdminRes.error?.message ?? roleRes.error?.message ?? "unknown"),
      { status: 500 },
    );
  }

  if ((!isAdminRes.data || !roleRes.data) && SUPER_ADMIN_EMAILS.has(email.trim().toLowerCase())) {
    const { error: bootErr } = await admin.rpc("bootstrap_super_admin" as never, {
      _uid: userId,
      _email: email.trim().toLowerCase(),
    } as never);
    if (bootErr) {
      console.error("[requireAdmin] bootstrap_super_admin failed", bootErr);
    } else {
      ({ isAdminRes, roleRes } = await queryAdmin());
    }
  }

  if (isAdminRes.error || roleRes.error) {
    throw new Response(
      "Admin check failed: " + (isAdminRes.error?.message ?? roleRes.error?.message ?? "unknown"),
      { status: 500 },
    );
  }
  if (!isAdminRes.data || !roleRes.data) {
    console.error("[requireAdmin] not admin", { userId, isAdmin: isAdminRes.data, role: roleRes.data });
    throw new Response("Forbidden: not an admin", { status: 403 });
  }

  return {
    admin,
    role: roleRes.data as AdminRole,
  };
}

export const requireAdmin = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || !SERVICE_KEY) {
      throw new Response("Server misconfigured", { status: 500 });
    }

    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const authHeader = request?.headers?.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Response("Unauthorized", { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims?.sub) {
      throw new Response("Unauthorized", { status: 401 });
    }
    const userId = data.claims.sub as string;
    const email = (data.claims.email as string) ?? "";

    const { admin, role } = await resolveAdminAccount(userId, email);

    return next({
      context: {
        adminId: userId,
        adminEmail: email,
        adminRole: role,
        supabase,
        admin,
      },
    });
  },
);

export async function logAdminAction(args: {
  admin: ReturnType<typeof createClient<Database>>;
  adminId: string;
  adminEmail: string;
  action: string;
  category?: string;
  targetUserId?: string | null;
  targetEmail?: string | null;
  details?: Record<string, unknown>;
}) {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const ip =
      request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request?.headers?.get("x-real-ip") ??
      null;
    const userAgent = request?.headers?.get("user-agent") ?? null;

    await args.admin.rpc("service_log_admin_action", {
      _admin_id: args.adminId,
      _admin_email: args.adminEmail,
      _action: args.action,
      _category: args.category ?? "general",
      _target_user_id: args.targetUserId ?? null,
      _target_email: args.targetEmail ?? null,
      _details: (args.details ?? {}) as never,
      _ip: ip,
      _user_agent: userAgent,
    });
  } catch (e) {
    console.error("[admin] service_log_admin_action failed", e);
  }
}
