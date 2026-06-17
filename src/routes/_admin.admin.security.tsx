import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  listAuditLogs,
  listAdminAccounts,
  inviteAdminAccount,
  updateAdminAccount,
  removeAdminAccount,
} from "@/lib/admin/security.functions";
import { Search, ChevronLeft, ChevronRight, UserPlus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const Route = createFileRoute("/_admin/admin/security")({
  component: SecurityPage,
});

type Logs = {
  rows: Array<{
    id: number;
    admin_id: string | null;
    admin_email: string;
    action: string;
    category: string;
    target_user_id: string | null;
    target_email: string | null;
    details: Record<string, any>;
    created_at: string;
  }>;
  total: number;
  page: number;
  pageSize: number;
};
type Accounts = {
  rows: Array<{
    id: string;
    email: string;
    display_name: string | null;
    role: "super_admin" | "support" | "finance";
    status: string;
    last_login_at: string | null;
    created_at: string;
  }>;
};

function SecurityPage() {
  const fetchAuditLogs = useServerFn(listAuditLogs);
  const fetchAdminAccounts = useServerFn(listAdminAccounts);
  const inviteAccount = useServerFn(inviteAdminAccount);
  const updateAccount = useServerFn(updateAdminAccount);
  const removeAccount = useServerFn(removeAdminAccount);
  const [tab, setTab] = useState<"logs" | "accounts">("logs");
  const [logs, setLogs] = useState<Logs | null>(null);
  const [accounts, setAccounts] = useState<Accounts | null>(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ email: "", role: "support" as "super_admin" | "support" | "finance" });
  const [removeId, setRemoveId] = useState<string | null>(null);

  const pageSize = 50;

  const loadLogs = async () => {
    setLoading(true);
    setErr(null);
    try {
      setLogs(await fetchAuditLogs({ data: { page, pageSize, category: category || undefined, search: search || undefined } }));
    } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
    finally { setLoading(false); }
  };
  const loadAccounts = async () => {
    setLoading(true);
    setErr(null);
    try { setAccounts(await fetchAdminAccounts()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === "logs") loadLogs(); else loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, page, category]);

  const doInvite = async () => {
    try {
      await inviteAccount({ data: invite });
      setShowInvite(false);
      setInvite({ email: "", role: "support" });
      loadAccounts();
    } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };
  const doChangeRole = async (id: string, role: "super_admin" | "support" | "finance") => {
    try { await updateAccount({ data: { id, role } }); loadAccounts(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };
  const doChangeStatus = async (id: string, status: "active" | "suspended" | "revoked") => {
    try { await updateAccount({ data: { id, status } }); loadAccounts(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };
  const doRemove = async () => {
    if (!removeId) return;
    try { await removeAccount({ data: { id: removeId } }); setRemoveId(null); loadAccounts(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
  };

  const totalPages = logs ? Math.max(1, Math.ceil(logs.total / pageSize)) : 1;

  return (
    <div>
      <div className="admin-eyebrow">Sécurité</div>
      <h1 className="admin-h1 mb-6">Sécurité & Audit</h1>

      {err && <div className="admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]">{err}</div>}

      <div className="flex gap-1 mb-6 border-b-2 border-black">
        <button
          className={`px-4 py-2 font-bold uppercase text-sm ${tab === "logs" ? "bg-black text-white" : ""}`}
          onClick={() => { setTab("logs"); setPage(1); }}
        >Journal d'audit</button>
        <button
          className={`px-4 py-2 font-bold uppercase text-sm ${tab === "accounts" ? "bg-black text-white" : ""}`}
          onClick={() => setTab("accounts")}
        >Comptes admin (RBAC)</button>
      </div>

      {tab === "logs" && (
        <>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                className="admin-input pl-9 w-full"
                placeholder="Action, email cible…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (setPage(1), loadLogs())}
              />
            </div>
            <select className="admin-input" value={category} onChange={(e) => { setPage(1); setCategory(e.target.value); }}>
              <option value="">Toutes catégories</option>
              <option value="general">general</option>
              <option value="user">user</option>
              <option value="finance">finance</option>
              <option value="affiliates">affiliates</option>
              <option value="security">security</option>
              <option value="impersonation">impersonation</option>
              <option value="communication">communication</option>
            </select>
            <button className="admin-btn" onClick={() => { setPage(1); loadLogs(); }}>Filtrer</button>
          </div>

          <div className="admin-card p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Admin</th>
                  <th className="text-left p-3">Action</th>
                  <th className="text-left p-3">Catégorie</th>
                  <th className="text-left p-3">Cible</th>
                  <th className="text-left p-3">Détails</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-6 text-center">Chargement…</td></tr>
                ) : (logs?.rows ?? []).length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center">Aucun log</td></tr>
                ) : (
                  logs!.rows.map((l) => (
                    <tr key={l.id} className="border-t border-black/10 align-top">
                      <td className="p-3 text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleString("fr-FR")}</td>
                      <td className="p-3 text-xs">{l.admin_email}</td>
                      <td className="p-3 font-mono text-xs font-bold">{l.action}</td>
                      <td className="p-3"><span className="admin-pill">{l.category}</span></td>
                      <td className="p-3 text-xs">{l.target_email ?? "—"}</td>
                      <td className="p-3 text-xs"><pre className="whitespace-pre-wrap font-mono opacity-70 max-w-xs">{JSON.stringify(l.details, null, 0)}</pre></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <div>{logs?.total ?? 0} entrée(s)</div>
            <div className="flex items-center gap-2">
              <button className="admin-btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></button>
              <span>Page {page} / {totalPages}</span>
              <button className="admin-btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></button>
            </div>
          </div>
        </>
      )}

      {tab === "accounts" && (
        <>
          <div className="flex justify-end mb-4">
            <button className="admin-btn" onClick={() => setShowInvite(true)}><UserPlus size={16} className="inline mr-1" />Inviter un admin</button>
          </div>
          <div className="admin-card p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Rôle</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-left p-3">Dernière connexion</th>
                  <th className="text-left p-3">Créé le</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-6 text-center">Chargement…</td></tr>
                ) : (accounts?.rows ?? []).map((a) => (
                  <tr key={a.id} className="border-t border-black/10">
                    <td className="p-3 font-bold">{a.email}</td>
                    <td className="p-3">
                      <select className="admin-input" value={a.role} onChange={(e) => doChangeRole(a.id, e.target.value as "super_admin" | "support" | "finance")}>
                        <option value="super_admin">Super Admin</option>
                        <option value="support">Support</option>
                        <option value="finance">Finance</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select className="admin-input" value={a.status} onChange={(e) => doChangeStatus(a.id, e.target.value as "active" | "suspended" | "revoked")}>
                        <option value="active">Actif</option>
                        <option value="suspended">Suspendu</option>
                        <option value="revoked">Révoqué</option>
                      </select>
                    </td>
                    <td className="p-3 text-xs">{a.last_login_at ? new Date(a.last_login_at).toLocaleString("fr-FR") : "—"}</td>
                    <td className="p-3 text-xs">{new Date(a.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="p-3 text-right">
                      <button className="admin-btn-ghost" onClick={() => setRemoveId(a.id)} title="Retirer"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={showInvite}
        title="Inviter un administrateur"
        description="L'utilisateur doit déjà avoir un compte Netodash actif."
        confirmLabel="Ajouter"
        onClose={() => setShowInvite(false)}
        onConfirm={doInvite}
        disabled={!invite.email.includes("@")}
      >
        <div className="space-y-3 mt-2">
          <div>
            <label className="block text-xs uppercase font-bold mb-1">Email</label>
            <input type="email" className="admin-input w-full" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold mb-1">Rôle</label>
            <select className="admin-input w-full" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value as never })}>
              <option value="support">Support — lecture + impersonation + tickets</option>
              <option value="finance">Finance — revenus + remboursements</option>
              <option value="super_admin">Super Admin — tous les droits</option>
            </select>
          </div>
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={!!removeId}
        title="Retirer cet administrateur ?"
        description="Le compte utilisateur Netodash sera conservé, mais perdra tout accès au panel admin."
        confirmLabel="Retirer"
        destructive
        onClose={() => setRemoveId(null)}
        onConfirm={doRemove}
      />
    </div>
  );
}
