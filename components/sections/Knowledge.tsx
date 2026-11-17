import { Section } from "@/components/layout/Section";
import { getContent } from "@/content/localized";
import { servicePath } from "@/content/services";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { SectionHead } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/blocks/FaqList";

/** General questions on the home page. Topic questions live on the service pages. name="knowledge" keeps one open at a time, natively. */
export function Knowledge({ lang }: { lang: Lang }) {
  const { t, href } = makeI18n(lang);
  const { homeFaqs, services } = getContent(lang);
  return (
    <Section id="knowledge" step={t("nav.knowledge")} className="b-section b-knowledge" labelledBy="knowledgeTitle">
      <div className="b-container b-knowledge-wrap">
        <SectionHead eyebrow={t("nav.knowledge")} title={t("knowledge.title")} titleId="knowledgeTitle" lead={t("knowledge.lead")} />
        <div>
          <FaqList faqs={homeFaqs} name="knowledge" />
          <p className="b-faq-more">
            {t("knowledge.byTopic")}{" "}
            {services.map((s, i) => (
              <span key={s.id}>
                <a href={href(servicePath(s))}>{s.title}</a>
                {i < services.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </Section>
  );
}
