import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getAdminSettings, updateAdminSettings } from "@/lib/admin/settings.functions";

export const Route = createFileRoute("/_admin/admin/settings")({
  component: SettingsPage,
});

type Settings = Record<string, string>;

const SECTIONS: Array<{
  title: string;
  fields: Array<{ key: string; label: string; type: "text" | "email" | "number" | "url" | "textarea" | "boolean"; help?: string }>;
}> = [
  {
    title: "Branding",
    fields: [
      { key: "branding.app_name", label: "Nom de l'application", type: "text" },
      { key: "branding.tagline", label: "Tagline", type: "text" },
      { key: "branding.support_email", label: "Email support", type: "email", help: "Adresse affichée dans l'app pour le support utilisateurs." },
    ],
  },
  {
    title: "Tarification (FCFA / mois)",
    fields: [
      { key: "pricing.basic_xof", label: "Plan Basic", type: "number" },
      { key: "pricing.starter_xof", label: "Plan Starter", type: "number" },
      { key: "pricing.pro_xof", label: "Plan Pro", type: "number" },
      { key: "trial.default_days", label: "Durée d'essai par défaut (jours)", type: "number" },
    ],
  },
  {
    title: "Feature flags",
    fields: [
      { key: "flags.signup_enabled", label: "Inscriptions ouvertes", type: "boolean", help: "Désactive pour bloquer les nouvelles inscriptions." },
      { key: "flags.affiliate_enabled", label: "Codes d'affiliation actifs", type: "boolean" },
      { key: "flags.maintenance_mode", label: "Mode maintenance", type: "boolean", help: "Affiche un écran de maintenance aux utilisateurs." },
      { key: "flags.maintenance_message", label: "Message de maintenance", type: "textarea" },
    ],
  },
];

function SettingsPage() {
  const fetchSettings = useServerFn(getAdminSettings);
  const saveSettings = useServerFn(updateAdminSettings);
  const [settings, setSettings] = useState<Settings>({});
  const [original, setOriginal] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setErr(null);
    try {
      const res = await fetchSettings();
      setSettings(res.settings);
      setOriginal(res.settings);
      setLatestUpdate(res.latestUpdate);
    } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const dirtyKeys = Object.keys(settings).filter((k) => settings[k] !== original[k]);

  const save = async () => {
    if (dirtyKeys.length === 0) return;
    setSaving(true); setErr(null); setOk(false);
    try {
      const patch: Settings = {};
      for (const k of dirtyKeys) patch[k] = settings[k];
      await saveSettings({ data: { patch } });
      setOk(true);
      setTimeout(() => setOk(false), 2500);
      load();
    } catch (e) { setErr(e instanceof Error ? e.message : "Erreur"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="admin-card">Chargement…</div>;

  return (
    <div>
      <div className="admin-eyebrow">Configuration</div>
      <div className="flex items-end justify-between mb-6">
        <h1 className="admin-h1">Paramètres</h1>
        <div className="flex items-center gap-3">
          {latestUpdate && (
            <span className="text-xs opacity-70">Dernière maj : {new Date(latestUpdate).toLocaleString("fr-FR")}</span>
          )}
          <button className="admin-btn" onClick={save} disabled={dirtyKeys.length === 0 || saving}>
            {saving ? "Enregistrement…" : dirtyKeys.length === 0 ? "Tout est à jour" : `Enregistrer (${dirtyKeys.length})`}
          </button>
        </div>
      </div>

      {err && <div className="admin-card mb-4 border-l-4 border-l-[color:var(--admin-accent)]">{err}</div>}
      {ok && <div className="admin-card mb-4 border-l-4 border-l-green-600">Paramètres enregistrés.</div>}

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.title} className="admin-card">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4">{s.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {s.fields.map((f) => {
                const val = settings[f.key] ?? "";
                const dirty = settings[f.key] !== original[f.key];
                return (
                  <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                    <label className="block text-xs uppercase font-bold mb-1">
                      {f.label}
                      {dirty && <span className="ml-2 text-[color:var(--admin-accent)]">•modifié</span>}
                    </label>
                    {f.type === "boolean" ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={val === "true"}
                          onChange={(e) => setSettings({ ...settings, [f.key]: e.target.checked ? "true" : "false" })}
                        />
                        <span className="text-sm">{val === "true" ? "Activé" : "Désactivé"}</span>
                      </label>
                    ) : f.type === "textarea" ? (
                      <textarea className="admin-input w-full" rows={3}
                        value={val}
                        onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                      />
                    ) : (
                      <input
                        type={f.type}
                        className="admin-input w-full"
                        value={val}
                        onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                      />
                    )}
                    {f.help && <p className="text-xs opacity-60 mt-1">{f.help}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card mt-6 border-l-4 border-l-[color:var(--admin-accent)]">
        <h3 className="font-black uppercase mb-1">Zone sensible</h3>
        <p className="text-sm opacity-80">
          Les changements de tarification s'appliquent immédiatement aux nouvelles souscriptions, mais ne modifient pas
          rétroactivement les abonnements en cours. Le mode maintenance affichera un écran bloquant à tous les utilisateurs non-admin.
        </p>
      </div>
    </div>
  );
}
