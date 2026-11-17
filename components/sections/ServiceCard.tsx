import type { Service } from "@/content/services";
import { servicePath } from "@/content/services";
import { ArrowIcon } from "@/components/ui/Icons";
import { ServiceEmblem } from "@/components/ui/ServiceEmblem";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Home page list row: icon, title, one short line, and a "more" arrow. The whole row is the link. */
export function ServiceCard({ service, moreLabel }: { service: Service; moreLabel: string }) {
  const { href } = useLanguage();
  return (
    <a className="b-solution" id={service.id} href={href(servicePath(service))}>
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
