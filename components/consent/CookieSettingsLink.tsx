"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";
import { T } from "@/components/ui/Typography";

/** Footer link that reopens the consent choice. */
export function CookieSettingsLink() {
  return (
    <a
      href="#cookies"
      data-no-scroll=""
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
      }}
    >
      <T k="footer.cookies" />
    </a>
  );
}
