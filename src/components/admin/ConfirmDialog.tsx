import { useState, type ReactNode } from "react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  variant,
  destructive,
  requireReason = false,
  disabled = false,
  children,
  onConfirm,
  onCancel,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: "danger" | "accent";
  destructive?: boolean;
  requireReason?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onConfirm: (reason?: string) => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  if (!open) return null;
  const close = onCancel ?? onClose ?? (() => {});
  const v = variant ?? (destructive ? "danger" : "accent");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={close}
    >
      <div
        className="admin-card w-full max-w-md"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2">{title}</h2>
        {description && (
          <p className="text-sm mb-4" style={{ color: "#444" }}>{description}</p>
        )}
        {requireReason && (
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">
              Raison (obligatoire)
            </label>
            <textarea
              className="admin-input w-full"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button className="admin-btn" data-variant="outline" onClick={close}>Annuler</button>
          <button
            className="admin-btn"
            data-variant={v}
            disabled={loading || disabled || (requireReason && reason.trim().length < 3)}
            onClick={async () => {
              setLoading(true);
              try { await onConfirm(requireReason ? reason : undefined); }
              finally { setLoading(false); setReason(""); }
            }}
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
