import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { legalDocs } from "@/content/legal";
import { LANGS, localePath } from "@/lib/i18n/languages";

export const dynamic = "force-static";

type Page = { path: string; changeFrequency: "monthly" | "yearly"; priority: number };

const pages: Page[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  ...services.map((s) => ({ path: `/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ...legalDocs.map((d) => ({ path: `/${d.slug}`, changeFrequency: "yearly" as const, priority: 0.2 })),
];

/** Every page in both languages; each entry lists its Hebrew and English versions (xhtml:link hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (lang: (typeof LANGS)[number], path: string) => `${site.url}${localePath(lang, path)}`;
  /** Build time: the site is static, so every deploy is the last change. Google reads lastmod and ignores changefreq/priority. */
  const lastModified = new Date();
  return pages.flatMap((p) =>
    LANGS.map((lang) => ({
      url: url(lang, p.path),
      lastModified,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      alternates: { languages: { he: url("he", p.path), en: url("en", p.path), "x-default": url("he", p.path) } },
    })),
  );
}
