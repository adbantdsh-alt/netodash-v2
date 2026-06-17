import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { c as createSsrRpc } from "./createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./index.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-DAFZrS93.mjs";
import { B as Button } from "./button-DWfIo_Ug.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const betaRegisterSchema = objectType({
  fullName: stringType().trim().min(2, "Nom trop court").max(120),
  email: stringType().trim().email("Email invalide").max(255)
});
const waitlistSchema = objectType({
  email: stringType().trim().email("Email invalide").max(255),
  fullName: stringType().trim().max(120).optional()
});
const getBetaProgramStatus = createServerFn({
  method: "GET"
}).handler(createSsrRpc("0662bc786edd452e77a9ae99b4bac6c0e4878ab982faa194738bf6d09ab4ce4d"));
createServerFn({
  method: "POST"
}).inputValidator((data) => betaRegisterSchema.parse(data)).handler(createSsrRpc("65117adfd5647a791e45a207d716854c3c781657f0e684dc4baeb63efe0dc5a7"));
const registerBetaWaitlist = createServerFn({
  method: "POST"
}).inputValidator((data) => waitlistSchema.parse(data)).handler(createSsrRpc("4bcda73d400cb49e762a97ef9e1e1a295fb702ad1ad1320c35c4b23b58c119b6"));
const BETA_PROGRAM_QUERY_KEY = ["beta-program-status"];
function useBetaProgram() {
  return useQuery({
    queryKey: BETA_PROGRAM_QUERY_KEY,
    queryFn: () => getBetaProgramStatus(),
    staleTime: 3e4,
    refetchOnWindowFocus: true
  });
}
function useInvalidateBetaProgram() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: BETA_PROGRAM_QUERY_KEY });
}
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const VARIANT_CLASSES = {
  header: "brutal-border bg-foreground text-background px-5 py-2.5 font-bold uppercase tracking-wider text-sm hover:bg-accent hover:border-accent",
  headerMobile: "brutal-border bg-foreground text-background px-3 py-2 font-bold uppercase tracking-wider text-xs",
  hero: "brutal-border bg-accent text-accent-foreground border-accent px-6 md:px-10 py-3 md:py-4 font-black uppercase tracking-wider text-sm md:text-base text-center hover:bg-foreground hover:text-background hover:border-foreground",
  card: "block w-full text-center brutal-border px-5 py-3 font-black uppercase tracking-wider bg-background text-foreground hover:bg-foreground hover:text-background",
  cardHighlight: "block w-full text-center brutal-border px-5 py-3 font-black uppercase tracking-wider bg-accent text-accent-foreground border-accent text-base hover:bg-foreground hover:text-background hover:border-foreground",
  final: "inline-block brutal-border border-background bg-background text-foreground px-10 py-5 font-black uppercase tracking-wider text-lg hover:bg-accent hover:text-accent-foreground hover:border-accent",
  inline: "inline underline text-foreground font-bold hover:text-accent bg-transparent border-0 p-0 normal-case tracking-normal text-inherit cursor-pointer"
};
function BetaCtaButton({ variant = "hero", className }) {
  const navigate = useNavigate();
  const invalidateBeta = useInvalidateBetaProgram();
  const { data: status, isLoading } = useBetaProgram();
  const [waitlistOpen, setWaitlistOpen] = reactExports.useState(false);
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const betaFull = status?.betaFull ?? false;
  const spotsLeft = status?.spotsLeft ?? null;
  const label = isLoading ? "Chargement…" : betaFull ? "Rejoindre la liste d'attente" : "Devenir bêta-testeur";
  const resetWaitlistForm = () => {
    setFullName("");
    setEmail("");
    setDone(false);
    setBusy(false);
  };
  const handleClick = () => {
    if (betaFull) {
      resetWaitlistForm();
      setWaitlistOpen(true);
      return;
    }
    navigate({
      to: "/auth",
      search: { mode: "signup", beta: "1" }
    });
  };
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await registerBetaWaitlist({
        data: { email, fullName: fullName.trim() || void 0 }
      });
      setDone(true);
      invalidateBeta();
      toast.success(
        result.alreadyRegistered ? "Tu es déjà sur la liste d'attente." : "Inscription à la liste d'attente confirmée."
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setBusy(false);
    }
  };
  const isInline = variant === "inline";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: handleClick,
        disabled: isLoading,
        className: cn(VARIANT_CLASSES[variant], className),
        children: [
          label,
          !isInline && !isLoading && !betaFull && spotsLeft !== null && variant === "hero" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block mt-1 text-[10px] font-mono normal-case tracking-normal opacity-80", children: [
            spotsLeft,
            " place",
            spotsLeft > 1 ? "s" : "",
            " restante",
            spotsLeft > 1 ? "s" : ""
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: waitlistOpen,
        onOpenChange: (next) => {
          setWaitlistOpen(next);
          if (!next) resetWaitlistForm();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "brutal-border sm:max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-black uppercase tracking-tight", children: "Liste d'attente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "font-mono text-xs", children: "Les 10 places bêta sont prises. Laisse ton email pour être prévenu dès qu'une place se libère." })
          ] }),
          done ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-center py-4", children: "Merci ! On te recontactera dès qu'une place se libère." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleWaitlistSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "beta-waitlist-email", className: "block text-xs font-bold uppercase tracking-wider mb-1.5", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "beta-waitlist-email",
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  placeholder: "ton@email.com",
                  required: true,
                  maxLength: 255,
                  className: "brutal-border-thin rounded-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "beta-waitlist-name", className: "block text-xs font-bold uppercase tracking-wider mb-1.5", children: [
                "Nom ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal normal-case text-muted-foreground", children: "(optionnel)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "beta-waitlist-name",
                  value: fullName,
                  onChange: (e) => setFullName(e.target.value),
                  placeholder: "Prénom Nom",
                  maxLength: 120,
                  className: "brutal-border-thin rounded-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-2 sm:gap-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: busy,
                className: "w-full sm:w-auto brutal-border rounded-none font-black uppercase tracking-wider",
                children: busy ? "Envoi…" : "Rejoindre la liste d'attente"
              }
            ) })
          ] })
        ] })
      }
    )
  ] });
}
export {
  BetaCtaButton as B
};
