import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { formatCurrency } from "@/lib/calc";

type Mode = "breakeven" | "actual" | "target";
type Currency = "EUR" | "USD" | "GBP" | "XOF";

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "EUR", label: "EUR €" },
  { code: "USD", label: "USD $" },
  { code: "GBP", label: "GBP £" },
  { code: "XOF", label: "FCFA" },
];

export function PublicRoasCalculator({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<Mode>("breakeven");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [productName, setProductName] = useState("");
  const [salePrice, setSalePrice] = useState("45");
  const [costPrice, setCostPrice] = useState("13");
  const [adSpend, setAdSpend] = useState("100");
  const [orders, setOrders] = useState("5");
  const [targetMargin, setTargetMargin] = useState("10");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shipping, setShipping] = useState("0");
  const [otherFees, setOtherFees] = useState("0");
  const [transactionPct, setTransactionPct] = useState("0");

  const n = (v: string) => (v === "" ? 0 : Number(v));

  const res = useMemo(() => {
    const sale = n(salePrice);
    const cost = n(costPrice);
    const ship = n(shipping);
    const other = n(otherFees);
    const txPct = n(transactionPct);
    const ad = n(adSpend);
    const ord = n(orders);
    const variablePerOrder = cost + ship + other;
    const grossMarginPerOrder = sale - variablePerOrder - sale * (txPct / 100);
    const beDen = sale * (1 - txPct / 100) - variablePerOrder;
    const breakEvenRoas = beDen > 0 ? sale / beDen : 0;
    const desiredNetPerOrder = sale * (n(targetMargin) / 100);
    const maxCpaTarget = grossMarginPerOrder - desiredNetPerOrder;
    const targetRoas = maxCpaTarget > 0 ? sale / maxCpaTarget : 0;
    const revenue = sale * ord;
    const transactionFees = revenue * (txPct / 100);
    const totalCosts = variablePerOrder * ord + transactionFees + ad;
    const netProfit = revenue - totalCosts;
    const roas = ad > 0 ? revenue / ad : 0;
    const cpa = ord > 0 ? ad / ord : 0;
    const margePct = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      breakEvenRoas,
      targetRoas,
      grossMarginPerOrder,
      maxCpaBE: beDen,
      maxCpaTarget,
      desiredNetPerOrder,
      revenue,
      totalCosts,
      netProfit,
      roas,
      cpa,
      margePct,
    };
  }, [salePrice, costPrice, shipping, otherFees, transactionPct, adSpend, orders, targetMargin]);

  return (
    <div className="w-full">
      {!compact && (
        <div className="mb-6 md:mb-8">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            OUTIL — Pour COD & Dropshipping
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">
            ROAS CALCULATOR
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Calcule ton Break-Even ROAS, ton ROAS actuel et ton CPA max avec les données essentielles.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Calculateurs ROAS">
        <ModeButton active={mode === "breakeven"} onClick={() => setMode("breakeven")}>⚖ Break-Even ROAS</ModeButton>
        <ModeButton active={mode === "actual"} onClick={() => setMode("actual")}>📊 Calculer mon ROAS actuel</ModeButton>
        <ModeButton active={mode === "target"} onClick={() => setMode("target")}>🎯 Trouver mon CPA max</ModeButton>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <form className="brutal-border p-6 grid gap-4 bg-background" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
            <Field label="Produit (optionnel)" value={productName} onChange={setProductName} />
            <label className="block">
              <div className="text-xs uppercase tracking-widest font-bold mb-2">Devise</div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full bg-background brutal-border-thin px-3 py-3 font-mono focus:border-accent focus:border-2 outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={`Prix de vente (${currency})`} type="number" value={salePrice} onChange={setSalePrice} />
            <Field label={`Coût produit (${currency})`} type="number" value={costPrice} onChange={setCostPrice} />
            {mode === "actual" && (
              <>
                <Field label={`Dépense pub totale (${currency})`} type="number" value={adSpend} onChange={setAdSpend} />
                <Field label="Nombre de commandes" type="number" value={orders} onChange={setOrders} />
              </>
            )}
            {(mode === "target" || mode === "breakeven") && (
              <Field
                label={mode === "target" ? "Marge nette cible (%)" : "Marge nette visée (%) — optionnel"}
                type="number"
                value={targetMargin}
                onChange={setTargetMargin}
                hint="Ex : 10% ou 20% du chiffre d'affaires"
              />
            )}
          </div>

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
              <div className="grid sm:grid-cols-3 gap-4 p-4 border-t border-foreground/20">
                <Field label={`Expédition / cmd (${currency})`} type="number" value={shipping} onChange={setShipping} />
                <Field label={`Frais cachés / cmd (${currency})`} type="number" value={otherFees} onChange={setOtherFees} />
                <Field label="Frais transaction (%)" type="number" value={transactionPct} onChange={setTransactionPct} />
              </div>
            )}
          </div>
        </form>

        <div className="brutal-border p-6 grid gap-3 bg-foreground/[0.02]">
          <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Résultat</div>
          {mode === "breakeven" && (
            <>
              <ResultRow label="⚖ Break-Even ROAS" value={res.breakEvenRoas > 0 ? `${res.breakEvenRoas.toFixed(2)}x` : "—"} emphasis="good" hint="ROAS minimum pour ne pas perdre d'argent" />
              <ResultRow label="🎯 Target ROAS" value={res.targetRoas > 0 ? `${res.targetRoas.toFixed(2)}x` : "—"} hint={`Pour viser ${n(targetMargin) || 0}% de marge nette`} />
              <hr className="border-foreground/20 my-1" />
              <ResultRow label="Marge brute / commande" value={formatCurrency(res.grossMarginPerOrder, currency)} />
              <ResultRow label="CPA max break-even" value={formatCurrency(res.maxCpaBE, currency)} />
            </>
          )}
          {mode === "actual" && (
            <>
              <ResultRow label="ROAS" value={`${res.roas.toFixed(2)}x`} emphasis={res.roas >= res.breakEvenRoas ? "good" : "bad"} hint={res.roas >= res.breakEvenRoas ? "Rentable" : "Sous le seuil de rentabilité"} />
              <ResultRow label="Profit net" value={formatCurrency(res.netProfit, currency)} emphasis={res.netProfit >= 0 ? "good" : "bad"} />
              <ResultRow label="Marge nette (%)" value={`${res.margePct.toFixed(1)}%`} emphasis={res.margePct >= 0 ? "good" : "bad"} />
              <hr className="border-foreground/20 my-1" />
              <ResultRow label="CA total" value={formatCurrency(res.revenue, currency)} />
              <ResultRow label="CPA actuel" value={formatCurrency(res.cpa, currency)} />
              <ResultRow label="Break-even ROAS" value={res.breakEvenRoas > 0 ? `${res.breakEvenRoas.toFixed(2)}x` : "—"} />
            </>
          )}
          {mode === "target" && (
            <>
              <ResultRow label="Marge brute / commande" value={formatCurrency(res.grossMarginPerOrder, currency)} />
              <ResultRow label="Profit net visé / commande" value={formatCurrency(res.desiredNetPerOrder, currency)} />
              <hr className="border-foreground/20 my-1" />
              <ResultRow label="🎯 CPA max" value={res.maxCpaTarget > 0 ? formatCurrency(res.maxCpaTarget, currency) : "Impossible"} emphasis={res.maxCpaTarget > 0 ? "good" : "bad"} />
              <ResultRow label="🎯 ROAS cible" value={res.targetRoas > 0 ? `${res.targetRoas.toFixed(2)}x` : "—"} emphasis="good" />
              <ResultRow label="Break-even ROAS" value={res.breakEvenRoas > 0 ? `${res.breakEvenRoas.toFixed(2)}x` : "—"} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${
        active ? "bg-foreground text-background border-foreground" : "hover:bg-foreground hover:text-background"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, type = "text", hint }: { label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string }) {
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
      {hint && <p className="text-[10px] font-mono text-muted-foreground mt-1">{hint}</p>}
    </label>
  );
}

function ResultRow({ label, value, hint, emphasis }: { label: string; value: string; hint?: string; emphasis?: "good" | "bad" }) {
  const color = emphasis === "bad" ? "text-accent" : "text-foreground";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div>
        <div className="text-xs uppercase tracking-widest font-bold">{label}</div>
        {hint && <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <div className={`text-xl md:text-2xl font-black tabular text-right ${color}`}>{value}</div>
    </div>
  );
}