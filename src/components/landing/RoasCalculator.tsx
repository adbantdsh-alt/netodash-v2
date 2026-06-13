import { useState, useMemo } from "react";

/**
 * Calculateur ROAS net interactif pour la landing Dropshipping.
 * 4 sliders : CA Shopify, Budget Ads, COGS+fulfillment, Taxes pub (Meta 18%).
 * Sort en live : ROAS Meta affiché vs ROAS net réel + marge nette.
 */
export function RoasCalculator() {
  const [revenue, setRevenue] = useState(12000);
  const [adSpend, setAdSpend] = useState(5000);
  const [cogsPct, setCogsPct] = useState(32);
  const [adTaxPct, setAdTaxPct] = useState(18);

  const out = useMemo(() => {
    const cogs = (revenue * cogsPct) / 100;
    const adTax = (adSpend * adTaxPct) / 100;
    const stripe = revenue * 0.029 + 30;
    const refunds = revenue * 0.04;
    const cashIn = revenue - stripe - refunds;
    const totalCosts = cogs + adSpend + adTax;
    const profit = cashIn - totalCosts;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const roasMeta = adSpend > 0 ? revenue / adSpend : 0;
    const roasNet = adSpend > 0 ? cashIn / (adSpend + adTax) : 0;
    return { cogs, adTax, stripe, refunds, cashIn, profit, margin, roasMeta, roasNet };
  }, [revenue, adSpend, cogsPct, adTaxPct]);

  const profitable = out.profit > 0;
  const fmt = (n: number) =>
    "$" + Math.round(n).toLocaleString("en-US");

  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24">
        <div className="text-xs uppercase tracking-widest text-accent font-bold mb-3">
          ▍ ROAS NET CALCULATOR · LIVE
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl">
          BOUGE LES SLIDERS. <br />
          <span className="text-accent">VOIS CE QUE TU GARDES VRAIMENT.</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">
          Le ROAS Meta dit une chose. Ta banque dit autre chose. Joue avec ton CA,
          ton budget pub et ton COGS — on calcule la marge nette réelle, après
          taxes pub, frais Stripe et refunds.
        </p>

        <div className="grid lg:grid-cols-5 gap-6 mt-12">
          {/* Sliders */}
          <div className="lg:col-span-3 brutal-border p-6 md:p-8 bg-background space-y-7">
            <SliderRow
              label="CA Shopify (30j)"
              value={revenue}
              min={1000}
              max={100000}
              step={500}
              format={fmt}
              onChange={setRevenue}
            />
            <SliderRow
              label="Budget pub (Meta / TikTok / Google)"
              value={adSpend}
              min={500}
              max={50000}
              step={250}
              format={fmt}
              onChange={setAdSpend}
            />
            <SliderRow
              label="COGS + fulfillment (% du CA)"
              value={cogsPct}
              min={10}
              max={70}
              step={1}
              format={(v) => v + " %"}
              onChange={setCogsPct}
            />
            <SliderRow
              label="Taxe pub Meta (% du budget)"
              value={adTaxPct}
              min={0}
              max={25}
              step={1}
              format={(v) => v + " %"}
              onChange={setAdTaxPct}
              hint="≈ 18 % au Sénégal, 0 % aux US"
            />
          </div>

          {/* Output */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="brutal-border p-6 bg-muted/30">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Ce que Meta t'affiche
              </div>
              <div className="text-5xl font-black tracking-tighter mt-1 line-through opacity-60">
                {out.roasMeta.toFixed(2)}x
              </div>
              <div className="text-xs text-muted-foreground mt-1">ROAS affiché</div>
            </div>

            <div
              className={`brutal-border p-6 ${profitable ? "border-accent bg-accent/5" : "border-foreground bg-foreground text-background"}`}
            >
              <div
                className={`text-[10px] font-mono uppercase tracking-widest font-bold ${profitable ? "text-accent" : "text-background/70"}`}
              >
                Ta réalité
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <div className={`text-4xl md:text-5xl font-black tracking-tighter ${profitable ? "text-accent" : "text-background"}`}>
                    {out.roasNet.toFixed(2)}x
                  </div>
                  <div className={`text-[10px] uppercase tracking-widest ${profitable ? "text-muted-foreground" : "text-background/70"}`}>
                    ROAS net réel
                  </div>
                </div>
                <div>
                  <div className={`text-4xl md:text-5xl font-black tracking-tighter ${profitable ? "" : "text-background"}`}>
                    {out.margin.toFixed(1)}%
                  </div>
                  <div className={`text-[10px] uppercase tracking-widest ${profitable ? "text-muted-foreground" : "text-background/70"}`}>
                    Marge nette
                  </div>
                </div>
              </div>
              <div className={`mt-5 pt-5 border-t ${profitable ? "border-foreground/20" : "border-background/30"}`}>
                <div className={`text-[10px] uppercase tracking-widest font-bold ${profitable ? "text-muted-foreground" : "text-background/70"}`}>
                  Profit net 30j
                </div>
                <div className="text-3xl md:text-4xl font-black tracking-tighter mt-1 tabular">
                  {out.profit >= 0 ? fmt(out.profit) : "− " + fmt(-out.profit)}
                </div>
              </div>
            </div>

            <div className="brutal-border-thin p-4 font-mono text-[11px] text-muted-foreground space-y-1">
              <Line k="− COGS / fulfillment" v={"− " + fmt(out.cogs)} />
              <Line k="− Taxe pub" v={"− " + fmt(out.adTax)} />
              <Line k="− Frais Stripe" v={"− " + fmt(out.stripe)} />
              <Line k="− Refunds (~4%)" v={"− " + fmt(out.refunds)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <label className="text-sm font-bold uppercase tracking-wide">{label}</label>
        <span className="font-mono font-black text-lg tabular text-accent">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[color:var(--accent)] cursor-pointer"
      />
      {hint && (
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
          {hint}
        </div>
      )}
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span>{k}</span>
      <span className="font-black tabular">{v}</span>
    </div>
  );
}
