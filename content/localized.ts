import type { Lang } from "../lib/i18n/languages.ts";
import { pick } from "../lib/i18n/languages.ts";
import { aboutParagraphs, aboutParagraphsEn, milestones, milestonesEn, principles, principlesEn } from "./about.ts";
import { faqsFor, homeFaqs, localizeFaq } from "./faq.ts";
import { situations, situationsEn, steps, stepsEn } from "./journey.ts";
import { legalDocs, legalDocsEn } from "./legal.ts";
import { googleRating, googleRatingEn, reviews, reviewsEn } from "./reviews.ts";
import { contactTopics, localizeService, services } from "./services.ts";
import { site, siteEn } from "./site.ts";

/** Every content collection in one language, so server components never branch on `lang` themselves. */
export function getContent(lang: Lang) {
  const localizedServices = services.map((s) => localizeService(s, lang));
  const localizedReviews = pick(lang, reviews, reviewsEn);
  return {
    site: lang === "en" ? { ...site, ...siteEn } : site,
    services: localizedServices,
    /** Form topics stay Hebrew in both languages: they are the values the office receives. */
    contactTopics,
    about: {
      paragraphs: pick(lang, aboutParagraphs, aboutParagraphsEn),
      milestones: pick(lang, milestones, milestonesEn),
      principles: pick(lang, principles, principlesEn),
    },
    homeFaqs: homeFaqs.map((f) => localizeFaq(f, lang)),
    faqsFor: (serviceId: string) => faqsFor(serviceId).map((f) => localizeFaq(f, lang)),
    steps: pick(lang, steps, stepsEn),
    situationsFor: (serviceId: string) =>
      situations
        .filter((s) => s.serviceId === serviceId)
        .map((s) => (lang === "en" ? { ...s, text: situationsEn[s.text] ?? s.text } : s)),
    reviews: localizedReviews,
    googleRating: pick(lang, googleRating, googleRatingEn),
    reviewForService: (serviceId: string) => localizedReviews[services.findIndex((s) => s.id === serviceId) % localizedReviews.length],
    legalDocs: pick(lang, legalDocs, legalDocsEn),
  };
}
