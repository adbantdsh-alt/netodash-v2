import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, O as Outlet, d as useLocation, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { s as supabase } from "./_ssr/client-IbqXIlEo.mjs";
import { g as getCurrentAdmin, t as touchAdminLogin, A as AdminLogo } from "./_ssr/AdminLogo-IyEzVX8i.mjs";
import { g as getSupabaseAuthHeaders } from "./_ssr/auth-headers-CoHEPMfY.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import "./_libs/sonner.mjs";
import "./_libs/stripe.mjs";
import { g as Menu, X, h as LayoutDashboard, U as Users, F as FlaskConical, P as Puzzle, D as DollarSign, i as Share2, j as MessageSquare, k as Shield, l as Settings, m as LogOut } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/createSsrRpc-DbtoQF38.mjs";
import "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import "./_ssr/client.server-CcppqNZQ.mjs";
import "./_libs/zod.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "events";
import "http";
import "https";
import "os";
const items = [
  { to: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Utilisateurs", icon: Users },
  { to: "/admin/beta-testers", label: "Bêta-testeurs", icon: FlaskConical },
  { to: "/admin/extension", label: "Extension Chrome", icon: Puzzle },
  { to: "/admin/revenue", label: "Revenus", icon: DollarSign },
  { to: "/admin/affiliates", label: "Affiliation", icon: Share2 },
  { to: "/admin/communication", label: "Communication", icon: MessageSquare },
  { to: "/admin/security", label: "Sécurité & Logs", icon: Shield },
  { to: "/admin/settings", label: "Paramètres", icon: Settings }
];
function NavBody({
  email,
  role,
  onSignOut,
  onNavigate,
  pathname,
  showClose,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-5 border-b flex items-start justify-between gap-2",
        style: { borderColor: "#222" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLogo, { inverted: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest mt-1 opacity-60", children: "Back-office" })
          ] }),
          showClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": "Fermer le menu",
              className: "p-2 -m-2",
              style: { color: "#fff" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 py-3 overflow-y-auto", children: items.map((it) => {
      const Icon = it.icon;
      const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: it.to,
          onClick: onNavigate,
          className: "flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-wider",
          style: {
            background: active ? "#E05C1A" : "transparent",
            color: "#fff",
            borderLeft: active ? "4px solid #fff" : "4px solid transparent"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: it.label })
          ]
        },
        it.to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t", style: { borderColor: "#222" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-60 mb-1", children: "Connecté" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold truncate", children: email }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest mt-0.5 opacity-60", children: (role ?? "").replace("_", " ") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onSignOut,
          className: "mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider",
          style: { background: "#fff", color: "#000" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 14 }),
            " Déconnexion"
          ]
        }
      )
    ] })
  ] });
}
function AdminSidebar({
  email,
  role,
  onSignOut,
  mobileOpen = false,
  onMobileClose
}) {
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "aside",
      {
        style: { background: "#000", color: "#fff", width: 240, minHeight: "100vh" },
        className: "fixed inset-y-0 left-0 z-40 hidden flex-col overflow-y-auto md:flex",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NavBody,
          {
            email,
            role,
            onSignOut,
            pathname: location.pathname
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `md:hidden fixed inset-0 z-50 ${mobileOpen ? "" : "pointer-events-none"}`,
        "aria-hidden": !mobileOpen,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onClick: onMobileClose,
              className: "absolute inset-0 bg-black/60 transition-opacity",
              style: { opacity: mobileOpen ? 1 : 0 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "aside",
            {
              className: "absolute inset-y-0 left-0 flex flex-col overflow-hidden transition-transform duration-200",
              style: {
                background: "#000",
                color: "#fff",
                width: "min(280px, 85vw)",
                transform: mobileOpen ? "translateX(0)" : "translateX(-100%)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                NavBody,
                {
                  email,
                  role,
                  onSignOut: () => {
                    onMobileClose?.();
                    onSignOut();
                  },
                  onNavigate: onMobileClose,
                  pathname: location.pathname,
                  showClose: true,
                  onClose: onMobileClose
                }
              )
            }
          )
        ]
      }
    )
  ] });
}
function AdminLayout() {
  const navigate = useNavigate();
  const fetchCurrentAdmin = useServerFn(getCurrentAdmin);
  const markAdminLogin = useServerFn(touchAdminLogin);
  const [me, setMe] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [navOpen, setNavOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (navOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [navOpen]);
  reactExports.useEffect(() => {
    (async () => {
      try {
        const headers = await getSupabaseAuthHeaders();
        const data = await fetchCurrentAdmin({
          headers
        });
        setMe({
          email: data.email,
          role: data.role
        });
        await markAdminLogin({
          headers
        });
      } catch (e) {
        console.error("[admin] access denied", e);
        setError(e instanceof Error ? e.message : "Accès refusé");
        setTimeout(() => navigate({
          to: "/admin/login"
        }), 1200);
      }
    })();
  }, [fetchCurrentAdmin, markAdminLogin, navigate]);
  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/admin/login"
    });
  };
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-admin-root": true, className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: "Redirection…" })
    ] }) });
  }
  if (!me) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-admin-root": true, className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest", children: "Chargement…" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-admin-root": true, className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b-2", style: {
      background: "#000",
      color: "#fff",
      borderColor: "#000"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setNavOpen(true), "aria-label": "Ouvrir le menu", className: "p-2 -ml-2", style: {
        color: "#fff"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 22 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        filter: "invert(0)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLogo, { inverted: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: 22
      }, "aria-hidden": true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { email: me.email, role: me.role, onSignOut, mobileOpen: navOpen, onMobileClose: () => setNavOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen min-w-0 overflow-x-auto p-4 md:ml-[240px] md:p-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};
