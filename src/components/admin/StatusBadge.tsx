export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: string; label: string }> = {
    active: { tone: "success", label: "Actif" },
    suspended: { tone: "warning", label: "Suspendu" },
    banned: { tone: "danger", label: "Banni" },
    pro: { tone: "accent", label: "Pro 15$" },
    starter: { tone: "neutral", label: "Pro hérité 29$" },
    basic: { tone: "neutral", label: "Basic 10$" },
    cod: { tone: "neutral", label: "COD hérité" },
    trial: { tone: "warning", label: "Essai" },
    free: { tone: "neutral", label: "Gratuit" },
    succeeded: { tone: "success", label: "Payé" },
    paid: { tone: "success", label: "Payé" },
    failed: { tone: "danger", label: "Échoué" },
    refunded: { tone: "warning", label: "Remboursé" },
  };
  const m = map[status] ?? { tone: "neutral", label: status };
  return (
    <span className="admin-badge" data-tone={m.tone}>
      {m.label}
    </span>
  );
}
