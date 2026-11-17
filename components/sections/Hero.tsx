"use client";

import { StepRegion } from "@/components/layout/ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { site } from "@/content/site";
import { googleRating } from "@/content/reviews";
import { PhoneIcon } from "@/components/ui/Icons";

const yearsActive = new Date().getFullYear() - site.foundedYear;

export function Hero() {
  const { t } = useLanguage();
  /** Facts only. Each one can be checked by the visitor. */
  const facts = [
    { value: googleRating.score, label: t("hero.factRating"), stars: true },
    { value: String(site.foundedYear), label: t("hero.factYears", { years: yearsActive }) },
    { value: String(site.agencyYear), label: t("hero.factAgency") },
  ];
  return (
    <StepRegion step="top" label={t("nav.home")} className="b-hero" labelledBy="heroTitle">
      <div className="b-container b-hero-grid">
        <div className="b-hero-copy">
          <p className="b-kicker">{t("hero.kicker")}</p>
          <h1 id="heroTitle">
            {t("hero.title")} <span className="b-nowrap">{t("hero.titleSince", { year: site.foundedYear })}</span>
          </h1>
          <p className="b-hero-lead">{t("hero.lead")}</p>
          <div className="b-hero-actions">
            <a className="b-btn b-btn-primary" href="#contact">
              {t("common.cta")}
            </a>
          </div>
          <p className="b-hero-call">
            <PhoneIcon />
            {t("hero.call")} <a href={site.phone.href}>{site.phone.display}</a>
          </p>
          <dl className="b-facts" aria-label={t("hero.factsLabel")}>
            {facts.map((f) => (
              <div key={f.value} className="b-fact">
                <dt>{f.label}</dt>
                <dd>
                  {f.value}
                  {f.stars ? (
                    <span className="b-fact-stars" role="img" aria-label={t("common.stars")}>
                      ★★★★★
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="b-hero-visual">
          <img
            alt={t("hero.imageAlt")}
            src={site.images.hero.src}
            srcSet={`/images/hero-800.webp 800w, ${site.images.hero.src} ${site.images.hero.width}w`}
            sizes="(max-width: 979px) 100vw, 620px"
            width={site.images.hero.width}
            height={site.images.hero.height}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </StepRegion>
  );
}
