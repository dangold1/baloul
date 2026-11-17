import { services, servicePath } from "@/content/services";
import { ServiceIcon } from "@/components/ui/Icons";

/** Quick access to the four service pages, right under the hero. */
export function DomainNav() {
  return (
    <nav aria-label="תחומי פעילות" className="b-domain-nav">
      <div className="b-container">
        <p className="b-domain-title">במה נוכל לעזור?</p>
        <div className="b-domain-list">
          {services.map((s) => (
            <a key={s.id} className="b-domain-link" href={servicePath(s)}>
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
