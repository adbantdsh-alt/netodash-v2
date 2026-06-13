import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminGetBetaProgram } from "@/lib/admin/beta.functions";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/beta-testers")({
  component: AdminBetaTestersPage,
});

type Data = Awaited<ReturnType<typeof adminGetBetaProgram>>;

function AdminBetaTestersPage() {
  const fetchBeta = useServerFn(adminGetBetaProgram);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        setData(await fetchBeta());
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchBeta]);

  const fmtDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("fr-FR", { dateStyle: "medium" }) : "—";

  return (
    <div>
      <div className="admin-eyebrow">Programme bêta</div>
      <h1 className="admin-h1 mb-6">Bêta-testeurs</h1>

      {err && (
        <div className="admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]">{err}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Kpi label="Places utilisées" value={loading ? "…" : `${data?.betaCount ?? 0} / ${data?.maxSpots ?? 10}`} />
        <Kpi label="Places restantes" value={loading ? "…" : `${data?.spotsLeft ?? 0}`} />
        <Kpi label="Liste d'attente" value={loading ? "…" : `${data?.waitlistCount ?? 0}`} />
        <Kpi label="Accès gratuit" value="Scale · 6 mois" />
        <Kpi label="Remise à vie" value="-50 %" />
      </div>

      <div className="admin-card p-0 overflow-x-auto mb-8">
        <div className="p-4 border-b border-black/10">
          <h2 className="font-black text-lg">Inscrits au programme bêta</h2>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Plan Scale gratuit 6 mois · -50 % à vie sur tous les plans · max 10 places
          </p>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Inscription</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Compte</th>
              <th>Plan</th>
              <th>Gratuit jusqu'au</th>
              <th>Remise à vie</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="p-6 text-center">
                  Chargement…
                </td>
              </tr>
            ) : (data?.testers ?? []).length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center">
                  Aucun bêta-testeur pour le moment
                </td>
              </tr>
            ) : (
              data!.testers.map((t) => (
                <tr key={t.id}>
                  <td>{fmtDate(t.createdAt)}</td>
                  <td className="font-bold">{t.fullName}</td>
                  <td className="font-mono text-xs">{t.email}</td>
                  <td>
                    <span className="admin-badge" data-tone={t.hasAccount ? "success" : "neutral"}>
                      {t.hasAccount ? "Créé" : "En attente"}
                    </span>
                  </td>
                  <td>{t.plan ?? "—"}</td>
                  <td>{fmtDate(t.freeUntil ?? t.trialEndsAt)}</td>
                  <td className="font-bold">-{t.lifetimeDiscountPercent} %</td>
                  <td>
                    <span className="admin-badge" data-tone="accent">
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.userId && (
                      <Link
                        to="/admin/users/$id"
                        params={{ id: t.userId }}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:text-[color:var(--admin-accent)]"
                      >
                        Voir <ExternalLink size={12} />
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-card p-0 overflow-x-auto">
        <div className="p-4 border-b border-black/10">
          <h2 className="font-black text-lg">Liste d'attente</h2>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Emails collectés quand les 10 places sont complètes
          </p>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Email</th>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-6 text-center">
                  Chargement…
                </td>
              </tr>
            ) : (data?.waitlist ?? []).length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center">
                  Liste d'attente vide
                </td>
              </tr>
            ) : (
              data!.waitlist.map((w) => (
                <tr key={w.id}>
                  <td>{fmtDate(w.createdAt)}</td>
                  <td className="font-mono text-xs">{w.email}</td>
                  <td>{w.fullName ?? "—"}</td>
                </tr>
              ))
            )}
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
      <div className="text-2xl font-black mt-2">{value}</div>
    </div>
  );
}
