import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLegalDoc, legalDocs, legalDocsEn } from "@/content/legal";
import { getService, localizeService, services } from "@/content/services";
import type { Lang } from "@/lib/i18n/languages";
import { pageMetadata } from "@/lib/seo";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { HashLinkController } from "@/components/layout/HashLinkController";
import { LegalPage } from "@/components/legal/LegalPage";
import { ServicePage } from "@/components/service/ServicePage";
import { LeadPopup } from "@/components/lead/LeadPopup";

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
export function SubPage({ slug }: { slug: string }) {
  const service = getService(slug);
  if (service) {
    return (
      <>
        <UtilityBar />
        <Header home={false} contactHref="#contact" />
        <ServicePage service={service} />
        <Footer base="/" />
        <LeadPopup />
        <FloatingWhatsApp />
        <HashLinkController />
      </>
    );
  }
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  return (
    <>
      <UtilityBar />
      <Header home={false} />
      <LegalPage doc={doc} />
      <Footer base="/" />
      <FloatingWhatsApp />
    </>
  );
}
