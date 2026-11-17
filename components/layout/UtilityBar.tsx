"use client";

import { site } from "@/content/site";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function UtilityBar() {
  const { t } = useLanguage();
  return (
    <div className="b-utility">
      <div className="b-container b-utility-inner">
        <div className="b-utility-brand">{t("utility.since", { year: site.foundedYear, city: t("utility.city") })}</div>
        <div className="b-utility-links">
          <a href={site.phone.href}>{site.phone.display}</a>
          <a className="b-utility-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>
    </div>
  );
}
