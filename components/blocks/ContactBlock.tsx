import { getContent } from "@/content/localized";
import type { ContactKind } from "@/lib/contact";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ContactForm } from "@/components/lead/ContactForm";
import { ContactLinks } from "./ContactLinks";

type Props = {
  lang: Lang;
  titleId: string;
  title: string;
  lead: string;
  show: readonly ContactKind[];
  /** A service page preselects its own topic. */
  defaultTopic?: string;
  /** The "what happens next" list under the form (home page). */
  nextSteps?: boolean;
};

/** Contact details beside the lead form. The wrapping <section id="contact"> belongs to the caller. */
export function ContactBlock({ lang, titleId, title, lead, show, defaultTopic, nextSteps }: Props) {
  const { t } = makeI18n(lang);
  return (
    <div className="b-container b-contact-wrap">
      <div className="b-contact-copy">
        <p className="b-eyebrow">{t("footer.contactTitle")}</p>
        <h2 id={titleId}>{title}</h2>
        <p className="b-lead">{lead}</p>
        <ContactLinks lang={lang} show={show} />
      </div>
      <div className="b-contact-form">
        <h3>{t("contact.formTitle")}</h3>
        <ContactForm topics={getContent(lang).contactTopics} defaultTopic={defaultTopic} />
        {nextSteps && (
          <ol className="b-next-steps" aria-label={t("contact.nextLabel")}>
            <li>{t("contact.next1")}</li>
            <li>{t("contact.next2")}</li>
          </ol>
        )}
      </div>
    </div>
  );
}
