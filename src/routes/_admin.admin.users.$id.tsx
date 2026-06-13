import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  adminGetUserProfile,
  adminChangeUserPlan,
  adminSuspendUser,
  adminUnsuspendUser,
  adminBanUser,
  adminDeleteUserData,
  adminImpersonateUser,
} from "@/lib/admin/users.functions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/users/$id")({
  component: AdminUserDetail,
});

function AdminUserDetail() {
  const params = (Route as { useParams: () => { id: string } }).useParams();
  const userId = params.id;
  const fetchUserProfile = useServerFn(adminGetUserProfile);
  const changeUserPlan = useServerFn(adminChangeUserPlan);
  const suspendUser = useServerFn(adminSuspendUser);
  const unsuspendUser = useServerFn(adminUnsuspendUser);
  const banUser = useServerFn(adminBanUser);
  const deleteUserData = useServerFn(adminDeleteUserData);
  const impersonateUser = useServerFn(adminImpersonateUser);
  const [data, setData] = useState<Awaited<ReturnType<typeof adminGetUserProfile>> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setErr(null);
    fetchUserProfile({ data: { userId } })
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : "Erreur"));
  };
  useEffect(load, [userId]);

  const wrap = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  if (err) return <div className="admin-card text-destructive">{err}</div>;
  if (!data) return <div className="text-xs uppercase tracking-widest">Chargement…</div>;

  const p = data.profile as Record<string, unknown>;
  const sub = data.subscription as Record<string, unknown> | null;
  const fullName =
    (p.display_name as string) ||
    [p.first_name, p.last_name].filter(Boolean).join(" ") ||
    "—";

  return (
    <div>
      <Link to={"/admin/users" as never} className="inline-flex items-center gap-1 text-xs uppercase tracking-widest mb-3">
        <ArrowLeft size={14} /> Retour
      </Link>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="admin-eyebrow">Utilisateur</div>
          <h1 className="admin-h1">{fullName}</h1>
          <div className="text-sm mt-1">{p.email as string}</div>
          <div className="mt-2 flex gap-2">
            <StatusBadge status={data.status as never} />
            <span className="admin-badge" data-tone="neutral">
              {sub?.plan as string ?? "free"}
            </span>
          </div>
        </div>
        <button
          disabled={busy}
          onClick={() =>
            wrap(async () => {
              const r = await impersonateUser({ data: { userId } });
              if (r.link) window.open(r.link, "_blank", "noopener,noreferrer");
            })
          }
          className="admin-btn-primary"
        >
          <ExternalLink size={14} /> Impersonner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Stat label="Activité 30 j" value={`${data.entries30d} saisies`} />
        <Stat
          label="Dernière saisie"
          value={
            data.lastEntry
              ? new Date((data.lastEntry as { created_at: string }).created_at).toLocaleDateString("fr-FR")
              : "—"
          }
        />
        <Stat label="Pays" value={(p.country as string) || "—"} />
      </div>

      <div className="admin-card mb-6">
        <h2 className="mb-3">Plan & abonnement</h2>
        <div className="flex flex-wrap gap-2">
          {(["free", "trial", "basic", "starter", "pro"] as const).map((pl) => (
            <button
              key={pl}
              disabled={busy}
              onClick={() => wrap(() => changeUserPlan({ data: { userId, plan: pl } }))}
              className="admin-btn-ghost"
            >
              Passer en {pl}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card mb-6">
        <h2 className="mb-3">Modération</h2>
        <div className="flex flex-wrap gap-2">
          {data.status !== "suspended" && (
            <button
              disabled={busy}
              onClick={() => {
                const reason = prompt("Raison de la suspension ?");
                if (reason && reason.length >= 3)
                  wrap(() => suspendUser({ data: { userId, reason } }));
              }}
              className="admin-btn-ghost"
            >
              Suspendre
            </button>
          )}
          {data.status === "suspended" && (
            <button
              disabled={busy}
              onClick={() => wrap(() => unsuspendUser({ data: { userId } }))}
              className="admin-btn-ghost"
            >
              Réactiver
            </button>
          )}
          <button
            disabled={busy}
            onClick={() => {
              const reason = prompt("Raison du bannissement ?");
              if (reason && reason.length >= 3)
                wrap(() => banUser({ data: { userId, reason } }));
            }}
            className="admin-btn-ghost"
            style={{ borderColor: "#b32d2c", color: "#b32d2c" }}
          >
            Bannir
          </button>
          <button
            disabled={busy}
            onClick={() => {
              if (
                confirm(
                  "Suppression RGPD : toutes les données seront effacées. Action irréversible. Confirmer ?",
                )
              )
                wrap(() => deleteUserData({ data: { userId } }));
            }}
            className="admin-btn-ghost"
            style={{ borderColor: "#b32d2c", color: "#b32d2c" }}
          >
            Supprimer (RGPD)
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="mb-3">Paiements ({data.payments.length})</h2>
        {data.payments.length === 0 ? (
          <div className="text-sm text-muted-foreground">Aucun paiement.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((p) => (
                <tr key={p.id as string}>
                  <td>{new Date(p.created_at as string).toLocaleDateString("fr-FR")}</td>
                  <td className="font-bold">
                    {Number(p.amount).toLocaleString("fr-FR")} {p.currency as string}
                  </td>
                  <td>{p.payment_method as string}</td>
                  <td>
                    <span
                      className="admin-badge"
                      data-tone={p.status === "succeeded" ? "success" : "warning"}
                    >
                      {p.status as string}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-kpi">
      <div className="admin-kpi-label">{label}</div>
      <div className="admin-kpi-value">{value}</div>
    </div>
  );
}
