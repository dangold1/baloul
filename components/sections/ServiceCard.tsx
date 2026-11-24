import type { Service } from "@/content/services";
import { servicePath } from "@/content/services";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ArrowIcon, ServiceIcon } from "@/components/ui/Icons";

/**
 * Home page service card: gold icon, title, one short line, and a "more" arrow. The whole card is the link.
 * Wide screens show the card photo instead of the line and the arrow; the photo is decorative and lazy-loaded
 * (hidden on phones, so it is never fetched there).
 */
export function ServiceCard({ lang, service, moreLabel }: { lang: Lang; service: Service; moreLabel: string }) {
  return (
    <a className="b-solution" id={service.id} href={makeI18n(lang).href(servicePath(service))}>
      <span aria-hidden="true" className="b-solution-icon">
        <ServiceIcon name={service.icon} />
      </span>
      <div className="b-solution-body">
        <h3>{service.title}</h3>
        <p className="b-solution-summary">{service.tagline}</p>
      </div>
      <span className="b-solution-more">
        <span className="b-solution-more-label">{moreLabel}</span>
        <span aria-hidden="true" className="b-solution-arrow">
          <ArrowIcon />
        </span>
      </span>
      <span aria-hidden="true" className="b-solution-photo">
        <img src={service.image} alt="" width={640} height={300} loading="lazy" decoding="async" />
      </span>
    </a>
  );
}
