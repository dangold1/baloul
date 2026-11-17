"use client";

import { Section } from "@/components/layout/ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localizeService, services } from "@/content/services";
import { SectionHead } from "@/components/ui/SectionHeading";
import { ServiceCard } from "./ServiceCard";

export function Services() {
  const { lang, t } = useLanguage();
  return (
    <Section id="services" step={t("nav.services")} className="b-section b-solutions" labelledBy="servicesTitle">
      <div className="b-container">
        <SectionHead eyebrow={t("nav.services")} title={t("services.title")} titleId="servicesTitle" lead={t("services.lead")} />
        <div className="b-solution-list">
          {services.map((s) => (
            <ServiceCard key={s.id} service={localizeService(s, lang)} moreLabel={t("services.more")} />
          ))}
        </div>
      </div>
    </Section>
  );
}
