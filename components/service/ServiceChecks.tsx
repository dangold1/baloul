import type { Service } from "@/content/services";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { SectionHead } from "@/components/ui/SectionHeading";

/** What we check: the service description beside its bullet list. */
export function ServiceChecks({ lang, service }: { lang: Lang; service: Service }) {
  return (
    <section className="b-section b-checks" aria-labelledby="checksTitle">
      <div className="b-container b-checks-grid">
        <div>
          <SectionHead eyebrow={makeI18n(lang).t("service.checksEyebrow")} title={service.checksHeading} titleId="checksTitle" lead={service.description} />
        </div>
        <ul className="b-checks-list">
          {service.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
