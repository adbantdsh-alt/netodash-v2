import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-IbqXIlEo.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
function ResetPasswordPage() {
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [ready, setReady] = reactExports.useState(false);
  const [sessionError, setSessionError] = reactExports.useState(null);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    let active = true;
    async function restoreRecoverySession() {
      setSessionError(null);
      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
        const code = url.searchParams.get("code");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const recoveryType = hashParams.get("type") ?? url.searchParams.get("type");
        if (code) {
          const {
            error
          } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          window.history.replaceState({}, document.title, "/reset-password");
        } else if (accessToken && refreshToken) {
          const {
            error
          } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          if (error) throw error;
          window.history.replaceState({}, document.title, "/reset-password");
        } else {
          const {
            data
          } = await supabase.auth.getSession();
          if (!data.session) {
            throw new Error(recoveryType === "recovery" ? "Session de récupération expirée. Redemande un lien de réinitialisation." : "Ouvre le lien reçu par email pour changer ton mot de passe.");
          }
        }
        if (active) setReady(true);
      } catch (e) {
        if (active) {
          setReady(false);
          setSessionError(e?.message ?? "Lien de réinitialisation invalide ou expiré.");
        }
      }
    }
    restoreRecoverySession();
    return () => {
      active = false;
    };
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("8 caractères minimum");
      return;
    }
    setBusy(true);
    const {
      data
    } = await supabase.auth.getSession();
    if (!data.session) {
      setBusy(false);
      const message = "Session expirée. Redemande un lien de réinitialisation.";
      setSessionError(message);
      toast.error(message);
      return;
    }
    const {
      error
    } = await supabase.auth.updateUser({
      password
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Mot de passe mis à jour.");
      navigate({
        to: "/dashboard"
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md brutal-border p-6 sm:p-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-black mb-1 tracking-tighter", children: "NOUVEAU MOT DE PASSE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: "Choisis-en un solide." }),
    sessionError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin border-accent text-accent px-3 py-2 text-sm font-bold", children: sessionError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
        mode: "login"
      }, className: "block w-full text-center brutal-border bg-foreground text-background px-4 py-4 font-black uppercase tracking-wider hover:bg-accent hover:border-accent", children: "Retour à la connexion" })
    ] }) : !ready ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin px-3 py-2 text-sm font-bold text-muted-foreground", children: "Vérification du lien…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", autoComplete: "on", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "new-password", name: "new-password", type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 8, autoComplete: "new-password", placeholder: "Nouveau mot de passe", className: "w-full bg-background brutal-border-thin px-4 py-3 pr-20 font-mono text-sm focus:border-accent outline-none focus:border-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), tabIndex: -1, "aria-label": showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe", className: "absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground", children: showPassword ? "Masquer" : "Voir" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full brutal-border bg-foreground text-background px-4 py-4 font-black uppercase tracking-wider hover:bg-accent hover:border-accent disabled:opacity-50", children: busy ? "…" : "METTRE À JOUR" })
    ] })
  ] }) });
}
export {
  ResetPasswordPage as component
};
