import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getRevenueOverview, listTransactions, refundTransaction } from "@/lib/admin/revenue.functions";
import { Search, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const Route = createFileRoute("/_admin/admin/revenue")({
  component: RevenuePage,
});

type Overview = Awaited<ReturnType<typeof getRevenueOverview>>;
type Tx = Awaited<ReturnType<typeof listTransactions>>["rows"][number];

const fmt = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} FCFA`;

function RevenuePage() {
  const fetchRevenueOverview = useServerFn(getRevenueOverview);
  const fetchTransactions = useServerFn(listTransactions);
  const refundPayment = useServerFn(refundTransaction);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [rows, setRows] = useState<Tx[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [refundFor, setRefundFor] = useState<Tx | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const pageSize = 25;

  const loadAll = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [ov, tx] = await Promise.all([
        fetchRevenueOverview(),
        fetchTransactions({
          data: { page, pageSize, search: search || undefined, status: status || undefined },
        }),
      ]);
      setOverview(ov);
      setRows(tx.rows as Tx[]);
      setTotal(tx.total);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const doRefund = async () => {
    if (!refundFor) return;
    try {
      await refundPayment({ data: { paymentId: refundFor.id as string, reason: refundReason } });
      setRefundFor(null);
      setRefundReason("");
      loadAll();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const maxRev = Math.max(1, ...(overview?.series.map((s) => s.revenue) ?? [1]));

  return (
    <div>
      <div className="admin-eyebrow">Finance</div>
      <h1 className="admin-h1 mb-6">Revenus</h1>

      {err && <div className="admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]">{err}</div>}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPI label="MRR" value={fmt(overview?.mrr ?? 0)} />
        <KPI label="ARR" value={fmt(overview?.arr ?? 0)} />
        <KPI
          label="Ce mois-ci"
          value={fmt(overview?.revenueThisMonth ?? 0)}
          trend={overview?.growth}
        />
        <KPI label="LTV moyen" value={fmt(overview?.ltv ?? 0)} sub={`${overview?.payingUsers ?? 0} payants`} />
      </div>

      {/* Graphique 12 mois */}
      <div className="admin-card mb-6">
        <div className="text-xs uppercase tracking-wider mb-4 font-bold">Revenus — 12 derniers mois</div>
        <div className="flex items-end gap-2 h-40">
          {(overview?.series ?? []).map((s) => (
            <div key={s.month} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-black"
                style={{ height: `${(s.revenue / maxRev) * 100}%`, minHeight: 2 }}
                title={`${s.month} : ${fmt(s.revenue)}`}
              />
              <div className="text-[10px] font-mono">{s.month.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            className="admin-input pl-9 w-full"
            placeholder="Référence, transaction ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), loadAll())}
          />
        </div>
        <select className="admin-input" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">Tous statuts</option>
          <option value="succeeded">Succeeded</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <button className="admin-btn" onClick={() => { setPage(1); loadAll(); }}>Filtrer</button>
      </div>

      <div className="admin-card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-3">Référence</th>
              <th className="text-left p-3">Utilisateur</th>
              <th className="text-left p-3">Plan</th>
              <th className="text-right p-3">Montant</th>
              <th className="text-left p-3">Statut</th>
              <th className="text-left p-3">Date</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-sm">Chargement…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-sm">Aucune transaction</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id as string} className="border-t border-black/10">
                  <td className="p-3 font-mono text-xs">{r.reference as string}</td>
                  <td className="p-3">{r.user_email}</td>
                  <td className="p-3 uppercase font-bold">{r.plan as string}</td>
                  <td className="p-3 text-right font-bold">{fmt(Number(r.amount))}</td>
                  <td className="p-3"><span className="admin-pill">{r.status as string}</span></td>
                  <td className="p-3 text-xs">{new Date(r.created_at as string).toLocaleString("fr-FR")}</td>
                  <td className="p-3">
                    {["succeeded", "paid"].includes(String(r.status)) && (
                      <button className="admin-btn-ghost text-xs" onClick={() => setRefundFor(r)}>
                        Rembourser
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <div>{total} transaction(s)</div>
        <div className="flex items-center gap-2">
          <button className="admin-btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></button>
          <span>Page {page} / {totalPages}</span>
          <button className="admin-btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></button>
        </div>
      </div>

      <ConfirmDialog
        open={!!refundFor}
        title="Rembourser la transaction"
        description={refundFor ? `${refundFor.reference as string} — ${fmt(Number(refundFor.amount))}` : ""}
        confirmLabel="Confirmer le remboursement"
        onClose={() => { setRefundFor(null); setRefundReason(""); }}
        onConfirm={doRefund}
        disabled={refundReason.trim().length < 3}
      >
        <label className="block text-xs uppercase font-bold mb-2 mt-2">Motif (obligatoire)</label>
        <textarea
          className="admin-input w-full"
          rows={3}
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          placeholder="Raison du remboursement…"
        />
      </ConfirmDialog>
    </div>
  );
}

function KPI({ label, value, sub, trend }: { label: string; value: string; sub?: string; trend?: number }) {
  return (
    <div className="admin-card">
      <div className="text-xs uppercase tracking-wider opacity-70 font-bold">{label}</div>
      <div className="text-3xl font-black mt-1">{value}</div>
      {trend !== undefined && trend !== 0 && (
        <div className={`text-xs mt-1 flex items-center gap-1 ${trend >= 0 ? "text-green-700" : "text-[color:var(--admin-accent)]"}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend > 0 ? "+" : ""}{trend}% vs mois précédent
        </div>
      )}
      {sub && <div className="text-xs mt-1 opacity-70">{sub}</div>}
    </div>
  );
}
