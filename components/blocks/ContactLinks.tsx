import type { DictKey } from "@/content/dictionary";
import { contactLink, type ContactKind } from "@/lib/contact";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";

const rows: Record<ContactKind, { Icon: typeof PhoneIcon; label: DictKey | null }> = {
  phone: { Icon: PhoneIcon, label: "contact.phone" },
  whatsapp: { Icon: WhatsAppIcon, label: null },
  email: { Icon: MailIcon, label: "contact.email" },
  address: { Icon: PinIcon, label: "contact.office" },
};

/** The ways to reach the office, in the order given. External links open in a new tab. */
export function ContactLinks({ lang, show }: { lang: Lang; show: readonly ContactKind[] }) {
  const { t } = makeI18n(lang);
  return (
    <ul className="b-contact-list">
      {show.map((kind) => {
        const { Icon, label } = rows[kind];
        const link = contactLink(kind, lang);
        return (
          <li key={kind}>
            <Icon />
            <span>{label ? t(label) : "WhatsApp"}</span>
            <a href={link.href} rel={link.external ? "noopener" : undefined} target={link.external ? "_blank" : undefined}>
              {link.display}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
