import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/Logo";

// Header unique du site.
//
// Les boutons « Connexion » et « Créer un compte » ont été retirés de la
// landing (inscriptions fermées côté site public) : la navigation ne propose
// plus que Calc. ROAS / Tarifs / Contact, et « Dashboard → » uniquement aux
// visiteurs déjà connectés. La page /auth reste accessible par URL directe.
type Variant = "dropshipping" | "cod";

export function SiteHeader({ variant = "dropshipping" }: { variant?: Variant } = {}) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background brutal-border-thin border-t-0 border-l-0 border-r-0">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-5 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <Logo size="md" />
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {!loading && user ? (
            <Link
              to="/dashboard"
              className="brutal-border bg-accent text-accent-foreground px-5 py-2.5 font-bold uppercase tracking-wider text-sm border-accent"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/calculateur-roas"
                className="px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent"
              >
                Calc. ROAS
              </Link>
              <a
                href="#pricing"
                className="px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent"
              >
                Tarifs
              </a>
              <Link
                to="/contact"
                className="px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent"
              >
                Contact
              </Link>
            </>
          )}
        </nav>

        <div className="flex md:hidden items-center gap-2">
          {!loading && user && (
            <Link
              to="/dashboard"
              className="brutal-border bg-accent text-accent-foreground border-accent px-3 py-2 font-bold uppercase tracking-wider text-xs"
            >
              Dashboard →
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="brutal-border-thin px-3 py-2 font-black"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden brutal-border-thin border-l-0 border-r-0 border-b-0 bg-background">
          <nav className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col">
            <Link
              to="/calculateur-roas"
              onClick={() => setOpen(false)}
              className="px-2 py-3 font-bold uppercase tracking-wider text-sm border-b border-foreground/20"
            >
              Calculateur ROAS gratuit
            </Link>
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="px-2 py-3 font-bold uppercase tracking-wider text-sm border-b border-foreground/20"
            >
              Tarifs
            </a>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="px-2 py-3 font-bold uppercase tracking-wider text-sm"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
