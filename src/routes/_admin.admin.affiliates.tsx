import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  getAffiliatesOverview,
  createAffiliateCode,
  toggleAffiliateCode,
  deleteAffiliateCode,
} from "@/lib/admin/affiliates.functions";
import { Plus, Trash2, Power } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const Route = createFileRoute("/_admin/admin/affiliates")({
  component: AffiliatesPage,
});

type Data = Awaited<ReturnType<typeof getAffiliatesOverview>>;

function AffiliatesPage() {
  const fetchAffiliatesOverview = useServerFn(getAffiliatesOverview);
  const createCode = useServerFn(createAffiliateCode);
  const setCodeActive = useServerFn(toggleAffiliateCode);
  const removeCode = useServerFn(deleteAffiliateCode);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code: "", label: "", trial_days: 5 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      setData(await fetchAffiliatesOverview());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const doCreate = async () => {
    try {
      await createCode({ data: { code: form.code, label: form.label || null, trial_days: form.trial_days } });
      setShowCreate(false);
      setForm({ code: "", label: "", trial_days: 5 });
      load();
    } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };
  const doToggle = async (id: string, active: boolean) => {
    try { await setCodeActive({ data: { id, active: !active } }); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };
  const doDelete = async () => {
    if (!deleteId) return;
    try { await removeCode({ data: { id: deleteId } }); setDeleteId(null); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };

  return (
    <div>
      <div className="admin-eyebrow">Croissance</div>
      <div className="flex items-end justify-between mb-6">
        <h1 className="admin-h1">Affiliation</h1>
        <button className="admin-btn" onClick={() => setShowCreate(true)}><Plus size={16} className="inline mr-1" />Nouveau code</button>
      </div>

      {err && <div className="admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]">{err}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPI label="Codes actifs" value={`${data?.activeCodes ?? 0} / ${data?.totalCodes ?? 0}`} />
        <KPI label="Total parrainages" value={`${data?.totalReferrals ?? 0}`} />
        <KPI label="Conversions" value={`${data?.conversionCount ?? 0}`} />
        <KPI label="Taux de conversion" value={`${data?.conversionRate ?? 0}%`} />
      </div>

      <div className="admin-card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-3">Code</th>
              <th className="text-left p-3">Label</th>
              <th className="text-right p-3">Trial</th>
              <th className="text-right p-3">Usage</th>
              <th className="text-right p-3">Conversions</th>
              <th className="text-right p-3">Taux</th>
              <th className="text-left p-3">Statut</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-6 text-center">Chargement…</td></tr>
            ) : (data?.codes ?? []).length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center">Aucun code</td></tr>
            ) : (
              data!.codes.map((c) => (
                <tr key={c.id as string} className="border-t border-black/10">
                  <td className="p-3 font-mono font-bold uppercase">{c.code as string}</td>
                  <td className="p-3">{(c.label as string) ?? "—"}</td>
                  <td className="p-3 text-right">{c.trial_days as number} j</td>
                  <td className="p-3 text-right font-bold">{c.usage}</td>
                  <td className="p-3 text-right">{c.conversion}</td>
                  <td className="p-3 text-right">{c.conversion_rate}%</td>
                  <td className="p-3">
                    <span className={`admin-pill ${c.active ? "bg-green-100 text-green-800" : "bg-black/10"}`}>
                      {c.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 justify-end">
                    <button className="admin-btn-ghost text-xs" onClick={() => doToggle(c.id as string, c.active as boolean)} title={c.active ? "Désactiver" : "Activer"}>
                      <Power size={14} />
                    </button>
                    <button className="admin-btn-ghost text-xs" onClick={() => setDeleteId(c.id as string)} title="Supprimer">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={showCreate}
        title="Créer un code d'affiliation"
        confirmLabel="Créer"
        onClose={() => setShowCreate(false)}
        onConfirm={doCreate}
        disabled={form.code.trim().length < 2}
      >
        <div className="space-y-3 mt-2">
          <div>
            <label className="block text-xs uppercase font-bold mb-1">Code</label>
            <input className="admin-input w-full" placeholder="ex: SUMMER25" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold mb-1">Label (interne)</label>
            <input className="admin-input w-full" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold mb-1">Jours d'essai</label>
            <input type="number" min={1} max={90} className="admin-input w-full" value={form.trial_days} onChange={(e) => setForm({ ...form, trial_days: Number(e.target.value) })} />
          </div>
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer ce code ?"
        description="Cette action est irréversible. Les parrainages déjà créés resteront associés au code historique."
        confirmLabel="Supprimer"
        destructive
        onClose={() => setDeleteId(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-card">
      <div className="text-xs uppercase tracking-wider opacity-70 font-bold">{label}</div>
      <div className="text-3xl font-black mt-1">{value}</div>
    </div>
  );
}
