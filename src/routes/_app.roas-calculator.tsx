import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/calc";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const HISTORY_KEY = "netodash:roas-calc-history:v1";

type HistoryEntry = {
  id: string;
  createdAt: number;
  mode: Mode;
  currency: Currency;
  productName: string;
  salePrice: string;
  costPrice: string;
  shipping: string;
  otherFees: string;
  transactionPct: string;
  adSpend: string;
  orders: string;
  targetMargin: string;
  // Snapshot des résultats clés pour affichage rapide
  summary: {
    roas?: number;
    netProfit?: number;
    margePct?: number;
    maxCpa?: number;
    targetRoas?: number;
    breakEvenRoas?: number;
  };
};

type DbRow = {
  id: string;
  user_id: string;
  product_name: string;
  mode: string;
  currency: string;
  payload: Record<string, unknown>;
  summary: Record<string, unknown>;
  created_at: string;
};

function rowToEntry(row: DbRow): HistoryEntry {
  const p = row.payload ?? {};
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    mode: row.mode as Mode,
    currency: row.currency as Currency,
    productName: row.product_name,
    salePrice: String((p as any).salePrice ?? ""),
    costPrice: String((p as any).costPrice ?? ""),
    shipping: String((p as any).shipping ?? ""),
    otherFees: String((p as any).otherFees ?? ""),
    transactionPct: String((p as any).transactionPct ?? "0"),
    adSpend: String((p as any).adSpend ?? ""),
    orders: String((p as any).orders ?? ""),
    targetMargin: String((p as any).targetMargin ?? "20"),
    summary: (row.summary ?? {}) as HistoryEntry["summary"],
  };
}

function entryToRowInsert(entry: HistoryEntry, userId: string) {
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
      targetMargin: entry.targetMargin,
    },
    summary: entry.summary,
  };
}

function readLocalHistory(): HistoryEntry[] {
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



export const Route = createFileRoute("/_app/roas-calculator")({
  head: () => ({
    meta: [
      { title: "ROAS Calculator — NETODASH" },
      {
        name: "description",
        content:
          "Calcule ton ROAS, ta marge nette et ton point mort en quelques secondes. Outil pour e-commerçants et dropshippers.",
      },
    ],
  }),
  component: RoasCalculatorPage,
});

type Mode = "actual" | "target" | "breakeven";
type Currency = "USD" | "EUR" | "GBP";

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "EUR", label: "EUR €" },
  { code: "USD", label: "USD $" },
  { code: "GBP", label: "GBP £" },
];

