import { Section } from "@/components/layout/Section";
import { getContent } from "@/content/localized";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { SectionHead } from "@/components/ui/SectionHeading";
import { ServiceCard } from "./ServiceCard";

export function Services({ lang }: { lang: Lang }) {
  const { t } = makeI18n(lang);
  return (
    <Section id="services" step={t("nav.services")} className="b-section b-solutions" labelledBy="servicesTitle">
      <div className="b-container">
        <SectionHead eyebrow={t("nav.services")} title={t("services.title")} titleId="servicesTitle" lead={t("services.lead")} />
        <div className="b-solution-list">
          {getContent(lang).services.map((s) => (
            <ServiceCard key={s.id} lang={lang} service={s} moreLabel={t("services.more")} />
          ))}
        </div>
      </div>
    </Section>
  );
}
