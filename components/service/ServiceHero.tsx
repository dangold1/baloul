import { getContent } from "@/content/localized";
import type { Service } from "@/content/services";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ButtonLink } from "@/components/ui/Button";

/** Crumbs, title, intro and the main button, beside a short facts panel. */
export function ServiceHero({ lang, service }: { lang: Lang; service: Service }) {
  const { t, href } = makeI18n(lang);
  const { site, googleRating } = getContent(lang);
  return (
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
          </div>
          <dl className="b-service-facts" aria-label={t("service.factsLabel")}>
            <div>
              <dt>{t("service.factActive")}</dt>
              <dd>{t("service.factSince", { year: site.foundedYear })}</dd>
            </div>
            <div>
              <dt>{googleRating.countLabel}</dt>
              <dd>{googleRating.score}</dd>
            </div>
            <div>
              <dt>{t("service.factOffice")}</dt>
              <dd>{t("service.street")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
