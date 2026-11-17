import type { Service } from "@/content/services";
import { servicePath } from "@/content/services";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ArrowIcon } from "@/components/ui/Icons";
import { ServiceEmblem } from "@/components/ui/ServiceEmblem";

/** Home page list row: icon, title, one short line, and a "more" arrow. The whole row is the link. */
export function ServiceCard({ lang, service, moreLabel }: { lang: Lang; service: Service; moreLabel: string }) {
  return (
    <a className="b-solution" id={service.id} href={makeI18n(lang).href(servicePath(service))}>
      <span aria-hidden="true" className="b-solution-icon">
        <ServiceEmblem name={service.icon} />
      </span>
      <div className="b-solution-body">
        <h3>{service.title}</h3>
        {/* Desktop shows the full text; phones show the short line so the four rows fit one screen. */}
        <p className="b-solution-summary b-solution-summary-full">{service.summary}</p>
        <p className="b-solution-summary b-solution-summary-short">{service.tagline}</p>
      </div>
      <span className="b-solution-more">
        <span className="b-solution-more-label">{moreLabel}</span>
        <span aria-hidden="true" className="b-solution-arrow">
          <ArrowIcon />
        </span>
      </span>
    </a>
  );
}
