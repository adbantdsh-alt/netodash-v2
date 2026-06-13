import { useTheme } from "@/lib/use-theme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
        title={isDark ? "Mode clair" : "Mode sombre"}
        className="px-2.5 py-2 brutal-border-thin border-foreground/30 hover:border-foreground text-base leading-none"
      >
        {isDark ? "☀" : "☾"}
      </button>
    );
  }
  return (
    <button
      onClick={toggle}
      className="w-full text-left px-3 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background flex items-center justify-between"
      role="menuitem"
    >
      <span>{isDark ? "☀ Mode clair" : "☾ Mode sombre"}</span>
      <span className="text-[9px] font-mono opacity-60">{isDark ? "DARK" : "LIGHT"}</span>
    </button>
  );
}
