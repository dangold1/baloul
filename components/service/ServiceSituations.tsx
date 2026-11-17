import { getContent } from "@/content/localized";
import type { Service } from "@/content/services";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ArrowIcon } from "@/components/ui/Icons";
import { SectionHead } from "@/components/ui/SectionHeading";

/** "Sounds familiar?": the situations that bring people to this service, each a link to the form. */
export function ServiceSituations({ lang, service }: { lang: Lang; service: Service }) {
  const { t } = makeI18n(lang);
  return (
    <section className="b-section b-situations" aria-labelledby="serviceSituationsTitle">
      <div className="b-container">
        <SectionHead eyebrow={t("service.situationsEyebrow")} title={t("service.situationsTitle")} titleId="serviceSituationsTitle" />
        <ul className="b-situation-list">
          {getContent(lang)
            .situationsFor(service.id)
            .map((s) => (
              <li key={s.text}>
                <a className="b-situation" href="#contact">
                  <span className="b-situation-text">{s.text}</span>
                  <span className="b-situation-link">
                    {t("service.situationLink")}
                    <ArrowIcon />
                  </span>
                </a>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
