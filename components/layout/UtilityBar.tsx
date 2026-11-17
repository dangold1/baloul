import { site } from "@/content/site";
import { contactLink } from "@/lib/contact";
import { makeI18n } from "@/lib/i18n/i18n";
import type { Lang } from "@/lib/i18n/languages";

export function UtilityBar({ lang }: { lang: Lang }) {
  const { t } = makeI18n(lang);
  const phone = contactLink("phone", lang);
  const email = contactLink("email", lang);
  return (
    <div className="b-utility">
      <div className="b-container b-utility-inner">
        <div className="b-utility-brand">{t("utility.since", { year: site.foundedYear, city: t("utility.city") })}</div>
        <div className="b-utility-links">
          <a href={phone.href}>{phone.display}</a>
          <a className="b-utility-email" href={email.href}>
            {email.display}
          </a>
        </div>
      </div>
    </div>
  );
}
