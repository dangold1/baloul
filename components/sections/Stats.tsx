import { getContent } from "@/content/localized";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { AwardIcon, CalendarIcon, StarIcon } from "@/components/ui/Icons";
import { Stars } from "@/components/ui/Stars";

/** The teal band under the services. Facts only: each one can be checked by the visitor. Not a stepper step. */
export function Stats({ lang }: { lang: Lang }) {
  const { t } = makeI18n(lang);
  const { site, googleRating } = getContent(lang);
  const facts = [
    { icon: <StarIcon />, value: googleRating.score, label: t("hero.factRating"), stars: true },
    { icon: <CalendarIcon />, value: String(site.foundedYear), label: t("hero.factYears", { years: new Date().getFullYear() - site.foundedYear }) },
    { icon: <AwardIcon />, value: String(site.agencyYear), label: t("hero.factAgency") },
  ];
  return (
    <div className="b-stats">
      <svg className="b-stats-hills" aria-hidden="true" focusable="false" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path opacity=".45" d="M0 125Q90 70 180 85T360 105T540 45T720 100T900 60T1080 110T1260 55T1440 80V200H0Z" />
        <path opacity=".9" d="M0 175Q110 125 220 135T440 160T660 115T880 165T1100 130T1320 170T1440 150V200H0Z" />
        <path className="b-stats-arc" d="M900 200C1050 60 1300 20 1440 40" />
      </svg>
      <div className="b-container">
        <dl className="b-facts" aria-label={t("hero.factsLabel")}>
          {facts.map((f) => (
            <div key={f.value} className="b-fact">
              <dt>{f.label}</dt>
              <dd>
                <span className="b-fact-icon">{f.icon}</span>
                {f.value}
                {f.stars ? <Stars as="span" className="b-fact-stars" label={t("common.stars")} /> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
