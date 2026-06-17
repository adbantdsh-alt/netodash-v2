import { c as createMiddleware } from "./index.mjs";
import { createClient } from "../_libs/supabase__supabase-js.mjs";
import { s as supabaseAdmin } from "./client.server-CcppqNZQ.mjs";
const SUPER_ADMIN_EMAILS = new Set(
  (process.env.SUPER_ADMIN_EMAILS ?? "adbaxgoat@gmail.com,adbaecomx@gmail.com").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
);
function readBearerToken(request, headers) {
  const fromRequest = request?.headers?.get("authorization");
  if (fromRequest?.startsWith("Bearer ")) return fromRequest.slice("Bearer ".length);
  if (!headers) return null;
  const auth = headers.authorization ?? headers.Authorization;
  if (typeof auth === "string" && auth.startsWith("Bearer ")) return auth.slice("Bearer ".length);
  return null;
}
function readClientMeta(request) {
  const ip = request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request?.headers?.get("x-real-ip") ?? null;
  const userAgent = request?.headers?.get("user-agent") ?? null;
  return { ip, userAgent };
}
async function resolveAdminAccount(userId, email) {
  const admin = supabaseAdmin;
  const queryAdmin = async () => {
    const [isAdminRes2, roleRes2] = await Promise.all([
      admin.rpc("is_admin", { _uid: userId }),
      admin.rpc("get_admin_role", { _uid: userId })
    ]);
    return { isAdminRes: isAdminRes2, roleRes: roleRes2 };
  };
  let { isAdminRes, roleRes } = await queryAdmin();
  if (isAdminRes.error || roleRes.error) {
    console.error("[requireAdmin] rpc error", {
      isAdminErr: isAdminRes.error,
      roleErr: roleRes.error
    });
    throw new Response(
      "Admin check failed: " + (isAdminRes.error?.message ?? roleRes.error?.message ?? "unknown"),
      { status: 500 }
    );
  }
  if ((!isAdminRes.data || !roleRes.data) && SUPER_ADMIN_EMAILS.has(email.trim().toLowerCase())) {
    const { error: bootErr } = await admin.rpc("bootstrap_super_admin", {
      _uid: userId,
      _email: email.trim().toLowerCase()
    });
    if (bootErr) {
      console.error("[requireAdmin] bootstrap_super_admin failed", bootErr);
    } else {
      ({ isAdminRes, roleRes } = await queryAdmin());
    }
  }
  if (isAdminRes.error || roleRes.error) {
    throw new Response(
      "Admin check failed: " + (isAdminRes.error?.message ?? roleRes.error?.message ?? "unknown"),
      { status: 500 }
    );
  }
  if (!isAdminRes.data || !roleRes.data) {
    console.error("[requireAdmin] not admin", { userId, isAdmin: isAdminRes.data, role: roleRes.data });
    throw new Response("Forbidden: not an admin", { status: 403 });
  }
  return {
    admin,
    role: roleRes.data
  };
}
const requireAdmin = createMiddleware({ type: "function" }).server(
  async ({ next, request, headers }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || !SERVICE_KEY) {
      throw new Response("Server misconfigured", { status: 500 });
    }
    const req = request;
    const hdrs = headers;
    const token = readBearerToken(req, hdrs);
    if (!token) {
      throw new Response("Unauthorized", { status: 401 });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims?.sub) {
      throw new Response("Unauthorized", { status: 401 });
    }
    const userId = data.claims.sub;
    const email = data.claims.email ?? "";
    const { admin, role } = await resolveAdminAccount(userId, email);
    const { ip, userAgent } = readClientMeta(req);
    return next({
      context: {
        adminId: userId,
        adminEmail: email,
        adminRole: role,
        supabase,
        admin,
        clientIp: ip,
        clientUserAgent: userAgent
      }
    });
  }
);
async function logAdminAction(args) {
  try {
    await args.admin.rpc("service_log_admin_action", {
      _admin_id: args.adminId,
      _admin_email: args.adminEmail,
      _action: args.action,
      _category: args.category ?? "general",
      _target_user_id: args.targetUserId ?? null,
      _target_email: args.targetEmail ?? null,
      _details: args.details ?? {},
      _ip: args.ip ?? null,
      _user_agent: args.userAgent ?? null
    });
  } catch (e) {
    console.error("[admin] service_log_admin_action failed", e);
  }
}
function auditMeta(context) {
  return {
    ip: context.clientIp ?? null,
    userAgent: context.clientUserAgent ?? null
  };
}
export {
  auditMeta as a,
  logAdminAction as l,
  requireAdmin as r
};
