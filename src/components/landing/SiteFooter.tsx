import { Link } from "@tanstack/react-router";

export function SiteFooter({
  tagline,
  baseline,
}: {
  tagline: string;
  baseline: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-foreground bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <img
                src="/netodash-logo.png"
                alt="NETODASH"
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 object-contain"
              />
              <span className="font-black text-xl tracking-tight">NETODASH</span>
            </div>
            <p className="font-mono text-xs text-background/70 leading-relaxed">
              {tagline}
            </p>
          </div>

          <div>
            <div className="font-black uppercase tracking-widest text-xs mb-4">
              Produit
            </div>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <Link to="/dropshipping" className="text-background/70 hover:text-accent">
                  Pour Dropshipping
                </Link>
              </li>
              <li>
                <Link to="/cod" className="text-background/70 hover:text-accent">
                  Pour COD (Afrique)
                </Link>
              </li>
              <li>
                <Link to="/calculateur-roas" className="text-background/70 hover:text-accent">
                  Calculateur ROAS gratuit
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-background/70 hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-background/70 hover:text-accent">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-black uppercase tracking-widest text-xs mb-4">
              Légal
            </div>
            <ul className="space-y-2 font-mono text-sm">
              <li><Link to="/legal/mentions" className="text-background/70 hover:text-accent">Mentions légales</Link></li>
              <li><Link to="/legal/cgu" className="text-background/70 hover:text-accent">CGU</Link></li>
              <li><Link to="/legal/cgv" className="text-background/70 hover:text-accent">CGV</Link></li>
              <li><Link to="/legal/privacy" className="text-background/70 hover:text-accent">Confidentialité</Link></li>
              <li><Link to="/legal/cookies" className="text-background/70 hover:text-accent">Cookies</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-black uppercase tracking-widest text-xs mb-4">
              Contact
            </div>
            <ul className="space-y-2 font-mono text-sm text-background/70">
              <li>
                <a href="mailto:support@netodash.com" className="hover:text-accent break-all">
                  support@netodash.com
                </a>
              </li>
              <li>Éditeur : NETODASH</li>
              <li>Hébergeur : Cloudflare, Inc.</li>
              <li>Paiements : Stripe 🔒</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-widest text-background/70">
            © {year} NETODASH · {baseline}
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-background/70">
            Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
