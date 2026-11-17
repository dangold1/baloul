import { getContent } from "@/content/localized";
import { faqsFor } from "@/content/faq";
import type { Service } from "@/content/services";
import { localizeService, servicePath } from "@/content/services";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { SectionHead } from "@/components/ui/SectionHeading";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";
import { StepsList } from "@/components/blocks/StepsList";
import { FaqList } from "@/components/blocks/FaqList";
import { ReviewCard } from "@/components/blocks/ReviewCard";
import { GoogleReviewsLink } from "@/components/blocks/GoogleReviewsLink";
import { ContactBlock } from "@/components/blocks/ContactBlock";
import { ServiceLinks } from "@/components/blocks/ServiceLinks";
import { ServiceHero } from "./ServiceHero";
import { ServiceSituations } from "./ServiceSituations";
import { ServiceChecks } from "./ServiceChecks";

/**
 * One service page. Same structure for all four:
 * intro → situations → what we check → the four steps → topic FAQ → one review → form with the topic preselected.
 */
export function ServicePage({ lang, service }: { lang: Lang; service: Service }) {
  const { t } = makeI18n(lang);
  const content = getContent(lang);
  const s = localizeService(service, lang);
  /** The service name inside an English sentence: "Questions about financial planning". */
  const topic = lang === "en" ? s.title.toLowerCase() : s.title;
  return (
    <main id="top" className="b-service-page">
      <span id="main" tabIndex={-1} />
      {/* Structured data in the page's language, with URLs of this language version. */}
      <ServiceJsonLd lang={lang} service={service} />
      <BreadcrumbJsonLd lang={lang} items={[{ name: t("common.home"), path: "/" }, { name: s.title, path: servicePath(s) }]} />
      <FaqJsonLd lang={lang} faqs={faqsFor(s.id)} />
      <ServiceHero lang={lang} service={s} />
      <ServiceSituations lang={lang} service={s} />
      <ServiceChecks lang={lang} service={s} />
      <section className="b-section b-process" aria-labelledby="serviceProcessTitle">
        <div className="b-container">
          <SectionHead eyebrow={t("process.eyebrow")} title={t("process.title")} titleId="serviceProcessTitle" />
          <StepsList steps={content.steps} />
        </div>
      </section>
      <section className="b-section b-knowledge" aria-labelledby="serviceFaqTitle">
        <div className="b-container b-knowledge-wrap">
          <SectionHead eyebrow={t("nav.knowledge")} title={t("service.faqTitle", { topic })} titleId="serviceFaqTitle" lead={t("service.faqLead")} />
          <FaqList faqs={content.faqsFor(s.id)} name="service-faq" />
        </div>
      </section>
      <section className="b-section b-reviews" aria-label={t("nav.reviews")}>
        <div className="b-container b-review-single">
          <ReviewCard review={content.reviewForService(s.id)} starsLabel={t("common.stars")} />
          <GoogleReviewsLink lang={lang} variant="text" />
        </div>
      </section>
      <section className="b-section b-contact" id="contact" aria-labelledby="serviceContactTitle">
        <ContactBlock
          lang={lang}
          titleId="serviceContactTitle"
          title={t("contact.title")}
          lead={t("service.contactLead", { topic })}
          show={["phone", "whatsapp"]}
          defaultTopic={s.topic}
        />
      </section>
      <ServiceLinks lang={lang} exclude={s.id} title={t("service.others")} />
    </main>
  );
}
