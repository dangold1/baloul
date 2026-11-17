"use client";

import { site } from "@/content/site";
import { contactLink } from "@/lib/contact";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function UtilityBar() {
  const { lang, t } = useLanguage();
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
