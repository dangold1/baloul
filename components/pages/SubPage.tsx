import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLegalDoc, legalDocs, legalDocsEn } from "@/content/legal";
import { getService, localizeService, services } from "@/content/services";
import type { Lang } from "@/lib/i18n/languages";
import { pageMetadata } from "@/lib/seo";
import { PageChrome } from "@/components/layout/PageChrome";
import { LegalPage } from "@/components/legal/LegalPage";
import { ServicePage } from "@/components/service/ServicePage";

/** The four service pages and the legal documents, the same slugs in both languages. */
export const subPageSlugs = [...services.map((s) => s.slug), ...legalDocs.map((d) => d.slug)];

export function subPageMetadata(lang: Lang, slug: string): Metadata {
  const path = `/${slug}`;
  const service = getService(slug);
  if (service) {
    const s = localizeService(service, lang);
    return pageMetadata({ lang, path, title: s.metaTitle, description: s.metaDescription });
  }
  const doc = (lang === "en" ? legalDocsEn : legalDocs).find((d) => d.slug === slug);
  return doc ? pageMetadata({ lang, path, title: `${doc.title} | BALOUL`, description: doc.intro }) : {};
}

/** A service page or a legal document, by slug. Same component for /x and /en/x. */
export function SubPage({ lang, slug }: { lang: Lang; slug: string }) {
  const service = getService(slug);
  if (service) {
    return (
      <PageChrome lang={lang} variant="service">
        <ServicePage lang={lang} service={service} />
      </PageChrome>
    );
  }
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  return (
    <PageChrome lang={lang} variant="legal">
      <LegalPage lang={lang} doc={doc} />
    </PageChrome>
  );
}
