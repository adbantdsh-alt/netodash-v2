import { useEffect, useRef } from "react";

type Handlers = {
  onOpenPalette?: () => void;
  onNewEntry?: () => void;
  onGoTo?: (path: string) => void;
};

function isTypingTarget(el: EventTarget | null) {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (el.isContentEditable) return true;
  return false;
}

/**
 * Raccourcis clavier globaux à la Linear.
 *  - ⌘K / Ctrl+K : ouvre la command palette
 *  - / : ouvre la command palette
 *  - N : nouvelle saisie
 *  - G puis D : Dashboard
 *  - G puis P : Produits
 *  - G puis S : Saisies
 *  - G puis C : Paramètres
 */
export function useKeyboardShortcuts({ onOpenPalette, onNewEntry, onGoTo }: Handlers) {
  const gPressedAt = useRef<number>(0);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Cmd/Ctrl + K toujours actif (même si on tape)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenPalette?.();
        return;
      }

      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (key === "/") {
        e.preventDefault();
        onOpenPalette?.();
        return;
      }
      if (key === "n") {
        e.preventDefault();
        onNewEntry?.();
        return;
      }

      // Séquence G + lettre (fenêtre 1.2s)
      const now = Date.now();
      if (key === "g") {
        gPressedAt.current = now;
        return;
      }
      if (now - gPressedAt.current < 1200 && gPressedAt.current > 0) {
        gPressedAt.current = 0;
        if (key === "d") onGoTo?.("/dashboard");
        else if (key === "p") onGoTo?.("/products");
        else if (key === "s") onGoTo?.("/entries");
        else if (key === "c") onGoTo?.("/settings");
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenPalette, onNewEntry, onGoTo]);
}
