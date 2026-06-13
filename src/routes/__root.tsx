import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-[10rem] leading-none font-black text-foreground">404</h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
          Cette page n'existe pas.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="brutal-border bg-foreground text-background px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
          >
            Retour
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NETODASH — Rentabilité réelle Dropshipping & COD" },
      {
        name: "description",
        content:
          "Le dashboard de rentabilité 360° pour Dropshipping & COD : ROAS net, marge réelle, CPA max, taux de livraison. Shopify, Meta Ads, TikTok Ads, FCFA.",
      },
      { name: "author", content: "NETODASH" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:site_name", content: "NETODASH" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "NETODASH — Rentabilité réelle Dropshipping & COD" },
      {
        property: "og:description",
        content:
          "Calcule ta marge réelle basée sur les commandes livrées — pas sur les commandes Shopify. ROAS net, CPA max, taux de livraison.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NETODASH — Rentabilité réelle Dropshipping & COD" },
      {
        name: "twitter:description",
        content:
          "Dashboard rentabilité 360° pour Dropshipping & COD : ROAS net, marge réelle, CPA max, taux de livraison.",
      },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/mV7h6YTkYxXxdYgCHLJxrtztuOF3/social-images/social-1780681419061-yrjregbh-yh.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/mV7h6YTkYxXxdYgCHLJxrtztuOF3/social-images/social-1780681419061-yrjregbh-yh.webp" },
      { name: "description", content: "NETODASH is a business intelligence SaaS app for African e-commerce merchants to calculate profitability and manage product data." },
      { property: "og:description", content: "NETODASH is a business intelligence SaaS app for African e-commerce merchants to calculate profitability and manage product data." },
      { name: "twitter:description", content: "NETODASH is a business intelligence SaaS app for African e-commerce merchants to calculate profitability and manage product data." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "NETODASH",
              url: "https://netodash.com",
              logo: "https://netodash.com/netodash-logo.png",
              sameAs: ["https://netodash.com"],
            },
            {
              "@type": "WebSite",
              name: "NETODASH",
              url: "https://netodash.com",
              inLanguage: "fr-FR",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://netodash.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon-netodash.png" },
      { rel: "shortcut icon", type: "image/png", href: "/favicon-netodash.png" },
      { rel: "apple-touch-icon", href: "/favicon-netodash.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <WhatsAppSupport />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#000",
              color: "#fff",
              border: "2px solid #fff",
              borderRadius: 0,
              fontWeight: 600,
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
