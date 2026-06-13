import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/mentions")({
  head: () => ({
    meta: [
      { title: "Mentions légales — NETODASH" },
      { name: "description", content: "Mentions légales de NETODASH — éditeur, hébergement, propriété intellectuelle." },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://netodash.com/legal/mentions" },
    ],
    links: [{ rel: "canonical", href: "https://netodash.com/legal/mentions" }],
  }),
  component: MentionsPage,
});

function MentionsPage() {
  return (
    <LegalShell title="Mentions légales">
      <h2>Éditeur</h2>
      <p>NETODASH — service en ligne d'analyse de rentabilité COD.</p>
      <p>Contact : support@netodash.com</p>

      <h2>Directeur de la publication</h2>
      <p>Le représentant légal de NETODASH.</p>

      <h2>Hébergement</h2>
      <p>
        Cloudflare, Inc. — 101 Townsend Street, San Francisco, CA 94107, USA.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus du site (textes, logos, graphismes, code) sont
        la propriété exclusive de NETODASH, sauf mention contraire. Toute
        reproduction sans autorisation est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        NETODASH met tout en œuvre pour fournir des informations fiables, mais
        ne peut garantir l'exactitude, la complétude ou l'actualité des
        informations diffusées sur le site.
      </p>
    </LegalShell>
  );
}

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="brutal-border-thin border-t-0 border-l-0 border-r-0">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/netodash-logo.png" alt="NETODASH" className="h-9 w-auto object-contain" />
          </Link>
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-widest hover:text-accent"
          >
            ← Retour
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-10">
          {title}
        </h1>
        <div className="space-y-5 font-mono text-sm leading-relaxed text-muted-foreground [&>h2]:text-foreground [&>h2]:font-black [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:text-base [&>h2]:mt-8 [&>h2]:mb-2">
          {children}
        </div>
      </main>
      <footer className="border-t border-foreground mt-10">
        <div className="max-w-[1400px] mx-auto px-6 py-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} NETODASH
        </div>
      </footer>
    </div>
  );
}
