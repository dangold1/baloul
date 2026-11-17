"use client";

import { Section } from "@/components/layout/ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { steps, stepsEn } from "@/content/journey";
import { pick } from "@/lib/i18n/languages";
import { SectionHead } from "@/components/ui/SectionHeading";

export function Process() {
  const { lang, t } = useLanguage();
  return (
    <Section id="process" step={t("nav.process")} className="b-section b-process" labelledBy="processTitle">
      <div className="b-container">
        <SectionHead eyebrow={t("process.eyebrow")} title={t("process.title")} titleId="processTitle" lead={t("process.lead")} />
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
        <div className="b-process-cta">
          <a className="b-btn b-btn-primary" href="#contact">
            {t("common.cta")}
          </a>
          <span>{t("process.note")}</span>
        </div>
      </div>
    </Section>
  );
}
