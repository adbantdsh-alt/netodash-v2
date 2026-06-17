import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { f as formatCurrency } from "./_ssr/calc-DHAnOS6I.mjs";
import { s as supabase } from "./_ssr/client-IbqXIlEo.mjs";
import { u as useAuth } from "./_ssr/router-CzeTO2qA.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/stripe.mjs";
import "./_ssr/dropshipping-fx-BpQqYaq9.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_ssr/client.server-CcppqNZQ.mjs";
import "./_ssr/shopify-sync.server-B3mu1MxO.mjs";
import "./_ssr/stripe.server-D419Yq3N.mjs";
import "./_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
const HISTORY_KEY = "netodash:roas-calc-history:v1";
function rowToEntry(row) {
  const p = row.payload ?? {};
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    mode: row.mode,
    currency: row.currency,
    productName: row.product_name,
    salePrice: String(p.salePrice ?? ""),
    costPrice: String(p.costPrice ?? ""),
    shipping: String(p.shipping ?? ""),
    otherFees: String(p.otherFees ?? ""),
    transactionPct: String(p.transactionPct ?? "0"),
    adSpend: String(p.adSpend ?? ""),
    orders: String(p.orders ?? ""),
    targetMargin: String(p.targetMargin ?? "20"),
    summary: row.summary ?? {}
  };
}
function entryToRowInsert(entry, userId) {
  return {
    user_id: userId,
    product_name: entry.productName,
    mode: entry.mode,
    currency: entry.currency,
    payload: {
      salePrice: entry.salePrice,
      costPrice: entry.costPrice,
      shipping: entry.shipping,
      otherFees: entry.otherFees,
      transactionPct: entry.transactionPct,
      adSpend: entry.adSpend,
      orders: entry.orders,
      targetMargin: entry.targetMargin
    },
    summary: entry.summary
  };
}
function readLocalHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
const CURRENCIES = [{
  code: "EUR",
  label: "EUR €"
}, {
  code: "USD",
  label: "USD $"
}, {
  code: "GBP",
  label: "GBP £"
}];
function RoasCalculatorPage() {
  const [mode, setMode] = reactExports.useState("actual");
  const [currency, setCurrency] = reactExports.useState("USD");
  const [productName, setProductName] = reactExports.useState("");
  const [salePrice, setSalePrice] = reactExports.useState("");
  const [costPrice, setCostPrice] = reactExports.useState("");
  const [shipping, setShipping] = reactExports.useState("");
  const [otherFees, setOtherFees] = reactExports.useState("");
  const [transactionPct, setTransactionPct] = reactExports.useState("0");
  const [adSpend, setAdSpend] = reactExports.useState("");
  const [orders, setOrders] = reactExports.useState("");
  const [targetMargin, setTargetMargin] = reactExports.useState("20");
  const [showAdvanced, setShowAdvanced] = reactExports.useState(false);
  const {
    user
  } = useAuth();
  const userId = user?.id;
  const [history, setHistory] = reactExports.useState([]);
  const [historyLoading, setHistoryLoading] = reactExports.useState(false);
  const [justSavedId, setJustSavedId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setHistoryLoading(true);
      try {
        const legacy = readLocalHistory();
        if (legacy.length > 0) {
          const rows = legacy.map((e) => entryToRowInsert(e, userId));
          const {
            error: migErr
          } = await supabase.from("roas_calculations").insert(rows);
          if (!migErr) {
            try {
              window.localStorage.removeItem(HISTORY_KEY);
            } catch {
            }
            toast.success(`${legacy.length} calcul(s) migré(s) vers ton compte`);
          }
        }
        const {
          data,
          error
        } = await supabase.from("roas_calculations").select("*").order("created_at", {
          ascending: false
        }).limit(100);
        if (error) throw error;
        if (!cancelled) setHistory((data ?? []).map(rowToEntry));
      } catch (e) {
        if (!cancelled) toast.error("Impossible de charger l'historique : " + (e?.message ?? "erreur"));
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);
  const n = (v) => v === "" ? 0 : Number(v);
  const res = reactExports.useMemo(() => {
    const sale = n(salePrice);
    const cost = n(costPrice);
    const ship = n(shipping);
    const other = n(otherFees);
    const txPct = n(transactionPct);
    const ad = n(adSpend);
    const ord = n(orders);
    const variablePerOrder = cost + ship + other;
    const grossMarginPerOrder = sale - variablePerOrder - sale * (txPct / 100);
    if (mode === "actual") {
      const revenue = sale * ord;
      const transactionFees = revenue * (txPct / 100);
      const totalCosts = variablePerOrder * ord + transactionFees + ad;
      const netProfit = revenue - totalCosts;
      const roas = ad > 0 ? revenue / ad : 0;
      const cpa = ord > 0 ? ad / ord : 0;
      const margePct = revenue > 0 ? netProfit / revenue * 100 : 0;
      const beRoasDen = sale * (1 - txPct / 100) - variablePerOrder;
      const breakEvenRoas2 = beRoasDen > 0 ? sale / beRoasDen : 0;
      const maxCpa2 = grossMarginPerOrder;
      return {
        revenue,
        totalCosts,
        netProfit,
        roas,
        cpa,
        margePct,
        breakEvenRoas: breakEvenRoas2,
        maxCpa: maxCpa2,
        grossMarginPerOrder
      };
    }
    if (mode === "breakeven") {
      const targetPct2 = n(targetMargin);
      const beDen = sale - cost;
      const breakEvenRoas2 = beDen > 0 ? sale / beDen : 0;
      const desiredNetPerOrder2 = sale * (targetPct2 / 100);
      const targetDen = sale - cost - desiredNetPerOrder2;
      const targetRoas2 = targetDen > 0 ? sale / targetDen : 0;
      const maxCpaBE = beDen;
      const maxCpaTarget = targetDen;
      return {
        breakEvenRoas: breakEvenRoas2,
        targetRoas: targetRoas2,
        maxCpaBE,
        maxCpaTarget,
        desiredNetPerOrder: desiredNetPerOrder2,
        grossMarginPerOrder: beDen
      };
    }
    const targetPct = n(targetMargin);
    const desiredNetPerOrder = sale * (targetPct / 100);
    const maxCpa = grossMarginPerOrder - desiredNetPerOrder;
    const targetRoas = maxCpa > 0 ? sale / maxCpa : 0;
    const breakEvenRoas = sale * (1 - txPct / 100) - variablePerOrder > 0 ? sale / (sale * (1 - txPct / 100) - variablePerOrder) : 0;
    return {
      grossMarginPerOrder,
      desiredNetPerOrder,
      maxCpa,
      targetRoas,
      breakEvenRoas
    };
  }, [mode, salePrice, costPrice, shipping, otherFees, transactionPct, adSpend, orders, targetMargin]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 md:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "OUTIL — Pour COD & Dropshipping" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "ROAS CALCULATOR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground max-w-2xl", children: [
        "L'essentiel uniquement : ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "prix de vente" }),
        " et ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "coût produit" }),
        ". Tu obtiens ton ROAS, ta marge nette et ton ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "CPA max" }),
        ". Affine avec les coûts avancés si besoin."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("breakeven"), className: `brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${mode === "breakeven" ? "bg-foreground text-background border-foreground" : "hover:bg-foreground hover:text-background"}`, children: "⚖ Break-Even ROAS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("actual"), className: `brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${mode === "actual" ? "bg-foreground text-background border-foreground" : "hover:bg-foreground hover:text-background"}`, children: "📊 Calculer mon ROAS actuel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("target"), className: `brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${mode === "target" ? "bg-foreground text-background border-foreground" : "hover:bg-foreground hover:text-background"}`, children: "🎯 Trouver mon CPA max" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_1fr] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "brutal-border p-6 grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Produit (optionnel)", value: productName, onChange: setProductName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: "Devise" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: currency, onChange: (e) => setCurrency(e.target.value), className: "bg-background brutal-border-thin px-3 py-3 font-mono focus:border-accent focus:border-2 outline-none", children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.code, children: c.label }, c.code)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Prix de vente (${currency})`, type: "number", value: salePrice, onChange: setSalePrice }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Coût produit (${currency})`, type: "number", value: costPrice, onChange: setCostPrice }),
          mode === "actual" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Dépense pub totale (${currency})`, type: "number", value: adSpend, onChange: setAdSpend }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nombre de commandes", type: "number", value: orders, onChange: setOrders })
          ] }),
          mode === "target" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Marge nette cible (%)", type: "number", value: targetMargin, onChange: setTargetMargin, hint: "Ex : 20% du CA après pub" }),
          mode === "breakeven" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Marge nette visée (%) — optionnel", type: "number", value: targetMargin, onChange: setTargetMargin, hint: "Pour calculer le Target ROAS" })
        ] }),
        mode === "breakeven" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-3 text-[11px] font-mono text-muted-foreground leading-relaxed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground uppercase tracking-widest", children: "Mode simple :" }),
          " ",
          "juste prix de vente et coût produit. Idéal avant de lancer une campagne pour savoir à partir de quel ROAS tu commences à gagner de l'argent."
        ] }),
        mode !== "breakeven" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setShowAdvanced((v) => !v), className: "w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚙ Coûts avancés (optionnel)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: showAdvanced ? "−" : "+" })
          ] }),
          showAdvanced && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 p-4 border-t border-foreground/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Expédition / cmd (${currency})`, type: "number", value: shipping, onChange: setShipping }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Frais cachés / cmd (${currency})`, type: "number", value: otherFees, onChange: setOtherFees, hint: "SAV, retours, etc." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Frais transaction (%)", type: "number", value: transactionPct, onChange: setTransactionPct, hint: "Shopify / Stripe ≈ 2.9%" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-6 grid gap-3 bg-foreground/[0.02]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold text-muted-foreground", children: "Résultat" }),
        mode === "breakeven" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "⚖ Break-Even ROAS", value: res.breakEvenRoas > 0 ? res.breakEvenRoas.toFixed(2) + "x" : "—", emphasis: "good", hint: "ROAS minimum pour profit = 0 (sale / (sale − cost))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "🎯 Target ROAS", value: res.targetRoas > 0 ? res.targetRoas.toFixed(2) + "x" : "—", hint: `Pour viser ${n(targetMargin) || 0}% de marge nette` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-foreground/20 my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Marge brute / commande", value: formatCurrency(res.grossMarginPerOrder, currency), hint: "Prix de vente − coût produit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "CPA max (break-even)", value: formatCurrency(res.maxCpaBE, currency), hint: "Dépense pub max par commande pour profit = 0" }),
          n(targetMargin) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "CPA max (target)", value: res.maxCpaTarget > 0 ? formatCurrency(res.maxCpaTarget, currency) : "—", hint: "Pour atteindre la marge cible" })
        ] }),
        mode === "actual" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "ROAS", value: res.roas.toFixed(2) + "x", emphasis: res.roas > res.breakEvenRoas ? "good" : "bad", hint: res.roas > res.breakEvenRoas ? "Tu gagnes de l'argent ✓" : "Sous le seuil de rentabilité" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Profit net", value: formatCurrency(res.netProfit, currency), emphasis: res.netProfit >= 0 ? "good" : "bad" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Marge nette (%)", value: res.margePct.toFixed(1) + "%", emphasis: res.margePct >= 0 ? "good" : "bad" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-foreground/20 my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "CA total", value: formatCurrency(res.revenue, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Coûts totaux", value: formatCurrency(res.totalCosts, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "CPA actuel", value: formatCurrency(res.cpa, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-foreground/20 my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "🎯 CPA max pour ne pas perdre", value: formatCurrency(res.maxCpa, currency), hint: "Si ton CPA passe au-dessus, tu perds de l'argent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "🎯 Break-even ROAS", value: res.breakEvenRoas.toFixed(2) + "x", hint: "ROAS minimum pour profit = 0" })
        ] }),
        mode === "target" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Marge brute / commande", value: formatCurrency(res.grossMarginPerOrder, currency), hint: "Avant pub" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Profit net visé / commande", value: formatCurrency(res.desiredNetPerOrder, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-foreground/20 my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "🎯 CPA max", value: formatCurrency(res.maxCpa, currency), emphasis: res.maxCpa > 0 ? "good" : "bad", hint: res.maxCpa > 0 ? "Dépense max par commande sur Meta/TikTok" : "Impossible : ta marge brute ne couvre pas la cible" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "🎯 ROAS cible", value: res.targetRoas > 0 ? res.targetRoas.toFixed(2) + "x" : "—", emphasis: "good" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultRow, { label: "Break-even ROAS", value: res.breakEvenRoas.toFixed(2) + "x", hint: "ROAS minimum (profit = 0)" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
        if (!productName.trim()) {
          toast.error("Donne un nom au produit avant de sauvegarder ce calcul.");
          return;
        }
        if (!userId) {
          toast.error("Tu dois être connecté pour sauvegarder.");
          return;
        }
        const summary = mode === "actual" ? {
          roas: res.roas,
          netProfit: res.netProfit,
          margePct: res.margePct,
          breakEvenRoas: res.breakEvenRoas
        } : mode === "breakeven" ? {
          breakEvenRoas: res.breakEvenRoas,
          targetRoas: res.targetRoas,
          maxCpa: res.maxCpaBE
        } : {
          maxCpa: res.maxCpa,
          targetRoas: res.targetRoas,
          breakEvenRoas: res.breakEvenRoas
        };
        const draft = {
          mode,
          currency,
          productName: productName.trim(),
          salePrice,
          costPrice,
          shipping,
          otherFees,
          transactionPct,
          adSpend,
          orders,
          targetMargin,
          summary
        };
        const dup = history.find((h) => h.productName === draft.productName && h.mode === draft.mode);
        if (dup) {
          await supabase.from("roas_calculations").delete().eq("id", dup.id);
        }
        const {
          data,
          error
        } = await supabase.from("roas_calculations").insert(entryToRowInsert(draft, userId)).select("*").single();
        if (error || !data) {
          toast.error("Échec sauvegarde : " + (error?.message ?? "erreur"));
          return;
        }
        const saved = rowToEntry(data);
        setHistory([saved, ...history.filter((h) => h.id !== dup?.id)]);
        setJustSavedId(saved.id);
        setTimeout(() => setJustSavedId(null), 1500);
      }, className: "brutal-border bg-foreground text-background px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:border-accent", children: justSavedId ? "✓ Sauvegardé" : "💾 Sauvegarder ce calcul" }),
      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
        if (!confirm("Vider tout l'historique ?")) return;
        if (!userId) return;
        const {
          error
        } = await supabase.from("roas_calculations").delete().eq("user_id", userId);
        if (error) {
          toast.error("Échec : " + error.message);
          return;
        }
        setHistory([]);
      }, className: "brutal-border-thin px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background", children: "Vider l'historique" })
    ] }),
    history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 brutal-border p-5 md:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl md:text-2xl font-black uppercase tracking-tight", children: [
          "📂 Historique (",
          history.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: "Synchronisé avec ton compte" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: history.map((h) => {
        const rentable = h.mode === "actual" ? (h.summary.netProfit ?? 0) >= 0 : h.mode === "breakeven" ? (h.summary.breakEvenRoas ?? 0) > 0 : (h.summary.maxCpa ?? 0) > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-3 flex flex-col gap-2 hover:border-accent transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black tracking-tight truncate", children: h.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: [
                h.mode === "actual" ? "ROAS actuel" : h.mode === "breakeven" ? "Break-Even" : "CPA max",
                " ",
                "· ",
                h.currency,
                " ·",
                " ",
                new Date(h.createdAt).toLocaleDateString("fr-FR")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${rentable ? "bg-[#16a34a] text-white" : "bg-accent text-accent-foreground"}`, children: h.mode === "breakeven" ? "BE" : rentable ? "OK" : "KO" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground", children: [
            h.mode === "actual" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "ROAS ",
              (h.summary.roas ?? 0).toFixed(2),
              "x · Profit",
              " ",
              formatCurrency(h.summary.netProfit ?? 0, h.currency)
            ] }),
            h.mode === "breakeven" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "BE ROAS ",
              (h.summary.breakEvenRoas ?? 0).toFixed(2),
              "x · Target",
              " ",
              (h.summary.targetRoas ?? 0).toFixed(2),
              "x"
            ] }),
            h.mode === "target" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "CPA max ",
              formatCurrency(h.summary.maxCpa ?? 0, h.currency),
              " ",
              "· ROAS cible ",
              (h.summary.targetRoas ?? 0).toFixed(2),
              "x"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setMode(h.mode);
              setCurrency(h.currency);
              setProductName(h.productName);
              setSalePrice(h.salePrice);
              setCostPrice(h.costPrice);
              setShipping(h.shipping);
              setOtherFees(h.otherFees);
              setTransactionPct(h.transactionPct);
              setAdSpend(h.adSpend);
              setOrders(h.orders);
              setTargetMargin(h.targetMargin);
              const hasAdvanced = (Number(h.shipping) || 0) > 0 || (Number(h.otherFees) || 0) > 0 || (Number(h.transactionPct) || 0) > 0;
              if (hasAdvanced) setShowAdvanced(true);
              if (typeof window !== "undefined") {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });
              }
            }, className: "flex-1 brutal-border-thin px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background", children: "Recharger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
              const prev = history;
              setHistory(prev.filter((x) => x.id !== h.id));
              const {
                error
              } = await supabase.from("roas_calculations").delete().eq("id", h.id);
              if (error) {
                setHistory(prev);
                toast.error("Échec suppression : " + error.message);
              }
            }, className: "brutal-border-thin px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground hover:border-accent", "aria-label": "Supprimer", children: "✕" })
          ] })
        ] }, h.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 brutal-border-thin p-4 text-xs font-mono leading-relaxed text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground uppercase tracking-widest", children: "À savoir :" }),
      " ",
      "Ce calculateur fait des projections. Pour suivre ta rentabilité réelle au quotidien, crée un produit et fais une saisie dans Netodash — tu auras dashboard, alertes et coach IA en bonus."
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), min: type === "number" ? 0 : void 0, step: type === "number" ? "0.01" : void 0, className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground mt-1", children: hint })
  ] });
}
function ResultRow({
  label,
  value,
  hint,
  emphasis
}) {
  const color = emphasis === "good" ? "text-foreground" : emphasis === "bad" ? "text-accent" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold", children: label }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: hint })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xl md:text-2xl font-black tabular ${color}`, children: value })
  ] });
}
export {
  RoasCalculatorPage as component
};
