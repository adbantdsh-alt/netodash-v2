import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  adminGetExtensionOverview,
  adminUpdateExtensionSettings,
  type AdminExtensionOverview,
} from "@/lib/admin/extension.functions";
import { ExternalLink, Puzzle, RefreshCw, Save } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/extension")({
  component: AdminExtensionPage,
});

const EVENT_LABELS: Record<string, string> = {
  open: "Ouverture popup",
  capture: "Capture PNG",
  cta_click: "Clic newsletter",
  recalc: "Recalcul manuel",
};

function AdminExtensionPage() {
  const fetchOverview = useServerFn(adminGetExtensionOverview);
  const saveSettings = useServerFn(adminUpdateExtensionSettings);

  const [data, setData] = useState<AdminExtensionOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [cwsInstalls, setCwsInstalls] = useState("");
  const [publishedVersion, setPublishedVersion] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchOverview();
      setData(res);
      setCwsInstalls(String(res.cwsInstalls));
      setPublishedVersion(res.publishedVersion);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [fetchOverview]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

  const shortId = (id: string) => (id.length > 12 ? `${id.slice(0, 8)}…` : id);

  const saveMeta = async () => {
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      await saveSettings({
        data: {
          cwsInstalls: Number(cwsInstalls) || 0,
          publishedVersion: publishedVersion.trim() || undefined,
        },
      });
      setSaved(true);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const maxDaily = Math.max(1, ...(data?.dailyOpens ?? []).map((d) => d.opens));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="admin-eyebrow">Chrome Web Store</div>
          <h1 className="admin-h1 flex items-center gap-2">
            <Puzzle size={28} /> Extension Netodash
          </h1>
          <p className="text-xs text-muted-foreground mt-2 font-mono max-w-2xl">
            ROAS Net &amp; Profit Calculator · Manifest V3 · Les stats « utilisateurs actifs »
            proviennent du tracking intégré à l&apos;extension (v1.5.2+). Les installations
            Chrome Web Store se mettent à jour manuellement depuis le dashboard Google.
          </p>
        </div>
        <button type="button" className="admin-btn-ghost inline-flex items-center gap-2" onClick={() => load()}>
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {err && (
        <div className="admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]">{err}</div>
      )}
      {saved && (
        <div className="admin-card mb-4 border-l-4 border-l-green-600">Paramètres enregistrés.</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Kpi
          label="Installations CWS"
          value={loading ? "…" : String(data?.cwsInstalls ?? 0)}
          hint="Saisie manuelle"
        />
        <Kpi
          label="Utilisateurs trackés (30j)"
          value={loading ? "…" : String(data?.trackedUsers30d ?? 0)}
          hint="IDs uniques extension"
        />
        <Kpi
          label="Utilisateurs actifs (7j)"
          value={loading ? "…" : String(data?.trackedUsers7d ?? 0)}
          hint="Au moins 1 ouverture"
        />
        <Kpi
          label="Ouvertures aujourd'hui"
          value={loading ? "…" : String(data?.opensToday ?? 0)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Kpi label="Total événements" value={loading ? "…" : String(data?.eventsTotal ?? 0)} />
        <Kpi label="Ouvertures (7j)" value={loading ? "…" : String(data?.opens7d ?? 0)} />
        <Kpi label="Captures PNG (7j)" value={loading ? "…" : String(data?.captures7d ?? 0)} />
        <Kpi label="Clics CTA (7j)" value={loading ? "…" : String(data?.ctaClicks7d ?? 0)} />
        <Kpi
          label="Inscriptions site"
          value={loading ? "…" : String(data?.siteSignupsExtension ?? 0)}
          hint="referral extension/chrome"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="admin-card">
          <h2 className="font-black text-lg mb-4">Paramètres Chrome Web Store</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold block mb-1">
                Installations (depuis le dashboard Google)
              </label>
              <input
                type="number"
                min={0}
                className="admin-input w-full"
                value={cwsInstalls}
                onChange={(e) => setCwsInstalls(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold block mb-1">
                Version publiée
              </label>
              <input
                className="admin-input w-full"
                value={publishedVersion}
                onChange={(e) => setPublishedVersion(e.target.value)}
                placeholder="1.5.1"
              />
            </div>
            <button
              type="button"
              className="admin-btn inline-flex items-center gap-2"
              disabled={saving}
              onClick={() => saveMeta()}
            >
              <Save size={14} /> {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
          {data?.cwsUrl && (
            <a
              href={data.cwsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-xs font-bold uppercase tracking-wider hover:text-[color:var(--admin-accent)]"
            >
              Voir sur Chrome Web Store <ExternalLink size={12} />
            </a>
          )}
          {data?.extensionId && (
            <p className="text-[10px] font-mono text-muted-foreground mt-2">
              ID : {data.extensionId}
            </p>
          )}
        </div>

        <div className="admin-card">
          <h2 className="font-black text-lg mb-4">Versions actives (30j)</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : (data?.byVersion ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune donnée — déploie l&apos;extension v1.5.2+ avec le tracking activé.
            </p>
          ) : (
            <ul className="space-y-2">
              {data!.byVersion.map((v) => (
                <li key={v.version} className="flex justify-between font-mono text-sm">
                  <span>v{v.version}</span>
                  <span className="font-bold">{v.cnt} év.</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="admin-card mb-8">
        <h2 className="font-black text-lg mb-4">Ouvertures — 14 derniers jours</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : (data?.dailyOpens ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Pas encore de données.</p>
        ) : (
          <div className="space-y-2">
            {data!.dailyOpens.map((d) => (
              <div key={d.day} className="flex items-center gap-3 text-xs font-mono">
                <span className="w-24 shrink-0">
                  {new Date(d.day).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                </span>
                <div className="flex-1 h-4 bg-black/5 relative">
                  <div
                    className="h-full bg-[color:var(--admin-accent)]"
                    style={{ width: `${Math.round((d.opens / maxDaily) * 100)}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold">{d.opens}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-card p-0 overflow-x-auto">
        <div className="p-4 border-b border-black/10">
          <h2 className="font-black text-lg">Événements récents</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Événement</th>
              <th>Version</th>
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  Chargement…
                </td>
              </tr>
            ) : (data?.recentEvents ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  Aucun événement enregistré
                </td>
              </tr>
            ) : (
              data!.recentEvents.map((e) => (
                <tr key={e.id}>
                  <td className="text-xs whitespace-nowrap">{fmtDate(e.createdAt)}</td>
                  <td>
                    <span className="admin-badge" data-tone="accent">
                      {EVENT_LABELS[e.eventType] ?? e.eventType}
                    </span>
                  </td>
                  <td className="font-mono text-xs">{e.extensionVersion ?? "—"}</td>
                  <td className="font-mono text-xs" title={e.clientId}>
                    {shortId(e.clientId)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="admin-card">
      <div className="text-[10px] uppercase tracking-widest opacity-60">{label}</div>
      <div className="text-2xl font-black mt-2">{value}</div>
      {hint && <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}
