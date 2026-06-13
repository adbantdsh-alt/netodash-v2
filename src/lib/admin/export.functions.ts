import { createServerFn } from "@tanstack/react-start";
import { requireAdmin, ensureRole } from "./admin-auth.middleware";

/**
 * Export complet de auth.users (UUID, email, métadonnées, providers, dates).
 * À utiliser UNIQUEMENT pour migration vers un nouveau projet Supabase.
 * Les hash de mots de passe NE SONT PAS exportés (les utilisateurs devront
 * réinitialiser leur mot de passe ou se reconnecter via OAuth).
 */
export const adminExportAuthUsers = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    ensureRole(context.adminRole, ["super_admin"]);
    const { admin } = context;

    const allUsers: Array<Record<string, unknown>> = [];
    let page = 1;
    const perPage = 1000;
    for (let i = 0; i < 50; i++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) throw new Error(error.message);
      const users = data?.users ?? [];
      for (const u of users) {
        allUsers.push({
          id: u.id,
          email: u.email ?? null,
          phone: u.phone ?? null,
          email_confirmed_at: u.email_confirmed_at ?? null,
          phone_confirmed_at: u.phone_confirmed_at ?? null,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          user_metadata: u.user_metadata ?? {},
          app_metadata: u.app_metadata ?? {},
          providers: (u.identities ?? []).map((it) => ({
            provider: it.provider,
            provider_id: (it as { provider_id?: string }).provider_id ?? null,
            identity_data: it.identity_data ?? {},
          })),
        });
      }
      if (users.length < perPage) break;
      page++;
    }

    const payload = JSON.stringify({
      exported_at: new Date().toISOString(),
      count: allUsers.length,
      users: allUsers,
    });
    return { json: payload, count: allUsers.length };
  });

