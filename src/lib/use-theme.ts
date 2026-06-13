import { useEffect, useState } from "react";

const KEY = "netodash:theme";
export type Theme = "light" | "dark";

function readStored(): Theme {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem(KEY);
  return v === "dark" ? "dark" : "light";
}

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

/** Init au plus tôt pour éviter le flash (à appeler depuis le layout). */
export function initTheme() {
  apply(readStored());
}

const listeners = new Set<(t: Theme) => void>();

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStored());

  useEffect(() => {
    const onChange = (t: Theme) => setThemeState(t);
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  function setTheme(next: Theme) {
    window.localStorage.setItem(KEY, next);
    apply(next);
    listeners.forEach((cb) => cb(next));
  }

  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return { theme, setTheme, toggle };
}
