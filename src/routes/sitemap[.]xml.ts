import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://netodash.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

import { BLOG_POSTS } from "@/lib/blog-posts";

// Le COD est retiré du produit : plus aucune URL /cod* dans le sitemap.
// Elles sont redirigées en 301 vers / (voir les routeRules Nitro dans
// vite.config.ts) — un 301 transmet le référencement, l'absence du sitemap
// accélère simplement la sortie de l'index.
const ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/calculateur-roas", changefreq: "monthly", priority: "0.9" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.85" },
  ...BLOG_POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly" as const,
    priority: "0.8",
  })),
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/legal/mentions", changefreq: "yearly", priority: "0.2" },
  { path: "/legal/cgu", changefreq: "yearly", priority: "0.2" },
  { path: "/legal/cgv", changefreq: "yearly", priority: "0.2" },
  { path: "/legal/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/legal/cookies", changefreq: "yearly", priority: "0.2" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = new Date().toISOString().split("T")[0];
        const urls = ENTRIES.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
