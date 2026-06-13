import { useState, useMemo } from "react";

/**
 * Calculateur "Combien tu gagnes vraiment par commande COD".
 * Inputs : prix vente, COGS, livraison zone, taux de livraison, dépense pub par cmd.
 */
export function CodProfitCalculator() {
  const [price, setPrice] = useState(15000);
  const [cogs, setCogs] = useState(4500);
  const [delivery, setDelivery] = useState(2000);
  const [deliveryRate, setDeliveryRate] = useState(60);
  const [adPerOrder, setAdPerOrder] = useState(1800);

  const out = useMemo(() => {
    const rate = deliveryRate / 100;
    // Pour 100 commandes confirmées :
    const delivered = 100 * rate;
    const undelivered = 100 - delivered;

    const grossPerDelivered = price - cogs - delivery;
    // Les non-livrées coûtent quand même la livraison (aller) et la pub
    const undeliveredCost = undelivered * (delivery * 0.5 + adPerOrder);
    const deliveredAds = delivered * adPerOrder;
    const totalNet = delivered * grossPerDelivered - deliveredAds - undeliveredCost;
    const netPerOrder100 = totalNet / 100;
    const margin = price > 0 ? (netPerOrder100 / price) * 100 : 0;
    return { netPerOrder100, margin, grossPerDelivered, totalNet, delivered };
  }, [price, cogs, delivery, deliveryRate, adPerOrder]);

  const profitable = out.netPerOrder100 > 0;
  const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR") + " F";

  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24">
        <div className="text-xs uppercase tracking-widest text-accent font-bold mb-3">
          ▍ CALCULATEUR PROFIT COD · LIVE
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl">
          COMBIEN TU GAGNES <br />
          <span className="text-accent">PAR COMMANDE EN VRAI ?</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">
          On te montre le profit net moyen par commande — en intégrant les
          livraisons qui ne sont jamais payées. Ajuste tes chiffres pour voir si
          ton produit tient la route.
        </p>

        <div className="grid lg:grid-cols-5 gap-6 mt-12">
          <div className="lg:col-span-3 brutal-border p-6 md:p-8 bg-background space-y-7">
            <Slider label="Prix de vente client" value={price} min={3000} max={50000} step={500} fmt={fmt} onChange={setPrice} />
            <Slider label="COGS (produit + emballage)" value={cogs} min={500} max={20000} step={250} fmt={fmt} onChange={setCogs} />
            <Slider label="Livraison (zone moyenne)" value={delivery} min={500} max={8000} step={250} fmt={fmt} onChange={setDelivery} />
            <Slider label="Pub par commande confirmée" value={adPerOrder} min={0} max={6000} step={100} fmt={fmt} onChange={setAdPerOrder} />
            <Slider label="Taux de livraison" value={deliveryRate} min={20} max={90} step={1} fmt={(v) => v + " %"} onChange={setDeliveryRate} hint="Sur les commandes confirmées" />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="brutal-border p-6 bg-muted/30">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Marge brute par livrée
              </div>
              <div className="text-5xl font-black tracking-tighter mt-1 line-through opacity-60 tabular">
                {fmt(out.grossPerDelivered)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Avant pub et non-livrées
              </div>
            </div>

            <div
              className={`brutal-border p-6 ${profitable ? "border-accent bg-accent/5" : "border-foreground bg-foreground text-background"}`}
            >
              <div
                className={`text-[10px] font-mono uppercase tracking-widest font-bold ${profitable ? "text-accent" : "text-background/70"}`}
              >
                Ta réalité par commande confirmée
              </div>
              <div className={`text-5xl md:text-6xl font-black tracking-tighter mt-2 tabular ${profitable ? "text-accent" : "text-background"}`}>
                {out.netPerOrder100 >= 0 ? fmt(out.netPerOrder100) : "− " + fmt(-out.netPerOrder100)}
              </div>
              <div className={`text-[10px] uppercase tracking-widest mt-1 ${profitable ? "text-muted-foreground" : "text-background/70"}`}>
                Profit net moyen
              </div>
              <div className={`mt-5 pt-5 border-t ${profitable ? "border-foreground/20" : "border-background/30"} text-2xl md:text-3xl font-black tabular`}>
                {out.margin.toFixed(1)}%
                <span className={`block text-[10px] uppercase tracking-widest font-bold ${profitable ? "text-muted-foreground" : "text-background/70"} mt-1`}>
                  Marge nette / prix de vente
                </span>
              </div>
            </div>

            <div className="brutal-border-thin p-4 font-mono text-[11px] text-muted-foreground space-y-1">
              <div className="flex justify-between"><span>Livrées sur 100 confirmées</span><span className="font-black">{out.delivered.toFixed(0)}</span></div>
              <div className="flex justify-between"><span>Total net pour 100 cmd</span><span className="font-black tabular">{fmt(out.totalNet)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label, value, min, max, step, fmt, onChange, hint,
}: {
  label: string; value: number; min: number; max: number; step: number;
  fmt: (v: number) => string; onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <label className="text-sm font-bold uppercase tracking-wide">{label}</label>
        <span className="font-mono font-black text-lg tabular text-accent">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
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
