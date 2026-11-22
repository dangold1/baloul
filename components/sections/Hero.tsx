import { StepRegion } from "@/components/layout/Section";
import { getContent } from "@/content/localized";
import { sectionHref } from "@/content/sections";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ButtonLink } from "@/components/ui/Button";
import { CallLine } from "@/components/blocks/CallLine";

export function Hero({ lang }: { lang: Lang }) {
  const { t } = makeI18n(lang);
  const { site } = getContent(lang);
  const { hero } = site.images;
  return (
    <StepRegion step="top" label={t("nav.home")} className="b-hero" labelledBy="heroTitle">
      <div className="b-container b-hero-grid">
        <div className="b-hero-copy">
          <p className="b-kicker">{t("hero.kicker")}</p>
          <h1 id="heroTitle">{t("hero.title")} <span className="b-nowrap">{t("hero.titleSince", { year: site.foundedYear })}</span></h1>
          <p className="b-hero-lead">{t("hero.lead")}</p>
          <div className="b-hero-actions">
            <ButtonLink href={sectionHref("contact")}>{t("common.cta")}</ButtonLink>
            <ButtonLink variant="secondary" href={sectionHref("services")}>{t("hero.ctaServices")}</ButtonLink>
          </div>
          <CallLine lang={lang} />
        </div>
        <div className="b-hero-visual">
          <picture>
            {/* Wide screens: the photo prebuilt inside the reference frame (extended office, frosted glass), one per language. */}
            <source media="(min-width: 980px)" srcSet={`/images/hero-frame-${lang}.webp`} width={1712} height={1384} />
            <img alt={t("hero.imageAlt")} src={hero.src} srcSet={`/images/hero-800.webp 800w, ${hero.src} ${hero.width}w`} sizes="(max-width: 979px) 100vw, 620px" width={hero.width} height={hero.height} fetchPriority="high" decoding="async" />
          </picture>
        </div>
      </div>
    </StepRegion>
  );
}
