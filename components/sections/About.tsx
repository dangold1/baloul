"use client";

import { Section } from "@/components/layout/ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { aboutParagraphs, aboutParagraphsEn, milestones, milestonesEn, principles, principlesEn } from "@/content/about";
import { site } from "@/content/site";
import { pick } from "@/lib/i18n/languages";
import { AboutLink } from "@/components/about/AboutLink";

/** Who we are. Keeps the #about-inline anchor that the mobile menu and the legal pages link to. */
export function About() {
  const { lang, t } = useLanguage();
  return (
    <Section id="about-inline" step={t("about.step")} className="b-section b-about" labelledBy="aboutSectionTitle">
      <div className="b-container b-about-grid">
        <div className="b-about-copy">
          <p className="b-eyebrow">{t("about.step")}</p>
          <h2 id="aboutSectionTitle">{t("about.title")}</h2>
          <p className="b-about-intro">
            <strong>BALOUL</strong> {t("about.intro", { founded: site.foundedYear, agency: site.agencyYear })}
          </p>
          {pick(lang, aboutParagraphs, aboutParagraphsEn).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <AboutLink className="b-text-link b-open-about">{t("about.more")}</AboutLink>
        </div>
        <div className="b-about-side">
          <ol className="b-timeline" aria-label={t("about.timelineLabel")}>
            {pick(lang, milestones, milestonesEn).map((m, i) => (
              <li key={i}>
                <span className="b-timeline-year">{m.year}</span>
                <span className="b-timeline-text">{m.text}</span>
              </li>
            ))}
          </ol>
          <ul className="b-principles">
            {pick(lang, principles, principlesEn).map((p, i) => (
              <li key={i}>
                <strong>{p.title}</strong>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
