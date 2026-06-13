import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { adminExportAuthUsers } from "@/lib/admin/export.functions";

export const Route = createFileRoute("/_admin/admin/export")({
  component: ExportPage,
});

function ExportPage() {
  const exportFn = useServerFn(adminExportAuthUsers);
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const data = await exportFn();
      const blob = new Blob([data.json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `netodash-auth-users-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${data.count} utilisateurs exportés`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur export");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Export migration</h1>
        <p className="text-muted-foreground mt-1">
          Exporte les utilisateurs auth pour migrer vers un autre projet Supabase.
          Réservé aux super_admin.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="font-semibold">Utilisateurs auth (UUID + emails + métadonnées)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            ⚠️ Les hash de mots de passe ne sont pas exportés (impossible techniquement).
            Les utilisateurs devront réinitialiser leur mot de passe ou se reconnecter via Google.
          </p>
        </div>
        <Button onClick={handleExport} disabled={loading}>
          {loading ? "Export en cours..." : "Télécharger auth-users.json"}
        </Button>
      </Card>

      <Card className="p-6 space-y-2 text-sm">
        <h2 className="font-semibold">Procédure complète</h2>
        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
          <li>Télécharge <code>auth-users.json</code> ci-dessus.</li>
          <li>
            Récupère les fichiers SQL fournis par Lovable :{" "}
            <code>01_schema.sql</code> et <code>02_data.sql</code>.
          </li>
          <li>
            Suis le <code>README_MIGRATION.md</code> pour importer dans ton nouveau
            projet Supabase.
          </li>
        </ol>
      </Card>
    </div>
  );
}
