import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/useServerFn-DL2oePlL.mjs";
import { B as Button } from "./_ssr/button-DWfIo_Ug.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { c as createSsrRpc } from "./_ssr/createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./_ssr/index.mjs";
import { r as requireAdmin } from "./_ssr/admin-auth.middleware.server-YY1OZxJW.mjs";
import "./_libs/seroval.mjs";
import "./_libs/tanstack__react-router.mjs";
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
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/client.server-CcppqNZQ.mjs";
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const adminExportAuthUsers = createServerFn({
  method: "POST"
}).middleware([requireAdmin]).handler(createSsrRpc("e7f97f85f8e2b146e4d4e1e2ae6662a99dcd68ebbd87f14f65de9717e12c7064"));
function ExportPage() {
  const exportFn = useServerFn(adminExportAuthUsers);
  const [loading, setLoading] = reactExports.useState(false);
  async function handleExport() {
    setLoading(true);
    try {
      const data = await exportFn();
      const blob = new Blob([data.json], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `netodash-auth-users-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${data.count} utilisateurs exportés`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur export");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Export migration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Exporte les utilisateurs auth pour migrer vers un autre projet Supabase. Réservé aux super_admin." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Utilisateurs auth (UUID + emails + métadonnées)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "⚠️ Les hash de mots de passe ne sont pas exportés (impossible techniquement). Les utilisateurs devront réinitialiser leur mot de passe ou se reconnecter via Google." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleExport, disabled: loading, children: loading ? "Export en cours..." : "Télécharger auth-users.json" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 space-y-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Procédure complète" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal pl-5 space-y-1 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Télécharge ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "auth-users.json" }),
          " ci-dessus."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Récupère les fichiers SQL fournis par Lovable :",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "01_schema.sql" }),
          " et ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "02_data.sql" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Suis le ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "README_MIGRATION.md" }),
          " pour importer dans ton nouveau projet Supabase."
        ] })
      ] })
    ] })
  ] });
}
export {
  ExportPage as component
};
