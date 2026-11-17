import { Section } from "@/components/layout/Section";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { ContactBlock } from "@/components/blocks/ContactBlock";

export function Contact({ lang }: { lang: Lang }) {
  const { t } = makeI18n(lang);
  return (
    <Section id="contact" step={t("nav.contact")} className="b-section b-contact" labelledBy="contactTitle">
      <ContactBlock
        lang={lang}
        titleId="contactTitle"
        title={t("contact.title")}
        lead={t("contact.lead")}
        show={["phone", "whatsapp", "email", "address"]}
        nextSteps
      />
    </Section>
  );
}
