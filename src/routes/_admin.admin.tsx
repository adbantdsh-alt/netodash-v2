import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getAdminOverview } from "@/lib/admin/overview.functions";
import { getSupabaseAuthHeaders } from "@/lib/admin/auth-headers";

export const Route = createFileRoute("/_admin/admin")({
  ssr: false,
  component: AdminRouteContent,
});

function AdminRouteContent() {
  const location = useLocation();
  if (location.pathname !== "/admin") return <Outlet />;
  return <AdminOverview />;
}

function AdminOverview() {
  const fetchOverview = useServerFn(getAdminOverview);
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminOverview>> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const headers = await getSupabaseAuthHeaders();
        const data = await fetchOverview({ headers });
        setData(data);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Erreur");
      }
    })();
  }, [fetchOverview]);

  if (err) return <div className="admin-card">Erreur : {err}</div>;
  if (!data) return <div className="text-xs uppercase tracking-widest">Chargement…</div>;

  const fmtUsd = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const mrrSeries = data.mrrSeries12mo ?? [];
  const activity = data.activity ?? [];
  const max = Math.max(1, ...mrrSeries.map((d) => d.value));
  const growth = data.mrrGrowthPct;
  const growthLabel =
    growth === null ? "—" : growth >= 0 ? `+${growth}%` : `${growth}%`;

  return (
    <div>
      <h1 className="mb-6">Vue d'ensemble</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Kpi label="MRR réel" value={fmtUsd(data.mrr)} hint="Abonnements actifs payants" />
        <Kpi
          label="MRR mois précédent"
          value={fmtUsd(data.mrrPrevMonth)}
          hint={`Variation ${growthLabel}`}
        />
        <Kpi
          label="Croissance MRR"
          value={growthLabel}
          hint="vs fin du mois précédent"
          tone={growth !== null && growth >= 0 ? "success" : growth !== null ? "warning" : undefined}
        />
        <Kpi label="ARR" value={fmtUsd(data.arr)} hint="MRR × 12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Kpi label="Utilisateurs inscrits" value={String(data.userCounts.total)} />
        <Kpi label="Utilisateurs payants" value={String(data.userCounts.paying)} />
        <Kpi label="En trial" value={String(data.userCounts.trial)} />
        <Kpi label="Free" value={String(data.userCounts.free)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Nouveaux abonnés (mois)" value={String(data.newSubsThisMonth)} />
        <Kpi label="Churned (mois)" value={String(data.churnedThisMonth)} />
        <Kpi label="Churn rate" value={`${data.churnRatePct}%`} />
        <Kpi
          label="LTV estimée"
          value={data.ltvEstimated != null ? fmtUsd(data.ltvEstimated) : "—"}
          hint="MRR moyen / churn rate"
        />
      </div>

      <div className="admin-card mb-8">
        <h2 className="mb-3">MRR par plan</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Prix</th>
              <th>Abonnés</th>
              <th>MRR</th>
            </tr>
          </thead>
          <tbody>
            {(data.mrrByPlan ?? []).map((row) => (
              <tr key={row.plan}>
                <td className="font-bold">{row.label}</td>
                <td>${row.priceUsd}/mois</td>
                <td>{row.count}</td>
                <td>{fmtUsd(row.mrr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card mb-8">
        <h2 className="mb-3">MRR · 12 mois glissants</h2>
        <div className="flex items-end gap-1 h-40">
          {mrrSeries.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
              <div
                title={`${d.date} · ${fmtUsd(d.value)}`}
                style={{
                  width: "100%",
                  height: `${(d.value / max) * 100}%`,
                  background: d.value > 0 ? "#E05C1A" : "#eee",
                  minHeight: 2,
                }}
              />
              <span className="text-[9px] opacity-50 truncate w-full text-center">
                {d.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="mb-3">Activité récente</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Email</th>
              <th>Type</th>
              <th>Détail</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((a, i) => (
              <tr key={i}>
                <td>{new Date(a.at).toLocaleString("fr-FR")}</td>
                <td>{a.email}</td>
                <td>
                  <span
                    className="admin-badge"
                    data-tone={a.type === "signup" ? "accent" : "success"}
                  >
                    {a.type === "signup" ? "Inscription" : "Paiement"}
                  </span>
                </td>
                <td>{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "success" | "warning";
}) {
  return (
    <div className="admin-card">
      <div className="text-[10px] uppercase tracking-widest opacity-60">{label}</div>
      <div
        className="text-3xl font-black mt-2"
        style={
          tone === "success"
            ? { color: "#1f8a4c" }
            : tone === "warning"
              ? { color: "#c0392b" }
              : undefined
        }
      >
        {value}
      </div>
      {hint && <div className="text-xs opacity-50 mt-1">{hint}</div>}
    </div>
  );
}
