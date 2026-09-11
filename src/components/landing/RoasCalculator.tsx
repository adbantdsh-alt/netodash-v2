import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/calc";

/**
 * Calculateur de marge CopyX pour la landing.
 *
 * Modèle CopyX : les clients paient soit un acompte, soit la totalité, encaissés
 * via XaalipSay (5 % de frais à l'encaissement, retrait gratuit). Le calculateur
 * montre donc deux
 * chiffres que personne ne suit : ce qui est DÉJÀ ENCAISSÉ et ce qui RESTE À
 * ENCAISSER à la livraison — puis la marge nette réelle en FCFA.
 */
export function RoasCalculator() {
  const [revenue, setRevenue] = useState(7_500_000);
  const [depositShare, setDepositShare] = useState(40);
  const [depositRate, setDepositRate] = useState(30);
  const [adSpend, setAdSpend] = useState(3_120_000);
  const [cogsPct, setCogsPct] = useState(32);
  const [momoPct, setMomoPct] = useState(5);
  const [adTaxPct, setAdTaxPct] = useState(18);

  const out = useMemo(() => {
    const cogs = (revenue * cogsPct) / 100;
    const adTax = (adSpend * adTaxPct) / 100;
    // Part du CA encaissée tout de suite : paiements intégraux + acomptes.
    const collected = revenue * ((100 - depositShare) / 100 + (depositShare / 100) * (depositRate / 100));
    const outstanding = revenue - collected;
    const momoFees = (collected * momoPct) / 100;
    const totalCosts = cogs + adSpend + adTax + momoFees;
    const profit = revenue - totalCosts;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const roasMeta = adSpend > 0 ? revenue / adSpend : 0;
    const roasNetCollected = adSpend + adTax > 0 ? collected / (adSpend + adTax) : 0;
    return {
      cogs, adTax, adSpend, momoFees, collected, outstanding, totalCosts, profit, margin,
      roasMeta, roasNetCollected,
    };
  }, [revenue, depositShare, depositRate, adSpend, cogsPct, momoPct, adTaxPct]);

  const profitable = out.profit > 0;
  const fmt = (n: number) => formatCurrency(n, "XOF");

  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24">
        <div className="text-xs uppercase tracking-widest text-accent font-bold mb-3">
          ▍ CALCULATEUR DE MARGE COPYX · LIVE
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl">
          BOUGE LES SLIDERS. <br />
          <span className="text-accent">VOIS CE QUE TU GARDES VRAIMENT.</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">
          Sur ta boutique CopyX, une partie des clients paie un acompte et l'autre
          paie tout de suite — tout est encaissé via XaalipSay. Mets tes vrais
          chiffres : on sépare ce qui est encaissé de ce qui reste à encaisser,
          puis on calcule ta marge nette après pub, COGS, livraison et les 5 % de
          frais d'encaissement.
        </p>

        <div className="grid lg:grid-cols-5 gap-6 mt-12">
          {/* Sliders */}
          <div className="lg:col-span-3 brutal-border p-6 md:p-8 bg-background space-y-7">
            <SliderRow
              label="Ventes CopyX (30j)"
              value={revenue}
              min={600_000}
              max={60_000_000}
              step={300_000}
              format={fmt}
              onChange={setRevenue}
            />
            <SliderRow
              label="Clients qui paient un acompte"
              value={depositShare}
              min={0}
              max={100}
              step={5}
              format={(v) => v + " %"}
              onChange={setDepositShare}
              hint="Le reste paie la totalité, encaissée via XaalipSay"
            />
            <SliderRow
              label="Montant de l'acompte"
              value={depositRate}
              min={5}
              max={100}
              step={5}
              format={(v) => v + " %"}
              onChange={setDepositRate}
              hint="Souvent 30 % à la commande, le solde à la livraison"
            />
            <SliderRow
              label="Budget pub (Meta / TikTok / Google)"
              value={adSpend}
              min={300_000}
              max={30_000_000}
              step={150_000}
              format={fmt}
              onChange={setAdSpend}
            />
            <SliderRow
              label="COGS + livraison (% du CA)"
              value={cogsPct}
              min={10}
              max={70}
              step={1}
              format={(v) => v + " %"}
              onChange={setCogsPct}
            />
            <SliderRow
              label="Frais XaalipSay (% de l'encaissement)"
              value={momoPct}
              min={0}
              max={10}
              step={0.5}
              format={(v) => v.toFixed(1) + " %"}
              onChange={setMomoPct}
              hint="5 % à l'encaissement · retrait gratuit"
            />
            <SliderRow
              label="Taxe pub Meta (% du budget)"
              value={adTaxPct}
              min={0}
              max={25}
              step={1}
              format={(v) => v + " %"}
              onChange={setAdTaxPct}
              hint="≈ 18 % au Sénégal, 0 % dans certains pays"
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
                    {out.roasNetCollected.toFixed(2)}x
                  </div>
                  <div className={`text-[10px] uppercase tracking-widest ${profitable ? "text-muted-foreground" : "text-background/70"}`}>
                    ROAS net sur encaissé
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
                  Marge nette 30j
                </div>
                <div className="text-3xl md:text-4xl font-black tracking-tighter mt-1 tabular">
                  {out.profit >= 0 ? fmt(out.profit) : "− " + fmt(-out.profit)}
                </div>
              </div>
            </div>

            <div className="brutal-border-thin p-4 font-mono text-[11px] text-muted-foreground space-y-1">
              <Line k="Encaissé maintenant" v={fmt(out.collected)} />
              <Line k="Reste à encaisser (livraison)" v={fmt(out.outstanding)} />
              <Line k="− COGS + livraison" v={"− " + fmt(out.cogs)} />
              <Line k="− Pub + taxe Meta" v={"− " + fmt(out.adSpend + out.adTax)} />
              <Line k="− Frais XaalipSay" v={"− " + fmt(out.momoFees)} />
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
