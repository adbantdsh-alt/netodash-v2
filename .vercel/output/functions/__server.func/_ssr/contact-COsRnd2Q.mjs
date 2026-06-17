import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as createSsrRpc } from "./createSsrRpc-DbtoQF38.mjs";
import { a as createServerFn } from "./index.mjs";
import "../_libs/seroval.mjs";
import { M as Mail, a as MessageCircle, C as Clock, S as Send } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const contactSchema = objectType({
  name: stringType().trim().min(2, "Nom trop court").max(100),
  email: stringType().trim().email("Email invalide").max(255),
  subject: stringType().trim().min(2, "Sujet requis").max(200),
  message: stringType().trim().min(10, "Message trop court (10 caractères min)").max(2e3)
});
const submitContactMessage = createServerFn({
  method: "POST"
}).inputValidator((data) => contactSchema.parse(data)).handler(createSsrRpc("6791d96029119711fff64366333434540863937081e92a2093993c6c31f4287b"));
function ContactPage() {
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [subject, setSubject] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState(null);
  const [errMsg, setErrMsg] = reactExports.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setErrMsg("");
    try {
      await submitContactMessage({
        data: {
          name,
          email,
          subject,
          message
        }
      });
      setStatus("ok");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus("err");
      setErrMsg(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 bg-background brutal-border-thin border-t-0 border-l-0 border-r-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/netodash-logo.png", alt: "NETODASH", className: "w-12 h-12 md:w-16 md:h-16 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-lg md:text-2xl tracking-tight", children: "NETODASH" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-xs md:text-sm", children: "← Accueil" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block brutal-border-thin px-3 py-1 text-[10px] md:text-xs uppercase tracking-widest mb-4", children: "Contact" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]", children: [
        "PARLONS",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 md:mt-6 text-base md:text-lg max-w-2xl text-muted-foreground leading-relaxed", children: "Une question sur ton COD, un bug, une suggestion, un partenariat affilié ? On répond sous 24 h ouvrées." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16 grid lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:support@netodash.com", className: "block brutal-border-thin p-6 hover:bg-foreground hover:text-background transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-7 h-7 mb-3", strokeWidth: 2.5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-70 mb-1", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-lg break-all", children: "support@netodash.com" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-2 opacity-70", children: "Réponse sous 24 h ouvrées" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://wa.me/221000000000", target: "_blank", rel: "noopener noreferrer", className: "block brutal-border-thin p-6 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-7 h-7 mb-3", strokeWidth: 2.5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest opacity-70 mb-1", children: "WhatsApp" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-lg", children: "Support direct" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-2 opacity-70", children: "Pour les urgences plan Pro" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-6 bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-7 h-7 mb-3", strokeWidth: 2.5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: "Disponibilité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-lg", children: "Lun – Ven · 9 h – 19 h GMT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-2 text-muted-foreground", children: "Le week-end : email uniquement" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "brutal-border p-6 md:p-8 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-black tracking-tighter", children: "ENVOIE-NOUS UN MESSAGE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "block text-[10px] uppercase tracking-widest font-bold mb-2", children: "Nom complet *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "name", type: "text", required: true, maxLength: 100, value: name, onChange: (e) => setName(e.target.value), className: "w-full brutal-border-thin bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "block text-[10px] uppercase tracking-widest font-bold mb-2", children: "Email *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "email", type: "email", required: true, maxLength: 255, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full brutal-border-thin bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "subject", className: "block text-[10px] uppercase tracking-widest font-bold mb-2", children: "Sujet *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "subject", type: "text", required: true, maxLength: 200, value: subject, onChange: (e) => setSubject(e.target.value), className: "w-full brutal-border-thin bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "message", className: "block text-[10px] uppercase tracking-widest font-bold mb-2", children: [
            "Message * ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal normal-case tracking-normal", children: "(min. 10 caractères)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "message", required: true, maxLength: 2e3, rows: 6, value: message, onChange: (e) => setMessage(e.target.value), className: "w-full brutal-border-thin bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent resize-y" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-1 text-right font-mono", children: [
            message.length,
            " / 2000"
          ] })
        ] }),
        status === "ok" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin border-accent bg-accent/10 p-4 font-mono text-sm", children: "✓ Message envoyé. On revient vers toi sous 24 h ouvrées." }),
        status === "err" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin border-destructive bg-destructive/10 p-4 font-mono text-sm", children: [
          "✕ ",
          errMsg || "Une erreur est survenue. Réessaie."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: submitting, className: "brutal-border bg-accent text-accent-foreground border-accent px-6 py-3 font-black uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:bg-foreground hover:border-foreground disabled:opacity-50", children: submitting ? "Envoi…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Envoyer ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
        ] }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "brutal-border-thin border-l-0 border-r-0 border-b-0 mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " NETODASH · Made for Africa."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-mono text-xs uppercase tracking-widest hover:text-accent", children: "← Retour à l'accueil" })
    ] }) })
  ] });
}
export {
  ContactPage as component
};
