"use client";

import { Section } from "@/components/layout/ActiveSection";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { contactTopics } from "@/content/services";
import { ContactForm } from "@/components/lead/ContactForm";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { contactLink } from "@/lib/contact";

export function Contact() {
  const { lang, t } = useLanguage();
  const [phone, whatsapp, email, address] = (["phone", "whatsapp", "email", "address"] as const).map((k) => contactLink(k, lang));
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
              <a href={phone.href}>{phone.display}</a>
            </li>
            <li>
              <WhatsAppIcon />
              <span>WhatsApp</span>
              <a href={whatsapp.href} rel="noopener" target="_blank">
                {whatsapp.display}
              </a>
            </li>
            <li>
              <MailIcon />
              <span>{t("contact.email")}</span>
              <a href={email.href}>{email.display}</a>
            </li>
            <li>
              <PinIcon />
              <span>{t("contact.office")}</span>
              <a href={address.href} rel="noopener" target="_blank">
                {address.display}
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
