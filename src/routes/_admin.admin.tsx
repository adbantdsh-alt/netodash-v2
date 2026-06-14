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

  const fmt = (n: number) => n.toLocaleString("fr-FR");
  const mrrSeries = data.mrrSeries ?? [];
  const activity = data.activity ?? [];
  const max = Math.max(1, ...mrrSeries.map((d) => d.value));

  return (
    <div>
      <h1 className="mb-6">Vue d'ensemble</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="MRR" value={`${fmt(data.mrr)} FCFA`} />
        <Kpi label="Utilisateurs" value={fmt(data.totalUsers)} />
        <Kpi label="Churn (mois)" value={`${data.churn}%`} />
        <Kpi label="Nouveaux / 7j" value={fmt(data.newThisWeek)} />
      </div>

      <div className="admin-card mb-8">
        <h2 className="mb-3">Évolution revenus · 30 j</h2>
        <div className="flex items-end gap-1 h-32">
          {mrrSeries.map((d) => (
            <div
              key={d.date}
              title={`${d.date} · ${fmt(d.value)} FCFA`}
              style={{
                flex: 1,
                height: `${(d.value / max) * 100}%`,
                background: d.value > 0 ? "#E05C1A" : "#eee",
                minHeight: 2,
              }}
            />
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

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-card">
      <div className="text-[10px] uppercase tracking-widest opacity-60">{label}</div>
      <div className="text-3xl font-black mt-2">{value}</div>
    </div>
  );
}

