import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/Logo";

type Variant = "dropshipping" | "cod";

export function SiteHeader({ variant }: { variant: Variant }) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const other = variant === "dropshipping" ? "cod" : "dropshipping";
  const otherLabel = other === "cod" ? "Tu fais du COD ?" : "Tu fais du Dropshipping ?";
  const otherHref = `/${other}`;

  return (
    <header className="sticky top-0 z-50 bg-background brutal-border-thin border-t-0 border-l-0 border-r-0">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-5 flex items-center justify-between gap-2">
        <a href="#top" className="flex items-center gap-2 min-w-0">
          <Logo
            mode={variant}
            priority
            className="h-8 md:h-10 w-auto object-contain shrink-0"
          />
          <span className="hidden lg:inline ml-1 brutal-border-thin px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono bg-accent text-accent-foreground border-accent">
            {variant === "cod" ? "COD · FCFA" : "Dropshipping"}
          </span>
        </a>


        <nav className="hidden md:flex items-center gap-2">
          <Link
            to={otherHref as never}
            className="px-3 py-2 font-bold uppercase tracking-wider text-xs hover:text-accent underline underline-offset-4 decoration-dotted"
          >
            {otherLabel} →
          </Link>
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
              <Link
                to="/auth"
                className="px-4 py-2.5 font-bold uppercase tracking-wider text-sm hover:text-accent"
              >
                Connexion
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="brutal-border bg-foreground text-background px-5 py-2.5 font-bold uppercase tracking-wider text-sm hover:bg-accent hover:border-accent"
              >
                Commencer
              </Link>
            </>
          )}
        </nav>

        <div className="flex md:hidden items-center gap-2">
          {!loading && user ? (
            <Link
              to="/dashboard"
              className="brutal-border bg-accent text-accent-foreground border-accent px-3 py-2 font-bold uppercase tracking-wider text-xs"
            >
              Dashboard →
            </Link>
          ) : (
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="brutal-border bg-foreground text-background px-3 py-2 font-bold uppercase tracking-wider text-xs"
            >
              Commencer
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
              to={otherHref as never}
              onClick={() => setOpen(false)}
              className="px-2 py-3 font-bold uppercase tracking-wider text-xs border-b border-foreground/20 text-accent"
            >
              {otherLabel} →
            </Link>
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
              className="px-2 py-3 font-bold uppercase tracking-wider text-sm border-b border-foreground/20"
            >
              Contact
            </Link>
            {!loading && !user && (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="px-2 py-3 font-bold uppercase tracking-wider text-sm"
              >
                Connexion
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
