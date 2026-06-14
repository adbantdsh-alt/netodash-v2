export type AdminRole = "super_admin" | "support" | "finance";

export function ensureRole(role: AdminRole, allowed: AdminRole[]) {
  if (!allowed.includes(role)) {
    throw new Response("Forbidden: insufficient role", { status: 403 });
  }
}
