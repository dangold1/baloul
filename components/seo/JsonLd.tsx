import { site, siteEn } from "@/content/site";
import type { Faq } from "@/content/faq";
import { homeFaqs, localizeFaq } from "@/content/faq";
import type { Service } from "@/content/services";
import { localizeService, services, servicePath } from "@/content/services";
import { aboutParagraphs, aboutParagraphsEn } from "@/content/about";
import { type Lang, localePath, pick } from "@/lib/i18n/languages";

/** One agency entity for both languages: the same @id on /… and /en/…, so search engines see one business, BALOUL. */
const orgId = `${site.url}/#organization`;
const pageUrl = (lang: Lang, path: string) => `${site.url}${localePath(lang, path)}`;
const LANGUAGES = ["he", "en"];

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

const addressNode = (lang: Lang) => ({
  "@type": "PostalAddress",
  streetAddress: pick(lang, site.address.street, "15 Ehud Manor St."),
  addressLocality: pick(lang, site.address.city, "Holon"),
  addressCountry: site.address.country,
});

/** Where the agency works: the city first, then the country. No coordinates or postal code: only facts shown on the page. */
const areaServed = (lang: Lang) => [
  { "@type": "City", name: pick(lang, site.address.city, "Holon") },
  { "@type": "Country", name: "Israel" },
];

/** The agency in short, for pages without the full Organization node (service pages), so `provider` resolves on the page itself. */
const providerNode = (lang: Lang) => ({
  "@type": "InsuranceAgency",
  "@id": orgId,
  name: site.name,
  url: pageUrl(lang, "/"),
  telephone: site.phone.e164,
  logo: `${site.url}${site.images.logo.src}`,
  address: addressNode(lang),
});

function serviceNode(heService: Service, lang: Lang) {
  const s = localizeService(heService, lang);
  const url = pageUrl(lang, servicePath(s));
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: s.title,
    description: s.metaDescription,
    url,
    serviceType: s.title,
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "Israel" },
    availableLanguage: LANGUAGES,
    inLanguage: lang,
  };
}

/**
 * Structured data for search engines and AI assistants: who the agency is, where it is,
 * since when, and which services it offers. Only facts that also appear on the page, in the page's language.
 */
export function OrganizationJsonLd({ lang }: { lang: Lang }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "InsuranceAgency",
        "@id": orgId,
        name: site.name,
        alternateName: ["בלול סוכנות לביטוח ופיננסים", "BALOUL פיננסים פנסיה וביטוח", "BALOUL Finance, Pensions and Insurance"],
        description: pick(lang, site.description, siteEn.description),
        slogan: pick(lang, site.tagline, siteEn.tagline),
        disambiguatingDescription: pick(lang, aboutParagraphs, aboutParagraphsEn).join(" "),
        url: pageUrl(lang, "/"),
        logo: `${site.url}${site.images.logo.src}`,
        image: `${site.url}${site.images.share}`,
        telephone: site.phone.e164,
        email: site.email,
        foundingDate: String(site.foundedYear),
        founder: { "@type": "Person", name: pick(lang, "יצחק בלול", "Yitzhak Baloul") },
        address: addressNode(lang),
        hasMap: site.address.mapsUrl,
        areaServed: areaServed(lang),
        knowsLanguage: LANGUAGES,
        knowsAbout: services.map((s) => localizeService(s, lang)).flatMap((s) => [s.title, ...s.bullets]),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: pick(lang, "תחומי פעילות", "Services"),
          itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: serviceNode(s, lang) })),
        },
        contactPoint: [{ "@type": "ContactPoint", contactType: "customer service", telephone: site.phone.e164, availableLanguage: LANGUAGES }],
        sameAs: [site.social.facebook],
      }}
    />
  );
}

export function WebsiteJsonLd({ lang }: { lang: Lang }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${pageUrl(lang, "/")}#website`,
        url: pageUrl(lang, "/"),
        name: site.name,
        inLanguage: pick(lang, "he-IL", "en"),
        publisher: { "@id": orgId },
      }}
    />
  );
}

/** FAQPage for the questions actually shown on the page, in its language. Pass the Hebrew questions; they are localized here. */
export function FaqJsonLd({ lang, faqs = homeFaqs }: { lang: Lang; faqs?: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: lang,
        mainEntity: faqs.map((faq) => {
          const f = localizeFaq(faq, lang);
          return { "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } };
        }),
      }}
    />
  );
}

/** Pass the Hebrew service; it is localized here. The provider is spelled out because the page has no Organization node to point at. */
export function ServiceJsonLd({ lang, service }: { lang: Lang; service: Service }) {
  return <JsonLd data={{ "@context": "https://schema.org", ...serviceNode(service, lang), provider: providerNode(lang) }} />;
}

/** Items take Hebrew paths ("/", "/insurance"); URLs follow the page's language. */
export function BreadcrumbJsonLd({ lang, items }: { lang: Lang; items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: pageUrl(lang, it.path) })),
      }}
    />
  );
}
