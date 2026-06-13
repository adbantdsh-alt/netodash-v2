import {
  createFileRoute,
  Outlet,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentAdmin, touchAdminLogin } from "@/lib/admin/auth.functions";
import { getSupabaseAuthHeaders } from "@/lib/admin/auth-headers";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminLogo } from "@/components/admin/AdminLogo";
import "@/styles/admin.css";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/admin/login" as never });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const fetchCurrentAdmin = useServerFn(getCurrentAdmin);
  const markAdminLogin = useServerFn(touchAdminLogin);
  const [me, setMe] = useState<{ email: string; role: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    if (navOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [navOpen]);

  useEffect(() => {
    (async () => {
      try {
        const headers = await getSupabaseAuthHeaders();
        const data = await fetchCurrentAdmin({ headers });
        setMe({ email: data.email, role: data.role });
        await markAdminLogin({ headers });
      } catch (e) {
        console.error("[admin] access denied", e);
        setError(e instanceof Error ? e.message : "Accès refusé");
        setTimeout(() => navigate({ to: "/admin/login" as never }), 1200);
      }
    })();
  }, [fetchCurrentAdmin, markAdminLogin, navigate]);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" as never });
  };

  if (error) {
    return (
      <div
        data-admin-root
        className="min-h-screen flex items-center justify-center"
      >
        <div className="admin-card">
          <h2>{error}</h2>
          <p className="text-sm mt-2">Redirection…</p>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div data-admin-root className="min-h-screen flex items-center justify-center">
        <div className="text-xs uppercase tracking-widest">Chargement…</div>
      </div>
    );
  }

  return (
    <div data-admin-root className="min-h-screen">
      {/* Mobile top bar */}
      <header
        className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b-2"
        style={{ background: "#000", color: "#fff", borderColor: "#000" }}
      >
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 -ml-2"
          style={{ color: "#fff" }}
        >
          <Menu size={22} />
        </button>
        <div style={{ filter: "invert(0)" }}>
          <AdminLogo inverted />
        </div>
        <div style={{ width: 22 }} aria-hidden />
      </header>

      <AdminSidebar
        email={me.email}
        role={me.role}
        onSignOut={onSignOut}
        mobileOpen={navOpen}
        onMobileClose={() => setNavOpen(false)}
      />
      <main className="min-h-screen min-w-0 overflow-x-auto p-4 md:ml-[240px] md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

