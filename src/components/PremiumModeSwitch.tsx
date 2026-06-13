import type { BusinessMode } from "@/lib/use-active-mode";

type Size = "sm" | "md" | "lg";

interface Props {
  mode: BusinessMode;
  onChange: (mode: BusinessMode) => void;
  disabled?: boolean;
  size?: Size;
  className?: string;
}

/**
 * Switch premium skeuomorphique (inspiration : interrupteurs physiques).
 * - Piste creusée (inset)
 * - Bouton bombé avec halo lumineux
 * - Halo bleu en mode dropshipping, orange en mode COD
 */
export function PremiumModeSwitch({
  mode,
  onChange,
  disabled,
  size = "md",
  className = "",
}: Props) {
  return (
    <div
      role="tablist"
      aria-label="Sélecteur de mode business"
      data-active={mode}
      data-size={size}
      className={`premium-switch ${className}`}
    >
      <span className="premium-switch__track" aria-hidden="true" />
      <span className="premium-switch__knob" aria-hidden="true">
        <span className="premium-switch__knob-light" />
      </span>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "dropshipping"}
        data-active={mode === "dropshipping"}
        disabled={disabled}
        onClick={() => onChange("dropshipping")}
        className="premium-switch__btn"
      >
        Dropship
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "cod"}
        data-active={mode === "cod"}
        disabled={disabled}
        onClick={() => onChange("cod")}
        className="premium-switch__btn"
      >
        COD
      </button>
    </div>
  );
}
