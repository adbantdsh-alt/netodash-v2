import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  listAnnouncements,
  upsertAnnouncement,
  toggleAnnouncement,
  deleteAnnouncement,
} from "@/lib/admin/communication.functions";
import { Plus, Trash2, Power, Pencil, Info, AlertTriangle, CheckCircle2, Megaphone } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const Route = createFileRoute("/_admin/admin/communication")({
  component: CommunicationPage,
});

type Row = Awaited<ReturnType<typeof listAnnouncements>>["rows"][number];

const SEVERITIES = [
  { v: "info", label: "Info", icon: Info },
  { v: "success", label: "Succès", icon: CheckCircle2 },
  { v: "warning", label: "Avertissement", icon: AlertTriangle },
  { v: "critical", label: "Critique", icon: AlertTriangle },
] as const;

const AUDIENCES = [
  { v: "all", label: "Tous les utilisateurs" },
  { v: "free", label: "Plan Gratuit" },
  { v: "trial", label: "En essai" },
  { v: "paying", label: "Tous les payants" },
  { v: "basic", label: "Plan Basic" },
  { v: "starter", label: "Plan Starter" },
  { v: "pro", label: "Plan Pro" },
] as const;

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function CommunicationPage() {
  const fetchAnnouncements = useServerFn(listAnnouncements);
  const saveAnnouncement = useServerFn(upsertAnnouncement);
  const setAnnouncementActive = useServerFn(toggleAnnouncement);
  const removeAnnouncement = useServerFn(deleteAnnouncement);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setErr(null);
    try { setRows((await fetchAnnouncements()).rows); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => setEditing({
    title: "", body: "", severity: "info", audience: "all",
    cta_label: "", cta_url: "", active: true,
    starts_at: new Date().toISOString(), ends_at: null,
  });

  const save = async () => {
    if (!editing) return;
    try {
      await saveAnnouncement({
        data: {
          id: editing.id,
          title: editing.title ?? "",
          body: editing.body ?? "",
          severity: (editing.severity ?? "info") as never,
          audience: (editing.audience ?? "all") as never,
          cta_label: editing.cta_label || null,
          cta_url: editing.cta_url || null,
          active: editing.active ?? true,
          starts_at: editing.starts_at ?? new Date().toISOString(),
          ends_at: editing.ends_at || null,
        },
      });
      setEditing(null);
      load();
    } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };

  const doDelete = async () => {
    if (!deleteId) return;
    try { await removeAnnouncement({ data: { id: deleteId } }); setDeleteId(null); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };

  const doToggle = async (id: string, active: boolean) => {
    try { await setAnnouncementActive({ data: { id, active: !active } }); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };

  return (
    <div>
      <div className="admin-eyebrow">Relation client</div>
      <div className="flex items-end justify-between mb-2">
        <h1 className="admin-h1">Communication</h1>
        <button className="admin-btn" onClick={openCreate}>
          <Plus size={16} className="inline mr-1" />Nouvelle annonce
        </button>
      </div>
      <p className="text-sm opacity-70 mb-6 max-w-3xl">
        Diffuse des bandeaux <strong>in-app</strong> à tes utilisateurs Netodash (maintenance, nouveauté, alerte facturation…).
        Pour de vraies campagnes email marketing (newsletter, promotions), un service dédié (Resend Broadcasts, Mailchimp…)
        est nécessaire — Lovable Emails est réservé aux messages transactionnels.
      </p>

      {err && <div className="admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]">{err}</div>}

      <div className="admin-card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-3">Annonce</th>
              <th className="text-left p-3">Sévérité</th>
              <th className="text-left p-3">Audience</th>
              <th className="text-left p-3">Période</th>
              <th className="text-left p-3">Statut</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center">Chargement…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center">
                <Megaphone className="mx-auto mb-2 opacity-40" />
                Aucune annonce
              </td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t border-black/10 align-top">
                <td className="p-3">
                  <div className="font-bold">{r.title}</div>
                  <div className="text-xs opacity-70 line-clamp-2 max-w-md">{r.body}</div>
                </td>
                <td className="p-3"><span className="admin-pill uppercase">{r.severity}</span></td>
                <td className="p-3 text-xs">{AUDIENCES.find((a) => a.v === r.audience)?.label}</td>
                <td className="p-3 text-xs whitespace-nowrap">
                  {new Date(r.starts_at).toLocaleDateString("fr-FR")}
                  {r.ends_at ? ` → ${new Date(r.ends_at).toLocaleDateString("fr-FR")}` : " → ∞"}
                </td>
                <td className="p-3">
                  <span className={`admin-pill ${r.active ? "bg-green-100 text-green-800" : "bg-black/10"}`}>
                    {r.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="p-3 flex gap-2 justify-end">
                  <button className="admin-btn-ghost" onClick={() => setEditing(r)} title="Modifier"><Pencil size={14} /></button>
                  <button className="admin-btn-ghost" onClick={() => doToggle(r.id, r.active)} title={r.active ? "Désactiver" : "Activer"}><Power size={14} /></button>
                  <button className="admin-btn-ghost" onClick={() => setDeleteId(r.id)} title="Supprimer"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!editing}
        title={editing?.id ? "Modifier l'annonce" : "Nouvelle annonce"}
        confirmLabel="Enregistrer"
        onClose={() => setEditing(null)}
        onConfirm={save}
        disabled={!editing?.title || !editing?.body}
      >
        {editing && (
          <div className="space-y-3 mt-2">
            <div>
              <label className="block text-xs uppercase font-bold mb-1">Titre</label>
              <input className="admin-input w-full" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold mb-1">Message</label>
              <textarea className="admin-input w-full" rows={3} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-bold mb-1">Sévérité</label>
                <select className="admin-input w-full" value={editing.severity ?? "info"} onChange={(e) => setEditing({ ...editing, severity: e.target.value as never })}>
                  {SEVERITIES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase font-bold mb-1">Audience</label>
                <select className="admin-input w-full" value={editing.audience ?? "all"} onChange={(e) => setEditing({ ...editing, audience: e.target.value as never })}>
                  {AUDIENCES.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-bold mb-1">CTA (libellé)</label>
                <input className="admin-input w-full" placeholder="ex: En savoir plus" value={editing.cta_label ?? ""} onChange={(e) => setEditing({ ...editing, cta_label: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold mb-1">CTA (URL)</label>
                <input className="admin-input w-full" placeholder="https://…" value={editing.cta_url ?? ""} onChange={(e) => setEditing({ ...editing, cta_url: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-bold mb-1">Début</label>
                <input type="datetime-local" className="admin-input w-full"
                  value={toLocalInput(editing.starts_at ?? new Date().toISOString())}
                  onChange={(e) => setEditing({ ...editing, starts_at: new Date(e.target.value).toISOString() })} />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold mb-1">Fin (optionnel)</label>
                <input type="datetime-local" className="admin-input w-full"
                  value={editing.ends_at ? toLocalInput(editing.ends_at) : ""}
                  onChange={(e) => setEditing({ ...editing, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
              <span>Active immédiatement</span>
            </label>
          </div>
        )}
      </ConfirmDialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer cette annonce ?"
        description="Action irréversible."
        confirmLabel="Supprimer"
        destructive
        onClose={() => setDeleteId(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}
