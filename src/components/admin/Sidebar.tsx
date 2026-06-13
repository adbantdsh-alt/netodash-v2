import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Share2,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { AdminLogo } from "./AdminLogo";

type Item = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const items: Item[] = [
  { to: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Utilisateurs", icon: Users },
  { to: "/admin/revenue", label: "Revenus", icon: DollarSign },
  { to: "/admin/affiliates", label: "Affiliation", icon: Share2 },
  { to: "/admin/communication", label: "Communication", icon: MessageSquare },
  { to: "/admin/security", label: "Sécurité & Logs", icon: Shield },
  { to: "/admin/settings", label: "Paramètres", icon: Settings },
];

function NavBody({
  email,
  role,
  onSignOut,
  onNavigate,
  pathname,
  showClose,
  onClose,
}: {
  email: string;
  role: string;
  onSignOut: () => void;
  onNavigate?: () => void;
  pathname: string;
  showClose?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      <div
        className="p-5 border-b flex items-start justify-between gap-2"
        style={{ borderColor: "#222" }}
      >
        <div>
          <AdminLogo inverted />
          <div className="text-[10px] uppercase tracking-widest mt-1 opacity-60">
            Back-office
          </div>
        </div>
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="p-2 -m-2"
            style={{ color: "#fff" }}
          >
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.exact
            ? pathname === it.to
            : pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to as never}
              onClick={onNavigate}
              className="flex items-center gap-3 px-5 py-3 text-sm font-bold uppercase tracking-wider"
              style={{
                background: active ? "#E05C1A" : "transparent",
                color: "#fff",
                borderLeft: active ? "4px solid #fff" : "4px solid transparent",
              }}
            >
              <Icon size={16} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: "#222" }}>
        <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
          Connecté
        </div>
        <div className="text-xs font-bold truncate">{email}</div>
        <div className="text-[10px] uppercase tracking-widest mt-0.5 opacity-60">
          {(role ?? "").replace("_", " ")}
        </div>
        <button
          onClick={onSignOut}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider"
          style={{ background: "#fff", color: "#000" }}
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </>
  );
}

export function AdminSidebar({
  email,
  role,
  onSignOut,
  mobileOpen = false,
  onMobileClose,
}: {
  email: string;
  role: string;
  onSignOut: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const location = useLocation();
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        style={{ background: "#000", color: "#fff", width: 240, minHeight: "100vh" }}
        className="fixed inset-y-0 left-0 z-40 hidden flex-col overflow-y-auto md:flex"
      >
        <NavBody
          email={email}
          role={role}
          onSignOut={onSignOut}
          pathname={location.pathname}
        />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          onClick={onMobileClose}
          className="absolute inset-0 bg-black/60 transition-opacity"
          style={{ opacity: mobileOpen ? 1 : 0 }}
        />
        {/* Panel */}
        <aside
          className="absolute inset-y-0 left-0 flex flex-col overflow-hidden transition-transform duration-200"
          style={{
            background: "#000",
            color: "#fff",
            width: "min(280px, 85vw)",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <NavBody
            email={email}
            role={role}
            onSignOut={() => {
              onMobileClose?.();
              onSignOut();
            }}
            onNavigate={onMobileClose}
            pathname={location.pathname}
            showClose
            onClose={onMobileClose}
          />
        </aside>
      </div>
    </>
  );
}
