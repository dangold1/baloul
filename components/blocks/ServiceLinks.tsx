import { getContent } from "@/content/localized";
import { servicePath } from "@/content/services";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ServiceIcon } from "@/components/ui/Icons";

/** A strip of links to the service pages, without the one given in `exclude`. */
export function ServiceLinks({ lang, exclude, title }: { lang: Lang; exclude?: string; title: string }) {
  const { href } = makeI18n(lang);
  const others = getContent(lang).services.filter((s) => s.id !== exclude);
  return (
    <nav className="b-other-services" aria-label={title}>
      <div className="b-container">
        <p className="b-domain-title">{title}</p>
        <div className="b-domain-list">
          {others.map((s) => (
            <a key={s.id} className="b-domain-link" href={href(servicePath(s))}>
              <span aria-hidden="true" className="b-domain-icon">
                <ServiceIcon name={s.icon} />
              </span>
              <span className="b-domain-label">{s.title}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
