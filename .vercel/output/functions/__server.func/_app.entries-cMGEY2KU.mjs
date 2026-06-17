import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { u as useQueryClient } from "./_libs/tanstack__react-query.mjs";
import { s as supabase } from "./_ssr/client-IbqXIlEo.mjs";
import { u as useAuth } from "./_ssr/router-CzeTO2qA.mjs";
import { u as useSubscription } from "./_ssr/use-subscription-BHAI1fRK.mjs";
import { f as canUseUpsells } from "./_ssr/plan-limits-BrKNWLKd.mjs";
import { u as useActiveMode, c as useProfile, a as useProducts, b as useEntries } from "./_ssr/queries-BVXaOG3h.mjs";
import { d as dateRangeForPreset, f as formatCurrency } from "./_ssr/calc-DHAnOS6I.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, C as Calendar$1 } from "./_ssr/popover-Dkn3wT7t.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { n as normalizeDropshippingCurrency } from "./_ssr/dropshipping-fx-BpQqYaq9.mjs";
import "./_libs/stripe.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import { w as Calendar } from "./_libs/lucide-react.mjs";
import { f as format, H as fr } from "./_libs/date-fns.mjs";
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
import "./_libs/tanstack__query-core.mjs";
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
import "./_ssr/shopify-sync.server-B3mu1MxO.mjs";
import "./_ssr/stripe.server-D419Yq3N.mjs";
import "./_libs/zod.mjs";
import "events";
import "http";
import "https";
import "os";
import "./_ssr/button-DWfIo_Ug.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/react-day-picker.mjs";
import "./_libs/date-fns__tz.mjs";
import "./_libs/tailwind-merge.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
function cleanCurrency(currency) {
  return normalizeDropshippingCurrency(currency);
}
function dateToISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isoToDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
function dashboardSearchFromEntries(entries) {
  if (entries.length === 0) return {
    highlight: 1
  };
  const dates = entries.flatMap((e) => {
    if (e.period_to && e.period_to !== e.entry_date) {
      return enumerateDays(e.entry_date, e.period_to);
    }
    return [e.entry_date];
  }).sort();
  return {
    highlight: 1,
    product: entries[0].product_id,
    from: dates[0],
    to: dates[dates.length - 1]
  };
}
function enumerateDays(fromISO, toISO) {
  const start = isoToDate(fromISO);
  const end = isoToDate(toISO);
  if (end < start) return [fromISO];
  const out = [];
  const cur = new Date(start);
  while (cur <= end) {
    out.push(dateToISO(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}
function validateEntry(e, isCod) {
  const n = (s) => Number(s) || 0;
  if (n(e.ad_budget) < 0) return `${e.productName} · Budget pub négatif.`;
  if (n(e.ad_budget) > 1e8) return `${e.productName} · Budget pub irréaliste.`;
  if (!isCod) {
    const orders = n(e.shopify_orders);
    if (orders < 0) return `${e.productName} · Commandes négatives.`;
    if (n(e.refunded_orders) > orders) return `${e.productName} · Remboursés > commandes.`;
    const rev = e.total_revenue !== "" ? Number(e.total_revenue) : 0;
    if (rev && n(e.refunded_amount) > rev) return `${e.productName} · Montant remboursé > CA.`;
    if (n(e.visits) < 0) return `${e.productName} · Visites négatives.`;
  } else {
    const received = n(e.received_orders);
    const confirmed = n(e.confirmed_orders);
    const delivered = n(e.delivered_orders);
    const refused = n(e.refused_orders);
    if (received < 0 || confirmed < 0 || delivered < 0 || refused < 0) return `${e.productName} · Valeurs COD négatives interdites.`;
    if (confirmed > received) return `${e.productName} · Confirmées > reçues.`;
    if (delivered > confirmed) return `${e.productName} · Livrées > confirmées.`;
    if (refused > Math.max(0, confirmed - delivered)) return `${e.productName} · Refusées > (confirmées − livrées).`;
    if (n(e.cash_collected) < 0) return `${e.productName} · Cash collecté négatif.`;
  }
  return null;
}
function EntriesPage() {
  const {
    user
  } = useAuth();
  const {
    mode: activeMode,
    currency: modeCurrency
  } = useActiveMode();
  const qc = useQueryClient();
  const navigate = useNavigate();
  useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const sub = useSubscription(user?.id);
  const range = reactExports.useMemo(() => dateRangeForPreset("30d"), []);
  const entriesQ = useEntries(user?.id, range);
  const products = productsQ.data ?? [];
  const profileCurrency = cleanCurrency(modeCurrency);
  const [shopifyPreview, setShopifyPreview] = reactExports.useState(null);
  const [selectedDraftDate, setSelectedDraftDate] = reactExports.useState(null);
  const [pendingEntries, setPendingEntries] = reactExports.useState([]);
  const [bulkBudget, setBulkBudget] = reactExports.useState("");
  const [bulkSaving, setBulkSaving] = reactExports.useState(false);
  const [manualRange, setManualRange] = reactExports.useState({
    from: /* @__PURE__ */ new Date(),
    to: void 0
  });
  const [calendarOpen, setCalendarOpen] = reactExports.useState(false);
  const [pendingFrom, setPendingFrom] = reactExports.useState(null);
  const [manualEntryMode, setManualEntryMode] = reactExports.useState("single");
  const manualFromISO = dateToISO(manualRange.from);
  const manualToISO = dateToISO(manualRange.to ?? manualRange.from);
  const manualDaysCount = enumerateDays(manualFromISO, manualToISO).length;
  reactExports.useEffect(() => {
    setSelectedDraftDate(null);
  }, [shopifyPreview]);
  const viewPreview = reactExports.useMemo(() => {
    if (!shopifyPreview) return null;
    if (!selectedDraftDate) return shopifyPreview;
    const d = selectedDraftDate;
    const drafts = [];
    for (const draft of shopifyPreview.drafts) {
      const day = draft.byDate?.[d];
      if (!day) continue;
      const hasActivity = day.orders > 0 || day.units > 0 || day.revenue > 0 || day.refundedOrders > 0 || day.refundedAmount > 0;
      if (!hasActivity) continue;
      drafts.push({
        ...draft,
        orders: day.orders,
        units: day.units,
        revenue: day.revenue,
        refundedOrders: day.refundedOrders,
        refundedAmount: day.refundedAmount,
        byDate: {
          [d]: day
        }
      });
    }
    return {
      ...shopifyPreview,
      from: d,
      to: d,
      drafts: drafts.sort((a, b) => b.orders - a.orders)
    };
  }, [shopifyPreview, selectedDraftDate]);
  function prepareShopifyDrafts(preview) {
    const matched = preview.drafts.filter((d) => d.matchedProductId);
    if (matched.length === 0) {
      toast.error("Aucun brouillon associé à un produit local. Crée le produit dans Produits.");
      return;
    }
    const unmatched = preview.drafts.length - matched.length;
    const totalBudget = Number(bulkBudget) || 0;
    const totalRevenue = matched.reduce((s, d) => s + d.revenue, 0);
    const entryDate = preview.to;
    const pending = matched.map((d, i) => {
      const share = totalRevenue > 0 ? d.revenue / totalRevenue : 1 / matched.length;
      const adBudget = totalBudget * share;
      return {
        key: `${d.matchedProductId}-${entryDate}-${i}-${Date.now()}`,
        product_id: d.matchedProductId,
        productName: d.matchedProductName ?? d.shopifyTitle,
        entry_date: entryDate,
        shopify_orders: String(d.orders),
        visits: "",
        refunded_orders: d.refundedOrders > 0 ? String(d.refundedOrders) : "",
        refunded_amount: d.refundedAmount > 0 ? String(d.refundedAmount) : "",
        total_revenue: d.revenue ? String(d.revenue) : "",
        total_revenue_currency: cleanCurrency(preview.currency),
        ad_budget: adBudget > 0 ? String(Math.round(adBudget * 100) / 100) : "",
        ad_budget_currency: profileCurrency,
        include_meta_tax: true,
        include_shopify_fees: true,
        include_wave_fees: activeMode === "cod",
        received_orders: "",
        confirmed_orders: "",
        delivered_orders: "",
        refused_orders: "",
        cash_collected: "",
        delivered_by_zone: {},
        upsells_enabled: false,
        upsells: []
      };
    });
    setPendingEntries((prev) => [...prev, ...pending]);
    setShopifyPreview(null);
    setBulkBudget("");
    toast.success(`${matched.length} pré-saisie(s) générée(s).${unmatched > 0 ? ` ${unmatched} brouillon(s) ignoré(s).` : ""}`);
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document.getElementById("pending-entries")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    }
  }
  function buildBlankEntry(p, entryDate, periodTo) {
    const revenueCur = cleanCurrency(p.currency || profileCurrency);
    return {
      key: `manual-${entryDate}-${Date.now()}-${Math.random()}`,
      product_id: p.id,
      productName: p.name,
      entry_date: entryDate,
      period_to: periodTo,
      shopify_orders: "",
      visits: "",
      refunded_orders: "",
      refunded_amount: "",
      total_revenue: "",
      total_revenue_currency: revenueCur,
      ad_budget: "",
      ad_budget_currency: profileCurrency,
      include_meta_tax: true,
      include_shopify_fees: true,
      include_wave_fees: activeMode === "cod",
      received_orders: "",
      confirmed_orders: "",
      delivered_orders: "",
      refused_orders: "",
      cash_collected: "",
      delivered_by_zone: {},
      upsells_enabled: false,
      upsells: []
    };
  }
  function addBlankEntry() {
    if (products.length === 0) {
      toast.error("Crée d'abord un produit.");
      return;
    }
    const p = products[0];
    const isRange = manualFromISO !== manualToISO;
    const days = isRange ? enumerateDays(manualFromISO, manualToISO) : [manualFromISO];
    if (isRange && manualEntryMode === "daily") {
      const batch = days.map((day) => buildBlankEntry(p, day));
      setPendingEntries((prev) => [...prev, ...batch]);
      toast.success(`${batch.length} saisies créées (1 par jour). Renseigne chaque journée.`);
    } else {
      const newEntry = buildBlankEntry(p, manualFromISO, isRange ? manualToISO : void 0);
      setPendingEntries((prev) => [...prev, newEntry]);
      if (isRange) {
        toast.success(`Saisie cumulée sur ${days.length} jours (${manualFromISO} → ${manualToISO}). Saisis les totaux de la période.`);
      }
    }
    setTimeout(() => {
      document.getElementById("pending-entries")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }
  function updatePending(key, patch) {
    setPendingEntries((prev) => prev.map((p) => p.key === key ? {
      ...p,
      ...patch
    } : p));
  }
  function removePending(key) {
    setPendingEntries((prev) => prev.filter((p) => p.key !== key));
  }
  async function savePending(entry) {
    if (!user) return;
    const isCod = activeMode === "cod";
    const validationError = validateEntry(entry, isCod);
    if (validationError) throw new Error(validationError);
    if (entry.upsells_enabled) {
      if (!entry.upsells || entry.upsells.length === 0) {
        throw new Error(`${entry.productName} · Ajoute au moins un upsell ou décoche la case Upsell.`);
      }
      for (const u of entry.upsells) {
        if (!u.product_id) throw new Error(`${entry.productName} · Sélectionne un produit pour chaque ligne upsell.`);
        if (!u.qty || Number(u.qty) <= 0) throw new Error(`${entry.productName} · Renseigne la quantité d'upsell (> 0).`);
        if (!u.offered && (u.unit_price === "" || u.unit_price == null || Number(u.unit_price) < 0)) {
          throw new Error(`${entry.productName} · Renseigne le prix upsell par unité (≥ 0) ou coche "Offert".`);
        }
      }
    }
    const row = {
      user_id: user.id,
      product_id: entry.product_id,
      entry_date: entry.entry_date,
      // En COD, shopify_orders garde la valeur "reçues" pour rester compatible
      // avec les anciennes saisies / le code commun (legacy).
      shopify_orders: isCod ? Number(entry.received_orders) || 0 : Number(entry.shopify_orders) || 0,
      refunded_orders: isCod ? 0 : Number(entry.refunded_orders) || 0,
      refunded_amount: isCod ? 0 : Number(entry.refunded_amount) || 0,
      ad_budget: Number(entry.ad_budget) || 0,
      // En COD on autorise la devise du compte pub (XOF / EUR / USD)
      ad_budget_currency: entry.ad_budget_currency,
      include_meta_tax: entry.include_meta_tax,
      include_shopify_fees: isCod ? false : entry.include_shopify_fees,
      include_wave_fees: isCod ? entry.include_wave_fees : false,
      total_revenue: isCod ? entry.cash_collected !== "" ? Number(entry.cash_collected) : null : entry.total_revenue !== "" ? Number(entry.total_revenue) : null,
      total_revenue_currency: isCod ? "XOF" : entry.total_revenue_currency,
      business_mode: activeMode,
      received_orders: isCod ? Number(entry.received_orders) || 0 : null,
      confirmed_orders: isCod ? Number(entry.confirmed_orders) || 0 : null,
      delivered_orders: isCod ? Number(entry.delivered_orders) || 0 : null,
      refused_orders: isCod ? Number(entry.refused_orders) || 0 : null,
      cash_collected: isCod ? Number(entry.cash_collected) || 0 : null,
      delivered_by_zone: isCod ? Object.fromEntries(Object.entries(entry.delivered_by_zone || {}).map(([k, v]) => [k, Number(v) || 0]).filter(([, v]) => Number(v) > 0)) : {},
      visits: !isCod && entry.visits !== "" ? Number(entry.visits) : null,
      upsells: entry.upsells_enabled ? entry.upsells.filter((u) => u.product_id && Number(u.qty) > 0 && (u.offered || Number(u.unit_price) >= 0)).map((u) => ({
        product_id: u.product_id,
        qty: Number(u.qty) || 0,
        unit_price: u.offered ? 0 : Number(u.unit_price) || 0,
        currency: isCod ? "XOF" : u.currency,
        offered: !!u.offered
      })) : []
    };
    if (entry.period_to && entry.period_to !== entry.entry_date) {
      const nbDays = enumerateDays(entry.entry_date, entry.period_to).length;
      row.notes = `Saisie cumulée du ${entry.entry_date} au ${entry.period_to} (${nbDays} jours)`;
    }
    const {
      error
    } = await supabase.from("daily_entries").upsert([row], {
      onConflict: "user_id,product_id,entry_date"
    });
    if (error) throw error;
  }
  async function saveOnePending(entry) {
    try {
      await savePending(entry);
      removePending(entry.key);
      qc.invalidateQueries({
        queryKey: ["entries"]
      });
      qc.invalidateQueries({
        queryKey: ["products"]
      });
      toast.success(`Saisie enregistrée pour ${entry.productName}.`);
      navigate({
        to: "/dashboard",
        search: dashboardSearchFromEntries([entry])
      });
    } catch (err) {
      toast.error(err?.message ?? "Échec de l'enregistrement");
    }
  }
  async function saveAllPending() {
    if (pendingEntries.length === 0) return;
    setBulkSaving(true);
    let ok = 0;
    let fail = 0;
    const saved = [];
    try {
      for (const entry of pendingEntries) {
        try {
          await savePending(entry);
          saved.push(entry);
          ok++;
        } catch {
          fail++;
        }
      }
      qc.invalidateQueries({
        queryKey: ["entries"]
      });
      qc.invalidateQueries({
        queryKey: ["products"]
      });
      if (fail === 0) {
        setPendingEntries([]);
        toast.success(`${ok} saisie(s) enregistrée(s).`);
        navigate({
          to: "/dashboard",
          search: dashboardSearchFromEntries(saved)
        });
      } else {
        toast.error(`${ok} OK · ${fail} en échec.`);
      }
    } finally {
      setBulkSaving(false);
    }
  }
  async function handleDelete(id) {
    if (!confirm("Supprimer cette saisie ?")) return;
    const {
      error
    } = await supabase.from("daily_entries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({
      queryKey: ["entries"]
    });
  }
  function editEntry(e) {
    const p = products.find((x) => x.id === e.product_id);
    if (!p) {
      toast.error("Produit introuvable.");
      return;
    }
    const isCod = (e.business_mode ?? activeMode) === "cod";
    setPendingEntries((prev) => prev.filter((x) => !(x.product_id === e.product_id && x.entry_date === e.entry_date)));
    const pending = {
      key: `edit-${e.id}-${Date.now()}`,
      product_id: e.product_id,
      productName: p.name,
      entry_date: e.entry_date,
      shopify_orders: isCod ? "" : String(e.shopify_orders ?? ""),
      visits: !isCod && e.visits != null ? String(e.visits) : "",
      refunded_orders: e.refunded_orders ? String(e.refunded_orders) : "",
      refunded_amount: e.refunded_amount ? String(e.refunded_amount) : "",
      total_revenue: !isCod && e.total_revenue != null ? String(e.total_revenue) : "",
      total_revenue_currency: cleanCurrency(e.total_revenue_currency ?? p.currency ?? profileCurrency),
      ad_budget: e.ad_budget ? String(e.ad_budget) : "",
      ad_budget_currency: cleanCurrency(e.ad_budget_currency ?? profileCurrency),
      include_meta_tax: e.include_meta_tax ?? true,
      include_shopify_fees: e.include_shopify_fees ?? false,
      include_wave_fees: e.include_wave_fees ?? false,
      received_orders: isCod ? String(e.received_orders ?? e.shopify_orders ?? "") : "",
      confirmed_orders: isCod ? String(e.confirmed_orders ?? "") : "",
      delivered_orders: isCod ? String(e.delivered_orders ?? "") : "",
      refused_orders: isCod ? String(e.refused_orders ?? "") : "",
      cash_collected: isCod ? String(e.cash_collected ?? "") : "",
      delivered_by_zone: isCod ? Object.fromEntries(Object.entries(e.delivered_by_zone || {}).map(([k, v]) => [k, String(v)])) : {},
      upsells_enabled: Array.isArray(e.upsells) && e.upsells.length > 0,
      upsells: Array.isArray(e.upsells) ? e.upsells.map((u) => ({
        product_id: String(u.product_id ?? ""),
        qty: u.qty != null ? String(u.qty) : "",
        unit_price: u.unit_price != null ? String(u.unit_price) : "",
        currency: cleanCurrency(u.currency ?? p.currency ?? profileCurrency),
        offered: !!u.offered
      })) : []
    };
    setPendingEntries((prev) => [...prev, pending]);
    toast.success("Saisie chargée pour modification.");
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document.getElementById("pending-entries")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    }
  }
  const productMap = new Map(products.map((p) => [p.id, p]));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-10", children: [
    sub.isFree && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin border-accent bg-accent/5 px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest text-accent mr-2", children: "PLAN FREE" }),
        "Tu vois tes saisies des 30 derniers jours. Passe à Pro pour accéder à tout l'historique."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: "brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:border-accent", children: "Voir les plans →" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 md:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: activeMode === "cod" ? "COD · LIVRAISONS QUOTIDIENNES" : "DROPSHIPPING · DONNÉES QUOTIDIENNES" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "SAISIES" })
    ] }),
    products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Tu dois d'abord créer un produit pour saisir des données." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/products", className: "inline-block brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent", children: "+ Créer un produit" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border p-6 md:p-8 mb-10 grid gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black", children: "NOUVELLE SAISIE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: calendarOpen, onOpenChange: (o) => {
            setCalendarOpen(o);
            if (o) setPendingFrom(null);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: cn("inline-flex items-center gap-2 bg-background brutal-border-thin px-3 py-2 font-mono text-sm hover:bg-foreground/5 focus:border-accent focus:border-2 outline-none"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" }),
              manualRange.to && manualToISO !== manualFromISO ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                format(manualRange.from, "dd MMM", {
                  locale: fr
                }),
                " →",
                " ",
                format(manualRange.to, "dd MMM yyyy", {
                  locale: fr
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[10px] uppercase tracking-widest text-muted-foreground", children: [
                  manualDaysCount,
                  "j"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: format(manualRange.from, "dd MMM yyyy", {
                locale: fr
              }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { className: "w-auto p-0", align: "start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { mode: "single", locale: fr, weekStartsOn: 1, numberOfMonths: 1, selected: pendingFrom ? pendingFrom : manualRange.to ? void 0 : manualRange.from, modifiers: pendingFrom ? {
                range_start: pendingFrom,
                range_end: pendingFrom
              } : manualRange.to ? {
                range_start: manualRange.from,
                range_end: manualRange.to,
                range_middle: {
                  after: manualRange.from,
                  before: manualRange.to
                }
              } : {}, defaultMonth: manualRange.from, onDayClick: (day) => {
                if (!pendingFrom) {
                  setPendingFrom(day);
                  return;
                }
                const a = pendingFrom;
                const b = day;
                const from = a <= b ? a : b;
                const to = a <= b ? b : a;
                const sameDay = dateToISO(from) === dateToISO(to);
                setManualRange({
                  from,
                  to: sameDay ? void 0 : to
                });
                setPendingFrom(null);
                setCalendarOpen(false);
              }, className: cn("p-3 pointer-events-auto") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-foreground/20 p-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center", children: pendingFrom ? "2e clic = valider (même jour ou plage)" : "1er clic = présélection · 2e clic = valider" })
            ] })
          ] }),
          manualDaysCount > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 brutal-border-thin p-0.5 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setManualEntryMode("single"), className: cn("px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors", manualEntryMode === "single" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"), children: "1 saisie cumulée" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setManualEntryMode("daily"), className: cn("px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors", manualEntryMode === "daily" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"), children: [
              manualDaysCount,
              " saisies (1/j)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addBlankEntry, className: "brutal-border-thin px-3 py-2 text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background", children: [
            "+",
            " ",
            manualDaysCount > 1 ? manualEntryMode === "daily" ? `Ajouter ${manualDaysCount} saisies` : "Ajouter 1 saisie cumulée" : "Ajouter une saisie"
          ] }),
          false
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground", children: "Ajoute une saisie manuelle vide pour un jour donné. Ça prend moins d'1 minute." }),
      shopifyPreview && viewPreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin border-accent bg-accent/5 p-4 grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black uppercase tracking-widest text-accent mr-2", children: "Brouillons Shopify" }),
            viewPreview.from,
            " → ",
            viewPreview.to,
            " · devise ",
            viewPreview.currency,
            !selectedDraftDate && (shopifyPreview.refundedOrders > 0 || shopifyPreview.cancelledOrders > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " · ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "↩ ",
                shopifyPreview.refundedOrders,
                " remb. · ✕ ",
                shopifyPreview.cancelledOrders,
                " annul."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShopifyPreview(null), className: "text-[10px] uppercase tracking-widest font-bold px-2 py-1 hover:bg-foreground/10", children: "✕ Fermer" })
        ] }),
        shopifyPreview.availableDates && shopifyPreview.availableDates.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground", children: "Filtrer par jour" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedDraftDate(null), className: `brutal-border-thin px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${selectedDraftDate === null ? "bg-foreground text-background" : "bg-background hover:bg-foreground/10"}`, children: "Toute la plage" }),
            shopifyPreview.availableDates.map((d) => {
              const total = shopifyPreview.drafts.reduce((s, dr) => s + (dr.byDate?.[d]?.orders ?? 0), 0);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedDraftDate(d), className: `brutal-border-thin px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${selectedDraftDate === d ? "bg-foreground text-background" : "bg-background hover:bg-foreground/10"}`, title: `${total} cmd ce jour-là`, children: [
                d,
                " · ",
                total
              ] }, d);
            })
          ] })
        ] }),
        viewPreview.drafts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono text-muted-foreground italic px-1", children: [
          "Aucune commande pour ",
          selectedDraftDate ?? "cette plage",
          "."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-background p-3 grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-mono font-bold uppercase tracking-widest", children: [
            "Pré-remplir les saisies",
            selectedDraftDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " — ",
              selectedDraftDate
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-muted-foreground leading-snug", children: [
            "Génère une carte éditable par produit (date, commandes, CA pré-remplis). Le budget pub total (devise ",
            viewPreview.currency,
            ") est réparti au prorata du CA."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, step: "0.01", placeholder: `Budget pub total (${viewPreview.currency}) — optionnel`, value: bulkBudget, onChange: (e) => setBulkBudget(e.target.value), className: "flex-1 min-w-[160px] bg-background brutal-border-thin px-3 py-2 font-mono text-sm focus:border-accent focus:border-2 outline-none placeholder:text-muted-foreground/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => prepareShopifyDrafts(viewPreview), className: "brutal-border-thin bg-foreground text-background px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent", children: [
              "Pré-remplir (",
              viewPreview.drafts.filter((d) => d.matchedProductId).length,
              ")"
            ] })
          ] })
        ] })
      ] }),
      pendingEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "pending-entries", className: "brutal-border-thin border-accent bg-accent/5 p-4 grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black uppercase tracking-widest text-accent mr-2", children: "Saisies à valider" }),
            pendingEntries.length,
            " produit(s)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: bulkSaving, onClick: saveAllPending, className: "brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50", children: bulkSaving ? "Enregistrement…" : `Tout valider (${pendingEntries.length})` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPendingEntries([]), className: "text-[10px] uppercase tracking-widest font-bold px-2 py-1 hover:bg-foreground/10", children: "✕ Tout annuler" })
          ] })
        ] }),
        pendingEntries.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PendingCard, { entry: p, products, mode: activeMode, canUseUpsells: canUseUpsells(sub.plan, activeMode), onChange: (patch) => updatePending(p.key, patch), onRemove: () => removePending(p.key), onSave: () => saveOnePending(p) }, p.key))
      ] }),
      pendingEntries.length === 0 && !shopifyPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border-thin border-dashed p-6 text-center text-xs font-mono text-muted-foreground uppercase tracking-widest", children: "Aucune saisie en cours. Synchronise depuis Shopify ou clique sur « + Ajouter une saisie »." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "entries-history", className: "text-2xl font-black mb-4", children: "HISTORIQUE — 30 DERNIERS JOURS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full font-mono text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-foreground text-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs uppercase tracking-widest", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "DATE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "PRODUIT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "REÇUES" }),
        activeMode === "cod" && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "CONFIRMÉES" }),
        activeMode === "cod" && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "LIVRÉES" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: activeMode === "cod" ? "CASH" : "CA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "PUB" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "ACTIONS" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        entriesQ.data?.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: activeMode === "cod" ? 8 : 6, className: "text-center p-6 text-muted-foreground", children: "Aucune saisie sur la période." }) }),
        entriesQ.data?.map((e) => {
          const p = productMap.get(e.product_id);
          const adCur = e.ad_budget_currency ?? "EUR";
          const revenueCur = e.total_revenue_currency ?? p?.currency ?? "EUR";
          const isCod = activeMode === "cod";
          const receivedDisplay = isCod ? e.received_orders ?? e.shopify_orders ?? 0 : e.shopify_orders;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-foreground hover:bg-foreground/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 tabular", children: e.entry_date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: p?.name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right tabular", children: [
              receivedDisplay,
              !isCod && (Number(e.refunded_orders) > 0 || Number(e.refunded_amount) > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground font-normal mt-0.5 space-y-0.5", children: [
                Number(e.refunded_orders) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-destructive", children: [
                  "↩ ",
                  e.refunded_orders,
                  " remb."
                ] }),
                Number(e.refunded_amount) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-destructive", children: [
                  "−",
                  formatCurrency(Number(e.refunded_amount), adCur)
                ] })
              ] })
            ] }),
            isCod && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: e.confirmed_orders ?? 0 }),
            isCod && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: e.delivered_orders ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: isCod ? formatCurrency(Number(e.cash_collected ?? 0), "XOF") : e.total_revenue != null ? formatCurrency(Number(e.total_revenue), revenueCur) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right tabular", children: formatCurrency(Number(e.ad_budget), adCur) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => editEntry(e), className: "text-sm text-muted-foreground hover:text-foreground", title: "Modifier", "aria-label": "Modifier la saisie", children: "✎" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(e.id), className: "text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent", title: "Supprimer", children: "✕" })
            ] }) })
          ] }, e.id);
        })
      ] })
    ] }) })
  ] });
}
function PendingCard({
  entry,
  products,
  mode,
  canUseUpsells: canUseUpsells2,
  onChange,
  onRemove,
  onSave
}) {
  const isCod = mode === "cod";
  const currentProduct = products.find((p) => p.id === entry.product_id);
  const productZones = Array.isArray(currentProduct?.shipping_zones) ? currentProduct.shipping_zones.map((z) => ({
    name: String(z.name ?? ""),
    cost: Number(z.cost ?? 0)
  })).filter((z) => z.name.length > 0) : [];
  const hasZones = isCod && productZones.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin bg-background p-3 grid gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm font-bold flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: entry.product_id, onChange: (e) => {
          const next = products.find((p) => p.id === e.target.value);
          onChange({
            product_id: e.target.value,
            productName: next?.name ?? entry.productName,
            total_revenue_currency: cleanCurrency(next?.currency ?? entry.total_revenue_currency),
            delivered_by_zone: {}
          });
        }, className: "bg-background brutal-border-thin px-2 py-1 font-mono text-sm focus:border-accent focus:border-2 outline-none", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-normal text-muted-foreground uppercase tracking-widest", children: isCod ? "COD · DEVISE XOF" : `CA ${entry.total_revenue_currency} · PUB ${entry.ad_budget_currency}` }),
        entry.period_to && entry.period_to !== entry.entry_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black uppercase tracking-widest bg-foreground text-background px-2 py-1", children: [
          "📅 Cumulé ",
          entry.entry_date,
          " → ",
          entry.period_to,
          " (",
          enumerateDays(entry.entry_date, entry.period_to).length,
          "j)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onRemove, className: "text-[10px] uppercase tracking-widest font-bold px-2 py-1 hover:bg-foreground/10", title: "Retirer cette pré-saisie", children: "✕" })
    ] }),
    isCod ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date", type: "date", value: entry.entry_date, onChange: (v) => onChange({
          entry_date: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Cmd reçues", type: "number", value: entry.received_orders, placeholder: "0", onChange: (v) => onChange({
          received_orders: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Cmd confirmées", type: "number", value: entry.confirmed_orders, placeholder: "0", onChange: (v) => onChange({
          confirmed_orders: v
        }) }),
        !hasZones && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Cmd livrées", type: "number", value: entry.delivered_orders, placeholder: "0", onChange: (v) => onChange({
          delivered_orders: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MoneyField, { label: "Cash encaissé (XOF)", value: entry.cash_collected, currency: "EUR", placeholder: "0", onValueChange: (v) => onChange({
          cash_collected: v
        }), onCurrencyChange: () => {
        }, lockedXof: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MoneyField, { label: "Budget pub", value: entry.ad_budget, currency: entry.ad_budget_currency, placeholder: "0", onValueChange: (v) => onChange({
          ad_budget: v
        }), onCurrencyChange: (c) => onChange({
          ad_budget_currency: c
        }) })
      ] }),
      hasZones && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-3 bg-accent/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center justify-between gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cmd livrées par zone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Total ",
            Object.values(entry.delivered_by_zone || {}).reduce((s, v) => s + (Number(v) || 0), 0)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: productZones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `${z.name} (${z.cost} FCFA)`, type: "number", value: String(entry.delivered_by_zone?.[z.name] ?? ""), placeholder: "0", onChange: (v) => {
          const nextZones = {
            ...entry.delivered_by_zone || {},
            [z.name]: v
          };
          const total = Object.values(nextZones).reduce((s, val) => s + (Number(val) || 0), 0);
          onChange({
            delivered_by_zone: nextZones,
            delivered_orders: String(total)
          });
        } }, z.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: hasZones ? "Frais d'expédition calculés zone × coût · CA = cash livré" : "CA = somme cash livré · Coût produit & expé déduits auto depuis la fiche produit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 cursor-pointer select-none brutal-border-thin px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: entry.include_meta_tax, onChange: (e) => onChange({
            include_meta_tax: e.target.checked
          }), className: "mt-0.5 w-4 h-4 accent-foreground cursor-pointer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-mono leading-snug", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest", children: "Inclure taxes Meta Ads" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-muted-foreground mt-0.5 text-[10px]", children: "Déduit la TVA Meta (18%) du budget pub." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 cursor-pointer select-none brutal-border-thin px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: entry.include_wave_fees, onChange: (e) => onChange({
            include_wave_fees: e.target.checked
          }), className: "mt-0.5 w-4 h-4 accent-foreground cursor-pointer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-mono leading-snug", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest", children: "Inclure frais Wave" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-muted-foreground mt-0.5 text-[10px]", children: "Déduit 1% du cash encaissé." })
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date", type: "date", value: entry.entry_date, onChange: (v) => onChange({
          entry_date: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Commandes reçues", type: "number", value: entry.shopify_orders, onChange: (v) => onChange({
          shopify_orders: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MoneyField, { label: "CA total", value: entry.total_revenue, currency: entry.total_revenue_currency, onValueChange: (v) => onChange({
          total_revenue: v
        }), onCurrencyChange: (c) => onChange({
          total_revenue_currency: c
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Cmd remb.", type: "number", value: entry.refunded_orders, placeholder: "0", onChange: (v) => onChange({
          refunded_orders: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MoneyField, { label: "Montant remb.", value: entry.refunded_amount, currency: entry.total_revenue_currency, placeholder: "0", onValueChange: (v) => onChange({
          refunded_amount: v
        }), onCurrencyChange: (c) => onChange({
          total_revenue_currency: c
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MoneyField, { label: "Budget pub", value: entry.ad_budget, currency: entry.ad_budget_currency, placeholder: "0", onValueChange: (v) => onChange({
          ad_budget: v
        }), onCurrencyChange: (c) => onChange({
          ad_budget_currency: c
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Visiteurs (optionnel)", type: "number", value: entry.visits, placeholder: "—", onChange: (v) => onChange({
          visits: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 cursor-pointer select-none brutal-border-thin px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: entry.include_meta_tax, onChange: (e) => onChange({
            include_meta_tax: e.target.checked
          }), className: "mt-0.5 w-4 h-4 accent-foreground cursor-pointer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-mono leading-snug", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest", children: "Inclure taxes Meta Ads" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-muted-foreground mt-0.5 text-[10px]", children: "Coche si Meta te facture la TVA sur ta pub." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 cursor-pointer select-none brutal-border-thin px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: entry.include_shopify_fees, onChange: (e) => onChange({
            include_shopify_fees: e.target.checked
          }), className: "mt-0.5 w-4 h-4 accent-foreground cursor-pointer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-mono leading-snug", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest", children: "Inclure frais Shopify Payments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-muted-foreground mt-0.5 text-[10px]", children: "Pour suivre tes frais de transaction Shopify." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UpsellSection, { entry, products, mode, canUseUpsells: canUseUpsells2, onChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onSave, className: "brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent", children: "Valider cette saisie →" }) })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  decimal = false,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono font-bold uppercase tracking-widest mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), min: type === "number" ? 0 : void 0, step: decimal ? "0.01" : type === "number" ? "1" : void 0, placeholder, className: "w-full bg-background brutal-border-thin px-2 py-1.5 font-mono text-sm focus:border-accent focus:border-2 outline-none placeholder:text-muted-foreground/60" })
  ] });
}
function MoneyField({
  label,
  value,
  currency,
  onValueChange,
  onCurrencyChange,
  placeholder,
  lockedXof
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono font-bold uppercase tracking-widest mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, step: "0.01", value, placeholder, onChange: (e) => onValueChange(e.target.value), className: "flex-1 w-0 bg-background brutal-border-thin px-2 py-1.5 font-mono text-sm text-right focus:border-accent focus:border-2 outline-none placeholder:text-muted-foreground/60" }),
      lockedXof ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-foreground text-background brutal-border-thin border-l-0 px-2 py-1.5 font-mono text-xs font-bold flex items-center", children: "XOF" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: currency, onChange: (e) => onCurrencyChange(cleanCurrency(e.target.value)), className: "bg-foreground text-background brutal-border-thin border-l-0 px-2 py-1.5 font-mono text-xs font-bold focus:border-accent outline-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "EUR", children: "EUR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "USD", children: "USD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "GBP", children: "GBP" })
      ] })
    ] })
  ] });
}
function UpsellSection({
  entry,
  products,
  mode,
  canUseUpsells: canUseUpsells2,
  onChange
}) {
  const isCod = mode === "cod";
  const lockedCur = isCod ? "EUR" : entry.total_revenue_currency;
  const symbol = isCod ? "XOF" : lockedCur;
  if (!canUseUpsells2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin border-dashed px-3 py-2 flex items-center justify-between gap-2 flex-wrap bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-mono leading-snug", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest", children: "🔒 Upsell" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-muted-foreground mt-0.5 text-[10px]", children: "Ventes additionnelles — réservé au plan Pro Drop ($29) en mode Dropshipping." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: "text-[10px] font-mono font-bold uppercase tracking-widest underline whitespace-nowrap", children: "Voir les plans →" })
    ] });
  }
  const lines = entry.upsells ?? [];
  function addLine() {
    const firstProduct = products[0];
    if (!firstProduct) return;
    const newLine = {
      product_id: firstProduct.id,
      qty: "",
      unit_price: "",
      currency: isCod ? "EUR" : lockedCur
    };
    onChange({
      upsells: [...lines, newLine]
    });
  }
  function updateLine(idx, patch) {
    const next = lines.map((l, i) => i === idx ? {
      ...l,
      ...patch
    } : l);
    onChange({
      upsells: next
    });
  }
  function removeLine(idx) {
    const next = lines.filter((_, i) => i !== idx);
    onChange({
      upsells: next,
      upsells_enabled: next.length > 0 ? entry.upsells_enabled : false
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 cursor-pointer select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: entry.upsells_enabled, onChange: (e) => {
        const checked = e.target.checked;
        if (checked && lines.length === 0 && products.length > 0) {
          onChange({
            upsells_enabled: true,
            upsells: [{
              product_id: products[0].id,
              qty: "",
              unit_price: "",
              currency: isCod ? "EUR" : lockedCur
            }]
          });
        } else {
          onChange({
            upsells_enabled: checked
          });
        }
      }, className: "mt-0.5 w-4 h-4 accent-foreground cursor-pointer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-mono leading-snug", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-widest", children: "Upsell" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-muted-foreground mt-0.5 text-[10px]", children: "Coche si certains clients ont pris un produit additionnel à un prix différent." })
      ] })
    ] }),
    entry.upsells_enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-2", children: [
      lines.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground", children: "Aucun upsell ajouté." }),
      lines.map((u, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[1fr_90px_140px_auto] gap-2 items-end brutal-border-thin border-dashed p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono font-bold uppercase tracking-widest mb-1", children: "Produit upsell" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: u.product_id, onChange: (e) => updateLine(idx, {
            product_id: e.target.value
          }), className: "w-full bg-background brutal-border-thin px-2 py-1.5 font-mono text-sm focus:border-accent focus:border-2 outline-none", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Qté *", type: "number", value: u.qty, placeholder: "0", onChange: (v) => updateLine(idx, {
          qty: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono font-bold uppercase tracking-widest mb-1 flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Prix / unité (",
              symbol,
              ")",
              u.offered ? "" : " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1 cursor-pointer normal-case tracking-normal font-normal text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!u.offered, onChange: (e) => updateLine(idx, {
                offered: e.target.checked,
                unit_price: e.target.checked ? "0" : u.unit_price
              }), className: "w-3 h-3 accent-foreground cursor-pointer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "🎁 Offert" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, step: "0.01", required: !u.offered, disabled: !!u.offered, value: u.offered ? "0" : u.unit_price, placeholder: "0", onChange: (e) => updateLine(idx, {
            unit_price: e.target.value
          }), className: `w-full bg-background brutal-border-thin px-2 py-1.5 font-mono text-sm text-right focus:border-accent focus:border-2 outline-none placeholder:text-muted-foreground/60 ${u.offered ? "opacity-50 cursor-not-allowed" : ""} ${!u.offered && (!u.unit_price || Number(u.unit_price) < 0) ? "border-accent" : ""}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeLine(idx), className: "text-[10px] uppercase tracking-widest font-bold px-2 py-1.5 hover:bg-foreground/10 brutal-border-thin", title: "Retirer cet upsell", children: "✕" })
      ] }, idx)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: addLine, className: "text-[10px] uppercase tracking-widest font-bold px-2 py-1.5 hover:bg-foreground/10 brutal-border-thin self-start", children: "+ Ajouter un upsell" })
    ] })
  ] });
}
export {
  EntriesPage as component
};
