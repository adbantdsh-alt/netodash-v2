import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireAdmin } from "./admin-auth.middleware.server";

/**
 * Auto-bootstrap super-admin, DÉSACTIVÉ par défaut.
 *
 * Avant : la liste des e-mails était codée en dur dans le source
 * (`adbaxgoat@gmail.com`, `adbaecomx@gmail.com`), donc active même sans
 * configuration. Quiconque prenait le contrôle de l'une de ces boîtes mail
 * obtenait `super_admin` sans aucune action d'un admin existant.
 *
 * Maintenant : la liste vient obligatoirement de l'environnement. Si
 * SUPER_ADMIN_EMAILS est absente, l'auto-bootstrap ne fait rien — les comptes
 * déjà présents dans `admin.accounts` restent administrateurs, donc aucune
 * perte d'accès.
 */
const SUPER_ADMIN_EMAILS = new Set(
  (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

function createServiceClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function ensureBootstrapSuperAdmin(admin: ReturnType<typeof createServiceClient>, userId: string) {
  const { data: authUser, error: userErr } = await admin.auth.admin.getUserById(userId);
  if (userErr || !authUser.user?.email) {
    return { isAdmin: false as const, role: null as string | null };
  }

  const email = authUser.user.email.trim().toLowerCase();
  if (!SUPER_ADMIN_EMAILS.has(email)) {
    return { isAdmin: false as const, role: null as string | null };
  }

  const { error: bootErr } = await admin.rpc("bootstrap_super_admin" as never, {
    _uid: userId,
    _email: email,
  } as never);

  if (bootErr) {
    console.error("[checkIsAdminAccount] bootstrap_super_admin failed", bootErr);
    return { isAdmin: false as const, role: null as string | null };
  }

  return { isAdmin: true as const, role: "super_admin" as const };
}

// Vérifie si le compte AUTHENTIFIÉ est un compte admin (utilisé après login
// pour décider de la redirection).
//
// SECURITY: cet endpoint ne prend plus d'`userId` en entrée. Avant, il était
// appelable sans authentification avec n'importe quel UUID : c'était un oracle
// d'énumération permettant de découvrir quels comptes sont admins (et lesquels
// sont `super_admin`). On vérifie désormais uniquement l'appelant.
export const checkIsAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Configuration serveur Supabase incomplète.");
    }

    const userId = context.userId as string;
    const admin = createServiceClient();
    const [{ data: isAdminData, error: isAdminErr }, { data: roleData, error: roleErr }] =
      await Promise.all([
        admin.rpc("is_admin" as never, { _uid: userId } as never),
        admin.rpc("get_admin_role" as never, { _uid: userId } as never),
      ]);

    if (isAdminErr || roleErr) {
      console.error("[checkIsAdminAccount] rpc error", { isAdminErr, roleErr });
      throw new Error("Impossible de vérifier le compte administrateur.");
    }

    if (isAdminData === true && roleData) {
      return { isAdmin: true, role: roleData as string };
    }

    return ensureBootstrapSuperAdmin(admin, userId);
  });

// Renvoie le profil admin courant
export const getCurrentAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    return {
      id: context.adminId,
      email: context.adminEmail,
      role: context.adminRole,
    };
  });

// Met à jour last_login_at
export const touchAdminLogin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async () => {
    return { ok: true };
  });
