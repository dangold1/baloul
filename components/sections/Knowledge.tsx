"use client";

import { Section } from "@/components/layout/ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { homeFaqs, localizeFaq } from "@/content/faq";
import { localizeService, services, servicePath } from "@/content/services";
import { SectionHead } from "@/components/ui/SectionHeading";

/** General questions on the home page. Topic questions live on the service pages. name="knowledge" keeps one open at a time, natively. */
export function Knowledge() {
  const { lang, t, href } = useLanguage();
  return (
    <Section id="knowledge" step={t("nav.knowledge")} className="b-section b-knowledge" labelledBy="knowledgeTitle">
      <div className="b-container b-knowledge-wrap">
        <SectionHead eyebrow={t("nav.knowledge")} title={t("knowledge.title")} titleId="knowledgeTitle" lead={t("knowledge.lead")} />
        <div>
          <div className="b-faq">
            {homeFaqs.map((faq, i) => {
              const f = localizeFaq(faq, lang);
              return (
                <details key={i} className="b-faq-item" name="knowledge">
                  <summary>{f.question}</summary>
                  <div className="b-faq-answer">
                    <p>{f.answer}</p>
                  </div>
                </details>
              );
            })}
          </div>
          <p className="b-faq-more">
            {t("knowledge.byTopic")}{" "}
            {services.map((s, i) => (
              <span key={s.id}>
                <a href={href(servicePath(s))}>{localizeService(s, lang).title}</a>
                {i < services.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </Section>
  );
}
