/**
 * Funnel COD visuel : Reçues → Confirmées → Livrées → Payées (FCFA).
 * Sert à expliquer en un coup d'œil ce que Netodash mesure dans le COD.
 */
export function CodFunnel() {
  const steps = [
    {
      n: "300",
      label: "Commandes reçues",
      hint: "Site / formulaire / pub",
      rate: "100 %",
      tone: "neutral" as const,
    },
    {
      n: "186",
      label: "Confirmées au closing",
      hint: "Appel agent · 62 %",
      rate: "62 %",
      tone: "neutral" as const,
    },
    {
      n: "121",
      label: "Livrées + encaissées",
      hint: "Coursier paie cash · 65 %",
      rate: "65 %",
      tone: "accent" as const,
    },
    {
      n: "3,8 M F",
      label: "Cash réellement encaissé",
      hint: "Net en FCFA · livraisons OK",
      rate: "",
      tone: "dark" as const,
    },
  ];

  return (
    <section className="brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-14 md:py-24">
        <div className="text-xs uppercase tracking-widest text-accent font-bold mb-3">
          ▍ LE VRAI FUNNEL COD
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter max-w-4xl">
          DE LA COMMANDE REÇUE <br />
          <span className="text-accent">AU CASH EN POCHE.</span>
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">
          En COD, 300 commandes ne veulent rien dire. Ce qui compte c'est ce que
          ton coursier ramène. Netodash mesure chaque étape, par produit, par
          zone, par jour.
        </p>

        <div className="grid md:grid-cols-4 gap-4 md:gap-3 mt-12">
          {steps.map((s, i) => (
            <div key={s.label} className="relative">
              <div
                className={`brutal-border h-full p-6 flex flex-col ${
                  s.tone === "accent"
                    ? "bg-accent/10 border-accent"
                    : s.tone === "dark"
                      ? "bg-foreground text-background"
                      : "bg-background"
                }`}
              >
                <div
                  className={`text-[10px] font-mono uppercase tracking-widest font-bold mb-2 ${
                    s.tone === "dark" ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  ÉTAPE {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className={`text-5xl md:text-6xl font-black tracking-tighter ${
                    s.tone === "accent" ? "text-accent" : ""
                  }`}
                >
                  {s.n}
                </div>
                <div className="font-black uppercase tracking-tight text-base mt-2">
                  {s.label}
                </div>
                <div
                  className={`mt-1 text-xs font-mono ${
                    s.tone === "dark" ? "text-background/60" : "text-muted-foreground"
                  }`}
                >
                  {s.hint}
                </div>
                {s.rate && (
                  <div
                    className={`mt-auto pt-4 text-[10px] uppercase tracking-widest font-black ${
                      s.tone === "accent" ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    Taux : {s.rate}
                  </div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-accent font-black text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-xs md:text-sm text-muted-foreground max-w-3xl">
          → 300 reçues, mais{" "}
          <span className="text-foreground font-bold">121 livrées</span>. C'est
          ça que ton banquier voit. NETODASH te dit pourquoi les 179 autres ne
          sont pas passées — et quel produit / quelle zone est responsable.
        </p>
      </div>
    </section>
  );
}
