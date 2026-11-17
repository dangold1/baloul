import { contactLink } from "@/lib/contact";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";
import { PhoneIcon } from "@/components/ui/Icons";

/** "Prefer to talk? 0X-XXXXXXX" under a hero's main button. */
export function CallLine({ lang }: { lang: Lang }) {
  const phone = contactLink("phone", lang);
  return (
    <p className="b-hero-call">
      <PhoneIcon />
      {makeI18n(lang).t("hero.call")} <a href={phone.href}>{phone.display}</a>
    </p>
  );
}
