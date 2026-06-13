/**
 * Zones de livraison COD : Dakar / Régions / Hors-pays, avec coût et taux livraison.
 */
export function CodZones() {
  const zones = [
    {
      name: "DAKAR & banlieue",
      flag: "🏙",
      cost: "1 500 F",
      rate: "78 %",
      cmd: "186",
      verdict: "ZONE WINNER",
      tone: "accent" as const,
      note: "Coursier rapide, faible retour. C'est ta zone à scaler.",
    },
    {
      name: "RÉGIONS (Thiès, Saint-Louis…)",
      flag: "🛣",
      cost: "3 500 F",
      rate: "58 %",
      cmd: "84",
      verdict: "À OPTIMISER",
      tone: "warn" as const,
      note: "Coût × 2. Sélectionne mieux tes leads avant d'envoyer.",
    },
    {
      name: "HORS-PAYS (Mali, Mauritanie…)",
      flag: "✈",
      cost: "6 800 F",
      rate: "31 %",
      cmd: "30",
      verdict: "À COUPER",
      tone: "kill" as const,
      note: "Tu finances de la logistique perdue. Coupe ou pré-paiement uniquement.",
    },
  ];

  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
          ▍ ZONES DE LIVRAISON
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl">
          CHAQUE ZONE A SON COÛT. <br />
          <span className="text-accent">CHAQUE ZONE A SA MARGE.</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">
          Définis tes zones (Dakar, régions, hors-pays). Netodash impute chaque
          livraison à sa zone et te dit où ton cash s'évapore. Le différenciant
          n°1 vs un Google Sheet.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {zones.map((z) => {
            const border =
              z.tone === "accent"
                ? "border-accent"
                : z.tone === "kill"
                  ? "border-foreground"
                  : "";
            const badge =
              z.tone === "accent"
                ? "bg-accent text-accent-foreground border-accent"
                : z.tone === "kill"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background";
            return (
              <div
                key={z.name}
                className={`brutal-border ${border} p-6 bg-background flex flex-col`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{z.flag}</span>
                  <span
                    className={`brutal-border-thin px-2.5 py-1 text-[10px] font-black tracking-widest ${badge}`}
                  >
                    {z.verdict}
                  </span>
                </div>
                <div className="font-black text-lg tracking-tight uppercase mb-4">
                  {z.name}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Stat label="Coût" value={z.cost} accent={z.tone === "kill"} />
                  <Stat label="Livraison" value={z.rate} accent={z.tone === "accent"} />
                  <Stat label="Cmd/mois" value={z.cmd} />
                </div>

                <p className="font-mono text-xs text-muted-foreground leading-relaxed mt-auto">
                  {z.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="brutal-border-thin p-2 text-center">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
        {label}
      </div>
      <div
        className={`text-base font-black tracking-tight tabular ${accent ? "text-accent" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
