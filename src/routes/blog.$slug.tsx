import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { BetaCtaButton } from "@/components/BetaCtaButton";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [] };
    const url = `https://netodash.com/blog/${params.slug}`;
    return {
      meta: [
        { title: `${p.title} — NETODASH` },
        { name: "description", content: p.description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { name: "article:published_time", content: p.publishedAt },
        { property: "og:type", content: "article" },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.description },
        { property: "og:url", content: url },
        { property: "og:locale", content: "fr_FR" },
        { property: "article:published_time", content: p.publishedAt },
        { property: "article:section", content: p.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: p.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                headline: p.title,
                description: p.description,
                datePublished: p.publishedAt,
                inLanguage: "fr-FR",
                mainEntityOfPage: url,
                articleSection: p.category,
                keywords: p.tags.join(", "),
                author: { "@type": "Organization", name: "NETODASH" },
                publisher: {
                  "@type": "Organization",
                  name: "NETODASH",
                  logo: { "@type": "ImageObject", url: "https://netodash.com/netodash-logo.png" },
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Accueil", item: "https://netodash.com/" },
                  { "@type": "ListItem", position: 2, name: "Blog", item: "https://netodash.com/blog" },
                  { "@type": "ListItem", position: 3, name: p.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-black">Article introuvable</h1>
        <Link to="/blog" className="mt-6 inline-block brutal-border px-6 py-3 font-bold uppercase">
          ← Retour blog
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-3xl font-black">Erreur</h1>
        <p className="mt-2 text-sm font-mono">{error.message}</p>
        <button onClick={reset} className="mt-6 brutal-border px-6 py-3 font-bold uppercase">
          Réessayer
        </button>
      </div>
    </div>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader variant="cod" />

      <nav
        aria-label="Fil d'Ariane"
        className="max-w-[1000px] mx-auto px-4 md:px-6 pt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2"
      >
        <Link to="/" className="hover:text-accent">Accueil</Link>
        <span className="opacity-40">/</span>
        <Link to="/blog" className="hover:text-accent">Blog</Link>
        <span className="opacity-40">/</span>
        <span className="text-foreground font-bold truncate">{post.category}</span>
      </nav>

      <article className="max-w-[820px] mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-4">
          {post.category} · {post.readMin} min de lecture
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-[1.05]">
          {post.title}
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>

        <div
          className="prose-blog mt-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="mt-12 brutal-border bg-accent text-accent-foreground border-accent p-6 md:p-8">
          <div className="font-mono text-xs uppercase tracking-widest font-bold opacity-80">
            ▍ NETODASH
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight">
            Calcule ta rentabilité réelle en 5 minutes
          </h2>
          <p className="mt-3 text-sm md:text-base opacity-90">
            Plus jamais d'Excel. ROAS net, marge réelle, taux de livraison COD — Netodash le fait pour toi.
          </p>
          <BetaCtaButton variant="hero" className="mt-5 px-6 py-3 text-sm border-foreground" />
        </div>
      </article>

      <section className="brutal-border-thin border-l-0 border-r-0 bg-foreground/[0.02]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
            À lire aussi
          </h2>
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/blog/$slug"
                params={{ slug: o.slug }}
                className="brutal-border bg-background p-5 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_hsl(var(--accent))] transition-transform block"
              >
                <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-accent mb-2">
                  {o.category}
                </div>
                <div className="font-black text-base leading-tight">{o.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter tagline="On t'apprend à compter." baseline="Pour que tu arrêtes de te mentir." />
    </div>
  );
}