function RoasCalculatorPage() {
  const [mode, setMode] = useState<Mode>("actual");
  const [currency, setCurrency] = useState<Currency>("USD");

  const [productName, setProductName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [shipping, setShipping] = useState("");
  const [otherFees, setOtherFees] = useState("");
  const [transactionPct, setTransactionPct] = useState("0");
  const [adSpend, setAdSpend] = useState("");
  const [orders, setOrders] = useState("");
  const [targetMargin, setTargetMargin] = useState("20");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { user } = useAuth();
  const userId = user?.id;
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  // Charge depuis Supabase + migre les anciens calculs localStorage vers la base
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setHistoryLoading(true);
      try {
        // Migration one-shot du localStorage vers la base (si présent)
        const legacy = readLocalHistory();
        if (legacy.length > 0) {
          const rows = legacy.map((e) => entryToRowInsert(e, userId));
          const { error: migErr } = await supabase
            .from("roas_calculations" as any)
            .insert(rows as any);
          if (!migErr) {
            try { window.localStorage.removeItem(HISTORY_KEY); } catch {}
            toast.success(`${legacy.length} calcul(s) migré(s) vers ton compte`);
          }
        }

        const { data, error } = await supabase
          .from("roas_calculations" as any)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) throw error;
        if (!cancelled) setHistory(((data ?? []) as unknown as DbRow[]).map(rowToEntry));
      } catch (e: any) {
        if (!cancelled) toast.error("Impossible de charger l'historique : " + (e?.message ?? "erreur"));
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);


  const n = (v: string) => (v === "" ? 0 : Number(v));

  const res = useMemo(() => {
    const sale = n(salePrice);
    const cost = n(costPrice);
    const ship = n(shipping);
    const other = n(otherFees);
    const txPct = n(transactionPct);
    const ad = n(adSpend);
    const ord = n(orders);

    // Coût variable par commande (hors pub & transaction qui se calculent sur le total)
    const variablePerOrder = cost + ship + other;
    const grossMarginPerOrder = sale - variablePerOrder - sale * (txPct / 100);

    if (mode === "actual") {
      const revenue = sale * ord;
      const transactionFees = revenue * (txPct / 100);
      const totalCosts = variablePerOrder * ord + transactionFees + ad;
      const netProfit = revenue - totalCosts;
      const roas = ad > 0 ? revenue / ad : 0;
      const cpa = ord > 0 ? ad / ord : 0;
      const margePct = revenue > 0 ? (netProfit / revenue) * 100 : 0;
      // Break-even ROAS = revenue / ad pour profit = 0
      // netProfit = 0 => revenue = ad + variable*ord + revenue*txPct
      // revenue*(1-txPct) = ad + variable*ord => ad = revenue*(1-txPct) - variable*ord
      // BE ROAS = sale / (sale*(1-txPct) - variable) for 1 order
      const beRoasDen = sale * (1 - txPct / 100) - variablePerOrder;
      const breakEvenRoas = beRoasDen > 0 ? sale / beRoasDen : 0;
      const maxCpa = grossMarginPerOrder; // dépense pub max par commande
      return {
        revenue,
        totalCosts,
        netProfit,
        roas,
        cpa,
        margePct,
        breakEvenRoas,
        maxCpa,
        grossMarginPerOrder,
      };
    }

    if (mode === "breakeven") {
      // Mode break-even : juste prix de vente + coût produit (+ marge cible optionnelle)
      const targetPct = n(targetMargin);
      const beDen = sale - cost;
      const breakEvenRoas = beDen > 0 ? sale / beDen : 0;
      const desiredNetPerOrder = sale * (targetPct / 100);
      const targetDen = sale - cost - desiredNetPerOrder;
      const targetRoas = targetDen > 0 ? sale / targetDen : 0;
      const maxCpaBE = beDen; // marge brute = CPA max au point mort
      const maxCpaTarget = targetDen;
      return {
        breakEvenRoas,
        targetRoas,
        maxCpaBE,
        maxCpaTarget,
        desiredNetPerOrder,
        grossMarginPerOrder: beDen,
      } as any;
    }

    // Mode target : on cherche le CPA / nb commandes pour atteindre une marge cible (%)
    const targetPct = n(targetMargin);
    // Marge nette par commande désirée = sale * targetPct/100
    const desiredNetPerOrder = sale * (targetPct / 100);
    // Pub max par commande = marge brute - marge nette désirée
    const maxCpa = grossMarginPerOrder - desiredNetPerOrder;
    const targetRoas = maxCpa > 0 ? sale / maxCpa : 0;
    const breakEvenRoas =
      sale * (1 - txPct / 100) - variablePerOrder > 0
        ? sale / (sale * (1 - txPct / 100) - variablePerOrder)
        : 0;
    return {
      grossMarginPerOrder,
      desiredNetPerOrder,
      maxCpa,
      targetRoas,
      breakEvenRoas,
    } as any;
  }, [mode, salePrice, costPrice, shipping, otherFees, transactionPct, adSpend, orders, targetMargin]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          OUTIL — Pour COD & Dropshipping
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">
          ROAS CALCULATOR
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          L'essentiel uniquement : <strong>prix de vente</strong> et <strong>coût produit</strong>.
          Tu obtiens ton ROAS, ta marge nette et ton <strong>CPA max</strong>. Affine avec les
          coûts avancés si besoin.
        </p>
      </div>

      {/* Tabs mode */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode("breakeven")}
          className={`brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${
            mode === "breakeven"
              ? "bg-foreground text-background border-foreground"
              : "hover:bg-foreground hover:text-background"
          }`}
        >
          ⚖ Break-Even ROAS
        </button>
        <button
          type="button"
          onClick={() => setMode("actual")}
          className={`brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${
            mode === "actual"
              ? "bg-foreground text-background border-foreground"
              : "hover:bg-foreground hover:text-background"
          }`}
        >
          📊 Calculer mon ROAS actuel
        </button>
        <button
          type="button"
          onClick={() => setMode("target")}
          className={`brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${
            mode === "target"
              ? "bg-foreground text-background border-foreground"
              : "hover:bg-foreground hover:text-background"
          }`}
        >
          🎯 Trouver mon CPA max
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* Inputs */}
        <form className="brutal-border p-6 grid gap-4">
          <div className="flex items-end gap-3">
            <Field label="Produit (optionnel)" value={productName} onChange={setProductName} />
            <div>
              <div className="text-xs uppercase tracking-widest font-bold mb-2">Devise</div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-background brutal-border-thin px-3 py-3 font-mono focus:border-accent focus:border-2 outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label={`Prix de vente (${currency})`}
              type="number"
              value={salePrice}
              onChange={setSalePrice}
            />
            <Field
              label={`Coût produit (${currency})`}
              type="number"
              value={costPrice}
              onChange={setCostPrice}
            />
            {mode === "actual" && (
              <>
                <Field
                  label={`Dépense pub totale (${currency})`}
                  type="number"
                  value={adSpend}
                  onChange={setAdSpend}
                />
                <Field
                  label="Nombre de commandes"
                  type="number"
                  value={orders}
                  onChange={setOrders}
                />
              </>
            )}
            {mode === "target" && (
              <Field
                label="Marge nette cible (%)"
                type="number"
                value={targetMargin}
                onChange={setTargetMargin}
                hint="Ex : 20% du CA après pub"
              />
            )}
            {mode === "breakeven" && (
              <Field
                label="Marge nette visée (%) — optionnel"
                type="number"
                value={targetMargin}
                onChange={setTargetMargin}
                hint="Pour calculer le Target ROAS"
              />
            )}
          </div>

          {mode === "breakeven" && (
            <div className="brutal-border-thin p-3 text-[11px] font-mono text-muted-foreground leading-relaxed">
              <strong className="text-foreground uppercase tracking-widest">Mode simple :</strong>{" "}
              juste prix de vente et coût produit. Idéal avant de lancer une campagne pour
              savoir à partir de quel ROAS tu commences à gagner de l'argent.
            </div>
          )}

          {/* Coûts avancés (optionnel) — masqué en mode breakeven */}
          {mode !== "breakeven" && (
            <div className="brutal-border-thin">
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
              >
                <span>⚙ Coûts avancés (optionnel)</span>
                <span>{showAdvanced ? "−" : "+"}</span>
              </button>
              {showAdvanced && (
                <div className="grid grid-cols-2 gap-4 p-4 border-t border-foreground/20">
                  <Field
                    label={`Expédition / cmd (${currency})`}
                    type="number"
                    value={shipping}
                    onChange={setShipping}
                  />
                  <Field
                    label={`Frais cachés / cmd (${currency})`}
                    type="number"
                    value={otherFees}
                    onChange={setOtherFees}
                    hint="SAV, retours, etc."
                  />
                  <Field
                    label="Frais transaction (%)"
                    type="number"
                    value={transactionPct}
                    onChange={setTransactionPct}
                    hint="Shopify / Stripe ≈ 2.9%"
                  />
                </div>
              )}
            </div>
          )}
        </form>

        {/* Results */}
        <div className="brutal-border p-6 grid gap-3 bg-foreground/[0.02]">
          <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            Résultat
          </div>
          {mode === "breakeven" && (
            <>
              <ResultRow
                label="⚖ Break-Even ROAS"
                value={res.breakEvenRoas > 0 ? res.breakEvenRoas.toFixed(2) + "x" : "—"}
                emphasis="good"
                hint="ROAS minimum pour profit = 0 (sale / (sale − cost))"
              />
              <ResultRow
                label="🎯 Target ROAS"
                value={res.targetRoas > 0 ? res.targetRoas.toFixed(2) + "x" : "—"}
                hint={`Pour viser ${n(targetMargin) || 0}% de marge nette`}
              />
              <hr className="border-foreground/20 my-1" />
              <ResultRow
                label="Marge brute / commande"
                value={formatCurrency(res.grossMarginPerOrder, currency)}
                hint="Prix de vente − coût produit"
              />
              <ResultRow
                label="CPA max (break-even)"
                value={formatCurrency(res.maxCpaBE, currency)}
                hint="Dépense pub max par commande pour profit = 0"
              />
              {n(targetMargin) > 0 && (
                <ResultRow
                  label="CPA max (target)"
                  value={
                    res.maxCpaTarget > 0
                      ? formatCurrency(res.maxCpaTarget, currency)
                      : "—"
                  }
                  hint="Pour atteindre la marge cible"
                />
              )}
            </>
          )}
          {mode === "actual" && (
            <>
              <ResultRow
                label="ROAS"
                value={res.roas.toFixed(2) + "x"}
                emphasis={res.roas > res.breakEvenRoas ? "good" : "bad"}
                hint={
                  res.roas > res.breakEvenRoas
                    ? "Tu gagnes de l'argent ✓"
                    : "Sous le seuil de rentabilité"
                }
              />
              <ResultRow
                label="Profit net"
                value={formatCurrency(res.netProfit, currency)}
                emphasis={res.netProfit >= 0 ? "good" : "bad"}
              />
              <ResultRow
                label="Marge nette (%)"
                value={res.margePct.toFixed(1) + "%"}
                emphasis={res.margePct >= 0 ? "good" : "bad"}
              />
              <hr className="border-foreground/20 my-1" />
              <ResultRow
                label="CA total"
                value={formatCurrency(res.revenue, currency)}
              />
              <ResultRow
                label="Coûts totaux"
                value={formatCurrency(res.totalCosts, currency)}
              />
              <ResultRow label="CPA actuel" value={formatCurrency(res.cpa, currency)} />
              <hr className="border-foreground/20 my-1" />
              <ResultRow
                label="🎯 CPA max pour ne pas perdre"
                value={formatCurrency(res.maxCpa, currency)}
                hint="Si ton CPA passe au-dessus, tu perds de l'argent"
              />
              <ResultRow
                label="🎯 Break-even ROAS"
                value={res.breakEvenRoas.toFixed(2) + "x"}
                hint="ROAS minimum pour profit = 0"
              />
            </>
          )}
          {mode === "target" && (
            <>
              <ResultRow
                label="Marge brute / commande"
                value={formatCurrency(res.grossMarginPerOrder, currency)}
                hint="Avant pub"
              />
              <ResultRow
                label="Profit net visé / commande"
                value={formatCurrency(res.desiredNetPerOrder, currency)}
              />
              <hr className="border-foreground/20 my-1" />
              <ResultRow
                label="🎯 CPA max"
                value={formatCurrency(res.maxCpa, currency)}
                emphasis={res.maxCpa > 0 ? "good" : "bad"}
                hint={
                  res.maxCpa > 0
                    ? "Dépense max par commande sur Meta/TikTok"
                    : "Impossible : ta marge brute ne couvre pas la cible"
                }
              />
              <ResultRow
                label="🎯 ROAS cible"
                value={res.targetRoas > 0 ? res.targetRoas.toFixed(2) + "x" : "—"}
                emphasis="good"
              />
              <ResultRow
                label="Break-even ROAS"
                value={res.breakEvenRoas.toFixed(2) + "x"}
                hint="ROAS minimum (profit = 0)"
              />
            </>
          )}
        </div>
      </div>

      {/* Actions : sauvegarder dans l'historique */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={async () => {
            if (!productName.trim()) {
              toast.error("Donne un nom au produit avant de sauvegarder ce calcul.");
              return;
            }
            if (!userId) {
              toast.error("Tu dois être connecté pour sauvegarder.");
              return;
            }
            const summary =
              mode === "actual"
                ? {
                    roas: res.roas,
                    netProfit: res.netProfit,
                    margePct: res.margePct,
                    breakEvenRoas: res.breakEvenRoas,
                  }
                : mode === "breakeven"
                  ? {
                      breakEvenRoas: res.breakEvenRoas,
                      targetRoas: res.targetRoas,
                      maxCpa: res.maxCpaBE,
                    }
                  : {
                      maxCpa: res.maxCpa,
                      targetRoas: res.targetRoas,
                      breakEvenRoas: res.breakEvenRoas,
                    };
            const draft: HistoryEntry = {
              id: "",
              createdAt: Date.now(),
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
              summary,
            };
            // Dédup : supprime l'ancien (même produit + même mode) en base et localement
            const dup = history.find(
              (h) => h.productName === draft.productName && h.mode === draft.mode,
            );
            if (dup) {
              await supabase.from("roas_calculations" as any).delete().eq("id", dup.id);
            }
            const { data, error } = await supabase
              .from("roas_calculations" as any)
              .insert(entryToRowInsert(draft, userId) as any)
              .select("*")
              .single();
            if (error || !data) {
              toast.error("Échec sauvegarde : " + (error?.message ?? "erreur"));
              return;
            }
            const saved = rowToEntry(data as unknown as DbRow);
            setHistory([saved, ...history.filter((h) => h.id !== dup?.id)]);
            setJustSavedId(saved.id);
            setTimeout(() => setJustSavedId(null), 1500);
          }}
          className="brutal-border bg-foreground text-background px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-accent hover:border-accent"
        >
          {justSavedId ? "✓ Sauvegardé" : "💾 Sauvegarder ce calcul"}
        </button>
        {history.length > 0 && (
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Vider tout l'historique ?")) return;
              if (!userId) return;
              const { error } = await supabase
                .from("roas_calculations" as any)
                .delete()
                .eq("user_id", userId);
              if (error) {
                toast.error("Échec : " + error.message);
                return;
              }
              setHistory([]);
            }}
            className="brutal-border-thin px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
          >
            Vider l'historique
          </button>
        )}
      </div>


      {/* Historique */}
      {history.length > 0 && (
        <div className="mt-6 brutal-border p-5 md:p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              📂 Historique ({history.length})
            </h2>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Synchronisé avec ton compte
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((h) => {
              const rentable =
                h.mode === "actual"
                  ? (h.summary.netProfit ?? 0) >= 0
                  : h.mode === "breakeven"
                    ? (h.summary.breakEvenRoas ?? 0) > 0
                    : (h.summary.maxCpa ?? 0) > 0;
              return (
                <div
                  key={h.id}
                  className="brutal-border-thin p-3 flex flex-col gap-2 hover:border-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-black tracking-tight truncate">
                        {h.productName}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        {h.mode === "actual"
                          ? "ROAS actuel"
                          : h.mode === "breakeven"
                            ? "Break-Even"
                            : "CPA max"}{" "}
                        · {h.currency} ·{" "}
                        {new Date(h.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                        rentable
                          ? "bg-[#16a34a] text-white"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {h.mode === "breakeven" ? "BE" : rentable ? "OK" : "KO"}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {h.mode === "actual" && (
                      <>
                        ROAS {(h.summary.roas ?? 0).toFixed(2)}x · Profit{" "}
                        {formatCurrency(h.summary.netProfit ?? 0, h.currency)}
                      </>
                    )}
                    {h.mode === "breakeven" && (
                      <>
                        BE ROAS {(h.summary.breakEvenRoas ?? 0).toFixed(2)}x · Target{" "}
                        {(h.summary.targetRoas ?? 0).toFixed(2)}x
                      </>
                    )}
                    {h.mode === "target" && (
                      <>
                        CPA max {formatCurrency(h.summary.maxCpa ?? 0, h.currency)}{" "}
                        · ROAS cible {(h.summary.targetRoas ?? 0).toFixed(2)}x
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => {
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
                        const hasAdvanced =
                          (Number(h.shipping) || 0) > 0 ||
                          (Number(h.otherFees) || 0) > 0 ||
                          (Number(h.transactionPct) || 0) > 0;
                        if (hasAdvanced) setShowAdvanced(true);
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="flex-1 brutal-border-thin px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
                    >
                      Recharger
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const prev = history;
                        setHistory(prev.filter((x) => x.id !== h.id));
                        const { error } = await supabase
                          .from("roas_calculations" as any)
                          .delete()
                          .eq("id", h.id);
                        if (error) {
                          setHistory(prev);
                          toast.error("Échec suppression : " + error.message);
                        }
                      }}

                      className="brutal-border-thin px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-accent-foreground hover:border-accent"
                      aria-label="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 brutal-border-thin p-4 text-xs font-mono leading-relaxed text-muted-foreground">
        <strong className="text-foreground uppercase tracking-widest">À savoir :</strong>{" "}
        Ce calculateur fait des projections. Pour suivre ta rentabilité réelle au quotidien,
        crée un produit et fais une saisie dans Netodash — tu auras dashboard, alertes et
        coach IA en bonus.
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest font-bold mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "0.01" : undefined}
        className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
      />
      {hint && (
        <p className="text-[10px] font-mono text-muted-foreground mt-1">{hint}</p>
      )}
    </label>
  );
}

function ResultRow({
  label,
  value,
  hint,
  emphasis,
}: {
  label: string;
  value: string;
  hint?: string;
  emphasis?: "good" | "bad";
}) {
  const color =
    emphasis === "good"
      ? "text-foreground"
      : emphasis === "bad"
        ? "text-accent"
        : "text-foreground";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div>
        <div className="text-xs uppercase tracking-widest font-bold">{label}</div>
        {hint && <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <div className={`text-xl md:text-2xl font-black tabular ${color}`}>{value}</div>
    </div>
  );
}
