import type { Metadata } from "next";
import { site } from "@/content/site";
import { type Lang, localePath } from "@/lib/i18n/languages";

const OG_LOCALE: Record<Lang, string> = { he: "he_IL", en: "en_US" };

/** Shared by both root layouts: what does not change per page or language. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
};

/**
 * Metadata for one page in one language. `path` is the Hebrew path ("/", "/insurance"); the English page lives at /en + path.
 * Every page declares its canonical URL and both language versions (hreflang he / en, x-default = Hebrew),
 * so search engines show each visitor the right language and never treat the two as duplicates.
 */
export function pageMetadata({ lang, path, title, description }: { lang: Lang; path: string; title: string; description: string }): Metadata {
  const url = localePath(lang, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { he: path, en: localePath("en", path), "x-default": path },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[lang === "he" ? "en" : "he"],
      url,
      title,
      description,
      images: [{ url: site.images.share }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
