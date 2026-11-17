"use client";

import type { Service } from "@/content/services";
import { contactTopics, localizeService, services, servicePath } from "@/content/services";
import { situations, situationsEn, steps, stepsEn } from "@/content/journey";
import { faqsFor, localizeFaq } from "@/content/faq";
import { googleRating, googleRatingEn, reviews, reviewsEn } from "@/content/reviews";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { pick } from "@/lib/i18n/languages";
import { site } from "@/content/site";
import { ContactForm } from "@/components/lead/ContactForm";
import { ArrowIcon, PhoneIcon, ServiceIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { SectionHead } from "@/components/ui/SectionHeading";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";
import { contactLink } from "@/lib/contact";
import { ButtonLink } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";

/**
 * One service page. Same structure for all four:
 * intro → situations → what we check → the four steps → topic FAQ → one review → form with the topic preselected.
 */
export function ServicePage({ service: heService }: { service: Service }) {
  const { lang, t, href } = useLanguage();
  const phone = contactLink("phone", lang);
  const whatsapp = contactLink("whatsapp", lang);
  const service = localizeService(heService, lang);
  const mySituations = situations.filter((s) => s.serviceId === service.id);
  const heFaqs = faqsFor(service.id);
  const myFaqs = heFaqs.map((f) => localizeFaq(f, lang));
  const index = services.findIndex((s) => s.id === service.id);
  const review = pick(lang, reviews, reviewsEn)[index % reviews.length];
  const rating = pick(lang, googleRating, googleRatingEn);
  /** The service name inside an English sentence: "Questions about financial planning". */
  const topicInText = lang === "en" ? service.title.toLowerCase() : service.title;
  const others = services.filter((s) => s.id !== service.id).map((s) => localizeService(s, lang));

  return (
    <main id="top" className="b-service-page">
      <span id="main" tabIndex={-1} />
      {/* Structured data in the page's language, with URLs of this language version. */}
      <ServiceJsonLd lang={lang} service={heService} />
      <BreadcrumbJsonLd
        lang={lang}
        items={[
          { name: t("common.home"), path: "/" },
          { name: service.title, path: servicePath(service) },
        ]}
      />
      <FaqJsonLd lang={lang} faqs={heFaqs} />

      <section className="b-service-hero" aria-labelledby="serviceTitle">
        <div className="b-container">
          <nav aria-label={t("service.crumbsLabel")} className="b-crumbs">
            <a href={href("/")}>{t("common.home")}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{service.title}</span>
          </nav>
          <div className="b-service-hero-grid">
            <div>
              <p className="b-kicker">{t("nav.services")}</p>
              <h1 id="serviceTitle">{service.title}</h1>
              <p className="b-hero-lead">{service.intro}</p>
              <div className="b-hero-actions">
                <ButtonLink href="#contact">{t("common.cta")}</ButtonLink>
              </div>
              <p className="b-hero-call">
                <PhoneIcon />
                {t("hero.call")} <a href={phone.href}>{phone.display}</a>
              </p>
            </div>
            <dl className="b-service-facts" aria-label={t("service.factsLabel")}>
              <div>
                <dt>{t("service.factActive")}</dt>
                <dd>{t("service.factSince", { year: site.foundedYear })}</dd>
              </div>
              <div>
                <dt>{rating.countLabel}</dt>
                <dd>{rating.score}</dd>
              </div>
              <div>
                <dt>{t("service.factOffice")}</dt>
                <dd>{t("service.street")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="b-section b-situations" aria-labelledby="serviceSituationsTitle">
        <div className="b-container">
          <SectionHead eyebrow={t("service.situationsEyebrow")} title={t("service.situationsTitle")} titleId="serviceSituationsTitle" />
          <ul className="b-situation-list">
            {mySituations.map((s) => (
              <li key={s.text}>
                <a className="b-situation" href="#contact">
                  <span className="b-situation-text">{lang === "en" ? (situationsEn[s.text] ?? s.text) : s.text}</span>
                  <span className="b-situation-link">
                    {t("service.situationLink")}
                    <ArrowIcon />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="b-section b-checks" aria-labelledby="checksTitle">
        <div className="b-container b-checks-grid">
          <div>
            <SectionHead eyebrow={t("service.checksEyebrow")} title={service.checksHeading} titleId="checksTitle" lead={service.description} />
          </div>
          <ul className="b-checks-list">
            {service.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="b-section b-process" aria-labelledby="serviceProcessTitle">
        <div className="b-container">
          <SectionHead eyebrow={t("process.eyebrow")} title={t("process.title")} titleId="serviceProcessTitle" />
          <ol className="b-steps">
            {pick(lang, steps, stepsEn).map((s, i) => (
              <li key={i} className="b-step">
                <span className="b-step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="b-section b-knowledge" aria-labelledby="serviceFaqTitle">
        <div className="b-container b-knowledge-wrap">
          <SectionHead
            eyebrow={t("nav.knowledge")}
            title={t("service.faqTitle", { topic: topicInText })}
            titleId="serviceFaqTitle"
            lead={t("service.faqLead")}
          />
          <div className="b-faq">
            {myFaqs.map((f, i) => (
              <details key={i} className="b-faq-item" name="service-faq">
                <summary>{f.question}</summary>
                <div className="b-faq-answer">
                  <p>{f.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="b-section b-reviews" aria-label={t("nav.reviews")}>
        <div className="b-container b-review-single">
          <figure className="b-review-card">
            <Stars label={t("common.stars")} />
            <blockquote>
              <p>{review.quote}</p>
            </blockquote>
            <figcaption>{review.author}</figcaption>
          </figure>
          <a className="b-text-link" href={site.googleReviewsUrl} rel="noopener" target="_blank">
            {t("reviews.allLink")}
            <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="b-section b-contact" id="contact" aria-labelledby="serviceContactTitle">
        <div className="b-container b-contact-wrap">
          <div className="b-contact-copy">
            <p className="b-eyebrow">{t("footer.contactTitle")}</p>
            <h2 id="serviceContactTitle">{t("contact.title")}</h2>
            <p className="b-lead">{t("service.contactLead", { topic: topicInText })}</p>
            <ul className="b-contact-list">
              <li>
                <PhoneIcon />
                <span>{t("contact.phone")}</span>
                <a href={phone.href}>{phone.display}</a>
              </li>
              <li>
                <WhatsAppIcon />
                <span>WhatsApp</span>
                <a href={whatsapp.href} rel="noopener" target="_blank">
                  {whatsapp.display}
                </a>
              </li>
            </ul>
          </div>
          <div className="b-contact-form">
            <h3>{t("contact.formTitle")}</h3>
            <ContactForm topics={contactTopics} defaultTopic={service.topic} />
          </div>
        </div>
      </section>

      <nav className="b-other-services" aria-label={t("service.others")}>
        <div className="b-container">
          <p className="b-domain-title">{t("service.others")}</p>
          <div className="b-domain-list">
            {others.map((s) => (
              <a key={s.id} className="b-domain-link" href={href(servicePath(s))}>
                <span aria-hidden="true" className="b-domain-icon">
                  <ServiceIcon name={s.icon} />
                </span>
                <span className="b-domain-label">{s.title}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </main>
  );
}
