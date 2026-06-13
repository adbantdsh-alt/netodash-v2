import { createFileRoute, Link } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";

const URL = "https://netodash.com/blog";
const TITLE = "Blog NETODASH — Dropshipping, COD, ROAS, marge nette";
const DESC =
  "Guides actionnables sur le dropshipping, le Cash on Delivery en Afrique, le calcul du ROAS net et la rentabilité réelle e-commerce.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog NETODASH",
          url: URL,
          inLanguage: "fr-FR",
          publisher: {
            "@type": "Organization",
            name: "NETODASH",
            logo: { "@type": "ImageObject", url: "https://netodash.com/netodash-logo.png" },
          },
          blogPost: BLOG_POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.publishedAt,
            url: `https://netodash.com/blog/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="cod" />

      <header className="brutal-grid">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">
            ▍ BLOG · GUIDES RENTABILITÉ
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            Le blog qui te dit la <span className="text-accent">vérité</span><br />
            sur ta rentabilité e-commerce.
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-2xl text-muted-foreground">
            Pas de promesse magique. Des formules, des benchmarks, des stratégies qui marchent en Dropshipping et en COD Afrique.
          </p>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="brutal-border bg-background p-6 flex flex-col hover:-translate-y-1 hover:shadow-[8px_8px_0_0_hsl(var(--accent))] transition-transform">
              <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-accent mb-3">
                {post.category} · {post.readMin} min
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="hover:text-accent"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="mt-5 inline-block brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-accent-foreground hover:border-accent"
              >
                Lire l'article →
              </Link>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter tagline="On t'apprend à compter." baseline="Pour que tu arrêtes de te mentir." />
    </div>
  );
}
