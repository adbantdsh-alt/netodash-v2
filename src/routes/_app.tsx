import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useIsAdmin } from "@/lib/use-is-admin";

import { RenewalReminder } from "@/components/RenewalReminder";
import { OnboardingWelcome } from "@/components/OnboardingWelcome";
import { OnboardingTour } from "@/components/OnboardingTour";
import { ProfileCompletionBanner } from "@/components/ProfileCompletionBanner";
import { ModeSwitch } from "@/components/ModeSwitch";
import { useActiveMode } from "@/lib/use-active-mode";
import { usePlanCodModeSync } from "@/lib/use-plan-mode-sync";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { AnnouncementsBanner } from "@/components/AnnouncementsBanner";
import { CommandPalette } from "@/components/CommandPalette";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { QuickEntryFAB } from "@/components/QuickEntryFAB";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { initOfflineQueue, getQueueSize, subscribeQueue } from "@/lib/offline-queue";
import { initTheme } from "@/lib/use-theme";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  errorComponent: AppErrorBoundary,
  notFoundComponent: AppNotFound,
});

function AppErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  if (typeof console !== "undefined") {
    // Log complet pour monitoring — l'utilisateur ne voit que le message générique
    console.error("[_app errorBoundary]", error);
  }
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-16">
      <div className="brutal-border p-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">ERREUR</div>
        <h1 className="text-3xl font-black tracking-tight">Cette page n'a pas pu charger.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Un problème est survenu côté serveur ou réseau. Tes données ne sont pas perdues.
        </p>
        {import.meta.env.DEV && error?.message && (
          <pre className="mt-4 max-h-40 overflow-auto brutal-border-thin p-3 font-mono text-xs text-accent">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => reset()}
            className="brutal-border bg-foreground text-background px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
          >
            Réessayer
          </button>
          <a
            href="/dashboard"
            className="brutal-border px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
          >
            Retour dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

function AppNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-16">
      <div className="brutal-border p-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">404</div>
        <h1 className="text-3xl font-black tracking-tight">Page introuvable.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Cette URL n'existe pas dans ton espace.
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-block brutal-border bg-foreground text-background px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
        >
          Retour dashboard
        </a>
      </div>
    </div>
  );
}

function AppLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdminQ = useIsAdmin(user?.id);
  const isAdmin = !!isAdminQ.data;
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [queueSize, setQueueSize] = useState(0);
  const accountRef = useRef<HTMLDivElement>(null);

  // Offline queue : flush au retour réseau + indicateur visuel.
  // + init du thème (light/dark) au plus tôt pour éviter le flash.
  useEffect(() => {
    initTheme();
    initOfflineQueue();
    setQueueSize(getQueueSize());
    const unsub = subscribeQueue(() => setQueueSize(getQueueSize()));
    return unsub;
  }, []);

  // Raccourcis clavier (⌘K, /, N, G+lettre)
  useKeyboardShortcuts({
    onOpenPalette: () => setPaletteOpen(true),
    onNewEntry: () => navigate({ to: "/entries" }),
    onGoTo: (path) => navigate({ to: path as any }),
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  // Close account dropdown on outside click
  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [accountOpen]);

  // Sync plan COD → mode actif (layout app uniquement)
  usePlanCodModeSync();
  const { mode: activeMode } = useActiveMode();

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", activeMode);
  }, [activeMode]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Chargement…
        </div>
      </div>
    );
  }

  // Nav principale : pages utilisées quotidiennement uniquement.
  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/products", label: "Produits" },
    { to: "/entries", label: "Saisies" },
    { to: "/analytics", label: "Analytics", badge: "PRO" as const },
    { to: "/plan", label: "Mon plan" },
  ] as const;

  const modeLabel = activeMode === "cod" ? "COD · FCFA" : "DROP · INTL";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ImpersonationBanner />
      <AnnouncementsBanner userPlan={null} />
      <header className="brutal-border-thin border-t-0 border-l-0 border-r-0 sticky top-0 bg-background z-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-6">
          {/* ZONE GAUCHE : Logo + Mode */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <Link to="/dashboard" className="flex items-center min-w-0">
              <img
                src={activeMode === "dropshipping" ? "/netodash-logo-blue.png" : "/netodash-logo.png"}
                alt="NETODASH"
                width={1650}
                height={297}
                className="h-7 md:h-9 w-auto object-contain shrink-0"
              />
            </Link>
            <div className="hidden md:flex items-center gap-2 pl-3 md:pl-4 border-l border-foreground/20">
              <ModeSwitch variant="desktop" />
              <span className="hidden xl:inline font-mono text-[10px] uppercase tracking-widest font-bold text-accent whitespace-nowrap">
                {modeLabel}
              </span>
            </div>
          </div>

          {/* ZONE CENTRE : Navigation principale */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.to);
              const badge = "badge" in item ? item.badge : undefined;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 text-xs uppercase tracking-widest font-bold whitespace-nowrap brutal-border-thin inline-flex items-center gap-1.5 ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "border-transparent hover:border-foreground"
                  }`}
                >
                  {item.label}
                  {badge && (
                    <span
                      className={`text-[8px] px-1 py-px brutal-border-thin font-mono ${
                        active
                          ? "bg-background text-foreground border-background"
                          : "bg-accent text-accent-foreground border-accent"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ZONE DROITE : Outils + Compte */}
          <div className="hidden lg:flex items-center gap-2">
            <NotificationBell />
            <Link
              to="/roas-calculator"
              className={`px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin whitespace-nowrap ${
                location.pathname.startsWith("/roas-calculator")
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-foreground/30 hover:border-accent hover:text-accent"
              }`}
              title="Calculateur ROAS"
            >
              ⚖ ROAS
            </Link>

            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                className={`px-3 py-2 text-xs uppercase tracking-widest font-bold brutal-border-thin flex items-center gap-1.5 ${
                  accountOpen
                    ? "bg-foreground text-background border-foreground"
                    : "border-foreground/30 hover:border-foreground"
                }`}
              >
                <span>⚙ Compte</span>
                <span className="text-[8px]">▾</span>
              </button>
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 w-56 brutal-border bg-background shadow-[6px_6px_0_0_hsl(var(--foreground))] z-50"
                >
                  <div className="px-3 py-2 border-b border-foreground/20">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      Connecté
                    </div>
                    <div className="text-xs font-bold truncate">{user.email}</div>
                  </div>
                  <Link
                    to="/settings"
                    className="block px-3 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background"
                    role="menuitem"
                  >
                    ⚙ Paramètres
                  </Link>
                  <Link
                    to="/plan"
                    className="block px-3 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background border-t border-foreground/10"
                    role="menuitem"
                  >
                    💳 Mon plan
                  </Link>
                  <div className="border-t border-foreground/10">
                    <ThemeToggle />
                  </div>
                  {isAdmin && (
                    <Link
                      to="/netodsh"
                      search={{ tab: "overview" }}
                      className="block px-3 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background border-t border-foreground/10"
                      role="menuitem"
                    >
                      🛡 Admin
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setAccountOpen(false);
                      await signOut();
                      navigate({ to: "/" });
                    }}
                    className="block w-full text-left px-3 py-2.5 text-xs uppercase tracking-widest font-bold text-accent hover:bg-accent hover:text-accent-foreground border-t border-foreground/10"
                    role="menuitem"
                  >
                    → Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden brutal-border-thin px-3 py-2 font-black"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
            <nav className="max-w-[1600px] mx-auto px-4 py-2 flex flex-col">
              <ModeSwitch variant="mobile" />
              {/* Mon plan — pas présent dans la bottom nav */}
              <Link
                to="/plan"
                className={`px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20 ${
                  location.pathname.startsWith("/plan") ? "text-accent" : ""
                }`}
              >
                Mon plan
              </Link>
              <Link
                to="/analytics"
                className={`px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20 flex items-center justify-between ${
                  location.pathname.startsWith("/analytics") ? "text-accent" : ""
                }`}
              >
                <span>📊 Analytics</span>
                <span className="text-[9px] px-1.5 py-0.5 brutal-border-thin bg-accent text-accent-foreground border-accent font-mono">
                  PRO
                </span>
              </Link>
              <Link
                to="/roas-calculator"
                className={`px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20 ${
                  location.pathname.startsWith("/roas-calculator") ? "text-accent" : ""
                }`}
              >
                ⚖ Calculateur ROAS
              </Link>

              <Link
                to="/settings"
                className="px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20"
              >
                ⚙ Paramètres
              </Link>
              <div className="border-b border-foreground/20">
                <ThemeToggle />
              </div>
              {isAdmin && (
                <Link
                  to="/netodsh"
                  search={{ tab: "overview" }}
                  className="px-2 py-3 text-sm uppercase tracking-widest font-bold border-b border-foreground/20"
                >
                  🛡 Admin
                </Link>
              )}
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await signOut();
                  navigate({ to: "/" });
                }}
                className="px-2 py-3 text-left text-sm uppercase tracking-widest font-bold text-accent"
              >
                Déconnexion
              </button>
            </nav>
          </div>
        )}
      </header>
      {!location.pathname.startsWith("/netodsh") && <ProfileCompletionBanner />}
      {!location.pathname.startsWith("/netodsh") && <Breadcrumbs />}
      {queueSize > 0 && (
        <div className="bg-foreground text-background px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-center">
          ⏱ {queueSize} saisie{queueSize > 1 ? "s" : ""} en attente — synchro au retour du réseau
        </div>
      )}
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <RenewalReminder />
      <OnboardingWelcome />
      <WhatsAppSupport />
      <OnboardingTour />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <QuickEntryFAB />
      <MobileBottomNav onNewEntry={() => navigate({ to: "/entries" })} />
    </div>
  );
}
