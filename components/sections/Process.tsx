import { Section } from "@/components/layout/Section";
import { getContent } from "@/content/localized";
import { sectionHref } from "@/content/sections";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/SectionHeading";
import { StepsList } from "@/components/blocks/StepsList";

export function Process({ lang }: { lang: Lang }) {
  const { t } = makeI18n(lang);
  return (
    <Section id="process" step={t("nav.process")} className="b-section b-process" labelledBy="processTitle">
      <div className="b-container">
        <SectionHead eyebrow={t("process.eyebrow")} title={t("process.title")} titleId="processTitle" lead={t("process.lead")} />
        <StepsList steps={getContent(lang).steps} />
        <div className="b-process-cta">
          <ButtonLink href={sectionHref("contact")}>{t("common.cta")}</ButtonLink>
          <span>{t("process.note")}</span>
        </div>
      </div>
    </Section>
  );
}
