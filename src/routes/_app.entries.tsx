import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { canUseUpsells } from "@/lib/plan-limits";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { useActiveMode } from "@/lib/use-active-mode";
import {
  dateRangeForPreset,
  formatCurrency,
  normalizeDropshippingCurrency,
  type DropshippingCurrency,
} from "@/lib/calc";
import { ShopifySyncButton, type ShopifyPreview, type ShopifyDraft } from "@/components/ShopifySyncButton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AppCurrency = DropshippingCurrency;

function cleanCurrency(currency?: string | null): AppCurrency {
  return normalizeDropshippingCurrency(currency);
}

export const Route = createFileRoute("/_app/entries")({
  head: () => ({ meta: [{ title: "Saisies quotidiennes — NETODASH" }] }),
  component: EntriesPage,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dateToISO(d: Date): string {
  // ISO local (YYYY-MM-DD) — évite les décalages de fuseau horaire
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function enumerateDays(fromISO: string, toISO: string): string[] {
  const start = isoToDate(fromISO);
  const end = isoToDate(toISO);
  if (end < start) return [fromISO];
  const out: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    out.push(dateToISO(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

type UpsellLine = {
  product_id: string;
  qty: string;
  unit_price: string;
  currency: AppCurrency;
  offered?: boolean;
};

type PendingEntry = {
  key: string;
  product_id: string;
  productName: string;
  entry_date: string;
  /** Date de fin si la saisie couvre plusieurs jours (cumulée). */
  period_to?: string;
  shopify_orders: string;
  visits: string;
  refunded_orders: string;
  refunded_amount: string;
  total_revenue: string;
  total_revenue_currency: AppCurrency;
  ad_budget: string;
  ad_budget_currency: AppCurrency;
  include_meta_tax: boolean;
  include_shopify_fees: boolean;
  include_wave_fees: boolean;
  // COD only
  received_orders: string;
  confirmed_orders: string;
  delivered_orders: string;
  refused_orders: string;
  cash_collected: string;
  // COD : répartition des livraisons par zone (nom -> count en string)
  delivered_by_zone: Record<string, string>;
  // Pro plan : ventes upsell additionnelles
  upsells_enabled: boolean;
  upsells: UpsellLine[];
};



function validateEntry(e: PendingEntry, isCod: boolean): string | null {
  const n = (s: string) => Number(s) || 0;
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
    if (received < 0 || confirmed < 0 || delivered < 0 || refused < 0)
      return `${e.productName} · Valeurs COD négatives interdites.`;
    if (confirmed > received) return `${e.productName} · Confirmées > reçues.`;
    if (delivered > confirmed) return `${e.productName} · Livrées > confirmées.`;
    if (refused > Math.max(0, confirmed - delivered))
      return `${e.productName} · Refusées > (confirmées − livrées).`;
    if (n(e.cash_collected) < 0) return `${e.productName} · Cash collecté négatif.`;
  }
  return null;
}

function EntriesPage() {
  const { user } = useAuth();
  const { mode: activeMode, currency: modeCurrency } = useActiveMode();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const profileQ = useProfile(user?.id);
  const productsQ = useProducts(user?.id);
  const sub = useSubscription(user?.id);
  const range = useMemo(() => dateRangeForPreset("30d"), []);
  const entriesQ = useEntries(user?.id, range);

  const products = productsQ.data ?? [];
  const profileCurrency = cleanCurrency(modeCurrency);

  const [shopifyPreview, setShopifyPreview] = useState<ShopifyPreview | null>(null);
  const [selectedDraftDate, setSelectedDraftDate] = useState<string | null>(null);
  const [pendingEntries, setPendingEntries] = useState<PendingEntry[]>([]);
  const [bulkBudget, setBulkBudget] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  // Plage de dates pour le bouton "Ajouter une saisie" — supporte un jour unique ou un intervalle
  const [manualRange, setManualRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(),
    to: undefined,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pendingFrom, setPendingFrom] = useState<Date | null>(null);
  const manualFromISO = dateToISO(manualRange.from);
  const manualToISO = dateToISO(manualRange.to ?? manualRange.from);
  const manualDaysCount = enumerateDays(manualFromISO, manualToISO).length;

  useEffect(() => {
    setSelectedDraftDate(null);
  }, [shopifyPreview]);

  const viewPreview = useMemo<ShopifyPreview | null>(() => {
    if (!shopifyPreview) return null;
    if (!selectedDraftDate) return shopifyPreview;
    const d = selectedDraftDate;
    const drafts: ShopifyDraft[] = [];
    for (const draft of shopifyPreview.drafts) {
      const day = draft.byDate?.[d];
      if (!day) continue;
      const hasActivity =
        day.orders > 0 || day.units > 0 || day.revenue > 0 ||
        day.refundedOrders > 0 || day.refundedAmount > 0;
      if (!hasActivity) continue;
      drafts.push({
        ...draft,
        orders: day.orders,
        units: day.units,
        revenue: day.revenue,
        refundedOrders: day.refundedOrders,
        refundedAmount: day.refundedAmount,
        byDate: { [d]: day },
      });
    }
    return {
      ...shopifyPreview,
      from: d,
      to: d,
      drafts: drafts.sort((a, b) => b.orders - a.orders),
    };
  }, [shopifyPreview, selectedDraftDate]);

  function prepareShopifyDrafts(preview: ShopifyPreview) {
    const matched = preview.drafts.filter((d) => d.matchedProductId);
    if (matched.length === 0) {
      toast.error("Aucun brouillon associé à un produit local. Crée le produit dans Produits.");
      return;
    }
    const unmatched = preview.drafts.length - matched.length;
    const totalBudget = Number(bulkBudget) || 0;
    const totalRevenue = matched.reduce((s, d) => s + d.revenue, 0);
    const entryDate = preview.to;

    const pending: PendingEntry[] = matched.map((d, i) => {
      const share = totalRevenue > 0 ? d.revenue / totalRevenue : 1 / matched.length;
      const adBudget = totalBudget * share;
      return {
        key: `${d.matchedProductId}-${entryDate}-${i}-${Date.now()}`,
        product_id: d.matchedProductId!,
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
        include_wave_fees: true,
        received_orders: "",
        confirmed_orders: "",
        delivered_orders: "",
        refused_orders: "",
        cash_collected: "",
        delivered_by_zone: {},
        upsells_enabled: false,
        upsells: [],
      };
    });


    setPendingEntries((prev) => [...prev, ...pending]);
    setShopifyPreview(null);
    setBulkBudget("");
    toast.success(
      `${matched.length} pré-saisie(s) générée(s).${
        unmatched > 0 ? ` ${unmatched} brouillon(s) ignoré(s).` : ""
      }`,
    );
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document.getElementById("pending-entries")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  function addBlankEntry() {
    if (products.length === 0) {
      toast.error("Crée d'abord un produit.");
      return;
    }
    const p = products[0] as any;
    const revenueCur = cleanCurrency(p.currency || profileCurrency);
    const isRange = manualFromISO !== manualToISO;
    const baseTs = Date.now();
    const newEntry: PendingEntry = {
      key: `manual-${baseTs}-${Math.random()}`,
      product_id: p.id,
      productName: p.name,
      entry_date: manualFromISO,
      period_to: isRange ? manualToISO : undefined,
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
      include_wave_fees: true,
      received_orders: "",
      confirmed_orders: "",
      delivered_orders: "",
      refused_orders: "",
      cash_collected: "",
      delivered_by_zone: {},
      upsells_enabled: false,
      upsells: [],
    };
    setPendingEntries((prev) => [...prev, newEntry]);
    if (isRange) {
      const nbDays = enumerateDays(manualFromISO, manualToISO).length;
      toast.success(`Saisie cumulée créée sur ${nbDays} jours (${manualFromISO} → ${manualToISO}). Saisis les totaux de la période.`);
    }

    setTimeout(() => {
      document.getElementById("pending-entries")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function updatePending(key: string, patch: Partial<PendingEntry>) {
    setPendingEntries((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  }

  function removePending(key: string) {
    setPendingEntries((prev) => prev.filter((p) => p.key !== key));
  }

  async function savePending(entry: PendingEntry) {
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
        // Prix peut être 0 si la ligne est marquée "Offert" (cadeau).
        if (!u.offered && (u.unit_price === "" || u.unit_price == null || Number(u.unit_price) < 0)) {
          throw new Error(`${entry.productName} · Renseigne le prix upsell par unité (≥ 0) ou coche "Offert".`);
        }
      }
    }
    const row: any = {
      user_id: user.id,
      product_id: entry.product_id,
      entry_date: entry.entry_date,
      // En COD, shopify_orders garde la valeur "reçues" pour rester compatible
      // avec les anciennes saisies / le code commun (legacy).
      shopify_orders: isCod
        ? (Number(entry.received_orders) || 0)
        : (Number(entry.shopify_orders) || 0),
      refunded_orders: isCod ? 0 : (Number(entry.refunded_orders) || 0),
      refunded_amount: isCod ? 0 : (Number(entry.refunded_amount) || 0),
      ad_budget: Number(entry.ad_budget) || 0,
      // En COD on autorise la devise du compte pub (XOF / EUR / USD)
      ad_budget_currency: entry.ad_budget_currency as string,
      include_meta_tax: entry.include_meta_tax,
      include_shopify_fees: isCod ? false : entry.include_shopify_fees,
      include_wave_fees: isCod ? entry.include_wave_fees : false,
      total_revenue: isCod
        ? (entry.cash_collected !== "" ? Number(entry.cash_collected) : null)
        : (entry.total_revenue !== "" ? Number(entry.total_revenue) : null),
      total_revenue_currency: isCod ? "XOF" : (entry.total_revenue_currency as string),
      business_mode: activeMode,
      received_orders: isCod ? (Number(entry.received_orders) || 0) : null,
      confirmed_orders: isCod ? (Number(entry.confirmed_orders) || 0) : null,
      delivered_orders: isCod ? (Number(entry.delivered_orders) || 0) : null,
      refused_orders: isCod ? (Number(entry.refused_orders) || 0) : null,
      cash_collected: isCod ? (Number(entry.cash_collected) || 0) : null,
      delivered_by_zone: isCod
        ? Object.fromEntries(
            Object.entries(entry.delivered_by_zone || {})
              .map(([k, v]) => [k, Number(v) || 0])
              .filter(([, v]) => Number(v) > 0),
          )
        : {},
      visits: !isCod && entry.visits !== "" ? Number(entry.visits) : null,
      upsells: entry.upsells_enabled
        ? entry.upsells
            .filter((u) => u.product_id && Number(u.qty) > 0 && (u.offered || Number(u.unit_price) >= 0))
            .map((u) => ({
              product_id: u.product_id,
              qty: Number(u.qty) || 0,
              unit_price: u.offered ? 0 : (Number(u.unit_price) || 0),
              currency: isCod ? "XOF" : u.currency,
              offered: !!u.offered,
            }))
        : [],
    };
    if (entry.period_to && entry.period_to !== entry.entry_date) {
      const nbDays = enumerateDays(entry.entry_date, entry.period_to).length;
      row.notes = `Saisie cumulée du ${entry.entry_date} au ${entry.period_to} (${nbDays} jours)`;
    }
    const { error } = await (supabase
      .from("daily_entries") as any)
      .upsert([row], { onConflict: "user_id,product_id,entry_date" });
    if (error) throw error;
  }


  async function saveOnePending(entry: PendingEntry) {
    try {
      await savePending(entry);
      removePending(entry.key);
      qc.invalidateQueries({ queryKey: ["entries"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Saisie enregistrée pour ${entry.productName}.`);
      navigate({ to: "/dashboard", search: { highlight: 1 } as any });
    } catch (err: any) {
      toast.error(err?.message ?? "Échec de l'enregistrement");
    }
  }

  async function saveAllPending() {
    if (pendingEntries.length === 0) return;
    setBulkSaving(true);
    let ok = 0;
    let fail = 0;
    try {
      for (const entry of pendingEntries) {
        try {
          await savePending(entry);
          ok++;
        } catch {
          fail++;
        }
      }
      qc.invalidateQueries({ queryKey: ["entries"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      if (fail === 0) {
        setPendingEntries([]);
        toast.success(`${ok} saisie(s) enregistrée(s).`);
        navigate({ to: "/dashboard", search: { highlight: 1 } as any });
      } else {
        toast.error(`${ok} OK · ${fail} en échec.`);
      }
    } finally {
      setBulkSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette saisie ?")) return;
    const { error } = await supabase.from("daily_entries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["entries"] });
  }

  function editEntry(e: any) {
    const p: any = products.find((x: any) => x.id === e.product_id);
    if (!p) {
      toast.error("Produit introuvable.");
      return;
    }
    const isCod = (e.business_mode ?? activeMode) === "cod";
    // Évite les doublons : si une saisie en attente existe déjà pour cette ligne
    setPendingEntries((prev) => prev.filter((x) => !(x.product_id === e.product_id && x.entry_date === e.entry_date)));
    const pending: PendingEntry = {
      key: `edit-${e.id}-${Date.now()}`,
      product_id: e.product_id,
      productName: p.name,
      entry_date: e.entry_date,
      shopify_orders: isCod ? "" : String(e.shopify_orders ?? ""),
      visits: !isCod && (e as any).visits != null ? String((e as any).visits) : "",
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
      delivered_by_zone: isCod
        ? Object.fromEntries(Object.entries(e.delivered_by_zone || {}).map(([k, v]) => [k, String(v)]))
        : {},
      upsells_enabled: Array.isArray(e.upsells) && e.upsells.length > 0,
      upsells: Array.isArray(e.upsells)
        ? (e.upsells as any[]).map((u) => ({
            product_id: String(u.product_id ?? ""),
            qty: u.qty != null ? String(u.qty) : "",
            unit_price: u.unit_price != null ? String(u.unit_price) : "",
            currency: cleanCurrency(u.currency ?? p.currency ?? profileCurrency),
            offered: !!u.offered,
          }))
        : [],
    };
    setPendingEntries((prev) => [...prev, pending]);
    toast.success("Saisie chargée pour modification.");
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document.getElementById("pending-entries")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }


  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-10">
      {sub.isFree && (
        <div className="brutal-border-thin border-accent bg-accent/5 px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono">
            <span className="font-bold uppercase tracking-widest text-accent mr-2">PLAN FREE</span>
            Tu vois tes saisies des 30 derniers jours. Passe à Pro pour accéder à tout l'historique.
          </div>
          <Link
            to="/plan"
            className="brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:border-accent"
          >
            Voir les plans →
          </Link>
        </div>
      )}

      <div className="mb-6 md:mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          {activeMode === "cod" ? "COD · LIVRAISONS QUOTIDIENNES" : "DROPSHIPPING · DONNÉES QUOTIDIENNES"}
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">SAISIES</h1>
      </div>


      {products.length === 0 ? (
        <div className="brutal-border p-10 text-center">
          <p className="text-muted-foreground mb-4">
            Tu dois d'abord créer un produit pour saisir des données.
          </p>
          <Link
            to="/products"
            className="inline-block brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
          >
            + Créer un produit
          </Link>
        </div>
      ) : (
        <div className="brutal-border p-6 md:p-8 mb-10 grid gap-4">
          {/* Barre d'actions : Shopify + ajout manuel */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-black">NOUVELLE SAISIE</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Popover
                open={calendarOpen}
                onOpenChange={(o) => {
                  setCalendarOpen(o);
                  if (o) setPendingFrom(null);
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-2 bg-background brutal-border-thin px-3 py-2 font-mono text-sm hover:bg-foreground/5 focus:border-accent focus:border-2 outline-none",
                    )}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {manualRange.to && manualToISO !== manualFromISO ? (
                      <span>
                        {format(manualRange.from, "dd MMM", { locale: fr })} →{" "}
                        {format(manualRange.to, "dd MMM yyyy", { locale: fr })}
                        <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                          {manualDaysCount}j
                        </span>
                      </span>
                    ) : (
                      <span>{format(manualRange.from, "dd MMM yyyy", { locale: fr })}</span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={fr}
                    weekStartsOn={1}
                    numberOfMonths={1}
                    selected={
                      pendingFrom
                        ? pendingFrom
                        : manualRange.to
                          ? undefined
                          : manualRange.from
                    }
                    modifiers={
                      pendingFrom
                        ? { range_start: pendingFrom, range_end: pendingFrom }
                        : manualRange.to
                          ? {
                              range_start: manualRange.from,
                              range_end: manualRange.to,
                              range_middle: { after: manualRange.from, before: manualRange.to },
                            }
                          : {}
                    }
                    defaultMonth={manualRange.from}
                    onDayClick={(day) => {
                      if (!pendingFrom) {
                        setPendingFrom(day);
                        return;
                      }
                      const a = pendingFrom;
                      const b = day;
                      const from = a <= b ? a : b;
                      const to = a <= b ? b : a;
                      const sameDay = dateToISO(from) === dateToISO(to);
                      setManualRange({ from, to: sameDay ? undefined : to });
                      setPendingFrom(null);
                      setCalendarOpen(false);
                    }}
                    className={cn("p-3 pointer-events-auto")}
                  />
                  <div className="border-t border-foreground/20 p-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center">
                    {pendingFrom
                      ? "2e clic = valider (même jour ou plage)"
                      : "1er clic = présélection · 2e clic = valider"}
                  </div>
                </PopoverContent>
              </Popover>

              <button
                type="button"
                onClick={addBlankEntry}
                className="brutal-border-thin px-3 py-2 text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background"
              >
                + Ajouter {manualDaysCount > 1 ? `${manualDaysCount} saisies` : "une saisie"}
              </button>
              {/* Synchro Shopify désactivée temporairement (en attente publication App Store) */}
              {false && (
                <ShopifySyncButton
                  from={manualFromISO}
                  to={manualToISO}
                  onPreview={setShopifyPreview}
                />
              )}
            </div>
          </div>

          <p className="text-xs font-mono text-muted-foreground">
            Ajoute une saisie manuelle vide pour un jour donné. Ça prend moins d'1 minute.
          </p>

          {/* Panneau brouillons Shopify */}
          {shopifyPreview && viewPreview && (
            <div className="brutal-border-thin border-accent bg-accent/5 p-4 grid gap-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="text-xs font-mono">
                  <span className="font-black uppercase tracking-widest text-accent mr-2">
                    Brouillons Shopify
                  </span>
                  {viewPreview.from} → {viewPreview.to} · devise {viewPreview.currency}
                  {!selectedDraftDate && (shopifyPreview.refundedOrders > 0 || shopifyPreview.cancelledOrders > 0) && (
                    <>
                      {" · "}
                      <span className="text-muted-foreground">
                        ↩ {shopifyPreview.refundedOrders} remb. · ✕ {shopifyPreview.cancelledOrders} annul.
                      </span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShopifyPreview(null)}
                  className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 hover:bg-foreground/10"
                >
                  ✕ Fermer
                </button>
              </div>

              {shopifyPreview.availableDates && shopifyPreview.availableDates.length > 0 && (
                <div className="grid gap-1.5">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                    Filtrer par jour
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedDraftDate(null)}
                      className={`brutal-border-thin px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                        selectedDraftDate === null
                          ? "bg-foreground text-background"
                          : "bg-background hover:bg-foreground/10"
                      }`}
                    >
                      Toute la plage
                    </button>
                    {shopifyPreview.availableDates.map((d) => {
                      const total = shopifyPreview.drafts.reduce(
                        (s, dr) => s + (dr.byDate?.[d]?.orders ?? 0),
                        0,
                      );
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDraftDate(d)}
                          className={`brutal-border-thin px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                            selectedDraftDate === d
                              ? "bg-foreground text-background"
                              : "bg-background hover:bg-foreground/10"
                          }`}
                          title={`${total} cmd ce jour-là`}
                        >
                          {d} · {total}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {viewPreview.drafts.length === 0 ? (
                <div className="text-xs font-mono text-muted-foreground italic px-1">
                  Aucune commande pour {selectedDraftDate ?? "cette plage"}.
                </div>
              ) : (
                <div className="brutal-border-thin bg-background p-3 grid gap-2">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-widest">
                    Pré-remplir les saisies
                    {selectedDraftDate && <> — {selectedDraftDate}</>}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground leading-snug">
                    Génère une carte éditable par produit (date, commandes, CA pré-remplis).
                    Le budget pub total (devise {viewPreview.currency}) est réparti au prorata du CA.
                  </p>
                  <div className="flex gap-2 flex-wrap items-center">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder={`Budget pub total (${viewPreview.currency}) — optionnel`}
                      value={bulkBudget}
                      onChange={(e) => setBulkBudget(e.target.value)}
                      className="flex-1 min-w-[160px] bg-background brutal-border-thin px-3 py-2 font-mono text-sm focus:border-accent focus:border-2 outline-none placeholder:text-muted-foreground/60"
                    />
                    <button
                      type="button"
                      onClick={() => prepareShopifyDrafts(viewPreview)}
                      className="brutal-border-thin bg-foreground text-background px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent"
                    >
                      Pré-remplir ({viewPreview.drafts.filter((d) => d.matchedProductId).length})
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pré-saisies à valider */}
          {pendingEntries.length > 0 && (
            <div
              id="pending-entries"
              className="brutal-border-thin border-accent bg-accent/5 p-4 grid gap-3"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="text-xs font-mono">
                  <span className="font-black uppercase tracking-widest text-accent mr-2">
                    Saisies à valider
                  </span>
                  {pendingEntries.length} produit(s)
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={bulkSaving}
                    onClick={saveAllPending}
                    className="brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent disabled:opacity-50"
                  >
                    {bulkSaving ? "Enregistrement…" : `Tout valider (${pendingEntries.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingEntries([])}
                    className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 hover:bg-foreground/10"
                  >
                    ✕ Tout annuler
                  </button>
                </div>
              </div>

              {pendingEntries.map((p) => (
                <PendingCard
                  key={p.key}
                  entry={p}
                  products={products}
                  mode={activeMode}
                  canUseUpsells={canUseUpsells(sub.plan, activeMode)}
                  onChange={(patch) => updatePending(p.key, patch)}
                  onRemove={() => removePending(p.key)}
                  onSave={() => saveOnePending(p)}
                />
              ))}

            </div>
          )}

          {pendingEntries.length === 0 && !shopifyPreview && (
            <div className="brutal-border-thin border-dashed p-6 text-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Aucune saisie en cours. Synchronise depuis Shopify ou clique sur « + Ajouter une saisie ».
            </div>
          )}
        </div>
      )}

      {/* Historique */}
      <h2 id="entries-history" className="text-2xl font-black mb-4">HISTORIQUE — 30 DERNIERS JOURS</h2>
      <div className="brutal-border overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead className="bg-foreground text-background">
            <tr className="text-xs uppercase tracking-widest">
              <th className="text-left p-3">DATE</th>
              <th className="text-left p-3">PRODUIT</th>
              <th className="text-right p-3">REÇUES</th>
              {activeMode === "cod" && <th className="text-right p-3">CONFIRMÉES</th>}
              {activeMode === "cod" && <th className="text-right p-3">LIVRÉES</th>}
              <th className="text-right p-3">{activeMode === "cod" ? "CASH" : "CA"}</th>
              <th className="text-right p-3">PUB</th>
              <th className="p-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {entriesQ.data?.length === 0 && (
              <tr>
                <td colSpan={activeMode === "cod" ? 8 : 6} className="text-center p-6 text-muted-foreground">
                  Aucune saisie sur la période.
                </td>
              </tr>
            )}
            {entriesQ.data?.map((e: any) => {
              const p = productMap.get(e.product_id);
              const adCur = e.ad_budget_currency ?? "EUR";
              const revenueCur = e.total_revenue_currency ?? (p as any)?.currency ?? "EUR";
              const isCod = activeMode === "cod";
              // Fallback : anciennes saisies COD ont la valeur dans shopify_orders
              const receivedDisplay = isCod
                ? (e.received_orders ?? e.shopify_orders ?? 0)
                : e.shopify_orders;
              return (
                <tr key={e.id} className="border-t border-foreground hover:bg-foreground/5">
                  <td className="p-3 tabular">{e.entry_date}</td>
                  <td className="p-3">{p?.name ?? "—"}</td>
                  <td className="p-3 text-right tabular">
                    {receivedDisplay}
                    {!isCod && (Number(e.refunded_orders) > 0 || Number(e.refunded_amount) > 0) && (
                      <div className="text-[10px] text-muted-foreground font-normal mt-0.5 space-y-0.5">
                        {Number(e.refunded_orders) > 0 && (
                          <div className="text-destructive">↩ {e.refunded_orders} remb.</div>
                        )}
                        {Number(e.refunded_amount) > 0 && (
                          <div className="text-destructive">
                            −{formatCurrency(Number(e.refunded_amount), adCur)}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  {isCod && (
                    <td className="p-3 text-right tabular">{e.confirmed_orders ?? 0}</td>
                  )}
                  {isCod && (
                    <td className="p-3 text-right tabular">{e.delivered_orders ?? 0}</td>
                  )}
                  <td className="p-3 text-right tabular">
                    {isCod
                      ? formatCurrency(Number(e.cash_collected ?? 0), "XOF")
                      : e.total_revenue != null
                        ? formatCurrency(Number(e.total_revenue), revenueCur)
                        : "—"}
                  </td>
                  <td className="p-3 text-right tabular">
                    {formatCurrency(Number(e.ad_budget), adCur)}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-3">
                      <button
                        onClick={() => editEntry(e)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                        title="Modifier"
                        aria-label="Modifier la saisie"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function PendingCard({
  entry,
  products,
  mode,
  canUseUpsells,
  onChange,
  onRemove,
  onSave,
}: {
  entry: PendingEntry;
  products: any[];
  mode: "cod" | "dropshipping";
  canUseUpsells: boolean;
  onChange: (patch: Partial<PendingEntry>) => void;
  onRemove: () => void;
  onSave: () => void;
}) {
  const isCod = mode === "cod";
  const currentProduct = products.find((p) => p.id === entry.product_id);
  const productZones: { name: string; cost: number }[] = Array.isArray(currentProduct?.shipping_zones)
    ? (currentProduct!.shipping_zones as any[]).map((z) => ({
        name: String(z.name ?? ""),
        cost: Number(z.cost ?? 0),
      })).filter((z) => z.name.length > 0)
    : [];
  const hasZones = isCod && productZones.length > 0;
  return (
    <div className="brutal-border-thin bg-background p-3 grid gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="font-mono text-sm font-bold flex items-center gap-2 flex-wrap">
          <select
            value={entry.product_id}
            onChange={(e) => {
              const next = products.find((p) => p.id === e.target.value);
              onChange({
                product_id: e.target.value,
                productName: next?.name ?? entry.productName,
                total_revenue_currency: cleanCurrency(next?.currency ?? entry.total_revenue_currency),
                delivered_by_zone: {},
              });
            }}
            className="bg-background brutal-border-thin px-2 py-1 font-mono text-sm focus:border-accent focus:border-2 outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest">
            {isCod ? "COD · DEVISE XOF" : `CA ${entry.total_revenue_currency} · PUB ${entry.ad_budget_currency}`}
          </span>
          {entry.period_to && entry.period_to !== entry.entry_date && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-foreground text-background px-2 py-1">
              📅 Cumulé {entry.entry_date} → {entry.period_to} ({enumerateDays(entry.entry_date, entry.period_to).length}j)
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 hover:bg-foreground/10"
          title="Retirer cette pré-saisie"
        >
          ✕
        </button>
      </div>

      {isCod ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Field
              label="Date"
              type="date"
              value={entry.entry_date}
              onChange={(v) => onChange({ entry_date: v })}
            />
            <Field
              label="Cmd reçues"
              type="number"
              value={entry.received_orders}
              placeholder="0"
              onChange={(v) => onChange({ received_orders: v })}
            />
            <Field
              label="Cmd confirmées"
              type="number"
              value={entry.confirmed_orders}
              placeholder="0"
              onChange={(v) => onChange({ confirmed_orders: v })}
            />
            {!hasZones && (
              <Field
                label="Cmd livrées"
                type="number"
                value={entry.delivered_orders}
                placeholder="0"
                onChange={(v) => onChange({ delivered_orders: v })}
              />
            )}
            <MoneyField
              label="Cash encaissé (XOF)"
              value={entry.cash_collected}
              currency={"EUR" as AppCurrency}
              placeholder="0"
              onValueChange={(v) => onChange({ cash_collected: v })}
              onCurrencyChange={() => {}}
              lockedXof
            />
            <MoneyField
              label="Budget pub"
              value={entry.ad_budget}
              currency={entry.ad_budget_currency}
              placeholder="0"
              onValueChange={(v) => onChange({ ad_budget: v })}
              onCurrencyChange={(c) => onChange({ ad_budget_currency: c })}
            />
          </div>

          {hasZones && (
            <div className="brutal-border-thin p-3 bg-accent/5">
              <div className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center justify-between gap-2 flex-wrap">
                <span>Cmd livrées par zone</span>
                <span className="text-muted-foreground">
                  Total {Object.values(entry.delivered_by_zone || {}).reduce((s, v) => s + (Number(v) || 0), 0)}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {productZones.map((z) => (
                  <Field
                    key={z.name}
                    label={`${z.name} (${z.cost} FCFA)`}
                    type="number"
                    value={String(entry.delivered_by_zone?.[z.name] ?? "")}
                    placeholder="0"
                    onChange={(v) => {
                      const nextZones = { ...(entry.delivered_by_zone || {}), [z.name]: v };
                      const total = Object.values(nextZones).reduce(
                        (s, val) => s + (Number(val) || 0),
                        0,
                      );
                      onChange({
                        delivered_by_zone: nextZones,
                        delivered_orders: String(total),
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {hasZones
              ? "Frais d'expédition calculés zone × coût · CA = cash livré"
              : "CA = somme cash livré · Coût produit & expé déduits auto depuis la fiche produit"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none brutal-border-thin px-3 py-2">
              <input
                type="checkbox"
                checked={entry.include_meta_tax}
                onChange={(e) => onChange({ include_meta_tax: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-foreground cursor-pointer"
              />
              <span className="text-[11px] font-mono leading-snug">
                <span className="font-bold uppercase tracking-widest">Inclure taxes Meta Ads</span>
                <span className="block text-muted-foreground mt-0.5 text-[10px]">
                  Déduit la TVA Meta (18%) du budget pub.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer select-none brutal-border-thin px-3 py-2">
              <input
                type="checkbox"
                checked={entry.include_wave_fees}
                onChange={(e) => onChange({ include_wave_fees: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-foreground cursor-pointer"
              />
              <span className="text-[11px] font-mono leading-snug">
                <span className="font-bold uppercase tracking-widest">Inclure frais Wave</span>
                <span className="block text-muted-foreground mt-0.5 text-[10px]">
                  Déduit 1% du cash encaissé.
                </span>
              </span>
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Field
              label="Date"
              type="date"
              value={entry.entry_date}
              onChange={(v) => onChange({ entry_date: v })}
            />
            <Field
              label="Commandes reçues"
              type="number"
              value={entry.shopify_orders}
              onChange={(v) => onChange({ shopify_orders: v })}
            />
            <MoneyField
              label="CA total"
              value={entry.total_revenue}
              currency={entry.total_revenue_currency}
              onValueChange={(v) => onChange({ total_revenue: v })}
              onCurrencyChange={(c) => onChange({ total_revenue_currency: c })}
            />
            <Field
              label="Cmd remb."
              type="number"
              value={entry.refunded_orders}
              placeholder="0"
              onChange={(v) => onChange({ refunded_orders: v })}
            />
            <MoneyField
              label="Montant remb."
              value={entry.refunded_amount}
              currency={entry.total_revenue_currency}
              placeholder="0"
              onValueChange={(v) => onChange({ refunded_amount: v })}
              onCurrencyChange={(c) => onChange({ total_revenue_currency: c })}
            />
            <MoneyField
              label="Budget pub"
              value={entry.ad_budget}
              currency={entry.ad_budget_currency}
              placeholder="0"
              onValueChange={(v) => onChange({ ad_budget: v })}
              onCurrencyChange={(c) => onChange({ ad_budget_currency: c })}
            />
            <Field
              label="Visiteurs (optionnel)"
              type="number"
              value={entry.visits}
              placeholder="—"
              onChange={(v) => onChange({ visits: v })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none brutal-border-thin px-3 py-2">
              <input
                type="checkbox"
                checked={entry.include_meta_tax}
                onChange={(e) => onChange({ include_meta_tax: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-foreground cursor-pointer"
              />
              <span className="text-[11px] font-mono leading-snug">
                <span className="font-bold uppercase tracking-widest">Inclure taxes Meta Ads</span>
                <span className="block text-muted-foreground mt-0.5 text-[10px]">
                  Coche si Meta te facture la TVA sur ta pub.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer select-none brutal-border-thin px-3 py-2">
              <input
                type="checkbox"
                checked={entry.include_shopify_fees}
                onChange={(e) => onChange({ include_shopify_fees: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-foreground cursor-pointer"
              />
              <span className="text-[11px] font-mono leading-snug">
                <span className="font-bold uppercase tracking-widest">Inclure frais Shopify Payments</span>
                <span className="block text-muted-foreground mt-0.5 text-[10px]">
                  Pour suivre tes frais de transaction Shopify.
                </span>
              </span>
            </label>
          </div>
        </>
      )}

      <UpsellSection
        entry={entry}
        products={products}
        mode={mode}
        canUseUpsells={canUseUpsells}
        onChange={onChange}
      />



      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          className="brutal-border-thin bg-foreground text-background px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent"
        >
          Valider cette saisie →
        </button>
      </div>
    </div>
  );
}


function Field({
  label,
  value,
  onChange,
  type = "text",
  decimal = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  decimal?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={type === "number" ? 0 : undefined}
        step={decimal ? "0.01" : type === "number" ? "1" : undefined}
        placeholder={placeholder}
        className="w-full bg-background brutal-border-thin px-2 py-1.5 font-mono text-sm focus:border-accent focus:border-2 outline-none placeholder:text-muted-foreground/60"
      />
    </label>
  );
}

function MoneyField({
  label,
  value,
  currency,
  onValueChange,
  onCurrencyChange,
  placeholder,
  lockedXof,
}: {
  label: string;
  value: string;
  currency: AppCurrency;
  onValueChange: (v: string) => void;
  onCurrencyChange: (c: AppCurrency) => void;
  placeholder?: string;
  lockedXof?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="flex gap-0">
        <input
          type="number"
          min={0}
          step="0.01"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onValueChange(e.target.value)}
          className="flex-1 w-0 bg-background brutal-border-thin px-2 py-1.5 font-mono text-sm text-right focus:border-accent focus:border-2 outline-none placeholder:text-muted-foreground/60"
        />
        {lockedXof ? (
          <span className="bg-foreground text-background brutal-border-thin border-l-0 px-2 py-1.5 font-mono text-xs font-bold flex items-center">
            XOF
          </span>
        ) : (
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(cleanCurrency(e.target.value))}
            className="bg-foreground text-background brutal-border-thin border-l-0 px-2 py-1.5 font-mono text-xs font-bold focus:border-accent outline-none"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        )}
      </div>
    </div>
  );
}


function UpsellSection({
  entry,
  products,
  mode,
  canUseUpsells,
  onChange,
}: {
  entry: PendingEntry;
  products: any[];
  mode: "cod" | "dropshipping";
  canUseUpsells: boolean;
  onChange: (patch: Partial<PendingEntry>) => void;
}) {
  const isCod = mode === "cod";
  const lockedCur: AppCurrency = isCod ? ("EUR" as AppCurrency) : entry.total_revenue_currency;
  const symbol = isCod ? "XOF" : lockedCur;

  if (!canUseUpsells) {
    return (
      <div className="brutal-border-thin border-dashed px-3 py-2 flex items-center justify-between gap-2 flex-wrap bg-muted/30">
        <div className="text-[11px] font-mono leading-snug">
          <span className="font-bold uppercase tracking-widest">🔒 Upsell</span>
          <span className="block text-muted-foreground mt-0.5 text-[10px]">
            Ventes additionnelles — réservé au plan Pro Drop ($29) en mode Dropshipping.
          </span>
        </div>
        <Link
          to="/plan"
          className="text-[10px] font-mono font-bold uppercase tracking-widest underline whitespace-nowrap"
        >
          Voir les plans →
        </Link>
      </div>
    );
  }

  const lines = entry.upsells ?? [];

  function addLine() {
    const firstProduct = products[0];
    if (!firstProduct) return;
    const newLine: UpsellLine = {
      product_id: firstProduct.id,
      qty: "",
      unit_price: "",
      currency: isCod ? ("EUR" as AppCurrency) : lockedCur,
    };
    onChange({ upsells: [...lines, newLine] });
  }

  function updateLine(idx: number, patch: Partial<UpsellLine>) {
    const next = lines.map((l, i) => (i === idx ? { ...l, ...patch } : l));
    onChange({ upsells: next });
  }

  function removeLine(idx: number) {
    const next = lines.filter((_, i) => i !== idx);
    onChange({ upsells: next, upsells_enabled: next.length > 0 ? entry.upsells_enabled : false });
  }

  return (
    <div className="brutal-border-thin px-3 py-2">
      <label className="flex items-start gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={entry.upsells_enabled}
          onChange={(e) => {
            const checked = e.target.checked;
            if (checked && lines.length === 0 && products.length > 0) {
              onChange({
                upsells_enabled: true,
                upsells: [
                  {
                    product_id: products[0].id,
                    qty: "",
                    unit_price: "",
                    currency: isCod ? ("EUR" as AppCurrency) : lockedCur,
                  },
                ],
              });
            } else {
              onChange({ upsells_enabled: checked });
            }
          }}
          className="mt-0.5 w-4 h-4 accent-foreground cursor-pointer"
        />
        <span className="text-[11px] font-mono leading-snug">
          <span className="font-bold uppercase tracking-widest">Upsell</span>
          <span className="block text-muted-foreground mt-0.5 text-[10px]">
            Coche si certains clients ont pris un produit additionnel à un prix différent.
          </span>
        </span>
      </label>

      {entry.upsells_enabled && (
        <div className="mt-3 grid gap-2">
          {lines.length === 0 && (
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Aucun upsell ajouté.
            </div>
          )}
          {lines.map((u, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_90px_140px_auto] gap-2 items-end brutal-border-thin border-dashed p-2"
            >
              <label className="block">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1">
                  Produit upsell
                </div>
                <select
                  value={u.product_id}
                  onChange={(e) => updateLine(idx, { product_id: e.target.value })}
                  className="w-full bg-background brutal-border-thin px-2 py-1.5 font-mono text-sm focus:border-accent focus:border-2 outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Qté *"
                type="number"
                value={u.qty}
                placeholder="0"
                onChange={(v) => updateLine(idx, { qty: v })}
              />
              <label className="block">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1 flex items-center justify-between gap-2">
                  <span>Prix / unité ({symbol}){u.offered ? "" : " *"}</span>
                  <label className="flex items-center gap-1 cursor-pointer normal-case tracking-normal font-normal text-[10px]">
                    <input
                      type="checkbox"
                      checked={!!u.offered}
                      onChange={(e) =>
                        updateLine(idx, {
                          offered: e.target.checked,
                          unit_price: e.target.checked ? "0" : u.unit_price,
                        })
                      }
                      className="w-3 h-3 accent-foreground cursor-pointer"
                    />
                    <span className="font-bold">🎁 Offert</span>
                  </label>
                </div>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  required={!u.offered}
                  disabled={!!u.offered}
                  value={u.offered ? "0" : u.unit_price}
                  placeholder="0"
                  onChange={(e) => updateLine(idx, { unit_price: e.target.value })}
                  className={`w-full bg-background brutal-border-thin px-2 py-1.5 font-mono text-sm text-right focus:border-accent focus:border-2 outline-none placeholder:text-muted-foreground/60 ${
                    u.offered ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    !u.offered && (!u.unit_price || Number(u.unit_price) < 0) ? "border-accent" : ""
                  }`}
                />
              </label>
              <button
                type="button"
                onClick={() => removeLine(idx)}
                className="text-[10px] uppercase tracking-widest font-bold px-2 py-1.5 hover:bg-foreground/10 brutal-border-thin"
                title="Retirer cet upsell"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLine}
            className="text-[10px] uppercase tracking-widest font-bold px-2 py-1.5 hover:bg-foreground/10 brutal-border-thin self-start"
          >
            + Ajouter un upsell
          </button>
        </div>
      )}
    </div>
  );
}
