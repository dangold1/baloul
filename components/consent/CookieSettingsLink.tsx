"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Footer link that reopens the consent choice. */
export function CookieSettingsLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#cookies"
      data-no-scroll=""
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
      }}
    >
      {t("footer.cookies")}
    </a>
  );
}
