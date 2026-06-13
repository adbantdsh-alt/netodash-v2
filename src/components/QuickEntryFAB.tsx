import { useNavigate } from "@tanstack/react-router";
import { useActiveMode } from "@/lib/use-active-mode";

/**
 * Bouton flottant "+ Saisie" desktop/tablette.
 * Caché en mobile (remplacé par la MobileBottomNav).
 */
export function QuickEntryFAB() {
  const navigate = useNavigate();
  const { mode } = useActiveMode();

  return (
    <button
      type="button"
      onClick={() => navigate({ to: "/entries" })}
      aria-label="Nouvelle saisie (raccourci : N)"
      title="Nouvelle saisie · N"
      className="hidden lg:flex fixed bottom-6 right-6 z-30 items-center gap-2 px-5 py-3.5 brutal-border font-black text-sm uppercase tracking-widest bg-accent text-accent-foreground shadow-[6px_6px_0_0_var(--color-foreground)] hover:shadow-[8px_8px_0_0_var(--color-foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-foreground)] transition-all"
      data-mode-active={mode}
    >
      <span aria-hidden className="text-lg leading-none">＋</span>
      <span>Saisie</span>
      <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-mono brutal-border-thin bg-background/20 border-background/40">
        N
      </kbd>
    </button>
  );
}
