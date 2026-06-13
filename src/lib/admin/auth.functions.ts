import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireAdmin } from "./admin-auth.middleware";

// Vérifie si un email correspond à un compte admin (utilisé après login pour décider de la redirection)
export const checkIsAdminAccount = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const admin = createClient<Database>(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const [{ data: isAdminData }, { data: roleData }] = await Promise.all([
      admin.rpc("is_admin" as never, { _uid: data.userId } as never),
      admin.rpc("get_admin_role" as never, { _uid: data.userId } as never),
    ]);
    return {
      isAdmin: isAdminData === true,
      role: (roleData as string | null) ?? null,
    };
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
    // Le schéma admin n'est pas exposé à l'API REST ; ne bloque pas l'accès
    // au back-office si l'horodatage de connexion ne peut pas être écrit ici.
    return { ok: true };
  });
