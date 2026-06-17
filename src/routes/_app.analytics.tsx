import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { useActiveMode } from "@/lib/use-active-mode";
import { Paywall } from "@/components/Paywall";
import { PeriodPicker, type Preset, type CustomRange } from "@/components/PeriodPicker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/analytics/OverviewTab";
import { ProductRankingTab } from "@/components/analytics/ProductRankingTab";
import { ProfitBreakdownTab } from "@/components/analytics/ProfitBreakdownTab";
import { TrendsTab } from "@/components/analytics/TrendsTab";
import { BreakEvenTab } from "@/components/analytics/BreakEvenTab";
import { InsightsTab } from "@/components/analytics/InsightsTab";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({
    meta: [{ title: "Analytics Pro — NETODASH" }],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { user } = useAuth();
  const sub = useSubscription(user?.id);
  const { mode, currency } = useActiveMode();
  const [preset, setPreset] = useState<Preset>("7d");
  const [customRange, setCustomRange] = useState<CustomRange>(null);

  if (sub.loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Chargement…
        </div>
      </div>
    );
  }

  if (mode === "cod") {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            ANALYTICS PRO · MODE COD
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">METRICS</h1>
        </div>
        <div className="brutal-border p-6 md:p-8 bg-muted/30">
          <p className="font-mono text-sm text-muted-foreground max-w-2xl">
            Analytics Pro est réservé au mode <strong className="text-foreground">Dropshipping</strong> (plan Scale
            $79). En mode COD, utilise le dashboard basique (7j / 30j) inclus dans ton plan.
          </p>
        </div>
      </div>
    );
  }

  if (!sub.hasAnalyticsAccess) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            ANALYTICS PRO · ACCÈS BLOQUÉ
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">
            METRICS
          </h1>
        </div>
        <Paywall variant="analytics" trialDaysLeft={sub.trialDaysLeft} />
      </div>
    );
  }

  const modeLabel = (mode as string) === "cod" ? "MODE COD · FCFA" : "MODE DROPSHIPPING · " + currency;
  const modeHint =
    (mode as string) === "cod"
      ? "Analyses calibrées pour ton activité COD : taux de livraison, coût/commande livrée, marge nette après retours et frais courrier."
      : "Analyses calibrées pour ton activité dropshipping : € profit / € pub, ROAS vs break-even, taux de remboursement et scaling.";

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      {/* HEADER : Titre + contexte mode + sélecteur de période */}
      <div className="space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                ANALYTICS PRO
              </div>
              <span className="text-[10px] px-1.5 py-0.5 brutal-border-thin bg-accent text-accent-foreground border-accent font-mono font-bold">
                {modeLabel}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">
              METRICS
            </h1>
            <p className="text-xs md:text-sm font-mono text-muted-foreground mt-2 max-w-2xl">
              {modeHint}
            </p>
          </div>
          <PeriodPicker
            value={preset}
            onChange={setPreset}
            customRange={customRange}
            onCustomChange={setCustomRange}
          />
        </div>

        {/* Bandeau de raisonnement : explique ce que l'utilisateur va trouver */}
        <div className="brutal-border-thin p-3 bg-foreground/[0.03] text-[11px] font-mono text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
          <span><strong className="text-foreground">Vue d'ensemble</strong> · KPI + Δ vs période précédente</span>
          <span><strong className="text-foreground">Classement</strong> · score 0-100 winners/losers</span>
          <span><strong className="text-foreground">Décomposition</strong> · où part chaque {currency}</span>
          <span><strong className="text-foreground">Tendances</strong> · cohortes & heatmap</span>
          <span><strong className="text-foreground">Seuils</strong> · break-even & simulateur</span>
          <span><strong className="text-foreground">Insights</strong> · alertes auto contextuelles</span>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto justify-start gap-1 bg-transparent p-0">
          <TabTrig value="insights">🚨 Insights</TabTrig>
          <TabTrig value="overview">📊 Vue d'ensemble</TabTrig>
          <TabTrig value="ranking">🏆 Classement</TabTrig>
          <TabTrig value="breakdown">💰 Décomposition</TabTrig>
          <TabTrig value="trends">📈 Tendances</TabTrig>
          <TabTrig value="breakeven">🎯 Seuils & Simu</TabTrig>
        </TabsList>

        <TabsContent value="insights"><InsightsTab preset={preset} customRange={customRange} /></TabsContent>
        <TabsContent value="overview"><OverviewTab preset={preset} customRange={customRange} /></TabsContent>
        <TabsContent value="ranking"><ProductRankingTab preset={preset} customRange={customRange} /></TabsContent>
        <TabsContent value="breakdown"><ProfitBreakdownTab preset={preset} customRange={customRange} /></TabsContent>
        <TabsContent value="trends"><TrendsTab preset={preset} customRange={customRange} /></TabsContent>
        <TabsContent value="breakeven"><BreakEvenTab preset={preset} customRange={customRange} /></TabsContent>
      </Tabs>
    </div>
  );
}

function TabTrig({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background border-foreground/30"
    >
      {children}
    </TabsTrigger>
  );
}

