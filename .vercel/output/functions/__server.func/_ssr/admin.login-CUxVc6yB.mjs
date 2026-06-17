import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { s as supabase } from "./client-IbqXIlEo.mjs";
import { c as checkIsAdminAccount, A as AdminLogo } from "./AdminLogo-IyEzVX8i.mjs";
import { g as getSupabaseAuthHeaders } from "./auth-headers-CoHEPMfY.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/stripe.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./createSsrRpc-DbtoQF38.mjs";
import "./admin-auth.middleware.server-YY1OZxJW.mjs";
import "./client.server-CcppqNZQ.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "events";
import "http";
import "https";
import "os";
function mapAuthError(message) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (m.includes("email not confirmed")) {
    return "Email non confirmé. Vérifie ta boîte mail (spams inclus) puis réessaie.";
  }
  return message;
}
function AdminLoginPage() {
  const navigate = useNavigate();
  const checkAdminAccount = useServerFn(checkIsAdminAccount);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const {
        data,
        error: signInErr
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (signInErr || !data.user) {
        throw new Error(mapAuthError(signInErr?.message ?? "Identifiants invalides."));
      }
      const {
        data: sessionCheck
      } = await supabase.auth.getSession();
      if (!sessionCheck.session) {
        throw new Error("Session non établie. Réessaie dans quelques secondes.");
      }
      const check = await checkAdminAccount({
        data: {
          userId: data.user.id
        }
      });
      if (!check.isAdmin) {
        await supabase.auth.signOut();
        throw new Error("Ce compte n'est pas autorisé en admin. Utilise adbaxgoat@gmail.com ou contacte le support.");
      }
      await getSupabaseAuthHeaders();
      navigate({
        to: "/admin"
      });
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-admin-root": true, className: "min-h-screen flex items-center justify-center p-4", style: {
    background: "#fafafa"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "admin-card w-full max-w-md", style: {
    background: "#fff",
    padding: "2.5rem"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLogo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest mt-1 opacity-60", children: "Back-office" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
      fontSize: "2rem",
      marginBottom: "1.5rem"
    }, children: "Connexion admin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider mb-1", children: "Email" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, autoComplete: "email", className: "admin-input mb-4", value: email, onChange: (e) => setEmail(e.target.value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider mb-1", children: "Mot de passe" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, autoComplete: "current-password", className: "admin-input mb-4", value: password, onChange: (e) => setPassword(e.target.value) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 text-sm", style: {
      background: "#fde0e0",
      color: "#b32d2c",
      border: "2px solid #b32d2c"
    }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "admin-btn w-full justify-center", "data-variant": "accent", disabled: loading, children: loading ? "Connexion…" : "Se connecter" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest mt-6 text-center", style: {
      color: "#888"
    }, children: "Accès réservé · activités tracées" })
  ] }) });
}
export {
  AdminLoginPage as component
};
