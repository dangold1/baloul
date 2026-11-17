"use client";

import { Section } from "@/components/layout/ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { site } from "@/content/site";
import { contactTopics } from "@/content/services";
import { ContactForm } from "@/components/lead/ContactForm";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { greetingFor, whatsappUrl } from "@/lib/whatsapp";

export function Contact() {
  const { lang, t } = useLanguage();
  return (
    <Section id="contact" step={t("nav.contact")} className="b-section b-contact" labelledBy="contactTitle">
      <div className="b-container b-contact-wrap">
        <div className="b-contact-copy">
          <p className="b-eyebrow">{t("footer.contactTitle")}</p>
          <h2 id="contactTitle">{t("contact.title")}</h2>
          <p className="b-lead">{t("contact.lead")}</p>
          <ul className="b-contact-list">
            <li>
              <PhoneIcon />
              <span>{t("contact.phone")}</span>
              <a href={site.phone.href}>{site.phone.display}</a>
            </li>
            <li>
              <WhatsAppIcon />
              <span>WhatsApp</span>
              <a href={whatsappUrl(greetingFor(lang))} rel="noopener" target="_blank">
                {site.whatsapp.display}
              </a>
            </li>
            <li>
              <MailIcon />
              <span>{t("contact.email")}</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <PinIcon />
              <span>{t("contact.office")}</span>
              <a href={site.address.mapsUrl} rel="noopener" target="_blank">
                {t("footer.address")}
              </a>
            </li>
          </ul>
        </div>
        <div className="b-contact-form">
          <h3>{t("contact.formTitle")}</h3>
          <ContactForm topics={contactTopics} />
          <ol className="b-next-steps" aria-label={t("contact.nextLabel")}>
            <li>{t("contact.next1")}</li>
            <li>{t("contact.next2")}</li>
          </ol>
        </div>
      </div>
    </Section>
  );
}
